import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const removed = [
  ...['atendente-de-ia', 'campanha-que-vira-venda', 'chatbot-com-ia', 'construtor-de-conversas', 'plataforma-de-atendimento', 'whatsapp-multiusuario'].flatMap(name => [1, 2].map(version => `/lp/${name}-${version}`)),
  '/crm-vendas-sdr', '/dif-competitivos', '/solucao-tecnica',
  '/infoprodutores/comparecimento', '/infoprodutores/funil-conversacional', '/infoprodutores/reativacao-base',
  ...['', '/en', '/es'].flatMap(prefix => ['conversations', 'for-enterprise', 'pricing', 'expansion'].map(name => `${prefix}/${name}`)),
];
const active = ['/', '/sales', '/support', '/operations', '/teams', '/blog', '/_astro/example.js', '/lp/prints/conversa-anuncio.png', '/solucao/crm-whatsapp-ia', '/solucao/agente-ia-atendimento', '/infoprodutores/recuperacao-carrinho', '/partners', '/partners/discover', '/partners/result', '/partners/onboarding'];
let worker;
let invocationRoutes;

before(async () => {
  try { worker = (await import('../../public/_worker.js')).default; }
  catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
  try { invocationRoutes = JSON.parse(await readFile(new URL('../../public/_routes.json', import.meta.url))); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
});

const assets = {
  async fetch(input) {
    const path = new URL(input instanceof Request ? input.url : input).pathname;
    return new Response(path.endsWith('/404') ? `<h1>Not found: ${path}</h1>` : 'OLD_PAGE_OR_ACTIVE_ASSET', {
      headers: { 'Content-Type': 'text/html', 'Cache-Control': 'public, s-maxage=604800' },
    });
  },
};

test('removed URLs permanently redirect home, including ad queries and file aliases', async () => {
  assert.ok(worker, 'An explicit retirement handler must exist');
  for (const host of ['yapt.ai', 'www.yapt.ai']) for (const path of removed) {
    for (const suffix of ['', '/', '.html', '?utm_source=google&gclid=review']) {
      const response = await worker.fetch(new Request(`https://${host}${path}${suffix}`), { ASSETS: assets });
      assert.equal(response.status, 301, `${host}${path}${suffix}`);
      const locale = path.startsWith('/en/') ? '/en' : path.startsWith('/es/') ? '/es' : '';
      const query = suffix.startsWith('?') ? suffix : '';
      assert.equal(response.headers.get('Location'), `https://yapt.ai${locale || '/'}${query}`);
      assert.match(response.headers.get('Cache-Control'), /no-store/);
      assert.equal(response.headers.get('X-Robots-Tag'), null);
      assert.doesNotMatch(await response.text(), /OLD_PAGE_OR_ACTIVE_ASSET/);
    }
  }
});

test('localized URLs redirect directly to their localized home', async () => {
  assert.ok(worker);
  for (const [path, home] of [['/pricing', '/'], ['/en/pricing', '/en'], ['/es/pricing', '/es']]) {
    const response = await worker.fetch(new Request(`https://yapt.ai${path}`), { ASSETS: assets });
    assert.equal(response.headers.get('Location'), `https://yapt.ai${home}`);
  }
});

test('HEAD reports the permanent redirect with no response body', async () => {
  assert.ok(worker);
  const response = await worker.fetch(new Request('https://yapt.ai/pricing', { method: 'HEAD' }), { ASSETS: assets });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('Location'), 'https://yapt.ai/');
  assert.equal(await response.text(), '');
});

test('active pages, campaigns, partner flow and assets preserve the static response', async () => {
  assert.ok(worker);
  for (const path of active) {
    const response = await worker.fetch(new Request(`https://yapt.ai${path}`), { ASSETS: assets });
    assert.equal(response.status, 200, path);
    assert.equal(await response.text(), 'OLD_PAGE_OR_ACTIVE_ASSET', path);
  }
});

test('only the removed paths and their slash/html aliases invoke the function', () => {
  assert.ok(invocationRoutes, 'Explicit invocation scope must exist');
  assert.equal(invocationRoutes.version, 1);
  assert.deepEqual(invocationRoutes.exclude, []);
  const expected = removed.flatMap(path => [path, `${path}/`, `${path}.html`]);
  assert.deepEqual([...invocationRoutes.include].sort(), expected.sort());
  assert.ok(invocationRoutes.include.length < 100);
  for (const path of active) assert.ok(!invocationRoutes.include.includes(path), path);
});

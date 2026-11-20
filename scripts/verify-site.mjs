import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root = resolve(process.argv[2] || 'dist');
const site = 'https://yapt.ai';
const core = ['/', '/marketing-site', '/sales', '/support', '/operations', '/intelligence', '/automations', '/teams'];
const images = new Set();

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(join(directory, entry.name)) : [join(directory, entry.name)]));
  return groups.flat();
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
}

function inspect(html) {
  const meta = Object.fromEntries([...html.matchAll(/<meta\b[^>]*>/g)].map(match => {
    const values = attributes(match[0]);
    return [values.property || values.name || values['http-equiv'], values.content];
  }));
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0]));
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  return { meta, links, schemas, title: html.match(/<title>(.*?)<\/title>/)?.[1] || '' };
}

function pageFile(url) {
  const path = new URL(url, site).pathname.replace(/\/$/, '');
  return join(root, path ? `${path.slice(1)}.html` : 'index.html');
}

async function verifyImage(page, meta) {
  const url = new URL(meta['og:image']);
  assert.equal(url.protocol, 'https:', `${page}: imagem deve usar HTTPS`);
  assert.ok(meta['og:image:alt'] && meta['twitter:image:alt'], `${page}: descrição da imagem ausente`);
  assert.equal(meta['twitter:image'], meta['og:image'], `${page}: imagem social divergente`);
  if (url.origin !== site || images.has(url.pathname)) return;
  const file = join(root, url.pathname.slice(1));
  await access(file);
  const data = await sharp(file).metadata();
  assert.equal(String(data.width), meta['og:image:width'], `${page}: largura social incorreta`);
  assert.equal(String(data.height), meta['og:image:height'], `${page}: altura social incorreta`);
  assert.equal(data.width, 1200, `${page}: cartão social deve ter1200px`);
  assert.equal(data.height, 630, `${page}: cartão social deve ter630px`);
  images.add(url.pathname);
}

function verifyFaq(page, html, schemas) {
  for (const schema of schemas.filter(item => item['@type'] === 'FAQPage')) {
    for (const item of schema.mainEntity) {
      const question = item.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      assert.ok(html.includes(question), `${page}: pergunta estruturada não aparece no conteúdo`);
      assert.ok(item.acceptedAnswer?.text?.length, `${page}: resposta estruturada vazia`);
    }
  }
}

function verifyPositioning(page, html, title, meta) {
  const path = new URL(page).pathname.replace(/^\/(en|es)(?=\/|$)/, '') || '/';
  if (!core.includes(path)) return;
  assert.ok(title.length <= 70, `${page}: título excessivamente longo`);
  assert.ok(meta.description?.length > 50 && meta.description.length <= 170, `${page}: descrição inadequada`);
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, ' ') || '';
  assert.match(`${title} ${heading}`, /intelig[eê]ncia artificial|artificial intelligence|inteligencia artificial|\bIA\b|\bAI\b/i, `${page}: posicionamento de IA ausente`);
  if (path === '/sales') assert.match(html, /CRM[^<.]{0,80}WhatsApp|WhatsApp CRM/i, `${page}: categoria CRM no WhatsApp ausente`);
}

async function verifyPages(redirects) {
  const redirected = new Set(redirects.map(line => line.split(/\s+/)[0]));
  const pages = new Set();
  for (const file of (await filesIn(root)).filter(path => path.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    const data = inspect(html);
    if (data.meta.refresh || /noindex/i.test(data.meta.robots || '')) continue;
    const relative = file.slice(root.length).replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
    if (redirected.has(relative)) continue;
    const canonical = data.links.find(link => link.rel === 'canonical')?.href;
    assert.equal(canonical, `${site}${relative === '/' ? '' : relative}`, `${relative}: canonical incorreto`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${relative}: deve existir um H1`);
    for (const link of data.links.filter(link => link.hreflang)) await access(pageFile(link.href));
    await verifyImage(canonical, data.meta);
    verifyFaq(canonical, html, data.schemas);
    verifyPositioning(canonical, html, data.title, data.meta);
    pages.add(canonical);
  }
  return pages;
}

async function main() {
  const redirectText = await readFile(join(root, '_redirects'), 'utf8');
  const redirects = redirectText.split(/\r?\n/).filter(line => line && !line.startsWith('#'));
  const pages = await verifyPages(redirects);
  const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]));
  assert.deepEqual([...listed].sort(), [...pages].sort(), 'Sitemap deve conter exatamente as páginas indexáveis');
  assert.ok([...listed].some(url => url.includes('/blog/')), 'Os artigos publicados desapareceram');
  for (const path of core) for (const prefix of ['', '/en', '/es']) assert.ok(listed.has(`${site}${prefix}${path === '/' ? '' : path}`), `Página principal ausente: ${prefix}${path}`);
  assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/yapt.ai\/sitemap.xml/);
  assert.doesNotMatch(await readFile(join(root, '_headers'), 'utf8'), /X-Robots-Tag:\s*noindex/i, 'Produção não pode herdar noindex da prévia');
  console.log(JSON.stringify({ pages: pages.size, articles: [...listed].filter(url => url.includes('/blog/')).length, socialImages: images.size, redirects: redirects.length, status: 'passed' }));
}

await main();

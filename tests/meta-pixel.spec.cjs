const { test, expect } = require('@playwright/test');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const origin = 'http://127.0.0.1:4329';
const pixelId = '26923785453912756';
const paths = ['/', '/sales', '/blog', '/solucao/crm-whatsapp-ia', '/solucao/agente-ia-atendimento', '/infoprodutores/recuperacao-carrinho'];

async function calls(page) {
  return page.evaluate(() => Array.from(window.fbq?.queue || [], args => Array.from(args)));
}

test.beforeEach(async ({ page }) => {
  await page.route('https://connect.facebook.net/**', route => route.fulfill({ body: '' }));
  await page.route('https://www.facebook.com/**', route => route.fulfill({ body: '' }));
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ body: '' }));
  await page.route('https://snap.licdn.com/**', route => route.fulfill({ body: '' }));
  await page.route('https://cdn.yapt.ai/**', route => route.fulfill({ body: '' }));
  await page.route('**/functions/v1/**', route => route.abort());
});

for (const path of paths) {
  test(`pixel waits for consent and starts exactly once on ${path}`, async ({ page }) => {
    const scripts = [];
    page.on('request', request => { if (request.url().includes('fbevents.js')) scripts.push(request.url()); });
    const response = await page.goto(origin + path);
    expect(response.status()).toBe(200);
    await expect(page.getByRole('button', { name: 'Aceitar cookies', exact: true })).toBeVisible();
    expect(scripts).toHaveLength(0);
    expect(await calls(page)).toEqual([]);
    await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
    await expect.poll(() => scripts.length).toBe(1);
    expect((await calls(page)).filter(args => args[0] === 'init')).toEqual([['init', pixelId]]);
    expect((await calls(page)).filter(args => args[0] === 'trackSingle' && args[2] === 'PageView')).toEqual([['trackSingle', pixelId, 'PageView']]);
    expect(await calls(page)).toContainEqual(['set', 'autoConfig', false, pixelId]);
    await page.evaluate(() => window.yaptMarketingConsent.set(true));
    expect(scripts).toHaveLength(1);
    expect((await calls(page)).filter(args => args[0] === 'trackSingle' && args[2] === 'PageView')).toHaveLength(1);
  });
}

test('managing cookies allows refusing advertising and remembers the choice', async ({ page }) => {
  await page.goto(origin);
  await page.getByRole('button', { name: 'Gerenciar preferências', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Preferências de cookies' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Cookies de publicidade' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click();
  expect(await calls(page)).toEqual([]);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Aceitar cookies', exact: true })).not.toBeVisible();
  expect(await calls(page)).toEqual([]);
  await expect(page.getByRole('button', { name: 'Preferências de cookies', exact: true })).toBeVisible();
});

test('revoking consent stops later conversions and sends revoke to Meta', async ({ page }) => {
  await page.goto(origin);
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  await page.evaluate(() => window.yaptMetaPixel.trackLead());
  expect((await calls(page)).filter(args => args[2] === 'Lead')).toHaveLength(1);
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Cookies de publicidade' }).uncheck();
  await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click();
  await page.evaluate(() => window.yaptMetaPixel.trackLead());
  expect((await calls(page)).filter(args => args[2] === 'Lead')).toHaveLength(1);
  expect(await calls(page)).toContainEqual(['consent', 'revoke']);
});

test('storage failures leave the site usable without assuming consent', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  await page.goto(origin);
  await expect(page.locator('h1')).toBeVisible();
  expect(await calls(page)).toEqual([]);
  await page.getByRole('button', { name: 'Gerenciar preferências', exact: true }).click();
  await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click();
  expect(await calls(page)).toEqual([]);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Aceitar cookies', exact: true })).toBeVisible();
  expect(await calls(page)).toEqual([]);
});

test('event payloads do not contain personal data', async ({ page }) => {
  await page.goto(origin + '/solucao/crm-whatsapp-ia');
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  await page.evaluate(() => window.yaptMetaPixel.trackLead({ name: 'Nome privado', phone: '5511999999999', email: 'privado@example.test' }));
  const payload = JSON.stringify(await calls(page));
  expect(payload).not.toContain('Nome privado');
  expect(payload).not.toContain('5511999999999');
  expect(payload).not.toContain('privado@example.test');
});

test('consent panel fits a narrow mobile screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(origin);
  await page.getByRole('button', { name: 'Gerenciar preferências', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Preferências de cookies' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('a sensitive query blocks vendor loading while the page remains usable', async ({ page }) => {
  const scripts = [];
  page.on('request', request => { if (/facebook|googletagmanager|licdn/.test(request.url())) scripts.push(request.url()); });
  await page.goto(origin + '/solucao/crm-whatsapp-ia?email=privado%40example.test');
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  await expect(page.locator('h1')).toBeVisible();
  expect(await calls(page)).toEqual([]);
  expect(scripts).toEqual([]);
});

test('a sensitive referrer blocks Meta even on a clean landing URL', async ({ page }) => {
  await page.goto(origin + '/sales', { referer: origin + '/origem?token=privado' });
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  expect(await calls(page)).toEqual([]);
});

for (const query of [
  'emailAddress=person%40example.test', 'auth_code=secret', 'cpf=12345678900',
  'utm_content=person%40example.test', 'api_key=secret', 'full_name=Pessoa',
  'access-token=secret', 'contact_phone=5511999999999',
  'utm_term=person%2540example.test',
]) test(`personal or secret query stays outside vendor measurement: ${query.split('=')[0]}`, async ({ page }) => {
  await page.goto(origin + '/sales?' + query);
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  expect(await calls(page)).toEqual([]);
  await expect(page.locator('h1')).toBeVisible();
});

test('ordinary campaign parameters still allow consented measurement', async ({ page }) => {
  await page.goto(origin + '/sales?utm_source=google&utm_medium=cpc&utm_campaign=ia-vendas&utm_content=criativo-a&gad_campaignid=24282362831&gclid=click-test');
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  expect((await calls(page)).filter(args => args[2] === 'PageView')).toHaveLength(1);
});

test('revocation in another tab applies without a storage write loop', async ({ page, context }) => {
  await page.goto(origin);
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  const other = await context.newPage();
  await other.goto(origin + '/sales');
  await other.evaluate(() => window.yaptMarketingConsent.set(false));
  await expect.poll(() => page.evaluate(() => window.yaptMarketingConsent.isGranted())).toBe(false);
  expect(await calls(page)).toContainEqual(['consent', 'revoke']);
  expect(await other.evaluate(() => window.yaptMarketingConsent.isGranted())).toBe(false);
  await other.close();
});

test('advertising click cookies are stored only after consent and cleared on refusal', async ({ page, context }) => {
  await page.goto(origin + '/solucao/crm-whatsapp-ia?gclid=google-test&gbraid=braid-test&wbraid=web-test&fbclid=meta-test');
  expect((await context.cookies()).filter(cookie => /yapt_(gclid|gbraid|wbraid|fbclid)/.test(cookie.name))).toEqual([]);
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  await expect.poll(async () => (await context.cookies()).filter(cookie => /yapt_(gclid|gbraid|wbraid|fbclid)/.test(cookie.name)).length).toBe(4);
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Cookies de publicidade' }).uncheck();
  await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click();
  expect((await context.cookies()).filter(cookie => /yapt_(gclid|gbraid|wbraid|fbclid)/.test(cookie.name))).toEqual([]);
});

test('the home contact form confirms one Lead without depending on the campaign LP', async ({ page }) => {
  await page.route('https://cdn.yapt.ai/wa-button.js', route => route.fulfill({ contentType: 'application/javascript', body: readFileSync(path.join(__dirname, '../public/wa-button.js'), 'utf8') }));
  await page.route('**/functions/v1/widget-api?**', route => route.fulfill({ json: { success: true, data: { is_active: true, wa_button_phone: '5511000000000', wa_button_message: 'teste', wa_button_capture_fields: ['phone', 'name', 'email'] } } }));
  let submissions = 0;
  await page.route('**/functions/v1/webhook-widget', route => { submissions++; return route.fulfill({ json: { success: true } }); });
  await page.goto(origin);
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  await page.locator('#yapt-wa-button').waitFor();
  await page.evaluate(() => { window.open = () => null; });
  await page.locator('#yapt-wa-button').click();
  await page.locator('input[name=phone]').fill('5511999999999');
  await page.locator('button[type=submit]').click();
  await expect.poll(async () => (await calls(page)).filter(args => args[2] === 'Lead').length).toBe(1);
  expect(submissions).toBe(1);
  // The generic widget keeps its original UX instead of the campaign adapter's
  // messages and immediate-navigation behavior.
  expect(await page.evaluate(() => window.dataLayer.filter(item => item.event === 'lp_whatsapp_lead'))).toEqual([]);
  await expect(page.locator('[data-capture-status]')).toHaveCount(0);
});

test('contact observation preserves the response and ignores failed or unrelated submissions', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeFetch = window.fetch;
    window.fetch = function () {
      const promise = nativeFetch.apply(this, arguments);
      window.lastOriginalFetchPromise = promise;
      return promise;
    };
  });
  await page.route('**/functions/v1/webhook-widget', route => {
    const request = route.request().postDataJSON();
    return route.fulfill({ json: { success: request.action !== 'wa_button_submit', original: 'kept' } });
  });
  await page.goto(origin);
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  const returned = await page.evaluate(async () => {
    const url = 'https://vkrwduoawdhsbkoufurl.supabase.co/functions/v1/webhook-widget';
    const promise = fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'wa_button_submit', instanceId: 'a28b6328-6021-4b00-8d2b-af875173ec4b', phone: '5511999999999' }) });
    const samePromise = promise === window.lastOriginalFetchPromise;
    const data = await (await promise).json();
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'other_action', instanceId: 'a28b6328-6021-4b00-8d2b-af875173ec4b' }) });
    return { samePromise, data };
  });
  expect(returned).toEqual({ samePromise: true, data: { success: false, original: 'kept' } });
  expect((await calls(page)).filter(args => args[2] === 'Lead')).toEqual([]);
});

test('a sensitive landing URL blocks marketing but preserves the original contact form', async ({ page }) => {
  await page.route('https://cdn.yapt.ai/wa-button.js', route => route.fulfill({ contentType: 'application/javascript', body: readFileSync(path.join(__dirname, '../public/wa-button.js'), 'utf8') }));
  await page.route('**/functions/v1/widget-api?**', route => route.fulfill({ json: { success: true, data: { is_active: true, wa_button_phone: '5511000000000', wa_button_capture_fields: ['phone'] } } }));
  let submissions = 0;
  await page.route('**/functions/v1/webhook-widget', route => { submissions++; return route.fulfill({ json: { success: true } }); });
  await page.goto(origin + '/?utm_content=person%40example.test');
  await page.getByRole('button', { name: 'Aceitar cookies', exact: true }).click();
  await page.locator('#yapt-wa-button').waitFor();
  await page.evaluate(() => { window.open = () => null; });
  await page.locator('#yapt-wa-button').click();
  await page.locator('input[name=phone]').fill('5511999999999');
  await page.locator('button[type=submit]').click();
  await expect.poll(() => submissions).toBe(1);
  expect(await calls(page)).toEqual([]);
  await expect(page.locator('[data-capture-status]')).toHaveCount(0);
});

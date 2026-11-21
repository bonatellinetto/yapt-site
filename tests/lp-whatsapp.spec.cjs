const pages=['/solucao/crm-whatsapp-ia','/solucao/agente-ia-atendimento'];
const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.route('https://www.googletagmanager.com/**',r=>r.fulfill({body:''}));
 await page.route('https://connect.facebook.net/**',r=>r.fulfill({body:''}));
 await page.route('https://snap.licdn.com/**',r=>r.fulfill({body:''}));
 await page.route('**/functions/v1/webhook-widget',r=>r.abort());
 await page.route('**/functions/v1/widget-api?**',r=>r.fulfill({json:{success:true,data:{is_active:true,wa_button_phone:'5511000000000',wa_button_message:'teste',wa_button_capture_fields:['phone','name','email']}}}));
 await page.goto('http://127.0.0.1:4329'+pages[0]+'?gclid=review-test');
 await page.getByRole('button',{name:'Aceitar cookies',exact:true}).click();
 await page.locator('#yapt-wa-button').waitFor();
 await page.evaluate(()=>{window.dataLayer=[];window.open=()=>null;window.__metaCalls=[];window.fbq=(...args)=>window.__metaCalls.push(args)});
});
test('floating button is measured',async({page})=>{await page.locator('#yapt-wa-button').click();expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_click').length)).toBe(1)});
test('whitespace does not create a conversion',async({page})=>{await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('   ');await page.locator('button[type=submit]').click();expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead').length)).toBe(0)});
test('failed capture shows an error and does not convert',async({page})=>{await page.route('**/functions/v1/webhook-widget',r=>r.fulfill({status:500,json:{success:false}}));await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('5511999999999');await page.locator('button[type=submit]').click();await expect(page.getByRole('alert')).toBeVisible();expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead').length)).toBe(0)});
test('confirmed capture converts once and sends attribution',async({page})=>{let payload;await page.route('**/functions/v1/webhook-widget',r=>{payload=r.request().postDataJSON();return r.fulfill({json:{success:true,data:{phone:'5511000000000',message:'teste'}}})});await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('5511999999999');await page.locator('button[type=submit]').click();await expect.poll(()=>page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead').length)).toBe(1);expect(payload.clickIds?.gclid).toBe('review-test');expect(payload.pageTitle).toBe((await page.title()).replace(/\s*\|\s*yapt\.\s*$/i, '').trim());expect(new URL(payload.pageUrl).pathname).toBe(pages[0])});

test('confirmed form sends a single Meta Lead without personal fields',async({page})=>{
 await page.evaluate(()=>{window.__metaCalls=[];window.fbq=(...args)=>window.__metaCalls.push(args)});
 await page.route('**/functions/v1/webhook-widget',r=>r.fulfill({json:{success:true}}));
 await page.locator('#yapt-wa-button').click();
 await page.locator('input[name=phone]').fill('5511999999999');
 await page.locator('input[name=name]').fill('Nome reservado');
 await page.locator('input[name=email]').fill('reservado@example.test');
 await page.locator('button[type=submit]').click();
 await expect.poll(()=>page.evaluate(()=>window.__metaCalls.length)).toBe(1);
 expect(await page.evaluate(()=>window.__metaCalls)).toEqual([['trackSingle','26923785453912756','Lead']]);
 const events=await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead'));
 expect(events).toEqual([{event:'lp_whatsapp_lead',lp:'crm-whatsapp-ia'}]);
});

test('rejected cookies keep contact usable without a Meta conversion',async({page})=>{
 await page.evaluate(()=>{window.yaptMarketingConsent.set(false);window.__metaCalls=[];window.fbq=(...args)=>window.__metaCalls.push(args);window.dataLayer=[]});
 await page.route('**/functions/v1/webhook-widget',r=>r.fulfill({json:{success:true}}));
 await page.locator('#yapt-wa-button').click();
 await page.locator('input[name=phone]').fill('5511999999999');
 await page.locator('button[type=submit]').click();
 await expect(page.getByRole('status')).toContainText('Contato registrado');
 expect(await page.evaluate(()=>window.__metaCalls)).toEqual([]);
 expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead'))).toEqual([]);
});

test('floating keyboard activation is measured',async({page})=>{await page.locator('#yapt-wa-button').press('Enter');expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_click').length)).toBe(1)});

for (const path of pages) test('page interactions '+path,async({page})=>{
 const response=await page.goto('http://127.0.0.1:4329'+path);
 expect(response.status()).toBe(200);
 await expect(page.locator('h1')).toHaveCount(1);
 for(const width of [375,1440]) {
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 const mapLink=page.locator('.mapa a.lin[href^="#"]').first();
 await expect(mapLink).toHaveAttribute('href',/^#[\w-]+$/);
 const destination=await mapLink.getAttribute('href');
 await mapLink.click();
 await expect(page).toHaveURL(new RegExp(destination+'$'));
 await expect(page.locator(destination)).toBeInViewport();
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://yapt.ai'+path);
 await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
 await page.locator('.topo-bar [data-yapt-wa]').click();
 await expect(page.locator('input[name=phone]')).toBeVisible();
});


test('opens WhatsApp before a slow capture completes, without duplicate capture', async ({ page }) => {
  let release;
  let requests = 0;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/functions/v1/webhook-widget', async route => {
    requests++;
    await gate;
    await route.fulfill({ json: { success: true, data: { phone: '5511000000000', message: 'teste' } } });
  });
  await page.evaluate(() => {
    window.openedUrls = [];
    window.open = url => { window.openedUrls.push(url); return null; };
  });
  await page.locator('#yapt-wa-button').click();
  await page.locator('input[name=phone]').fill('5511999999999');
  await page.locator('button[type=submit]').click();
  try {
    expect(await page.evaluate(() => window.openedUrls)).toEqual(['https://wa.me/5511000000000?text=teste']);
    await expect.poll(() => requests).toBe(1);
    expect(await page.evaluate(() => window.dataLayer.filter(x => x.event === 'lp_whatsapp_lead').length)).toBe(0);
    await expect(page.getByRole('link', { name: 'Abrir WhatsApp' })).toHaveAttribute('href', 'https://wa.me/5511000000000?text=teste');
    await page.locator('form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(requests).toBe(1);
  } finally { release(); }
  await expect.poll(() => page.evaluate(() => window.dataLayer.filter(x => x.event === 'lp_whatsapp_lead').length)).toBe(1);
  expect(requests).toBe(1);
});

test('preserves campaign identity after anchor and opens WhatsApp immediately', async ({page}) => {
  await page.goto('http://127.0.0.1:4329'+pages[0]+'?gclid=current&gad_campaignid=24282362831#diagnostico&utm_source=adwords&utm_medium=ppc&utm_id=24282362831');
  await page.locator('#yapt-wa-button').waitFor();
  await page.evaluate(()=>{document.cookie='yapt_gclid=stale; path=/';window.open=()=>null;window.fbq=()=>{};window.dataLayer=[];});
  let payload;
  await page.route('**/functions/v1/webhook-widget', r => {
    payload=r.request().postDataJSON();return r.fulfill({json:{success:true,data:{phone:'5511000000000',message:'teste'}}});
  });
  await page.locator('#yapt-wa-button').click();
  await page.locator('input[name=phone]').fill('5511999999999');
  await page.locator('button[type=submit]').click();
  await expect.poll(()=>payload).toBeTruthy();
  expect(payload.utm).toMatchObject({source:'adwords',medium:'ppc',id:'24282362831'});
  expect(payload.clickIds).toMatchObject({gclid:'current',gad_campaignid:'24282362831'});
  expect(payload.pageUrl).toContain('#diagnostico');
});
test('linkedin insight tag is installed with the account partner id',async({page})=>{expect(await page.evaluate(()=>window._linkedin_data_partner_ids)).toEqual(['10064090']);expect(await page.evaluate(()=>typeof window.lintrk)).toBe('function')});
test('confirmed capture sends the linkedin conversion once',async({page})=>{await page.evaluate(()=>{window.__li=[];window.lintrk=(a,b)=>window.__li.push([a,b])});await page.route('**/functions/v1/webhook-widget',r=>r.fulfill({json:{success:true,data:{phone:'5511000000000',message:'teste'}}}));await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('5511999999999');await page.locator('button[type=submit]').click();await expect.poll(()=>page.evaluate(()=>window.__li.length)).toBe(1);expect(await page.evaluate(()=>window.__li[0])).toEqual(['track',{conversion_id:32221082}])});
test('failed capture does not send the linkedin conversion',async({page})=>{await page.evaluate(()=>{window.__li=[];window.lintrk=(a,b)=>window.__li.push([a,b])});await page.route('**/functions/v1/webhook-widget',r=>r.fulfill({status:500,json:{success:false}}));await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('5511999999999');await page.locator('button[type=submit]').click();await expect(page.getByRole('alert')).toBeVisible();expect(await page.evaluate(()=>window.__li.length)).toBe(0)});

const {readdirSync}=require('node:fs');
const pages=readdirSync('src/pages/lp').filter(x=>x.endsWith('.astro')).map(x=>x.replace('.astro',''));
const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.route('https://www.googletagmanager.com/**',r=>r.fulfill({body:''}));
 await page.route('https://connect.facebook.net/**',r=>r.fulfill({body:''}));
 await page.route('**/functions/v1/widget-api?**',r=>r.fulfill({json:{success:true,data:{is_active:true,wa_button_phone:'5511000000000',wa_button_message:'teste',wa_button_capture_fields:['phone','name','email']}}}));
 await page.goto('http://127.0.0.1:4329/lp/'+pages[0]+'?gclid=review-test');
 await page.locator('#yapt-wa-button').waitFor();
 await page.evaluate(()=>{window.dataLayer=[];window.open=()=>null;window.fbq=()=>{}});
});
test('floating button is measured',async({page})=>{await page.locator('#yapt-wa-button').click();expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_click').length)).toBe(1)});
test('whitespace does not create a conversion',async({page})=>{await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('   ');await page.locator('button[type=submit]').click();expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead').length)).toBe(0)});
test('failed capture shows an error and does not convert',async({page})=>{await page.route('**/functions/v1/webhook-widget',r=>r.fulfill({status:500,json:{success:false}}));await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('5511999999999');await page.locator('button[type=submit]').click();await expect(page.getByRole('alert')).toBeVisible();expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead').length)).toBe(0)});
test('confirmed capture converts once and sends attribution',async({page})=>{let payload;await page.route('**/functions/v1/webhook-widget',r=>{payload=r.request().postDataJSON();return r.fulfill({json:{success:true,data:{phone:'5511000000000',message:'teste'}}})});await page.locator('#yapt-wa-button').click();await page.locator('input[name=phone]').fill('5511999999999');await page.locator('button[type=submit]').click();await expect.poll(()=>page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_lead').length)).toBe(1);expect(payload.clickIds?.gclid).toBe('review-test')});

test('floating keyboard activation is measured',async({page})=>{await page.locator('#yapt-wa-button').press('Enter');expect(await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='lp_whatsapp_click').length)).toBe(1)});

for (const slug of pages) test('page interactions '+slug,async({page})=>{
 await page.goto('http://127.0.0.1:4329/lp/'+slug);
 for(const width of [375,1440]) {
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.locator('.faq-q').first().click();await expect(page.locator('.faq-q').first()).toHaveAttribute('aria-expanded','true');
 await page.locator('#plan-range').fill('2');
 const expected=(await page.locator('.plano-price').last().textContent()).replace(/\s/g,'');
 expect((await page.locator('#plan-price').textContent()).replace(/\s/g,'')).toBe(expected);
 await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
});

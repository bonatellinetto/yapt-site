// Adapter for the public yapt. WA widget: immediate navigation and confirmed campaign measurement.
// The CDN widget still owns config, routing and modal rendering.
const instanceId = 'a28b6328-6021-4b00-8d2b-af875173ec4b';
const apiUrl = 'https://vkrwduoawdhsbkoufurl.supabase.co/functions/v1/webhook-widget';
// Resolve routing while the visitor reads the page, never after capturing the lead.
let whatsappUrl: string | null = null;
async function loadDestination() {
  try {
    const response = await fetch(apiUrl.replace('webhook-widget', `widget-api?action=config&instanceId=${instanceId}`), { signal: AbortSignal.timeout(8000) });
    const result = await response.json();
    const config = result.data;
    if (!response.ok || result.success !== true || config?.is_active !== true || typeof config.wa_button_phone !== 'string') return;
    const phone = config.wa_button_phone.replace(/\D/g, '');
    if (!phone) return;
    whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(config.wa_button_message || '')}`;
  } catch { /* Keep the form usable; a later click can retry configuration. */ }
}
void loadDestination();
const lp = location.pathname.split('/').filter(Boolean).at(-1) || '';
const started = Date.now();
const pending = new WeakSet<HTMLFormElement>();
let maxScroll = 0;
type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
  yaptwa?: (command: string) => void;
};
const tracking = window as TrackingWindow;
const clickKeys = ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const;
const params = new URLSearchParams(location.search);
function cookie(key: string): string {
  const match = document.cookie.match(new RegExp('(?:^|; )yapt_' + key + '=([^;]*)'));
  try { return match ? decodeURIComponent(match[1]) : ''; } catch { return ''; }
}
for (const key of clickKeys) {
  const value = params.get(key);
  if (value) document.cookie = `yapt_${key}=${encodeURIComponent(value)}; max-age=7776000; path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}
function track(event: string, details: Record<string, unknown>) {
  (tracking.dataLayer ||= []).push({ event, lp, ...details });
}
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('[data-yapt-wa], #yapt-wa-button');
  if (!button || (button.id !== 'yapt-wa-button' && button.getAttribute('data-yapt-wa') !== instanceId)) return;
  track('lp_whatsapp_click', { posicao: button.id === 'yapt-wa-button' ? 'flutuante' : button.closest('nav') ? 'nav' : button.closest('section')?.id || 'outro' });
});
document.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof Element && event.target.id === 'yapt-wa-button' && !event.repeat) {
    track('lp_whatsapp_click', { posicao: 'flutuante' });
  }
});
window.addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - innerHeight;
  if (height > 0) maxScroll = Math.max(maxScroll, Math.round(scrollY / height * 100));
}, { passive: true });
function visitorId() {
  try {
    const value = localStorage.getItem('yapt_vid') || crypto.randomUUID();
    localStorage.setItem('yapt_vid', value);
    return value;
  } catch { return crypto.randomUUID(); }
}
function status(form: HTMLFormElement, message: string, error = true) {
  let notice = form.querySelector<HTMLElement>('[data-capture-status]');
  if (!notice) { notice = document.createElement('p'); notice.dataset.captureStatus = ''; form.append(notice); }
  notice.setAttribute('role', error ? 'alert' : 'status');
  notice.style.cssText = `font-size:14px;color:${error ? '#b91c1c' : '#166534'};`;
  notice.textContent = message;
  return notice;
}
function capturePayload(form: HTMLFormElement, phone: string) {
  const data = new FormData(form);
  const field = (key: string) => String(data.get(key) || '').trim();
  return {
    action: 'wa_button_submit', instanceId, visitorId: visitorId(), phone,
    name: field('name'), email: field('email'), pageUrl: location.href,
    pageTitle: document.title.replace(/\s*\|\s*yapt\.\s*$/i, '').trim(), referrer: document.referrer || null,
    scrollDepth: maxScroll, timeOnPage: Math.round((Date.now() - started) / 1000),
    screenWidth: innerWidth, isMobile: innerWidth <= 640,
    utm: Object.fromEntries(['source', 'medium', 'campaign', 'content', 'term'].map(key => [key, params.get('utm_' + key)])),
    clickIds: { gclid: cookie('gclid') || undefined, gbraid: cookie('gbraid') || undefined,
      wbraid: cookie('wbraid') || undefined, fbclid: cookie('fbclid') || undefined },
  };
}
function whatsappNotice(form: HTMLFormElement, url: string, message: string, error = false) {
  const notice = status(form, message, error);
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.textContent = 'Abrir WhatsApp'; notice.append(' ', link);
}
function openWhatsApp(form: HTMLFormElement, url: string) {
  const tab = window.open(url, '_blank');
  if (tab) { tab.opener = null; return; }
  whatsappNotice(form, url, 'Continue sua conversa:');
}
async function capture(form: HTMLFormElement, phone: string) {
  if (!whatsappUrl) {
    status(form, 'Carregando o WhatsApp. Tente novamente em instantes.', false);
    void loadDestination();
    return;
  }
  const payload = capturePayload(form, phone);
  pending.add(form);
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]');
  if (button) button.disabled = true;
  status(form, 'WhatsApp aberto. Seu contato está sendo registrado.', false);
  openWhatsApp(form, whatsappUrl);
  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true, signal: AbortSignal.timeout(15000) });
    const result = await response.json();
    if (!response.ok || result.success !== true) throw new Error('Capture failed');
    track('lp_whatsapp_lead', { telefone: phone, email: payload.email, gclid: payload.clickIds.gclid, gbraid: payload.clickIds.gbraid, wbraid: payload.clickIds.wbraid });
    tracking.fbq?.('track', 'Lead');
    whatsappNotice(form, whatsappUrl, 'Contato registrado. Continue sua conversa:');
    // Keep the form locked: repeated clicks must not resend the template.
  } catch {
    whatsappNotice(form, whatsappUrl, 'Não foi possível confirmar o cadastro. Você pode continuar pelo WhatsApp.', true);
  }
}
document.addEventListener('submit', event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.parentElement?.style.zIndex !== '999999') return;
  const input = form.querySelector<HTMLInputElement>('input[name=phone][type=tel]');
  if (!input) return;
  // Capture phase prevents the legacy widget's fire-and-forget handler from sending twice.
  event.preventDefault(); event.stopImmediatePropagation();
  if (pending.has(form)) return;
  const digits = input.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    status(form, 'Informe um WhatsApp válido com DDD.'); input.focus(); return;
  }
  void capture(form, digits);
}, true);
export {};

import { validWhatsAppConfiguration, whatsappConfigUrl, whatsappScriptUrl, whatsappWidgetId, type WhatsAppAPI, type WhatsAppConfiguration } from '../lib/whatsapp';

type WidgetState = 'loading' | 'ready' | 'fallback';
type WidgetWindow = Window & { YaptWA?: string; yaptwa?: WhatsAppAPI; yaptWidgetReady?: Promise<boolean> };
const host = window as WidgetWindow;
let configuration: WhatsAppConfiguration | undefined;
let fallbackObserver: MutationObserver | undefined;

export function whatsAppConfiguration(): Readonly<WhatsAppConfiguration> | undefined {
  return configuration;
}

export function whatsAppWidgetState(): WidgetState | undefined {
  const state = document.body.dataset.whatsappWidget;
  return state === 'loading' || state === 'ready' || state === 'fallback' ? state : undefined;
}

export function whatsAppAPI(): WhatsAppAPI | undefined {
  return typeof host.yaptwa === 'function' ? host.yaptwa : undefined;
}

function setState(state: WidgetState) {
  document.body.dataset.whatsappWidget = state;
  document.querySelectorAll<HTMLElement>('[data-whatsapp-fallback]').forEach(link => { link.hidden = state !== 'fallback'; });
  if (state === 'fallback') {
    whatsAppAPI()?.('close'); document.getElementById('yapt-wa-button')?.remove();
    fallbackObserver ??= new MutationObserver(() => document.getElementById('yapt-wa-button')?.remove());
    fallbackObserver.observe(document.body, { childList: true });
  }
  document.dispatchEvent(new CustomEvent('yapt:whatsapp-state', { detail: { state } }));
}

async function configurationIsActive(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(whatsappConfigUrl, { signal: controller.signal });
    const payload: unknown = await response.json();
    if (!response.ok || !validWhatsAppConfiguration(payload)) return false;
    configuration = payload.data;
    return true;
  } catch { return false; }
  finally { window.clearTimeout(timeout); }
}

function loadOriginalSDK(): Promise<boolean> {
  return new Promise(resolve => {
    const script = document.createElement('script');
    const finish = (loaded: boolean) => {
      window.clearTimeout(timeout); script.onload = null; script.onerror = null;
      if (!loaded) script.remove();
      resolve(loaded);
    };
    const timeout = window.setTimeout(() => finish(false), 6500);
    host.YaptWA = 'yaptwa'; script.id = 'yapt-whatsapp-sdk'; script.src = whatsappScriptUrl; script.async = true;
    script.onerror = () => finish(false);
    script.onload = () => {
      const widget = whatsAppAPI();
      if (!widget) { finish(false); return; }
      widget('init', { id: whatsappWidgetId, mode: 'both' });
      finish(true);
    };
    document.head.append(script);
  });
}

async function waitForOriginalButton(): Promise<boolean> {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (document.getElementById('yapt-wa-button')) return true;
    await new Promise(resolve => window.setTimeout(resolve, 125));
  }
  return false;
}

async function prepareWidget(): Promise<boolean> {
  setState('loading');
  const ready = await configurationIsActive() && await loadOriginalSDK() && await waitForOriginalButton();
  setState(ready ? 'ready' : 'fallback');
  return ready;
}

export function whenWhatsAppReady(): Promise<boolean> {
  return host.yaptWidgetReady ??= prepareWidget();
}

export function useWhatsAppFallback() {
  if (whatsAppWidgetState() === 'fallback') return;
  setState('fallback');
}

if (document.querySelector('[data-whatsapp-widget]')) void whenWhatsAppReady();

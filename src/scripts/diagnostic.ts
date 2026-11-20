import { findDiagnosticModal, observeDiagnosticModals, restoreDiagnosticFocus } from './diagnostic-modal';
import { whenWhatsAppReady, whatsAppAPI, whatsAppWidgetState } from './whatsapp-widget';
type Metric = { event: string; diagnostic_topic: string; diagnostic_placement: string; diagnostic_scenario: string; page_path: string };
type DiagnosticWindow = Window & { dataLayer?: { push: (event: Metric) => unknown } };
type Context = Omit<Metric, 'event'>;
const host = window as DiagnosticWindow;
const recovery = document.querySelector<HTMLDialogElement>('[data-diagnostic-recovery]');
let pending = false;
let previousTrigger: HTMLElement | undefined;
let pendingAbort: AbortController | undefined;

function contextFor(trigger: HTMLElement): Context {
  const route = location.pathname.replace(/^\/(en|es)(?=\/|$)/, '').replace(/\.html$/, '').split('/')[1] || 'home';
  const topics: Record<string, string> = { 'marketing-site': 'marketing', blog: 'insights', integrations: 'intelligence' };
  return {
    diagnostic_topic: trigger.dataset.diagnosticTopic || topics[route] || route,
    diagnostic_placement: trigger.dataset.diagnosticPlacement || 'closing',
    diagnostic_scenario: trigger.dataset.diagnosticScenario || '',
    page_path: location.pathname,
  };
}

function track(event: string, context: Context) {
  try { const initial: Metric[] = []; const layer = host.dataLayer ??= initial; layer.push({ event, ...context }); }
  catch { /* Analytics never blocks the diagnosis. */ }
}

async function waitForModal(signal: AbortSignal) {
  for (let attempt = 0; attempt < 10; attempt++) {
    if (signal.aborted) return;
    const modal = findDiagnosticModal();
    if (modal) return modal;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

function showRecovery(trigger: HTMLElement, context: Context) {
  const callout = trigger.closest('[data-diagnostic-callout]');
  const status = callout?.querySelector<HTMLElement>('[data-diagnostic-status]');
  if (status) { status.textContent = recovery?.dataset.error || trigger.dataset.diagnosticError || trigger.dataset.fallbackMessage || ''; status.hidden = false; }
  callout?.querySelector<HTMLElement>('[data-diagnostic-fallback]')?.removeAttribute('hidden');
  track('diagnostic_fallback', context);
  if (!recovery) return;
  previousTrigger = trigger;
  const link = recovery.querySelector<HTMLAnchorElement>('[data-diagnostic-recovery-link]');
  const nativeHref = trigger instanceof HTMLAnchorElement ? trigger.href : '';
  if (link && /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(nativeHref)) link.href = nativeHref;
  if (typeof recovery.showModal === 'function') recovery.showModal(); else recovery.open = true;
  link?.focus({ preventScroll: true });
}

async function openDiagnostic(trigger: HTMLElement) {
  if (pending) return;
  pending = true;
  pendingAbort = new AbortController();
  const { signal } = pendingAbort;
  const context = contextFor(trigger), label = trigger.getAttribute('aria-label');
  const text = trigger.querySelector<HTMLElement>('[data-diagnostic-button-label]'), originalText = text?.textContent;
  trigger.setAttribute('aria-busy', 'true');
  trigger.setAttribute('aria-label', recovery?.dataset.loading || trigger.textContent || '');
  if (text) text.textContent = recovery?.dataset.loading || originalText || '';
  track('diagnostic_cta_click', context);
  try {
    const ready = await whenWhatsAppReady(), widget = whatsAppAPI();
    if (signal.aborted) return;
    if (!ready || !widget || whatsAppWidgetState() === 'fallback') throw new Error('Widget unavailable');
    widget('open');
    const modal = await waitForModal(signal);
    if (!modal || whatsAppWidgetState() === 'fallback') throw new Error('Widget did not open');
    track('diagnostic_open', context);
  } catch { if (trigger.isConnected && !signal.aborted) showRecovery(trigger, context); }
  finally {
    pending = false; trigger.removeAttribute('aria-busy');
    if (text) text.textContent = originalText || '';
    if (label === null) trigger.removeAttribute('aria-label'); else trigger.setAttribute('aria-label', label);
  }
}

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-diagnostic-trigger]') : null;
  if (!trigger) return;
  if (whatsAppWidgetState() === 'fallback' && trigger instanceof HTMLAnchorElement && /^https:\/\/wa\.me\//.test(trigger.href)) return;
  event.preventDefault();
  void openDiagnostic(trigger);
});
recovery?.querySelector('[data-diagnostic-recovery-close]')?.addEventListener('click', () => recovery.close());
recovery?.addEventListener('close', () => restoreDiagnosticFocus(previousTrigger));
recovery?.addEventListener('click', event => {
  if (event.target !== recovery) return;
  const rect = recovery.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) recovery.close();
});
window.addEventListener('pagehide', () => pendingAbort?.abort());
document.addEventListener('keydown', event => { if (event.key === 'Escape' && pending) pendingAbort?.abort(); });
observeDiagnosticModals();

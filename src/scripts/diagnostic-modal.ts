import { useWhatsAppFallback, whatsAppAPI, whatsAppConfiguration, whatsAppWidgetState } from './whatsapp-widget';

let previousTrigger: HTMLElement | undefined;
let observing = false;

export function findDiagnosticModal(): HTMLElement | undefined {
  return [...document.body.children].find((node): node is HTMLElement =>
    node instanceof HTMLElement && node.style.position === 'fixed' && node.style.zIndex === '999999'
    && Boolean(node.querySelector('form input[type="tel"][name="phone"]'))
    && node.getClientRects().length > 0,
  );
}

export function restoreDiagnosticFocus(trigger: HTMLElement | undefined) {
  if (!trigger?.isConnected) { document.querySelector<HTMLElement>('[data-whatsapp-fallback]:not([hidden])')?.focus({ preventScroll: true }); return; }
  const closedMenu = trigger.closest('details:not([open])')?.querySelector<HTMLElement>('summary');
  const target = closedMenu || (trigger.getClientRects().length ? trigger : trigger.closest('details')?.querySelector<HTMLElement>('summary'));
  target?.focus({ preventScroll: true });
}

function trapModalFocus(event: KeyboardEvent, modal: HTMLElement, close: () => void) {
  if (event.key === 'Escape') { event.preventDefault(); close(); return; }
  if (event.key !== 'Tab') return;
  const controls = [...modal.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex="0"]')]
    .filter(control => control.getClientRects().length > 0 && !control.hasAttribute('disabled'));
  const first = controls[0], last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

function prepareModalFields(modal: HTMLElement) {
  modal.querySelectorAll<HTMLInputElement>('input').forEach(input => {
    if (!input.id) input.id = `diagnostic-widget-${input.name}`;
    const label = input.parentElement?.querySelector('label');
    if (label) label.htmlFor = input.id;
    input.style.minHeight = '44px';
    input.style.fontSize = '16px';
    input.style.outline = '';
  });
}

function prepareModal(modal: HTMLElement, closeLabel: string) {
  modal.classList.add('diagnostic-widget');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  const heading = modal.querySelector('h3');
  if (heading) { heading.id = 'diagnostic-widget-heading'; modal.setAttribute('aria-labelledby', heading.id); }
  const button = modal.querySelector<HTMLButtonElement>('button:not([type=submit])');
  if (button) { button.setAttribute('aria-label', closeLabel); button.style.width = '44px'; button.style.height = '44px'; }
  modal.style.maxHeight = 'calc(100dvh - 32px)';
  modal.style.overflowY = 'auto';
  prepareModalFields(modal);
}

export function enhanceDiagnosticModal(modal: HTMLElement, trigger: HTMLElement, closeLabel: string, close: () => void) {
  if (modal.dataset.diagnosticEnhanced) return;
  modal.dataset.diagnosticEnhanced = 'true';
  prepareModal(modal, closeLabel);
  const htmlOverflow = document.documentElement.style.overflow, bodyOverflow = document.body.style.overflow;
  document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
  const background = [...document.body.children].filter((el): el is HTMLElement =>
    el instanceof HTMLElement && el !== modal && el.style.zIndex !== '999998');
  const inert = background.map(el => el.inert);
  background.forEach(el => { el.inert = true; });
  const abort = new AbortController();
  document.addEventListener('keydown', event => trapModalFocus(event, modal, close), { signal: abort.signal });
  const observer = new MutationObserver(() => {
    if (modal.isConnected) return;
    abort.abort(); observer.disconnect();
    background.forEach((el, index) => { el.inert = inert[index]; });
    document.documentElement.style.overflow = htmlOverflow; document.body.style.overflow = bodyOverflow;
    restoreDiagnosticFocus(trigger);
  });
  observer.observe(document.body, { childList: true });
  modal.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
}
function rememberTrigger(event: Event) {
  const target = event.target instanceof Element
    ? event.target.closest<HTMLElement>('[data-diagnostic-trigger], [data-yapt-wa], #yapt-wa-button') : null;
  if (target) previousTrigger = target;
}

function modalMatchesConfiguration(modal: HTMLElement): boolean {
  const config = whatsAppConfiguration();
  if (!config) return false;
  const expectedLabel = config.wa_button_label || 'Fale conosco no WhatsApp';
  const fields = ['phone', ...(config.wa_button_capture_fields || [])].filter(field => ['phone', 'name', 'email'].includes(field));
  return modal.querySelector('h3')?.textContent?.trim() === expectedLabel
    && fields.every(field => modal.querySelector(`input[name="${field}"]`));
}

function enhanceCurrentModal() {
  if (whatsAppWidgetState() === 'fallback') return;
  const modal = findDiagnosticModal();
  const trigger = previousTrigger || (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
  if (!modal || !trigger) return;
  if (!modalMatchesConfiguration(modal)) { useWhatsAppFallback(); return; }
  const label = document.querySelector<HTMLElement>('[data-diagnostic-recovery]')?.dataset.closeLabel || 'Close';
  enhanceDiagnosticModal(modal, trigger, label, () => whatsAppAPI()?.('close'));
}

export function observeDiagnosticModals() {
  if (observing) return;
  observing = true;
  document.addEventListener('click', rememberTrigger, { capture: true });
  document.addEventListener('keydown', rememberTrigger, { capture: true });
  const observer = new MutationObserver(enhanceCurrentModal);
  observer.observe(document.body, { childList: true });
  enhanceCurrentModal();
}

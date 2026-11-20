import { initializeScenarioScroll } from './scenario-scroll';
import { initializeScenarioTabs } from './scenario-tabs';

class ResponsiveScenarios {
  private mobile = matchMedia('(max-width:767px)');
  private abort = new AbortController();
  private cleanup?: () => void;
  private mode?: 'tabs' | 'scroll';
  private defaultMode: string;

  constructor(private root: HTMLElement) {
    this.defaultMode = root.dataset.scenarioDefaultMode || root.dataset.scenarioMode || 'tabs';
  }

  connect() {
    this.update();
    this.mobile.addEventListener('change', this.update, { signal: this.abort.signal });
    document.addEventListener('astro:before-swap', () => this.disconnect(), { once: true, signal: this.abort.signal });
  }

  private update = () => {
    const mode = this.defaultMode === 'scroll' || this.mobile.matches ? 'scroll' : 'tabs';
    if (mode === this.mode) return;
    const focused = document.activeElement instanceof HTMLElement && this.root.contains(document.activeElement) ? document.activeElement : undefined;
    const preferred = focused?.closest<HTMLElement>('[data-scenario-panel]')?.id || this.root.dataset.selected;
    const panel = [...this.root.querySelectorAll<HTMLElement>('[data-scenario-panel]')].find(item => item.id === preferred);
    const rect = panel?.getBoundingClientRect();
    const reading = Boolean(this.mode && rect && rect.top < innerHeight && rect.bottom > 100);
    this.cleanup?.();
    this.root.dataset.enhanced = 'false';
    this.root.dataset.scenarioMode = mode;
    this.mode = mode;
    this.cleanup = mode === 'scroll' ? initializeScenarioScroll(this.root) : initializeScenarioTabs(this.root, preferred);
    if (reading && panel) this.alignPanel(panel);
    if (focused) this.restoreFocus(focused, panel);
  };

  private alignPanel(panel: HTMLElement) {
    const top = this.mode === 'scroll' ? parseFloat(this.root.style.getPropertyValue('--scenario-scroll-offset'))
      : (document.querySelector('#site-navbar')?.getBoundingClientRect().bottom ?? 82) + 16;
    window.scrollTo({ top: window.scrollY + panel.getBoundingClientRect().top - top, behavior: 'instant' });
  }

  private restoreFocus(focused: HTMLElement, panel?: HTMLElement) {
    if (focused.getClientRects().length) { focused.focus({ preventScroll: true }); return; }
    const link = [...this.root.querySelectorAll<HTMLAnchorElement>('[data-scenario-link]')].find(item => item.hash === `#${panel?.id}`);
    link?.focus({ preventScroll: true });
  }

  disconnect() { this.abort.abort(); this.cleanup?.(); }
}

const controllers = new WeakMap<HTMLElement, ResponsiveScenarios>();
export function initializeResponsiveScenarios(root: HTMLElement) {
  if (controllers.has(root)) return;
  const controller = new ResponsiveScenarios(root);
  controllers.set(root, controller);
  controller.connect();
}

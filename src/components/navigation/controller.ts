type BodyState = Pick<CSSStyleDeclaration, 'position' | 'top' | 'left' | 'width' | 'overflow' | 'paddingRight'> & { y: number };

class SiteNavigation extends HTMLElement {
  private abort?: AbortController;
  private bodyState?: BodyState;
  private desktop = window.matchMedia('(min-width: 1120px)');

  connectedCallback() {
    this.abort?.abort();
    this.abort = new AbortController();
    const { signal } = this.abort;
    this.querySelectorAll<HTMLDetailsElement>('details').forEach(details => this.syncExpanded(details));
    this.updateLanguageLinks();
    this.addEventListener('toggle', event => this.onToggle(event), { capture: true, signal });
    this.addEventListener('click', event => this.onClick(event), { signal });
    this.addEventListener('focusout', event => this.onFocusOut(event), { signal });
    document.addEventListener('keydown', event => this.onKeyDown(event), { signal });
    document.addEventListener('pointerdown', event => this.onOutsidePointer(event), { signal });
    window.addEventListener('pagehide', () => this.closeAll(), { signal });
    window.addEventListener('hashchange', () => this.updateLanguageLinks(), { signal });
    this.desktop.addEventListener('change', () => this.closeAll(), { signal });
  }

  disconnectedCallback() {
    this.closeAll();
    this.abort?.abort();
  }

  private get mobile(): HTMLDetailsElement | null {
    return this.querySelector('[data-mobile-disclosure]');
  }

  private syncExpanded(details: HTMLDetailsElement) {
    details.querySelector('summary')?.setAttribute('aria-expanded', String(details.open));
  }

  private closeDetails(details: HTMLDetailsElement, restoreFocus = false) {
    details.open = false;
    const summary = details.querySelector('summary');
    this.syncExpanded(details);
    if (details === this.mobile) this.releaseBody();
    if (restoreFocus) summary?.focus({ preventScroll: true });
  }

  private closeAll() {
    this.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(details => this.closeDetails(details));
    this.releaseBody();
  }

  private onToggle(event: Event) {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement)) return;
    this.syncExpanded(details);
    if (!details.open) {
      if (details === this.mobile) this.releaseBody();
      return;
    }
    this.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(other => {
      if (other !== details) this.closeDetails(other);
    });
    if (details === this.mobile && !this.desktop.matches) this.lockBody();
  }

  private onClick(event: MouseEvent) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[href]');
    if (link && this.contains(link)) {
      if (link.dataset.language) this.prepareLanguageLink(link);
      this.closeAll();
    }
  }

  private prepareLanguageLink(link: HTMLAnchorElement) {
    this.setLanguageDestination(link);
    try { localStorage.setItem('cosmos_language', link.dataset.language ?? 'pt-BR'); }
    catch { /* Navigation works when browser storage is unavailable. */ }
  }

  private updateLanguageLinks() {
    this.querySelectorAll<HTMLAnchorElement>('a[data-language]').forEach(link => this.setLanguageDestination(link));
  }

  private setLanguageDestination(link: HTMLAnchorElement) {
    const destination = new URL(link.href);
    destination.search = window.location.search;
    if (link.dataset.preserveRoute === 'true') destination.hash = window.location.hash;
    link.href = destination.href;
  }

  private onFocusOut(event: FocusEvent) {
    if (!(event.relatedTarget instanceof Node)) return;
    this.querySelectorAll<HTMLDetailsElement>('[data-desktop-disclosure][open]').forEach(details => {
      if (!details.contains(event.relatedTarget as Node)) this.closeDetails(details);
    });
  }

  private onOutsidePointer(event: PointerEvent) {
    if (event.target instanceof Node && !this.contains(event.target)) this.closeAll();
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      const open = this.querySelector<HTMLDetailsElement>('details[open]');
      if (!open) return;
      event.preventDefault();
      this.closeDetails(open, true);
    }
    if (event.key === 'Tab' && this.mobile?.open) this.containMobileFocus(event);
  }

  private containMobileFocus(event: KeyboardEvent) {
    const controls = Array.from(this.querySelectorAll<HTMLElement>('a[href], button, summary'))
      .filter(control => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  private lockBody() {
    if (this.bodyState) return;
    const style = document.body.style;
    this.bodyState = {
      y: window.scrollY, position: style.position, top: style.top, left: style.left,
      width: style.width, overflow: style.overflow, paddingRight: style.paddingRight,
    };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    Object.assign(style, {
      position: 'fixed', top: `-${window.scrollY}px`, left: '0', width: '100%',
      overflow: 'hidden', paddingRight: `${padding + scrollbar}px`,
    });
  }

  private releaseBody() {
    if (!this.bodyState) return;
    const { y, ...styles } = this.bodyState;
    Object.assign(document.body.style, styles);
    this.bodyState = undefined;
    window.scrollTo({ top: y, left: window.scrollX, behavior: 'instant' });
  }
}

if (!customElements.get('site-navigation')) customElements.define('site-navigation', SiteNavigation);

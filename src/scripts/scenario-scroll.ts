class ScenarioScroll {
  private links: HTMLAnchorElement[];
  private panels: HTMLElement[];
  private nav: HTMLElement | null;
  private header = document.querySelector<HTMLElement>('#site-navbar');
  private mobile = matchMedia('(max-width: 767px)');
  private abort = new AbortController();
  private resize?: ResizeObserver;
  private frame = 0;
  private current = -1;

  constructor(private root: HTMLElement) {
    this.links = [...root.querySelectorAll<HTMLAnchorElement>('[data-scenario-link]')];
    this.panels = [...root.querySelectorAll<HTMLElement>('[data-scenario-panel]')];
    this.nav = root.querySelector<HTMLElement>('.mk-scenarios__nav');
  }

  connect() {
    if (!this.nav || !this.panels.length || this.links.length !== this.panels.length) return;
    this.panels.forEach(panel => { panel.hidden = false; });
    this.root.dataset.enhanced = 'true';
    this.bindEvents();
    this.measure();
    this.read();
    document.fonts.ready.then(() => { if (!this.abort.signal.aborted) this.schedule(); });
  }

  private bindEvents() {
    const { signal } = this.abort;
    window.addEventListener('scroll', this.schedule, { passive: true, signal });
    window.addEventListener('resize', this.schedule, { passive: true, signal });
    window.addEventListener('hashchange', this.schedule, { signal });
    window.addEventListener('pageshow', this.schedule, { signal });
    document.addEventListener('fullscreenchange', this.schedule, { signal });
    this.root.addEventListener('load', this.schedule, { capture: true, signal });
    this.links.forEach((link, index) => {
      link.addEventListener('click', () => this.measure(), { signal });
      link.addEventListener('focus', () => this.revealFocusedLink(index), { signal });
    });
    if (typeof ResizeObserver !== 'undefined') {
      this.resize = new ResizeObserver(this.schedule);
      [this.root, this.nav, this.header].forEach(el => { if (el) this.resize?.observe(el); });
    }
    document.addEventListener('astro:before-swap', () => this.disconnect(), { once: true, signal });
  }

  private schedule = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => { this.frame = 0; this.read(); });
  };

  private setOffset(name: string, value: number) {
    const pixels = `${Math.round(value)}px`;
    if (this.root.style.getPropertyValue(name) !== pixels) this.root.style.setProperty(name, pixels);
  }

  private measure() {
    const top = Math.max(12, (this.header?.getBoundingClientRect().bottom ?? 82) + 12);
    this.setOffset('--scenario-sticky-top', top);
    const offset = top + (this.mobile.matches ? (this.nav?.offsetHeight ?? 64) + 16 : 12);
    this.setOffset('--scenario-scroll-offset', offset);
    return offset;
  }

  private read() {
    if (document.fullscreenElement || document.querySelector('dialog[open],.diagnostic-widget[aria-modal=true]')) return;
    const line = this.measure();
    let index = 0;
    this.panels.forEach((panel, i) => { if (panel.getBoundingClientRect().top <= line + 2) index = i; });
    if (index !== this.current) this.select(index);
    else this.revealLink(index);
  }

  private select(index: number) {
    this.current = index;
    this.links.forEach((link, i) => {
      link.classList.toggle('is-selected', i === index);
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    this.root.dataset.selected = this.panels[index].id;
    const progress = this.root.querySelector<HTMLElement>('[data-scenario-progress]');
    if (progress) progress.textContent = `${String(index + 1).padStart(2, '0')} / ${String(this.panels.length).padStart(2, '0')}`;
    this.revealLink(index);
  }

  private revealFocusedLink(index: number) {
    requestAnimationFrame(() => {
      const link = this.links[index];
      if (!this.abort.signal.aborted && document.activeElement === link && link.matches(':focus-visible'))
        this.revealLink(index);
    });
  }

  private revealLink(index: number) {
    if (!this.nav || !this.links[index]) return;
    const active = document.activeElement;
    if (this.nav.contains(active) && active !== this.links[index] && active?.matches(':focus-visible')) return;
    const scroller = this.mobile.matches ? this.nav.querySelector<HTMLElement>('ol') : this.nav;
    if (!scroller) return;
    const nav = scroller.getBoundingClientRect();
    const link = this.links[index].getBoundingClientRect();
    if (this.mobile.matches) {
      if (link.left < nav.left + 8 || link.right > nav.right - 8)
        scroller.scrollLeft += (link.left + link.right - nav.left - nav.right) / 2;
    } else {
      if (link.top < nav.top + 5) this.nav.scrollTop += link.top - nav.top - 5;
      else if (link.bottom > nav.bottom - 5) this.nav.scrollTop += link.bottom - nav.bottom + 5;
    }
  }

  disconnect() {
    this.abort.abort();
    this.resize?.disconnect();
    cancelAnimationFrame(this.frame);
    this.links.forEach(link => link.removeAttribute('aria-current'));
  }
}

export function initializeScenarioScroll(root: HTMLElement) {
  const controller = new ScenarioScroll(root);
  controller.connect();
  return () => controller.disconnect();
}

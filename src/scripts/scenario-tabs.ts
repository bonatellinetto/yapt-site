class ScenarioTabs {
  private links: HTMLAnchorElement[];
  private panels: HTMLElement[];
  private nav: HTMLElement | null;
  private labels: (string | null)[];
  private abort = new AbortController();

  constructor(private root: HTMLElement) {
    this.links = [...root.querySelectorAll<HTMLAnchorElement>('[data-scenario-link]')];
    this.panels = [...root.querySelectorAll<HTMLElement>('[data-scenario-panel]')];
    this.nav = root.querySelector('nav');
    this.labels = this.panels.map(panel => panel.getAttribute('aria-labelledby'));
  }

  connect(preferred?: string) {
    if (!this.panels.length || this.links.length !== this.panels.length) return;
    this.nav?.setAttribute('role', 'tablist');
    this.nav?.querySelectorAll('ol,li').forEach(item => item.setAttribute('role', 'presentation'));
    this.links.forEach((link, index) => this.prepareLink(link, index));
    this.root.dataset.enhanced = 'true';
    const initial = preferred || location.hash.slice(1) || this.root.dataset.selected;
    this.select(Math.max(0, this.panels.findIndex(panel => panel.id === initial)));
    window.addEventListener('hashchange', this.fromHash, { signal: this.abort.signal });
  }

  private prepareLink(link: HTMLAnchorElement, index: number) {
    const { signal } = this.abort;
    link.id = `${this.root.dataset.scenarioPrefix === 'market' ? 'marketing' : this.root.dataset.scenarioPrefix || 'marketing'}-tab-${index}`;
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-controls', this.panels[index].id);
    this.panels[index].setAttribute('role', 'tabpanel');
    this.panels[index].setAttribute('aria-labelledby', link.id);
    link.addEventListener('click', event => { event.preventDefault(); this.select(index, true); }, { signal });
    link.addEventListener('keydown', event => this.onKey(event, index), { signal });
  }

  private onKey(event: KeyboardEvent, index: number) {
    const length = this.links.length;
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % length, ArrowDown: (index + 1) % length,
      ArrowLeft: (index + length - 1) % length, ArrowUp: (index + length - 1) % length,
      Home: 0, End: length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    this.select(keys[event.key], true);
    this.links[keys[event.key]].focus();
  }

  private select(index: number, updateHash = false) {
    if (index < 0 || index >= this.panels.length) return;
    this.links.forEach((link, i) => {
      link.classList.toggle('is-selected', i === index);
      link.setAttribute('aria-selected', String(i === index));
      link.tabIndex = i === index ? 0 : -1;
    });
    this.panels.forEach((panel, i) => { panel.hidden = i !== index; });
    this.root.dataset.selected = this.panels[index].id;
    if (updateHash) history.replaceState(null, '', `#${this.panels[index].id}`);
  }

  private fromHash = () => {
    const index = this.panels.findIndex(panel => `#${panel.id}` === location.hash);
    if (index >= 0) this.select(index);
  };

  disconnect() {
    this.abort.abort();
    this.nav?.removeAttribute('role');
    this.nav?.querySelectorAll('ol,li').forEach(item => item.removeAttribute('role'));
    this.links.forEach(link => {
      ['id', 'role', 'aria-controls', 'aria-selected', 'tabindex'].forEach(name => link.removeAttribute(name));
    });
    this.panels.forEach((panel, index) => {
      panel.hidden = false;
      panel.removeAttribute('role');
      const label = this.labels[index];
      if (label) panel.setAttribute('aria-labelledby', label); else panel.removeAttribute('aria-labelledby');
    });
  }
}

export function initializeScenarioTabs(root: HTMLElement, preferred?: string) {
  const controller = new ScenarioTabs(root);
  controller.connect(preferred);
  return () => controller.disconnect();
}

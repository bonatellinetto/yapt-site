
  // nav transparente sobre o hero, sólida ao rolar (igual ao site)
  const lpNav = document.getElementById('lp-nav');
  function updateNav() {
    lpNav?.classList.toggle('solid', window.scrollY > 50);
  }
  updateNav();
  window.addEventListener('scroll', updateNav);

  // vídeos das dobras: dão play quando entram na tela, pausam quando saem.
  // Vale pra quantos vídeos a página tiver — as LPs da frente 1 têm dois.
  document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((v) => {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.45 }).observe(v);
  });

  // mockup do inbox: escala proporcional pra largura da coluna
  (function () {
    const wrap = document.getElementById('ib-wrap');
    const scale = document.getElementById('ib-scale');
    if (!wrap || !scale) return;
    function ajusta() {
      // no mobile não deixa encolher abaixo do legível: escala por 640px e rola na horizontal
      const larguraBase = window.innerWidth <= 760 ? Math.max(wrap!.clientWidth, 640) : wrap!.clientWidth;
      const k = larguraBase / 1400;
      scale!.style.transform = 'scale(' + k + ')';
      // transform não encolhe a caixa de layout: compensa pra rolagem parar no fim do print
      scale!.style.marginRight = -(1400 * (1 - k)) + 'px';
      wrap!.style.height = scale!.scrollHeight * k + 'px';
    }
    ajusta();
    requestAnimationFrame(ajusta);
    setTimeout(ajusta, 250);
    window.addEventListener('resize', ajusta);
    window.addEventListener('load', ajusta);
  })();

  // toque/clique no print abre ampliado
  (function () {
    const lb = document.getElementById('lb');
    const img = document.querySelector<HTMLImageElement>('#lb-img');
    function abre(src: string, alt: string) {
      if (!img || !lb) return;
      img.src = src; img.alt = alt || '';
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
      lb.scrollLeft = 0;
    }
    function fecha() { lb?.classList.remove('on'); document.body.style.overflow = ''; }
    document.querySelectorAll<HTMLImageElement>('.mk-shot img').forEach((el) => {
      el.parentElement?.addEventListener('click', () => abre(el.currentSrc || el.src, el.alt));
    });
    lb?.addEventListener('click', (e) => { if (e.target !== img) fecha(); });
    document.getElementById('lb-x')?.addEventListener('click', fecha);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecha(); });
  })();

  // carrosséis de print
  document.querySelectorAll('.car').forEach((car) => {
    const track = car.querySelector<HTMLElement>('.car-track');
    const dots = car.querySelector('.car-dots');
    if (!track || !dots) return;
    const slides = [...car.querySelectorAll('.car-slide')];
    slides.forEach((_, k) => {
      const b = document.createElement('b');
      b.addEventListener('click', () => go(k));
      dots.appendChild(b);
    });
    function atual() { return Math.round(track!.scrollLeft / track!.clientWidth); }
    function pinta() {
      const a = atual();
      [...dots!.children].forEach((b, k) => b.classList.toggle('on', k === a));
    }
    function go(k: number) {
      const alvo = Math.max(0, Math.min(slides.length - 1, k));
      track!.scrollTo({ left: alvo * track!.clientWidth, behavior: 'smooth' });
    }
    car.querySelectorAll<HTMLElement>('.car-arrow').forEach((btn) => {
      btn.addEventListener('click', () => go(atual() + Number(btn.dataset.dir)));
    });
    let timer: number;
    track.addEventListener('scroll', () => { window.clearTimeout(timer); timer = window.setTimeout(pinta, 80); });
    pinta();
    requestAnimationFrame(() => { track!.scrollLeft = 0; pinta(); });
    window.addEventListener('load', pinta);
  });

  // reveal on scroll
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  function revelaSeVisivel(el: Element) {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.98 && r.bottom > -40) el.classList.add('visible');
  }
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    revelaSeVisivel(el);
    observer.observe(el);
  });
  // rede de segurança: se por qualquer motivo o observer não disparar, nada fica invisível
  window.addEventListener('load', () => document.querySelectorAll('[data-reveal]').forEach(revelaSeVisivel));
  window.setTimeout(() => document.querySelectorAll('[data-reveal]').forEach(revelaSeVisivel), 1500);
  window.setTimeout(() => document.querySelectorAll('[data-reveal]:not(.visible)').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 2) el.classList.add('visible');
  }), 3000);

  // seletor de faixa de conversas (hero)
  const PLANS = [...document.querySelectorAll('.plano-card')].map(card => ({
    price: card.querySelector('.plano-price')?.childNodes[0]?.textContent || '',
    meta: card.querySelector('.plano-meta')?.textContent || '',
  }));
  const planRange = document.querySelector<HTMLInputElement>('#plan-range');
  const planPrice = document.getElementById('plan-price');
  const planMeta = document.getElementById('plan-meta');
  function updatePlanSelector() {
    if (!planRange || !planPrice || !planMeta) return;
    const i = +planRange.value;
    const pct = (i / (Number(planRange.max) - Number(planRange.min))) * 100;
    planRange.style.setProperty('--pct', pct + '%');
    if (!PLANS[i]) return;
    planPrice.innerHTML = PLANS[i].price + '<span>/mês</span>';
    planMeta.textContent = PLANS[i].meta;
  }
  if (planRange) planRange.addEventListener('input', updatePlanSelector);
  updatePlanSelector();

  document.querySelectorAll<HTMLElement>('.faq-q').forEach(question => {
    question.setAttribute('role', 'button');
    question.tabIndex = 0;
    question.setAttribute('aria-expanded', 'false');
    function toggle() {
      const open = question.parentElement?.classList.toggle('open') || false;
      question.setAttribute('aria-expanded', String(open));
    }
    question.addEventListener('click', toggle);
    question.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
    });
  });

export {};

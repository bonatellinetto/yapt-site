function setupReveals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
      delete entry.target.dataset.pending;
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px 30px 0px' });
  document.querySelectorAll<HTMLElement>('.home-reveal').forEach(element => {
    if (element.getBoundingClientRect().top <= innerHeight) return;
    element.dataset.pending = 'true';
    observer.observe(element);
  });
}

setupReveals();

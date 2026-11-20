import { initializeResponsiveScenarios } from './scenario-modes';

const initializeMarketing = () => {
  const root = document.querySelector<HTMLElement>('[data-marketing-scenarios]');
  if (root) initializeResponsiveScenarios(root);
  const dialog = document.querySelector<HTMLDialogElement>('[data-marketing-dialog]');
  if (!dialog || dialog.dataset.initialized) return;
  dialog.dataset.initialized = 'true';
  const image = dialog.querySelector<HTMLImageElement>('[data-marketing-dialog-image]');
  const heading = dialog.querySelector<HTMLElement>('[data-marketing-dialog-title]');
  let trigger: HTMLAnchorElement | undefined;
  let previousOverflow = '';
  let previousRootOverflow = '';
  const close = () => dialog.close();
  document.querySelectorAll<HTMLAnchorElement>('[data-marketing-image]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || typeof dialog.showModal !== 'function' || !image || !heading) return;
      event.preventDefault(); trigger = link;
      image.src = link.href; image.alt = link.dataset.imageAlt || link.querySelector('img')?.alt || link.dataset.imageTitle || '';
      heading.textContent = link.dataset.imageTitle || image.alt;
      previousOverflow = document.body.style.overflow;
      previousRootOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
    });
  });
  dialog.querySelector('[data-marketing-dialog-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const b = dialog.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; document.documentElement.style.overflow = previousRootOverflow; trigger?.focus({preventScroll:true}); });
};
initializeMarketing();
document.addEventListener('astro:page-load', initializeMarketing);

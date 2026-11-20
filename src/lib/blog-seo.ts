import type { BlogPost } from './blog';
import type { Locale } from './i18n';

/** Accept legacy short/underscore locale values while keeping Portuguese as the default. */
export function getPostLocale(post: Pick<BlogPost, 'locale'>): Locale {
  const locale = String(post.locale || '').trim().toLowerCase().replaceAll('_', '-');
  if (/^en(?:-|$)/.test(locale)) return 'en-US';
  if (/^es(?:-|$)/.test(locale)) return 'es-ES';
  return 'pt-BR';
}

/** The page supplies the article H1; CMS headings belong inside its sections. */
export function articleContent(html: string | null): string {
  return (html || '').replace(/<(\/?)h1(?=[\s>])/gi, '<$1h2')
    .replace(/<a\b[^>]*>/gi, tag => tag.replace(/(\s)href\s*=\s*(["'])(.*?)\2/i,
      (_attribute, space: string, quote: string, href: string) => `${space}href=${quote}${articleLink(href)}${quote}`));
}

/** Keep editorial calls to action working after retiring the old product pages. */
function articleLink(href: string): string {
  let url: URL;
  try { url = new URL(href, 'https://yapt.ai'); } catch { return href; }
  if (!['https:', 'http:'].includes(url.protocol) || !['yapt.ai', 'www.yapt.ai'].includes(url.hostname)) return href;
  const prefix = url.pathname.match(/^\/(en|es)(?=\/|$)/)?.[0] || '';
  const path = url.pathname.slice(prefix.length).replace(/\/+$/, '') || '/';
  const destinations: Record<string, string> = { '/conversations': '/support', '/pricing': '/#diagnostico' };
  const destination = destinations[path];
  if (!destination) return href;
  const target = new URL(`${prefix}${destination}`, 'https://yapt.ai');
  target.search = url.search;
  return `${target.pathname}${target.search}${target.hash}`;
}

export function articleAuthor(name: string): Record<string, unknown> {
  return name === 'yapt.'
    ? { '@type': 'Organization', name, url: 'https://yapt.ai' }
    : { '@type': 'Person', name };
}

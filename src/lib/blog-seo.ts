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
  return (html || '').replace(/<(\/?)h1(?=[\s>])/gi, '<$1h2');
}

export function articleAuthor(name: string): Record<string, unknown> {
  return name === 'yapt.'
    ? { '@type': 'Organization', name, url: 'https://yapt.ai' }
    : { '@type': 'Person', name };
}

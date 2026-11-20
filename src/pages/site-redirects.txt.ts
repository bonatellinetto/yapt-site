import type { APIRoute } from 'astro';
import staticRedirects from '../../public/_redirects?raw';
import { getAllPublishedPosts } from '../lib/blog';
import { getPostLocale } from '../lib/blog-seo';
import { localePath, locales } from '../lib/i18n';
import { getCanonical } from '../lib/seo';

/** Temporary build artifact; the final integration moves it to Cloudflare's _redirects. */
export const GET: APIRoute = async () => {
  const posts = await getAllPublishedPosts();
  const redirects = posts.flatMap(post => {
    const locale = getPostLocale(post);
    const path = `/blog/${post.slug}`;
    return locales.filter(candidate => candidate !== locale)
      .map(candidate => `${localePath(path, candidate)} ${getCanonical(path, locale)} 301`);
  });
  return new Response(`${staticRedirects.trim()}\n\n# Artigos: manter URLs antigas no idioma real do conteúdo\n${redirects.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

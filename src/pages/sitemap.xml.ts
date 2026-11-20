import type { APIRoute } from 'astro';
import { getAllPublishedPosts } from '../lib/blog';
import { getPostLocale } from '../lib/blog-seo';
import { getLocaleFromPath, localeHreflang, stripLocalePrefix, type Locale } from '../lib/i18n';
import { getCanonical } from '../lib/seo';
import { getIndexableStaticPaths, getRouteLocales } from '../lib/site-routes';

const xmlEntities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, character => xmlEntities[character]);
}

function buildUrlEntry(path: string, locale: Locale, availableLocales: Locale[], lastmod?: string): string {
  const loc = escapeXml(getCanonical(path, locale));
  const alternates = availableLocales.map(alternate =>
    `    <xhtml:link rel="alternate" hreflang="${localeHreflang[alternate]}" href="${escapeXml(getCanonical(path, alternate))}" />`);
  const defaultLocale = availableLocales.includes('pt-BR') ? 'pt-BR' : availableLocales[0];
  if (defaultLocale) alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(getCanonical(path, defaultLocale))}" />`);
  return ['  <url>', `    <loc>${loc}</loc>`, ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []), ...alternates, '  </url>'].join('\n');
}

function validLastmod(value: string | null): string | undefined {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.toISOString().split('T')[0] : undefined;
}

export const GET: APIRoute = async () => {
  const posts = await getAllPublishedPosts();
  const urls = getIndexableStaticPaths().map(path => {
    const basePath = stripLocalePrefix(path);
    return buildUrlEntry(basePath, getLocaleFromPath(path), getRouteLocales(basePath));
  });
  for (const post of posts) {
    const locale = getPostLocale(post);
    urls.push(buildUrlEntry(`/blog/${post.slug}`, locale, [locale], validLastmod(post.updated_at || post.published_at)));
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

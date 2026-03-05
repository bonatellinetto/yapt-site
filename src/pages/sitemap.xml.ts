import type { APIRoute } from 'astro';
import { getAllPublishedPosts } from '../lib/blog';

const SITE = 'https://yapt.ai';

const staticPages = [
  '/',
  '/conversations',
  '/intelligence',
  '/sales',
  '/marketing-site',
  '/automations',
  '/operations',
  '/integrations',
  '/for-enterprise',
  '/trust',
  '/pricing',
  '/privacy',
  '/terms',
  '/blog',
  '/partners',
];

const locales = [
  { prefix: '', hreflang: 'pt-BR' },
  { prefix: '/en', hreflang: 'en' },
  { prefix: '/es', hreflang: 'es' },
];

function buildUrlEntry(path: string, lastmod?: string, priority?: string): string {
  const lines: string[] = [];
  lines.push('  <url>');
  lines.push(`    <loc>${SITE}${path}</loc>`);
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);

  // hreflang alternates
  for (const locale of locales) {
    const href = path === '/' ? (locale.prefix || '/') : `${locale.prefix}${path}`;
    lines.push(`    <xhtml:link rel="alternate" hreflang="${locale.hreflang}" href="${SITE}${href}" />`);
  }
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${path}" />`);

  lines.push('  </url>');
  return lines.join('\n');
}

export const GET: APIRoute = async () => {
  const posts = await getAllPublishedPosts();
  const today = new Date().toISOString().split('T')[0];

  const urls: string[] = [];

  // Static pages (all locales)
  for (const page of staticPages) {
    const priority = page === '/' ? '1.0' : page === '/blog' ? '0.8' : '0.7';
    for (const locale of locales) {
      const fullPath = page === '/' ? (locale.prefix || '/') : `${locale.prefix}${page}`;
      urls.push(buildUrlEntry(fullPath, today, priority));
    }
  }

  // Blog posts (pt-BR only for now)
  for (const post of posts) {
    const lastmod = post.updated_at ? post.updated_at.split('T')[0] : today;
    urls.push(buildUrlEntry(`/blog/${post.slug}`, lastmod, '0.6'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

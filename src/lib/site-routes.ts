import { localePath, locales, stripLocalePrefix, type Locale } from './i18n';

const pageSources = import.meta.glob<string>('../pages/**/*.astro', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const aliases = new Set(['/integrations']);
const noindexPattern = /\bnoindex\s*=\s*(?:\{\s*true\s*\}|["']true["'])|<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i;

function routeFromFile(file: string): string {
  const route = file.replace('../pages', '').replace(/\.astro$/, '').replace(/\/index$/, '');
  return route || '/';
}

function isIndexablePage(file: string, source: string): boolean {
  const basePath = stripLocalePrefix(routeFromFile(file));
  return !file.includes('[') && basePath !== '/404' && !aliases.has(basePath) && !noindexPattern.test(source);
}

const indexablePaths = Object.entries(pageSources)
  .filter(([file, source]) => isIndexablePage(file, source))
  .map(([file]) => routeFromFile(file))
  .sort();
const indexableRoutes = new Set(indexablePaths);

/** Dynamic articles are resolved from their real post locale, rather than file names. */
export function getRouteLocales(path: string): Locale[] {
  const cleanPath = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const basePath = stripLocalePrefix(cleanPath);
  return locales.filter(locale => indexableRoutes.has(localePath(basePath, locale)));
}

export function getIndexableStaticPaths(): string[] {
  return [...indexablePaths];
}

import ptBRSite from '../i18n/pt-BR/site.json';
import enUSSite from '../i18n/en-US/site.json';
import esESSite from '../i18n/es-ES/site.json';
import ptBRPartner from '../i18n/pt-BR/partner.json';
import enUSPartner from '../i18n/en-US/partner.json';
import esESPartner from '../i18n/es-ES/partner.json';

export type Locale = 'pt-BR' | 'en-US' | 'es-ES';

export const defaultLocale: Locale = 'pt-BR';

export const locales: Locale[] = ['pt-BR', 'en-US', 'es-ES'];

export const localePrefix: Record<Locale, string> = {
  'pt-BR': '',
  'en-US': '/en',
  'es-ES': '/es',
};

export const localeHreflang: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  'en-US': 'en',
  'es-ES': 'es',
};

export const localeHtmlLang: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  'en-US': 'en',
  'es-ES': 'es',
};

export const languages = [
  { code: 'pt-BR' as Locale, label: 'PT', flag: '\u{1F1E7}\u{1F1F7}' },
  { code: 'en-US' as Locale, label: 'EN', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'es-ES' as Locale, label: 'ES', flag: '\u{1F1EA}\u{1F1F8}' },
] as const;

const translations: Record<Locale, Record<string, any>> = {
  'pt-BR': { site: ptBRSite, partner: ptBRPartner },
  'en-US': { site: enUSSite, partner: enUSPartner },
  'es-ES': { site: esESSite, partner: esESPartner },
};

/**
 * Get a translated string by dot-notation key.
 * Usage: t('hero.title', 'pt-BR') or t('hero.title', 'en-US', 'site')
 */
export function t(key: string, locale: Locale = defaultLocale, namespace: string = 'site'): any {
  const ns = translations[locale]?.[namespace];
  if (!ns) return key;

  const parts = key.split('.');
  let result: any = ns;
  for (const part of parts) {
    result = result?.[part];
    if (result === undefined) return key;
  }
  return result;
}

/**
 * Get locale from URL path prefix.
 */
export function getLocaleFromPath(path: string): Locale {
  if (path.startsWith('/en/') || path === '/en') return 'en-US';
  if (path.startsWith('/es/') || path === '/es') return 'es-ES';
  return 'pt-BR';
}

/**
 * Get the path without locale prefix.
 */
export function stripLocalePrefix(path: string): string {
  if (path.startsWith('/en/')) return path.slice(3);
  if (path.startsWith('/es/')) return path.slice(3);
  if (path === '/en' || path === '/es') return '/';
  return path;
}

/**
 * Build a localized path.
 */
export function localePath(path: string, locale: Locale): string {
  const prefix = localePrefix[locale];
  const cleanPath = path === '/' ? '' : path;
  return `${prefix}${cleanPath}` || '/';
}

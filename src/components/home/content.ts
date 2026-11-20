import pt from '../../i18n/pt-BR/home.json';
import en from '../../i18n/en-US/home.json';
import es from '../../i18n/es-ES/home.json';
import { localePath, type Locale } from '../../lib/i18n';

export type HomeCopy = typeof pt;
export type AreaKey = keyof HomeCopy['areas'];
export const areaKeys: AreaKey[] = ['marketing', 'sales', 'support', 'operations', 'ai', 'teams'];

const copies: Record<Locale, HomeCopy> = {
  'pt-BR': pt,
  'en-US': en,
  'es-ES': es,
};

export function homeCopy(locale: Locale): HomeCopy {
  return copies[locale];
}

export const areaAnchors: Record<AreaKey, string> = {
  marketing: '#marketing', sales: '#vendas', support: '#suporte',
  operations: '#operacoes', ai: '#yaagents', teams: '/teams',
};

export function areaHref(key: AreaKey, locale: Locale): string {
  const path = areaAnchors[key];
  return path.startsWith('/') ? localePath(path, locale) : path;
}

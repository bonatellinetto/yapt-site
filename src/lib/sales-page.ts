import pt from '../i18n/pt-BR/sales-page.json';
import en from '../i18n/en-US/sales-page.json';
import es from '../i18n/es-ES/sales-page.json';
import type { Locale } from './i18n';
export type SalesCopy = typeof pt;
export const salesCopy = (locale: Locale): SalesCopy => ({'pt-BR':pt,'en-US':en,'es-ES':es}[locale]);

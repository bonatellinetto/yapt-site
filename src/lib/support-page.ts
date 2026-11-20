import pt from '../i18n/pt-BR/support-page.json';
import en from '../i18n/en-US/support-page.json';
import es from '../i18n/es-ES/support-page.json';
import type { Locale } from './i18n';
export type SupportCopy = typeof pt;
export const supportCopy = (locale: Locale): SupportCopy => ({'pt-BR':pt,'en-US':en,'es-ES':es}[locale]);

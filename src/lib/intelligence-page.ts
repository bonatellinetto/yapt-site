import pt from '../i18n/pt-BR/intelligence-page.json';
import en from '../i18n/en-US/intelligence-page.json';
import es from '../i18n/es-ES/intelligence-page.json';
import type { Locale } from './i18n';

export type IntelligenceCopy = typeof pt;
export const intelligenceCopy = (locale: Locale): IntelligenceCopy => ({
  'pt-BR': pt,
  'en-US': en,
  'es-ES': es,
}[locale]);

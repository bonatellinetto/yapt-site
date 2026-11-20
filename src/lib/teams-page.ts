import pt from '../i18n/pt-BR/teams-page.json';
import en from '../i18n/en-US/teams-page.json';
import es from '../i18n/es-ES/teams-page.json';
import type { Locale } from './i18n';

export type TeamsCopy = typeof pt;
export const teamsCopy = (locale: Locale): TeamsCopy => ({
  'pt-BR': pt,
  'en-US': en,
  'es-ES': es,
}[locale]);

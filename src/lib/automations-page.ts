import pt from '../i18n/pt-BR/automations-page.json';
import en from '../i18n/en-US/automations-page.json';
import es from '../i18n/es-ES/automations-page.json';
import type { Locale } from './i18n';

export type AutomationsCopy = typeof pt;
export const automationsCopy = (locale: Locale): AutomationsCopy => ({
  'pt-BR': pt,
  'en-US': en,
  'es-ES': es,
}[locale]);

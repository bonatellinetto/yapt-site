import pt from '../i18n/pt-BR/operations-page.json';
import en from '../i18n/en-US/operations-page.json';
import es from '../i18n/es-ES/operations-page.json';
import type { Locale } from './i18n';
export type OperationsCopy = typeof pt;
export const operationsCopy = (locale: Locale): OperationsCopy => ({'pt-BR':pt,'en-US':en,'es-ES':es}[locale]);

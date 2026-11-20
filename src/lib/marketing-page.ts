import pt from '../i18n/pt-BR/marketing-page.json';
import en from '../i18n/en-US/marketing-page.json';
import es from '../i18n/es-ES/marketing-page.json';
import type { Locale } from './i18n';
export type MarketingCopy = typeof pt;
export type SolutionScenariosCopy = Omit<MarketingCopy['scenarios'], 'conversionFeedback' | 'channels' | 'channelsLabel' | 'channelsNote'> & Partial<Pick<MarketingCopy['scenarios'], 'conversionFeedback' | 'channels' | 'channelsLabel' | 'channelsNote'>>;
export const marketingCopy = (locale: Locale): MarketingCopy => ({'pt-BR':pt,'en-US':en,'es-ES':es}[locale]);
export type MarketingScenario = MarketingCopy['scenarios']['items'][number];

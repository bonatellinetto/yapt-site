import type { Locale } from './i18n';
import { localeHreflang, localeHtmlLang, localePrefix } from './i18n';
import { getRouteLocales } from './site-routes';

export type StructuredData = Record<string, unknown>;
export const siteUrl = 'https://yapt.ai';
const publisherId = 'https://gonewway.ai/#organization';

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  jsonLd?: StructuredData[];
  noindex?: boolean;
}

export function normalizePagePath(path: string): string {
  let clean = `/${path.split(/[?#]/)[0]}`.replace(/\/+/g, '/').replace(/\.html$/, '');
  while (/^\/(en|es)(?=\/|$)/.test(clean)) clean = clean.replace(/^\/(en|es)(?=\/|$)/, '');
  return clean.replace(/\/$/, '') || '/';
}

export function getCanonical(path: string, locale: Locale): string {
  const clean = normalizePagePath(path);
  return `${siteUrl}${localePrefix[locale]}${clean === '/' ? '' : clean}`;
}

export function getHreflangAlternates(path: string): { hreflang: string; href: string }[] {
  const clean = normalizePagePath(path);
  const available = getRouteLocales(clean);
  const alternates = available.map(locale => ({ hreflang: localeHreflang[locale], href: getCanonical(clean, locale) }));
  if (available.includes('pt-BR')) alternates.push({ hreflang: 'x-default', href: getCanonical(clean, 'pt-BR') });
  return alternates;
}

export function pageTitle(title: string): string {
  const clean = title.replace(/^yapt\.\s*[—–|:]\s*/i, '').replace(/\s*\|\s*yapt(?:\.ai|\.)?(?:\s+(?:Blog|Insights|teams))?\s*$/i, '').trim();
  return `${clean} | yapt.`;
}

export function serializeJsonLd(data: StructuredData): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

export function organizationJsonLd(): StructuredData {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': publisherId,
    name: 'New Way', url: 'https://gonewway.ai',
    description: 'Empresa de inteligência artificial que ajuda negócios a gerar mais receita e eficiência operacional, com especialistas, tecnologia própria e consultoria.',
  };
}

export function websiteJsonLd(): StructuredData {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${siteUrl}/#website`,
    name: 'yapt.', url: siteUrl, inLanguage: ['pt-BR', 'en', 'es'],
    publisher: { '@id': publisherId },
    description: 'Plataforma de inteligência artificial aplicada a marketing, vendas, suporte e operações, com CRM no WhatsApp, agentes, automações, integrações e colaboração.',
  };
}

export function softwareApplicationJsonLd(): StructuredData {
  return {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', '@id': `${siteUrl}/#software`,
    name: 'yapt.', url: siteUrl, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
    description: 'Plataforma de inteligência artificial da New Way para marketing, vendas, suporte e operações. Conecta CRM no WhatsApp, agentes, copilotos, automações, integrações e times.',
    creator: { '@id': publisherId },
    featureList: ['Agentes de inteligência artificial e copilotos', 'IA para marketing e atribuição de receita', 'IA para vendas, CRM no WhatsApp e gestão de funis', 'IA para suporte, tickets e filas inteligentes', 'IA para operações e automação de processos', 'Integrações com sistemas da empresa', 'Times e colaboração no contexto da operação'],
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): StructuredData {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function webPageJsonLd(props: SEOProps): StructuredData {
  const canonical = getCanonical(props.path, props.locale);
  return {
    '@context': 'https://schema.org', '@type': normalizePagePath(props.path) === '/blog' ? 'CollectionPage' : 'WebPage',
    '@id': `${canonical}#webpage`, url: canonical, name: pageTitle(props.title), description: props.description,
    inLanguage: localeHtmlLang[props.locale], isPartOf: { '@id': `${siteUrl}/#website` },
  };
}

export function breadcrumbJsonLd(props: SEOProps): StructuredData {
  const homeLabel: Record<Locale, string> = { 'pt-BR': 'Início', 'en-US': 'Home', 'es-ES': 'Inicio' };
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabel[props.locale], item: getCanonical('/', props.locale) },
      { '@type': 'ListItem', position: 2, name: props.title.replace(/\s*\|.*$/, ''), item: getCanonical(props.path, props.locale) },
    ],
  };
}

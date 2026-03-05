import type { Locale } from './i18n';
import { localeHreflang, localePrefix, locales } from './i18n';

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>[];
  noindex?: boolean;
}

export function getCanonical(path: string, locale: Locale): string {
  const prefix = localePrefix[locale];
  const cleanPath = path === '/' ? '' : path;
  return `https://yapt.ai${prefix}${cleanPath}`;
}

export function getHreflangAlternates(path: string): { hreflang: string; href: string }[] {
  const cleanPath = path === '/' ? '' : path;
  const alternates = locales.map((loc) => ({
    hreflang: localeHreflang[loc],
    href: `https://yapt.ai${localePrefix[loc]}${cleanPath}`,
  }));
  // x-default points to pt-BR (default)
  alternates.push({
    hreflang: 'x-default',
    href: `https://yapt.ai${cleanPath}`,
  });
  return alternates;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'yapt.',
    url: 'https://yapt.ai',
    logo: 'https://yapt.ai/yapt-logo.svg',
    description: 'Conversational AI Platform — SaaS B2B multi-tenant',
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'yapt.',
    url: 'https://yapt.ai',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yapt.ai/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'yapt.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
  };
}

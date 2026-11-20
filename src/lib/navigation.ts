import { localePath, stripLocalePrefix, type Locale } from './i18n';

export interface NavigationLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavigationGroup {
  label: string;
  links: NavigationLink[];
}

interface NavigationCopy {
  label: string;
  home: string;
  menu: string;
  platform: string;
  language: string;
  insights: string;
  login: string;
  diagnosis: string;
  unavailable: string;
  primary: NavigationLink[];
  groups: NavigationGroup[];
}

export const navigationCopy: Record<Locale, NavigationCopy> = {
  'pt-BR': {
    label: 'Navegação principal', home: 'yapt. — início', menu: 'Menu de navegação',
    platform: 'Plataforma', language: 'Idioma', insights: 'Insights', login: 'Entrar',
    diagnosis: 'Pedir diagnóstico', unavailable: 'Não foi possível abrir o atendimento. Tente novamente em instantes.',
    primary: [
      { label: 'Início', href: '/' },
      { label: 'Marketing', href: '/marketing-site' },
      { label: 'Vendas', href: '/sales' },
      { label: 'Suporte', href: '/support' },
    ],
    groups: [
      { label: 'Gestão', links: [
        { label: 'Operações', href: '/operations', description: 'Visibilidade para decidir e agir.' },
        { label: 'Times e colaboração', href: '/teams', description: 'Pessoas, discussões e contexto do atendimento.' },
      ] },
      { label: 'Construção', links: [
        { label: 'IA e Integrações', href: '/intelligence', description: 'Agentes, copilotos e conexões com seu contexto.' },
        { label: 'Automações', href: '/automations', description: 'Fluxos que fazem o trabalho avançar.' },
      ] },
    ],
  },
  'en-US': {
    label: 'Main navigation', home: 'yapt. — home', menu: 'Navigation menu',
    platform: 'Platform', language: 'Language', insights: 'Insights', login: 'Log in',
    diagnosis: 'Get a diagnosis', unavailable: 'We could not open the chat. Please try again shortly.',
    primary: [
      { label: 'Home', href: '/' },
      { label: 'Marketing', href: '/marketing-site' },
      { label: 'Sales', href: '/sales' },
      { label: 'Support', href: '/support' },
    ],
    groups: [
      { label: 'Management', links: [
        { label: 'Operations', href: '/operations', description: 'Clarity to make decisions and act.' },
        { label: 'Teams & collaboration', href: '/teams', description: 'People, discussions and customer conversation context.' },
      ] },
      { label: 'Build', links: [
        { label: 'AI & Integrations', href: '/intelligence', description: 'Agents, copilots and connections with your context.' },
        { label: 'Automations', href: '/automations', description: 'Flows that move work forward.' },
      ] },
    ],
  },
  'es-ES': {
    label: 'Navegación principal', home: 'yapt. — inicio', menu: 'Menú de navegación',
    platform: 'Plataforma', language: 'Idioma', insights: 'Insights', login: 'Entrar',
    diagnosis: 'Pedir diagnóstico', unavailable: 'No se pudo abrir el chat. Inténtalo de nuevo en unos instantes.',
    primary: [
      { label: 'Inicio', href: '/' },
      { label: 'Marketing', href: '/marketing-site' },
      { label: 'Ventas', href: '/sales' },
      { label: 'Soporte', href: '/support' },
    ],
    groups: [
      { label: 'Gestión', links: [
        { label: 'Operaciones', href: '/operations', description: 'Visibilidad para decidir y actuar.' },
        { label: 'Equipos y colaboración', href: '/teams', description: 'Personas, debates y contexto de atención.' },
      ] },
      { label: 'Construcción', links: [
        { label: 'IA e Integraciones', href: '/intelligence', description: 'Agentes, copilotos y conexiones con tu contexto.' },
        { label: 'Automatizaciones', href: '/automations', description: 'Flujos que hacen avanzar el trabajo.' },
      ] },
    ],
  },
};

export interface NavigationLanguage {
  code: Locale;
  short: string;
  name: string;
  href: string;
  preserveRoute: boolean;
}

const pageRoutes = new Set(Object.keys(import.meta.glob('../pages/**/*.astro')).map(file =>
  file.replace('../pages', '').replace(/\/index\.astro$/, '/').replace(/\.astro$/, '').replace(/\/$/, '') || '/',
));

function routeExists(path: string): boolean {
  if (pageRoutes.has(path)) return true;
  // All three blog routes generate the same published slugs from the same source.
  const blogRoute = path.replace(/\/blog\/[^/]+$/, '/blog/[slug]');
  return blogRoute !== path && pageRoutes.has(blogRoute);
}

export function navigationLanguages(pathname: string): NavigationLanguage[] {
  // Astro's file output exposes .html paths during the static build.
  const canonicalPath = pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  const route = stripLocalePrefix(canonicalPath).replace(/\/$/, '') || '/';
  const options: { code: Locale; short: string; name: string }[] = [
    { code: 'pt-BR', short: 'PT', name: 'Português' },
    { code: 'en-US', short: 'EN', name: 'English' },
    { code: 'es-ES', short: 'ES', name: 'Español' },
  ];
  return options.map(option => {
    const href = localePath(route, option.code);
    const preserveRoute = routeExists(href);
    return { ...option, href: preserveRoute ? href : localePath('/', option.code), preserveRoute };
  });
}

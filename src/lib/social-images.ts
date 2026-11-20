import { stripLocalePrefix, type Locale } from './i18n';

export interface SocialImage {
  url: string;
  width?: number;
  height?: number;
  type?: string;
  alt: string;
}

type SocialPage = 'home' | 'marketing' | 'sales' | 'support' | 'operations' | 'intelligence' | 'automations' | 'teams';
const pages: Record<string, SocialPage> = {
  '/': 'home', '/marketing-site': 'marketing', '/sales': 'sales', '/support': 'support',
  '/operations': 'operations', '/intelligence': 'intelligence', '/integrations': 'intelligence',
  '/automations': 'automations', '/teams': 'teams',
};
const folders: Record<Locale, string> = {
  "pt-BR": "pt-br",
  "en-US": "en",
  "es-ES": "es"
};
const imageAlt: Record<Locale, Record<SocialPage, string>> = {
  "pt-BR": {
    "home": "Marca yapt. em fundo verde com o texto “Mais receita. Mais eficiência operacional.”",
    "marketing": "Marca yapt. em fundo verde com o texto “Da campanha à receita. Com IA.”",
    "sales": "Marca yapt. em fundo verde com o texto “Mais negócios. Mais produtividade.”",
    "support": "Marca yapt. em fundo verde com o texto “Mais resoluções. Menos espera.”",
    "operations": "Marca yapt. em fundo verde com o texto “Mais capacidade. Menos desperdício.”",
    "intelligence": "Marca yapt. em fundo verde com o texto “Agentes e copilotos. Integrações. Por conversa.”",
    "automations": "Marca yapt. em fundo verde com o texto “Menos tarefas manuais. Mais continuidade.”",
    "teams": "Marca yapt. em fundo verde com o texto “Colabore com o contexto certo.”"
  },
  "en-US": {
    "home": "The yapt. logo on a green background with the message “More revenue. More operational efficiency.”",
    "marketing": "The yapt. logo on a green background with the message “From campaigns to revenue. With AI.”",
    "sales": "The yapt. logo on a green background with the message “More deals. More productivity.”",
    "support": "The yapt. logo on a green background with the message “More resolutions. Less waiting.”",
    "operations": "The yapt. logo on a green background with the message “More capacity. Less wasted effort.”",
    "intelligence": "The yapt. logo on a green background with the message “Agents and copilots. Integrations. Built through chat.”",
    "automations": "The yapt. logo on a green background with the message “Less manual work. More continuity.”",
    "teams": "The yapt. logo on a green background with the message “Collaborate with the right context.”"
  },
  "es-ES": {
    "home": "Logotipo de yapt. sobre fondo verde con el texto «Más ingresos. Más eficiencia operativa.»",
    "marketing": "Logotipo de yapt. sobre fondo verde con el texto «De la campaña a los ingresos. Con IA.»",
    "sales": "Logotipo de yapt. sobre fondo verde con el texto «Más negocios. Más productividad.»",
    "support": "Logotipo de yapt. sobre fondo verde con el texto «Más soluciones. Menos espera.»",
    "operations": "Logotipo de yapt. sobre fondo verde con el texto «Más capacidad. Menos desperdicio.»",
    "intelligence": "Logotipo de yapt. sobre fondo verde con el texto «Agentes y copilotos. Integraciones. Por conversación.»",
    "automations": "Logotipo de yapt. sobre fondo verde con el texto «Menos tareas manuales. Más continuidad.»",
    "teams": "Logotipo de yapt. sobre fondo verde con el texto «Colabora con el contexto correcto.»"
  }
};

export function getSocialImage(path: string, locale: Locale): SocialImage {
  const clean = (path.split(/[?#]/, 1)[0] || '/').replace(/\.html$/, '').replace(/\/index$/, '/');
  const route = stripLocalePrefix(clean).replace(/\/+$/, '') || '/';
  const page = pages[route];
  if (!page) return { url: '/social/' + folders[locale] + '/home-v2.png', width: 1200, height: 630, type: 'image/png', alt: imageAlt[locale].home };
  return {
    url: '/social/' + folders[locale] + '/' + page + '-v2.png',
    width: 1200, height: 630, type: 'image/png', alt: imageAlt[locale][page],
  };
}

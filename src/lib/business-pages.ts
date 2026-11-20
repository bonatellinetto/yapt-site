import type { Locale } from './i18n';
import { supportPages } from './business-pages-support';
import { expansionPages } from './business-pages-expansion';

export type BusinessArea = 'support' | 'expansion';

export interface BusinessCapability {
  title: string;
  description: string;
  detail: string;
}

export interface BusinessPageContent {
  meta: { title: string; description: string };
  label: string;
  title: string;
  emphasis: string;
  intro: string;
  promise: string;
  capabilitiesTitle: string;
  capabilitiesIntro: string;
  capabilities: BusinessCapability[];
  visual: { label: string; title: string; steps: string[]; context: string; note: string };
  proof: { eyebrow: string; title: string; description: string; images: BusinessImage[]; caption: string };
  connection: { title: string; description: string; links: { label: string; path: string }[] };
  cta: { title: string; description: string };
}

export interface BusinessImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const businessPages: Record<BusinessArea, Record<Locale, BusinessPageContent>> = {
  support: supportPages,
  expansion: expansionPages,
};

export const businessCommon: Record<Locale, { diagnose: string; explore: string; platform: string; enlarge: string; availability: string }> = {
  'pt-BR': {
    diagnose: 'Quero um diagnóstico', explore: 'Conhecer os recursos', platform: 'Áreas conectadas', enlarge: 'Abrir imagem ampliada',
    availability: 'Recursos disponíveis conforme o plano, as permissões e a configuração da sua operação.',
  },
  'en-US': {
    diagnose: 'Get a business assessment', explore: 'Explore the capabilities', platform: 'Connected teams', enlarge: 'Open full-size image',
    availability: 'Feature availability depends on your plan, permissions and operational setup.',
  },
  'es-ES': {
    diagnose: 'Quiero un diagnóstico', explore: 'Conocer las funciones', platform: 'Áreas conectadas', enlarge: 'Abrir imagen ampliada',
    availability: 'Las funciones disponibles dependen del plan, los permisos y la configuración de tu operación.',
  },
};

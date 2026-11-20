import type { Locale } from './i18n';
import { whatsappHref } from './whatsapp';

export type DiagnosticTopic = 'home' | 'marketing' | 'sales' | 'support' | 'operations' | 'intelligence' | 'automations' | 'teams' | 'insights' | 'general';
export interface DiagnosticCopy {
  eyebrow: string;
  title: string;
  description: string;
  button: string;
  footnote: string;
  error: string;
  fallback: string;
  contactHref: string;
  deliveryLabel: string;
  deliveryModes: string[];
  recoveryTitle: string;
  close: string;
  loading: string;
}
type TopicCopy = Pick<DiagnosticCopy, 'title' | 'description'>;
type SharedCopy = Omit<DiagnosticCopy, 'title' | 'description' | 'contactHref'>;

const shared: Record<Locale, SharedCopy> = {
  'pt-BR': {
    eyebrow: 'Seu próximo ganho começa aqui',
    button: 'Quero um diagnóstico',
    footnote: 'Uma conversa para entender sua operação e definir prioridades.',
    error: 'Não conseguimos abrir o diagnóstico agora. Você pode continuar pelo WhatsApp.',
    fallback: 'Continuar pelo WhatsApp',
    deliveryLabel: 'Um caminho para o seu momento',
    deliveryModes: ['Especialistas + plataforma', 'Plataforma', 'Consultoria'],
    recoveryTitle: 'Vamos continuar pelo WhatsApp',
    close: 'Fechar',
    loading: 'Abrindo atendimento…',
  },
  'en-US': {
    eyebrow: 'Your next improvement starts here',
    button: 'Get a diagnosis',
    footnote: 'A conversation to understand your operation and set priorities.',
    error: 'We could not open the diagnosis right now. You can continue on WhatsApp.',
    fallback: 'Continue on WhatsApp',
    deliveryLabel: 'An approach for your current needs',
    deliveryModes: ['Specialists + platform', 'Platform', 'Consulting'],
    recoveryTitle: 'Let’s continue on WhatsApp',
    close: 'Close',
    loading: 'Opening the chat…',
  },
  'es-ES': {
    eyebrow: 'Tu próxima mejora empieza aquí',
    button: 'Quiero un diagnóstico',
    footnote: 'Una conversación para entender tu operación y definir prioridades.',
    error: 'No pudimos abrir el diagnóstico ahora. Puedes continuar por WhatsApp.',
    fallback: 'Continuar por WhatsApp',
    deliveryLabel: 'Un camino para tu momento',
    deliveryModes: ['Especialistas + plataforma', 'Plataforma', 'Consultoría'],
    recoveryTitle: 'Continuemos por WhatsApp',
    close: 'Cerrar',
    loading: 'Abriendo la atención…',
  },
};

const topics: Record<Locale, Record<DiagnosticTopic, TopicCopy>> = {
  'pt-BR': {
    home: {
      title: 'Onde sua operação pode render mais?',
      description: 'Vamos identificar os gargalos de receita e produtividade e definir onde aplicar IA, plataforma e especialistas.',
    },
    marketing: {
      title: 'Onde seu marketing deixa receita na mesa?',
      description: 'Vamos olhar da campanha à venda para encontrar perdas de investimento, continuidade e conversão.',
    },
    sales: {
      title: 'Onde suas oportunidades deixam de avançar?',
      description: 'Vamos encontrar o que reduz a conversão e toma o tempo do vendedor, com IA e especialistas olhando para o seu funil.',
    },
    support: {
      title: 'Quanto custa um atendimento que não avança?',
      description: 'Vamos mapear esperas, retrabalho e falta de contexto para aplicar IA onde ela pode melhorar a experiência e a produtividade.',
    },
    operations: {
      title: 'Onde o trabalho para e a eficiência se perde?',
      description: 'Vamos identificar gargalos entre filas, pessoas e sistemas e definir prioridades para uma operação mais eficiente.',
    },
    intelligence: {
      title: 'Que parte da sua operação a IA pode assumir?',
      description: 'Vamos identificar onde agentes, copilotos e conexões podem atender, orientar seu time e executar tarefas com os seus dados.',
    },
    automations: {
      title: 'O que ainda depende de alguém lembrar de fazer?',
      description: 'Vamos mapear tarefas, retornos e passagens entre etapas para construir automações conectadas à sua jornada.',
    },
    teams: {
      title: 'Quanto tempo se perde entre discutir e resolver?',
      description: 'Vamos entender onde o contexto se perde entre pessoas e ferramentas e como conectar a colaboração à operação.',
    },
    insights: {
      title: 'Como aplicar isso à realidade da sua empresa?',
      description: 'Converse com nossos especialistas para identificar os gargalos da sua operação e os próximos passos para aplicar IA.',
    },
    general: {
      title: 'Vamos encontrar os gargalos da sua operação?',
      description: 'Entenda onde sua empresa pode ganhar receita e eficiência com inteligência artificial, plataforma e especialistas.',
    },
  },
  'en-US': {
    home: {
      title: 'Where could your operation deliver more?',
      description: 'Let’s identify revenue and productivity bottlenecks and decide where to apply AI, our platform and specialists.',
    },
    marketing: {
      title: 'Where is your marketing leaving revenue behind?',
      description: 'Let’s look from campaign to sale to find wasted investment, missed follow-ups and conversion gaps.',
    },
    sales: {
      title: 'Where do your opportunities stop moving forward?',
      description: 'Let’s find what limits conversion and takes up sellers’ time, with AI and specialists focused on your pipeline.',
    },
    support: {
      title: 'What does unresolved customer service cost?',
      description: 'Let’s map waiting times, rework and missing context to apply AI where it can improve the experience and productivity.',
    },
    operations: {
      title: 'Where does work stall and efficiency get lost?',
      description: 'Let’s identify bottlenecks between queues, people and systems and set priorities for a more efficient operation.',
    },
    intelligence: {
      title: 'Which part of your operation could AI take on?',
      description: 'Let’s identify where agents, copilots and connections can serve customers, guide your team and act on your data.',
    },
    automations: {
      title: 'What still relies on someone remembering?',
      description: 'Let’s map tasks, follow-ups and handoffs to build automations connected to your customer journey.',
    },
    teams: {
      title: 'How much time gets lost between discussion and resolution?',
      description: 'Let’s understand where context gets lost between people and tools and connect collaboration to your operation.',
    },
    insights: {
      title: 'How could this work in your company?',
      description: 'Talk to our specialists to identify operational bottlenecks and the next steps for applying AI.',
    },
    general: {
      title: 'Let’s find the bottlenecks in your operation.',
      description: 'Understand where your company can improve revenue and efficiency with artificial intelligence, our platform and specialists.',
    },
  },
  'es-ES': {
    home: {
      title: '¿Dónde puede rendir más tu operación?',
      description: 'Identifiquemos los obstáculos de ingresos y productividad para definir dónde aplicar IA, plataforma y especialistas.',
    },
    marketing: {
      title: '¿Dónde está perdiendo ingresos tu marketing?',
      description: 'Revisemos desde la campaña hasta la venta para encontrar pérdidas de inversión, continuidad y conversión.',
    },
    sales: {
      title: '¿Dónde dejan de avanzar tus oportunidades?',
      description: 'Encontremos qué reduce la conversión y consume el tiempo del vendedor, con IA y especialistas enfocados en tu embudo.',
    },
    support: {
      title: '¿Cuánto cuesta una atención que no avanza?',
      description: 'Identifiquemos esperas, trabajo repetido y falta de contexto para aplicar IA donde pueda mejorar la experiencia y la productividad.',
    },
    operations: {
      title: '¿Dónde se detiene el trabajo y se pierde eficiencia?',
      description: 'Identifiquemos obstáculos entre colas, personas y sistemas para definir las prioridades de una operación más eficiente.',
    },
    intelligence: {
      title: '¿Qué parte de tu operación puede asumir la IA?',
      description: 'Identifiquemos dónde agentes, copilotos y conexiones pueden atender, orientar a tu equipo y ejecutar tareas con tus datos.',
    },
    automations: {
      title: '¿Qué sigue dependiendo de que alguien se acuerde?',
      description: 'Revisemos tareas, seguimientos y traspasos entre etapas para crear automatizaciones conectadas a tu recorrido.',
    },
    teams: {
      title: '¿Cuánto tiempo se pierde entre conversar y resolver?',
      description: 'Entendamos dónde se pierde el contexto entre personas y herramientas para conectar la colaboración con la operación.',
    },
    insights: {
      title: '¿Cómo aplicar esto a la realidad de tu empresa?',
      description: 'Conversa con nuestros especialistas para identificar los obstáculos de tu operación y los próximos pasos para aplicar IA.',
    },
    general: {
      title: 'Encontremos los obstáculos de tu operación.',
      description: 'Descubre dónde tu empresa puede mejorar ingresos y eficiencia con inteligencia artificial, plataforma y especialistas.',
    },
  },
};

export function diagnosticCopy(locale: Locale, topic: DiagnosticTopic = 'general'): DiagnosticCopy {
  return { ...shared[locale], ...topics[locale][topic], contactHref: whatsappHref };
}

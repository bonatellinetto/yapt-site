import type { Locale } from './i18n';
import type { BusinessPageContent } from './business-pages';

export const expansionPages: Record<Locale, BusinessPageContent> = {
  'pt-BR': {
    meta: { title: 'Expansão e pós-venda com contexto do cliente', description: 'Use carteiras, segmentação e réguas do yapt. para organizar o pós-venda, reativar relacionamentos e acompanhar novas oportunidades na sua base.' },
    label: 'yapt. para Expansão e pós-venda', title: 'A próxima oportunidade pode estar', emphasis: 'na sua própria base.',
    intro: 'Continue a relação depois da venda. Use o histórico do cliente para organizar carteiras, criar públicos e manter o contato com mais contexto.',
    promise: 'Uma relação que continua. Novas oportunidades com contexto.',
    capabilitiesTitle: 'Faça a base voltar para a sua rotina.',
    capabilitiesIntro: 'Combine carteiras, públicos, réguas e vendas que já fazem parte do yapt. para estruturar o seu pós-venda.',
    capabilities: [
      { title: 'Uma carteira com responsáveis', description: 'Organize os clientes em carteiras com equipe, membros, metas e roteamento. Acompanhe conversas e negócios para manter a continuidade do relacionamento.', detail: 'Carteiras · Responsáveis · Metas' },
      { title: 'Públicos que fazem sentido', description: 'Segmente a base por compra, etapa, etiquetas e interações. Escolha com quem falar a partir do relacionamento que já existe.', detail: 'Segmentação · Histórico de compra · Jornada' },
      { title: 'Contato que continua após a venda', description: 'Monte réguas de WhatsApp e e-mail com gatilhos do ciclo do cliente. Organize ações de acompanhamento e reativação com pausas e etapas definidas.', detail: 'Réguas · WhatsApp e e-mail · Reativação' },
      { title: 'Oportunidades ligadas à receita', description: 'Conecte conversas, negócios e vendas. Veja a receita e as oportunidades da carteira para orientar a próxima ação do time.', detail: 'Conversas · Negócios · Receita' },
    ],
    visual: { label: 'Relacionamento que continua', title: 'Depois da venda, o próximo capítulo.', steps: ['Cliente na carteira', 'Contato com contexto', 'Nova oportunidade'], context: 'Histórico, públicos e réguas no mesmo caminho', note: 'Visão ilustrativa de um uso de pós-venda' },
    proof: {
      eyebrow: 'Da relação à próxima oportunidade', title: 'A próxima venda também precisa de um caminho.',
      description: 'Quando surge uma nova necessidade, o time pode acompanhar a oportunidade no funil de negócios e consultar as conversas, atividades e informações do cliente.',
      images: [{ src: '/produto/vendas-funil.webp', alt: 'Funil de negócios do yapt. com oportunidades organizadas por etapa', width: 1600, height: 301 }],
      caption: 'Tela do funil de negócios. O pós-venda combina recursos existentes da plataforma, conforme a sua operação.',
    },
    connection: { title: 'A venda é uma etapa. A relação é maior.', description: 'Leve o que a empresa já sabe sobre o cliente para o próximo contato, conectando vendas, suporte e automações.', links: [{ label: 'Vendas', path: '/sales' }, { label: 'Suporte', path: '/support' }, { label: 'Automações', path: '/automations' }] },
    cta: { title: 'Como sua empresa cuida de quem já comprou?', description: 'Vamos entender o seu pós-venda e identificar como usar carteiras, conversas e automações para continuar essa relação.' },
  },
  'en-US': {
    meta: { title: 'Customer growth and after-sales with context', description: 'Use yapt. portfolios, segmentation and journeys to organize after-sales, reconnect with customers and track new opportunities in your customer base.' },
    label: 'yapt. for Customer growth', title: 'Your next opportunity could be', emphasis: 'in your customer base.',
    intro: 'Keep the relationship going after the sale. Use customer history to organize portfolios, create audiences and make every follow-up more relevant.',
    promise: 'A lasting relationship. New opportunities with context.',
    capabilitiesTitle: 'Make existing customers part of your daily work.',
    capabilitiesIntro: 'Combine the portfolios, audiences, journeys and sales capabilities already available in yapt. to organize after-sales.',
    capabilities: [
      { title: 'Customer portfolios with clear ownership', description: 'Organize customers into portfolios with teams, members, goals and routing. Track conversations and deals to maintain continuity in the relationship.', detail: 'Portfolios · Ownership · Goals' },
      { title: 'Audiences that make sense', description: 'Segment customers by purchases, stages, tags and interactions. Choose whom to contact based on the relationship you already have.', detail: 'Segmentation · Purchase history · Customer journey' },
      { title: 'Stay in touch after the sale', description: 'Build WhatsApp and email journeys triggered by customer lifecycle events. Organize follow-up and reactivation with defined steps and waiting periods.', detail: 'Journeys · WhatsApp and email · Reactivation' },
      { title: 'Connect opportunities to revenue', description: 'Connect conversations, deals and sales. See portfolio revenue and opportunities to inform your team’s next action.', detail: 'Conversations · Deals · Revenue' },
    ],
    visual: { label: 'Keep the relationship going', title: 'After the sale, the next chapter.', steps: ['Customer portfolio', 'Relevant follow-up', 'New opportunity'], context: 'History, audiences and journeys working together', note: 'Illustration of an after-sales use case' },
    proof: {
      eyebrow: 'From relationship to opportunity', title: 'Your next sale needs a clear path, too.',
      description: 'When a new need arises, your team can track the opportunity in the sales pipeline and consult the customer’s conversations, activities and information.',
      images: [{ src: '/produto/vendas-funil.webp', alt: 'yapt. sales pipeline with opportunities organized by stage', width: 1600, height: 301 }],
      caption: 'Sales pipeline screen in Portuguese. After-sales combines existing platform capabilities around your operation.',
    },
    connection: { title: 'The sale is one step. The relationship goes further.', description: 'Bring what your business already knows about each customer into the next conversation, connecting sales, support and automation.', links: [{ label: 'Sales', path: '/sales' }, { label: 'Support', path: '/support' }, { label: 'Automation', path: '/automations' }] },
    cta: { title: 'How do you look after customers who already bought?', description: 'Let’s understand your after-sales process and explore how portfolios, conversations and automation can help continue the relationship.' },
  },
  'es-ES': {
    meta: { title: 'Expansión y posventa con contexto del cliente', description: 'Usa carteras, segmentación y secuencias de yapt. para organizar la posventa, reactivar relaciones y seguir nuevas oportunidades en tu base de clientes.' },
    label: 'yapt. para Expansión y posventa', title: 'Tu próxima oportunidad puede estar', emphasis: 'en tu propia base.',
    intro: 'Continúa la relación después de la venta. Usa el historial del cliente para organizar carteras, crear públicos y mantener el contacto con más contexto.',
    promise: 'Una relación que continúa. Nuevas oportunidades con contexto.',
    capabilitiesTitle: 'Haz que tu base vuelva a tu rutina.',
    capabilitiesIntro: 'Combina las carteras, los públicos, las secuencias y las ventas que ya forman parte de yapt. para estructurar tu posventa.',
    capabilities: [
      { title: 'Una cartera con responsables', description: 'Organiza clientes en carteras con equipo, miembros, objetivos y distribución. Sigue las conversaciones y oportunidades para dar continuidad a la relación.', detail: 'Carteras · Responsables · Objetivos' },
      { title: 'Públicos que tienen sentido', description: 'Segmenta la base por compras, etapas, etiquetas e interacciones. Elige con quién hablar a partir de la relación que ya existe.', detail: 'Segmentación · Historial de compra · Recorrido' },
      { title: 'Contacto después de la venta', description: 'Crea secuencias de WhatsApp y correo con disparadores del ciclo del cliente. Organiza el seguimiento y la reactivación con pausas y etapas definidas.', detail: 'Secuencias · WhatsApp y correo · Reactivación' },
      { title: 'Oportunidades ligadas a los ingresos', description: 'Conecta conversaciones, oportunidades y ventas. Consulta los ingresos y las oportunidades de la cartera para orientar la próxima acción del equipo.', detail: 'Conversaciones · Oportunidades · Ingresos' },
    ],
    visual: { label: 'Una relación que continúa', title: 'Después de la venta, el próximo capítulo.', steps: ['Cliente en la cartera', 'Contacto con contexto', 'Nueva oportunidad'], context: 'Historial, públicos y secuencias en el mismo camino', note: 'Vista ilustrativa de un uso de posventa' },
    proof: {
      eyebrow: 'De la relación a la oportunidad', title: 'La próxima venta también necesita un camino.',
      description: 'Cuando aparece una nueva necesidad, el equipo puede seguir la oportunidad en el embudo de ventas y consultar las conversaciones, actividades e información del cliente.',
      images: [{ src: '/produto/vendas-funil.webp', alt: 'Embudo de ventas de yapt. con oportunidades organizadas por etapa', width: 1600, height: 301 }],
      caption: 'Pantalla del embudo de ventas en portugués. La posventa combina funciones existentes según tu operación.',
    },
    connection: { title: 'La venta es una etapa. La relación es más grande.', description: 'Lleva lo que tu empresa ya sabe del cliente al próximo contacto, conectando ventas, soporte y automatizaciones.', links: [{ label: 'Ventas', path: '/sales' }, { label: 'Soporte', path: '/support' }, { label: 'Automatizaciones', path: '/automations' }] },
    cta: { title: '¿Cómo cuidas a quienes ya compraron?', description: 'Entendamos tu posventa para identificar cómo usar carteras, conversaciones y automatizaciones para continuar la relación.' },
  },
};

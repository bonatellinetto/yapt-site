import type { Locale } from './i18n';
import type { BusinessPageContent } from './business-pages';

export const supportPages: Record<Locale, BusinessPageContent> = {
  'pt-BR': {
    meta: { title: 'Suporte com IA e contexto em cada atendimento', description: 'Conecte conversas, chamados, filas e conhecimento. Organize prazos, apoie sua equipe com IA e acompanhe a operação de suporte no yapt.' },
    label: 'yapt. para Suporte',
    title: 'O cliente não precisa', emphasis: 'começar do zero.',
    intro: 'Conecte a conversa ao caso, ao conhecimento e à pessoa certa. Seu time acompanha o que aconteceu e sabe como continuar até a solução.',
    promise: 'Mais continuidade para o cliente. Mais clareza para quem atende.',
    capabilitiesTitle: 'Da primeira dúvida à solução, um contexto só.',
    capabilitiesIntro: 'Organize o trabalho do suporte sem separar o chamado da conversa que deu origem a ele.',
    capabilities: [
      { title: 'O caso acompanha a conversa', description: 'Reúna chamado, empresa, etapas, histórico e conversas vinculadas. A troca de atendente não precisa apagar o que o cliente já explicou.', detail: 'Casos · Histórico · Subchamados' },
      { title: 'Cada demanda no caminho certo', description: 'Organize filas, distribuição, metas de tempo e escalações. Dê ao time visibilidade de quem está responsável e do que precisa de atenção.', detail: 'Filas · Prazos de atendimento · Escalações' },
      { title: 'IA com conhecimento da sua operação', description: 'Construa agentes por conversa e conecte a base e os procedimentos. A IA pode buscar respostas, orientar o atendimento e transferir para uma pessoa quando necessário.', detail: 'yaAgents · yaBrain · Procedimentos' },
      { title: 'Visibilidade para melhorar o atendimento', description: 'Acompanhe tempos de resposta, resolução, motivos e percurso dos casos. Revise lacunas de conhecimento e sugestões antes de incorporá-las à base.', detail: 'Indicadores · Cobertura · Aprendizado supervisionado' },
    ],
    visual: { label: 'Continuidade no atendimento', title: 'A conversa muda de etapa. O contexto continua.', steps: ['Conversa com o cliente', 'Caso e responsável', 'Conhecimento e solução'], context: 'Histórico, empresa e procedimentos conectados', note: 'Visão ilustrativa das capacidades' },
    proof: {
      eyebrow: 'Na prática, no yapt.', title: 'Veja o que está acontecendo. Decida onde agir.',
      description: 'Acompanhe a saúde das filas e os indicadores do suporte para identificar esperas, distribuir o trabalho e investigar o caminho dos casos.',
      images: [
        { src: '/produto/ops-filas.webp', alt: 'Tela de saúde das filas do yapt. com espera, atendimento e operadores por setor', width: 1600, height: 670 },
        { src: '/produto/ops-indicadores-suporte.webp', alt: 'Painel de suporte do yapt. com indicadores de resposta e resolução', width: 1600, height: 692 },
      ],
      caption: 'Telas de filas e indicadores de suporte do yapt. Toque nas imagens para ver os detalhes.',
    },
    connection: { title: 'O suporte faz parte da relação inteira.', description: 'Conecte quem atende, quem vende e quem acompanha a operação. O cliente continua sendo o mesmo entre uma área e outra.', links: [{ label: 'Operações', path: '/operations' }, { label: 'Vendas', path: '/sales' }, { label: 'Expansão e pós-venda', path: '/expansion' }] },
    cta: { title: 'Onde o contexto se perde no seu suporte?', description: 'Vamos olhar para a sua operação e identificar onde conversas, pessoas e IA podem trabalhar melhor juntas.' },
  },
  'en-US': {
    meta: { title: 'AI support with context in every conversation', description: 'Connect conversations, cases, queues and knowledge. Manage response targets, support your team with AI and monitor customer support with yapt.' },
    label: 'yapt. for Support', title: 'Your customer should not', emphasis: 'have to start over.',
    intro: 'Connect the conversation to the case, the knowledge and the right person. Your team can see what happened and carry the work forward to a resolution.',
    promise: 'More continuity for customers. More clarity for your team.',
    capabilitiesTitle: 'From the first question to resolution, keep the context.',
    capabilitiesIntro: 'Organize support work without separating a case from the conversation that started it.',
    capabilities: [
      { title: 'The case stays with the conversation', description: 'Bring together the case, company, stages, history and linked conversations. Changing agents does not have to mean losing what the customer has already explained.', detail: 'Cases · History · Subcases' },
      { title: 'Give each request a clear path', description: 'Organize queues, routing, service time targets and escalations. Help the team see who owns the work and what needs attention.', detail: 'Queues · Service targets · Escalations' },
      { title: 'AI grounded in your operation', description: 'Build agents through conversation and connect knowledge and procedures. AI can retrieve answers, support the service team and hand over to a person when needed.', detail: 'yaAgents · yaBrain · Procedures' },
      { title: 'Visibility to improve your service', description: 'Track response and resolution times, reasons and case journeys. Review knowledge gaps and suggestions before adding them to the knowledge base.', detail: 'Reporting · Knowledge coverage · Supervised learning' },
    ],
    visual: { label: 'Continuity in customer support', title: 'The conversation moves forward. The context stays.', steps: ['Customer conversation', 'Case and owner', 'Knowledge and resolution'], context: 'Connected history, company and procedures', note: 'Illustration of the capabilities' },
    proof: {
      eyebrow: 'Inside yapt.', title: 'See what is happening. Decide where to act.',
      description: 'Monitor queue health and support indicators to identify waiting times, distribute work and investigate how cases progress.',
      images: [
        { src: '/produto/ops-filas.webp', alt: 'yapt. queue health screen showing waiting conversations and available agents by department', width: 1600, height: 670 },
        { src: '/produto/ops-indicadores-suporte.webp', alt: 'yapt. support dashboard with response and resolution indicators', width: 1600, height: 692 },
      ],
      caption: 'Queue and support reporting screens in Portuguese. Select an image to see the details.',
    },
    connection: { title: 'Support is part of the whole relationship.', description: 'Connect service, sales and operations. Your customer remains the same person as work moves between teams.', links: [{ label: 'Operations', path: '/operations' }, { label: 'Sales', path: '/sales' }, { label: 'Expansion and customer growth', path: '/expansion' }] },
    cta: { title: 'Where does your support team lose context?', description: 'Let’s look at your operation and identify where conversations, people and AI can work better together.' },
  },
  'es-ES': {
    meta: { title: 'Soporte con IA y contexto en cada conversación', description: 'Conecta conversaciones, casos, colas y conocimiento. Organiza los plazos, apoya a tu equipo con IA y sigue la operación de soporte en yapt.' },
    label: 'yapt. para Soporte', title: 'Tu cliente no tiene que', emphasis: 'empezar de nuevo.',
    intro: 'Conecta la conversación con el caso, el conocimiento y la persona adecuada. Tu equipo ve lo que pasó y sabe cómo continuar hasta la solución.',
    promise: 'Más continuidad para el cliente. Más claridad para tu equipo.',
    capabilitiesTitle: 'De la primera pregunta a la solución, un mismo contexto.',
    capabilitiesIntro: 'Organiza el trabajo del soporte sin separar el caso de la conversación que le dio origen.',
    capabilities: [
      { title: 'El caso acompaña a la conversación', description: 'Reúne el caso, la empresa, las etapas, el historial y las conversaciones vinculadas. Cambiar de agente no tiene por qué borrar lo que el cliente ya explicó.', detail: 'Casos · Historial · Subcasos' },
      { title: 'Cada solicitud en el camino correcto', description: 'Organiza colas, distribución, objetivos de tiempo y escalaciones. Da al equipo visibilidad de quién es responsable y qué requiere atención.', detail: 'Colas · Plazos de atención · Escalaciones' },
      { title: 'IA con conocimiento de tu operación', description: 'Crea agentes mediante una conversación y conecta la base y los procedimientos. La IA puede buscar respuestas, orientar la atención y transferir a una persona cuando sea necesario.', detail: 'yaAgents · yaBrain · Procedimientos' },
      { title: 'Visibilidad para mejorar la atención', description: 'Sigue los tiempos de respuesta, resolución, motivos y recorrido de los casos. Revisa las lagunas de conocimiento y las sugerencias antes de incorporarlas a la base.', detail: 'Indicadores · Cobertura · Aprendizaje supervisado' },
    ],
    visual: { label: 'Continuidad en la atención', title: 'La conversación avanza. El contexto permanece.', steps: ['Conversación con el cliente', 'Caso y responsable', 'Conocimiento y solución'], context: 'Historial, empresa y procedimientos conectados', note: 'Vista ilustrativa de las capacidades' },
    proof: {
      eyebrow: 'Dentro de yapt.', title: 'Ve lo que ocurre. Decide dónde actuar.',
      description: 'Sigue la salud de las colas y los indicadores del soporte para identificar esperas, distribuir el trabajo e investigar el recorrido de los casos.',
      images: [
        { src: '/produto/ops-filas.webp', alt: 'Pantalla de salud de las colas de yapt. con espera, atención y agentes por sector', width: 1600, height: 670 },
        { src: '/produto/ops-indicadores-suporte.webp', alt: 'Panel de soporte de yapt. con indicadores de respuesta y resolución', width: 1600, height: 692 },
      ],
      caption: 'Pantallas de colas e indicadores de soporte en portugués. Abre las imágenes para ver los detalles.',
    },
    connection: { title: 'El soporte forma parte de toda la relación.', description: 'Conecta a quienes atienden, venden y acompañan la operación. El cliente sigue siendo el mismo entre un área y otra.', links: [{ label: 'Operaciones', path: '/operations' }, { label: 'Ventas', path: '/sales' }, { label: 'Expansión y posventa', path: '/expansion' }] },
    cta: { title: '¿Dónde se pierde el contexto en tu soporte?', description: 'Revisemos tu operación para identificar dónde las conversaciones, las personas y la IA pueden trabajar mejor juntas.' },
  },
};

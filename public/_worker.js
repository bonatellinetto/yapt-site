// Only routes explicitly retired from the site may invoke this handler.
const retiredPaths = new Set([
  "/lp/atendente-de-ia-1",
  "/lp/atendente-de-ia-2",
  "/lp/campanha-que-vira-venda-1",
  "/lp/campanha-que-vira-venda-2",
  "/lp/chatbot-com-ia-1",
  "/lp/chatbot-com-ia-2",
  "/lp/construtor-de-conversas-1",
  "/lp/construtor-de-conversas-2",
  "/lp/plataforma-de-atendimento-1",
  "/lp/plataforma-de-atendimento-2",
  "/lp/whatsapp-multiusuario-1",
  "/lp/whatsapp-multiusuario-2",
  "/crm-vendas-sdr",
  "/dif-competitivos",
  "/solucao-tecnica",
  "/infoprodutores/comparecimento",
  "/infoprodutores/funil-conversacional",
  "/infoprodutores/reativacao-base",
  "/conversations",
  "/for-enterprise",
  "/pricing",
  "/expansion",
  "/en/conversations",
  "/en/for-enterprise",
  "/en/pricing",
  "/en/expansion",
  "/es/conversations",
  "/es/for-enterprise",
  "/es/pricing",
  "/es/expansion"
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '').replace(/\.html$/, '');
    if (!retiredPaths.has(path)) return env.ASSETS.fetch(request);

    const locale = path.match(/^(\/(?:en|es))(?=\/|$)/)?.[1] || '';
    const home = new URL(locale || '/', 'https://yapt.ai');
    home.search = url.search;
    return new Response(null, {
      status: 301,
      headers: { Location: home.href, 'Cache-Control': 'no-store' },
    });
  },
};

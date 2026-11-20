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
    const errorUrl = new URL(`${locale}/404`, url);
    const errorPage = await env.ASSETS.fetch(new Request(errorUrl, { method: 'GET' }));
    const headers = new Headers(errorPage.headers);
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.delete('Location');
    return new Response(request.method === 'HEAD' ? null : errorPage.body, {
      status: 404,
      statusText: 'Not Found',
      headers,
    });
  },
};

# yapt. Site — Knowledge Base

> Fonte de verdade para qualquer dev (humano ou IA) trabalhando neste repositorio.

## O que e este projeto

Site institucional da **yapt.** — Conversational AI Platform. SaaS B2B multi-tenant para gestao conversacional de vendas com IA.

- **URL producao**: https://yapt.ai
- **Stack**: Astro 5 (SSG) + React 18 + Tailwind CSS 3 + Cloudflare Pages
- **Repo**: `bonatellinetto/yapt-site`
- **Deploy**: push na `main` → GitHub Actions → `npm run build` → Cloudflare Pages (`yapt-site`)

---

## Brand Guidelines (OBRIGATORIO)

### Nome
- **yapt.** — sempre minusculo, sempre com ponto final
- Nunca "Yapt", "YAPT", "yapt" (sem ponto)
- Font do logo: **Poppins SemiBold**

### Cores oficiais
| Token           | Hex       | HSL (CSS var)            | Uso                    |
|-----------------|-----------|--------------------------|------------------------|
| Teal (primary)  | `#20B2AA` | `174 69% 41%`           | CTA, accent, brand     |
| Teal Light      | `#2DD4BF` | `170 64% 50%`           | Hover, destaques       |
| Slate           | `#434A54` | `213 10% 30%`           | Texto secundario       |
| Dark            | `#0F0F0F` | `0 0% 5.9%`             | Texto principal (dark) |

### Cores auxiliares usadas no projeto
| Cor             | Hex       | Uso                                |
|-----------------|-----------|-------------------------------------|
| Heading text    | `#1a1a2e` | Headings em fundo branco            |
| Body text       | `#656D78` | Texto descritivo / paragrafos       |
| Feature text    | `#434A54` | Bullets de features                 |
| CTA gradient    | `#064E3B → #0D9488 → #20B2AA` | Background de CTAs e hero |
| Section bg      | `#FAFBFC` | Background de secoes alternadas     |
| Dark section    | `#0F1623` | Secao de seguranca                  |

> IMPORTANTE: Prefira usar tokens Tailwind (`text-foreground`, `bg-brand`, `text-yapt-teal`) ao inves de hex hardcoded quando possivel.

### Tipografia
- **Headings**: `font-poppins font-bold` (Poppins 700)
- **Subtitles/badges**: `font-poppins font-semibold` (Poppins 600)
- **Body**: Inter (font-sans padrao)
- **Sizes**: h1=`text-3xl lg:text-4xl xl:text-5xl`, h2=`text-2xl lg:text-3xl`, body=`text-base`, small=`text-sm`
- Fontes carregadas via Google Fonts no `SiteLayout.astro`

### Gradient padrao
```
linear-gradient(135deg, #064E3B, #0D9488, #20B2AA)
```
Usado em: hero sections, CTA sections, sticky mobile CTA.

---

## Arquitetura do Projeto

```
src/
├── components/          # Componentes Astro reutilizaveis
│   ├── CTASection.astro       # CTA final com animacoes (floresta, borboletas, vagalumes)
│   ├── FeatureGrid.astro      # Grid de features com icone + titulo + descricao
│   ├── FeaturesSection.astro  # Secao de features com i18n
│   ├── HeroSection.astro      # Hero principal (home) com floresta + WhatsApp mockup
│   ├── ModuleDeepDive.astro   # Modulo detalhado: texto + mockup lado a lado
│   ├── PageHero.astro         # Hero generico para paginas internas (gradient + fauna)
│   ├── ProblemSection.astro   # Secao de dor/problema com cards
│   ├── SectionDivider.astro   # Divisor entre secoes (leaves ou light)
│   ├── SiteFooter.astro       # Footer global
│   ├── SiteNavbar.astro       # Navbar global com i18n
│   ├── TrustBar.astro         # Barra de metricas (30M msgs, 99.97% uptime, etc.)
│   ├── WhatsAppChat.astro     # Mockup de conversa WhatsApp
│   ├── blog/                  # Componentes do blog
│   └── mockups/               # 35+ mockups de funcionalidades do produto
│       ├── MockupYaContact.astro
│       ├── MockupYaDeals.astro
│       ├── MockupYaFlows.astro
│       ├── MockupYaMemory.astro
│       ├── MockupPlaybook.astro
│       ├── MockupScoring.astro
│       ├── MockupCalendar.astro
│       ├── MockupMentorResults.astro
│       ├── MockupYaTrust.astro
│       └── ... (ver src/components/mockups/ para lista completa)
├── emails/              # Templates de email HTML
├── i18n/                # Traducoes por locale
│   ├── pt-BR/site.json  # Portugues (default)
│   ├── en-US/site.json  # Ingles
│   └── es-ES/site.json  # Espanhol
├── layouts/
│   ├── SiteLayout.astro  # Layout principal (SEO, GTM, hreflang, fonts, scripts)
│   └── BlogLayout.astro  # Layout do blog
├── lib/
│   ├── i18n.ts    # Sistema de internacionalizacao (t(), getLocaleFromPath, localePath)
│   ├── seo.ts     # SEO helpers (canonical, hreflang, JSON-LD schemas)
│   ├── fauna.ts   # SVGs de animais para decoracao (floresta yapt.)
│   ├── blog.ts    # Fetch de posts do blog via Supabase
│   └── supabase.ts # Cliente Supabase (build-time only)
├── pages/
│   ├── index.astro         # Home pt-BR
│   ├── sales.astro         # Pagina de vendas (REFERENCIA de padrao)
│   ├── pricing.astro
│   ├── trust.astro
│   ├── privacy.astro / terms.astro
│   ├── automations.astro / conversations.astro / intelligence.astro / operations.astro
│   ├── integrations.astro / marketing-site.astro / for-enterprise.astro
│   ├── blog/               # Blog
│   ├── partners/           # Portal de parceiros
│   ├── infoprodutores/     # LPs para infoprodutores
│   ├── en/                 # Paginas em ingles (mesma estrutura)
│   ├── es/                 # Paginas em espanhol (mesma estrutura)
│   ├── sitemap.xml.ts      # Sitemap dinamico
│   └── robots.txt.ts       # Robots.txt
└── styles/
    └── global.css   # CSS vars, animacoes, design tokens, scrollbar
```

---

## Regras de Codigo (OBRIGATORIO)

### Tamanho de arquivos
- **Max 300 linhas por componente** — se passar, extrair secoes em componentes
- **Max 30 linhas por funcao**
- Se uma secao se repete em 2+ paginas, DEVE virar componente

### TypeScript
- **Zero `any`**: nunca usar `: any`, `as any`, `as unknown as T`
- Criar interface ou usar `unknown` + type guard
- Tipar props de componentes Astro com `interface Props`

### Reutilizacao de componentes
Antes de criar HTML inline, verificar se ja existe um componente:

| Necessidade | Componente existente |
|-------------|---------------------|
| CTA final com floresta | `CTASection.astro` |
| Grid de features | `FeatureGrid.astro` |
| Modulo com mockup | `ModuleDeepDive.astro` |
| Hero de pagina interna | `PageHero.astro` |
| Barra de metricas | `TrustBar.astro` |
| Divisor entre secoes | `SectionDivider.astro` |
| Secao de problemas | `ProblemSection.astro` |

### Animacoes
- Usar `data-observe` na section + `data-fade` nos elementos filhos
- O script de IntersectionObserver no `SiteLayout.astro` cuida do fade-in
- Transicoes: `transition: opacity 0.5s ease, transform 0.5s ease` (padrao do projeto)
- Animacoes pre-definidas: `yapt-float`, `yapt-butterfly1/2`, `yapt-wing`, `yapt-bee`
- Definidas em `global.css` e `tailwind.config.ts`

### CSS / Tailwind
- Cards: `rounded-2xl`
- Botoes/inputs: `rounded-xl`
- Badges: `rounded-full`
- Sombras: usar elevation system (`shadow-hairline`, `shadow-elevation-100/200/300/400`)
- Nunca usar `!important` (exceto responsivo legado em `global.css`)
- Mobile-first: breakpoints `sm:` → `md:` → `lg:` → `xl:`

---

## Sistema de i18n

### Como funciona
- 3 locales: `pt-BR` (default, raiz), `en-US` (`/en/`), `es-ES` (`/es/`)
- Traducoes em `src/i18n/{locale}/site.json`
- Usar `t('key.path', locale)` para traduzir — importar de `src/lib/i18n.ts`
- Paginas pt-BR ficam em `src/pages/`, ingles em `src/pages/en/`, espanhol em `src/pages/es/`

### Regras para novas paginas
1. **SEMPRE criar nas 3 locales** — ou pelo menos garantir que o hreflang nao gere URLs quebradas
2. Usar o sistema i18n para `title` e `description` (ver `sales.astro` como referencia)
3. Passar `locale` corretamente para `SiteLayout` e componentes
4. Se a pagina for pt-BR only (ex: LP de Ads), considerar suprimir hreflang ou adicionar `noindex` para as alternates inexistentes

### Hreflang (CUIDADO)
O `SiteLayout.astro` gera automaticamente `<link rel="alternate">` para TODOS os locales via `getHreflangAlternates(path)`. Se a pagina so existe em pt-BR, os alternates em `/en/` e `/es/` vao apontar para 404 — isso e **ruim para SEO**.

---

## SEO

### Checklist para novas paginas
- [ ] `<title>` unico e descritivo (max 60 chars)
- [ ] `<meta description>` unica (max 160 chars)
- [ ] `<h1>` unico por pagina
- [ ] Hierarquia de headings: h1 > h2 > h3 (sem pular niveis)
- [ ] Open Graph tags (automatico via SiteLayout)
- [ ] JSON-LD estruturado quando aplicavel (FAQ Schema, etc.)
- [ ] Canonical URL correta
- [ ] hreflang alternates validos (ver secao i18n)

### Sitemap
- Gerado automaticamente via `src/pages/sitemap.xml.ts`
- Novas paginas sao incluidas automaticamente

---

## SiteLayout — Funcionalidades

O `SiteLayout.astro` e o layout global. Ele inclui:

1. **SEO completo**: title, description, canonical, OG, Twitter Cards, JSON-LD
2. **hreflang**: alternates para todos os locales
3. **Google Tag Manager**: `GTM-M442SZSJ` (head + noscript)
4. **Fonts**: Inter + Poppins via Google Fonts
5. **Navbar + Footer**: globais com i18n
6. **Scroll Observer**: script que anima `[data-fade]` dentro de `[data-observe]`
7. **WhatsApp Button**: widget yapt. de captura de leads

### Props do SiteLayout
```typescript
interface Props {
  title: string;           // Titulo da pagina (sem "| yapt." — adicionado automaticamente)
  description: string;     // Meta description
  path: string;           // Path sem locale prefix (ex: "/pricing", "/sales")
  locale: Locale;         // 'pt-BR' | 'en-US' | 'es-ES'
  ogType?: string;        // Default: 'website'
  ogImage?: string;       // Default: '/og-image.png'
  jsonLd?: Record<string, any>[]; // JSON-LD schemas adicionais
  noindex?: boolean;      // Default: false
}
```

---

## Pagina de Referencia: `sales.astro`

A pagina `sales.astro` e o **melhor exemplo** de como criar paginas de produto. Ela demonstra:

- Uso correto do sistema i18n (`t()`, `m()`)
- Composicao com componentes reutilizaveis (`PageHero`, `ModuleDeepDive`, `FeatureGrid`, `CTASection`, `SectionDivider`)
- Tipagem correta dos dados
- Importacao de mockups
- Uso do fauna SVG no hero

**Ao criar novas paginas, usar `sales.astro` como template.**

---

## Mockups Disponiveis

Todos em `src/components/mockups/`. Cada um e um componente Astro auto-contido que renderiza um mockup visual de uma feature do produto:

| Mockup | Representa |
|--------|-----------|
| `MockupYaContact` | CRM de contatos 360 |
| `MockupYaDeals` | Pipeline Kanban |
| `MockupYaFlows` | Builder de fluxos |
| `MockupYaInbox` | Inbox omnichannel |
| `MockupYaMemory` | Memoria contextual da IA |
| `MockupYaTeam` / `MockupYaTeamHub` / `MockupYaTeamCentral` | Gestao de equipe |
| `MockupPlaybook` | Playbooks de vendas |
| `MockupScoring` | Lead scoring |
| `MockupCalendar` | Agendamento |
| `MockupMentorResults` | Resultados do yaMentor |
| `MockupYaTrust` | Seguranca e compliance |
| `MockupEmotion` | Engine de emocoes |
| `MockupHandoff` | Handoff IA → humano |
| `MockupRouting` | Roteamento de conversas |
| `MockupTemplateBuilder` | Builder de templates |
| `MockupAnalytics` | Dashboard analytics |
| `MockupIntegrationFlow` | Fluxo de integracoes |
| `MockupCAPI` | Conversions API |
| `MockupAdsConnect` | Conexao com Ads |
| `MockupInstantEngage` | Engage instantaneo |
| `MockupMultiTenant` | Arquitetura multi-tenant |
| `MockupPermissions` | Permissoes |
| `MockupSLA` | SLA tracking |
| `MockupProductivity` | Metricas de produtividade |
| `MockupAgentMonitor` | Monitor de agentes |
| `MockupChannels` | Canais de comunicacao |
| `MockupWebhooks` | Webhooks |
| `MockupAPIConsole` | Console de API |
| `MockupProposals` / `MockupProposalAccept` | Propostas comerciais |
| `MockupYaCampaigns` / `MockupCampaignsTable` | Campanhas |
| `MockupYaConnect` | Integracoes |
| `MockupYaEnterprise` | Enterprise features |
| `MockupYaveh` | IA Orchestrator |
| `MockupAudioIntel` | Audio intelligence |
| `MockupWaFlowForm` / `MockupWaFlowQualify` / `MockupWaFlowSchedule` | WhatsApp Flows |

---

## Tema Visual: Floresta yapt.

O site usa um tema de **floresta tropical** como metafora visual:

- **Gradientes verdes** nos heros (emerald → teal)
- **Fauna SVG**: tucano, borboletas, abelha, sapo, coruja, lobo, golfinho (em `src/lib/fauna.ts`)
- **Vegetacao decorativa**: folhagens em SVG nos divisores e heros
- **Vagalumes**: pontos brilhantes animados com `yapt-float`
- **Flores**: detalhes coloridos nas vegetacoes de fundo

Manter essa linguagem visual em todas as paginas novas.

---

## Deploy e Infra

### Ambiente
- **Producao**: Cloudflare Pages (`yapt-site`)
- **Build**: `npm run build` (Astro SSG → `/dist`)
- **Node**: 20
- **CI**: GitHub Actions (`.github/workflows/deploy.yml`)

### Secrets necessarios (GitHub Actions)
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `SUPABASE_URL` — usado no build para fetch de blog posts
- `SUPABASE_SERVICE_ROLE_KEY` — idem

### Comandos
```bash
npm run dev      # Dev server local (Astro)
npm run build    # Build para producao
npm run preview  # Preview do build local
npm run check    # Astro type check
```

---

## Workflow de Desenvolvimento

1. **Branch**: criar branch a partir da `main`
2. **Desenvolver**: seguir as regras deste documento
3. **Testar local**: `npm run dev` + verificar visualmente
4. **PR**: abrir PR para `main` com descricao clara
5. **Review**: Netto (CEO) ou Claude Code revisa
6. **Merge**: apos aprovacao, merge na `main` = deploy automatico

---

## Checklist para Novas Landing Pages

- [ ] Usar `SiteLayout` com props corretas
- [ ] Usar componentes existentes (`ModuleDeepDive`, `FeatureGrid`, `CTASection`, etc.)
- [ ] Max 300 linhas por arquivo — extrair secoes repetidas em componentes
- [ ] Brand compliance: cores, fontes, "yapt." com ponto
- [ ] Criar versoes em `/en/` e `/es/` OU tratar hreflang
- [ ] Zero `any` / `as unknown as T`
- [ ] Animacoes via `data-observe` + `data-fade` (nao reinventar)
- [ ] Mobile responsive (testar em 375px)
- [ ] SEO: title, description, h1, hierarquia de headings
- [ ] Verificar que todos os imports de mockups existem no repo
- [ ] CTA links apontando para o destino correto
- [ ] `target="_blank"` sempre com `rel="noopener noreferrer"`

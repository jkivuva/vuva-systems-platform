# Vuva Systems Platform

Production website, interactive system demonstrations, public AI consultant and a private
prospecting dashboard for Vuva Systems — served as a dependency-light Cloudflare Worker.

## Surfaces

| Path | What it is |
|---|---|
| `/` | Public marketing site — positioning, systems, work, architecture, AI automation, capabilities, services, contact |
| `/demos/logistics/` | Vuva Logistics Intelligence Platform (interactive demo; Limitless Logistics reference) |
| `/demos/healthcare/` | VuvaCare — hospital operations (Demonstration System) |
| `/demos/realestate/` | Vuva PropertyOS — property management (Demonstration System) |
| `/demos/hospitality/` | Vuva HospitalityOS — restaurant & delivery (Blitz Restaurant reference) |
| `/demos/retail/` | Vuva CommerceOS — retail & distribution (Demonstration System) |
| `/internal/` | **Private** Vuva AI — Prospecting dashboard (Basic-auth gated at the edge) |
| `/webhook`, `/health` | Meta WhatsApp Cloud API webhook (signed verification) |

## Architecture

- `site/` — static site (vanilla HTML/CSS/JS, no framework, no build step)
  - `site/index.html` — single-page marketing site
  - `site/assets/css/styles.css` — design system (tokens, components, sections, responsive)
  - `site/assets/js/pricing.js` — **centralized pricing config** for the quotation engine
  - `site/assets/js/vuva-ai.js` — public Vuva AI consultation + quotation engine
  - `site/assets/js/app.js` — navigation, reveal, contact form, capability explorer
  - `site/demos/` — shared demo shell (`demo.css`, `demo.js`) + five industry demos
  - `site/internal/` — private prospecting dashboard (sample data)
- `src/worker.js` — routing, www→apex redirect, security headers, internal-area auth
- `src/whatsapp-webhook.js` — Meta webhook verification and signed delivery handler
- `src/node-server.js` — standalone Node webhook adapter

## Vuva AI (public)

A client-side business consultant: it asks industry-aware questions, analyses answers,
recommends a system and produces an **estimated** investment range from `pricing.js`.
It never fabricates pricing — budgets are visitor-supplied and estimates are clearly labelled.

## Vuva AI — Prospecting (internal)

A private dashboard (Overview, Discover, Prospects, Research, Opportunities, Outreach,
Reports, Settings) connected to real services through a server-side API under
`/internal/api/*`:

| Endpoint | Purpose |
|---|---|
| `GET /internal/api/config` | Which integrations are configured |
| `POST /internal/api/search` | Tavily company discovery |
| `GET/POST/DELETE /internal/api/prospects` | D1 prospect persistence |
| `POST /internal/api/outreach` | WhatsApp Business Cloud API send |

Company discovery uses keyword heuristics over public snippets — signals and scores are
clearly-labelled estimates, never fabricated facts. All third-party keys stay server-side.

### Internal auth

The `/internal` route is protected by HTTP Basic Auth at the edge. Set both Worker secrets
or the area **fails closed (503)**:

```bash
npx wrangler secret put INTERNAL_AUTH_USER
npx wrangler secret put INTERNAL_AUTH_PASS
```

### Database

Prospects are stored in Cloudflare **D1** (`vuva-prospects`, binding `DB`). Schema lives in
`migrations/`; apply with:

```bash
npx wrangler d1 migrations apply vuva-prospects --remote
```

## Business configuration

Public contact details are centralized in `site/assets/js/config.js`. Project pricing is
centralized in `site/assets/js/pricing.js`.

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm test
npm run preview   # wrangler dev — serves the site and webhook locally
```

## Quality checks

```bash
npm run check     # node test suite + wrangler deploy dry-run
```

## Deployment

```bash
npm run check
npm run deploy
```

Domains in `wrangler.jsonc`: `vuvasystems.com` (canonical) and `www.vuvasystems.com` (308 → apex).

## Required Worker secrets

| Variable | Purpose |
|---|---|
| `WHATSAPP_VERIFY_TOKEN` | Meta GET webhook verification |
| `META_APP_SECRET` | `X-Hub-Signature-256` validation on every POST |
| `INTERNAL_AUTH_USER` | Internal dashboard Basic-auth username |
| `INTERNAL_AUTH_PASS` | Internal dashboard Basic-auth password |
| `TAVILY_API_KEY` | Web search for company discovery (Tavily) |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API outbound token |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp sender phone-number-id |

Secrets are set through Wrangler and are never committed or exposed in frontend code.

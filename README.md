# Vuva Systems Platform

The production site for [Vuva Systems](https://vuvasystems.com), plus a
small internal tool for managing prospects and WhatsApp outreach.

**Live site:** https://vuvasystems.com

Built and operated by [Joshua Kivuva](https://github.com/jkivuva). Every
third-party integration is server-side, env-gated, and fails closed if
its credentials are missing.

## Stack

Cloudflare Workers · Cloudflare D1 · Node.js 22 · `node:test` ·
WhatsApp Business Cloud API · Tavily (lead discovery) · Wrangler

## What's inside

- The public site served from a single Worker entry (`src/worker.js`).
  Includes a strict Content-Security-Policy with a hashed script-src,
  security headers on every response, and a canonical-www redirect.
- A signed WhatsApp webhook handler (`src/whatsapp-webhook.js`) that
  verifies `x-hub-signature-256` *before* parsing the payload and
  refuses to log the access token. A 250-line test suite
  (`test/whatsapp-webhook.test.js`) covers the happy path, missing
  signature, wrong signature, malformed JSON, missing secret, and
  unconfigured verification token.
- An internal area at `/internal` gated by a timing-safe Basic-auth
  compare, reached only over the Worker. The internal API
  (`src/internal-api.js`) proxies Tavily, talks to D1 with prepared
  statements and `ON CONFLICT … DO UPDATE` upserts, and sends
  WhatsApp messages without ever exposing tokens to the browser.
- A lightweight telemetry ingest endpoint for the mobile boot watch.
- 45 tests across two `node:test` suites, all passing.

## Running it locally

```bash
npm install
npm test                      # 45 tests across 2 suites
npm run check                 # npm test && wrangler deploy --dry-run
npm run dev                   # wrangler dev (local worker)
npm run deploy                # wrangler deploy (production)
```

Secrets are configured per-environment in Cloudflare (D1 binding,
Tavily API key, WhatsApp access token, internal Basic-auth
credentials). They are never committed to this repository.

## Live

https://vuvasystems.com

---

Operated by [Vuva Systems](https://vuvasystems.com).

import { createWhatsAppWebhookHandler } from './whatsapp-webhook.js';
import { handleInternalApi } from './internal-api.js';

const handleWebhook = createWhatsAppWebhookHandler();

const WEBSITE_SECURITY_HEADERS = {
  'content-security-policy': "default-src 'self'; script-src 'self' 'sha256-6w2Bh/ZNd9tdjdpfa3U1P3KffptTdkmfDGmqLp8HWI0='; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY'
};

function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(WEBSITE_SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }
  return secured;
}

function timingSafeEqual(left, right) {
  const leftBytes = new TextEncoder().encode(left ?? '');
  const rightBytes = new TextEncoder().encode(right ?? '');
  if (leftBytes.length !== rightBytes.length) return false;
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}

function internalAccessStatus(request, env) {
  const user = env?.INTERNAL_AUTH_USER;
  const pass = env?.INTERNAL_AUTH_PASS;
  if (!user || !pass) return 'unconfigured';

  const authorization = request.headers.get('authorization') ?? '';
  if (!authorization.startsWith('Basic ')) return 'unauthorized';

  let decoded;
  try {
    decoded = atob(authorization.slice(6));
  } catch {
    return 'unauthorized';
  }

  const separator = decoded.indexOf(':');
  if (separator < 0) return 'unauthorized';

  const suppliedUser = decoded.slice(0, separator);
  const suppliedPass = decoded.slice(separator + 1);
  return timingSafeEqual(suppliedUser, user) && timingSafeEqual(suppliedPass, pass)
    ? 'authorized'
    : 'unauthorized';
}

function internalGateResponse(status) {
  if (status === 'unconfigured') {
    return new Response('Internal area not configured', {
      status: 503,
      headers: { 'cache-control': 'no-store', 'content-type': 'text/plain; charset=utf-8' }
    });
  }
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
      'www-authenticate': 'Basic realm="Vuva internal", charset="UTF-8"'
    }
  });
}

function isInternalPath(pathname) {
  return pathname === '/internal' || pathname.startsWith('/internal/');
}

async function handleTelemetry(request, env) {
  /* Lightweight ingest for the mobile-boot-watch beacon.
     Validates the shared key in the query string, parses the JSON,
     and writes one row to mobile_boot_events. Returns 204 either way
     so the browser never logs an error from sendBeacon. */
  const url = new URL(request.url);
  console.log('[telemetry] hit:', url.pathname, 'method:', request.method, 'hasDB:', !!env?.DB);
  if (url.searchParams.get('key') !== 'mobile-boot') {
    return new Response('Not Found', { status: 404 });
  }
  let body;
  try { body = await request.json(); } catch (err) { console.error('[telemetry] json parse failed:', err && err.message); return new Response(null, { status: 204 }); }
  if (!body || typeof body !== 'object') { console.error('[telemetry] bad body shape'); return new Response(null, { status: 204 }); }
  if (!env?.DB) {
    console.error('[telemetry] D1 binding missing');
    return new Response(null, { status: 204 });
  }
  /* Truncate noisy fields to keep rows small. D1 bind() rejects
     undefined, so coerce every value to a primitive before binding. */
  const trunc = (s, n) => (typeof s === 'string' ? s.slice(0, n) : null);
  const num = (n) => (typeof n === 'number' && Number.isFinite(n) ? n : null);
  try {
    await env.DB.prepare(`
      INSERT INTO mobile_boot_events
        (ts, received_at, vw, vh, dpr, href, ua,
         net_type, net_downlink, net_rtt, errs_json, rej_json, failed_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      num(body.time) || Date.now(),
      Date.now(),
      num(body.vw),
      num(body.vh),
      num(body.dpr),
      trunc(body.href, 200),
      trunc(body.ua, 400),
      trunc(body.net && body.net.type, 40),
      num(body.net && body.net.downlink),
      num(body.net && body.net.rtt),
      JSON.stringify(Array.isArray(body.errs) ? body.errs.slice(0, 50) : []),
      JSON.stringify(Array.isArray(body.rej) ? body.rej.slice(0, 50) : []),
      JSON.stringify(Array.isArray(body.failed) ? body.failed.slice(0, 50) : [])
    ).run();
    console.log('[telemetry] insert ok');
  } catch (err) {
    console.error('[telemetry] insert failed:', err && err.message ? err.message : err);
  }
  return new Response(null, { status: 204 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.vuvasystems.com') {
      url.hostname = 'vuvasystems.com';
      return Response.redirect(url, 308);
    }

    if (url.pathname === '/webhook' || url.pathname === '/health') {
      return handleWebhook(request, env);
    }

    // CV removed from the public site at owner's request; copies live on the Desktop.

    if (isInternalPath(url.pathname)) {
      const status = internalAccessStatus(request, env);
      if (status !== 'authorized') return internalGateResponse(status);

      if (url.pathname.startsWith('/internal/api/')) {
        return handleInternalApi(request, env);
      }
    }

    if (url.pathname === '/vuvasystems-internal/telemetry' && request.method === 'POST') {
      return handleTelemetry(request, env);
    }

    if (!env?.ASSETS) {
      return new Response('Not Found', { status: 404 });
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  }
};

const WEBHOOK_PATH = '/webhook';
const MAX_BODY_BYTES = 1_048_576;
const MAX_LOG_TEXT_LENGTH = 500;
import { handleIncomingWhatsAppMessages } from './whatsapp-reply.js';
const encoder = new TextEncoder();

function response(body, status, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
      ...extraHeaders
    }
  });
}

function secureEqual(left, right) {
  const leftBytes = encoder.encode(left ?? '');
  const rightBytes = encoder.encode(right ?? '');
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function expectedSignature(body, appSecret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return `sha256=${toHex(new Uint8Array(signature))}`;
}

async function hasValidSignature(body, providedSignature, appSecret) {
  if (!/^sha256=[a-f0-9]{64}$/i.test(providedSignature ?? '')) {
    return false;
  }

  const expected = await expectedSignature(body, appSecret);
  return secureEqual(providedSignature.toLowerCase(), expected);
}

function safeText(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  return value
    .replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_LOG_TEXT_LENGTH);
}

function extractMessageText(message) {
  if (message?.type === 'text') {
    return safeText(message.text?.body);
  }
  if (message?.type === 'button') {
    return safeText(message.button?.text);
  }
  if (message?.type === 'interactive') {
    return safeText(
      message.interactive?.button_reply?.title ?? message.interactive?.list_reply?.title
    );
  }
  return undefined;
}

export function summarizeWhatsAppEvent(payload) {
  const messages = [];
  const statuses = [];

  if (payload?.object !== 'whatsapp_business_account' || !Array.isArray(payload.entry)) {
    return { messages, statuses };
  }

  for (const entry of payload.entry) {
    if (!Array.isArray(entry?.changes)) continue;

    for (const change of entry.changes) {
      if (change?.field !== 'messages') continue;
      const value = change.value;

      // Contact names (when Meta includes them) keyed by wa_id.
      const contactNames = new Map();
      if (Array.isArray(value?.contacts)) {
        for (const contact of value.contacts) {
          if (contact?.wa_id && typeof contact?.profile?.name === 'string') {
            contactNames.set(contact.wa_id, safeText(contact.profile.name));
          }
        }
      }

      if (Array.isArray(value?.messages)) {
        for (const message of value.messages) {
          const summary = {
            senderWhatsAppId: safeText(message?.from),
            messageId: safeText(message?.id),
            messageType: safeText(message?.type),
            timestamp: safeText(message?.timestamp)
          };
          const name = contactNames.get(summary.senderWhatsAppId);
          if (name) summary.contactName = name;
          const text = extractMessageText(message);
          if (text) summary.text = text;
          messages.push(summary);
        }
      }

      if (Array.isArray(value?.statuses)) {
        for (const status of value.statuses) {
          const errorCodes = Array.isArray(status?.errors)
            ? status.errors
                .map((error) => error?.code)
                .filter((code) => typeof code === 'number' || typeof code === 'string')
                .slice(0, 10)
            : [];
          const summary = {
            messageId: safeText(status?.id),
            recipientWhatsAppId: safeText(status?.recipient_id),
            status: safeText(status?.status),
            timestamp: safeText(status?.timestamp)
          };
          if (errorCodes.length > 0) summary.errorCodes = errorCodes;
          statuses.push(summary);
        }
      }
    }
  }

  return { messages, statuses };
}

const defaultLogger = {
  info(event, details) {
    console.info(event, details);
  },
  warn(event, details) {
    console.warn(event, details);
  },
  error(event, details) {
    console.error(event, details);
  }
};

export function createWhatsAppWebhookHandler({ logger = defaultLogger } = {}) {
  return async function handleWhatsAppWebhook(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== WEBHOOK_PATH) {
      if (url.pathname === '/health' && request.method === 'GET') {
        return new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: {
            'cache-control': 'no-store',
            'content-type': 'application/json; charset=utf-8',
            'x-content-type-options': 'nosniff'
          }
        });
      }
      return response('Not Found', 404);
    }

    if (request.method === 'GET') {
      const verifyToken = env?.WHATSAPP_VERIFY_TOKEN;
      if (!verifyToken) {
        logger.error('whatsapp_webhook_configuration_error', { missing: 'WHATSAPP_VERIFY_TOKEN' });
        return response('Service Unavailable', 503);
      }

      const mode = url.searchParams.get('hub.mode');
      const suppliedToken = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      if (
        mode === 'subscribe' &&
        challenge !== null &&
        secureEqual(suppliedToken ?? '', verifyToken)
      ) {
        logger.info('whatsapp_webhook_verified', { mode: 'subscribe' });
        return response(challenge, 200);
      }

      logger.warn('whatsapp_webhook_verification_rejected', {
        mode: safeText(mode),
        challengePresent: challenge !== null
      });
      return response('Forbidden', 403);
    }

    if (request.method === 'POST') {
      const appSecret = env?.META_APP_SECRET;
      if (!appSecret) {
        logger.error('whatsapp_webhook_configuration_error', { missing: 'META_APP_SECRET' });
        return response('Service Unavailable', 503);
      }

      const contentLength = Number(request.headers.get('content-length'));
      if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        logger.warn('whatsapp_webhook_payload_rejected', { reason: 'payload_too_large' });
        return response('Payload Too Large', 413);
      }

      const rawBody = await request.text();
      if (encoder.encode(rawBody).byteLength > MAX_BODY_BYTES) {
        logger.warn('whatsapp_webhook_payload_rejected', { reason: 'payload_too_large' });
        return response('Payload Too Large', 413);
      }

      const signature = request.headers.get('x-hub-signature-256');
      if (!(await hasValidSignature(rawBody, signature, appSecret))) {
        logger.warn('whatsapp_webhook_signature_rejected', { signaturePresent: Boolean(signature) });
        return response('Unauthorized', 401);
      }

      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch {
        logger.warn('whatsapp_webhook_payload_rejected', { reason: 'invalid_json' });
        return response('Bad Request', 400);
      }

      const summary = summarizeWhatsAppEvent(payload);
      logger.info('whatsapp_webhook_received', {
        messageCount: summary.messages.length,
        statusCount: summary.statuses.length,
        messages: summary.messages,
        statuses: summary.statuses
      });

      // Conversation layer: generate and send replies for inbound messages.
      // Awaited so the Worker never terminates before the send completes;
      // the handler itself never throws.
      try {
        await handleIncomingWhatsAppMessages(env, summary);
      } catch (err) {
        logger.error('whatsapp_reply_flow_error', { error: String(err?.message || err) });
      }

      return response('EVENT_RECEIVED', 200);
    }

    return response('Method Not Allowed', 405, { allow: 'GET, POST' });
  };
}

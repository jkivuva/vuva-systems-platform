import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';

import { createWhatsAppWebhookHandler } from '../src/whatsapp-webhook.js';

const VERIFY_TOKEN = 'test-verify-token-with-enough-entropy';
const APP_SECRET = 'test-meta-app-secret';
const WEBHOOK_URL = 'https://example.com/webhook';

let logEntries;
let logger;
let handler;

beforeEach(() => {
  logEntries = [];
  logger = {
    info(event, details) {
      logEntries.push({ level: 'info', event, details });
    },
    warn(event, details) {
      logEntries.push({ level: 'warn', event, details });
    },
    error(event, details) {
      logEntries.push({ level: 'error', event, details });
    }
  };
  handler = createWhatsAppWebhookHandler({ logger });
});

afterEach(() => {
  logEntries = [];
});

async function signatureFor(body, secret = APP_SECRET) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `sha256=${hex}`;
}

function env(overrides = {}) {
  return {
    WHATSAPP_VERIFY_TOKEN: VERIFY_TOKEN,
    META_APP_SECRET: APP_SECRET,
    ...overrides
  };
}

describe('GET /webhook verification', () => {
  test('returns Meta challenge exactly for a valid request', async () => {
    const challenge = '1234567890';
    const url = new URL(WEBHOOK_URL);
    url.search = new URLSearchParams({
      'hub.mode': 'subscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': challenge
    });

    const response = await handler(new Request(url), env());

    assert.equal(response.status, 200);
    assert.equal(await response.text(), challenge);
    assert.match(response.headers.get('content-type'), /^text\/plain/);
  });

  test('rejects an invalid verification token', async () => {
    const url = new URL(WEBHOOK_URL);
    url.search = new URLSearchParams({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong-token',
      'hub.challenge': 'do-not-return'
    });

    const response = await handler(new Request(url), env());

    assert.equal(response.status, 403);
    assert.notEqual(await response.text(), 'do-not-return');
  });

  test('fails closed when the verification token is not configured', async () => {
    const url = new URL(WEBHOOK_URL);
    url.search = new URLSearchParams({
      'hub.mode': 'subscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': 'do-not-return'
    });

    const response = await handler(new Request(url), env({ WHATSAPP_VERIFY_TOKEN: '' }));

    assert.equal(response.status, 503);
  });
});

describe('POST /webhook delivery', () => {
  const messagePayload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'waba-id',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '15550000000', phone_number_id: 'phone-id' },
              contacts: [{ wa_id: '254700000000', profile: { name: 'Customer' } }],
              messages: [
                {
                  from: '254700000000',
                  id: 'wamid.message-id',
                  timestamp: '1720000000',
                  type: 'text',
                  text: { body: 'Hello\nI need help' }
                }
              ]
            }
          }
        ]
      }
    ],
    access_token: 'must-never-be-logged'
  };

  test('accepts a correctly signed message and logs only a safe summary', async () => {
    const body = JSON.stringify(messagePayload);
    const response = await handler(
      new Request(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-hub-signature-256': await signatureFor(body)
        },
        body
      }),
      env()
    );

    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'EVENT_RECEIVED');

    const serializedLogs = JSON.stringify(logEntries);
    assert.match(serializedLogs, /254700000000/);
    assert.match(serializedLogs, /wamid\.message-id/);
    assert.match(serializedLogs, /Hello I need help/);
    assert.doesNotMatch(serializedLogs, /must-never-be-logged/);
    assert.doesNotMatch(serializedLogs, /test-meta-app-secret/);
  });

  test('accepts and summarizes message status events', async () => {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          changes: [
            {
              field: 'messages',
              value: {
                statuses: [
                  {
                    id: 'wamid.status-id',
                    status: 'delivered',
                    timestamp: '1720000001',
                    recipient_id: '254700000000'
                  }
                ]
              }
            }
          ]
        }
      ]
    };
    const body = JSON.stringify(payload);

    const response = await handler(
      new Request(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'x-hub-signature-256': await signatureFor(body) },
        body
      }),
      env()
    );

    assert.equal(response.status, 200);
    assert.match(JSON.stringify(logEntries), /delivered/);
    assert.match(JSON.stringify(logEntries), /wamid\.status-id/);
  });

  test('rejects an invalid signature before parsing or logging the payload', async () => {
    const body = JSON.stringify(messagePayload);
    const response = await handler(
      new Request(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'x-hub-signature-256': `sha256=${'0'.repeat(64)}` },
        body
      }),
      env()
    );

    assert.equal(response.status, 401);
    assert.doesNotMatch(JSON.stringify(logEntries), /wamid\.message-id/);
  });

  test('rejects unsigned webhook deliveries', async () => {
    const response = await handler(
      new Request(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(messagePayload) }),
      env()
    );

    assert.equal(response.status, 401);
  });

  test('fails closed when the Meta App Secret is not configured', async () => {
    const body = JSON.stringify(messagePayload);
    const response = await handler(
      new Request(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'x-hub-signature-256': await signatureFor(body) },
        body
      }),
      env({ META_APP_SECRET: '' })
    );

    assert.equal(response.status, 503);
  });

  test('rejects malformed JSON with a valid signature', async () => {
    const body = '{not-json';
    const response = await handler(
      new Request(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'x-hub-signature-256': await signatureFor(body) },
        body
      }),
      env()
    );

    assert.equal(response.status, 400);
  });
});

test('returns 404 outside the webhook route and 405 for unsupported webhook methods', async () => {
  assert.equal((await handler(new Request('https://example.com/'), env())).status, 404);
  assert.equal((await handler(new Request(WEBHOOK_URL, { method: 'PUT' }), env())).status, 405);
});

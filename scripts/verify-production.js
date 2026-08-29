import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';

function loadEnv(path) {
  const values = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.trimStart().startsWith('#') || !line.includes('=')) continue;
    const [name, ...parts] = line.split('=');
    values[name.trim()] = parts.join('=').trim();
  }
  return values;
}

const localEnv = loadEnv(new URL('../.env', import.meta.url));
const verifyToken = localEnv.WHATSAPP_VERIFY_TOKEN;
const appSecret = localEnv.META_APP_SECRET;
const baseUrl =
  process.env.PRODUCTION_BASE_URL ||
  'https://vuva-systems-whatsapp-webhook.vuva-systems.workers.dev';

assert.ok(verifyToken, 'WHATSAPP_VERIFY_TOKEN must be present in .env');
assert.ok(appSecret, 'META_APP_SECRET must be present in .env');

const health = await fetch(`${baseUrl}/health`);
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), { status: 'ok' });
console.log('PASS health endpoint: 200');

const challenge = `production-check-${Date.now()}`;
const verificationUrl = new URL('/webhook', baseUrl);
verificationUrl.search = new URLSearchParams({
  'hub.mode': 'subscribe',
  'hub.verify_token': verifyToken,
  'hub.challenge': challenge
});
const verification = await fetch(verificationUrl);
assert.equal(verification.status, 200);
assert.equal(await verification.text(), challenge);
console.log('PASS valid Meta verification: exact challenge returned');

verificationUrl.searchParams.set('hub.verify_token', 'invalid-production-check-token');
verificationUrl.searchParams.set('hub.challenge', 'must-not-be-returned');
const rejectedVerification = await fetch(verificationUrl);
assert.equal(rejectedVerification.status, 403);
assert.notEqual(await rejectedVerification.text(), 'must-not-be-returned');
console.log('PASS invalid Meta verification: 403');

const payload = JSON.stringify({
  object: 'whatsapp_business_account',
  entry: [
    {
      changes: [
        {
          field: 'messages',
          value: {
            messages: [
              {
                from: 'production-test-sender',
                id: `wamid.production-check-${Date.now()}`,
                timestamp: String(Math.floor(Date.now() / 1000)),
                type: 'text',
                text: { body: 'Production signature verification test' }
              }
            ]
          }
        }
      ]
    }
  ]
});
const signature = `sha256=${createHmac('sha256', appSecret).update(payload).digest('hex')}`;
const delivery = await fetch(new URL('/webhook', baseUrl), {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-hub-signature-256': signature
  },
  body: payload
});
assert.equal(delivery.status, 200);
assert.equal(await delivery.text(), 'EVENT_RECEIVED');
console.log('PASS valid signed delivery: 200 EVENT_RECEIVED');

const rejectedDelivery = await fetch(new URL('/webhook', baseUrl), {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-hub-signature-256': `sha256=${'0'.repeat(64)}`
  },
  body: payload
});
assert.equal(rejectedDelivery.status, 401);
console.log('PASS invalid signed delivery: 401');

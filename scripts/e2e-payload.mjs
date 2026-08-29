// One-shot: build signed Meta webhook payloads for inbox E2E testing.
import { createHmac } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const secret = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  .match(/^META_APP_SECRET=(.*)$/m)[1].trim();

// NOTE: '254700000001' is a neutral E2E fixture number. Do NOT use a real
// contact number here — the webhook loop-guard silently drops messages
// 'from' the business's own WhatsApp number.
const FIXTURE_CUSTOMER = '254700000001';

const makePayload = (body, id) => JSON.stringify({
  object: 'whatsapp_business_account',
  entry: [{
    id: 'E2E',
    changes: [{
      field: 'messages',
      value: {
        messaging_product: 'whatsapp',
        metadata: { display_phone_number: '254739694759', phone_number_id: '1259441573927280' },
        contacts: [{ profile: { name: 'Inbox Test' }, wa_id: FIXTURE_CUSTOMER }],
        messages: [{
          from: FIXTURE_CUSTOMER,
          id: `wamid.inbox-${id}`,
          timestamp: String(Math.floor(Date.now() / 1000)),
          type: 'text',
          text: { body }
        }]
      }
    }]
  }]
});

const sign = (payload) => `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;

const mode = process.argv[2] || 'msg';
if (mode === 'msg') {
  const body = process.argv[3] || 'Hi, I need help';
  const payload = makePayload(body, Date.now());
  writeFileSync(new URL('../.e2e-payload.json', import.meta.url), payload);
  writeFileSync(new URL('../.e2e-sig.txt', import.meta.url), sign(payload));
  console.log('message payload written:', body);
} else {
  console.log('unknown mode');
}

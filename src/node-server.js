import http from 'node:http';
import { createWhatsAppWebhookHandler } from './whatsapp-webhook.js';

const port = Number(process.env.PORT || 8787);
const handleWebhook = createWhatsAppWebhookHandler();

const server = http.createServer(async (incoming, outgoing) => {
  try {
    const chunks = [];
    for await (const chunk of incoming) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const origin = `http://${incoming.headers.host || `localhost:${port}`}`;
    const request = new Request(new URL(incoming.url || '/', origin), {
      method: incoming.method,
      headers: incoming.headers,
      body: ['GET', 'HEAD'].includes(incoming.method || '') ? undefined : body
    });

    const response = await handleWebhook(request, process.env);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error('http_request_failed', { name: error?.name });
    if (!outgoing.headersSent) outgoing.writeHead(500, { 'content-type': 'text/plain' });
    outgoing.end('Internal Server Error');
  }
});

server.listen(port, () => {
  const missing = ['WHATSAPP_VERIFY_TOKEN', 'META_APP_SECRET'].filter((name) => !process.env[name]);
  console.info('server_started', { port, missingConfiguration: missing });
});

// Vuva AI — Prospecting: internal API.
// Reached only AFTER the /internal Basic-auth gate in worker.js.
// Server-side proxies so no third-party keys ever reach the browser:
//   - Tavily web search (company discovery)
//   - D1 prospects store (persistence)
//   - WhatsApp Business Cloud API (outbound outreach)
// Every external integration fails with a clear, honest error when its key is unset.

const TAVILY_ENDPOINT = 'https://api.tavily.com/search';
const WHATSAPP_API_VERSION = 'v19.0';
const WHATSAPP_ENDPOINT = (phoneNumberId) =>
  `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

async function readJson(request) {
  try {
    const data = await request.json();
    // Default parameters don't apply to null — hand back an empty object so
    // field validation below returns a clean 400 instead of a worker crash.
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Heuristic signal detection — keyword heuristics over public text.
// Clearly-labelled inferences, never presented as confirmed facts.
// ---------------------------------------------------------------------------
const SIGNAL_RULES = [
  { label: 'No online booking / ordering visible', re: /no online (booking|ordering|order)|book by phone|call to (book|order)|visit us to (book|order)/i },
  { label: 'Manual contact process', re: /(phone|call|email|enquir(?:y|ies)) (only|to|for)|contact us by (phone|email)|call us to/i },
  { label: 'No self-service / portal', re: /no (customer |client |tenant |patient )?(portal|self[- ]service|online account)/i },
  { label: 'Manual quote / intake form', re: /quote request|request a quote|contact form|enquiry form|fill(?:ing)? (?:in|out) (?:a )?form/i },
  { label: 'No live tracking / status', re: /no (live )?tracking|no online status|track your (order|shipment) by (call|phone)/i },
  { label: 'Manual payments', re: /pay (?:by|via|cash|bank transfer|cheque)|no online payment|m-pesa|mpesa/i },
  { label: 'Relies on WhatsApp', re: /whatsapp/i },
  { label: 'Relies on phone / walk-in', re: /walk[- ]in|in[- ]store only|branch visit/i }
];

function detectSignals(text = '') {
  return SIGNAL_RULES.filter((rule) => rule.re.test(text)).map((rule) => rule.label);
}

function cleanCompanyName(title = '') {
  return title
    .replace(/\s*[-–|·].*$/, '') // strip " - About Us", " | Home"
    .replace(/\b(About Us|Home|Contact|Services|Welcome|Official)\s*$/i, '')
    .trim()
    .slice(0, 120);
}

// ---------------------------------------------------------------------------
// Config status — lets the Settings panel show what is actually wired up.
// ---------------------------------------------------------------------------
function configStatus(env) {
  return json({
    ok: true,
    config: {
      database: Boolean(env.DB),
      tavily: Boolean(env.TAVILY_API_KEY),
      whatsapp: Boolean(env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID)
    }
  });
}

// ---------------------------------------------------------------------------
// Search — Tavily proxy.
// ---------------------------------------------------------------------------
async function searchCompanies(env, body = {}) {
  const key = env.TAVILY_API_KEY;
  if (!key) {
    return json({ ok: false, error: 'Search is not configured. Set the TAVILY_API_KEY Worker secret.' }, 503);
  }

  const industry = typeof body.industry === 'string' && body.industry.toLowerCase() !== 'all' ? body.industry : '';
  const country = typeof body.country === 'string' ? body.country.trim() : '';
  const city = typeof body.city === 'string' ? body.city.trim() : '';
  const keywords = typeof body.keywords === 'string' ? body.keywords.trim() : '';

  const segments = [industry, city, country].filter(Boolean);
  let query = segments.length ? `${segments.join(' ')}, companies` : 'companies';
  if (keywords) query += ` ${keywords}`;

  let data;
  try {
    const response = await fetch(TAVILY_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: 'advanced',
        max_results: 10,
        include_answer: false
      })
    });
    if (!response.ok) {
      return json({ ok: false, error: `Search provider returned ${response.status}.` }, 502);
    }
    data = await response.json();
  } catch {
    return json({ ok: false, error: 'Search request failed — check network or the Tavily key.' }, 502);
  }

  const results = (Array.isArray(data.results) ? data.results : []).map((result) => ({
    name: cleanCompanyName(result.title),
    title: result.title,
    url: result.url,
    content: (result.content || '').slice(0, 1500),
    relevance: typeof result.score === 'number' ? Math.round(result.score * 100) : null,
    signals: detectSignals(result.content || '')
  }));

  return json({ ok: true, query, count: results.length, results });
}

// ---------------------------------------------------------------------------
// Prospects — D1 CRUD. `data` stores the full prospect profile as JSON.
// ---------------------------------------------------------------------------
function prospectFromRow(row) {
  let data = {};
  try {
    data = JSON.parse(row.data || '{}');
  } catch {
    data = {};
  }
  return { ...data, id: row.id, status: row.status, created_at: row.created_at, updated_at: row.updated_at };
}

async function listProspects(env) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound. Add the D1 binding and redeploy.' }, 503);
  const { results } = await db.prepare('SELECT * FROM prospects ORDER BY updated_at DESC').all();
  return json({ ok: true, prospects: results.map(prospectFromRow) });
}

async function saveProspect(env, body = {}) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound. Add the D1 binding and redeploy.' }, 503);

  const id = typeof body.id === 'string' && body.id ? body.id : crypto.randomUUID();
  const name = (typeof body.name === 'string' ? body.name : '').trim();
  if (!name) return json({ ok: false, error: 'Prospect name is required.' }, 400);

  const industry = typeof body.industry === 'string' ? body.industry : '';
  const location = typeof body.location === 'string' ? body.location : '';
  const status = typeof body.status === 'string' && body.status ? body.status : 'new';
  const data = { ...body, id, name };

  await db
    .prepare(
      `INSERT INTO prospects (id, name, industry, location, status, data, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         industry = excluded.industry,
         location = excluded.location,
         status = excluded.status,
         data = excluded.data,
         updated_at = datetime('now')`
    )
    .bind(id, name, industry, location, status, JSON.stringify(data))
    .run();

  return json({ ok: true, prospect: { ...data, id, status } });
}

async function deleteProspect(env, id) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound. Add the D1 binding and redeploy.' }, 503);
  if (!id) return json({ ok: false, error: 'Missing prospect id.' }, 400);
  await db.prepare('DELETE FROM prospects WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

// ---------------------------------------------------------------------------
// Outreach — WhatsApp Business Cloud API (outbound).
// ---------------------------------------------------------------------------
async function sendOutreach(env, body = {}) {
  const token = env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return json({
      ok: false,
      error: 'WhatsApp outbound is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID Worker secrets.'
    }, 503);
  }

  const recipient = (typeof body.to === 'string' ? body.to : '').replace(/\D/g, '');
  const message = (typeof body.message === 'string' ? body.message : '').trim();
  if (!recipient || !message) {
    return json({ ok: false, error: 'A recipient phone number and message are required.' }, 400);
  }

  let status = 'failed';
  let error = null;
  let responseJson = {};
  try {
    const response = await fetch(WHATSAPP_ENDPOINT(phoneNumberId), {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body: message }
      })
    });
    responseJson = await response.json().catch(() => ({}));
    if (response.ok) {
      status = 'sent';
    } else {
      error = responseJson?.error?.message || `WhatsApp API returned ${response.status}`;
    }
  } catch (err) {
    error = err?.message || 'Outreach request failed.';
  }

  const db = env.DB;
  if (db) {
    await db
      .prepare(
        `INSERT INTO outreach_log (id, prospect_id, prospect_name, channel, recipient, message, status, error)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        crypto.randomUUID(),
        typeof body.prospectId === 'string' ? body.prospectId : null,
        typeof body.prospectName === 'string' ? body.prospectName : null,
        'whatsapp',
        recipient,
        message,
        status,
        error
      )
      .run();
  }

  if (status === 'sent') {
    return json({ ok: true, status: 'sent', messageId: responseJson?.messages?.[0]?.id || null });
  }
  return json({ ok: false, status: 'failed', error }, 502);
}

// ---------------------------------------------------------------------------
// WhatsApp Inbox — conversation store access for the internal dashboard.
// Reads/writes the whatsapp_chat / whatsapp_automation / whatsapp_read_state tables.
// ---------------------------------------------------------------------------
async function listConversations(env) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound.' }, 503);
  try {
    const { results } = await db
      .prepare(
        `SELECT c.wa_id,
                MAX(c.id) AS last_id,
                COUNT(*) AS total_messages,
                MAX(c.created_at) AS last_at
         FROM whatsapp_chat c
         GROUP BY c.wa_id
         ORDER BY last_at DESC`
      )
      .all();

    const conversations = [];
    for (const row of results || []) {
      const last = await db
        .prepare('SELECT text, direction, status, created_at FROM whatsapp_chat WHERE id = ?')
        .bind(row.last_id)
        .all();
      const modeRow = await db
        .prepare('SELECT mode, conv_status, updated_at FROM whatsapp_automation WHERE wa_id = ?')
        .bind(row.wa_id)
        .all();
      const unread = await db
        .prepare(
          `SELECT COUNT(*) AS n FROM whatsapp_chat
           WHERE wa_id = ? AND direction = 'in' AND created_at > COALESCE(
             (SELECT last_read_at FROM whatsapp_read_state WHERE wa_id = ?), '1970-01-01')`
        )
        .bind(row.wa_id, row.wa_id)
        .all();
      const manual = modeRow?.results?.[0]?.mode === 'manual';
      conversations.push({
        waId: row.wa_id,
        totalMessages: row.total_messages,
        lastAt: last?.results?.[0]?.created_at || null,
        lastText: last?.results?.[0]?.text || '',
        lastDirection: last?.results?.[0]?.direction || 'in',
        lastStatus: last?.results?.[0]?.status || null,
        contactName: (await db
          .prepare(
            `SELECT contact_name FROM whatsapp_chat WHERE wa_id = ? AND contact_name IS NOT NULL ORDER BY id DESC LIMIT 1`
          )
          .bind(row.wa_id)
          .all())?.results?.[0]?.contact_name || null,
        mode: manual ? 'manual' : 'auto',
        // Manual threads read as Waiting (human is answering); auto threads use the stored status.
        convStatus: manual && !['needs_human', 'resolved'].includes(modeRow?.results?.[0]?.conv_status || '')
          ? 'waiting'
          : (modeRow?.results?.[0]?.conv_status || 'active'),
        statusUpdatedAt: modeRow?.results?.[0]?.updated_at || null,
        unread: unread?.results?.[0]?.n || 0
      });
    }
    return json({ ok: true, conversations });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
}

async function getConversationMessages(env, waId) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound.' }, 503);
  if (!waId) return json({ ok: false, error: 'Missing wa_id.' }, 400);
  try {
    const { results } = await db
      .prepare(
        `SELECT id, wa_id, direction, text, status, created_at, contact_name
         FROM whatsapp_chat WHERE wa_id = ? ORDER BY id ASC LIMIT 200`
      )
      .bind(waId)
      .all();
    return json({ ok: true, messages: results || [] });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
}

async function setAutomationMode(env, body = {}) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound.' }, 503);
  const waId = typeof body.waId === 'string' ? body.waId.replace(/\D/g, '') : '';
  const mode = body.mode === 'manual' ? 'manual' : body.mode === 'auto' ? 'auto' : '';
  if (!waId || !mode) return json({ ok: false, error: 'waId and mode ("auto"|"manual") are required.' }, 400);
  try {
    await db
      .prepare(
        `INSERT INTO whatsapp_automation (wa_id, mode, updated_at) VALUES (?, ?, datetime('now'))
         ON CONFLICT(wa_id) DO UPDATE SET mode = excluded.mode, updated_at = datetime('now')`
      )
      .bind(waId, mode)
      .run();
    return json({ ok: true, waId, mode });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
}

// Operator sets the conversation status from the inbox (Active/Waiting/Needs Human/Resolved).
const CONV_STATUSES = ['active', 'waiting', 'needs_human', 'resolved'];
async function setConversationStatus(env, body = {}) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound.' }, 503);
  const waId = typeof body.waId === 'string' ? body.waId.replace(/\D/g, '') : '';
  const status = CONV_STATUSES.includes(body.status) ? body.status : '';
  if (!waId || !status) {
    return json({ ok: false, error: `waId and status (${CONV_STATUSES.join('|')}) are required.` }, 400);
  }
  try {
    // Resolved also resumes automation; any other explicit status keeps the current mode.
    await db
      .prepare(
        `INSERT INTO whatsapp_automation (wa_id, mode, conv_status, updated_at)
         VALUES (?, 'auto', ?2, datetime('now'))
         ON CONFLICT(wa_id) DO UPDATE SET
           conv_status = excluded.conv_status,
           mode = CASE WHEN excluded.conv_status = 'resolved' THEN 'auto' ELSE whatsapp_automation.mode END,
           updated_at = datetime('now')`
      )
      .bind(waId, status)
      .run();
    const modeRow = await db.prepare('SELECT mode FROM whatsapp_automation WHERE wa_id = ?').bind(waId).all();
    return json({ ok: true, waId, status, mode: modeRow?.results?.[0]?.mode || 'auto' });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
}

// Operator manual send from the inbox — logged like any other outbound message.
async function inboxSend(env, body = {}) {
  const waId = typeof body.waId === 'string' ? body.waId.replace(/\D/g, '') : '';
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!waId || !text) return json({ ok: false, error: 'waId and text are required.' }, 400);

  const db = env.DB;
  const sent = await sendWhatsAppTextFromReply(env, waId, text);
  if (db) {
    try {
      await db
        .prepare('INSERT INTO whatsapp_chat (wa_id, direction, text, status, wa_message_id) VALUES (?, ?, ?, ?, ?)')
        .bind(waId, 'out', text, sent.ok ? 'sent' : 'failed', sent.messageId || null)
        .run();
      // The human answered -> conversation is Waiting on the customer.
      await db
        .prepare(
          `INSERT INTO whatsapp_automation (wa_id, mode, conv_status, updated_at) VALUES (?, 'manual', 'waiting', datetime('now'))
           ON CONFLICT(wa_id) DO UPDATE SET conv_status = 'waiting', updated_at = datetime('now')`
        )
        .bind(waId)
        .run();
    } catch {
      // logging is best-effort
    }
  }
  if (!sent.ok) return json({ ok: false, error: sent.error || 'Send failed.' }, 502);
  return json({ ok: true, messageId: sent.messageId || null });
}

// Imported lazily to avoid a circular module import at load time.
async function sendWhatsAppTextFromReply(env, to, body) {
  const mod = await import('./whatsapp-reply.js');
  return mod.sendWhatsAppText(env, to, body);
}

async function markConversationRead(env, body = {}) {
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'Database is not bound.' }, 503);
  const waId = typeof body.waId === 'string' ? body.waId.replace(/\D/g, '') : '';
  if (!waId) return json({ ok: false, error: 'waId is required.' }, 400);
  try {
    await db
      .prepare(
        `INSERT INTO whatsapp_read_state (wa_id, last_read_at) VALUES (?, datetime('now'))
         ON CONFLICT(wa_id) DO UPDATE SET last_read_at = datetime('now')`
      )
      .bind(waId)
      .run();
    return json({ ok: true, waId });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
export async function handleInternalApi(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/internal\/api/, '') || '/';
  const method = request.method;

  if (path === '/config' && method === 'GET') return configStatus(env);
  if (path === '/search' && method === 'POST') return searchCompanies(env, await readJson(request));
  if (path === '/prospects' && method === 'GET') return listProspects(env);
  if (path === '/prospects' && method === 'POST') return saveProspect(env, await readJson(request));
  if (path === '/prospects' && method === 'DELETE') return deleteProspect(env, url.searchParams.get('id') || '');
  if (path === '/outreach' && method === 'POST') return sendOutreach(env, await readJson(request));

  // WhatsApp Inbox
  if (path === '/whatsapp/conversations' && method === 'GET') return listConversations(env);
  if (path === '/whatsapp/messages' && method === 'GET') return getConversationMessages(env, url.searchParams.get('wa_id') || '');
  if (path === '/whatsapp/mode' && method === 'POST') return setAutomationMode(env, await readJson(request));
  if (path === '/whatsapp/status' && method === 'POST') return setConversationStatus(env, await readJson(request));
  if (path === '/whatsapp/send' && method === 'POST') return inboxSend(env, await readJson(request));
  if (path === '/whatsapp/read' && method === 'POST') return markConversationRead(env, await readJson(request));

  return json({ ok: false, error: 'Not found' }, 404);
}

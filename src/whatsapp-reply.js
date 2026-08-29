// Vuva WhatsApp assistant — incoming-message reply engine ("Hermes" conversation layer).
// Called by the webhook handler after signature verification. For every inbound text
// message it logs the message to the whatsapp_chat store, generates a reply from
// business rules and sends it via the WhatsApp Cloud API — unless the human operator
// has taken over that conversation (mode = 'manual').
// Design constraints:
//   - NEVER throws: the webhook must always return 200 EVENT_RECEIVED to Meta.
//   - Dedupes by WhatsApp message id (Meta redelivers on timeout; never double-reply).
//   - Never replies to our own number (loop guard).
//   - Secrets stay server-side; nothing here is exposed to the frontend.

const GRAPH_VERSION = 'v19.0';
const OWN_NUMBER = '254739694759';
const NEEDS_HUMAN_RE = /\b(human|agent|person|manager|complain|refund|angry|unacceptable|sue|lawyer|scam)\b/i;

// ---------------------------------------------------------------------------
// Reply rules — honest, business-appropriate answers about Vuva Systems.
// Open-ended keyword stems so plurals/inflections match ("logistics", "appointments").
// ---------------------------------------------------------------------------
const RULES = [
  {
    re: /\b(hi\b|hello|hey|good (morning|afternoon|evening)|habari|sasa|help|assist|support)/i,
    reply: 'Hello! Welcome to Vuva Systems. We engineer AI-powered business systems — customer portals, WhatsApp automation, dashboards, payments and integrations. What does your business do, and what would you like to improve?'
  },
  {
    re: /\b(price|pricing|cost|charge|quote|how much)/i,
    reply: 'Every project is scoped individually. As a guide: focused builds start under KSh 500k, connected systems KSh 500k–2M, and full platforms above that. Tell me a bit about what you need and I\'ll arrange a proper estimate — no obligation.'
  },
  {
    re: /\b(service|what do you (do|build|offer))/i,
    reply: 'Vuva Systems builds: AI agents & automation, custom SaaS platforms, enterprise dashboards, customer portals, API & payment integrations (M-Pesa, cards), and internal business software. Which area is relevant to you?'
  },
  {
    re: /\b(logistic|fleet|shipment|deliver|track|transport|courier)/i,
    reply: 'Logistics is one of our core areas — shipment tracking, dispatch, fleet management, customer portals and automated WhatsApp updates. We built this for a real freight operation. Want to see a live demo?'
  },
  {
    re: /\b(health|hospital|clinic|patient|appointment|medical|pharmac)/i,
    reply: 'We build healthcare systems: online appointment booking, queue management, billing & M-Pesa payments, patient communication and analytics. You can try an interactive demo on our website under Systems → Healthcare.'
  },
  {
    re: /\b(rent|tenant|propert|real estate|landlord|house)/i,
    reply: 'For property management we build tenant portals, rent collection with M-Pesa, maintenance ticketing and viewing bookings. There\'s an interactive demo at vuvasystems.com → Systems → Real Estate.'
  },
  {
    re: /\b(restaurant|hotel|food|order|kitchen|rider|menu)/i,
    reply: 'For restaurants and hospitality we build online ordering, kitchen displays, delivery dispatch, rider tracking and multi-branch reporting — modeled on a real multi-branch food business. Want a walkthrough?'
  },
  {
    re: /\b(shop|retail|inventor|stock|wholesale|supplier)/i,
    reply: 'For retail and distribution we build inventory management, multi-branch reporting, supplier records, sales analytics and payment integration. What does your operation look like?'
  },
  {
    re: /\b(web ?site|web ?app)/i,
    reply: 'Yes — we build fast, polished websites and web applications, from a focused business site to a full operational platform. Every build is engineered around how your business actually runs.'
  },
  {
    re: /\b(ai|agent|chatbot|automat|gpt|llm)/i,
    reply: 'AI is central to what we do: agents that understand customer requests, access your business data, trigger workflows and take real actions — on WhatsApp, your portal or your dashboard. What would you like to automate?'
  },
  {
    re: /\b(demo|example|portfolio|case stud)/i,
    reply: 'You can explore interactive demos of our systems at https://vuvasystems.com — logistics, healthcare, real estate, hospitality and retail. Our real project references (Limitless Logistics, Blitz Restaurant) are featured there too.'
  },
  {
    re: /\b(contact|human|person|call|phone|speak|talk|email|meet)/i,
    reply: 'You can WhatsApp us on +254 796 117 443, call +254 739 694 759, or email hello@vuvasystems.com. Or just tell me here what you need and we\'ll follow up.'
  },
  {
    re: /\b(thanks|thank you|asante|great|perfect|okay|\bok\b)/i,
    reply: 'You\'re welcome! If you think of anything else — a process to automate, a system to build — just message us here. Karibu tena.'
  }
];

const FALLBACK = 'Thanks for reaching out to Vuva Systems! Tell me a bit about your business and what you\'d like to improve — automation, a customer portal, dashboards, payments, AI — and I\'ll point you in the right direction. You can also explore live demos at https://vuvasystems.com';

export function generateReply(text) {
  const value = String(text || '');
  for (const rule of RULES) {
    if (rule.re.test(value)) return rule.reply;
  }
  return FALLBACK;
}

// Conversation-status signal for the inbox: does this inbound message mean the
// customer needs a human? Used by the webhook handler to flag the conversation.
export function needsHuman(text) {
  return NEEDS_HUMAN_RE.test(String(text || ''));
}

// ---------------------------------------------------------------------------
// Outbound send via WhatsApp Cloud API
// ---------------------------------------------------------------------------
export async function sendWhatsAppText(env, to, body) {
  const token = env?.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = env?.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return { ok: false, error: 'WhatsApp credentials not configured' };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, messageId: data?.messages?.[0]?.id || null };
    return { ok: false, error: data?.error?.message || `HTTP ${res.status}`, code: data?.error?.code };
  } catch (err) {
    return { ok: false, error: err?.message || 'send failed' };
  }
}

// ---------------------------------------------------------------------------
// Inbound handler — log, dedupe, respect takeover, reply. Never throws.
// ---------------------------------------------------------------------------
async function automationMode(db, waId) {
  try {
    const row = await db.prepare('SELECT mode FROM whatsapp_automation WHERE wa_id = ?').bind(waId).all();
    return row?.results?.[0]?.mode === 'manual' ? 'manual' : 'auto';
  } catch {
    return 'auto';
  }
}

// Move a conversation's inbox status. Creates the automation row on first touch
// (defaulting to auto mode); never throws — inbox status is best-effort.
async function bumpConversationStatus(db, waId, status) {
  try {
    await db
      .prepare(
        `INSERT INTO whatsapp_automation (wa_id, mode, conv_status, updated_at)
         VALUES (?, 'auto', ?, datetime('now'))
         ON CONFLICT(wa_id) DO UPDATE SET conv_status = excluded.conv_status, updated_at = datetime('now')`
      )
      .bind(waId, status)
      .run();
  } catch {
    // best-effort
  }
}

export async function handleIncomingWhatsAppMessages(env, summary) {
  if (!env || !Array.isArray(summary?.messages)) return;
  const db = env.DB;

  for (const message of summary.messages) {
    const sender = message.senderWhatsAppId;
    const text = message.text;
    if (!sender || !text) continue;
    if (sender.replace(/\D/g, '') === OWN_NUMBER) continue; // loop guard

    // Dedupe + log the inbound message.
    if (db) {
      try {
        const existing = await db
          .prepare('SELECT id FROM whatsapp_chat WHERE wa_message_id = ?')
          .bind(message.messageId || '')
          .all();
        if (existing?.results?.length) continue; // Meta redelivery — already handled
        await db
          .prepare(
            'INSERT INTO whatsapp_chat (wa_id, direction, text, status, wa_message_id, contact_name) VALUES (?, ?, ?, ?, ?, ?)'
          )
          .bind(sender, 'in', text, 'received', message.messageId || null, message.contactName || null)
          .run();
      } catch {
        // logging is best-effort; never block the reply
      }
      // Status: customer spoke -> Active (or Needs Human when they ask for one /
      // complain). Also re-opens Resolved threads when the customer writes again.
      await bumpConversationStatus(db, sender, needsHuman(text) ? 'needs_human' : 'active');
    }

    // Take-over check: when the operator holds the conversation, Hermes stays silent.
    let mode = 'auto';
    if (db) mode = await automationMode(db, sender);
    if (mode === 'manual') continue;

    const reply = generateReply(text);
    const sent = await sendWhatsAppText(env, sender, reply);

    if (db) {
      try {
        await db
          .prepare('INSERT INTO whatsapp_chat (wa_id, direction, text, status, wa_message_id) VALUES (?, ?, ?, ?, ?)')
          .bind(sender, 'out', reply, sent.ok ? 'sent' : 'failed', sent.messageId || null)
          .run();
      } catch {
        // logging is best-effort
      }
      // Hermes answered -> Waiting for the customer's next move.
      await bumpConversationStatus(db, sender, 'waiting');
    }
  }
}

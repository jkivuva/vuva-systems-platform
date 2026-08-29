-- Vuva WhatsApp Inbox — conversation store (additive; no existing tables touched).
CREATE TABLE IF NOT EXISTS whatsapp_chat (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  wa_id          TEXT NOT NULL,
  direction      TEXT NOT NULL,                 -- 'in' | 'out'
  text           TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'received', -- received | sent | failed
  wa_message_id  TEXT,
  contact_name   TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_chat_wa ON whatsapp_chat(wa_id, created_at);

-- Per-conversation automation mode: 'auto' (Hermes replies) | 'manual' (human took over).
CREATE TABLE IF NOT EXISTS whatsapp_automation (
  wa_id      TEXT PRIMARY KEY,
  mode       TEXT NOT NULL DEFAULT 'auto',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Read markers for unread indicators.
CREATE TABLE IF NOT EXISTS whatsapp_read_state (
  wa_id        TEXT PRIMARY KEY,
  last_read_at TEXT NOT NULL DEFAULT (datetime('now'))
);

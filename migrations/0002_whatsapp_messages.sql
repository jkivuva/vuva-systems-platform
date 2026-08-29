-- Vuva WhatsApp assistant — inbound message log (additive; no existing tables touched).
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  message_id   TEXT PRIMARY KEY,
  sender       TEXT,
  text         TEXT,
  reply        TEXT,
  reply_status TEXT,
  reply_error  TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

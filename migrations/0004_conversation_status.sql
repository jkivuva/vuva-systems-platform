-- Vuva WhatsApp Inbox — per-conversation status (additive; no existing tables touched).
-- Lifecycle: active (customer chatting, Hermes on it) -> waiting (Hermes answered,
-- awaiting customer) -> needs_human (Hermes could not help / operator flagged) ->
-- resolved (closed by the operator). 'waiting' also covers manual-mode threads.
ALTER TABLE whatsapp_automation ADD COLUMN conv_status TEXT NOT NULL DEFAULT 'active';

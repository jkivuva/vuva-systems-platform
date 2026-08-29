-- Vuva AI Prospecting — initial schema.
-- Prospect rows store the full profile as JSON in `data` with a few denormalised
-- columns for filtering. All times UTC (SQLite datetime('now')).

CREATE TABLE IF NOT EXISTS prospects (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  industry   TEXT,
  location   TEXT,
  status     TEXT NOT NULL DEFAULT 'new',
  data       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_prospects_industry ON prospects(industry);
CREATE INDEX IF NOT EXISTS idx_prospects_status   ON prospects(status);

CREATE TABLE IF NOT EXISTS outreach_log (
  id            TEXT PRIMARY KEY,
  prospect_id   TEXT,
  prospect_name TEXT,
  channel       TEXT NOT NULL,
  recipient     TEXT,
  message       TEXT,
  status        TEXT NOT NULL,
  error         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_outreach_created ON outreach_log(created_at);

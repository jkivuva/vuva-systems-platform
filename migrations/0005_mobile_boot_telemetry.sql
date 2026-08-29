-- Vuva mobile boot telemetry
-- Captures JS errors, unhandled rejections and failed resource loads
-- during the first 30 seconds after page load, only on mobile viewports.
-- Used to diagnose "black screen" reports from real users.
CREATE TABLE IF NOT EXISTS mobile_boot_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,                    -- ms since epoch on user device
  received_at INTEGER NOT NULL,           -- server time
  vw INTEGER, vh INTEGER, dpr REAL,
  href TEXT,
  ua TEXT,
  net_type TEXT, net_downlink REAL, net_rtt INTEGER,
  errs_json TEXT,                         -- JSON array of {msg, src, line, col, t}
  rej_json TEXT,                          -- JSON array of {msg, t}
  failed_json TEXT                        -- JSON array of {name, type, dur}
);
CREATE INDEX IF NOT EXISTS mbev_received ON mobile_boot_events(received_at);
CREATE INDEX IF NOT EXISTS mbev_ua ON mobile_boot_events(ua);

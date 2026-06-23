-- 006_scan_analytics.sql
-- QR scan tracking table — fire-and-forget insert on every non-draft /[code] resolve.
-- Analytics only visible to authenticated admins; public can only INSERT.

CREATE TABLE IF NOT EXISTS qr_scans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL,
  scanned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country     TEXT,           -- CF-IPCountry header (free from Cloudflare / Vercel Edge)
  city        TEXT,           -- CF-IPCity header
  user_agent  TEXT,           -- truncated to 300 chars on insert
  referrer    TEXT,           -- truncated to 500 chars on insert
  session_id  TEXT            -- anonymous, optional client-side fingerprint
);

-- Lean indexes for the analytics queries used in /admin/analytics
CREATE INDEX IF NOT EXISTS idx_qr_scans_code       ON qr_scans(code);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scans_country    ON qr_scans(country) WHERE country IS NOT NULL;

-- RLS
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Only admins can read scan data
CREATE POLICY "Authenticated users can read scans"
  ON qr_scans FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anyone can record a scan (no auth required — the QR scan page is public)
CREATE POLICY "Public can insert scans"
  ON qr_scans FOR INSERT
  WITH CHECK (TRUE);

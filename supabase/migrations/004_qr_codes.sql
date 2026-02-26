-- QR Code Product Verification System
-- Each QR code maps to a unique physical bottle with product info

CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  product_name TEXT,
  product_image TEXT,
  batch_number TEXT,
  expiration_date DATE,
  concentration TEXT,
  purity TEXT,
  description TEXT,
  storage_info TEXT,
  coa_url TEXT,
  extra_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON qr_codes(status);

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view non-draft QR codes"
  ON qr_codes FOR SELECT
  USING (status != 'draft' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage QR codes"
  ON qr_codes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

INSERT INTO qr_codes (code, status)
SELECT 'q' || generate_series, 'draft'
FROM generate_series(1, 100)
ON CONFLICT (code) DO NOTHING;

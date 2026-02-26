-- Site Settings Table
-- Single row table for global site configuration

CREATE TABLE site_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for site_settings" ON site_settings
  FOR SELECT USING (TRUE);

-- Authenticated users can manage
CREATE POLICY "Authenticated users manage site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO site_settings (id, settings) VALUES ('default', '{
  "site_name": "Nadova Labs",
  "site_description": "Premium research peptides for longevity and wellness.",
  "contact_email": "research@nadovalabs.com",
  "support_email": "support@nadovalabs.com",
  "business_hours": "9AM - 6PM JST",
  "accent_color": "#00d4aa",
  "secondary_color": "#7c3aed"
}'::jsonb);

-- Add 'type' column alias for content_blocks if needed
-- (the schema uses 'content_type', but we can add a view or just use content_type)
-- For simplicity, we'll rename in the admin code to use content_type

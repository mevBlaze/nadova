INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-assets', 'qr-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view QR assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'qr-assets');

CREATE POLICY "Authenticated can manage QR assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'qr-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update QR assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'qr-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete QR assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'qr-assets' AND auth.role() = 'authenticated');

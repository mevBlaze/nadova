-- Migration 008: DOT-signing columns for qr_codes
-- Adds Ed25519 signature + pubkey columns so each QR credential is
-- cryptographically unforgeable (signed at write-time by the Nadova private key).

ALTER TABLE qr_codes
  ADD COLUMN IF NOT EXISTS dot_signature TEXT,
  ADD COLUMN IF NOT EXISTS dot_pubkey    TEXT,
  ADD COLUMN IF NOT EXISTS dot_payload   JSONB;

-- Index for fast pubkey lookups (useful if we ever rotate keys and need to
-- find all credentials signed with a given key).
CREATE INDEX IF NOT EXISTS idx_qr_codes_dot_pubkey
  ON qr_codes (dot_pubkey) WHERE dot_pubkey IS NOT NULL;

COMMENT ON COLUMN qr_codes.dot_signature IS
  'Ed25519 signature (128 hex chars / 64 bytes) over dot_payload canonical JSON, signed by Nadova Labs private key';
COMMENT ON COLUMN qr_codes.dot_pubkey IS
  'Ed25519 public key (64 hex chars / 32 bytes) used to verify dot_signature';
COMMENT ON COLUMN qr_codes.dot_payload IS
  'Canonical payload that was signed: {code, productName, batchNumber, purity, concentration, coaUrl, expirationDate, issuedAt, issuer}';

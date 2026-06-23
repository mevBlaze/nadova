/**
 * dot-sign.ts — DOT-signing for Nadova QR credentials
 *
 * Signing approach: Ed25519 via @noble/ed25519 v3 (audited, zero-dep, Web Crypto backed).
 * All APIs are async so they work identically on the Next.js server (Node.js)
 * and in the browser (Web Crypto subtleCrypto).
 *
 * Canonical payload: deterministic JSON.stringify of the fields below,
 * sorted by key to guarantee byte-stable output across environments.
 *
 * Private key: lives ONLY in NADOVA_SIGNING_KEY server env var.
 *
 * Public key — two-tier trust model:
 *   OFFLINE FAST-PATH  — NEXT_PUBLIC_NADOVA_PUBKEY (embedded at build time)
 *   CANONICAL AUTHORITY — https://oracle.axxis.world/.well-known/nadova-pubkey.json
 *     (foundation rule: trust root lives on axxis.world, never on the product domain)
 *
 * Verification always succeeds from the embedded key alone — the axxis.world fetch
 * is advisory (used for rotation/revocation detection) and never blocks verification.
 */

import * as ed from '@noble/ed25519';

// ---------------------------------------------------------------------------
// Canonical payload type — exactly what gets signed
// ---------------------------------------------------------------------------

export interface DotQrPayload {
  code: string;
  productName: string;
  batchNumber: string | null;
  purity: string | null;
  concentration: string | null;
  coaUrl: string | null;
  expirationDate: string | null;
  issuedAt: string; // ISO-8601 UTC
  issuer: 'nadova-labs'; // fixed — prevents cross-issuer forgery
}

// ---------------------------------------------------------------------------
// Serialization — deterministic, byte-stable across server + browser
// ---------------------------------------------------------------------------

/** Canonical UTF-8 bytes for a payload. Keys are sorted to prevent
 *  environment-specific JSON serialization differences. */
function canonicalBytes(payload: DotQrPayload): Uint8Array {
  const sorted = Object.fromEntries(
    Object.entries(payload).sort(([a], [b]) => a.localeCompare(b)),
  );
  return new TextEncoder().encode(JSON.stringify(sorted));
}

// ---------------------------------------------------------------------------
// Hex helpers (zero-dep, browser+node safe)
// ---------------------------------------------------------------------------

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('hex string has odd length');
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) throw new Error(`invalid hex at offset ${i * 2}`);
    out[i] = byte;
  }
  return out;
}

function bytesToHex(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length; i++) {
    const byte = b[i];
    if (byte === undefined) continue;
    s += byte.toString(16).padStart(2, '0');
  }
  return s;
}

// ---------------------------------------------------------------------------
// Server-side: sign a QR payload (call from Next.js Server Action / API route)
// ---------------------------------------------------------------------------

/**
 * Sign a QrCode row's credential fields with the Nadova private key.
 *
 * Returns { signature: hex64, pubkey: hex64, payload: DotQrPayload }
 * to be stored on the qr_codes row.
 *
 * NEVER call this from a 'use client' component — the env var is server-only.
 */
export async function signQrCredential(
  fields: Omit<DotQrPayload, 'issuedAt' | 'issuer'>,
): Promise<{ signature: string; pubkey: string; payload: DotQrPayload }> {
  const privHex = process.env.NADOVA_SIGNING_KEY;
  if (!privHex || privHex.length !== 64) {
    throw new Error(
      'NADOVA_SIGNING_KEY is missing or invalid — set it in Vercel env vars',
    );
  }

  const pubHex = process.env.NEXT_PUBLIC_NADOVA_PUBKEY;
  if (!pubHex || pubHex.length !== 64) {
    throw new Error('NEXT_PUBLIC_NADOVA_PUBKEY is missing or invalid');
  }

  const payload: DotQrPayload = {
    ...fields,
    issuedAt: new Date().toISOString(),
    issuer: 'nadova-labs',
  };

  const seed = hexToBytes(privHex);
  const canonical = canonicalBytes(payload);
  const sigBytes = await ed.signAsync(canonical, seed);

  return {
    signature: bytesToHex(sigBytes),
    pubkey: pubHex,
    payload,
  };
}

// ---------------------------------------------------------------------------
// Public key authority — axxis.world canonical anchor
// ---------------------------------------------------------------------------

/**
 * The canonical public key anchor on axxis.world.
 * Foundation rule: trust root lives here, never on a product domain.
 * This path is served as a static nginx inline-return — zero backend required.
 * Rotation: update the nginx block on ds2 + NEXT_PUBLIC_NADOVA_PUBKEY in Vercel, then nginx -s reload.
 */
const NADOVA_PUBKEY_AUTHORITY_URL =
  'https://oracle.axxis.world/.well-known/nadova-pubkey.json';

interface NadovaPubkeyDoc {
  issuer: string;
  algorithm: string;
  pubkey: string;
  created_at: string;
}

/**
 * Fetch the canonical public key from the axxis.world authority endpoint.
 * Returns null on any network failure — callers must fall back to the embedded key.
 * Caches for 1 hour via Next.js fetch revalidation (ISR); CDN max-age=3600 in browser.
 */
async function fetchAuthorityKey(): Promise<string | null> {
  try {
    const res = await fetch(NADOVA_PUBKEY_AUTHORITY_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000), // never block the UI more than 4s
    });
    if (!res.ok) return null;
    const doc = (await res.json()) as NadovaPubkeyDoc;
    // Validate the doc structure — reject malformed responses
    if (doc.issuer !== 'nadova-labs' || !doc.pubkey || doc.pubkey.length !== 64) return null;
    return doc.pubkey;
  } catch {
    // Network timeout, CORS, parse error — gracefully fall back to embedded key
    return null;
  }
}

// ---------------------------------------------------------------------------
// Client-side (and server-side): verify a stored credential
// ---------------------------------------------------------------------------

export type VerifyResult =
  | { ok: true; payload: DotQrPayload; keySource: 'authority' | 'embedded' }
  | { ok: false; reason: string };

/**
 * Verify an Ed25519 signature over a QR credential.
 *
 * Trust model (two-tier):
 *   OFFLINE FAST-PATH — pubkeyHex (stored on the QR row, embedded at sign time).
 *     Crypto verification runs immediately from this alone. No network required.
 *   CANONICAL AUTHORITY — https://oracle.axxis.world/.well-known/nadova-pubkey.json
 *     Fetched in parallel as an authority cross-check. If reachable AND the fetched
 *     key disagrees with the stored key → verification fails (rotation violation /
 *     possible forgery). If the authority is unreachable → fall back to embedded key
 *     (offline resilience: a network blip must never block a valid verification).
 *
 * Safe to call from both 'use client' components and server routes.
 * Never touches the private key.
 */
export async function verifyQrCredential(
  payload: DotQrPayload,
  signatureHex: string,
  pubkeyHex: string,
): Promise<VerifyResult> {
  try {
    if (!signatureHex || signatureHex.length !== 128) {
      return { ok: false, reason: 'malformed signature (expected 64-byte hex)' };
    }
    if (!pubkeyHex || pubkeyHex.length !== 64) {
      return { ok: false, reason: 'malformed public key (expected 32-byte hex)' };
    }
    // Reject credentials not issued by Nadova Labs
    if (payload.issuer !== 'nadova-labs') {
      return { ok: false, reason: 'unknown issuer' };
    }

    const sig = hexToBytes(signatureHex);
    const pub = hexToBytes(pubkeyHex);
    const canonical = canonicalBytes(payload);

    // Run crypto verification and authority key fetch in parallel —
    // no UI latency added by the authority check.
    const [valid, authorityPubkey] = await Promise.all([
      ed.verifyAsync(sig, canonical, pub),
      fetchAuthorityKey(),
    ]);

    if (!valid) {
      return {
        ok: false,
        reason: 'signature verification failed — credential may have been tampered',
      };
    }

    // Authority cross-check: if we got a key back and it disagrees with the stored
    // key, the credential was signed with a stale or unauthorized key.
    // If the authority is unreachable (null), we trust the embedded key — offline resilience.
    if (authorityPubkey !== null && authorityPubkey !== pubkeyHex) {
      return {
        ok: false,
        reason: 'public key mismatch — key may have been rotated; rescan to refresh',
      };
    }

    return {
      ok: true,
      payload,
      keySource: authorityPubkey !== null ? 'authority' : 'embedded',
    };
  } catch (err) {
    return {
      ok: false,
      reason: `verification error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Convenience: build a DotQrPayload from a QrCode DB row
// ---------------------------------------------------------------------------

import type { QrCode } from '@/types';

export function payloadFromQrCode(qr: QrCode): Omit<DotQrPayload, 'issuedAt' | 'issuer'> {
  return {
    code: qr.code,
    productName: qr.product_name ?? '',
    batchNumber: qr.batch_number,
    purity: qr.purity,
    concentration: qr.concentration,
    coaUrl: qr.coa_url,
    expirationDate: qr.expiration_date,
  };
}

/**
 * POST /api/sign-qr
 *
 * Server-only endpoint. Accepts a QR code ID, loads the row, signs it with
 * the Nadova Ed25519 private key, and writes dot_signature + dot_pubkey +
 * dot_payload back to the DB.
 *
 * Auth: requires a valid Supabase session (admin only — same auth as admin panel).
 * Private key: read from NADOVA_SIGNING_KEY server env var. Never returned in response.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signQrCredential, payloadFromQrCode } from '@/lib/dot-sign';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify the caller is an authenticated admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await req.json();
    if (
      !body ||
      typeof body !== 'object' ||
      !('id' in body) ||
      typeof (body as { id: unknown }).id !== 'string'
    ) {
      return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 });
    }
    const { id } = body as { id: string };

    // Load the QR code row
    const { data: qr, error: fetchError } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !qr) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Sign
    const { signature, pubkey, payload } = await signQrCredential(payloadFromQrCode(qr));

    // Persist signature to DB
    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({
        dot_signature: signature,
        dot_pubkey: pubkey,
        dot_payload: payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save signature', detail: updateError.message }, { status: 500 });
    }

    // Return pubkey + issuer info (never the private key)
    return NextResponse.json({
      ok: true,
      code: qr.code,
      pubkey,
      issuedAt: payload.issuedAt,
      issuer: payload.issuer,
      signaturePrefix: signature.slice(0, 16) + '...',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Don't leak key material in error messages
    const safe = message.replace(/[0-9a-f]{32,}/gi, '[redacted]');
    return NextResponse.json({ error: safe }, { status: 500 });
  }
}

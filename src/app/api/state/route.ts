import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL
    ?.replace('https://', '')
    .split('.')[0] ?? 'unknown';

  return NextResponse.json({
    app: 'nadova',
    env: process.env.NODE_ENV,
    supabaseProject: projectId,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nadova.com',
    features: {
      qrVerification: true,
      adminPanel: true,
      scanAnalytics: true,
      dotSigning: true,          // Ed25519 credential signing via DOT Protocol
      cmsWired: false,
      quizLive: false,
    },
    dotProtocol: {
      issuer: 'nadova-labs',
      algorithm: 'Ed25519',
      pubkey: process.env.NEXT_PUBLIC_NADOVA_PUBKEY ?? null,
      signingKeyConfigured: Boolean(process.env.NADOVA_SIGNING_KEY),
    },
    ts: new Date().toISOString(),
  });
}

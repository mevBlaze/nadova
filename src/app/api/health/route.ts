import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  let dbOk = false;
  let qrTotal = 0;
  let qrActive = 0;

  try {
    const supabase = await createClient();
    const [totalRes, activeRes] = await Promise.all([
      supabase.from('qr_codes').select('id', { count: 'exact', head: true }),
      supabase.from('qr_codes').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ]);
    dbOk = !totalRes.error;
    qrTotal = totalRes.count ?? 0;
    qrActive = activeRes.count ?? 0;
  } catch {
    // db unreachable — degraded state, still respond
  }

  const status = dbOk ? 'alive' : 'degraded';
  return NextResponse.json(
    {
      status,
      app: 'nadova',
      version: process.env.npm_package_version ?? '0.1.0',
      db: dbOk ? 'alive' : 'dead',
      latencyMs: Date.now() - start,
      qr: { total: qrTotal, active: qrActive },
      ts: new Date().toISOString(),
    },
    { status: dbOk ? 200 : 503 }
  );
}

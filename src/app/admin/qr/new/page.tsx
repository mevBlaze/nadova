'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  Download,
  QrCode as QrCodeIcon,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function AdminQrNewPage() {
  const [count, setCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ code: string; dataUrl: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadova.vercel.app';

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const { data: existing } = await supabase
        .from('qr_codes')
        .select('code')
        .order('code');

      const maxNum = (existing || []).reduce((max: number, row: { code: string }) => {
        const num = parseInt(row.code.replace('q', ''));
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);

      const newCodes: { code: string; status: string }[] = [];
      for (let i = 1; i <= count; i++) {
        newCodes.push({ code: `q${maxNum + i}`, status: 'draft' });
      }

      const { error: insertError } = await supabase
        .from('qr_codes')
        .insert(newCodes);

      if (insertError) {
        setError(`Failed to create codes: ${insertError.message}`);
        setGenerating(false);
        return;
      }

      const QRCode = (await import('qrcode')).default;
      const results: { code: string; dataUrl: string }[] = [];

      for (const { code } of newCodes) {
        const url = `${siteUrl}/${code}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 512,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });
        results.push({ code, dataUrl });
      }

      setGenerated(results);
    } catch (err) {
      setError(`Generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setGenerating(false);
  };

  const downloadQr = (code: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `nadova-${code}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    generated.forEach(({ code, dataUrl }) => {
      setTimeout(() => downloadQr(code, dataUrl), 100);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/qr"
            className="p-2 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Generate QR Codes</h1>
            <p className="text-muted text-sm">Create new QR codes for product bottles</p>
          </div>
        </div>

        {/* Generator Form */}
        {generated.length === 0 && (
          <div className="bg-surface rounded-xl border border-border p-8 text-center max-w-md mx-auto">
            <QrCodeIcon className="w-16 h-16 text-accent mx-auto mb-4 opacity-80" />
            <h2 className="text-lg font-semibold text-foreground mb-2">How many codes?</h2>
            <p className="text-muted text-sm mb-6">
              New codes will be numbered from the next available number.
            </p>

            <div className="flex items-center justify-center gap-4 mb-6">
              {[5, 10, 25, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    count === n
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted hover:border-accent/50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-center text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {generating ? 'Generating...' : `Generate ${count} Codes`}
            </button>
          </div>
        )}

        {/* Generated Results */}
        {generated.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h2 className="text-lg font-semibold text-foreground">
                  {generated.length} codes generated
                </h2>
              </div>
              <button
                onClick={downloadAll}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {generated.map(({ code, dataUrl }) => (
                <div
                  key={code}
                  className="bg-surface rounded-xl border border-border p-4 flex flex-col items-center gap-3"
                >
                  <img src={dataUrl} alt={code} className="w-full rounded-lg bg-white p-2" />
                  <p className="font-mono text-accent font-semibold text-sm">{code}</p>
                  <button
                    onClick={() => downloadQr(code, dataUrl)}
                    className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/admin/qr"
                className="text-accent hover:underline"
              >
                Go to QR Code Manager to assign products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

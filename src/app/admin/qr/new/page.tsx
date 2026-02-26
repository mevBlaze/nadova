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
  Palette,
  Hash,
  Layers,
} from 'lucide-react';

interface QrStyle {
  name: string;
  dark: string;
  light: string;
  desc: string;
}

const QR_STYLES: QrStyle[] = [
  { name: 'Classic', dark: '#000000', light: '#ffffff', desc: 'Black on white' },
  { name: 'Nadova', dark: '#0a0a0f', light: '#ffffff', desc: 'Dark brand on white' },
  { name: 'Teal', dark: '#00d4aa', light: '#0a0a0f', desc: 'Teal on dark' },
  { name: 'Purple', dark: '#7c3aed', light: '#ffffff', desc: 'Purple on white' },
  { name: 'Ocean', dark: '#0ea5e9', light: '#f0f9ff', desc: 'Blue on light blue' },
  { name: 'Midnight', dark: '#ffffff', light: '#1e1b4b', desc: 'White on indigo' },
  { name: 'Ember', dark: '#ef4444', light: '#fff7ed', desc: 'Red on warm white' },
  { name: 'Forest', dark: '#166534', light: '#f0fdf4', desc: 'Green on mint' },
];

type GenerationMode = 'sequential' | 'range' | 'custom';

export default function AdminQrNewPage() {
  const [mode, setMode] = useState<GenerationMode>('sequential');
  const [count, setCount] = useState(10);
  const [rangeFrom, setRangeFrom] = useState(101);
  const [rangeTo, setRangeTo] = useState(110);
  const [customCodes, setCustomCodes] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [qrSize, setQrSize] = useState(512);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ code: string; dataUrl: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const supabase = createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadova.vercel.app';

  const getCodesToGenerate = async (): Promise<string[]> => {
    if (mode === 'range') {
      const from = Math.min(rangeFrom, rangeTo);
      const to = Math.max(rangeFrom, rangeTo);
      const codes: string[] = [];
      for (let i = from; i <= to; i++) {
        codes.push(`q${i}`);
      }
      return codes;
    }

    if (mode === 'custom') {
      return customCodes
        .split(/[\n,]+/)
        .map(c => c.trim().toLowerCase())
        .filter(c => c.length > 0)
        .map(c => c.startsWith('q') ? c : `q${c}`);
    }

    // Sequential — find next available
    const { data: existing } = await supabase
      .from('qr_codes')
      .select('code');

    const maxNum = (existing || []).reduce((max: number, row: { code: string }) => {
      const num = parseInt(row.code.replace('q', ''));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);

    const codes: string[] = [];
    for (let i = 1; i <= count; i++) {
      codes.push(`q${maxNum + i}`);
    }
    return codes;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const codes = await getCodesToGenerate();

      if (codes.length === 0) {
        setError('No codes to generate. Check your input.');
        setGenerating(false);
        return;
      }

      if (codes.length > 500) {
        setError('Maximum 500 codes at once.');
        setGenerating(false);
        return;
      }

      // Check which codes already exist
      const { data: existing } = await supabase
        .from('qr_codes')
        .select('code')
        .in('code', codes);

      const existingCodes = new Set((existing || []).map(e => e.code));
      const newCodes = codes.filter(c => !existingCodes.has(c));

      if (newCodes.length === 0) {
        setError('All these codes already exist in the database.');
        setGenerating(false);
        return;
      }

      // Insert new codes into DB
      const { error: insertError } = await supabase
        .from('qr_codes')
        .insert(newCodes.map(code => ({ code, status: 'draft' })));

      if (insertError) {
        setError(`Failed to create codes: ${insertError.message}`);
        setGenerating(false);
        return;
      }

      // Generate QR images
      const QRCode = (await import('qrcode')).default;
      const style = QR_STYLES[selectedStyle];
      const results: { code: string; dataUrl: string }[] = [];

      for (const code of codes) {
        const url = `${siteUrl}/${code}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: qrSize,
          margin: 2,
          color: { dark: style.dark, light: style.light },
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

  const downloadAllZip = async () => {
    setDownloading(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const { code, dataUrl } of generated) {
        // Convert data URL to binary
        const base64 = dataUrl.split(',')[1];
        zip.file(`nadova-${code}.png`, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `nadova-qr-codes-${generated[0]?.code}-to-${generated[generated.length - 1]?.code}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to create zip file');
    }
    setDownloading(false);
  };

  const resetGenerator = () => {
    setGenerated([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
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
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-accent" />
                Code Numbers
              </h2>

              <div className="flex gap-2 mb-6">
                {[
                  { id: 'sequential' as const, label: 'Next Available' },
                  { id: 'range' as const, label: 'Custom Range' },
                  { id: 'custom' as const, label: 'Specific Codes' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      mode === m.id
                        ? 'bg-accent/10 text-accent border border-accent/30'
                        : 'bg-background border border-border text-muted hover:text-foreground'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {mode === 'sequential' && (
                <div>
                  <p className="text-muted text-sm mb-4">
                    Codes will be numbered starting from the next available number after your existing codes.
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-foreground">How many:</label>
                    {[5, 10, 25, 50, 100].map((n) => (
                      <button
                        key={n}
                        onClick={() => setCount(n)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
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
                      className="w-20 px-3 py-1.5 bg-background border border-border rounded-lg text-foreground text-center text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              )}

              {mode === 'range' && (
                <div>
                  <p className="text-muted text-sm mb-4">
                    Generate codes from a specific number to another. Existing codes will be skipped.
                  </p>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">From q</label>
                    <input
                      type="number"
                      min={1}
                      value={rangeFrom}
                      onChange={(e) => setRangeFrom(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-center focus:outline-none focus:border-accent"
                    />
                    <label className="text-sm font-medium text-foreground">to q</label>
                    <input
                      type="number"
                      min={1}
                      value={rangeTo}
                      onChange={(e) => setRangeTo(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-center focus:outline-none focus:border-accent"
                    />
                    <span className="text-sm text-muted">
                      ({Math.abs(rangeTo - rangeFrom) + 1} codes)
                    </span>
                  </div>
                </div>
              )}

              {mode === 'custom' && (
                <div>
                  <p className="text-muted text-sm mb-4">
                    Enter specific code numbers, separated by commas or new lines. The "q" prefix is added automatically.
                  </p>
                  <textarea
                    value={customCodes}
                    onChange={(e) => setCustomCodes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:border-accent resize-none"
                    placeholder="101, 102, 103&#10;or&#10;q201&#10;q202&#10;q203"
                  />
                  <p className="text-xs text-muted mt-2">
                    {customCodes.split(/[\n,]+/).filter(c => c.trim()).length} codes entered
                  </p>
                </div>
              )}
            </div>

            {/* Style Selection */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                QR Code Style
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {QR_STYLES.map((style, i) => (
                  <button
                    key={style.name}
                    onClick={() => setSelectedStyle(i)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedStyle === i
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded border border-border"
                        style={{ background: `linear-gradient(135deg, ${style.dark} 50%, ${style.light} 50%)` }}
                      />
                      <span className="text-sm font-medium text-foreground">{style.name}</span>
                    </div>
                    <p className="text-xs text-muted">{style.desc}</p>
                  </button>
                ))}
              </div>

              {/* Size */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted" />
                  Image Size:
                </label>
                {[256, 512, 1024].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQrSize(s)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      qrSize === s
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted hover:border-accent/50'
                    }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Preview</h2>
              <div className="flex items-center gap-6">
                <div
                  className="w-24 h-24 rounded-lg flex items-center justify-center border border-border"
                  style={{ backgroundColor: QR_STYLES[selectedStyle].light }}
                >
                  <QrCodeIcon
                    className="w-16 h-16"
                    style={{ color: QR_STYLES[selectedStyle].dark }}
                  />
                </div>
                <div className="text-sm text-muted space-y-1">
                  <p>Style: <span className="text-foreground">{QR_STYLES[selectedStyle].name}</span></p>
                  <p>Size: <span className="text-foreground">{qrSize}x{qrSize}px</span></p>
                  <p>Format: <span className="text-foreground">PNG</span></p>
                  <p>Error correction: <span className="text-foreground">High (30%)</span></p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 text-lg"
              >
                {generating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {generating ? 'Generating...' : 'Generate QR Codes'}
              </button>
            </div>
          </div>
        )}

        {/* Generated Results */}
        {generated.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h2 className="text-lg font-semibold text-foreground">
                  {generated.length} codes generated
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetGenerator}
                  className="px-4 py-2 border border-border text-muted rounded-lg hover:text-foreground hover:border-accent/30 transition-colors text-sm"
                >
                  Generate More
                </button>
                <button
                  onClick={downloadAllZip}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {downloading ? 'Creating ZIP...' : 'Download All (ZIP)'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {generated.map(({ code, dataUrl }) => (
                <div
                  key={code}
                  className="bg-surface rounded-xl border border-border p-4 flex flex-col items-center gap-3"
                >
                  <img src={dataUrl} alt={code} className="w-full rounded-lg" />
                  <p className="font-mono text-accent font-semibold text-sm">{code}</p>
                  <button
                    onClick={() => downloadQr(code, dataUrl)}
                    className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    PNG
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

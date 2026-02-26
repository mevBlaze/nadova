import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { QrCode } from '@/types';
import {
  Shield,
  Calendar,
  Hash,
  Sparkles,
  Thermometer,
  FileText,
  AlertTriangle,
  Clock,
} from 'lucide-react';

async function getQrCode(code: string): Promise<QrCode | null> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  if (!/^q\d+$/i.test(code)) {
    return { title: 'Nadova Labs' };
  }

  const qr = await getQrCode(code.toLowerCase());

  if (!qr || !qr.product_name) {
    return { title: 'Nadova Labs — Product Verification' };
  }

  return {
    title: `${qr.product_name} — Nadova Labs Verified`,
    description: `Verified product: ${qr.product_name}. Batch ${qr.batch_number || 'N/A'}.`,
  };
}

export default async function QrVerificationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!/^q\d+$/i.test(code)) {
    notFound();
  }

  const qr = await getQrCode(code.toLowerCase());

  if (!qr) {
    notFound();
  }

  if (qr.status === 'draft') {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-auto flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-500/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-3">
            Product Being Registered
          </h1>
          <p className="text-muted">
            This product is currently being registered in our system.
            Please check back soon.
          </p>
          <p className="text-muted/50 text-sm mt-6 font-mono">{qr.code}</p>
        </div>
      </div>
    );
  }

  const isWarning = qr.status === 'expired' || qr.status === 'recalled';
  const expiryFormatted = qr.expiration_date
    ? new Date(qr.expiration_date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      {/* Logo — links to main site */}
      <div className="px-4 py-4">
        <a href="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
            <span className="font-display font-extrabold text-sm text-[var(--color-bg)]">N</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">Nadova Labs</span>
        </a>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Verified Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">
            Nadova Labs — Verified Product
          </span>
        </div>

        {/* Warning Banner */}
        {isWarning && (
          <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
            qr.status === 'recalled'
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
              qr.status === 'recalled' ? 'text-red-400' : 'text-amber-400'
            }`} />
            <div>
              <p className={`font-semibold text-sm ${
                qr.status === 'recalled' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {qr.status === 'recalled' ? 'Product Recalled' : 'Product Expired'}
              </p>
              <p className="text-muted text-sm mt-1">
                {qr.status === 'recalled'
                  ? 'This product has been recalled. Please do not use and contact us for a replacement.'
                  : 'This product has passed its expiration date. Please dispose of it properly.'}
              </p>
            </div>
          </div>
        )}

        {/* Product Image */}
        {qr.product_image && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-border">
            <img
              src={qr.product_image}
              alt={qr.product_name || 'Product'}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Product Name */}
        {qr.product_name && (
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 text-center">
            {qr.product_name}
          </h1>
        )}

        {qr.concentration && (
          <p className="text-accent text-center font-medium mb-6">{qr.concentration}</p>
        )}

        {/* Key Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {qr.batch_number && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Batch</span>
              </div>
              <p className="font-mono font-semibold text-foreground">{qr.batch_number}</p>
            </div>
          )}

          {expiryFormatted && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Expires</span>
              </div>
              <p className="font-semibold text-foreground">{expiryFormatted}</p>
            </div>
          )}

          {qr.purity && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Purity</span>
              </div>
              <p className="font-semibold text-accent text-lg">{qr.purity}</p>
            </div>
          )}

          {qr.storage_info && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Storage</span>
              </div>
              <p className="text-sm text-foreground">{qr.storage_info}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {qr.description && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
              About This Product
            </h2>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {qr.description}
            </p>
          </div>
        )}

        {/* Certificate of Analysis */}
        {qr.coa_url && (
          <a
            href={qr.coa_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full p-4 bg-surface rounded-xl border border-border hover:border-accent/50 transition-colors mb-6"
          >
            <FileText className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">View Certificate of Analysis</span>
          </a>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-xs text-muted/50 font-mono">{qr.code}</p>
          <p className="text-sm text-muted mt-2">
            Verified by{' '}
            <a href="/" className="text-accent hover:underline">
              Nadova Labs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

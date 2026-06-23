'use client';

// /[code]/page.tsx — Premium QR verification page.
// SSR via use-client + useEffect: next/headers approach kept for scan recording.
// Framer Motion reveal animations run client-side after DB data loads.

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  Calendar,
  Hash,
  Sparkles,
  Thermometer,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  Download,
  ChevronDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { QrCode } from '@/types';

// Stagger variants for the detail cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.6 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' as const, duration: 0.5 } },
};

export default function QrVerificationPage() {
  const params = useParams();
  const code = typeof params.code === 'string' ? params.code : '';

  const [qr, setQr] = useState<QrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [badSlug, setBadSlug] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    if (!code || !/^q\d+$/i.test(code)) {
      setBadSlug(true);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function fetchAndRecord() {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('code', code.toLowerCase())
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setQr(data as QrCode);
      setLoading(false);

      // Fire-and-forget scan record — never blocks the reveal
      if (data.status !== 'draft') {
        const ua = navigator.userAgent.slice(0, 300);
        const ref = document.referrer.slice(0, 500);
        supabase
          .from('qr_scans')
          .insert({ code: data.code, user_agent: ua, referrer: ref })
          .then(() => {})
          .catch(() => {});
      }
    }

    fetchAndRecord();
  }, [code]);

  // Animate in the verified badge 400ms after data loads
  useEffect(() => {
    if (qr && qr.status === 'active') {
      const t = setTimeout(() => setBadgeVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [qr]);

  // Show sticky COA button after scrolling past the product header
  useEffect(() => {
    const handleScroll = () => setStickyVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
          <p className="text-[var(--color-muted)] text-sm font-mono">Verifying…</p>
        </div>
      </div>
    );
  }

  // --- Invalid slug (not q\d+) ---
  if (badSlug || notFound) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-background)] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">Code Not Found</h1>
          <p className="text-[var(--color-muted)] mb-8">
            This verification code is not registered in our system.
            If you believe this is an error, please contact Nadova Labs.
          </p>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!qr) return null;

  // --- Draft state ---
  if (qr.status === 'draft') {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-background)] overflow-auto flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-500/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">Product Being Registered</h1>
          <p className="text-[var(--color-muted)]">
            This product is currently being registered in our system.
            Please check back soon.
          </p>
          <p className="text-[var(--color-muted)]/40 text-sm mt-6 font-mono">{qr.code}</p>
        </motion.div>
      </div>
    );
  }

  const isWarning = qr.status === 'expired' || qr.status === 'recalled';
  const expiryFormatted = qr.expiration_date
    ? new Date(qr.expiration_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // --- Full verified / warning page ---
  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-background)] overflow-auto">
      {/* Sticky COA download — appears after scroll */}
      <AnimatePresence>
        {stickyVisible && qr.coa_url && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[var(--color-bg-elevated)]/95 backdrop-blur-md border-t border-[var(--color-border)]"
          >
            <a
              href={qr.coa_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto py-3 px-6 rounded-full bg-[var(--color-accent)] text-[var(--color-background)] font-semibold"
            >
              <Download className="w-4 h-4" />
              Download Certificate of Analysis
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-5 py-4 border-b border-[var(--color-border)]"
      >
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20">
            <span className="font-display font-extrabold text-sm text-[var(--color-background)]">N</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Nadova Labs</span>
        </Link>
      </motion.div>

      <div className="max-w-lg mx-auto px-4 pb-28">
        {/* THE HERO MOMENT — animated verified badge */}
        <div className="py-10 flex flex-col items-center">
          <AnimatePresence>
            {badgeVisible && !isWarning && (
              <motion.div
                key="verified-badge"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="relative flex flex-col items-center gap-3 mb-6"
              >
                {/* Glow ring behind the icon */}
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.25) 0%, transparent 70%)' }}
                />
                <div className="relative w-20 h-20 rounded-full bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]/40 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-[var(--color-accent)]" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1.5 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-full px-4 py-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest">
                    Verified by Nadova Labs
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning banner for expired / recalled */}
          {isWarning && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full mb-6 p-4 rounded-2xl border flex items-start gap-3 ${
                qr.status === 'recalled'
                  ? 'bg-red-500/10 border-red-500/25'
                  : 'bg-amber-500/10 border-amber-500/25'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                qr.status === 'recalled' ? 'text-red-400' : 'text-amber-400'
              }`} />
              <div>
                <p className={`font-semibold text-sm ${
                  qr.status === 'recalled' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {qr.status === 'recalled' ? 'Product Recalled' : 'Product Expired'}
                </p>
                <p className="text-[var(--color-muted)] text-sm mt-1">
                  {qr.status === 'recalled'
                    ? 'This product has been recalled. Do not use. Contact Nadova Labs for assistance.'
                    : 'This product has passed its expiration date. Please dispose of it properly.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Product image */}
          {qr.product_image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full mb-6 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xl"
            >
              <img
                src={qr.product_image}
                alt={qr.product_name ?? 'Product'}
                className="w-full object-cover"
              />
            </motion.div>
          )}

          {/* Product name */}
          {qr.product_name && (
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: badgeVisible ? 0.3 : 0.5 }}
              className="font-display text-3xl font-bold text-center mb-2"
            >
              {qr.product_name}
            </motion.h1>
          )}

          {qr.concentration && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[var(--color-accent)] text-center font-medium mb-2"
            >
              {qr.concentration}
            </motion.p>
          )}

          {/* Scroll hint */}
          {(qr.batch_number || expiryFormatted || qr.purity) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col items-center gap-1 mt-4 text-[var(--color-muted)]"
            >
              <span className="text-xs tracking-wider uppercase">Details below</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </motion.div>
          )}
        </div>

        {/* Detail cards — stagger in */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Key info grid */}
          {(qr.batch_number || expiryFormatted || qr.purity || qr.storage_info) && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              {qr.batch_number && (
                <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Hash className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Batch</span>
                  </div>
                  <p className="font-mono font-semibold text-sm">{qr.batch_number}</p>
                </div>
              )}

              {expiryFormatted && (
                <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Expires</span>
                  </div>
                  <p className="font-semibold text-sm">{expiryFormatted}</p>
                </div>
              )}

              {qr.purity && (
                <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Purity</span>
                  </div>
                  <p className="font-semibold text-lg text-[var(--color-accent)]">{qr.purity}</p>
                </div>
              )}

              {qr.storage_info && (
                <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Storage</span>
                  </div>
                  <p className="text-sm">{qr.storage_info}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          {qr.description && (
            <motion.div
              variants={itemVariants}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6"
            >
              <h2 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                About This Product
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">{qr.description}</p>
            </motion.div>
          )}

          {/* Extra / custom fields */}
          {qr.extra_fields && Object.keys(qr.extra_fields).length > 0 && (
            <motion.div
              variants={itemVariants}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6"
            >
              <h2 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-4">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(qr.extra_fields).map(([key, value]) => (
                  <div key={key} className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-0.5">{key}</p>
                    <p className="text-sm font-medium font-mono">{String(value)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* COA download — inline (for desktop / non-scrolled mobile) */}
          {qr.coa_url && (
            <motion.a
              variants={itemVariants}
              href={qr.coa_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-[var(--color-accent)]/10 rounded-2xl border border-[var(--color-accent)]/25 hover:bg-[var(--color-accent)]/15 transition-colors group"
            >
              <FileText className="w-5 h-5 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Certificate of Analysis</span>
              <Shield className="w-4 h-4 text-[var(--color-muted)]" />
            </motion.a>
          )}

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center pt-4 pb-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-muted)]/40 font-mono mb-1">{qr.code}</p>
            <p className="text-sm text-[var(--color-muted)]">
              Verified by{' '}
              <Link href="/" className="text-[var(--color-accent)] hover:underline">
                Nadova Labs
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient */}
        <motion.div
          className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%]"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 20%, rgba(0, 212, 170, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 20% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)
            `,
          }}
          animate={{
            x: [0, 20, -10, 0],
            y: [0, 10, 20, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Grid Lines */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
          }}
        />

        {/* Floating Molecules */}
        <motion.div
          className="absolute w-[300px] h-[300px] top-[10%] right-[10%] rounded-full opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1), transparent)',
            border: '1px solid rgba(0, 212, 170, 0.2)',
          }}
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] top-[60%] left-[5%] rounded-full opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), transparent)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
          }}
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        <motion.div
          className="absolute w-[150px] h-[150px] bottom-[20%] right-[20%] rounded-full opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]"
        >
          <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest">
            Research-Grade Peptides
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.1] tracking-tight"
        >
          Unlock Your
          <br />
          <span className="text-gradient">Potential</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Premium research compounds backed by science. From fat loss to anti-aging,
          find the peptide that matches your health goals.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/quiz" className="btn btn-primary group">
            Find My Product
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/products" className="btn btn-secondary">
            Browse All Products
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-text-muted)]"
      >
        <span className="text-xs">Scroll to explore</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[var(--color-accent)] to-transparent"
          animate={{ scaleY: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

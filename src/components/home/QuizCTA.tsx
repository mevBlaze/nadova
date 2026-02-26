'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight, Clock } from 'lucide-react';

export function QuizCTA() {
  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[32px] p-12 md:p-20 text-center overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[var(--color-accent)] opacity-10 blur-3xl" />
          <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[var(--color-secondary)] opacity-10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] items-center justify-center mb-8">
              <HelpCircle className="w-10 h-10 text-[var(--color-bg)]" />
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Not sure where to start?
            </h2>

            {/* Description */}
            <p className="text-lg text-[var(--color-text-muted)] max-w-lg mx-auto mb-10">
              Take our quick quiz and get personalized product recommendations based on your unique health goals.
            </p>

            {/* CTA */}
            <Link href="/quiz" className="btn btn-primary group mb-6">
              Start the Quiz
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Time */}
            <div className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Clock className="w-4 h-4" />
              Takes less than 60 seconds
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

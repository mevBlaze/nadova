'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Truck, CheckCircle2 } from 'lucide-react';

const trustItems = [
  {
    icon: ShieldCheck,
    title: '99%+ Purity',
    subtitle: 'Guaranteed quality',
  },
  {
    icon: FileText,
    title: 'COA Included',
    subtitle: 'With every order',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    subtitle: 'Worldwide delivery',
  },
  {
    icon: CheckCircle2,
    title: 'HPLC Verified',
    subtitle: 'Lab tested',
  },
];

export function TrustSection() {
  return (
    <section className="py-20 px-6 border-t border-[var(--color-border)]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16"
      >
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{item.subtitle}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

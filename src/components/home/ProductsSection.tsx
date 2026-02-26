'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const featuredProducts = [
  {
    id: '5-amino-1mq',
    code: '5-Amino-1MQ',
    name: '5-Amino-1MQ',
    headline: 'Burn Stubborn Fat Without Extreme Diets',
    description: 'NNMT inhibitor showing 150% increase in exercise performance and significant fat reduction.',
    dosage: '50mg',
    purity: '99%+',
    badge: 'Fat Burning',
    color: '#f97316',
    href: '/products/5-amino-1mq',
  },
  {
    id: 'bpc-157',
    code: 'BPC-157',
    name: 'BPC-157',
    headline: 'Accelerate Injury Recovery & Tissue Repair',
    description: 'The "body protection compound" showing consistent healing for muscles, tendons, and gut.',
    dosage: '10mg',
    purity: '99%+',
    badge: 'Healing',
    color: '#22c55e',
    href: '/products/bpc-157',
  },
  {
    id: 'ss-31',
    code: 'SS-31',
    name: 'SS-31 (Elamipretide)',
    headline: 'Restore Cellular Energy & Reverse Aging',
    description: 'Targets mitochondria directly, improving ATP production and reducing oxidative stress.',
    dosage: '10mg',
    purity: '99%+',
    badge: 'Anti-Aging',
    color: '#a855f7',
    href: '/products/ss-31',
  },
  {
    id: 'mots-c',
    code: 'MOTS-c',
    name: 'MOTS-c',
    headline: 'Get Exercise Benefits Without the Workout',
    description: 'Mitochondrial peptide that doubles running endurance in aged mice and improves insulin sensitivity.',
    dosage: '40mg',
    purity: '99%+',
    badge: 'Exercise Mimetic',
    color: '#eab308',
    href: '/products/mots-c',
  },
];

export function ProductsSection() {
  return (
    <section className="section">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-4">
          <span className="w-8 h-px bg-[var(--color-accent)] opacity-50" />
          Featured Products
          <span className="w-8 h-px bg-[var(--color-accent)] opacity-50" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Most Popular Compounds
        </h2>
        <p className="text-lg text-[var(--color-text-muted)] max-w-md mx-auto">
          Research-backed peptides trusted by scientists worldwide
        </p>
      </motion.div>

      {/* Products Grid */}
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto mb-12"
      >
        {featuredProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            <Link
              href={product.href}
              className="group block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            >
              {/* Visual */}
              <div className="relative h-52 bg-gradient-to-br from-[var(--color-surface-light)] to-[var(--color-surface)] flex items-center justify-center overflow-hidden">
                {/* Glow */}
                <div
                  className="absolute w-48 h-48 rounded-full opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${product.color} 0%, transparent 70%)`,
                  }}
                />

                {/* Badge */}
                <span
                  className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full text-[var(--color-bg)]"
                  style={{ background: product.color }}
                >
                  {product.badge}
                </span>

                {/* Vial SVG */}
                <svg
                  className="h-36 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3"
                  viewBox="0 0 80 140"
                  fill="none"
                >
                  <rect x="20" y="0" width="40" height="14" rx="3" fill="#4a4a5a" />
                  <rect x="23" y="14" width="34" height="10" fill="#3a3a4a" />
                  <path
                    d="M17 24H63V118C63 127.941 54.9411 136 45 136H35C25.0589 136 17 127.941 17 118V24Z"
                    fill={`${product.color}26`}
                  />
                  <path
                    d="M20 55H60V115C60 123.284 53.2843 130 45 130H35C26.7157 130 20 123.284 20 115V55Z"
                    fill={product.color}
                    opacity="0.9"
                  />
                  <rect x="22" y="65" width="36" height="40" rx="3" fill="#1a1a24" />
                  <text
                    x="40"
                    y="82"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="bold"
                    fill={product.color}
                  >
                    {product.code.split(' ')[0]}
                  </text>
                  <text
                    x="40"
                    y="94"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="bold"
                    fill={product.color}
                  >
                    {product.code.split(' ')[1] || ''}
                  </text>
                  <text
                    x="40"
                    y="102"
                    textAnchor="middle"
                    fontSize="5"
                    fill="#666"
                  >
                    NADOVA
                  </text>
                </svg>
              </div>

              {/* Content */}
              <div className="p-7">
                <p
                  className="font-mono text-xs uppercase tracking-wide mb-2"
                  style={{ color: product.color }}
                >
                  {product.code}
                </p>
                <h3 className="font-display text-lg font-bold mb-3 leading-snug">
                  {product.headline}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-5 line-clamp-2">
                  {product.description}
                </p>

                {/* Specs */}
                <div className="flex gap-3 mb-5">
                  <div className="flex-1 py-3 px-4 bg-white/[0.03] rounded-xl text-center">
                    <span className="block font-mono text-sm font-bold">{product.purity}</span>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase">
                      Purity
                    </span>
                  </div>
                  <div className="flex-1 py-3 px-4 bg-white/[0.03] rounded-xl text-center">
                    <span className="block font-mono text-sm font-bold">{product.dosage}</span>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase">
                      Dosage
                    </span>
                  </div>
                  <div className="flex-1 py-3 px-4 bg-white/[0.03] rounded-xl text-center">
                    <span className="block font-mono text-sm font-bold">COA</span>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase">
                      Included
                    </span>
                  </div>
                </div>

                {/* Link */}
                <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold group-hover:gap-3 transition-all">
                  View Research
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* View All CTA */}
      <div className="flex justify-center">
        <Link href="/products" className="btn btn-secondary group">
          View All 16 Products
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

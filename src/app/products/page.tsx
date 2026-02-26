'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Beaker, Shield, Zap, Moon, Heart, Dumbbell, Leaf, ShieldCheck } from 'lucide-react';

const categories = [
  { id: 'metabolic', name: 'Metabolic', icon: Zap, color: '#f97316', description: 'Weight management & fat loss' },
  { id: 'anti-aging', name: 'Anti-Aging', icon: Shield, color: '#a855f7', description: 'Cellular repair & longevity' },
  { id: 'tissue-repair', name: 'Tissue Repair', icon: Heart, color: '#22c55e', description: 'Recovery & healing' },
  { id: 'immune', name: 'Immune', icon: ShieldCheck, color: '#3b82f6', description: 'Immune system support' },
  { id: 'hormonal', name: 'Hormonal', icon: Dumbbell, color: '#ef4444', description: 'Hormone optimization' },
  { id: 'sleep', name: 'Sleep', icon: Moon, color: '#6366f1', description: 'Sleep quality & recovery' },
];

const products = [
  { id: '5-amino-1mq', name: '5-Amino-1MQ', category: 'metabolic', tagline: 'Metabolic Optimizer', price: 89 },
  { id: 'mots-c', name: 'MOTS-c', category: 'metabolic', tagline: 'Mitochondrial Peptide', price: 129 },
  { id: 'tesamorelin', name: 'Tesamorelin', category: 'metabolic', tagline: 'GH Releasing Hormone', price: 159 },
  { id: 'ss-31', name: 'SS-31 (Elamipretide)', category: 'anti-aging', tagline: 'Mitochondrial Protector', price: 199 },
  { id: 'epitalon', name: 'Epitalon', category: 'anti-aging', tagline: 'Telomerase Activator', price: 149 },
  { id: 'ghk-cu', name: 'GHK-Cu', category: 'anti-aging', tagline: 'Copper Peptide Complex', price: 79 },
  { id: 'bpc-157', name: 'BPC-157', category: 'tissue-repair', tagline: 'Body Protection Compound', price: 69 },
  { id: 'tb-500', name: 'TB-500', category: 'tissue-repair', tagline: 'Thymosin Beta-4 Fragment', price: 89 },
  { id: 'thymosin-alpha-1', name: 'Thymosin Alpha-1', category: 'immune', tagline: 'Immune Modulator', price: 179 },
  { id: 'll-37', name: 'LL-37', category: 'immune', tagline: 'Antimicrobial Peptide', price: 139 },
  { id: 'kisspeptin-10', name: 'Kisspeptin-10', category: 'hormonal', tagline: 'GnRH Stimulator', price: 119 },
  { id: 'dsip', name: 'DSIP', category: 'sleep', tagline: 'Delta Sleep-Inducing Peptide', price: 99 },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 md:px-10 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <Beaker className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest">
              Research Compounds
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">
            Our <span className="text-gradient">Products</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Premium research peptides with 99%+ purity. Each compound includes a Certificate of Analysis and detailed research documentation.
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-10 mb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <span className="font-semibold text-sm">{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-8">All Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => {
              const category = categories.find(c => c.id === product.category);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="block p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
                      >
                        {category?.name}
                      </div>
                      <span className="text-[var(--color-accent)] font-bold">${product.price}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">{product.tagline}</p>
                    <div className="flex items-center text-sm text-[var(--color-accent)] font-medium">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  Zap,
  Clock,
  Moon,
  Heart,
  Dumbbell,
  Leaf,
  Shield,
  ArrowRight
} from 'lucide-react';

const goals = [
  {
    id: 'weight',
    name: 'Lose Weight',
    description: 'Burn stubborn fat and boost metabolism',
    productCount: 4,
    color: '#f97316',
    icon: Flame,
  },
  {
    id: 'energy',
    name: 'More Energy',
    description: 'Enhance performance and vitality',
    productCount: 5,
    color: '#eab308',
    icon: Zap,
  },
  {
    id: 'aging',
    name: 'Anti-Aging',
    description: 'Reverse cellular aging and restore youth',
    productCount: 6,
    color: '#a855f7',
    icon: Clock,
  },
  {
    id: 'sleep',
    name: 'Sleep Better',
    description: 'Deep, restorative sleep every night',
    productCount: 2,
    color: '#6366f1',
    icon: Moon,
  },
  {
    id: 'recovery',
    name: 'Recover Faster',
    description: 'Heal injuries and repair tissue',
    productCount: 4,
    color: '#22c55e',
    icon: Heart,
  },
  {
    id: 'muscle',
    name: 'Build Muscle',
    description: 'Increase strength and lean mass',
    productCount: 3,
    color: '#ef4444',
    icon: Dumbbell,
  },
  {
    id: 'gut',
    name: 'Gut Health',
    description: 'Heal and restore digestive wellness',
    productCount: 3,
    color: '#14b8a6',
    icon: Leaf,
  },
  {
    id: 'immunity',
    name: 'Immunity',
    description: 'Strengthen immune defenses',
    productCount: 3,
    color: '#3b82f6',
    icon: Shield,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function GoalsSection() {
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
          Choose Your Goal
          <span className="w-8 h-px bg-[var(--color-accent)] opacity-50" />
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          What do you want to achieve?
        </h2>
        <p className="text-lg text-[var(--color-text-muted)] max-w-md mx-auto">
          Select a health goal to see research compounds tailored to your needs
        </p>
      </motion.div>

      {/* Goals Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto"
      >
        {goals.map((goal) => {
          const Icon = goal.icon;
          return (
            <motion.div key={goal.id} variants={itemVariants}>
              <Link
                href={`/products?goal=${goal.id}`}
                className="group relative block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-opacity-100"
                style={{
                  '--card-color': goal.color,
                  borderColor: 'var(--color-border)',
                } as React.CSSProperties}
              >
                {/* Hover gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${goal.color} 0%, transparent 60%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[5deg]"
                  style={{
                    background: `linear-gradient(135deg, ${goal.color}, transparent)`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold mb-2 leading-tight">
                  {goal.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {goal.description}
                </p>
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/5 text-[var(--color-text-muted)]">
                  {goal.productCount} products
                </span>

                {/* Arrow */}
                <div
                  className="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400"
                  style={{ background: goal.color }}
                >
                  <ArrowRight className="w-4 h-4 text-[var(--color-bg)]" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

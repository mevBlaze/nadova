'use client';

import { motion } from 'framer-motion';
import { Microscope, Shield, Award, Users, MapPin, Mail } from 'lucide-react';

const values = [
  {
    icon: Microscope,
    title: 'Scientific Rigor',
    description: 'Every compound undergoes rigorous HPLC testing to ensure 99%+ purity before reaching our customers.',
  },
  {
    icon: Shield,
    title: 'Quality First',
    description: 'We source only from GMP-certified facilities and include detailed Certificates of Analysis with every order.',
  },
  {
    icon: Award,
    title: 'Research Excellence',
    description: 'Our team stays at the forefront of peptide research, bringing you the most promising compounds for longevity.',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'We provide comprehensive documentation and support to help researchers achieve their goals.',
  },
];

const stats = [
  { value: '99%+', label: 'Purity Guaranteed' },
  { value: '50+', label: 'Research Compounds' },
  { value: '10K+', label: 'Orders Shipped' },
  { value: '24/7', label: 'Support Available' },
];

export default function AboutPage() {
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
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">
            About <span className="text-gradient">Nadova Labs</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Based in Tokyo, Japan, we're dedicated to advancing longevity research by providing the highest quality peptides to researchers worldwide.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-10 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
              >
                <div className="font-display text-3xl md:text-4xl font-extrabold text-[var(--color-accent)] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 md:px-10 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg-elevated)] border border-[var(--color-border)]"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed mb-6">
              At Nadova Labs, we believe that the future of human health lies in understanding and optimizing our biology at the molecular level. Our mission is to accelerate longevity research by making high-quality peptides accessible to researchers around the world.
            </p>
            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
              Every compound we offer is carefully selected based on promising research, rigorously tested for purity, and delivered with comprehensive documentation. We're not just selling products—we're partnering with researchers to push the boundaries of what's possible in human health.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 md:px-10 mb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-10 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <div className="inline-flex w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">Tokyo, Japan</h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Our headquarters and primary research facility are located in Tokyo, with worldwide shipping capabilities.
            </p>
            <a
              href="mailto:research@nadovalabs.com"
              className="inline-flex items-center gap-2 text-[var(--color-accent)] font-medium hover:underline"
            >
              <Mail className="w-4 h-4" />
              research@nadovalabs.com
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

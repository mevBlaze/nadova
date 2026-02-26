'use client';

import { motion } from 'framer-motion';

const stats = [
  {
    value: '150%',
    label: 'Increased exercise capacity with 5-Amino-1MQ',
  },
  {
    value: '42%',
    label: 'Faster wound healing with TB-500',
  },
  {
    value: '59%',
    label: 'More sleep time with DSIP',
  },
  {
    value: '2x',
    label: 'Running endurance with MOTS-c',
  },
];

export function StatsSection() {
  return (
    <section className="py-24 px-6 bg-[var(--color-bg-elevated)] border-y border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="text-center"
            >
              <div className="font-display text-5xl md:text-6xl font-extrabold text-gradient mb-2 leading-none">
                {stat.value}
              </div>
              <p className="text-sm text-[var(--color-text-muted)] max-w-[180px] mx-auto">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

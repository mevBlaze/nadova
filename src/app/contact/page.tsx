'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, MapPin, Send, CheckCircle } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'For general inquiries and research questions',
    value: 'research@nadovalabs.com',
    href: 'mailto:research@nadovalabs.com',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Quick answers during business hours',
    value: 'Available 9AM-6PM JST',
    href: '#',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We typically respond within',
    value: '24 hours',
    href: null,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="px-6 md:px-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Have questions about our products or need help with your research? Our team is here to help.
          </p>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="px-6 md:px-10 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center"
                >
                  <div className="inline-flex w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-display font-bold mb-1">{method.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">{method.description}</p>
                  {method.href ? (
                    <a href={method.href} className="text-[var(--color-accent)] font-medium hover:underline">
                      {method.value}
                    </a>
                  ) : (
                    <span className="text-[var(--color-accent)] font-medium">{method.value}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 md:p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            {submitted ? (
              <div className="text-center py-10">
                <div className="inline-flex w-16 h-16 rounded-full bg-[var(--color-accent)]/10 items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Message Sent!</h3>
                <p className="text-[var(--color-text-muted)]">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Location */}
      <section className="px-6 md:px-10 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
            <MapPin className="w-4 h-4" />
            <span>Nadova Labs • Tokyo, Japan • Worldwide Shipping</span>
          </div>
        </div>
      </section>
    </div>
  );
}

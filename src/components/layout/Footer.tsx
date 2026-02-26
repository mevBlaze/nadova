import Link from 'next/link';
import { Linkedin, Twitter } from 'lucide-react';

const goalLinks = [
  { href: '/products?goal=weight', label: 'Weight Loss' },
  { href: '/products?goal=energy', label: 'Energy' },
  { href: '/products?goal=aging', label: 'Anti-Aging' },
  { href: '/products?goal=recovery', label: 'Recovery' },
  { href: '/products?goal=sleep', label: 'Sleep' },
];

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/about#quality', label: 'Quality' },
  { href: '/contact', label: 'Contact' },
  { href: '/quiz', label: 'Product Finder' },
];

const legalLinks = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/shipping', label: 'Shipping' },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)]">
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center">
                <span className="font-display font-extrabold text-lg text-[var(--color-bg)]">N</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Nadova Labs</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm max-w-xs">
              Premium research peptides engineered for precision scientific research in longevity, metabolism, and cellular health.
            </p>
          </div>

          {/* Goals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-5">
              Goals
            </h4>
            <ul className="space-y-3">
              {goalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--color-border)] gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; 2026 Nadova Labs. All rights reserved. Tokyo, Japan
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-500',
          isScrolled && 'bg-[var(--color-bg)]/90 backdrop-blur-xl border-b border-[var(--color-border)] py-4',
          isMobileMenuOpen && 'bg-[var(--color-bg)] backdrop-blur-none border-b-transparent'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center">
            <span className="font-display font-extrabold text-lg text-[var(--color-bg)]">N</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Nadova Labs</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <ul className="flex gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors relative',
                    pathname === link.href && 'text-white',
                    'after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[var(--color-accent)] after:transition-all hover:after:w-full',
                    pathname === link.href && 'after:w-full'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <Link
          href="/quiz"
          className="hidden md:flex items-center px-6 py-3 border border-[var(--color-accent)] rounded-full text-[var(--color-accent)] text-sm font-semibold hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all hover:shadow-[0_0_30px_var(--color-accent-glow)]"
        >
          Find My Product
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-10 p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-[var(--color-bg)] z-40 pt-24 px-6 transition-all duration-500 md:hidden',
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <nav>
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block py-4 font-display text-3xl font-bold border-b border-white/10 transition-colors',
                    pathname === link.href ? 'text-[var(--color-accent)]' : 'text-white hover:text-[var(--color-accent)]'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/quiz"
                className="block py-4 font-display text-3xl font-bold text-[var(--color-accent)] border-b border-white/10"
              >
                Product Finder
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

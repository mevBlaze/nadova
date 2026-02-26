'use client';

export const dynamic = 'force-dynamic';

import {
  BookOpen,
  QrCode,
  Edit,
  Plus,
  Eye,
  Shield,
  Upload,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Smartphone,
  Key,
  Globe,
} from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Log In to Admin Panel',
    icon: Key,
    color: '#7c3aed',
    content: [
      'Go to nadova.vercel.app/admin/login',
      'Enter your admin email and password',
      'You\'ll be taken to the Dashboard showing stats and quick actions',
    ],
  },
  {
    number: '2',
    title: 'Find Your QR Code',
    icon: QrCode,
    color: '#06b6d4',
    content: [
      'Click "QR Codes" in the left sidebar',
      'You\'ll see a list of all QR codes (q1 through q100)',
      'Use the search bar to find a specific code (e.g., type "q15")',
      'Filter by status: All, Active, Draft, Expired, or Recalled',
      'Each QR code shows: code number, product name, batch, expiry, and status',
    ],
  },
  {
    number: '3',
    title: 'Assign Product to a QR Code',
    icon: Edit,
    color: '#00d4aa',
    content: [
      'Click the edit icon (pencil) next to any QR code',
      'Fill in the product details:',
    ],
    subItems: [
      { label: 'Product Name', example: 'BPC-157' },
      { label: 'Batch Number', example: 'NAD-2026-A003' },
      { label: 'Expiration Date', example: 'Select from calendar' },
      { label: 'Concentration', example: '5mg / 10ml' },
      { label: 'Purity', example: '99.1%' },
      { label: 'Description', example: 'Brief product description' },
      { label: 'Storage Info', example: 'Store at 2-8°C' },
    ],
    afterContent: [
      'All fields are optional — fill in what you have',
      'Click "Save Changes" when done',
    ],
  },
  {
    number: '4',
    title: 'Upload Product Image',
    icon: Upload,
    color: '#f59e0b',
    content: [
      'On the edit page, scroll to the "Product Image" section',
      'Click the upload area or drag & drop an image',
      'Supported formats: JPG, PNG, WebP (max 5MB)',
      'The image will appear on the public product page when customers scan',
    ],
  },
  {
    number: '5',
    title: 'Upload Certificate of Analysis (COA)',
    icon: Shield,
    color: '#ec4899',
    content: [
      'On the edit page, scroll to "Certificate of Analysis"',
      'Upload the COA PDF file',
      'Customers will see a "View Certificate of Analysis" button on the product page',
      'This builds trust and shows product authenticity',
    ],
  },
  {
    number: '6',
    title: 'Set Status to Active',
    icon: CheckCircle,
    color: '#22c55e',
    content: [
      'At the top of the edit page, you\'ll see status buttons:',
    ],
    statuses: [
      { label: 'Draft', desc: 'Default — shows "Product Being Registered" to customers', color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
      { label: 'Active', desc: 'Live! Customers see the full product page', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
      { label: 'Expired', desc: 'Shows warning banner + product info', color: 'text-amber-400', bg: 'bg-amber-400/10' },
      { label: 'Recalled', desc: 'Shows red warning — do not use', color: 'text-red-400', bg: 'bg-red-400/10' },
    ],
    afterContent: [
      'Click "Active" to make the product page live',
      'Click "Save Changes" — the page is instantly live!',
    ],
  },
  {
    number: '7',
    title: 'Preview the Product Page',
    icon: Eye,
    color: '#8b5cf6',
    content: [
      'After saving, click "Preview" to see what customers will see',
      'Or go directly to nadova.vercel.app/q1 (replace q1 with your code)',
      'Scan the QR code on the bottle with your phone camera to test it',
    ],
  },
  {
    number: '8',
    title: 'Generate New QR Codes (Beyond q100)',
    icon: Plus,
    color: '#06b6d4',
    content: [
      'Go to QR Codes → click "Generate QR Codes" button',
      'Choose how many codes to generate (5, 10, 25, or 50)',
      'New codes will be created: q101, q102, q103, etc.',
      'Download the QR code images (PNG) to print new labels',
      'Each QR code image points to nadova.vercel.app/q{number}',
    ],
  },
];

export default function AdminGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#00d4aa]/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-[#00d4aa]" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Admin Guide</h1>
        <p className="text-[#8b8b9e] text-lg max-w-2xl mx-auto">
          Step-by-step instructions for managing your QR code product verification system.
          Each QR code on your bottles links to a verification page that shows product details.
        </p>
      </div>

      {/* How It Works Overview */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#00d4aa]" />
          How It Works
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center shrink-0 mt-0.5">
              <QrCode className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <div>
              <p className="font-medium text-sm">Customer Scans</p>
              <p className="text-[#8b8b9e] text-sm">QR code on the bottle with their phone camera</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Globe className="w-4 h-4 text-[#00d4aa]" />
            </div>
            <div>
              <p className="font-medium text-sm">Page Opens</p>
              <p className="text-[#8b8b9e] text-sm">nadova.vercel.app/q1 loads instantly on their phone</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-[#22c55e]" />
            </div>
            <div>
              <p className="font-medium text-sm">Verified Product</p>
              <p className="text-[#8b8b9e] text-sm">Shows product name, batch, purity, expiry — builds trust</p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Step-by-Step Guide</h2>

        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${step.color}20`, color: step.color }}
                    >
                      {step.number}
                    </span>
                    {step.title}
                  </h3>

                  <ul className="space-y-2 mb-3">
                    {step.content.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#c4c4d4]">
                        <ArrowRight className="w-4 h-4 text-[#8b8b9e] shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Sub-items for product fields */}
                  {step.subItems && (
                    <div className="ml-6 mb-3 grid sm:grid-cols-2 gap-2">
                      {step.subItems.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[rgba(255,255,255,0.05)]"
                        >
                          <span className="text-sm font-medium text-[#c4c4d4]">{item.label}</span>
                          <span className="text-xs text-[#8b8b9e]">e.g. {item.example}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status buttons explanation */}
                  {step.statuses && (
                    <div className="ml-6 mb-3 space-y-2">
                      {step.statuses.map((s) => (
                        <div key={s.label} className="flex items-center gap-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.color} ${s.bg}`}>
                            {s.label}
                          </span>
                          <span className="text-sm text-[#8b8b9e]">{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.afterContent && (
                    <ul className="space-y-2">
                      {step.afterContent.map((line, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#c4c4d4]">
                          <ArrowRight className="w-4 h-4 text-[#8b8b9e] shrink-0 mt-0.5" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Tips & Reminders
        </h2>
        <ul className="space-y-3">
          {[
            'You can edit a product page at any time — changes go live instantly',
            'All fields are optional — fill in as much or as little as you want',
            'Set status to "Draft" if you\'re not ready for customers to see the page yet',
            'If a product batch expires, change the status to "Expired" — customers will see a warning',
            'If you need to recall a product, change status to "Recalled" — shows a red warning',
            'Use "Generate QR Codes" to create codes beyond q100 when you need more labels',
            'Download QR code images in PNG format for printing new labels',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-[#c4c4d4]">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Reference */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]">
        <h2 className="text-lg font-bold mb-4">Quick Reference</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[rgba(255,255,255,0.05)]">
            <p className="text-sm font-medium text-[#8b8b9e] mb-1">Admin Panel</p>
            <p className="font-mono text-[#00d4aa]">nadova.vercel.app/admin</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[rgba(255,255,255,0.05)]">
            <p className="text-sm font-medium text-[#8b8b9e] mb-1">QR Code Pages</p>
            <p className="font-mono text-[#00d4aa]">nadova.vercel.app/q1 — /q100+</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[rgba(255,255,255,0.05)]">
            <p className="text-sm font-medium text-[#8b8b9e] mb-1">Manage QR Codes</p>
            <p className="font-mono text-[#00d4aa]">nadova.vercel.app/admin/qr</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[rgba(255,255,255,0.05)]">
            <p className="text-sm font-medium text-[#8b8b9e] mb-1">Generate New Codes</p>
            <p className="font-mono text-[#00d4aa]">nadova.vercel.app/admin/qr/new</p>
          </div>
        </div>
      </div>
    </div>
  );
}

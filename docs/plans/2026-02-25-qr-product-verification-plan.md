# Nadova QR Product Verification — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add QR code product verification to Nadova — admin panel for mapping QR codes to peptide product data, beautiful public scan pages, and QR code generation.

**Architecture:** One new Supabase table (`qr_codes`) with RLS, Supabase Storage for images/PDFs. Three new route groups: admin list, admin edit, public display. Dynamic `[code]` route at app root catches `/q1`-`/qN` URLs. Follows existing admin patterns (client components, `createClient()`, force-dynamic).

**Tech Stack:** Next.js 16.1.6, Supabase (DB + Storage + Auth), Tailwind CSS 4, React 19, Framer Motion 12, Lucide React icons, `qrcode` npm package.

**Design doc:** `docs/plans/2026-02-25-qr-product-verification-design.md`

---

### Task 1: Install QR Code Dependency

**Files:**
- Modify: `package.json`

**Step 1: Install qrcode package**

```bash
cd /Users/blaze/Movies/Kin/nadova && npm install qrcode @types/qrcode
```

**Step 2: Verify install**

```bash
node -e "const QRCode = require('qrcode'); QRCode.toDataURL('test').then(url => console.log('OK:', url.substring(0, 30)))"
```

Expected: `OK: data:image/png;base64,iVBOR...`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add qrcode dependency for QR generation"
```

---

### Task 2: Database Migration — qr_codes Table + Seed

**Files:**
- Create: `supabase/migrations/004_qr_codes.sql`

**Step 1: Write the migration**

```sql
-- QR Code Product Verification System
-- Each QR code maps to a unique physical bottle with product info

CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,              -- "q1", "q2", "q137"
  status TEXT NOT NULL DEFAULT 'draft',   -- draft | active | expired | recalled
  product_name TEXT,
  product_image TEXT,                     -- Supabase Storage URL
  batch_number TEXT,
  expiration_date DATE,
  concentration TEXT,                     -- "5mg / 10ml"
  purity TEXT,                            -- "99.1%"
  description TEXT,
  storage_info TEXT,                      -- "Store at 2-8°C"
  coa_url TEXT,                           -- Certificate of Analysis PDF URL
  extra_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by code (used on every QR scan)
CREATE UNIQUE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON qr_codes(status);

-- Auto-update updated_at
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS: Public can read active/expired/recalled codes, authenticated can do everything
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view non-draft QR codes"
  ON qr_codes FOR SELECT
  USING (status != 'draft' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage QR codes"
  ON qr_codes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Seed q1 through q100 as empty drafts
INSERT INTO qr_codes (code, status)
SELECT 'q' || generate_series, 'draft'
FROM generate_series(1, 100)
ON CONFLICT (code) DO NOTHING;
```

**Step 2: Run migration against Supabase**

If using Supabase CLI:
```bash
supabase db push
```

Or run the SQL directly in Supabase Dashboard → SQL Editor.

**Step 3: Verify**

In Supabase SQL Editor:
```sql
SELECT count(*) FROM qr_codes;           -- Should be 100
SELECT * FROM qr_codes WHERE code = 'q1'; -- Should exist with status=draft
```

**Step 4: Commit**

```bash
git add supabase/migrations/004_qr_codes.sql
git commit -m "feat: add qr_codes table with q1-q100 seed data"
```

---

### Task 3: TypeScript Types for QR Codes

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add QrCode type**

Append to the end of `src/types/index.ts`:

```typescript
// QR Code Product Verification
export interface QrCode {
  id: string;
  code: string;
  status: 'draft' | 'active' | 'expired' | 'recalled';
  product_name: string | null;
  product_image: string | null;
  batch_number: string | null;
  expiration_date: string | null;
  concentration: string | null;
  purity: string | null;
  description: string | null;
  storage_info: string | null;
  coa_url: string | null;
  extra_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type QrCodeStatus = QrCode['status'];
```

**Step 2: Verify types compile**

```bash
cd /Users/blaze/Movies/Kin/nadova && npx tsc --noEmit 2>&1 | head -20
```

Expected: No new errors.

**Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add QrCode TypeScript types"
```

---

### Task 4: Supabase Storage Bucket Setup

**Files:**
- Create: `supabase/migrations/005_qr_storage.sql`

**Step 1: Write storage migration**

```sql
-- Storage bucket for QR code assets (product images + COA PDFs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-assets', 'qr-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public can view QR assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'qr-assets');

-- Authenticated users can upload/update/delete
CREATE POLICY "Authenticated can manage QR assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'qr-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update QR assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'qr-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete QR assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'qr-assets' AND auth.role() = 'authenticated');
```

**Step 2: Run migration**

Same as Task 2 — push via Supabase CLI or run in Dashboard SQL Editor.

**Step 3: Commit**

```bash
git add supabase/migrations/005_qr_storage.sql
git commit -m "feat: add qr-assets storage bucket with RLS policies"
```

---

### Task 5: File Upload Helper

**Files:**
- Create: `src/lib/utils/upload.ts`

**Step 1: Write the upload utility**

```typescript
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'qr-assets';

export async function uploadFile(
  file: File,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  // Remove existing file at path (ignore errors)
  await supabase.storage.from(BUCKET).remove([path]);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl, error: null };
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
```

**Step 2: Verify it compiles**

```bash
cd /Users/blaze/Movies/Kin/nadova && npx tsc --noEmit 2>&1 | head -20
```

**Step 3: Commit**

```bash
git add src/lib/utils/upload.ts
git commit -m "feat: add Supabase Storage upload utility for QR assets"
```

---

### Task 6: Admin QR List Page

**Files:**
- Create: `src/app/admin/qr/page.tsx`

**Step 1: Build the admin QR list page**

Follow the exact pattern from `src/app/admin/products/page.tsx` — client component, force-dynamic, Supabase fetch, search/filter, table with status badges.

```tsx
'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { QrCode, QrCodeStatus } from '@/types';
import {
  QrCode as QrCodeIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  AlertCircle,
  Package,
} from 'lucide-react';

const STATUS_CONFIG: Record<QrCodeStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  expired: { label: 'Expired', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  recalled: { label: 'Recalled', color: 'text-red-400', bg: 'bg-red-400/10' },
};

export default function AdminQrPage() {
  const [codes, setCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<QrCode | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchCodes = async () => {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('code');

      if (!error && data) {
        // Sort naturally: q1, q2, ... q10, q11, ... q100
        data.sort((a, b) => {
          const numA = parseInt(a.code.replace('q', ''));
          const numB = parseInt(b.code.replace('q', ''));
          return numA - numB;
        });
        setCodes(data);
      }
      setLoading(false);
    };
    fetchCodes();
  }, [supabase]);

  const filteredCodes = useMemo(() => {
    return codes.filter((qr) => {
      const matchesSearch =
        qr.code.toLowerCase().includes(search.toLowerCase()) ||
        (qr.product_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (qr.batch_number || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || qr.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [codes, search, statusFilter]);

  const stats = useMemo(() => ({
    total: codes.length,
    active: codes.filter((c) => c.status === 'active').length,
    draft: codes.filter((c) => c.status === 'draft').length,
    assigned: codes.filter((c) => c.product_name).length,
  }), [codes]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('qr_codes').delete().eq('id', deleteTarget.id);
    setCodes(codes.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <QrCodeIcon className="w-7 h-7 text-accent" />
              QR Code Manager
            </h1>
            <p className="text-muted mt-1">
              {stats.assigned} assigned of {stats.total} codes &middot; {stats.active} active
            </p>
          </div>
          <Link
            href="/admin/qr/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate QR Codes
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'Active', value: stats.active, color: 'text-emerald-400' },
            { label: 'Draft', value: stats.draft, color: 'text-zinc-400' },
            { label: 'Assigned', value: stats.assigned, color: 'text-accent' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-muted text-sm">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by code, product, or batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
            <option value="recalled">Recalled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted">Batch</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted">Expires</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((qr) => {
                  const statusCfg = STATUS_CONFIG[qr.status];
                  return (
                    <tr key={qr.id} className="border-b border-border/50 hover:bg-surface-light/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-accent font-semibold">{qr.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        {qr.product_name ? (
                          <span className="text-foreground">{qr.product_name}</span>
                        ) : (
                          <span className="text-muted italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted font-mono text-sm">{qr.batch_number || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted text-sm">
                          {qr.expiration_date
                            ? new Date(qr.expiration_date).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.color} ${statusCfg.bg}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {qr.status === 'active' && (
                            <a
                              href={`/${qr.code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-colors"
                              title="View public page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            href={`/admin/qr/${qr.id}`}
                            className="p-1.5 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(qr)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCodes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted">
              <Package className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-lg">No QR codes found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Delete QR Code</h3>
              </div>
              <p className="text-muted mb-6">
                Delete <span className="font-mono text-accent">{deleteTarget.code}</span>
                {deleteTarget.product_name && (
                  <> ({deleteTarget.product_name})</>
                )}? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2 bg-surface-light border border-border rounded-lg text-foreground hover:bg-surface-light/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Verify page loads**

```bash
cd /Users/blaze/Movies/Kin/nadova && npm run dev
```

Navigate to `http://localhost:3000/admin/qr` — should show 100 draft QR codes (or empty state if migration not run yet).

**Step 3: Commit**

```bash
git add src/app/admin/qr/page.tsx
git commit -m "feat: admin QR code list page with search, filter, and stats"
```

---

### Task 7: Admin QR Edit Page

**Files:**
- Create: `src/app/admin/qr/[id]/page.tsx`

**Step 1: Build the edit form**

```tsx
'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { uploadFile, deleteFile } from '@/lib/utils/upload';
import type { QrCode, QrCodeStatus } from '@/types';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const STATUSES: { value: QrCodeStatus; label: string; description: string }[] = [
  { value: 'draft', label: 'Draft', description: 'Not visible to customers' },
  { value: 'active', label: 'Active', description: 'Visible when QR code is scanned' },
  { value: 'expired', label: 'Expired', description: 'Shows expiry warning to customers' },
  { value: 'recalled', label: 'Recalled', description: 'Shows recall warning to customers' },
];

export default function AdminQrEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [qr, setQr] = useState<QrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    product_name: '',
    batch_number: '',
    expiration_date: '',
    concentration: '',
    purity: '',
    description: '',
    storage_info: '',
    status: 'draft' as QrCodeStatus,
  });
  const [productImage, setProductImage] = useState<string | null>(null);
  const [coaUrl, setCoaUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCoa, setUploadingCoa] = useState(false);

  // Fetch QR code data
  useEffect(() => {
    const fetchQr = async () => {
      const { data, error: fetchError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !data) {
        setError('QR code not found');
        setLoading(false);
        return;
      }

      setQr(data);
      setForm({
        product_name: data.product_name || '',
        batch_number: data.batch_number || '',
        expiration_date: data.expiration_date || '',
        concentration: data.concentration || '',
        purity: data.purity || '',
        description: data.description || '',
        storage_info: data.storage_info || '',
        status: data.status as QrCodeStatus,
      });
      setProductImage(data.product_image);
      setCoaUrl(data.coa_url);
      setLoading(false);
    };
    fetchQr();
  }, [id, supabase]);

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !qr) return;

    setUploadingImage(true);
    const ext = file.name.split('.').pop();
    const { url, error: uploadError } = await uploadFile(file, `images/${qr.code}.${ext}`);
    setUploadingImage(false);

    if (uploadError) {
      setError(`Image upload failed: ${uploadError}`);
      return;
    }
    setProductImage(url);
    setSaved(false);
  };

  const handleCoaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !qr) return;

    setUploadingCoa(true);
    const { url, error: uploadError } = await uploadFile(file, `coa/${qr.code}.pdf`);
    setUploadingCoa(false);

    if (uploadError) {
      setError(`COA upload failed: ${uploadError}`);
      return;
    }
    setCoaUrl(url);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!qr) return;
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({
        ...form,
        product_name: form.product_name || null,
        batch_number: form.batch_number || null,
        expiration_date: form.expiration_date || null,
        concentration: form.concentration || null,
        purity: form.purity || null,
        description: form.description || null,
        storage_info: form.storage_info || null,
        product_image: productImage,
        coa_url: coaUrl,
      })
      .eq('id', qr.id);

    setSaving(false);

    if (updateError) {
      setError(`Save failed: ${updateError.message}`);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (error && !qr) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-foreground text-lg">{error}</p>
          <Link href="/admin/qr" className="text-accent hover:underline mt-2 inline-block">
            Back to QR codes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/qr"
              className="p-2 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                <span className="font-mono text-accent">{qr?.code}</span>
              </h1>
              <p className="text-muted text-sm">Edit product information for this QR code</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {qr?.status === 'active' && (
              <a
                href={`/${qr.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-muted hover:text-foreground transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </a>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <label className="block text-sm font-semibold text-foreground mb-3">Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateField('status', s.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    form.status === s.value
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <p className={`text-sm font-semibold ${form.status === s.value ? 'text-accent' : 'text-foreground'}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Product Information</h2>

            <div>
              <label className="block text-sm text-muted mb-1.5">Product Name</label>
              <input
                type="text"
                placeholder="e.g. BPC-157"
                value={form.product_name}
                onChange={(e) => updateField('product_name', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Batch Number</label>
                <input
                  type="text"
                  placeholder="e.g. NAD-2026-A003"
                  value={form.batch_number}
                  onChange={(e) => updateField('batch_number', e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Expiration Date</label>
                <input
                  type="date"
                  value={form.expiration_date}
                  onChange={(e) => updateField('expiration_date', e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Concentration</label>
                <input
                  type="text"
                  placeholder="e.g. 5mg / 10ml"
                  value={form.concentration}
                  onChange={(e) => updateField('concentration', e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Purity</label>
                <input
                  type="text"
                  placeholder="e.g. 99.1%"
                  value={form.purity}
                  onChange={(e) => updateField('purity', e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">Description</label>
              <textarea
                placeholder="Product description..."
                rows={4}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">Storage Instructions</label>
              <input
                type="text"
                placeholder="e.g. Store at 2-8°C, protect from light"
                value={form.storage_info}
                onChange={(e) => updateField('storage_info', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Product Image */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Product Image</h2>
            {productImage ? (
              <div className="relative group">
                <img
                  src={productImage}
                  alt="Product"
                  className="w-full max-w-xs rounded-xl border border-border"
                />
                <button
                  onClick={() => { setProductImage(null); setSaved(false); }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors">
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 text-muted animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-muted mb-2" />
                    <p className="text-muted text-sm">Click to upload product image</p>
                    <p className="text-muted/50 text-xs mt-1">PNG, JPG, WebP up to 5MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Certificate of Analysis */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Certificate of Analysis</h2>
            {coaUrl ? (
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <FileText className="w-5 h-5 text-accent" />
                <a href={coaUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm flex-1 truncate">
                  View Certificate
                </a>
                <button
                  onClick={() => { setCoaUrl(null); setSaved(false); }}
                  className="p-1 rounded hover:bg-surface text-muted hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors">
                {uploadingCoa ? (
                  <Loader2 className="w-8 h-8 text-muted animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted mb-2" />
                    <p className="text-muted text-sm">Click to upload COA (PDF)</p>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCoaUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify page loads**

Navigate to `http://localhost:3000/admin/qr`, click Edit on any QR code → should open the edit form.

**Step 3: Commit**

```bash
git add src/app/admin/qr/[id]/page.tsx
git commit -m "feat: admin QR code edit page with image/COA uploads"
```

---

### Task 8: Generate New QR Codes Page

**Files:**
- Create: `src/app/admin/qr/new/page.tsx`

**Step 1: Build the QR generation page**

```tsx
'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  Download,
  QrCode as QrCodeIcon,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function AdminQrNewPage() {
  const [count, setCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ code: string; dataUrl: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadova.vercel.app';

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      // Find the highest existing code number
      const { data: existing } = await supabase
        .from('qr_codes')
        .select('code')
        .order('code');

      const maxNum = (existing || []).reduce((max, row) => {
        const num = parseInt(row.code.replace('q', ''));
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);

      // Generate new codes
      const newCodes: { code: string; status: string }[] = [];
      for (let i = 1; i <= count; i++) {
        newCodes.push({ code: `q${maxNum + i}`, status: 'draft' });
      }

      // Insert into Supabase
      const { error: insertError } = await supabase
        .from('qr_codes')
        .insert(newCodes);

      if (insertError) {
        setError(`Failed to create codes: ${insertError.message}`);
        setGenerating(false);
        return;
      }

      // Generate QR code images client-side
      const QRCode = (await import('qrcode')).default;
      const results: { code: string; dataUrl: string }[] = [];

      for (const { code } of newCodes) {
        const url = `${siteUrl}/${code}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 512,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });
        results.push({ code, dataUrl });
      }

      setGenerated(results);
    } catch (err) {
      setError(`Generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setGenerating(false);
  };

  const downloadQr = (code: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `nadova-${code}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    generated.forEach(({ code, dataUrl }) => {
      setTimeout(() => downloadQr(code, dataUrl), 100);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/qr"
            className="p-2 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Generate QR Codes</h1>
            <p className="text-muted text-sm">Create new QR codes for product bottles</p>
          </div>
        </div>

        {/* Generator Form */}
        {generated.length === 0 && (
          <div className="bg-surface rounded-xl border border-border p-8 text-center max-w-md mx-auto">
            <QrCodeIcon className="w-16 h-16 text-accent mx-auto mb-4 opacity-80" />
            <h2 className="text-lg font-semibold text-foreground mb-2">How many codes?</h2>
            <p className="text-muted text-sm mb-6">
              New codes will be numbered from the next available number.
            </p>

            <div className="flex items-center justify-center gap-4 mb-6">
              {[5, 10, 25, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    count === n
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted hover:border-accent/50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-center text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {generating ? 'Generating...' : `Generate ${count} Codes`}
            </button>
          </div>
        )}

        {/* Generated Results */}
        {generated.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h2 className="text-lg font-semibold text-foreground">
                  {generated.length} codes generated
                </h2>
              </div>
              <button
                onClick={downloadAll}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {generated.map(({ code, dataUrl }) => (
                <div
                  key={code}
                  className="bg-surface rounded-xl border border-border p-4 flex flex-col items-center gap-3"
                >
                  <img src={dataUrl} alt={code} className="w-full rounded-lg bg-white p-2" />
                  <p className="font-mono text-accent font-semibold text-sm">{code}</p>
                  <button
                    onClick={() => downloadQr(code, dataUrl)}
                    className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/admin/qr"
                className="text-accent hover:underline"
              >
                Go to QR Code Manager to assign products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Verify**

Navigate to `http://localhost:3000/admin/qr/new` — should show the generator form.

**Step 3: Commit**

```bash
git add src/app/admin/qr/new/page.tsx
git commit -m "feat: admin QR code generator with downloadable PNG images"
```

---

### Task 9: Public QR Verification Page

**Files:**
- Create: `src/app/[code]/page.tsx`

**Step 1: Build the public verification page (SSR)**

This is a **Server Component** (no `'use client'`) for fast SSR on phone cameras. Uses the Supabase server client.

```tsx
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { QrCode } from '@/types';
import {
  Shield,
  Calendar,
  Hash,
  Droplets,
  Sparkles,
  Thermometer,
  FileText,
  AlertTriangle,
  Clock,
} from 'lucide-react';

// Only match qN patterns — let other routes handle normally
export async function generateStaticParams() {
  return []; // All dynamic, no static generation
}

async function getQrCode(code: string): Promise<QrCode | null> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}, // Read-only for public pages
      },
    }
  );

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const qr = await getQrCode(code);

  if (!qr || !qr.product_name) {
    return { title: 'Nadova Labs — Product Verification' };
  }

  return {
    title: `${qr.product_name} — Nadova Labs Verified`,
    description: `Verified product: ${qr.product_name}. Batch ${qr.batch_number || 'N/A'}.`,
  };
}

export default async function QrVerificationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  // Only handle qN patterns
  if (!/^q\d+$/i.test(code)) {
    notFound();
  }

  const qr = await getQrCode(code.toLowerCase());

  if (!qr) {
    notFound();
  }

  // Draft state — product being registered
  if (qr.status === 'draft') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-500/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-3">
            Product Being Registered
          </h1>
          <p className="text-muted">
            This product is currently being registered in our system.
            Please check back soon.
          </p>
          <p className="text-muted/50 text-sm mt-6 font-mono">{qr.code}</p>
        </div>
      </div>
    );
  }

  const isWarning = qr.status === 'expired' || qr.status === 'recalled';
  const expiryFormatted = qr.expiration_date
    ? new Date(qr.expiration_date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Verified Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">
            Nadova Labs — Verified Product
          </span>
        </div>

        {/* Warning Banner */}
        {isWarning && (
          <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
            qr.status === 'recalled'
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
              qr.status === 'recalled' ? 'text-red-400' : 'text-amber-400'
            }`} />
            <div>
              <p className={`font-semibold text-sm ${
                qr.status === 'recalled' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {qr.status === 'recalled' ? 'Product Recalled' : 'Product Expired'}
              </p>
              <p className="text-muted text-sm mt-1">
                {qr.status === 'recalled'
                  ? 'This product has been recalled. Please do not use and contact us for a replacement.'
                  : 'This product has passed its expiration date. Please dispose of it properly.'}
              </p>
            </div>
          </div>
        )}

        {/* Product Image */}
        {qr.product_image && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-border">
            <img
              src={qr.product_image}
              alt={qr.product_name || 'Product'}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Product Name */}
        {qr.product_name && (
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 text-center">
            {qr.product_name}
          </h1>
        )}

        {qr.concentration && (
          <p className="text-accent text-center font-medium mb-6">{qr.concentration}</p>
        )}

        {/* Key Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {qr.batch_number && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Batch</span>
              </div>
              <p className="font-mono font-semibold text-foreground">{qr.batch_number}</p>
            </div>
          )}

          {expiryFormatted && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Expires</span>
              </div>
              <p className="font-semibold text-foreground">{expiryFormatted}</p>
            </div>
          )}

          {qr.purity && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Purity</span>
              </div>
              <p className="font-semibold text-accent text-lg">{qr.purity}</p>
            </div>
          )}

          {qr.storage_info && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Storage</span>
              </div>
              <p className="text-sm text-foreground">{qr.storage_info}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {qr.description && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
              About This Product
            </h2>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {qr.description}
            </p>
          </div>
        )}

        {/* Certificate of Analysis */}
        {qr.coa_url && (
          <a
            href={qr.coa_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full p-4 bg-surface rounded-xl border border-border hover:border-accent/50 transition-colors mb-6"
          >
            <FileText className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">View Certificate of Analysis</span>
          </a>
        )}

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-xs text-muted/50 font-mono">{qr.code}</p>
          <p className="text-sm text-muted mt-2">
            Verified by{' '}
            <a href="/" className="text-accent hover:underline">
              Nadova Labs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify**

Navigate to `http://localhost:3000/q1` — should show "Product Being Registered" (since q1 is draft).

Test non-QR routes: `http://localhost:3000/products` — should still work (static routes take priority).

Test invalid: `http://localhost:3000/random` — should 404.

**Step 3: Commit**

```bash
git add src/app/[code]/page.tsx
git commit -m "feat: public QR verification page with SSR and status handling"
```

---

### Task 10: Add QR Stats to Admin Dashboard

**Files:**
- Modify: `src/app/admin/page.tsx`

**Step 1: Add QR code stats to the dashboard**

In the existing admin dashboard, add a QR code stat card alongside the existing products/categories/content cards. Add to the `fetchStats` function:

```typescript
// Add to the Promise.all in fetchStats:
supabase.from('qr_codes').select('id', { count: 'exact', head: true }),
supabase.from('qr_codes').select('id', { count: 'exact', head: true }).eq('status', 'active'),
```

Add a new stat card to the grid:

```tsx
// In the stats grid, add:
<Link href="/admin/qr" className="bg-surface rounded-xl border border-border p-6 hover:border-accent/30 transition-colors">
  <QrCode className="w-8 h-8 text-accent mb-3" />
  <p className="text-2xl font-bold text-foreground">{stats.qrCodes}</p>
  <p className="text-muted text-sm">{stats.qrActive} active QR codes</p>
</Link>
```

Also add to quick actions:
```tsx
<Link href="/admin/qr" className="...">Manage QR Codes</Link>
```

**Step 2: Verify**

Navigate to `http://localhost:3000/admin` — should show QR code count card.

**Step 3: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add QR code stats to admin dashboard"
```

---

### Task 11: Add QR Link to Admin Navigation

**Files:**
- Modify: `src/components/layout/Header.tsx` (if admin nav exists there)

**Step 1: Check where admin navigation lives**

Look at the admin layout or header component for the admin sidebar/nav links. Add a "QR Codes" link with the QrCode icon between Products and Categories.

```tsx
{ href: '/admin/qr', label: 'QR Codes', icon: QrCode }
```

**Step 2: Verify**

Navigate to admin — should see QR Codes in the navigation.

**Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: add QR Codes to admin navigation"
```

---

### Task 12: End-to-End Verification

**Step 1: Full flow test**

1. `npm run dev`
2. Go to `/admin/login` → sign in
3. Go to `/admin/qr` → see 100 draft codes
4. Click Edit on `q1` → fill in product name "BPC-157", batch "NAD-2026-001", expiry, purity "99.1%", description, upload image
5. Set status to Active → Save
6. Open `http://localhost:3000/q1` in new tab → should show beautiful verification page
7. Go to `/admin/qr/new` → generate 5 new codes → download QR images
8. Scan one of the downloaded QR codes with your phone → should open the draft page

**Step 2: Build check**

```bash
cd /Users/blaze/Movies/Kin/nadova && npm run build
```

Expected: Build succeeds with no errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: Nadova QR Product Verification System — admin panel + public pages + QR generation"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Install qrcode | package.json |
| 2 | Database migration + seed q1-q100 | supabase/migrations/004_qr_codes.sql |
| 3 | TypeScript types | src/types/index.ts |
| 4 | Storage bucket | supabase/migrations/005_qr_storage.sql |
| 5 | Upload helper | src/lib/utils/upload.ts |
| 6 | Admin QR list | src/app/admin/qr/page.tsx |
| 7 | Admin QR edit | src/app/admin/qr/[id]/page.tsx |
| 8 | QR generator | src/app/admin/qr/new/page.tsx |
| 9 | Public verification page | src/app/[code]/page.tsx |
| 10 | Dashboard stats | src/app/admin/page.tsx |
| 11 | Admin nav link | src/components/layout/Header.tsx |
| 12 | E2E verification | Manual test + build |

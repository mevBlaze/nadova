'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/utils/upload';
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
  Plus,
  Trash2,
} from 'lucide-react';

const STATUSES: { value: QrCodeStatus; label: string; description: string }[] = [
  { value: 'draft', label: 'Draft', description: 'Not visible to customers' },
  { value: 'active', label: 'Active', description: 'Visible when QR code is scanned' },
  { value: 'expired', label: 'Expired', description: 'Shows expiry warning to customers' },
  { value: 'recalled', label: 'Recalled', description: 'Shows recall warning to customers' },
];

interface CustomField {
  key: string;
  value: string;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-bold tracking-widest text-muted/60 uppercase">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export default function AdminQrEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [qr, setQr] = useState<QrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

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

      // Load extra_fields — convert object to key-value array
      const ef = data.extra_fields ?? {};
      const fields: CustomField[] = Object.entries(ef).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      setCustomFields(fields);

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

  const addCustomField = () => {
    setCustomFields((prev) => [...prev, { key: '', value: '' }]);
    setSaved(false);
  };

  const updateCustomField = (index: number, field: 'key' | 'value', val: string) => {
    setCustomFields((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: val } : f)));
    setSaved(false);
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!qr) return;
    setSaving(true);
    setError(null);

    // Serialize custom fields into extra_fields object (skip blank keys)
    const extra_fields: Record<string, string> = {};
    for (const { key, value } of customFields) {
      const trimmedKey = key.trim();
      if (trimmedKey) {
        extra_fields[trimmedKey] = value;
      }
    }

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
        extra_fields: Object.keys(extra_fields).length > 0 ? extra_fields : null,
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
    <div className="min-h-screen bg-background pb-24 sm:pb-8">
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
            {/* Preview — always available */}
            {qr && (
              <a
                href={`/${qr.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-muted hover:text-foreground transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </a>
            )}
            {/* Desktop save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
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
            <SectionLabel label="Product Details" />

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

          {/* Media */}
          <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
            <SectionLabel label="Media" />

            {/* Product Image */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Product Image</h2>
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
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Certificate of Analysis</h2>
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

          {/* Custom Fields */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <SectionLabel label="Custom Data" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Custom Fields</h2>
                <p className="text-xs text-muted mt-0.5">Add additional key-value pairs to display on the product page</p>
              </div>
              <button
                onClick={addCustomField}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Field
              </button>
            </div>

            {customFields.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                <Plus className="w-6 h-6 text-muted/50 mx-auto mb-2" />
                <p className="text-sm text-muted">No custom fields yet</p>
                <p className="text-xs text-muted/60 mt-1">e.g. Manufacturer, Country of Origin, Lot Size</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Column headers */}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 px-1">
                  <span className="text-xs text-muted/60 font-medium uppercase tracking-wider">Key</span>
                  <span className="text-xs text-muted/60 font-medium uppercase tracking-wider">Value</span>
                  <span className="w-8" />
                </div>
                {customFields.map((field, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g. Manufacturer"
                      value={field.key}
                      onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Nadova Labs"
                      value={field.value}
                      onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      onClick={() => removeCustomField(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label="Remove field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCustomField}
                  className="w-full mt-2 py-2 border border-dashed border-border rounded-lg text-sm text-muted hover:text-foreground hover:border-accent/50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another field
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky save bar — mobile */}
      <div className="fixed bottom-0 inset-x-0 sm:hidden bg-background/90 backdrop-blur-sm border-t border-border px-4 py-3 z-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-accent text-background font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

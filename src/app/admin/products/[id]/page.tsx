'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product, Category, ProductBenefit, ResearchReference } from '@/types';

const defaultProduct: Partial<Product> = {
  code: '',
  name: '',
  slug: '',
  headline: '',
  description: '',
  dosage: '',
  purity: '99%+',
  badge: '',
  category_id: '',
  mechanism_of_action: '',
  benefits: [],
  safety_profile: '',
  regulatory_status: 'Research Use Only',
  research_references: [],
  color: '#00d4aa',
};

export default function ProductEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const [product, setProduct] = useState<Partial<Product>>(defaultProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
    if (!isNew) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      if (data) setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setProduct({
      ...product,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      if (!product.name || !product.category_id) {
        throw new Error('Name and category are required');
      }

      const productData = {
        ...product,
        slug: product.slug || generateSlug(product.name),
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', params.id);
        if (error) throw error;
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const addBenefit = () => {
    setProduct({
      ...product,
      benefits: [...(product.benefits || []), { title: '', description: '', stats: '' }],
    });
  };

  const updateBenefit = (index: number, field: keyof ProductBenefit, value: string) => {
    const benefits = [...(product.benefits || [])];
    benefits[index] = { ...benefits[index], [field]: value };
    setProduct({ ...product, benefits });
  };

  const removeBenefit = (index: number) => {
    const benefits = [...(product.benefits || [])];
    benefits.splice(index, 1);
    setProduct({ ...product, benefits });
  };

  const addReference = () => {
    setProduct({
      ...product,
      research_references: [...(product.research_references || []), { title: '', url: '', source: '' }],
    });
  };

  const updateReference = (index: number, field: keyof ResearchReference, value: string) => {
    const refs = [...(product.research_references || [])];
    refs[index] = { ...refs[index], [field]: value };
    setProduct({ ...product, research_references: refs });
  };

  const removeReference = (index: number) => {
    const refs = [...(product.research_references || [])];
    refs.splice(index, 1);
    setProduct({ ...product, research_references: refs });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold">
            {isNew ? 'New Product' : `Edit ${product.name}`}
          </h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] space-y-5">
        <h3 className="font-bold text-lg">Basic Information</h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="e.g., BPC-157"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Product Code</label>
            <input
              type="text"
              value={product.code}
              onChange={(e) => setProduct({ ...product, code: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="e.g., BPC157"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={product.category_id}
              onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL Slug</label>
            <input
              type="text"
              value={product.slug}
              onChange={(e) => setProduct({ ...product, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="auto-generated-from-name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Headline</label>
          <input
            type="text"
            value={product.headline}
            onChange={(e) => setProduct({ ...product, headline: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
            placeholder="e.g., Body Protection Compound"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors resize-none"
            placeholder="Detailed product description..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Purity</label>
            <input
              type="text"
              value={product.purity}
              onChange={(e) => setProduct({ ...product, purity: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="99%+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dosage</label>
            <input
              type="text"
              value={product.dosage}
              onChange={(e) => setProduct({ ...product, dosage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="e.g., 5mg vial"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Badge</label>
            <input
              type="text"
              value={product.badge}
              onChange={(e) => setProduct({ ...product, badge: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="e.g., Best Seller"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={product.color}
              onChange={(e) => setProduct({ ...product, color: e.target.value })}
              className="w-12 h-12 rounded-lg border-0 cursor-pointer"
            />
            <input
              type="text"
              value={product.color}
              onChange={(e) => setProduct({ ...product, color: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="#00d4aa"
            />
          </div>
        </div>
      </div>

      {/* Science Details */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] space-y-5">
        <h3 className="font-bold text-lg">Scientific Information</h3>

        <div>
          <label className="block text-sm font-medium mb-2">Mechanism of Action</label>
          <textarea
            value={product.mechanism_of_action}
            onChange={(e) => setProduct({ ...product, mechanism_of_action: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors resize-none"
            placeholder="How this compound works..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Safety Profile</label>
          <textarea
            value={product.safety_profile}
            onChange={(e) => setProduct({ ...product, safety_profile: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors resize-none"
            placeholder="Safety considerations..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Regulatory Status</label>
          <input
            type="text"
            value={product.regulatory_status}
            onChange={(e) => setProduct({ ...product, regulatory_status: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
            placeholder="Research Use Only"
          />
        </div>
      </div>

      {/* Benefits */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Benefits</h3>
          <button
            onClick={addBenefit}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Benefit
          </button>
        </div>

        {(product.benefits || []).map((benefit, index) => (
          <div key={index} className="p-4 rounded-xl bg-[#1a1a24] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#8b8b9e]">Benefit {index + 1}</span>
              <button
                onClick={() => removeBenefit(index)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors group"
              >
                <Trash2 className="w-4 h-4 text-[#8b8b9e] group-hover:text-red-400" />
              </button>
            </div>
            <input
              type="text"
              value={benefit.title}
              onChange={(e) => updateBenefit(index, 'title', e.target.value)}
              placeholder="Benefit title"
              className="w-full px-3 py-2 rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors text-sm"
            />
            <textarea
              value={benefit.description}
              onChange={(e) => updateBenefit(index, 'description', e.target.value)}
              placeholder="Benefit description"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors text-sm resize-none"
            />
            <input
              type="text"
              value={benefit.stats}
              onChange={(e) => updateBenefit(index, 'stats', e.target.value)}
              placeholder="Stats (optional) e.g., 40% improvement"
              className="w-full px-3 py-2 rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors text-sm"
            />
          </div>
        ))}

        {(product.benefits || []).length === 0 && (
          <p className="text-[#8b8b9e] text-sm text-center py-4">No benefits added yet</p>
        )}
      </div>

      {/* Research References */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Research References</h3>
          <button
            onClick={addReference}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Reference
          </button>
        </div>

        {(product.research_references || []).map((ref, index) => (
          <div key={index} className="p-4 rounded-xl bg-[#1a1a24] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#8b8b9e]">Reference {index + 1}</span>
              <button
                onClick={() => removeReference(index)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors group"
              >
                <Trash2 className="w-4 h-4 text-[#8b8b9e] group-hover:text-red-400" />
              </button>
            </div>
            <input
              type="text"
              value={ref.title}
              onChange={(e) => updateReference(index, 'title', e.target.value)}
              placeholder="Study title"
              className="w-full px-3 py-2 rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors text-sm"
            />
            <input
              type="text"
              value={ref.source}
              onChange={(e) => updateReference(index, 'source', e.target.value)}
              placeholder="Source (e.g., PubMed, Journal name)"
              className="w-full px-3 py-2 rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors text-sm"
            />
            <div className="flex gap-2">
              <input
                type="url"
                value={ref.url}
                onChange={(e) => updateReference(index, 'url', e.target.value)}
                placeholder="URL to research"
                className="flex-1 px-3 py-2 rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors text-sm"
              />
              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}

        {(product.research_references || []).length === 0 && (
          <p className="text-[#8b8b9e] text-sm text-center py-4">No references added yet</p>
        )}
      </div>
    </div>
  );
}

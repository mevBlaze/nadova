'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts(products.filter(p => p.id !== id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#8b8b9e';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-[#8b8b9e]">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8b9e]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors min-w-[200px]"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-[#8b8b9e] mx-auto mb-3" />
            <p className="text-[#8b8b9e]">
              {search || categoryFilter !== 'all' ? 'No products match your filters' : 'No products yet'}
            </p>
            {!search && categoryFilter === 'all' && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 mt-4 text-[#00d4aa] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add your first product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#8b8b9e]">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#8b8b9e]">Code</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#8b8b9e]">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#8b8b9e]">Purity</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#8b8b9e]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-[#8b8b9e]">{product.headline}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 rounded bg-white/5 text-sm">{product.code}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getCategoryColor(product.category_id)}20`,
                          color: getCategoryColor(product.category_id)
                        }}
                      >
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#00d4aa] font-medium">{product.purity}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[#8b8b9e]" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(product.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-[#8b8b9e] group-hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-[#12121a] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Delete Product</h3>
            <p className="text-[#8b8b9e] mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

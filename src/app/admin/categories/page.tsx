'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree, Save, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types';

const defaultCategory: Partial<Category> = {
  name: '',
  slug: '',
  description: '',
  color: '#00d4aa',
  icon: 'Beaker',
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>(defaultCategory);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*, products(id)')
        .order('name');

      if (data) {
        setCategories(data.map(cat => ({
          ...cat,
          product_count: cat.products?.length || 0,
        })));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleSave = async () => {
    try {
      const categoryData = {
        ...editForm,
        slug: editForm.slug || generateSlug(editForm.name || ''),
      };

      if (isAdding) {
        const { data, error } = await supabase
          .from('categories')
          .insert([categoryData])
          .select()
          .single();

        if (error) throw error;
        if (data) setCategories([...categories, { ...data, product_count: 0 }]);
      } else if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingId);

        if (error) throw error;
        setCategories(categories.map(c =>
          c.id === editingId ? { ...c, ...categoryData } : c
        ));
      }

      setEditingId(null);
      setIsAdding(false);
      setEditForm(defaultCategory);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('categories').delete().eq('id', id);
      setCategories(categories.filter(c => c.id !== id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm(category);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm(defaultCategory);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm(defaultCategory);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-[#8b8b9e]">{categories.length} categories</p>
        </div>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="p-6 rounded-2xl bg-[#12121a] border border-[#00d4aa]/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{isAdding ? 'New Category' : 'Edit Category'}</h3>
            <button onClick={cancelEdit} className="p-2 hover:bg-white/5 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({
                  ...editForm,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                })}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
                placeholder="auto-generated"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors resize-none"
              placeholder="Category description"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={editForm.color}
                  onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  className="w-12 h-12 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={editForm.color}
                  onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon (Lucide name)</label>
              <input
                type="text"
                value={editForm.icon}
                onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
                placeholder="e.g., Beaker, Heart, Zap"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={cancelEdit}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <FolderTree className="w-12 h-12 text-[#8b8b9e] mx-auto mb-3" />
            <p className="text-[#8b8b9e]">No categories yet</p>
            <button
              onClick={startAdd}
              className="inline-flex items-center gap-2 mt-4 text-[#00d4aa] hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add your first category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-[#8b8b9e] truncate">
                    {category.description || 'No description'}
                  </div>
                </div>
                <div className="text-sm text-[#8b8b9e]">
                  {category.product_count} products
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[#8b8b9e]" />
                  </button>
                  <button
                    onClick={() => setDeleteModal(category.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                  >
                    <Trash2 className="w-4 h-4 text-[#8b8b9e] group-hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-[#12121a] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Delete Category</h3>
            <p className="text-[#8b8b9e] mb-6">
              Are you sure? Products in this category will become uncategorized.
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

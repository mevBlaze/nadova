'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Edit, Save, X, FileText, Eye, Trash2, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ContentBlock } from '@/types';

const pages = ['home', 'about', 'contact', 'products', 'quiz'];

const defaultBlock: Partial<ContentBlock> = {
  key: '',
  title: '',
  content: '',
  content_type: 'text',
  page: 'home',
};

export default function AdminContentPage() {
  const searchParams = useSearchParams();
  const initialPage = searchParams.get('page') || 'home';

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(initialPage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContentBlock>>(defaultBlock);
  const [isAdding, setIsAdding] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const { data } = await supabase
        .from('content_blocks')
        .select('*')
        .order('page')
        .order('key');

      if (data) setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const blockData = {
        ...editForm,
        updated_at: new Date().toISOString(),
      };

      if (isAdding) {
        const { data, error } = await supabase
          .from('content_blocks')
          .insert([blockData])
          .select()
          .single();

        if (error) throw error;
        if (data) setBlocks([...blocks, data]);
      } else if (editingId) {
        const { error } = await supabase
          .from('content_blocks')
          .update(blockData)
          .eq('id', editingId);

        if (error) throw error;
        setBlocks(blocks.map(b =>
          b.id === editingId ? { ...b, ...blockData } : b
        ));
      }

      setEditingId(null);
      setIsAdding(false);
      setEditForm(defaultBlock);
    } catch (error) {
      console.error('Error saving block:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this content block?')) return;

    try {
      await supabase.from('content_blocks').delete().eq('id', id);
      setBlocks(blocks.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  const startEdit = (block: ContentBlock) => {
    setEditingId(block.id);
    setEditForm(block);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({ ...defaultBlock, page: activePage });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm(defaultBlock);
  };

  const filteredBlocks = blocks.filter(b => b.page === activePage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Content Blocks</h2>
          <p className="text-[#8b8b9e]">Manage text content across your site</p>
        </div>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Block
        </button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
        <p>
          <span className="font-semibold text-blue-200">Content blocks are saved to the database.</span>{' '}
          To display them on your site pages, contact your developer. Currently, site pages use their built-in content.
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 rounded-xl font-medium capitalize transition-all whitespace-nowrap ${
              activePage === page
                ? 'bg-[#00d4aa]/10 text-[#00d4aa]'
                : 'bg-white/5 text-[#8b8b9e] hover:bg-white/10 hover:text-white'
            }`}
          >
            {page}
            <span className="ml-2 text-xs opacity-60">
              ({blocks.filter(b => b.page === page).length})
            </span>
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="p-6 rounded-2xl bg-[#12121a] border border-[#00d4aa]/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{isAdding ? 'New Content Block' : 'Edit Content Block'}</h3>
            <button onClick={cancelEdit} className="p-2 hover:bg-white/5 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Key (identifier)</label>
              <input
                type="text"
                value={editForm.key}
                onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
                placeholder="e.g., hero_title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Page</label>
              <select
                value={editForm.page}
                onChange={(e) => setEditForm({ ...editForm, page: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors capitalize"
              >
                {pages.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={editForm.content_type}
                onChange={(e) => setEditForm({ ...editForm, content_type: e.target.value as ContentBlock['content_type'] })}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              >
                <option value="text">Text</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title (display name)</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="e.g., Hero Section Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors resize-none font-mono text-sm"
              placeholder={editForm.content_type === 'json' ? '{\n  "key": "value"\n}' : 'Content here...'}
            />
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

      {/* Content Blocks List */}
      <div className="rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredBlocks.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-[#8b8b9e] mx-auto mb-3" />
            <p className="text-[#8b8b9e]">No content blocks for {activePage} page</p>
            <button
              onClick={startAdd}
              className="inline-flex items-center gap-2 mt-4 text-[#00d4aa] hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add content block
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {filteredBlocks.map((block) => (
              <div
                key={block.id}
                className="px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{block.title || block.key}</span>
                      <code className="px-2 py-0.5 rounded bg-white/5 text-xs text-[#8b8b9e]">
                        {block.key}
                      </code>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        block.content_type === 'html'
                          ? 'bg-orange-500/10 text-orange-400'
                          : block.content_type === 'json'
                            ? 'bg-blue-500/10 text-blue-400'
                            : block.content_type === 'markdown'
                              ? 'bg-purple-500/10 text-purple-400'
                              : 'bg-green-500/10 text-green-400'
                      }`}>
                        {block.content_type}
                      </span>
                    </div>
                    <p className="text-sm text-[#8b8b9e] line-clamp-2">
                      {block.content.substring(0, 200)}
                      {block.content.length > 200 && '...'}
                    </p>
                    <p className="text-xs text-[#8b8b9e]/60 mt-2">
                      Updated: {new Date(block.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(block)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-[#8b8b9e]" />
                    </button>
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#8b8b9e] hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Link */}
      <div className="flex justify-center">
        <a
          href={`/${activePage === 'home' ? '' : activePage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#8b8b9e] hover:text-white transition-colors"
        >
          <Eye className="w-4 h-4" />
          Preview {activePage} page
        </a>
      </div>
    </div>
  );
}

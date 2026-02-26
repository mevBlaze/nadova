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
        data.sort((a: QrCode, b: QrCode) => {
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

'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Package, FolderTree, FileText, Eye, TrendingUp, Clock, QrCode } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Stats {
  products: number;
  categories: number;
  contentBlocks: number;
  qrCodes: number;
  qrActive: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, contentBlocks: 0, qrCodes: 0, qrActive: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, contentRes, qrCodesRes, qrActiveRes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('content_blocks').select('id', { count: 'exact', head: true }),
          supabase.from('qr_codes').select('id', { count: 'exact', head: true }),
          supabase.from('qr_codes').select('id', { count: 'exact', head: true }).eq('is_active', true),
        ]);

        setStats({
          products: productsRes.count || 0,
          categories: categoriesRes.count || 0,
          contentBlocks: contentRes.count || 0,
          qrCodes: qrCodesRes.count || 0,
          qrActive: qrActiveRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, href: '/admin/products', color: '#00d4aa' },
    { label: 'Categories', value: stats.categories, icon: FolderTree, href: '/admin/categories', color: '#7c3aed' },
    { label: 'Content Blocks', value: stats.contentBlocks, icon: FileText, href: '/admin/content', color: '#f59e0b' },
    { label: 'QR Codes', value: stats.qrCodes, icon: QrCode, href: '/admin/qr', color: '#06b6d4', subtitle: `${stats.qrActive} active` },
  ];

  const quickActions = [
    { label: 'Add New Product', href: '/admin/products/new', icon: Package },
    { label: 'Edit Homepage', href: '/admin/content?page=home', icon: FileText },
    { label: 'View Site', href: '/', icon: Eye, external: true },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-[#8b8b9e]">
          Manage your products, categories, and site content from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <TrendingUp className="w-5 h-5 text-[#22c55e]" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {loading ? (
                  <div className="w-12 h-8 bg-white/5 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-[#8b8b9e]">{stat.label}</div>
              {'subtitle' in stat && stat.subtitle && !loading && (
                <div className="text-xs text-[#8b8b9e] mt-1">{stat.subtitle}</div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                className="flex items-center gap-3 p-4 rounded-xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] hover:border-[#00d4aa]/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center group-hover:bg-[#00d4aa]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <span className="font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-4 text-[#8b8b9e]">
            <Clock className="w-5 h-5" />
            <p>Activity log coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  LogOut,
  Menu,
  X,
  Beaker,
  QrCode,
  BookOpen
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/qr', label: 'QR Codes', icon: QrCode },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/guide', label: 'Guide', icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      // Use getUser() — validates token server-side (not just local check)
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        // Middleware handles redirect, but double-check client-side
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/admin/login');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#12121a] border-r border-[rgba(255,255,255,0.08)]
        transform transition-transform lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-[rgba(255,255,255,0.08)]">
            <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/20 flex items-center justify-center">
              <Beaker className="w-5 h-5 text-[#00d4aa]" />
            </div>
            <span className="font-bold text-lg">Nadova Admin</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden p-1 hover:bg-white/5 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                      ? 'bg-[#00d4aa]/10 text-[#00d4aa]'
                      : 'text-[#8b8b9e] hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                <span className="text-sm font-medium text-[#7c3aed]">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.email}</div>
                <div className="text-xs text-[#8b8b9e]">Administrator</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#8b8b9e] hover:bg-white/5 hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-[rgba(255,255,255,0.08)] flex items-center px-6 bg-[#12121a]/50 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg mr-4"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">
            {navItems.find(item =>
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            )?.label || 'Dashboard'}
          </h1>
          <Link
            href="/"
            target="_blank"
            className="ml-auto text-sm text-[#8b8b9e] hover:text-white transition-colors"
          >
            View Site →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

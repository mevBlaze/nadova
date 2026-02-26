'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Beaker, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else if (error.message.includes('rate')) {
          setError('Too many attempts. Please wait a moment and try again.');
        } else {
          setError(error.message);
        }
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset link sent! Check your email.');
        setShowReset(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-[#00d4aa]/10 items-center justify-center mb-4">
            <Beaker className="w-8 h-8 text-[#00d4aa]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Nadova Admin</h1>
          <p className="text-[#8b8b9e]">Sign in to manage your content</p>
        </div>

        {/* Login form */}
        <div className="bg-[#12121a] rounded-2xl border border-[rgba(255,255,255,0.08)] p-8">
          <form onSubmit={showReset ? handleResetPassword : handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8b9e]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
                  placeholder="admin@nadovalabs.com"
                />
              </div>
            </div>

            {!showReset && (
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8b9e]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00d4aa] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (showReset ? 'Sending...' : 'Signing in...')
                : (showReset ? 'Send Reset Link' : 'Sign In')}
            </button>

            <button
              type="button"
              onClick={() => { setShowReset(!showReset); setError(''); setSuccess(''); }}
              className="w-full text-sm text-[#8b8b9e] hover:text-[#00d4aa] transition-colors"
            >
              {showReset ? '← Back to Sign In' : 'Forgot password?'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#8b8b9e] mt-6">
          Need access? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Palette, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_email: string;
  business_hours: string;
  social_twitter: string;
  social_instagram: string;
  accent_color: string;
  secondary_color: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'Nadova Labs',
  site_description: 'Premium research peptides for longevity and wellness.',
  contact_email: 'research@nadovalabs.com',
  support_email: 'support@nadovalabs.com',
  business_hours: '9AM - 6PM JST',
  social_twitter: '',
  social_instagram: '',
  accent_color: '#00d4aa',
  secondary_color: '#7c3aed',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (data) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      // Use defaults if no settings exist
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'default',
          settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-[#8b8b9e]">Configure your site settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0a0f] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* General */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <Globe className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="font-bold">General</h3>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Site Description</label>
          <textarea
            value={settings.site_description}
            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <Mail className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="font-bold">Contact</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Support Email</label>
            <input
              type="email"
              value={settings.support_email}
              onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Business Hours</label>
          <input
            type="text"
            value={settings.business_hours}
            onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
            placeholder="e.g., 9AM - 6PM JST"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Twitter/X</label>
            <input
              type="text"
              value={settings.social_twitter}
              onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="@handle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Instagram</label>
            <input
              type="text"
              value={settings.social_instagram}
              onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              placeholder="@handle"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)] space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <Palette className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="font-bold">Appearance</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="w-12 h-12 rounded-lg border-0 cursor-pointer"
              />
              <input
                type="text"
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secondary Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="w-12 h-12 rounded-lg border-0 cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a24] border border-[rgba(255,255,255,0.08)] focus:border-[#00d4aa] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1a1a24]">
          <p className="text-sm text-[#8b8b9e] mb-3">Preview</p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg font-medium text-sm"
              style={{ backgroundColor: settings.accent_color, color: '#0a0a0f' }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium text-sm"
              style={{ backgroundColor: settings.secondary_color, color: 'white' }}
            >
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

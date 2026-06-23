'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BarChart2, Globe, Smartphone, TrendingUp, Activity, Calendar } from 'lucide-react';

interface ScanRow {
  code: string;
  scanned_at: string;
  country: string | null;
  user_agent: string | null;
}

interface DayCount {
  date: string;
  count: number;
}

interface TopCode {
  code: string;
  count: number;
}

interface CountryCount {
  country: string;
  count: number;
}

function buildSparkline(rows: ScanRow[], days = 30): DayCount[] {
  const result: DayCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push({
      date: dateStr,
      count: rows.filter((r) => r.scanned_at.startsWith(dateStr)).length,
    });
  }
  return result;
}

function Sparkline({ data }: { data: DayCount[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.count), 1);
  const w = 400;
  const h = 60;
  const pad = 4;
  const step = (w - pad * 2) / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = pad + i * step;
      const y = h - pad - ((d.count / max) * (h - pad * 2));
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="#00d4aa"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminAnalyticsPage() {
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      // Fetch last 30 days of scans — enough for all our analytics panels
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const { data, error } = await supabase
        .from('qr_scans')
        .select('code, scanned_at, country, user_agent')
        .gte('scanned_at', since.toISOString())
        .order('scanned_at', { ascending: false })
        .limit(5000);

      if (!error && data) setScans(data as ScanRow[]);
      setLoading(false);
    };

    // Also pull a quick all-time total via count
    load();
  }, [supabase]);

  // Derived stats
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const minus7 = new Date(now); minus7.setDate(now.getDate() - 7);
  const minus30 = new Date(now); minus30.setDate(now.getDate() - 30);

  const todayCount = scans.filter((s) => s.scanned_at.startsWith(today)).length;
  const week7Count = scans.filter((s) => new Date(s.scanned_at) >= minus7).length;
  const month30Count = scans.length; // our window is already 30 days

  const sparklineData = buildSparkline(scans, 30);

  // Top 10 codes
  const codeMap: Record<string, number> = {};
  for (const s of scans) codeMap[s.code] = (codeMap[s.code] ?? 0) + 1;
  const topCodes: TopCode[] = Object.entries(codeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([code, count]) => ({ code, count }));

  // Country breakdown
  const countryMap: Record<string, number> = {};
  for (const s of scans) {
    const c = s.country ?? 'Unknown';
    countryMap[c] = (countryMap[c] ?? 0) + 1;
  }
  const countries: CountryCount[] = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  const maxCountry = countries[0]?.count ?? 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Scan Analytics</h2>
        <p className="text-[#8b8b9e] text-sm">QR code scan data — last 30 days.</p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Today', value: todayCount, icon: Activity, color: '#00d4aa' },
          { label: 'Last 7 days', value: week7Count, icon: TrendingUp, color: '#7c3aed' },
          { label: 'Last 30 days', value: month30Count, icon: Calendar, color: '#f59e0b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-[#8b8b9e] text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* 30-day sparkline */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="font-bold">Daily Scans — 30 Days</h3>
        </div>
        {month30Count === 0 ? (
          <p className="text-[#8b8b9e] text-sm text-center py-4">No scans yet in this period.</p>
        ) : (
          <div className="space-y-1">
            <Sparkline data={sparklineData} />
            <div className="flex justify-between text-xs text-[#8b8b9e] mt-1">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top 10 codes */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-[#7c3aed]" />
            <h3 className="font-bold">Top Scanned Codes</h3>
          </div>
          {topCodes.length === 0 ? (
            <p className="text-[#8b8b9e] text-sm">No scans recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topCodes.map(({ code, count }) => (
                <div key={code} className="flex items-center gap-3">
                  <span className="font-mono text-sm text-[#00d4aa] w-12 shrink-0">{code}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7c3aed] rounded-full"
                      style={{ width: `${(count / (topCodes[0]?.count ?? 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#8b8b9e] w-8 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Country breakdown */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="font-bold">Country Breakdown</h3>
          </div>
          {countries.length === 0 ? (
            <p className="text-[#8b8b9e] text-sm">No location data yet.</p>
          ) : (
            <div className="space-y-3">
              {countries.map(({ country, count }) => (
                <div key={country} className="flex items-center gap-3">
                  <span className="text-sm w-24 shrink-0 truncate">{country}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#f59e0b] rounded-full"
                      style={{ width: `${(count / maxCountry) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#8b8b9e] w-8 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
          {countries.find((c) => c.country === 'Unknown') && (
            <p className="text-xs text-[#8b8b9e] mt-3">
              "Unknown" = scans without Cloudflare geo headers (local dev or direct IP).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

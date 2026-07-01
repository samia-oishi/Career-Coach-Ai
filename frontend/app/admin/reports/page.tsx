'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';

export default function AdminReportsPage() {
  const { getToken } = useAuth();
  const [reports, setReports] = useState({ savedCareers: 0, aiGenerations: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await getToken();
        const response = await api.get('/admin/reports', { headers: { Authorization: `Bearer ${token}` } });
        setReports(response.data.data);
      } catch (error) {
        console.error('Failed to load reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [getToken]);

  if (loading) {
    return (
      <DashboardShell title="Reports">
        <div className="card-surface p-8 text-center">Loading reports...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Reports">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-surface p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Total Saved Careers</p>
          <strong className="text-4xl text-blue-600">{reports.savedCareers}</strong>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Across all users</p>
        </div>
        <div className="card-surface p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>AI Generations</p>
          <strong className="text-4xl text-purple-600">{reports.aiGenerations}</strong>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Total generations</p>
        </div>
        <div className="card-surface p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Career Reviews</p>
          <strong className="text-4xl text-green-600">{reports.reviews}</strong>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Submitted reviews</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Activity Summary</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Average Saved Careers per User</span>
              <strong className="text-xl">{reports.savedCareers > 0 ? (reports.savedCareers / 10).toFixed(1) : '0'}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Average AI Generations per User</span>
              <strong className="text-xl">{reports.aiGenerations > 0 ? (reports.aiGenerations / 10).toFixed(1) : '0'}</strong>
            </div>
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Export Options</h2>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-xl border px-4 py-3 text-left font-semibold transition hover:bg-gray-100" style={{ borderColor: 'var(--border)' }}>
              📊 Export User Data (CSV)
            </button>
            <button className="w-full rounded-xl border px-4 py-3 text-left font-semibold transition hover:bg-gray-100" style={{ borderColor: 'var(--border)' }}>
              📈 Export Analytics Report (PDF)
            </button>
            <button className="w-full rounded-xl border px-4 py-3 text-left font-semibold transition hover:bg-gray-100" style={{ borderColor: 'var(--border)' }}>
              🤖 Export AI Usage Data (JSON)
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

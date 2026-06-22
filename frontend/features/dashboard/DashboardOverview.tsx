'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { DashboardChartsView } from '@/components/charts/DashboardCharts';
import { api } from '@/lib/api';
import type { DashboardCharts, DashboardOverview as DashboardOverviewType } from '@/lib/types';

export function DashboardOverview() {
  const { getToken } = useAuth();

  const overview = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const token = await getToken();
      const response = await api.get('/dashboard/user/overview', { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data as DashboardOverviewType;
    },
  });

  const charts = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: async () => {
      const token = await getToken();
      const response = await api.get('/dashboard/user/charts', { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data as DashboardCharts;
    },
  });

  const cards = [
    ['Saved Careers', overview.data?.savedCareers ?? 0, 'Career paths you are tracking.'],
    ['AI Generations', overview.data?.aiGenerations ?? 0, 'Resume summaries and recommendations generated.'],
    ['Profile Progress', `${overview.data?.profileCompletion ?? 0}%`, 'Complete skills, interests, bio, goal, and location.'],
  ];

  if (overview.isError || charts.isError) {
    return <section className="card-surface p-8 text-red-600">Dashboard data could not be loaded. Refresh after signing in.</section>;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(([label, value, helper]) => (
          <section key={label} className="card-surface p-6">
            <p className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>{label}</p>
            <strong className="mt-3 block text-4xl" style={{ color: 'var(--primary)' }}>{overview.isLoading ? '...' : value}</strong>
            <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>{helper}</p>
          </section>
        ))}
      </div>
      <div className="mt-8"><DashboardChartsView data={charts.data} loading={charts.isLoading} /></div>
      <section className="card-surface mt-8 p-6">
        <h2 className="text-2xl font-bold">Recent AI activity</h2>
        <div className="mt-4 grid gap-3">
          {overview.data?.recentHistory?.length ? overview.data.recentHistory.map((item) => (
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }} key={item._id || `${item.type}-${item.createdAt}`}>
              <strong>{item.type.replace('_', ' ')}</strong>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          )) : <p style={{ color: 'var(--muted)' }}>Use Resume Summary or Career Recommendations to see activity here.</p>}
        </div>
      </section>
    </>
  );
}

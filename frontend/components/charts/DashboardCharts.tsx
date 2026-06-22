'use client';

import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardCharts } from '@/lib/types';

const emptySaved = [{ name: 'No saved careers', count: 0 }];
const emptyAi = [{ name: 'No AI usage', value: 1 }];

export function DashboardChartsView({ data, loading }: { data?: DashboardCharts; loading?: boolean }) {
  const savedCareerData = data?.savedByStatus?.length
    ? data.savedByStatus.map((item) => ({ name: item._id || 'saved', count: item.count }))
    : emptySaved;
  const aiUsageData = data?.aiByType?.length
    ? data.aiByType.map((item) => ({ name: item._id.replace('_', ' '), value: item.count }))
    : emptyAi;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card-surface p-6">
        <h2 className="text-xl font-bold">Saved career progress</h2>
        <div className="mt-6 h-72 min-h-72">
          {loading ? <p style={{ color: 'var(--muted)' }}>Loading chart...</p> : (
            <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={260}>
              <BarChart data={savedCareerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
      <section className="card-surface p-6">
        <h2 className="text-xl font-bold">AI tool usage</h2>
        <div className="mt-6 h-72 min-h-72">
          {loading ? <p style={{ color: 'var(--muted)' }}>Loading chart...</p> : (
            <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={260}>
              <PieChart>
                <Pie data={aiUsageData} dataKey="value" nameKey="name" outerRadius={90} fill="var(--secondary)" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}

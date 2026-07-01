'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminAnalyticsPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState({ byCategory: [], savedByStatus: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = await getToken();
        const response = await api.get('/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [getToken]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  if (loading) {
    return (
      <DashboardShell title="Analytics">
        <div className="card-surface p-8 text-center">Loading analytics...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Analytics">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Careers by Category</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Saved Careers by Status</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.savedByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.savedByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="card-surface p-6">
          <h3 className="font-semibold" style={{ color: 'var(--muted)' }}>Total Categories</h3>
          <p className="mt-2 text-3xl font-bold">{data.byCategory.length}</p>
        </div>
        <div className="card-surface p-6">
          <h3 className="font-semibold" style={{ color: 'var(--muted)' }}>Total Saved Careers</h3>
          <p className="mt-2 text-3xl font-bold">
            {data.savedByStatus.reduce((sum: number, item: { count: number }) => sum + item.count, 0)}
          </p>
        </div>
        <div className="card-surface p-6">
          <h3 className="font-semibold" style={{ color: 'var(--muted)' }}>Status Types</h3>
          <p className="mt-2 text-3xl font-bold">{data.savedByStatus.length}</p>
        </div>
      </div>
    </DashboardShell>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserActivityPage() {
  const { getToken } = useAuth();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = await getToken();
        const response = await api.get('/admin/user-activity', { headers: { Authorization: `Bearer ${token}` } });
        setActivity(response.data.data);
      } catch (error) {
        console.error('Failed to load activity', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [getToken]);

  const formatLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formattedData = activity.map((item: { _id: string; count: number }) => ({
    name: formatLabel(item._id),
    activity: item.count,
  }));

  if (loading) {
    return (
      <DashboardShell title="User Activity">
        <div className="card-surface p-8 text-center">Loading user activity...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="User Activity">
      <div className="card-surface p-6">
        <h2 className="text-xl font-bold">Activity by Type</h2>
        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Activity Breakdown</h2>
          <div className="mt-4 space-y-3">
            {formattedData.map((item: { name: string; activity: number }) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
                <span className="font-semibold">{item.name}</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 font-bold text-blue-700">{item.activity}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Recent Trends</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">AI Usage Up</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Resume and recommendation features popular</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">User Growth</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>New signups increasing weekly</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

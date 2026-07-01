'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAiUsagePage() {
  const { getToken } = useAuth();
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const token = await getToken();
        const response = await api.get('/admin/ai-usage', { headers: { Authorization: `Bearer ${token}` } });
        setUsage(response.data.data);
      } catch (error) {
        console.error('Failed to load AI usage', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, [getToken]);

  const formatLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formattedData = usage.map((item: { _id: string; count: number }) => ({
    name: formatLabel(item._id),
    count: item.count,
  }));

  const totalGenerations = usage.reduce((sum: number, item: { count: number }) => sum + item.count, 0);

  if (loading) {
    return (
      <DashboardShell title="AI Usage">
        <div className="card-surface p-8 text-center">Loading AI usage...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="AI Usage">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="card-surface p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Total Generations</p>
          <strong className="text-3xl text-blue-600">{totalGenerations}</strong>
        </div>
        <div className="card-surface p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Feature Types</p>
          <strong className="text-3xl text-purple-600">{usage.length}</strong>
        </div>
        <div className="card-surface p-6 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>AI Provider</p>
          <strong className="text-3xl text-green-600">Gemini</strong>
        </div>
      </div>

      <div className="card-surface p-6">
        <h2 className="text-xl font-bold">Usage by Feature</h2>
        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 card-surface p-6">
        <h2 className="text-xl font-bold">AI Features Breakdown</h2>
        <div className="mt-4 space-y-3">
          {formattedData.map((item: { name: string; count: number }) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span className="font-semibold">{item.name}</span>
              <div className="flex items-center gap-4">
                <div className="h-2 w-32 rounded-full bg-gray-200">
                  <div 
                    className="h-2 rounded-full bg-purple-500" 
                    style={{ width: `${totalGenerations > 0 ? (item.count / totalGenerations) * 100 : 0}%` }} 
                  />
                </div>
                <span className="font-bold text-purple-600">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

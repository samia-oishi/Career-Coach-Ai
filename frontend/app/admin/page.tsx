'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function AdminPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({ users: 0, careers: 0, blogs: 0, aiGenerations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const response = await api.get('/admin/overview', { headers: { Authorization: `Bearer ${token}` } });
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [getToken]);

  const cards = [
    { label: 'Total Users', value: stats.users, href: '/admin/users', color: 'var(--primary)' },
    { label: 'Published Careers', value: stats.careers, href: '/admin/careers', color: 'var(--secondary)' },
    { label: 'Published Blogs', value: stats.blogs, href: '/admin/blogs', color: 'var(--accent)' },
    { label: 'AI Generations', value: stats.aiGenerations, href: '/admin/ai-usage', color: '#10b981' },
  ];

  return (
    <DashboardShell title="Admin Overview">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="card-surface p-6 transition hover:shadow-lg"
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>{card.label}</p>
            <strong className="mt-3 block text-4xl" style={{ color: card.color }}>
              {loading ? '...' : card.value}
            </strong>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/admin/users" className="btn-light block rounded-xl px-4 py-3 text-center font-semibold">
              Manage Users
            </Link>
            <Link href="/admin/careers" className="btn-light block rounded-xl px-4 py-3 text-center font-semibold">
              Manage Careers
            </Link>
            <Link href="/admin/blogs" className="btn-light block rounded-xl px-4 py-3 text-center font-semibold">
              Manage Blogs
            </Link>
            <Link href="/admin/content-review" className="btn-light block rounded-xl px-4 py-3 text-center font-semibold">
              Review Content
            </Link>
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">System Status</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span>AI Provider</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Gemini Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Authentication</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Clerk Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">MongoDB Connected</span>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

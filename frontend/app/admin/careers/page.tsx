'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';
import type { Career } from '@/lib/types';
import Link from 'next/link';

export default function AdminCareersPage() {
  const { getToken } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCareers();
  }, [getToken]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.get('/admin/careers', { headers: { Authorization: `Bearer ${token}` } });
      setCareers(response.data.data);
    } catch (err) {
      setError('Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (careerId: string, currentStatus: string) => {
    try {
      const token = await getToken();
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await api.patch(`/admin/careers/${careerId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchCareers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredCareers = careers.filter((career) => {
    if (filter === 'all') return true;
    return career.status === filter;
  });

  const stats = {
    total: careers.length,
    published: careers.filter((c) => c.status === 'published').length,
    draft: careers.filter((c) => c.status === 'draft').length,
    featured: careers.filter((c) => c.isFeatured).length,
  };

  if (loading) {
    return (
      <DashboardShell title="Careers">
        <div className="card-surface p-8 text-center">Loading careers...</div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell title="Careers">
        <div className="card-surface p-8 text-center text-red-600">{error}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={`Careers (${stats.total})`}>
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="card-surface p-4 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Total</p>
          <strong className="text-2xl">{stats.total}</strong>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Published</p>
          <strong className="text-2xl text-green-600">{stats.published}</strong>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Draft</p>
          <strong className="text-2xl text-yellow-600">{stats.draft}</strong>
        </div>
        <div className="card-surface p-4 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Featured</p>
          <strong className="text-2xl text-purple-600">{stats.featured}</strong>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select
          className="rounded-xl border px-4 py-2"
          style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="p-4 text-left font-semibold">Career</th>
              <th className="p-4 text-left font-semibold">Category</th>
              <th className="p-4 text-left font-semibold">Difficulty</th>
              <th className="p-4 text-left font-semibold">Demand</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCareers.map((career) => (
              <tr key={career.slug} className="border-b" style={{ borderColor: 'var(--border)' }}>
                <td className="p-4">
                  <div>
                    <Link href={`/careers/${career.slug}`} className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                      {career.title}
                    </Link>
                    {career.isFeatured && (
                      <span className="ml-2 rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700">Featured</span>
                    )}
                  </div>
                </td>
                <td className="p-4" style={{ color: 'var(--muted)' }}>{career.category}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    career.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    career.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {career.difficulty}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${career.demandScore}%` }} />
                    </div>
                    <span className="text-sm">{career.demandScore}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    career.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {career.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(career._id!, career.status || 'draft')}
                    className="rounded-lg border px-3 py-1 text-sm font-semibold transition hover:bg-gray-100"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {career.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCareers.length === 0 && (
          <div className="p-8 text-center" style={{ color: 'var(--muted)' }}>No careers found</div>
        )}
      </div>
    </DashboardShell>
  );
}

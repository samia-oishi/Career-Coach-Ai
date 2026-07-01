'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';
import type { Blog } from '@/lib/types';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const { getToken } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [getToken]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.get('/admin/blogs', { headers: { Authorization: `Bearer ${token}` } });
      setBlogs(response.data.data);
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (blogId: string, currentStatus: string) => {
    try {
      const token = await getToken();
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await api.patch(`/admin/blogs/${blogId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchBlogs();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'published').length,
    draft: blogs.filter((b) => b.status === 'draft').length,
  };

  if (loading) {
    return (
      <DashboardShell title="Blogs">
        <div className="card-surface p-8 text-center">Loading blogs...</div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell title="Blogs">
        <div className="card-surface p-8 text-center text-red-600">{error}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={`Blogs (${stats.total})`}>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="card-surface p-4 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Total Articles</p>
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
      </div>

      <div className="grid gap-6">
        {blogs.map((blog) => (
          <article key={blog.slug} className="card-surface p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="h-32 w-full rounded-xl bg-cover bg-center md:w-48" style={{ backgroundImage: `url(${blog.coverImageUrl})` }} />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/blog/${blog.slug}`} className="text-xl font-bold hover:underline" style={{ color: 'var(--primary)' }}>
                      {blog.title}
                    </Link>
                    <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                      {blog.category} · {blog.readTimeMinutes} min read
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {blog.status}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2" style={{ color: 'var(--muted)' }}>{blog.excerpt}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => toggleStatus(blog._id!, blog.status)}
                    className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link href={`/blog/${blog.slug}`} className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                    View →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="card-surface p-8 text-center" style={{ color: 'var(--muted)' }}>No blogs found</div>
      )}
    </DashboardShell>
  );
}

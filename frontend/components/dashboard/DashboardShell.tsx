'use client';

import Link from 'next/link';
import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { normalizeSelectableRole, roleStorageKey, type AppRole } from '@/features/auth/role-selection';

const userLinks = [
  ['Overview', '/dashboard'],
  ['Saved Careers', '/dashboard/saved-careers'],
  ['Recommendations', '/dashboard/recommendations'],
  ['Resume Summary', '/dashboard/resume-summary'],
  ['Profile', '/dashboard/profile'],
  ['Settings', '/dashboard/settings'],
];

const adminLinks = [
  ['Admin Overview', '/admin'],
  ['Users', '/admin/users'],
  ['Careers', '/admin/careers'],
  ['Blogs', '/admin/blogs'],
  ['Content Review', '/admin/content-review'],
  ['User Activity', '/admin/user-activity'],
  ['Reports', '/admin/reports'],
  ['Analytics', '/admin/analytics'],
  ['AI Usage', '/admin/ai-usage'],
  ['Settings', '/admin/settings'],
];

const normalizeAppRole = (role: unknown): AppRole => (role === 'admin' ? 'admin' : 'user');

export function DashboardShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [role, setRole] = useState<AppRole>('user');

  useEffect(() => {
    const loadRole = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      const token = await getToken();
      const safeRole = normalizeSelectableRole(window.localStorage.getItem(roleStorageKey));
      window.localStorage.setItem(roleStorageKey, safeRole);

      await api.post('/users/sync', {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName || 'Career',
        lastName: user.lastName || 'Explorer',
        avatarUrl: user.imageUrl,
        selectedRole: safeRole,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const response = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
      setRole(normalizeAppRole(response.data.data?.role));
    };

    loadRole().catch((error) => console.error('Role navigation load failed', error));
  }, [getToken, isLoaded, isSignedIn, user]);

  const links = [
    ...userLinks,
    ...(role === 'admin' ? adminLinks : []),
  ];

  return (
    <div className="min-h-screen md:grid md:grid-cols-[280px_1fr]">
      <aside className="border-r p-5" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <Link href="/" className="text-xl font-bold">CareerCoach Ai</Link>
        <nav className="mt-8 grid gap-2">
          {links.map(([label, href]) => <Link className="nav-hover rounded-2xl px-4 py-3 text-sm font-medium" key={href} href={href}>{label}</Link>)}
        </nav>
      </aside>
      <main>
        <header className="flex items-center justify-between border-b p-5" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <h1 className="text-2xl font-bold">{title}</h1>
          <UserButton />
        </header>
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}

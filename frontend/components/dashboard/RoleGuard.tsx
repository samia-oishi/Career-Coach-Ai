'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { normalizeSelectableRole, roleStorageKey, type AppRole } from '@/features/auth/role-selection';

const roleHome: Record<AppRole, string> = {
  user: '/dashboard',
  admin: '/admin',
};

const normalizeAppRole = (role: unknown): AppRole => (role === 'admin' ? 'admin' : 'user');

export function RoleGuard({ allowedRoles, children }: { allowedRoles: AppRole[]; children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const [role, setRole] = useState<AppRole>('user');

  useEffect(() => {
    const checkRole = async () => {
      if (!isLoaded) return;
      if (!isSignedIn || !user) {
        router.replace(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
        return;
      }

      const token = await getToken();
      const safeRole = normalizeSelectableRole(window.localStorage.getItem(roleStorageKey));
      window.localStorage.setItem(roleStorageKey, safeRole);

      try {
        await api.post('/users/sync', {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName || 'Career',
          lastName: user.lastName || 'Explorer',
          avatarUrl: user.imageUrl,
          selectedRole: safeRole,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const response = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
        const actualRole = normalizeAppRole(response.data.data?.role);
        setRole(actualRole);
        setStatus(allowedRoles.includes(actualRole) ? 'allowed' : 'denied');
      } catch (error) {
        console.error('Role check failed', error);
        setStatus('denied');
      }
    };

    void checkRole();
  }, [allowedRoles, getToken, isLoaded, isSignedIn, pathname, router, user]);

  if (status === 'checking') {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <section className="card-surface p-8 text-center">
          <h1 className="text-2xl font-bold">Checking access…</h1>
          <p className="mt-3" style={{ color: 'var(--muted)' }}>CareerCoach Ai is verifying your dashboard permissions.</p>
        </section>
      </main>
    );
  }

  if (status === 'denied') {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <section className="card-surface max-w-lg p-8 text-center">
          <h1 className="text-3xl font-bold">Access denied</h1>
          <p className="mt-3" style={{ color: 'var(--muted)' }}>
            Your current role is <strong>{role}</strong>. This page requires {allowedRoles.join(' or ')} access.
          </p>
          <Link href={roleHome[role] || '/dashboard'} className="btn-primary mt-6 inline-block rounded-2xl px-5 py-3 font-semibold">
            Go to my dashboard
          </Link>
        </section>
      </main>
    );
  }

  return children;
}

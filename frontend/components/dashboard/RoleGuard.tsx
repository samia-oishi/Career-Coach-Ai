'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { normalizeSelectableRole, roleStorageKey, type AppRole } from '@/features/auth/role-selection';

const roleHome: Record<AppRole, string> = {
  user: '/dashboard',
  admin: '/admin',
};

const normalizeAppRole = (role: unknown): AppRole => (role === 'admin' ? 'admin' : 'user');

// Retry logic for transient failures
const fetchWithRetry = async <T,>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(fn, retries - 1, delay * 1.5);
  }
};

export function RoleGuard({ allowedRoles, children }: { allowedRoles: AppRole[]; children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking');
  const [role, setRole] = useState<AppRole>('user');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isSyncing = useRef(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!isLoaded) return;
      
      if (!isSignedIn || !user) {
        router.replace(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
        return;
      }

      // Prevent double sync
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        const token = await getToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        const safeRole = normalizeSelectableRole(window.localStorage.getItem(roleStorageKey));
        window.localStorage.setItem(roleStorageKey, safeRole);

        // Sync user with retry
        await fetchWithRetry(async () => {
          return api.post('/users/sync', {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName || 'Career',
            lastName: user.lastName || 'Explorer',
            avatarUrl: user.imageUrl,
            selectedRole: safeRole,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        });

        // Get user role with retry
        const response = await fetchWithRetry(async () => {
          return api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
        });

        const actualRole = normalizeAppRole(response.data.data?.role);
        setRole(actualRole);
        
        if (allowedRoles.includes(actualRole)) {
          setStatus('allowed');
        } else {
          setStatus('denied');
        }
      } catch (error: unknown) {
        console.error('Role check failed', error);
        
        // Check if it's a network error or auth error
        const err = error as { response?: { status?: number }; message?: string };
        if (err.response?.status === 401) {
          setStatus('denied');
          setErrorMessage('Your session has expired. Please sign in again.');
        } else if (err.response?.status === 403) {
          setStatus('denied');
          setErrorMessage('You do not have permission to access this page.');
        } else if (!err.response && err.message?.includes('Network')) {
          setStatus('error');
          setErrorMessage('Network error. Please check your connection and try again.');
        } else {
          setStatus('error');
          setErrorMessage('Something went wrong. Please try again.');
        }
      } finally {
        isSyncing.current = false;
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

  if (status === 'error') {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <section className="card-surface max-w-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600">Error</h1>
          <p className="mt-3" style={{ color: 'var(--muted)' }}>{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary mt-6 inline-block rounded-2xl px-5 py-3 font-semibold"
          >
            Try Again
          </button>
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
            {errorMessage || `Your current role is ${role}. This page requires ${allowedRoles.join(' or ')} access.`}
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

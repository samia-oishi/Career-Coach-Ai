'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { getRedirectForRole, normalizeSelectableRole, roleStorageKey, type AppRole } from './role-selection';

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

export function UserSync() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const syncedForUser = useRef<string | null>(null);
  const isSyncing = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user || syncedForUser.current === user.id || isSyncing.current) return;

      isSyncing.current = true;

      try {
        const token = await getToken();
        if (!token) {
          console.warn('No token available for user sync');
          return;
        }

        const safeRole = normalizeSelectableRole(window.localStorage.getItem(roleStorageKey));
        window.localStorage.setItem(roleStorageKey, safeRole);

        const response = await fetchWithRetry(async () => {
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

        syncedForUser.current = user.id;
        const actualRole = response.data.data?.role as AppRole | undefined;
        const target = getRedirectForRole(actualRole || safeRole);
        const path = window.location.pathname;

        if ((path === '/dashboard' || path === '/admin') && path !== target) {
          window.location.replace(target);
        }
      } catch (error: unknown) {
        console.error('User sync failed', error);
        // Don't throw - let the app continue, RoleGuard will handle retries
      } finally {
        isSyncing.current = false;
      }
    };

    void syncUser();
  }, [getToken, isLoaded, isSignedIn, user]);

  return null;
}

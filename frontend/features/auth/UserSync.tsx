'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { getRedirectForRole, normalizeSelectableRole, roleStorageKey, type AppRole } from './role-selection';

export function UserSync() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const syncedForUser = useRef<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user || syncedForUser.current === user.id) return;

      const token = await getToken();
      const safeRole = normalizeSelectableRole(window.localStorage.getItem(roleStorageKey));
      window.localStorage.setItem(roleStorageKey, safeRole);

      const response = await api.post('/users/sync', {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName || 'Career',
        lastName: user.lastName || 'Explorer',
        avatarUrl: user.imageUrl,
        selectedRole: safeRole,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      syncedForUser.current = user.id;
      const actualRole = response.data.data?.role as AppRole | undefined;
      const target = getRedirectForRole(actualRole || safeRole);
      const path = window.location.pathname;

      if ((path === '/dashboard' || path === '/admin') && path !== target) {
        window.location.replace(target);
      }
    };

    syncUser().catch((error) => {
      console.error('User sync failed', error);
    });
  }, [getToken, isLoaded, isSignedIn, user]);

  return null;
}

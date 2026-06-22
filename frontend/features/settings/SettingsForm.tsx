'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useTheme } from '@/features/theme/ThemeProvider';

type Theme = 'light' | 'dark' | 'system';

export function SettingsForm() {
  const { getToken } = useAuth();
  const { setTheme, theme } = useTheme();

  const saveTheme = useMutation({
    mutationFn: async (nextTheme: Theme) => {
      setTheme(nextTheme);
      const token = await getToken();
      await api.patch('/users/me/settings', { theme: nextTheme }, { headers: { Authorization: `Bearer ${token}` } });
    },
  });

  return (
    <section className="card-surface max-w-2xl p-6">
      <h2 className="text-2xl font-bold">Appearance</h2>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Choose a warm light or dark theme for CareerCoach Ai.</p>
      <label className="mt-6 grid gap-2 font-semibold">
        Theme
        <select
          className="rounded-2xl border px-4 py-3 font-normal"
          style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          value={theme}
          onChange={(event) => saveTheme.mutate(event.target.value as Theme)}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      {saveTheme.isSuccess ? <p className="mt-4 text-sm" style={{ color: 'var(--secondary)' }}>Theme saved.</p> : null}
      {saveTheme.isError ? <p className="mt-4 text-sm text-red-600">Theme preference could not be saved.</p> : null}
    </section>
  );
}

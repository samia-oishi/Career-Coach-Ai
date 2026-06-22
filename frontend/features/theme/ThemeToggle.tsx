'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      className="btn-light focus-ring rounded-xl px-3 py-2 text-sm font-bold"
      onClick={() => setTheme(nextTheme)}
      title={`Theme: ${theme}`}
      type="button"
    >
      {compact ? (resolvedTheme === 'dark' ? '☀️' : '🌙') : resolvedTheme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { normalizeSelectableRole, roleOptions, roleStorageKey, type SelectableRole } from './role-selection';

export function RoleSelectionCard() {
  const [selectedRole, setSelectedRole] = useState<SelectableRole>('user');

  useEffect(() => {
    const normalized = normalizeSelectableRole(window.localStorage.getItem(roleStorageKey));
    setSelectedRole(normalized);
    window.localStorage.setItem(roleStorageKey, normalized);
  }, []);

  const chooseRole = (role: SelectableRole) => {
    setSelectedRole(role);
    window.localStorage.setItem(roleStorageKey, role);
  };

  return (
    <section className="card-surface max-w-md p-4">
      <h2 className="text-lg font-bold">Continue as a User</h2>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        Regular accounts can save careers, generate AI summaries, and receive career recommendations. Admin access is assigned separately.
      </p>
      <div className="mt-4 grid gap-3">
        {roleOptions.map((option) => (
          <button
            className="rounded-2xl border p-4 text-left transition hover:-translate-y-0.5"
            key={option.value}
            onClick={() => chooseRole(option.value)}
            style={{
              borderColor: selectedRole === option.value ? 'var(--primary)' : 'var(--border)',
              background: selectedRole === option.value ? 'rgba(37, 99, 235, 0.08)' : 'var(--background)',
            }}
            type="button"
          >
            <span className="font-semibold">{option.label}</span>
            <span className="mt-1 block text-sm" style={{ color: 'var(--muted)' }}>{option.description}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
        Admin accounts are limited to the configured first admin email or users promoted from the admin dashboard.
      </p>
    </section>
  );
}

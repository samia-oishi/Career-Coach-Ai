export type SelectableRole = 'user' | 'admin';
export type AppRole = SelectableRole | 'admin';

export const roleOptions: Array<{ value: SelectableRole; label: string; description: string; redirect: string }> = [
  {
    value: 'user',
    label: 'User',
    description: 'Save careers, generate AI summaries, and track your career journey.',
    redirect: '/dashboard',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Manage careers, users, analytics and platform settings.',
    redirect: '/admin',
  },
];

export const roleStorageKey = 'careercoach:selected-role';

export const getRedirectForRole = (role: AppRole | string | undefined) => {
  if (role === 'admin') return '/admin';
  return '/dashboard';
};

export const normalizeSelectableRole = (
  role: string | null | undefined
): SelectableRole => {
  return role === 'admin' ? 'admin' : 'user';
};

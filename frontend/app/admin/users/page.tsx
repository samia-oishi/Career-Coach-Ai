'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';
import type { AppUser } from '@/lib/types';

export default function AdminUsersPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [getToken]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      setUpdating(userId);
      const token = await getToken();
      await api.patch(`/admin/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <DashboardShell title="Users">
        <div className="card-surface p-8 text-center">Loading users...</div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell title="Users">
        <div className="card-surface p-8 text-center text-red-600">{error}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={`Users (${users.length})`}>
      <div className="card-surface overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="p-4 text-left font-semibold">User</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Experience</th>
              <th className="p-4 text-left font-semibold">Joined</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl && (
                      <img src={user.avatarUrl} alt="" className="h-10 w-10 rounded-full" />
                    )}
                    <span className="font-semibold">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="p-4" style={{ color: 'var(--muted)' }}>{user.email}</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 capitalize" style={{ color: 'var(--muted)' }}>{user.experienceLevel}</td>
                <td className="p-4" style={{ color: 'var(--muted)' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4">
                  <select
                    className="rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
                    value={user.role}
                    onChange={(e) => updateRole(user._id!, e.target.value as 'user' | 'admin')}
                    disabled={updating === user._id}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center" style={{ color: 'var(--muted)' }}>No users found</div>
        )}
      </div>
    </DashboardShell>
  );
}

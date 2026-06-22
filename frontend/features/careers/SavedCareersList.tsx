'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { SavedCareer } from '@/lib/types';
import { formatSalary } from '@/lib/utils';

const statuses = ['saved', 'researching', 'learning', 'pursuing', 'completed'] as const;

export function SavedCareersList() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const savedCareers = useQuery({
    queryKey: ['saved-careers'],
    queryFn: async () => {
      const token = await getToken();
      const response = await api.get('/saved-careers', { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data as SavedCareer[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = await getToken();
      await api.patch(`/saved-careers/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-careers'] }),
  });

  const removeCareer = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      await api.delete(`/saved-careers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-careers'] }),
  });

  if (savedCareers.isLoading) {
    return <section className="card-surface p-8">Loading saved careers...</section>;
  }

  if (savedCareers.isError) {
    return <section className="card-surface p-8 text-red-600">Saved careers could not be loaded. Refresh after signing in.</section>;
  }

  if (!savedCareers.data?.length) {
    return (
      <section className="card-surface p-8 text-center">
        <h2 className="text-2xl font-bold">No saved careers yet</h2>
        <p className="mt-3" style={{ color: 'var(--muted)' }}>Explore career paths and save the ones you want to compare or pursue.</p>
        <Link href="/careers" className="btn-primary mt-6 inline-block rounded-2xl px-5 py-3 font-semibold">Explore careers</Link>
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      {savedCareers.data.map((item) => (
        <article className="card-surface grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center" key={item._id}>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>{item.career.category}</p>
            <Link href={`/careers/${item.career.slug}`} className="mt-1 block text-2xl font-black">{item.career.title}</Link>
            <p className="mt-2 max-w-3xl text-sm leading-6" style={{ color: 'var(--muted)' }}>{item.career.description}</p>
            <p className="mt-3 text-sm"><strong>{formatSalary(item.career.averageSalaryMin, item.career.averageSalaryMax)}</strong> · {item.career.demandScore}/100 demand</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:w-56 md:grid-cols-1">
            <select
              className="rounded-2xl border px-4 py-3"
              style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
              value={item.status}
              onChange={(event) => updateStatus.mutate({ id: item._id, status: event.target.value })}
            >
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button className="btn-light rounded-2xl px-4 py-3 font-semibold" onClick={() => removeCareer.mutate(item._id)} type="button">Remove</button>
          </div>
        </article>
      ))}
    </div>
  );
}

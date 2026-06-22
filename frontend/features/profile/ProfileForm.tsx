'use client';

import { useUser, UserProfile, useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import type { AppUser } from '@/lib/types';

type ProfileValues = {
  firstName: string;
  lastName: string;
  bio: string;
  careerGoal: string;
  location: string;
  skills: string;
  interests: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
};

const splitList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

export function ProfileForm() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const form = useForm<ProfileValues>({ defaultValues: { firstName: '', lastName: '', bio: '', careerGoal: '', location: '', skills: '', interests: '', experienceLevel: 'beginner' } });

  const profile = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getToken();
      const response = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data as AppUser;
    },
  });

  useEffect(() => {
    if (!profile.data) return;
    form.reset({
      firstName: profile.data.firstName || '',
      lastName: profile.data.lastName || '',
      bio: profile.data.bio || '',
      careerGoal: profile.data.careerGoal || '',
      location: profile.data.location || '',
      skills: profile.data.skills?.join(', ') || '',
      interests: profile.data.interests?.join(', ') || '',
      experienceLevel: profile.data.experienceLevel || 'beginner',
    });
  }, [form, profile.data]);

  const saveProfile = useMutation({
    mutationFn: async (values: ProfileValues) => {
      const token = await getToken();
      await user?.update({ firstName: values.firstName, lastName: values.lastName });
      const response = await api.patch('/users/me', {
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio,
        careerGoal: values.careerGoal,
        location: values.location,
        skills: splitList(values.skills),
        interests: splitList(values.interests),
        experienceLevel: values.experienceLevel,
      }, { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data as AppUser;
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
      <form className="card-surface grid gap-4 p-6" onSubmit={form.handleSubmit((values) => saveProfile.mutate(values))}>
        <h2 className="text-2xl font-bold">Career profile</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 font-semibold">First name<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} {...form.register('firstName')} /></label>
          <label className="grid gap-2 font-semibold">Last name<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} {...form.register('lastName')} /></label>
        </div>
        <label className="grid gap-2 font-semibold">Bio<textarea className="min-h-28 rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} {...form.register('bio')} /></label>
        <label className="grid gap-2 font-semibold">Career goal<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Become a full-stack developer" {...form.register('careerGoal')} /></label>
        <label className="grid gap-2 font-semibold">Location<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Dhaka, Remote, or New York" {...form.register('location')} /></label>
        <label className="grid gap-2 font-semibold">Skills<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="React, Node.js, MongoDB" {...form.register('skills')} /></label>
        <label className="grid gap-2 font-semibold">Interests<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="SaaS products, AI tools, web apps" {...form.register('interests')} /></label>
        <label className="grid gap-2 font-semibold">Experience level<select className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} {...form.register('experienceLevel')}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
        <button type="submit" className="btn-primary rounded-2xl px-5 py-3 font-semibold disabled:opacity-60" disabled={saveProfile.isPending}>{saveProfile.isPending ? 'Saving...' : 'Save profile'}</button>
        {saveProfile.isSuccess ? <p className="text-sm" style={{ color: 'var(--secondary)' }}>Profile updated.</p> : null}
        {saveProfile.isError ? <p className="text-sm text-red-600">Profile could not be updated.</p> : null}
      </form>
      <section className="card-surface overflow-hidden p-4">
        <h2 className="mb-4 px-2 text-2xl font-bold">Account, email, password & avatar</h2>
        <p className="mb-4 px-2 text-sm" style={{ color: 'var(--muted)' }}>Use Clerk account management for secure email, password, and avatar updates.</p>
        <UserProfile routing="hash" />
      </section>
    </div>
  );
}

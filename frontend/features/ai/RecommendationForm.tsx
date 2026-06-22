'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/lib/api';

const commaList = (label: string, minItems: number) => z.string().refine(
  (value) => value.split(',').map((item) => item.trim()).filter(Boolean).length >= minItems,
  `Add at least ${minItems} ${label}, separated by commas.`
);

const schema = z.object({
  skills: commaList('skills', 2),
  interests: commaList('interest', 1),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

type FormValues = z.infer<typeof schema>;
type Recommendation = { slug: string; title: string; matchScore: number; explanation: string; skillsToImprove: string[]; nextSteps: string[] };

const splitList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

export function RecommendationForm() {
  const { getToken } = useAuth();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { skills: '', interests: '', experienceLevel: 'beginner' } });
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      const response = await api.post('/ai/career-recommendations', {
        skills: splitList(values.skills),
        interests: splitList(values.interests),
        experienceLevel: values.experienceLevel,
      }, { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data.recommendations as Recommendation[];
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form className="card-surface grid gap-4 p-6" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <label className="grid gap-2 font-semibold">Skills<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="SQL, Python, storytelling" {...form.register('skills')} /></label>
        {form.formState.errors.skills ? <p className="text-sm text-red-600">{form.formState.errors.skills.message}</p> : null}
        <label className="grid gap-2 font-semibold">Interests<input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Data, dashboards, business decisions" {...form.register('interests')} /></label>
        {form.formState.errors.interests ? <p className="text-sm text-red-600">{form.formState.errors.interests.message}</p> : null}
        <label className="grid gap-2 font-semibold">Experience level<select className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} {...form.register('experienceLevel')}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
        <button className="btn-primary rounded-2xl px-5 py-3 font-semibold disabled:opacity-60" disabled={mutation.isPending}>{mutation.isPending ? 'Finding matches...' : 'Get recommendations'}</button>
        {mutation.isError ? <p className="text-sm text-red-600">Career recommendations could not be generated. Make sure you are signed in and try again.</p> : null}
      </form>
      <section className="grid gap-4">
        {mutation.data?.map((item) => (
          <article key={item.slug} className="card-surface p-5">
            <div className="flex items-center justify-between gap-4">
              <Link href={`/careers/${item.slug}`} className="text-xl font-bold">{item.title}</Link>
              <span className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: 'var(--secondary)' }}>{item.matchScore}%</span>
            </div>
            <p className="mt-3" style={{ color: 'var(--muted)' }}>{item.explanation}</p>
            <p className="mt-3 text-sm"><strong>Improve:</strong> {item.skillsToImprove?.join(', ') || 'Keep strengthening your portfolio.'}</p>
            {item.nextSteps?.length ? <ul className="mt-3 grid gap-1 text-sm" style={{ color: 'var(--muted)' }}>{item.nextSteps.map((step) => <li key={step}>• {step}</li>)}</ul> : null}
          </article>
        ))}
        {!mutation.data ? <div className="card-surface p-6"><h2 className="text-2xl font-bold">Your recommendations</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>Career matches and explanations will appear here after you submit your skills and interests.</p></div> : null}
      </section>
    </div>
  );
}

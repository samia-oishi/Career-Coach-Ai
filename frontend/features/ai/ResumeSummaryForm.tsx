'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { api } from '@/lib/api';

const schema = z.object({
  skills: z.string().min(5, 'Add at least three comma-separated skills.'),
  experience: z.string().min(20, 'Upload a text resume or describe your experience in more detail.'),
  careerGoal: z.string().min(10, 'Describe your target role or goal.'),
});

type FormValues = z.infer<typeof schema>;

type Result = { headline: string; summary: string; keyStrengths: string[]; improvementTips: string[] };

const readableResumeTypes = ['text/plain', 'text/markdown', 'text/csv', 'application/json'];

export function ResumeSummaryForm() {
  const { getToken } = useAuth();
  const [fileMessage, setFileMessage] = useState('Upload a .txt, .md, .csv, or exported plain-text resume. PDF/DOCX text extraction needs a parser and is not enabled in this no-extra-stack version.');
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { skills: '', experience: '', careerGoal: '' } });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      const response = await api.post('/ai/resume-summary', {
        ...values,
        skills: values.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      }, { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data as Result;
    },
  });

  const handleResumeUpload = async (file?: File) => {
    if (!file) return;

    const isReadable = readableResumeTypes.includes(file.type) || /\.(txt|md|csv|json)$/i.test(file.name);
    if (!isReadable) {
      setFileMessage('This file type cannot be read safely without adding a resume parser. Please export/copy your resume as .txt for now.');
      return;
    }

    const text = await file.text();
    const normalized = text.replace(/\s+/g, ' ').trim();

    if (normalized.length < 20) {
      setFileMessage('The uploaded file did not contain enough readable resume text.');
      return;
    }

    form.setValue('experience', normalized.slice(0, 6000), { shouldValidate: true, shouldDirty: true });
    setFileMessage(`Loaded ${file.name}. The resume text is now ready for AI analysis.`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <form className="card-surface grid gap-4 p-6" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <label className="grid gap-2 font-semibold">
          Skills
          <input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="React, TypeScript, API Design" {...form.register('skills')} />
        </label>

        <label className="grid gap-2 font-semibold">
          Upload resume
          <input
            accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
            className="rounded-2xl border px-4 py-3 font-normal"
            style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
            onChange={(event) => void handleResumeUpload(event.target.files?.[0])}
            type="file"
          />
          <span className="text-xs font-normal" style={{ color: 'var(--muted)' }}>{fileMessage}</span>
        </label>

        <label className="grid gap-2 font-semibold">
          Resume text / experience
          <textarea className="min-h-32 rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Upload a plain-text resume above, or paste the resume/experience text here." {...form.register('experience')} />
        </label>

        <label className="grid gap-2 font-semibold">
          Career goal
          <input className="rounded-2xl border px-4 py-3 font-normal" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Full-stack developer role at a SaaS company" {...form.register('careerGoal')} />
        </label>

        {Object.values(form.formState.errors).map((error) => <p className="text-sm text-red-500" key={error.message}>{error.message}</p>)}
        <button className="btn-primary rounded-2xl px-5 py-3 font-semibold disabled:opacity-60" disabled={mutation.isPending}>{mutation.isPending ? 'Generating...' : 'Generate summary'}</button>
      </form>
      <section className="card-surface p-6">
        <h2 className="text-2xl font-bold">Generated summary</h2>
        {mutation.isError ? <p className="mt-4 text-red-500">The AI service could not complete the request. Try again or check backend logs.</p> : null}
        {mutation.data ? <div className="mt-5 space-y-4"><h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{mutation.data.headline}</h3><p className="leading-7" style={{ color: 'var(--muted)' }}>{mutation.data.summary}</p><div><h4 className="font-semibold">Key strengths</h4><ul className="mt-2 grid gap-1">{mutation.data.keyStrengths.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><h4 className="font-semibold">Improvement tips</h4><ul className="mt-2 grid gap-1">{mutation.data.improvementTips.map((item) => <li key={item}>• {item}</li>)}</ul></div></div> : <p className="mt-4" style={{ color: 'var(--muted)' }}>Your truthful, professional resume summary will appear here.</p>}
      </section>
    </div>
  );
}

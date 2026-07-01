'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function ReviewForm({ careerId }: { careerId: string }) {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await api.post('/reviews', {
        careerId,
        rating,
        title,
        comment,
        pros: pros.split(',').map((p) => p.trim()).filter(Boolean),
        cons: cons.split(',').map((c) => c.trim()).filter(Boolean),
      }, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', careerId] });
      setTitle('');
      setComment('');
      setPros('');
      setCons('');
      setRating(5);
    },
  });

  if (!isSignedIn) {
    return (
      <div className="card-surface p-6 text-center">
        <p style={{ color: 'var(--muted)' }}>Sign in to leave a review</p>
        <a href="/sign-in" className="btn-primary mt-4 inline-block rounded-xl px-5 py-2 font-semibold">Sign In</a>
      </div>
    );
  }

  return (
    <form className="card-surface p-6" onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
      <h3 className="text-xl font-bold">Write a Review</h3>
      
      <div className="mt-4">
        <label className="mb-2 block font-semibold">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl transition hover:scale-110"
            >
              <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full rounded-xl border px-4 py-3"
          style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          required
          minLength={4}
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-semibold">Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this career path..."
          className="w-full min-h-32 rounded-xl border px-4 py-3"
          style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          required
          minLength={20}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold">Pros (comma-separated)</label>
          <input
            type="text"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="Good work-life balance, high demand..."
            className="w-full rounded-xl border px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          />
        </div>
        <div>
          <label className="mb-2 block font-semibold">Cons (comma-separated)</label>
          <input
            type="text"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="Steep learning curve, on-call duties..."
            className="w-full rounded-xl border px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          />
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-4 text-sm text-red-600">Failed to submit review. Please try again.</p>
      )}

      {mutation.isSuccess && (
        <p className="mt-4 text-sm text-green-600">Review submitted for approval!</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn-primary mt-6 w-full rounded-xl px-5 py-3 font-bold disabled:opacity-60"
      >
        {mutation.isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

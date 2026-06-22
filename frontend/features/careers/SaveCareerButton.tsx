'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function SaveCareerButton({ careerId }: { careerId?: string }) {
  const { getToken, isSignedIn } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!careerId) throw new Error('Career ID is unavailable. Start the backend and refresh career data.');
      const token = await getToken();
      await api.post('/saved-careers', { careerId }, { headers: { Authorization: `Bearer ${token}` } });
    },
  });

  if (!isSignedIn) {
    return <a href="/sign-in" className="btn-primary block rounded-2xl px-5 py-3 text-center font-bold">Sign in to save</a>;
  }

  return (
    <button
      className="btn-primary w-full rounded-2xl px-5 py-3 font-bold disabled:opacity-60"
      disabled={mutation.isPending || !careerId}
      onClick={() => mutation.mutate()}
      type="button"
    >
      {mutation.isPending ? 'Saving...' : mutation.isSuccess ? 'Saved' : 'Save career'}
    </button>
  );
}

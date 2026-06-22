'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="card-surface max-w-lg p-8 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3" style={{ color: 'var(--muted)' }}>CareerCoach Ai could not load this view. Please try again.</p>
        <button className="btn-primary mt-6 rounded-2xl px-5 py-3 font-semibold" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}

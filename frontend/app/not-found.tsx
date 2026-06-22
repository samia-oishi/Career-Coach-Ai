import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="card-surface max-w-lg p-8 text-center">
        <h1 className="text-4xl font-black">Page not found</h1>
        <p className="mt-3" style={{ color: 'var(--muted)' }}>The page you requested does not exist or has moved.</p>
        <Link href="/" className="btn-primary mt-6 inline-block rounded-2xl px-5 py-3 font-semibold">Return home</Link>
      </section>
    </main>
  );
}

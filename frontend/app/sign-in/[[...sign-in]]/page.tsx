import { SignIn } from '@clerk/nextjs';
import { RoleSelectionCard } from '@/features/auth/RoleSelectionCard';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
        <div className="grid gap-6">
          <Link href="/" className="text-center text-2xl font-bold lg:text-left">CareerCoach Ai</Link>
          <RoleSelectionCard />
        </div>
        <SignIn />
        <div className="card-surface max-w-md p-4 text-sm" style={{ color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--foreground)' }}>Demo login:</strong> use the demo account email and password listed in the README after you create Clerk demo users.
        </div>
      </div>
    </main>
  );
}

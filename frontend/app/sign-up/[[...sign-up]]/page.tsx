import { SignUp } from '@clerk/nextjs';
import { RoleSelectionCard } from '@/features/auth/RoleSelectionCard';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
        <div className="grid gap-6">
          <Link href="/" className="text-center text-2xl font-bold lg:text-left">CareerCoach Ai</Link>
          <RoleSelectionCard />
        </div>
        <SignUp />
      </div>
    </main>
  );
}

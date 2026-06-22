'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

const publicLinks = [
  ['Home', '/'],
  ['Careers', '/careers'],
  ['Blog', '/blog'],
  ['About', '/about'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
];

const dashboardLinks = [
  ['Dashboard', '/dashboard'],
  ['Saved Careers', '/dashboard/saved-careers'],
  ['Recommendations', '/dashboard/recommendations'],
  ['Resume Summary', '/dashboard/resume-summary'],
  ['Profile', '/dashboard/profile'],
  ['Settings', '/dashboard/settings'],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <nav className="container-page flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-xl font-black tracking-[-0.02em]">
          <span className="grid h-10 w-10 place-items-center rounded-2xl text-white" style={{ background: 'var(--primary)' }}>CC</span>
          <span>CareerCoach Ai</span>
        </Link>

        <button className="focus-ring btn-light rounded-xl px-3 py-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          Menu
        </button>

        <div className={`${open ? 'flex' : 'hidden'} absolute left-4 right-4 top-16 flex-col gap-3 rounded-3xl border p-4 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`} style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          {publicLinks.map(([label, href]) => (
            <Link key={href} href={href} className="focus-ring nav-hover rounded-xl px-3 py-2 text-sm font-semibold">
              {label}
            </Link>
          ))}
          <ThemeToggle compact />
          {!isSignedIn ? (
            <Link href="/sign-in" className="focus-ring btn-primary rounded-xl px-4 py-2 text-sm font-bold">
              Sign In
            </Link>
          ) : (
            <>
              <UserButton />
              <details className="relative">
                <summary className="focus-ring nav-hover grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl" aria-label="Open dashboard menu">
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 grid w-56 gap-1 rounded-2xl border p-2 shadow-lg" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  {dashboardLinks.map(([label, href]) => <Link className="nav-hover rounded-xl px-3 py-2 text-sm" key={href} href={href}>{label}</Link>)}
                </div>
              </details>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { MotionReveal } from './MotionReveal';

export function HeroSection() {
  return (
    <section className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[0.95fr_1.05fr]">
      <MotionReveal>
        <div>
          <p className="section-eyebrow">AI career guidance</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.05em] md:text-7xl">
            Choose your next tech career with clearer guidance.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 md:text-xl" style={{ color: 'var(--muted)' }}>
            Explore realistic technology roles, compare skills and salary ranges, then use AI tools to turn your experience into practical next steps.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/careers" className="btn-primary focus-ring rounded-2xl px-6 py-4 text-center font-bold">
              Explore careers
            </Link>
            <Link href="/dashboard/resume-summary" className="btn-light focus-ring rounded-2xl px-6 py-4 text-center font-bold">
              Try Resume AI
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold" style={{ color: 'var(--muted)' }}>
            <span>35+ career paths</span>
            <span aria-hidden="true">·</span>
            <span>8 career guides</span>
            <span aria-hidden="true">·</span>
            <span>2 AI tools</span>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <div className="grid gap-4 sm:grid-cols-[1fr_0.68fr]">
          <div className="relative min-h-[470px] overflow-hidden rounded-[2rem] border shadow-xl" style={{ borderColor: 'var(--border)' }}>
            <Image
              alt="Professional workspace with laptop for planning a technology career"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
            />
          </div>
          <div className="grid gap-4">
            <div className="relative min-h-[225px] overflow-hidden rounded-[1.5rem] border shadow-md" style={{ borderColor: 'var(--border)' }}>
              <Image
                alt="Career planning notes and laptop on a desk"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 24vw, 100vw"
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85"
              />
            </div>
            <div className="rounded-[1.5rem] border p-5 shadow-md" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>Recommended next step</p>
              <h2 className="mt-2 text-2xl font-black">AI Product Engineer</h2>
              <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted)' }}>A strong fit for builders who enjoy TypeScript, APIs, AI tools, and product thinking.</p>
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

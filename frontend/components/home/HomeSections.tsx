import Image from 'next/image';
import Link from 'next/link';
import { CareerCard } from '@/components/cards/CareerCard';
import type { Blog, Career } from '@/lib/types';
import { testimonials } from '@/lib/data';
import { MotionReveal } from './MotionReveal';

type FAQ = { question: string; answer: string };

const steps = [
  ['01', 'Explore roles', 'Browse curated technology paths with salary ranges, skills, difficulty, and demand signals.'],
  ['02', 'Compare your fit', 'Use your skills, interests, and experience level to understand which paths make sense now.'],
  ['03', 'Take the next step', 'Generate a resume summary, review recommendations, and save the careers you want to pursue.'],
];

export function FeaturedCareersSection({ careers }: { careers: Career[] }) {
  return (
    <section className="container-page py-16 md:py-20">
      <MotionReveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="section-eyebrow">Featured careers</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.04em] md:text-5xl">Explore exciting careers where you just fit in!</h2>
        </div>
        <Link href="/careers" className="btn-light focus-ring w-fit rounded-2xl px-5 py-3 font-bold">View all careers</Link>
      </MotionReveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {careers.slice(0, 4).map((career, index) => (
          <MotionReveal className="h-full" delay={index * 0.04} key={career.slug}>
            <div className="h-full">
              <CareerCard career={career} />
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <MotionReveal>
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border shadow-lg" style={{ borderColor: 'var(--border)' }}>
          <Image
            alt="Professional reviewing career notes and technology learning plan"
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85"
          />
        </div>
      </MotionReveal>
      <MotionReveal delay={0.06}>
        <div>
          <p className="section-eyebrow">How it works</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">A simpler way to choose what to learn next.</h2>
          <p className="mt-5 text-lg leading-8" style={{ color: 'var(--muted)' }}>CareerCoach Ai keeps the process practical: look at real roles, understand the gap, then use AI to turn your current experience into a clearer plan.</p>
          <div className="mt-8 grid gap-5">
            {steps.map(([number, title, description]) => (
              <div className="grid gap-4 rounded-3xl border p-5 md:grid-cols-[64px_1fr]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }} key={title}>
                <span className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{number}</span>
                <div><h3 className="text-xl font-black">{title}</h3><p className="mt-2 leading-7" style={{ color: 'var(--muted)' }}>{description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

export function LatestArticlesSection({ blogs }: { blogs: Blog[] }) {
  return (
    <section className="container-page py-16 md:py-20">
      <MotionReveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="section-eyebrow">Career guides</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.04em] md:text-5xl">Short reads for sharper decisions.</h2>
        </div>
        <Link href="/blog" className="btn-light focus-ring w-fit rounded-2xl px-5 py-3 font-bold">Read the blog</Link>
      </MotionReveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {blogs.slice(0, 2).map((blog, index) => (
          <MotionReveal delay={index * 0.05} key={blog.slug}>
            <Link href={`/blog/${blog.slug}`} className="premium-card group block h-full overflow-hidden rounded-[2rem]">
              <div className="relative h-64 overflow-hidden">
                <Image alt={blog.title} className="object-cover transition duration-500 group-hover:scale-[1.02]" fill sizes="(min-width: 768px) 50vw, 100vw" src={blog.coverImageUrl} />
              </div>
              <div className="p-6">
                <p className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>{blog.category}</p>
                <h3 className="mt-2 text-2xl font-black">{blog.title}</h3>
                <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>{blog.excerpt}</p>
              </div>
            </Link>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="container-page py-16 md:py-20">
      <MotionReveal className="max-w-3xl">
        <p className="section-eyebrow">FAQ</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">Questions before you start?</h2>
      </MotionReveal>
      <div className="mt-10 grid gap-4">
        {faqs.map((faq) => (
          <details className="rounded-3xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }} key={faq.question}>
            <summary className="cursor-pointer text-lg font-black">{faq.question}</summary>
            <p className="mt-4 leading-7" style={{ color: 'var(--muted)' }}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="container-page pb-20 pt-10">
      <MotionReveal>
        <div className="grid overflow-hidden rounded-[2rem] border md:grid-cols-[1fr_0.75fr]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-8 md:p-12">
            <p className="section-eyebrow">Start today</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.04em] md:text-5xl">Turn career research into a plan you can follow.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8" style={{ color: 'var(--muted)' }}>Explore roles first, then use AI tools to shape your resume summary and career recommendations.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/careers" className="btn-primary focus-ring rounded-2xl px-6 py-4 text-center font-bold">Explore careers</Link>
              <Link href="/dashboard/recommendations" className="btn-light focus-ring rounded-2xl px-6 py-4 text-center font-bold">Get recommendations</Link>
            </div>
          </div>
          <div className="relative min-h-[280px]">
            <Image
              alt="Person planning career goals on a laptop"
              className="object-cover"
              fill
              sizes="(min-width: 768px) 36vw, 100vw"
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85"
            />
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

export function StatisticsSection() {
  const stats = [
    { value: '35+', label: 'Career Paths', description: 'Curated technology roles' },
    { value: '8', label: 'Career Guides', description: 'Expert-written articles' },
    { value: '2', label: 'AI Tools', description: 'Resume & recommendations' },
    { value: '100%', label: 'Free Access', description: 'Explore without limits' },
  ];

  return (
    <section className="container-page py-16 md:py-20">
      <MotionReveal className="text-center">
        <p className="section-eyebrow">Platform at a glance</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">Numbers that matter</h2>
      </MotionReveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <MotionReveal key={stat.label} delay={index * 0.1}>
            <div className="card-surface p-6 text-center">
              <strong className="text-5xl font-black" style={{ color: 'var(--primary)' }}>{stat.value}</strong>
              <p className="mt-2 font-bold">{stat.label}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{stat.description}</p>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="container-page py-16 md:py-20">
      <MotionReveal className="text-center">
        <p className="section-eyebrow">Success stories</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">What our users say</h2>
      </MotionReveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <MotionReveal key={testimonial.name} delay={index * 0.1}>
            <div className="card-surface h-full p-6">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-4 text-lg leading-7 italic" style={{ color: 'var(--muted)' }}>&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full font-bold" style={{ background: 'var(--primary)', color: 'white' }}>
                  {testimonial.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

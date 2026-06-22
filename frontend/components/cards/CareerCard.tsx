import Image from 'next/image';
import Link from 'next/link';
import type { Career } from '@/lib/types';
import { formatSalary } from '@/lib/utils';

export function CareerCard({ career }: { career: Career }) {
  return (
    <article className="premium-card group flex h-full min-h-[550px] min-w-[280px] flex-col overflow-hidden rounded-[1.5rem] ">
      <div className="relative h-52 overflow-hidden">
        <Image
          alt={`${career.title} career workspace`}
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={career.imageUrl}
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>{career.category}</span>
          <span className="rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>{career.difficulty}</span>
        </div>
        <h3 className="mt-4 text-xl font-black tracking-[-0.03em]">{career.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6" style={{ color: 'var(--muted)' }}>{career.description}</p>
        <div className="mt-5 grid gap-2 text-sm">
          <span><strong>{formatSalary(career.averageSalaryMin, career.averageSalaryMax)}</strong></span>
          <span style={{ color: 'var(--muted)' }}>{career.demandScore}/100 demand score</span>
        </div>
        <Link href={`/careers/${career.slug}`} className="focus-ring btn-primary mt-auto rounded-2xl px-4 py-3 text-center text-sm font-bold">
          View Details
        </Link>
      </div>
    </article>
  );
}

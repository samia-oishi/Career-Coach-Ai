import Image from 'next/image';
import Link from 'next/link';
import type { Career } from '@/lib/types';
import { formatSalary } from '@/lib/utils';

export function CareerCard({ career }: { career: Career }) {
  return (
    <article 
      className="premium-card group flex flex-col overflow-hidden rounded-[1.5rem]"
      style={{ height: '500px' }}
    >
      {/* Image - Fixed height */}
      <div 
        className="relative flex-shrink-0 overflow-hidden"
        style={{ height: '180px' }}
      >
        <Image
          alt={`${career.title} career workspace`}
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={career.imageUrl}
        />
      </div>

      {/* Content - Flex column */}
      <div 
        className="flex flex-col p-4"
        style={{ height: '320px' }}
      >
        {/* Tags - Fixed height container */}
        <div 
          className="flex flex-wrap items-center gap-2"
          style={{ height: '32px', overflow: 'hidden' }}
        >
          <span 
            className="rounded-full border px-2.5 py-1 text-xs font-bold whitespace-nowrap" 
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            {career.category}
          </span>
          <span 
            className="rounded-full border px-2.5 py-1 text-xs font-bold whitespace-nowrap capitalize" 
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            {career.difficulty}
          </span>
        </div>

        {/* Title - Fixed height with line clamp */}
        <h3 
          className="mt-3 text-lg font-black leading-tight tracking-[-0.03em] overflow-hidden"
          style={{ 
            height: '52px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {career.title}
        </h3>

        {/* Description - Fixed height with line clamp */}
        <p 
          className="mt-2 text-sm leading-relaxed overflow-hidden"
          style={{ 
            height: '66px',
            color: 'var(--muted)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {career.description}
        </p>

        {/* Salary & Score - Fixed height */}
        <div style={{ height: '44px', marginTop: '12px' }}>
          <p className="text-sm font-bold">
            {formatSalary(career.averageSalaryMin, career.averageSalaryMax)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {career.demandScore}/100 demand score
          </p>
        </div>

        {/* Spacer to push button to bottom */}
        <div style={{ flex: 1, minHeight: '8px' }} />

        {/* Button - Always at bottom */}
        <Link 
          href={`/careers/${career.slug}`} 
          className="focus-ring btn-primary block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold"
          style={{ height: '44px', lineHeight: '20px' }}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

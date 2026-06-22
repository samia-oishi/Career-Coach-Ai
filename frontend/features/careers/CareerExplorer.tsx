'use client';

import { useMemo, useState } from 'react';
import { CareerCard } from '@/components/cards/CareerCard';
import { SkeletonCard } from '@/components/states/SkeletonCard';
import type { Career } from '@/lib/types';

export function CareerExplorer({ careers }: { careers: Career[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [salary, setSalary] = useState('all');
  const [sort, setSort] = useState('demand');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const categories = useMemo(() => ['all', ...Array.from(new Set(careers.map((career) => career.category)))], [careers]);

  const filtered = useMemo(() => {
    return careers
      .filter((career) => {
        const matchesSearch = `${career.title} ${career.description} ${career.requiredSkills.join(' ')}`.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'all' || career.category === category;
        const matchesDifficulty = difficulty === 'all' || career.difficulty === difficulty;
        const matchesSalary = salary === 'all' || (salary === 'under100' ? career.averageSalaryMin < 100000 : career.averageSalaryMax >= 130000);
        return matchesSearch && matchesCategory && matchesDifficulty && matchesSalary;
      })
      .sort((a, b) => {
        if (sort === 'title') return a.title.localeCompare(b.title);
        if (sort === 'salary') return b.averageSalaryMax - a.averageSalaryMax;
        return b.demandScore - a.demandScore;
      });
  }, [careers, category, difficulty, salary, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="card-surface grid gap-4 p-4 md:grid-cols-5">
        <input className="rounded-2xl border px-4 py-3 md:col-span-2" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Search skills or careers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        <select className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
          {categories.map((item) => <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>)}
        </select>
        <select className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} value={difficulty} onChange={(event) => { setDifficulty(event.target.value); setPage(1); }}>
          <option value="all">All difficulty</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
        </select>
        <select className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} value={salary} onChange={(event) => { setSalary(event.target.value); setPage(1); }}>
          <option value="all">All salary</option><option value="under100">Entry-friendly</option><option value="high">High ceiling</option>
        </select>
        <select className="rounded-2xl border px-4 py-3 md:col-span-1" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="demand">Sort by demand</option><option value="salary">Sort by salary</option><option value="title">Sort by title</option>
        </select>
      </div>

      {!careers.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}</div> : null}
      {visible.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{visible.map((career) => <CareerCard key={career.slug} career={career} />)}</div> : <div className="card-surface mt-8 p-8 text-center"><h2 className="text-xl font-bold">No careers found</h2><p className="mt-2" style={{ color: 'var(--muted)' }}>Try removing one filter or searching a broader skill.</p></div>}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button className="rounded-xl border px-4 py-2 disabled:opacity-50" style={{ borderColor: 'var(--border)' }} disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Page {page} of {totalPages}</span>
        <button className="rounded-xl border px-4 py-2 disabled:opacity-50" style={{ borderColor: 'var(--border)' }} disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
      </div>
    </div>
  );
}

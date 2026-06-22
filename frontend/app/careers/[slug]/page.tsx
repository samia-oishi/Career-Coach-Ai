import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { fetchCareers } from '@/lib/api';
import { fallbackCareers } from '@/lib/data';
import { SaveCareerButton } from '@/features/careers/SaveCareerButton';
import { formatSalary } from '@/lib/utils';

export default async function CareerDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const careers = await fetchCareers({ limit: '35' }).then((res) => res.data.items).catch(() => fallbackCareers);
  const career = careers.find((item) => item.slug === slug) ?? fallbackCareers[0];
  const related = careers.filter((item) => career.relatedCareerSlugs.includes(item.slug)).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="container-page py-12">
        <Link href="/careers" style={{ color: 'var(--primary)' }}>← Back to careers</Link>
        <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="font-semibold" style={{ color: 'var(--secondary)' }}>{career.category}</p>
            <h1 className="mt-3 text-4xl font-black md:text-6xl">{career.title}</h1>
            <p className="mt-5 text-lg leading-8" style={{ color: 'var(--muted)' }}>{career.overview}</p>
          </div>
          <aside className="card-surface p-6">
            <div className="h-48 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${career.imageUrl})` }} />
            <div className="mt-5 grid gap-3 text-sm"><span>Salary: <strong>{formatSalary(career.averageSalaryMin, career.averageSalaryMax)}</strong></span><span>Difficulty: <strong>{career.difficulty}</strong></span><span>Demand: <strong>{career.demandScore}/100</strong></span></div>
            <div className="mt-6"><SaveCareerButton careerId={career._id} /></div>
          </aside>
        </section>
        <section className="mt-10 grid gap-6 md:grid-cols-2"><Info title="Required skills" items={career.requiredSkills} /><Info title="Responsibilities" items={career.responsibilities} /><Info title="Career growth" items={career.careerGrowth} /><Info title="Learning path" items={career.learningPath} /></section>
        <section className="card-surface mt-8 p-6"><h2 className="text-2xl font-bold">Salary information</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>{career.salaryInformation}</p></section>
        <section className="mt-8"><h2 className="text-2xl font-bold">Reviews</h2><div className="card-surface mt-4 p-6"><p style={{ color: 'var(--muted)' }}>Reviews appear here after signed-in users submit feedback and admins approve it.</p></div></section>
        <section className="mt-8"><h2 className="text-2xl font-bold">Related careers</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{related.map((item) => <Link className="card-surface p-5" href={`/careers/${item.slug}`} key={item.slug}><h3 className="font-bold">{item.title}</h3><p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{item.description}</p></Link>)}</div></section>
      </main>
      <Footer />
    </>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return <div className="card-surface p-6"><h2 className="text-2xl font-bold">{title}</h2><ul className="mt-4 grid gap-3">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;
}

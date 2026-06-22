import { CareerExplorer } from '@/features/careers/CareerExplorer';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { fetchCareers } from '@/lib/api';
import { fallbackCareers } from '@/lib/data';

export default async function CareersPage() {
  const careers = await fetchCareers({ limit: '35' }).then((res) => res.data.items).catch(() => fallbackCareers);

  return (
    <>
      <Navbar />
      <main className="container-page py-12">
        <p className="font-semibold" style={{ color: 'var(--secondary)' }}>Career explorer</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Find the technology path that fits you.</h1>
        <p className="mt-4 max-w-3xl text-lg" style={{ color: 'var(--muted)' }}>Search by role or skill, filter by category and difficulty, compare salary ranges, and open details for a practical growth plan.</p>
        <div className="mt-10"><CareerExplorer careers={careers} /></div>
      </main>
      <Footer />
    </>
  );
}

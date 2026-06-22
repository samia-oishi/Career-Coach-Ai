import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-12" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border p-6 md:flex-row md:items-center md:justify-between" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em]">CareerCoach Ai</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: 'var(--muted)' }}>AI-powered guidance for discovering, planning, and growing a technology career with honest next steps.</p>
          </div>
          <Link href="/careers" className="btn-primary inline-block w-fit rounded-2xl px-5 py-3 text-sm font-bold">Explore careers</Link>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-black"><span className="grid h-9 w-9 place-items-center rounded-2xl text-white" style={{ background: 'var(--primary)' }}>CC</span>CareerCoach Ai</div>
            <p className="mt-4 text-sm leading-6" style={{ color: 'var(--muted)' }}>Built for career switchers, junior developers, and tech professionals looking for a clearer path.</p>
          </div>
          <div>
            <h3 className="font-bold">Explore</h3>
            <div className="mt-4 grid gap-3 text-sm" style={{ color: 'var(--muted)' }}><Link href="/careers">Careers</Link><Link href="/blog">Blog</Link><Link href="/faq">FAQ</Link></div>
          </div>
          <div>
            <h3 className="font-bold">Workspace</h3>
            <div className="mt-4 grid gap-3 text-sm" style={{ color: 'var(--muted)' }}><Link href="/dashboard">Dashboard</Link><Link href="/dashboard/recommendations">Recommendations</Link><Link href="/dashboard/resume-summary">Resume AI</Link></div>
          </div>
          <div>
            <h3 className="font-bold">Contact</h3>
            <div className="mt-4 grid gap-3 text-sm" style={{ color: 'var(--muted)' }}><Link href="/about">About</Link><Link href="/contact">Contact</Link><span>hello@careercoach.ai</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

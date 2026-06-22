import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function AdminPage() {
  return <DashboardShell title="Admin Overview"><div className="grid gap-6 md:grid-cols-4">{['Users', 'Careers', 'Blogs', 'AI Usage'].map((item) => <section className="card-surface p-6" key={item}><h2 className="text-xl font-bold">{item}</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>Admin metrics load from the backend API.</p></section>)}</div></DashboardShell>;
}

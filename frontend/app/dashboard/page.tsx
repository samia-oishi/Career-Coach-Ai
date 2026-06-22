import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardOverview } from '@/features/dashboard/DashboardOverview';

export default function DashboardPage() {
  return (
    <DashboardShell title="User Overview">
      <DashboardOverview />
      <section className="card-surface mt-8 p-6">
        <h2 className="text-2xl font-bold">Career journey</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {['Explore', 'Save', 'Generate AI plan', 'Take action'].map((step, index) => <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }} key={step}><span className="font-bold" style={{ color: 'var(--secondary)' }}>Step {index + 1}</span><p className="mt-2">{step}</p></div>)}
        </div>
      </section>
    </DashboardShell>
  );
}

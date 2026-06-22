import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function AdminReportsPage() {
  return (
    <DashboardShell title="Reports">
      <section className="card-surface p-6">
        <h2 className="text-xl font-bold">Admin reports</h2>
        <p className="mt-3" style={{ color: 'var(--muted)' }}>Saved-career, review, and usage reports will appear here.</p>
      </section>
    </DashboardShell>
  );
}

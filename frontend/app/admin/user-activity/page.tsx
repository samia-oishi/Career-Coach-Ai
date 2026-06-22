import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function AdminUserActivityPage() {
  return (
    <DashboardShell title="User Activity">
      <section className="card-surface p-6">
        <h2 className="text-xl font-bold">Activity summary</h2>
        <p className="mt-3" style={{ color: 'var(--muted)' }}>Aggregate saves, reviews, and AI activity will appear here for admins.</p>
      </section>
    </DashboardShell>
  );
}

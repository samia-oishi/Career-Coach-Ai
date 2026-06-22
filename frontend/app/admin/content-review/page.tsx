import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function AdminContentReviewPage() {
  return (
    <DashboardShell title="Content Review">
      <section className="card-surface p-6">
        <h2 className="text-xl font-bold">Review queue</h2>
        <p className="mt-3" style={{ color: 'var(--muted)' }}>Career reviews and content awaiting admin approval will appear here.</p>
      </section>
    </DashboardShell>
  );
}

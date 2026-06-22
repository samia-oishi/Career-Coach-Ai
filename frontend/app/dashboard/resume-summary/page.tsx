import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ResumeSummaryForm } from '@/features/ai/ResumeSummaryForm';

export default function ResumeSummaryPage() {
  return (
    <DashboardShell title="Resume Summary Generator">
      <p className="mb-6 max-w-3xl" style={{ color: 'var(--muted)' }}>Enter only truthful skills and experience. CareerCoach Ai will generate a concise professional summary without inventing credentials.</p>
      <ResumeSummaryForm />
    </DashboardShell>
  );
}

import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RecommendationForm } from '@/features/ai/RecommendationForm';

export default function RecommendationsPage() {
  return (
    <DashboardShell title="Career Recommendations">
      <p className="mb-6 max-w-3xl" style={{ color: 'var(--muted)' }}>Share your skills, interests, and experience level to receive recommended technology careers with explanations and next steps.</p>
      <RecommendationForm />
    </DashboardShell>
  );
}

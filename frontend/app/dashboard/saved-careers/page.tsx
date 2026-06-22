import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { SavedCareersList } from '@/features/careers/SavedCareersList';

export default function SavedCareersPage() {
  return (
    <DashboardShell title="Saved Careers">
      <SavedCareersList />
    </DashboardShell>
  );
}

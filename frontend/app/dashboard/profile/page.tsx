import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ProfileForm } from '@/features/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <DashboardShell title="Profile">
      <ProfileForm />
    </DashboardShell>
  );
}

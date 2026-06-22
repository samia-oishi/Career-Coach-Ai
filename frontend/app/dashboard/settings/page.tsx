import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { SettingsForm } from '@/features/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings">
      <SettingsForm />
    </DashboardShell>
  );
}

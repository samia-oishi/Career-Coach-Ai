import { RoleGuard } from '@/components/dashboard/RoleGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['user', 'admin']}>{children}</RoleGuard>;
}

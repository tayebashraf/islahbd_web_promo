import { DashboardShell } from "@/components/dashboard/shell";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

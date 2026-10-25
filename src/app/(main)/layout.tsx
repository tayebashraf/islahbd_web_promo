import { DashboardShell } from "@/components/dashboard/shell";
import { SplashScreen } from "@/components/ui/splash-screen";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SplashScreen minDuration={850} />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}

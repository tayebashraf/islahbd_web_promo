import type { Metadata } from "next";
import { AuthProvider } from "@/lib/sirat/auth";
import { ToastProvider } from "@/components/sirat/ui/ToastContext";
import { DashboardShell } from "@/components/dashboard/shell";
import ScrollToTop from "@/components/sirat/ui/ScrollToTop";

import "@/styles/sirat/tokens.css";
import "@/styles/sirat/typography.css";
import "@/styles/sirat/globals.css";
import "./home.css";

export const metadata: Metadata = {
  title: {
    default: "ইসলাহ ব্লগ — জ্ঞানভিত্তিক ইসলামিক নিবন্ধ ও সীরাত",
    template: "%s | ইসলাহ ব্লগ",
  },
  description:
    "জ্ঞানভিত্তিক ইসলামিক নিবন্ধ, তাযকিয়ায়ে নফস, রাসূলুল্লাহ ﷺ-এর সীরাত ও সুন্নাহভিত্তিক ডিজিটাল প্ল্যাটফর্ম।",
  keywords: ["ইসলাহ", "ব্লগ", "সিরাত", "রাসূলুল্লাহ", "ইসলাম", "হাদিস", "তাযকিয়া", "islah blog"],
  authors: [{ name: "ইসলাহ ব্লগ" }],
  openGraph: {
    title: "ইসলাহ ব্লগ — জ্ঞানভিত্তিক ইসলামিক নিবন্ধ ও সীরাত",
    description: "জ্ঞানভিত্তিক ইসলামিক নিবন্ধ ও সীরাত চর্চার প্ল্যাটফর্ম।",
    type: "website",
    locale: "bn_BD",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardShell>
          <div className="sirat-shell font-kalpurush w-full min-h-[calc(100vh-220px)]">
            {children}
          </div>
          <ScrollToTop />
        </DashboardShell>
      </ToastProvider>
    </AuthProvider>
  );
}

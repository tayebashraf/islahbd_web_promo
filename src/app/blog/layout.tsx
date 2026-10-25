import type { Metadata } from "next";
import { AuthProvider } from "@/lib/sirat/auth";
import { ToastProvider } from "@/components/sirat/ui/ToastContext";
import Header from "@/components/sirat/layout/Header";
import Footer from "@/components/sirat/layout/Footer";
import ScrollToTop from "@/components/sirat/ui/ScrollToTop";

import "@/styles/sirat/tokens.css";
import "@/styles/sirat/typography.css";
import "@/styles/sirat/globals.css";
import "./home.css";

export const metadata: Metadata = {
  title: {
    default: "সীরাত.ব্লগ — রাসূলুল্লাহ ﷺ-এর সিরাত ও জ্ঞানভিত্তিক লেখালেখি",
    template: "%s | সীরাত.ব্লগ",
  },
  description:
    "রাসূলুল্লাহ ﷺ-এর সিরাত, জীবন, চরিত্র, আখলাক, শিক্ষা ও সংশ্লিষ্ট জ্ঞানভিত্তিক লেখালেখির আন্তর্জাতিক মানের ডিজিটাল প্ল্যাটফর্ম।",
  keywords: ["সিরাত", "রাসূলুল্লাহ", "ইসলাম", "হাদিস", "আখলাক", "sirat", "seerah", "prophet muhammad"],
  authors: [{ name: "সীরাত.ব্লগ" }],
  openGraph: {
    title: "সীরাত.ব্লগ — রাসূলুল্লাহ ﷺ-এর সিরাত ও জ্ঞানভিত্তিক লেখালেখি",
    description: "রাসূলুল্লাহ ﷺ-এর সিরাত, জীবন ও শিক্ষা নিয়ে জ্ঞানভিত্তিক লেখালেখির প্ল্যাটফর্ম।",
    type: "website",
    locale: "bn_BD",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sirat-shell font-kalpurush min-h-screen" style={{ width: "100%", maxWidth: "100%" }}>
      <AuthProvider>
        <ToastProvider>
          <a href="#main-content" className="skip-to-content">
            মূল বিষয়বস্তুতে যান
          </a>
          <Header />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}

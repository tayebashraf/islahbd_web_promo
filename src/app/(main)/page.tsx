import { AppDownload } from "@/components/home/app-download";
import { AyahSection } from "@/components/home/ayah-section";
import { BlogPreview } from "@/components/home/blog-preview";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { PrayerWidget } from "@/components/home/prayer-widget";
import { Testimonials } from "@/components/home/testimonials";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { fetchLiveStatus } from "@/lib/live-status";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const liveStatus = await fetchLiveStatus();

  return (
    <>
      <Hero liveStatus={liveStatus} />
      <Features />
      <PrayerWidget />
      <AyahSection />
      <Testimonials />
      <BlogPreview />
      <AppDownload />
    </>
  );
}

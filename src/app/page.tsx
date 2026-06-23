import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { PrayerWidget } from "@/components/home/prayer-widget";
import { AyahSection } from "@/components/home/ayah-section";
import { Testimonials } from "@/components/home/testimonials";
import { AppDownload } from "@/components/home/app-download";
import { BlogPreview } from "@/components/home/blog-preview";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { fetchLiveStatus } from "@/lib/live-status";

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

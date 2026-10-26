import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ui";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "রমজান ক্যালেন্ডার ২০২৬ — সেহরি ও ইফতারের সময়সূচি, রোযার নিয়ত ও আমল",
  description:
    "মাহে রমজান ২০২৬-এর ঢাকা ও সকল জেলার নির্ভুল সেহরি ও ইফতারের সময়সূচি, রোযার নিয়ত, ইফতারের দোয়া এবং রমজানের গুরুত্বপূর্ণ ফজিলত ও আমল।",
  keywords: [
    "রমজান ক্যালেন্ডার ২০২৬",
    "রমজানের সময়সূচী",
    "সেহরি ও ইফতারের সময়সূচি ঢাকা",
    "রোজার নিয়ত",
    "ইফতারের দোয়া",
    "রমজানের ফজিলত",
    "রমজানের আমল",
    "Ramadan Calendar 2026 Bangladesh",
    "Sehri Iftar Time Dhaka",
  ],
  alternates: { canonical: `${SITE_URL}/ramadan` },
  openGraph: {
    title: "রমজান ক্যালেন্ডার ২০২৬ — সেহরি ও ইফতারের সময়সূচি | islahbd",
    description: "মাহে রমজান ২০২৬-এর সকল জেলার নির্ভুল সেহরি ও ইফতারের সময়সূচি এবং আমল।",
    url: `${SITE_URL}/ramadan`,
    type: "website",
  },
};

// The timetable (./ramadan-client.tsx) is kept for later; the feature is marked coming soon.
export default function RamadanPage() {
  return <ComingSoon feature="ramadan" />;
}

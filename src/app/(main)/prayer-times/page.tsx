import type { Metadata } from "next";
import { PrayerTimesClient } from "./prayer-times-client";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "নামাজের সময়সূচী — ঢাকা ও বাংলাদেশের সব শহর",
  description: "আজকের নামাজের সময় — ফজর, যোহর, আসর, মাগরিব, এশা। ঢাকা, চট্টগ্রাম, সিলেটসহ বাংলাদেশের সব প্রধান শহরের সময়সূচী।",
  alternates: { canonical: `${SITE_URL}/prayer-times` },
  openGraph: {
    title: `নামাজের সময়সূচী | ${SITE_NAME}`,
    description: "Accurate prayer times for all major cities in Bangladesh.",
    url: `${SITE_URL}/prayer-times`,
  },
};

export default function PrayerTimesPage() {
  return <PrayerTimesClient />;
}

import type { Metadata } from "next";
import { PrayerTimesClient } from "./prayer-times-client";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PRAYER_FAQS } from "./prayer-guide";

export const metadata: Metadata = {
  title: "নামাজের সময়সূচী — আজকের পাঁচ ওয়াক্ত নামাজের সময় ও চিরস্থায়ী ক্যালেন্ডার",
  description:
    "ঢাকা ও বাংলাদেশের সকল জেলার আজকের ফজর, যোহর, আসর, মাগরিব, এশা ও তাহাজ্জুদের সঠিক সময়সূচী, আজান এলার্ট এবং নামাজের নিষিদ্ধ সময়।",
  keywords: [
    "নামাজের সময়সূচী",
    "আজকের নামাজের সময়সূচী ঢাকা",
    "পাঁচ ওয়াক্ত নামাজের সময় বাংলাদেশ",
    "চিরস্থায়ী নামাজের ক্যালেন্ডার",
    "ফজর জোহর আসর মাগরিব এশা তাহাজ্জুদ",
    "নামাজের নিষিদ্ধ সময়",
    "Today Prayer Times Dhaka",
    "Prayer Times Bangladesh",
    "Azan time",
  ],
  alternates: { canonical: `${SITE_URL}/prayer-times` },
  openGraph: {
    title: `নামাজের সময়সূচী — ঢাকা ও বাংলাদেশের সকল জেলা | ${SITE_NAME}`,
    description: "ঢাকা ও বাংলাদেশের সকল প্রধান শহরের পাঁচ ওয়াক্ত নামাজের সঠিক ও নির্ভুল সময়সূচী।",
    url: `${SITE_URL}/prayer-times`,
    type: "website",
  },
};

export default function PrayerTimesPage() {
  return (
    <>
      <FaqJsonLd faqs={PRAYER_FAQS.map((f) => ({ question: f.q.bn, answer: f.a.bn }))} />
      <PrayerTimesClient />
    </>
  );
}

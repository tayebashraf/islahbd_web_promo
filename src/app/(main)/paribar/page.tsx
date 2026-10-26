import type { Metadata } from "next";
import { ParibarClient } from "./paribar-client";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ইসলাহ পরিবার — আত্মশুদ্ধি, বায়আত ও তরবিয়ত | মাওলানা শাহ তৈয়্যেব আশরাফ",
  description:
    "ইসলাহ পরিবার — হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেব দা.বা.-এর সংক্ষিপ্ত পরিচিতি, তালীমী লক্ষ্য ও উদ্দেশ্য, বায়আত সংক্রান্ত দিকনির্দেশনা ও অনলাইন আবেদন।",
  keywords: [
    "ইসলাহ পরিবার",
    "মাওলানা তৈয়্যেব আশরাফ",
    "বায়আত আবেদন",
    "আত্মশুদ্ধি তরবিয়ত",
    "ইসলাহী তালীম",
    "পারিবারিক জীবন ইসলাম",
    "Islah Paribar",
  ],
  alternates: { canonical: `${SITE_URL}/paribar` },
  openGraph: {
    title: "ইসলাহ পরিবার — আত্মশুদ্ধি, বায়আত ও তরবিয়ত | islahbd",
    description: "হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেবের তালীমী দিকনির্দেশনা ও ইসলাহ পরিবার।",
    url: `${SITE_URL}/paribar`,
    type: "website",
  },
};

export default async function ParibarPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <ParibarClient initialTab={tab} />;
}

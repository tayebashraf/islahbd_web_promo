import type { Metadata } from "next";
import { ZakatClient } from "./zakat-client";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "যাকাত ক্যালকুলেটর — সহজ ও নির্ভুল যাকাতের হিসাব ও নিসাব",
  description:
    "নগদ টাকা, স্বর্ণ, রূপা, ব্যবসার পণ্য ও ঋণ বিবেচনা করে শরিয়তসম্মতভাবে সহজে ও নির্ভুলভাবে যাকাতের পরিমাণ বের করুন ডিজিটাল যাকাত ক্যালকুলেটরে।",
  keywords: [
    "যাকাত ক্যালকুলেটর বাংলাদেশ",
    "যাকাতের নিসাব",
    "স্বর্ণের যাকাত হিসাব",
    "নগদ টাকার যাকাত",
    "যাকাত দেয়ার নিয়ম",
    "যাকাতের মাসআলা",
    "Zakat Calculator Bangladesh",
  ],
  alternates: { canonical: `${SITE_URL}/zakat` },
  openGraph: {
    title: "যাকাত ক্যালকুলেটর — সহজ ও নির্ভুল যাকাতের হিসাব ও নিসাব | islahbd",
    description: "শরিয়তের নিয়মে আপনার যাকাত নির্ভুলভাবে হিসাব করুন।",
    url: `${SITE_URL}/zakat`,
    type: "website",
  },
};

export default function ZakatPage() {
  return <ZakatClient />;
}

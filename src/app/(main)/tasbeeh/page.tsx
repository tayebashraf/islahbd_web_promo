import type { Metadata } from "next";
import { TasbeehClient } from "./tasbeeh-client";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ডিজিটাল তাসবীহ কাউন্টার — অনলাইন যিকির ও ইস্তিগফার ট্র্যাকার",
  description:
    "সহজ ও দৃষ্টিনন্দন ডিজিটাল তাসবীহ — সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার, ইস্তিগফার ও দরূদ গণনা করুন এবং হিসেব সংরক্ষণ করুন।",
  keywords: [
    "ডিজিটাল তাসবিহ কাউন্টার",
    "অনলাইন তাসবিহ",
    "যিকির কাউন্টার",
    "তাসবীহে ফাতেমী",
    "ইস্তিগফার গণনা",
    "দরুদ শরীফ কাউন্টার",
    "Digital Tasbeeh Counter Online",
  ],
  alternates: { canonical: `${SITE_URL}/tasbeeh` },
  openGraph: {
    title: "ডিজিটাল তাসবীহ কাউন্টার — অনলাইন যিকির ও ইস্তিগফার | islahbd",
    description: "ডিজিটাল তাসবীহ কাউন্টারে সকাল-সন্ধ্যার জিকির ও ইস্তিগফার সহজে গণনা করুন।",
    url: `${SITE_URL}/tasbeeh`,
    type: "website",
  },
};

export default function TasbeehPage() {
  return <TasbeehClient />;
}

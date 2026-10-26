import type { Metadata } from "next";
import { QiblaClient } from "./qibla-client";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ক্বিবলা কম্পাস — সঠিক কাবার দিক নির্ণয় অনলাইন",
  description:
    "আপনার অবস্থান থেকে কাবা শরিফের সঠিক দিক ও মক্কার দূরত্ব নির্ণয় করুন — জিপিএস ও সেন্সর ভিত্তিক নির্ভুল ডিজিটাল কিবলা কম্পাস।",
  keywords: [
    "কিবলা কম্পাস",
    "কাবার দিক নির্ণয়",
    "কিবলা দিক বাংলাদেশ",
    "ক্বিবলা সন্ধান",
    "মোবাইল কিবলা কম্পাস",
    "Qibla Direction Online",
    "Qibla Compass",
  ],
  alternates: { canonical: `${SITE_URL}/qibla` },
  openGraph: {
    title: "ক্বিবলা কম্পাস — সঠিক কাবার দিক নির্ণয় অনলাইন | islahbd",
    description: "যেকোনো স্থান থেকে তাৎক্ষণিকভাবে কাবার সঠিক দিক নির্ণয় করুন।",
    url: `${SITE_URL}/qibla`,
    type: "website",
  },
};

export default function QiblaPage() {
  return <QiblaClient />;
}

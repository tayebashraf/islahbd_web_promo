import type { Metadata } from "next";
import { QuranHome } from "./quran-home";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "আল-কুরআনুল কারীম — বাংলা উচ্চারণ, অর্থ, তাফসীর ও অডিও তিলাওয়াত",
  description:
    "আল-কুরআনুল কারীমের ১১৪টি সূরার স্পষ্ট আরবি টেক্সট, শব্দে শব্দে অর্থ, সহজ বাংলা অনুবাদ, তাফসীর ও বিশ্বখ্যাত ক্বারীদের সুমধুর তিলাওয়াত।",
  keywords: [
    "আল কুরআন",
    "কুরআন শরীফ",
    "কুরআন বাংলা অনুবাদ",
    "শব্দে শব্দে কুরআন",
    "৩০ পারা কুরআন",
    "কুরআন তেলাওয়াত mp3",
    "কুরআন তাফসীর",
    "সহীহ কুরআন শিক্ষা",
    "Quran Sharif Bangla",
    "Quran Bangla Audio",
  ],
  alternates: { canonical: `${SITE_URL}/quran` },
  openGraph: {
    title: "আল-কুরআনুল কারীম — বাংলা উচ্চারণ, অর্থ, তাফসীর ও অডিও তিলাওয়াত | islahbd",
    description: "আল-কুরআনুল কারীমের ১১৪টি সূরার আরবি পাঠ, বাংলা অনুবাদ ও অডিও তিলাওয়াত।",
    url: `${SITE_URL}/quran`,
    type: "website",
  },
};

export default function QuranPage() {
  return <QuranHome />;
}

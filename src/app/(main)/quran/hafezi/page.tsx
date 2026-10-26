import type { Metadata } from "next";
import { HafeziReader } from "./hafezi-reader";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "হাফেজী কুরআন শরীফ — নূরানী ১৫ লাইনের পৃষ্ঠা ভিত্তিক মুসহাফ",
  description:
    "১৫ লাইনের স্পষ্ট হাফেজী কুরআন শরীফ — হিফজ শিক্ষার্থী ও তিলাওয়াতকারীদের জন্য সূরা, পারা ও পৃষ্ঠা অনুযায়ী সহজ ডিজিটাল তিলাওয়াত।",
  keywords: [
    "হাফেজী কুরআন শরীফ",
    "নূরানী কুরআন মাজীদ",
    "১৫ লাইন হেফজ কুরআন",
    "হেফজখানা কুরআন",
    "হাফেজী কুরআন বাংলা",
    "ডিজিটাল হাফেজী কুরআন",
    "Hafezi Quran Sharif",
  ],
  alternates: { canonical: `${SITE_URL}/quran/hafezi` },
  openGraph: {
    title: "হাফেজী কুরআন শরীফ — নূরানী ১৫ লাইনের পৃষ্ঠা ভিত্তিক মুসহাফ | islahbd",
    description: "হিফজ শিক্ষার্থী ও সাধারণ পাঠকদের জন্য স্পষ্ট ১৫ লাইনের নূরানী হাফেজী কুরআন।",
    url: `${SITE_URL}/quran/hafezi`,
    type: "website",
  },
};

export default function HafeziPage() {
  return <HafeziReader />;
}

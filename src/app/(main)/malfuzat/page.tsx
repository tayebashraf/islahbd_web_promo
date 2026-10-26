import type { Metadata } from "next";
import { MalfuzatClient } from "./malfuzat-client";
import { getMalfuzat } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "মালফুযাত ও নসীহত — আত্মশুদ্ধির অমূল্য বাণী | মাওলানা তৈয়্যেব আশরাফ",
  description:
    "হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের রূহানি মালফুযাত, দিল নরম করার নসীহত ও আত্মশুদ্ধিমূলক অমূল্য বাণী সম্ভার।",
  keywords: [
    "মালফুযাত",
    "নসীহত",
    "মাওলানা তৈয়্যেব আশরাফ",
    "হযরতের বাণী",
    "আত্মশুদ্ধির বাণী",
    "বুজুর্গদের নসীহত",
    "দিল নরম করার কথা",
    "ইসলামিক উপদেশ",
  ],
  alternates: { canonical: `${SITE_URL}/malfuzat` },
  openGraph: {
    title: "মালফুযাত ও নসীহত | islahbd",
    description: "হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের রূহানি উপদেশ ও বাণী সম্ভার।",
    url: `${SITE_URL}/malfuzat`,
    type: "website",
  },
};

export default async function MalfuzatPage() {
  const malfuzat = await getMalfuzat();
  return <MalfuzatClient malfuzat={malfuzat} />;
}

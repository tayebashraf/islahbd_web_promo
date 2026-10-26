import type { Metadata } from "next";
import { QuranAudioClient } from "./audio-client";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "অডিও কুরআন — ১১৪ সূরা",
  description: "বিশ্বখ্যাত ক্বারীদের কণ্ঠে সম্পূর্ণ কুরআনের ১১৪ সূরা ব্রাউজারে শুনুন।",
  alternates: { canonical: `${SITE_URL}/quran/audio` },
};

export default function QuranAudioPage() {
  return <QuranAudioClient />;
}

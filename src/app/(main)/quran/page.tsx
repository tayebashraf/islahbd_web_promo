import type { Metadata } from "next";
import { QuranClient } from "./quran-client";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "কুরআন তিলাওয়াত — ১১৪ সূরা অডিও",
  description: "বিশ্বখ্যাত ক্বারীদের কণ্ঠে সম্পূর্ণ কুরআনের ১১৪ সূরা ব্রাউজারে শুনুন।",
  alternates: { canonical: `${SITE_URL}/quran` },
};

export default function QuranPage() {
  return <QuranClient />;
}

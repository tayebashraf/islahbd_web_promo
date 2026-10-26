import type { Metadata } from "next";
import { AmalClient } from "./amal-client";
import { getAmalCategories, type AmalSection } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "দৈনন্দিন আমল, সুন্নাত ও ফযীলত — সহীহ আমলনামা ও আমল ট্র্যাকার",
  description:
    "সকাল-সন্ধ্যার আমল, হেফাজতের আমল, ছালেকীনের ওয়াজিফা, দৈনন্দিন সুন্নাত ও কোরআনের বিভিন্ন সূরার সহীহ ফযীলত — দলিল ও রেফারেন্সসহ।",
  keywords: [
    "দৈনন্দিন আমল",
    "কোন আমলে কি ফজিলত",
    "নেক আমল",
    "সুন্নাত আমল",
    "আমলনামা",
    "জান্নাত পাওয়ার আমল",
    "সকাল সন্ধ্যার আমল",
    "তাহাজ্জুদের আমল",
    "Islamic Daily Amal",
    "Sunnah Amal",
  ],
  alternates: { canonical: `${SITE_URL}/amal` },
  openGraph: {
    title: "দৈনন্দিন আমল, সুন্নাত ও ফযীলত — সহীহ আমলনামা | islahbd",
    description: "দৈনন্দিন সুন্নাত, অজিফা ও কোরআন-হাদিসের আলোকে আমলের ফযীলত।",
    url: `${SITE_URL}/amal`,
    type: "website",
  },
};

const SECTIONS: AmalSection[] = ["amal", "wazifa", "sunnat", "fazilat"];

export default async function AmalPage({ searchParams }: { searchParams: Promise<{ section?: string; category?: string }> }) {
  const [{ section, category }, categories] = await Promise.all([searchParams, getAmalCategories()]);
  const initialSection = SECTIONS.includes(section as AmalSection) ? (section as AmalSection) : "amal";
  return <AmalClient categories={categories} initialSection={initialSection} initialCategory={category ? Number(category) : undefined} />;
}

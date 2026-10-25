import type { Metadata } from "next";
import { AmalClient } from "./amal-client";
import { getAmalCategories, type AmalSection } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "আমল, ওয়াজিফা, সুন্নাত ও ফযীলত",
  description: "সকাল-সন্ধ্যার আমল, হেফাজতের আমল, ছালেকীনের ওয়াজিফা, দৈনন্দিন সুন্নাত ও সূরার ফযীলত — দলিলসহ।",
  alternates: { canonical: `${SITE_URL}/amal` },
};

const SECTIONS: AmalSection[] = ["amal", "wazifa", "sunnat", "fazilat"];

export default async function AmalPage({ searchParams }: { searchParams: Promise<{ section?: string; category?: string }> }) {
  const [{ section, category }, categories] = await Promise.all([searchParams, getAmalCategories()]);
  const initialSection = SECTIONS.includes(section as AmalSection) ? (section as AmalSection) : "amal";
  return <AmalClient categories={categories} initialSection={initialSection} initialCategory={category ? Number(category) : undefined} />;
}

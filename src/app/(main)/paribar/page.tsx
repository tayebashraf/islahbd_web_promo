import type { Metadata } from "next";
import { ParibarClient } from "./paribar-client";

export const metadata: Metadata = {
  title: "পরিবার",
  description: "ইসলাহ পরিবার — হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেব দা.বা.-এর পরিচিতি, লক্ষ্য ও উদ্দেশ্য, বায়আত সংক্রান্ত দিকনির্দেশনা ও আবেদন।",
};

export default async function ParibarPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <ParibarClient initialTab={tab} />;
}

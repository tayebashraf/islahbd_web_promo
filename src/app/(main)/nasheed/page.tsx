import type { Metadata } from "next";
import { NasheedClient } from "./nasheed-client";
import { getNasheeds } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "হামদ ও নাত — অডিও ও ভিডিও নাশিদ",
  description: "islahbd-এর হামদ, নাত ও নাশিদ — অডিও শুনুন, ভিডিও দেখুন।",
  alternates: { canonical: `${SITE_URL}/nasheed` },
};

export default async function NasheedPage({ searchParams }: { searchParams: Promise<{ play?: string; tab?: string }> }) {
  const [{ play, tab }, nasheeds] = await Promise.all([searchParams, getNasheeds()]);
  return <NasheedClient nasheeds={nasheeds} initialPlay={play ? Number(play) : undefined} initialTab={tab === "video" ? "video" : undefined} />;
}

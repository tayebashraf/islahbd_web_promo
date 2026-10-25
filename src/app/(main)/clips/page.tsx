import type { Metadata } from "next";
import { ClipsClient } from "./clips-client";
import { getClips } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "শর্ট ক্লিপ — ছোট ছোট নসীহত",
  description: "বয়ান থেকে বাছাই করা ছোট ছোট নসীহতের অডিও ও ভিডিও ক্লিপ।",
  alternates: { canonical: `${SITE_URL}/clips` },
};

export default async function ClipsPage({ searchParams }: { searchParams: Promise<{ play?: string }> }) {
  const [{ play }, clips] = await Promise.all([searchParams, getClips()]);
  return <ClipsClient clips={clips} initialPlay={play ? Number(play) : undefined} />;
}

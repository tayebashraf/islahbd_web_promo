import type { Metadata } from "next";
import { PoemsClient } from "./poems-client";
import { POEMS, POETS } from "@/lib/poems";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ইসলামিক কবিতা, কালাম ও আশয়ার — আধ্যাত্মিক কবিতা ও বাংলা অনুবাদ",
  description:
    "আরিফবিল্লাহ হাকীম আখতার রহ., জালালুদ্দীন রুমি, আল্লামা ইকবাল, শেখ সাদী, জামি ও বুযুর্গদের আধ্যাত্মিক প্রেমময় কবিতা — মূল উর্দু/ফারসি ও সাবলীল বাংলা অনুবাদসহ।",
  keywords: [
    "ইসলামিক কবিতা",
    "আধ্যাত্মিক কবিতা",
    "উর্দু ফারসি কবিতা বাংলা অনুবাদ",
    "জালালুদ্দীন রুমি কবিতা",
    "আল্লামা ইকবাল আশয়ার",
    "হাকীম আখতার রহ.",
    "ইসলামিক কালাম",
    "প্রেমময় আশয়ার",
  ],
  alternates: { canonical: `${SITE_URL}/poems` },
  openGraph: {
    title: "ইসলামিক কবিতা, কালাম ও আশয়ার | islahbd",
    description: "রুমি, ইকবাল ও বুযুর্গদের আধ্যাত্মিক কবিতা ও বাংলা অনুবাদ।",
    url: `${SITE_URL}/poems`,
    type: "website",
  },
};

export default async function PoemsPage({ searchParams }: { searchParams: Promise<{ poet?: string }> }) {
  const { poet } = await searchParams;
  const list = POEMS.map((p) => ({
    id: p.id,
    title: p.title,
    poet: p.poet_id,
    book: p.book_source,
    line: p.bangla_translation.split("\n")[0],
  }));
  const counts = Object.fromEntries(POETS.map((x) => [x.id, POEMS.filter((p) => p.poet_id === x.id).length]));
  return <PoemsClient poets={POETS.map(({ id, name, era }) => ({ id, name, era, count: counts[id] ?? 0 }))} poems={list} initialPoet={poet} />;
}

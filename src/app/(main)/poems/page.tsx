import type { Metadata } from "next";
import { PoemsClient } from "./poems-client";
import { POEMS, POETS } from "@/lib/poems";

export const metadata: Metadata = {
  title: "কবিতা ও কালাম",
  description: "আরিফবিল্লাহ হাকীম আখতার রহ., রুমি, ইকবাল, সাদী, জামি ও অন্যান্য বুযুর্গদের আধ্যাত্মিক কবিতা — মূল উর্দু/ফারসি ও বাংলা অনুবাদসহ।",
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

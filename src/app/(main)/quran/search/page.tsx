import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { QURAN_SURAHS, stripBasmala, type Ayah } from "@/lib/quran";
import { SearchClient, type Hit } from "./search-client";

export const metadata: Metadata = {
  title: "কুরআনে খুঁজুন",
  description: "আরবি শব্দ, বাংলা অনুবাদ বা সূরা:আয়াত দিয়ে পুরো কুরআনে খুঁজুন।",
};

const LIMIT = 120;
let corpus: Promise<{ s: number; ayahs: Ayah[] }[]> | null = null;

function loadCorpus() {
  corpus ??= Promise.all(
    QURAN_SURAHS.map(async (s) => ({
      s: s.number,
      ayahs: JSON.parse(await readFile(path.join(process.cwd(), "public/quran/surah", `${s.number}.json`), "utf8")) as Ayah[],
    })),
  );
  return corpus;
}

/** Arabic without harakat, tatweel and alif/ya/ta-marbuta variants, so "الرحمن" finds "ٱلرَّحْمَٰنِ". */
const normArabic = (v: string) =>
  v
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toLatinDigits = (v: string) => v.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

async function search(raw: string): Promise<{ hits: Hit[]; total: number }> {
  const q = raw.trim();
  if (!q) return { hits: [], total: 0 };

  // "2:255" or "২:২৫৫" jumps straight to that ayah.
  const ref = toLatinDigits(q).match(/^(\d{1,3})\s*[:.\-/]\s*(\d{1,3})$/);
  const data = await loadCorpus();
  if (ref) {
    const s = Number(ref[1]);
    const a = Number(ref[2]);
    const row = data[s - 1]?.ayahs.find((x) => x.n === a);
    return row ? { hits: [{ s, n: a, a: stripBasmala(s, a, row.a), t: row.t }], total: 1 } : { hits: [], total: 0 };
  }

  const arabic = /[؀-ۿ]/.test(q);
  const needle = arabic ? normArabic(q) : q.toLowerCase();
  const hits: Hit[] = [];
  let total = 0;
  for (const { s, ayahs } of data) {
    for (const row of ayahs) {
      const text = stripBasmala(s, row.n, row.a);
      const hay = arabic ? normArabic(text) : row.t.toLowerCase();
      if (!hay.includes(needle)) continue;
      total++;
      if (hits.length < LIMIT) hits.push({ s, n: row.n, a: text, t: row.t });
    }
  }
  return { hits, total };
}

export default async function QuranSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").slice(0, 80);
  const { hits, total } = await search(q);
  return <SearchClient q={q} hits={hits} total={total} limit={LIMIT} />;
}

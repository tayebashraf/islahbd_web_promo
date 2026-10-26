import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QURAN_SURAHS } from "@/lib/quran-surahs";
import { SurahReader } from "./surah-reader";

import { SITE_URL } from "@/lib/constants";

function surahOf(param: string) {
  const n = Number(param);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? QURAN_SURAHS[n - 1] : null;
}

export function generateStaticParams() {
  return QURAN_SURAHS.map((s) => ({ surah: String(s.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const s = surahOf((await params).surah);
  if (!s) return {};

  const title = `সূরা ${s.bangla} (${s.arabic}) — বাংলা অনুবাদ ও অডিও তিলাওয়াত | সূরা নং ${s.number}`;
  const description = `সূরা ${s.bangla} (${s.english}) — মোট ${s.ayahs} আয়াত। আরবি তিলাওয়াত, বাংলা উচ্চারণ, বঙ্গানুবাদ, শব্দে শব্দে অর্থ ও তাফসীর পড়ুন।`;
  const canonical = `${SITE_URL}/quran/${s.number}`;

  return {
    title,
    description,
    keywords: [
      `সূরা ${s.bangla}`,
      `সূরা ${s.english}`,
      `Surah ${s.english}`,
      `সূরা ${s.bangla} বাংলা অর্থ`,
      `সূরা ${s.bangla} অডিও`,
      `Surah ${s.english} recitation`,
      `সূরা ${s.bangla} তাফসীর`,
      `কুরআন সূরা ${s.number}`,
      "কুরআন শরীফ",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${title} | islahbd`,
      description,
      url: canonical,
      type: "article",
    },
  };
}

export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const s = surahOf((await params).surah);
  if (!s) notFound();
  return <SurahReader number={s.number} />;
}

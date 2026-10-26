import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QURAN_SURAHS } from "@/lib/quran-surahs";
import { SurahReader } from "./surah-reader";

function surahOf(param: string) {
  const n = Number(param);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? QURAN_SURAHS[n - 1] : null;
}

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const s = surahOf((await params).surah);
  return s ? { title: `সূরা ${s.bangla} (${s.arabic})`, description: `সূরা ${s.bangla} — আরবি, বাংলা অনুবাদ, শব্দে শব্দে অর্থ, তাফসীর ও তিলাওয়াত।` } : {};
}

export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const s = surahOf((await params).surah);
  if (!s) notFound();
  return <SurahReader number={s.number} />;
}

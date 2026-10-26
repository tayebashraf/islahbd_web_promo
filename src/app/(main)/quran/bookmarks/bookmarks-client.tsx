"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Trash2 } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { num } from "@/lib/format";
import { QURAN_SURAHS, loadSurah, stripBasmala, type Ayah } from "@/lib/quran";
import { useQuranBookmarks } from "../[surah]/surah-reader";

/** Saved ayahs on this device, newest first, with their text pulled from each surah file. */
export function BookmarksClient() {
  const { t, lang } = useLang();
  const { list, toggle } = useQuranBookmarks();
  const [texts, setTexts] = useState<Record<number, Ayah[]>>({});
  const surahs = [...new Set(list.map((k) => Number(k.split(":")[0])))].filter((s) => s >= 1 && s <= 114);
  const missing = surahs.filter((s) => !texts[s]).join(",");

  useEffect(() => {
    if (!missing) return;
    let alive = true;
    Promise.all(missing.split(",").map(async (s) => [Number(s), await loadSurah(Number(s))] as const))
      .then((rows) => alive && setTexts((prev) => ({ ...prev, ...Object.fromEntries(rows) })))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [missing]);

  return (
    <div className="mx-auto max-w-[900px] pb-10">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/quran" aria-label={t("ফিরে যান", "Back")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-ink hover:border-brand/40">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <h1 className="font-heading text-[20px] font-bold text-ink sm:text-[24px]">{t("বুকমার্ক", "Bookmarks")}</h1>
        {list.length > 0 && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-num text-[12px] text-brand">{num(list.length, lang)}</span>}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-panel px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Bookmark className="h-6 w-6" />
          </span>
          <p className="font-semibold text-ink">{t("এখনো কোনো আয়াত সংরক্ষণ করেননি", "No saved ayahs yet")}</p>
          <p className="max-w-sm text-sm text-ink-3">{t("পড়ার সময় আয়াতের পাশের বুকমার্ক চিহ্নে চাপ দিলে তা এখানে জমা থাকবে।", "Tap the bookmark icon beside any ayah while reading and it will be kept here.")}</p>
          <Link href="/quran#surahs" className="mt-2 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-medium text-white hover:bg-brand-strong">
            {t("কুরআন পড়ুন", "Read the Quran")}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((key) => {
            const [s, n] = key.split(":").map(Number);
            const surah = QURAN_SURAHS[s - 1];
            if (!surah) return null;
            const row = texts[s]?.find((x) => x.n === n);
            return (
              <li key={key} className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/quran/${s}#ayah-${n}`} className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-[12px] font-medium text-brand hover:bg-brand hover:text-white">
                    {t(`সূরা ${surah.bangla} · ${num(s, lang)}:${num(n, lang)}`, `${surah.english} · ${s}:${n}`)}
                  </Link>
                  <button onClick={() => toggle(key)} aria-label={t("সরিয়ে দিন", "Remove")} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-red-500/10 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {row ? (
                  <Link href={`/quran/${s}#ayah-${n}`} className="block">
                    <p dir="rtl" className="mt-3 font-arabic text-[22px] leading-[2.1] text-ink">
                      {stripBasmala(s, n, row.a)}
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{row.t}</p>
                  </Link>
                ) : (
                  <div className="mt-3 space-y-2">
                    <div className="h-6 animate-pulse rounded bg-line/60" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-line/60" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

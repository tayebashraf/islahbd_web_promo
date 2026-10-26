"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { num } from "@/lib/format";
import { QURAN_SURAHS } from "@/lib/quran";

export type Hit = { s: number; n: number; a: string; t: string };

/** Wraps every occurrence of `q` in the translation with a highlight. */
function Marked({ text, q }: { text: string; q: string }) {
  const needle = q.trim().toLowerCase();
  if (!needle || /[؀-ۿ]/.test(needle)) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  const lower = text.toLowerCase();
  let i = 0;
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, i)) {
    parts.push(text.slice(i, at), <mark key={at} className="rounded bg-gold/25 px-0.5 text-ink">{text.slice(at, at + needle.length)}</mark>);
    i = at + needle.length;
  }
  parts.push(text.slice(i));
  return <>{parts}</>;
}

export function SearchClient({ q, hits, total, limit }: { q: string; hits: Hit[]; total: number; limit: number }) {
  const { t, lang } = useLang();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[900px] pb-10">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/quran" aria-label={t("ফিরে যান", "Back")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-ink hover:border-brand/40">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <h1 className="font-heading text-[20px] font-bold text-ink sm:text-[24px]">{t("কুরআনে খুঁজুন", "Search the Quran")}</h1>
      </div>

      <form
        key={q}
        onSubmit={(e) => {
          e.preventDefault();
          const v = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
          router.push(v ? `/quran/search?q=${encodeURIComponent(v)}` : "/quran/search");
        }}
        className="flex items-center gap-2 rounded-2xl border border-line bg-panel p-1.5 ps-4 focus-within:border-brand"
      >
        <Search className="h-4 w-4 shrink-0 text-ink-3" />
        <input name="q" defaultValue={q} autoFocus={!q} placeholder={t("যেমন: ধৈর্য, رحمة, ২:২৫৫", "e.g. patience, رحمة, 2:255")} className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3" />
        <button className="h-10 shrink-0 rounded-xl bg-brand px-5 text-sm font-medium text-white hover:bg-brand-strong">{t("খুঁজুন", "Search")}</button>
      </form>

      {q && (
        <p className="mt-4 text-sm text-ink-3">
          {total === 0
            ? t("কোনো আয়াত পাওয়া যায়নি।", "No ayahs found.")
            : total > limit
              ? t(`${num(total, lang)}টি আয়াত পাওয়া গেছে — প্রথম ${num(limit, lang)}টি দেখানো হচ্ছে`, `${total} ayahs found — showing the first ${limit}`)
              : t(`${num(total, lang)}টি আয়াত পাওয়া গেছে`, `${total} ayahs found`)}
        </p>
      )}
      {!q && <p className="mt-4 text-sm text-ink-3">{t("বাংলা অনুবাদের শব্দ, আরবি শব্দ (হরকত ছাড়াও) অথবা সূরা:আয়াত লিখে খুঁজুন।", "Search a word in the translation, an Arabic word (with or without harakat) or surah:ayah.")}</p>}

      <ul className="mt-3 space-y-3">
        {hits.map((h) => {
          const s = QURAN_SURAHS[h.s - 1];
          return (
            <li key={`${h.s}:${h.n}`}>
              <Link href={`/quran/${h.s}#ayah-${h.n}`} className="block rounded-2xl border border-line bg-panel p-4 transition hover:border-brand/40 sm:p-5">
                <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-[12px] font-medium text-brand">
                  {t(`সূরা ${s.bangla} · ${num(h.s, lang)}:${num(h.n, lang)}`, `${s.english} · ${h.s}:${h.n}`)}
                </span>
                <p dir="rtl" className="mt-3 font-arabic text-[22px] leading-[2.1] text-ink">
                  {h.a}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                  <Marked text={h.t} q={q} />
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

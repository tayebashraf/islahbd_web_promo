"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BookOpenText, Bookmark, ChevronRight, Headphones, History, Search } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { Segmented } from "@/components/dashboard/ui";
import { useStoredString } from "@/lib/use-client-store";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BISMILLAH, JUZ_STARTS, LAST_READ_KEY, QURAN_SURAHS, parseJson } from "@/lib/quran";

/** The Quran hub — digital Quran & tafsir, audio Quran, then every surah and juz. */
export function QuranHome() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"surah" | "juz">("surah");
  const [lastRaw] = useStoredString(LAST_READ_KEY);
  const last = parseJson<{ s: number; a: number } | null>(lastRaw, null);

  const surahs = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return QURAN_SURAHS;
    return QURAN_SURAHS.filter((s) => String(s.number) === n || s.bangla.includes(n) || s.english.toLowerCase().includes(n) || s.arabic.includes(n) || s.meaning.toLowerCase().includes(n));
  }, [q]);

  const doors = [
    { href: "#surahs", icon: BookOpenText, tone: "#0F766E", title: t("ডিজিটাল কুরআন ও তাফসীর", "Digital Quran & tafsir"), sub: t("শব্দে শব্দে অর্থ, প্রামাণ্য অনুবাদ ও বিস্তারিত তাফসীর", "Word by word, translation and tafsir") },
    { href: "/quran/audio", icon: Headphones, tone: "#B8860B", title: t("অডিও কুরআন", "Audio Quran"), sub: t("বিশ্বখ্যাত ক্বারীদের সুললিত তিলাওয়াত", "Recitations by renowned qaris") },
  ];

  return (
    <div className="mx-auto max-w-[1100px] pb-10">
      {/* Hero with search across the whole Quran */}
      <section className="hero-surface relative overflow-hidden rounded-3xl p-6 text-center sm:p-9">
        <div className="star-lattice pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="relative">
          <p className="font-arabic text-[26px] leading-loose opacity-95 sm:text-[34px]" dir="rtl">
            {BISMILLAH}
          </p>
          <h1 className="mt-1 font-heading text-[26px] font-bold sm:text-[32px]">{t("আল-কুরআনুল কারীম", "The Noble Quran")}</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = new FormData(e.currentTarget).get("q")?.toString().trim();
              if (v) router.push(`/quran/search?q=${encodeURIComponent(v)}`);
            }}
            className="mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 ps-4"
          >
            <Search className="h-4 w-4 shrink-0 text-ink-3" />
            <input name="q" placeholder={t("আয়াত, শব্দ বা অনুবাদে খুঁজুন…", "Search ayahs, words or translation…")} className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3" />
            <button className="h-10 shrink-0 rounded-full bg-brand px-5 text-sm font-medium text-white hover:bg-brand-strong">{t("খুঁজুন", "Search")}</button>
          </form>
        </div>
      </section>

      {/* Continue */}
      {last && QURAN_SURAHS[last.s - 1] && (
        <div className="mt-4">
          <Link href={`/quran/${last.s}#ayah-${last.a}`} className="flex items-center gap-3 rounded-2xl border border-brand/30 bg-brand-soft/50 p-4 hover:border-brand/60">
            <History className="h-5 w-5 shrink-0 text-brand" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-ink-3">{t("যেখানে থেমেছিলেন", "Continue reading")}</span>
              <span className="block truncate font-semibold text-ink">
                {t(`সূরা ${QURAN_SURAHS[last.s - 1].bangla} · আয়াত ${num(last.a, lang)}`, `Surah ${QURAN_SURAHS[last.s - 1].english} · Ayah ${last.a}`)}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-ink-3 rtl:rotate-180" />
          </Link>
        </div>
      )}

      {/* The doors */}
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {doors.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-brand/40 sm:p-5">
              <span className="tone flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ ["--tone" as string]: d.tone }}>
                <d.icon className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-[17px] font-bold text-ink group-hover:text-brand">{d.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{d.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Surahs / juz */}
      <section id="surahs" className="mt-8 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-gradient-to-b from-gold to-brand" />
            <h2 className="font-heading text-[20px] font-bold text-ink sm:text-[22px]">{t("ডিজিটাল কুরআন ও তাফসীর", "Digital Quran & tafsir")}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/quran/bookmarks" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-panel px-3.5 text-sm text-ink hover:border-brand/40">
              <Bookmark className="h-4 w-4 text-brand" />
              {t("বুকমার্ক", "Bookmarks")}
            </Link>
            <Segmented
              size="sm"
              value={tab}
              onChange={setTab}
              options={[
                { value: "surah", label: t("সূরা", "Surah") },
                { value: "juz", label: t("পারা", "Juz") },
              ]}
            />
          </div>
        </div>

        {tab === "surah" ? (
          <>
            <label className="mb-3 flex h-11 items-center gap-2 rounded-2xl border border-line bg-panel px-4 focus-within:border-brand">
              <Search className="h-4 w-4 text-ink-3" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("সূরার নাম বা নম্বর…", "Surah name or number…")} className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3" />
            </label>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {surahs.map((s) => (
                <li key={s.number}>
                  <Link href={`/quran/${s.number}`} className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-3 transition hover:border-brand/40">
                    <span className="flex h-10 w-10 shrink-0 rotate-45 items-center justify-center rounded-lg bg-brand-soft">
                      <span className="-rotate-45 font-num text-sm font-semibold text-brand">{num(s.number, lang)}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{lang === "bn" ? s.bangla : s.english}</span>
                      <span className="block truncate text-[12px] text-ink-3">
                        {s.madani ? t("মাদানী", "Madani") : t("মাক্কী", "Makki")} · {t(`${num(s.ayahs, lang)} আয়াত`, `${s.ayahs} ayahs`)}
                      </span>
                    </span>
                    <span className="font-arabic text-[20px] text-brand-strong" dir="rtl">
                      {s.arabic}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {JUZ_STARTS.map((j) => (
              <li key={j.j}>
                <Link href={`/quran/${j.s}#ayah-${j.a}`} className={cn("flex flex-col rounded-2xl border border-line bg-panel p-3 transition hover:border-brand/40")}>
                  <span className="font-heading text-[16px] font-bold text-ink">{t(`পারা ${num(j.j, lang)}`, `Juz ${j.j}`)}</span>
                  <span className="mt-0.5 truncate text-[12px] text-ink-3">
                    {t(`${QURAN_SURAHS[j.s - 1].bangla} ${num(j.a, lang)}`, `${QURAN_SURAHS[j.s - 1].english} ${j.a}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

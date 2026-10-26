"use client";

import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, Headphones, Mic } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { Equalizer, PageHeader, Panel, PlayButton, SearchInput, Segmented } from "@/components/dashboard/ui";
import { QURAN_SURAHS, type Qari } from "@/lib/quran-surahs";
import { QURAN_QARIS } from "@/lib/quran";
import { surahTrack } from "@/lib/tracks";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useStoredString } from "@/lib/use-client-store";

const QARI_KEY = "islahbd-qari";

/** All of the app's qaris, in the shape the player's surah tracks expect. */
const QARIS: Qari[] = QURAN_QARIS.filter((q) => q.server.startsWith("http")).map((q) => ({ id: q.id, name: q.name, english: q.en || q.name, server: q.server }));

export function QuranAudioClient() {
  const { t, lang } = useLang();
  const player = usePlayer();
  const [qariId, setQariId] = useStoredString(QARI_KEY);
  const qari: Qari = QARIS.find((x) => x.id === qariId) ?? QARIS[0];
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "makki" | "madani">("all");

  const setQari = (id: string) => setQariId(id);

  const surahs = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return QURAN_SURAHS.filter(
      (s) =>
        (type === "all" || (type === "madani") === s.madani) &&
        (!needle ||
          String(s.number) === needle ||
          s.bangla.includes(needle) ||
          s.english.toLowerCase().includes(needle) ||
          s.arabic.includes(needle) ||
          s.meaning.toLowerCase().includes(needle)),
    );
  }, [q, type]);

  const queue = useMemo(() => surahs.map((s) => surahTrack(qari, s.number)), [surahs, qari]);

  return (
    <div>
      <PageHeader
        eyebrow={t("অডিও কুরআন", "Audio Quran")}
        title={t("অডিও কুরআন", "Audio Quran")}
        muted={t("১১৪ সূরা", "114 surahs")}
        description={t("প্রিয় ক্বারী বেছে নিন, যেকোনো সূরা শুনুন — পরপর বাজতে থাকবে।", "Pick a qari and play any surah — it continues in order.")}
        actions={<SearchInput value={q} onChange={setQ} placeholder={t("সূরা খুঁজুন…", "Search surah…")} />}
      />

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-12">
        <section className="relative overflow-hidden rounded-3xl hero-surface p-6 xl:col-span-4">
          <div className="pointer-events-none absolute -top-20 -right-14 h-56 w-56 rounded-full bg-white/10" />
          <p className="relative font-arabic text-3xl leading-loose opacity-90" dir="rtl">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <label className="relative mt-4 block text-xs opacity-75">{t("ক্বারী", "Qari")}</label>
          <div className="relative mt-1.5">
            <select
              value={qari.id}
              onChange={(e) => setQari(e.target.value)}
              className="h-12 w-full cursor-pointer appearance-none rounded-full bg-white/15 pe-10 ps-4 text-sm font-medium text-white outline-none ring-1 ring-white/25 [&>option]:text-ink"
            >
              {QARIS.map((x) => (
                <option key={x.id} value={x.id}>
                  {lang === "bn" ? x.name : x.english}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
          </div>
          <div className="relative mt-5 flex items-center gap-3">
            <button
              onClick={() => queue[0] && player.play(queue[0], queue)}
              className="flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-strong"
            >
              <Headphones className="h-4 w-4" /> {t("ধারাবাহিক শুনুন", "Play in order")}
            </button>
            <span className="text-xs opacity-75">
              <Mic className="me-1 inline h-3.5 w-3.5" />
              {t(`${num(QARIS.length, lang)} জন ক্বারী`, `${QARIS.length} reciters`)}
            </span>
          </div>
        </section>

        <Panel className="xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-ink">
              {t("সূরা তালিকা", "Surah list")} <span className="font-normal text-ink-3">({num(surahs.length, lang)})</span>
            </h2>
            <Segmented
              size="sm"
              value={type}
              onChange={setType}
              options={[
                { value: "all", label: t("সব", "All") },
                { value: "makki", label: t("মাক্কী", "Makki") },
                { value: "madani", label: t("মাদানী", "Madani") },
              ]}
            />
          </div>
          <ul className="mt-4 grid max-h-[560px] grid-cols-1 gap-1.5 overflow-y-auto pe-1 sm:grid-cols-2">
            {surahs.map((s, i) => {
              const track = queue[i];
              const current = player.isCurrent(track.id);
              const playing = current && player.playing;
              return (
                <li key={s.number} className={cn("flex items-center gap-3 rounded-2xl p-2.5 transition", current ? "bg-brand-soft" : "bg-panel-2/60 hover:bg-panel-2")}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-panel font-num text-sm font-semibold text-brand">
                    {current ? <Equalizer active={playing} /> : num(s.number, lang)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{lang === "bn" ? s.bangla : s.english}</p>
                    <p className="truncate text-[11px] text-ink-3">
                      {s.madani ? t("মাদানী", "Madani") : t("মাক্কী", "Makki")} · {t(`${num(s.ayahs, lang)} আয়াত`, `${s.ayahs} ayahs`)}
                    </p>
                  </div>
                  <span className="hidden font-arabic text-lg text-ink-2 sm:block" dir="rtl">
                    {s.arabic}
                  </span>
                  <PlayButton
                    size="sm"
                    playing={playing}
                    loading={current && player.loading}
                    onClick={() => (playing ? player.pause() : player.play(track, queue))}
                    label={playing ? t("থামান", "Pause") : t("শুনুন", "Play")}
                    className={cn(!current && "bg-panel")}
                  />
                </li>
              );
            })}
            {surahs.length === 0 && (
              <li className="col-span-full flex flex-col items-center gap-2 py-12 text-sm text-ink-3">
                <BookOpen className="h-5 w-5" />
                {t("কোনো সূরা পাওয়া যায়নি", "No surah found")}
              </li>
            )}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

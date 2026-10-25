"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock, Headphones, Layers, MapPin, Mic2, Shuffle } from "lucide-react";
import type { Boyan, BoyanCategory } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { AudioRow, useInitialPlay } from "@/components/dashboard/audio-row";
import { Chip, EmptyState, PageHeader, Panel, SearchInput, Segmented, StatTile } from "@/components/dashboard/ui";
import { boyanTrack } from "@/lib/tracks";
import { formatDate, num, shortSpeaker, timeAgo } from "@/lib/format";

const PAGE = 30;
const norm = (s: string) => (s || "General").replace(/\s+/g, " ").trim();

export function BoyanClient({
  boyans,
  categories,
  initialPlay,
  initialCategory,
}: {
  boyans: Boyan[];
  categories: BoyanCategory[];
  initialPlay?: number;
  initialCategory?: string;
}) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(initialCategory ?? "all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [limit, setLimit] = useState(() => Math.max(PAGE, boyans.findIndex((b) => b.id === initialPlay) + 1));

  const catList = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of boyans) counts.set(norm(b.category), (counts.get(norm(b.category)) ?? 0) + 1);
    const order = new Map(categories.map((c) => [norm(c.name), c.order]));
    return [...counts.entries()].sort((a, b) => (order.get(a[0]) ?? 99) - (order.get(b[0]) ?? 99) || b[1] - a[1]);
  }, [boyans, categories]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const rows = boyans.filter(
      (b) =>
        (cat === "all" || norm(b.category) === cat) &&
        (!needle || b.title.toLowerCase().includes(needle) || b.location?.toLowerCase().includes(needle) || b.speaker.toLowerCase().includes(needle)),
    );
    return [...rows].sort((a, b) => (sort === "new" ? b.uploadDate.localeCompare(a.uploadDate) : a.uploadDate.localeCompare(b.uploadDate)));
  }, [boyans, q, cat, sort]);

  const queue = useMemo(() => filtered.map(boyanTrack), [filtered]);
  const allQueue = useMemo(() => boyans.map(boyanTrack), [boyans]);
  const initial = initialPlay ? allQueue.find((tr) => tr.id === `boyan-${initialPlay}`) : undefined;
  useInitialPlay(initial, allQueue);

  const monthKey = boyans[0]?.uploadDate.slice(0, 7);
  const thisMonth = boyans.filter((b) => b.uploadDate.startsWith(monthKey ?? "-")).length;
  const locations = new Set(boyans.map((b) => b.location).filter(Boolean)).size;

  return (
    <div>
      <PageHeader
        eyebrow={t("অডিও আর্কাইভ", "Audio archive")}
        title={t("বয়ান", "Boyan")}
        muted={t(`${num(boyans.length, lang)}টি`, `${boyans.length} talks`)}
        description={t("ইসলাহী মজলিস, জুমার বয়ান, মাসিক ইজতেমা ও সফরের বয়ান — সরাসরি ব্রাউজারে শুনুন।", "Islahi majlis, Friday talks, monthly ijtema and travel talks — right in your browser.")}
        actions={
          <>
            <SearchInput value={q} onChange={(v) => { setQ(v); setLimit(PAGE); }} placeholder={t("বয়ান খুঁজুন…", "Search talks…")} />
            <button
              onClick={() => queue[0] && player.play(queue[0], queue)}
              className="flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-white hover:bg-brand-strong"
            >
              <Headphones className="h-4 w-4" /> {t("সব চালান", "Play all")}
            </button>
            <button
              onClick={() => {
                const shuffled = [...queue].sort(() => Math.random() - 0.5);
                if (shuffled[0]) player.play(shuffled[0], shuffled);
              }}
              aria-label={t("এলোমেলো", "Shuffle")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-panel text-ink-2 hover:text-ink"
            >
              <Shuffle className="h-4 w-4" />
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile icon={Mic2} label={t("মোট বয়ান", "Total talks")} value={num(boyans.length, lang)} />
        <StatTile icon={Layers} label={t("বিভাগ", "Categories")} value={num(catList.length, lang)} />
        <StatTile icon={CalendarDays} label={t("এই মাসে নতুন", "New this month")} value={num(thisMonth, lang)} />
        <StatTile
          icon={MapPin}
          label={t("স্থান", "Locations")}
          value={num(locations, lang)}
          hint={boyans[0] ? t(`সর্বশেষ ${timeAgo(boyans[0].uploadDate, lang)}`, `latest ${timeAgo(boyans[0].uploadDate, lang)}`) : undefined}
        />
      </div>

      <Panel className="mt-4 sm:mt-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1">
            <Chip active={cat === "all"} onClick={() => { setCat("all"); setLimit(PAGE); }} count={num(boyans.length, lang)}>
              {t("সব", "All")}
            </Chip>
            {catList.map(([name, n]) => (
              <Chip key={name} active={cat === name} onClick={() => { setCat(name); setLimit(PAGE); }} count={num(n, lang)}>
                {name}
              </Chip>
            ))}
          </div>
          <Segmented
            size="sm"
            value={sort}
            onChange={setSort}
            options={[
              { value: "new", label: t("নতুন আগে", "Newest") },
              { value: "old", label: t("পুরাতন আগে", "Oldest") },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-5">
            <EmptyState icon={Mic2} title={t("কোনো বয়ান পাওয়া যায়নি", "No talks found")} hint={t("অন্য শব্দ দিয়ে খুঁজে দেখুন", "Try a different search")} />
          </div>
        ) : (
          <ul className="mt-4 space-y-1">
            {filtered.slice(0, limit).map((b, i) => (
              <AudioRow
                key={b.id}
                index={i}
                track={queue[i]}
                queue={queue}
                highlight={b.id === initialPlay}
                meta={
                  <>
                    <span className="text-brand">{norm(b.category)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(b.uploadDate, lang)}
                    </span>
                    {b.location && (
                      <span className="inline-flex max-w-[260px] items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{b.location}</span>
                      </span>
                    )}
                  </>
                }
                aside={<span className="block max-w-[220px] truncate text-xs text-ink-3">{shortSpeaker(b.speaker)}</span>}
              />
            ))}
          </ul>
        )}

        {filtered.length > limit && (
          <div className="mt-4 flex justify-center">
            <button onClick={() => setLimit((l) => l + PAGE)} className="h-11 rounded-full bg-panel-2 px-6 text-sm font-medium text-ink hover:bg-brand hover:text-white">
              {t(`আরও দেখুন (${num(filtered.length - limit, lang)})`, `Show more (${filtered.length - limit})`)}
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}

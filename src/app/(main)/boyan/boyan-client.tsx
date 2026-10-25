"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Clock, MapPin, Mic2, Play } from "lucide-react";
import type { Boyan, BoyanCategory } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { AudioRow, useInitialPlay } from "@/components/dashboard/audio-row";
import { Chip, EmptyState, HeaderIconButton, MediaHeader } from "@/components/dashboard/ui";
import { boyanTrack } from "@/lib/tracks";
import { formatDate, num, shortSpeaker } from "@/lib/format";

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
  // Nearly every talk is by the same shaykh; only name the others.
  const mainSpeaker = useMemo(() => {
    const n = new Map<string, number>();
    for (const b of boyans) n.set(b.speaker, (n.get(b.speaker) ?? 0) + 1);
    return [...n.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [boyans]);
  const allQueue = useMemo(() => boyans.map(boyanTrack), [boyans]);
  const initial = initialPlay ? allQueue.find((tr) => tr.id === `boyan-${initialPlay}`) : undefined;
  useInitialPlay(initial, allQueue);

  const pickCat = (c: string) => {
    setCat(c);
    setLimit(PAGE);
  };

  return (
    <div>
      <MediaHeader
        title={t("বয়ান", "Boyan")}
        count={num(boyans.length, lang)}
        query={q}
        onQuery={(v) => {
          setQ(v);
          setLimit(PAGE);
        }}
        placeholder={t("বয়ান, স্থান বা বক্তা খুঁজুন…", "Search talks, places or speakers…")}
        actions={
          queue.length > 0 ? (
            <HeaderIconButton label={t("সব চালান", "Play all")} onClick={() => player.play(queue[0], queue)}>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{t("সব চালান", "Play all")}</span>
            </HeaderIconButton>
          ) : null
        }
        below={
          <div className="scroll-hide -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0">
            <button
              onClick={() => setSort((s) => (s === "new" ? "old" : "new"))}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 text-xs font-medium text-ink transition hover:border-brand/40"
              title={sort === "new" ? t("নতুন আগে", "Newest first") : t("পুরাতন আগে", "Oldest first")}
            >
              <ArrowDownUp className="h-3.5 w-3.5 text-brand" />
              <span>{sort === "new" ? t("নতুন আগে", "Newest") : t("পুরাতন আগে", "Oldest")}</span>
            </button>
            <div className="h-4 w-px shrink-0 bg-line" />
            <Chip active={cat === "all"} onClick={() => pickCat("all")} count={num(boyans.length, lang)}>
              {t("সব", "All")}
            </Chip>
            {catList.map(([name, n]) => (
              <Chip key={name} active={cat === name} onClick={() => pickCat(name)} count={num(n, lang)}>
                {name}
              </Chip>
            ))}
          </div>
        }
      />

      <div>
        {filtered.length === 0 ? (
          <div>
            <EmptyState icon={Mic2} title={t("কোনো বয়ান পাওয়া যায়নি", "No talks found")} hint={t("অন্য শব্দ দিয়ে খুঁজে দেখুন", "Try a different search")} />
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
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
                    {b.speaker && b.speaker !== mainSpeaker && <span className="truncate">{shortSpeaker(b.speaker)}</span>}
                    {b.location && (
                      <span className="inline-flex min-w-0 max-w-[260px] items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{b.location}</span>
                      </span>
                    )}
                  </>
                }
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
      </div>
    </div>
  );
}

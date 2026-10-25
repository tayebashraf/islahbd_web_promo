"use client";

import { useMemo, useState } from "react";
import { Feather, Headphones, Music2, PenLine, Video } from "lucide-react";
import type { Nasheed } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { AudioRow, useInitialPlay } from "@/components/dashboard/audio-row";
import { VideoGrid } from "@/components/dashboard/video-grid";
import { EmptyState, PageHeader, Panel, SearchInput, Segmented, StatTile } from "@/components/dashboard/ui";
import { nasheedTrack } from "@/lib/tracks";
import { num } from "@/lib/format";

function matches(n: Nasheed, needle: string) {
  return !needle || [n.title, n.artist, n.lyricist, n.composer].some((s) => s?.toLowerCase().includes(needle));
}

export function NasheedClient({ nasheeds, initialPlay, initialTab }: { nasheeds: Nasheed[]; initialPlay?: number; initialTab?: "video" }) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const audios = useMemo(() => nasheeds.filter((n) => n.type === "audio" && n.audioUrl), [nasheeds]);
  const videos = useMemo(() => nasheeds.filter((n) => n.youtubeId), [nasheeds]);
  const startsOnVideo = initialTab === "video" || (!!initialPlay && videos.some((v) => v.id === initialPlay) && !audios.some((a) => a.id === initialPlay));
  const [tab, setTab] = useState<"audio" | "video">(startsOnVideo ? "video" : "audio");
  const [q, setQ] = useState("");

  const needle = q.trim().toLowerCase();
  const match = (n: Nasheed) => matches(n, needle);
  const shownAudio = audios.filter(match);
  const queue = shownAudio.map(nasheedTrack);
  const allQueue = audios.map(nasheedTrack);
  useInitialPlay(!startsOnVideo && initialPlay ? allQueue.find((tr) => tr.id === `nasheed-${initialPlay}`) : undefined, allQueue);

  const lyricists = new Set(nasheeds.map((n) => n.lyricist).filter(Boolean)).size;
  const composers = new Set(nasheeds.map((n) => n.composer).filter(Boolean)).size;

  return (
    <div>
      <PageHeader
        eyebrow={t("নাশিদ", "Nasheed")}
        title={t("হামদ ও নাত", "Hamd & Naat")}
        muted={t(`${num(nasheeds.length, lang)}টি`, `${nasheeds.length}`)}
        description={t("আল্লাহর প্রশংসা ও রাসূল ﷺ-এর শানে রচিত হামদ-নাত, অডিও ও ভিডিও।", "Praise of Allah and the Prophet ﷺ — audio and video.")}
        actions={
          <>
            <SearchInput value={q} onChange={setQ} placeholder={t("নাশিদ খুঁজুন…", "Search nasheeds…")} />
            {tab === "audio" && (
              <button
                onClick={() => queue[0] && player.play(queue[0], queue)}
                className="flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-white hover:bg-brand-strong"
              >
                <Headphones className="h-4 w-4" /> {t("সব চালান", "Play all")}
              </button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile icon={Music2} label={t("অডিও", "Audio")} value={num(audios.length, lang)} />
        <StatTile icon={Video} label={t("ভিডিও", "Video")} value={num(videos.length, lang)} />
        <StatTile icon={Feather} label={t("গীতিকার", "Lyricists")} value={num(lyricists, lang)} />
        <StatTile icon={PenLine} label={t("সুরকার", "Composers")} value={num(composers, lang)} />
      </div>

      <Panel className="mt-4 sm:mt-5">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "audio", label: t(`অডিও (${num(audios.length, lang)})`, `Audio (${audios.length})`) },
            { value: "video", label: t(`ভিডিও (${num(videos.length, lang)})`, `Video (${videos.length})`) },
          ]}
        />
        <div className="mt-5">
          {tab === "audio" ? (
            shownAudio.length ? (
              <ul className="space-y-2">
                {shownAudio.map((n, i) => (
                  <AudioRow
                    key={n.id}
                    index={i}
                    track={queue[i]}
                    queue={queue}
                    highlight={n.id === initialPlay}
                    meta={
                      <>
                        {n.lyricist && <span>{t("কথা", "Lyrics")}: {n.lyricist}</span>}
                        {n.composer && <span className="text-brand">{t("সুর", "Tune")}: {n.composer}</span>}
                        {n.artist && <span>{n.artist}</span>}
                      </>
                    }
                  />
                ))}
              </ul>
            ) : (
              <EmptyState icon={Music2} title={t("কিছু পাওয়া যায়নি", "Nothing found")} />
            )
          ) : videos.filter(match).length ? (
            <VideoGrid
              initialId={startsOnVideo ? initialPlay : undefined}
              items={videos.filter(match).map((v) => ({ id: v.id, youtubeId: v.youtubeId!, title: v.title, meta: v.artist ?? v.composer ?? undefined }))}
            />
          ) : (
            <EmptyState icon={Video} title={t("কিছু পাওয়া যায়নি", "Nothing found")} />
          )}
        </div>
      </Panel>
    </div>
  );
}

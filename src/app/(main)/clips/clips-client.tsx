"use client";

import { useMemo, useState } from "react";
import { Clock, Headphones, Play, Sparkles, Video } from "lucide-react";
import type { Clip } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { AudioRow, useInitialPlay } from "@/components/dashboard/audio-row";
import { VideoGrid } from "@/components/dashboard/video-grid";
import { EmptyState, HeaderIconButton, MediaHeader } from "@/components/dashboard/ui";
import { clipTrack } from "@/lib/tracks";
import { num, timeAgo } from "@/lib/format";

const PAGE = 40;

export function ClipsClient({ clips, initialPlay }: { clips: Clip[]; initialPlay?: number }) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const audios = useMemo(() => clips.filter((c) => c.audioUrl), [clips]);
  const videos = useMemo(() => clips.filter((c) => c.youtubeId), [clips]);
  const videoFirst = !!initialPlay && !audios.some((a) => a.id === initialPlay) && videos.some((v) => v.id === initialPlay);
  const [tab, setTab] = useState<"audio" | "video">(videoFirst ? "video" : "audio");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(() => Math.max(PAGE, audios.findIndex((a) => a.id === initialPlay) + 1));

  const needle = q.trim().toLowerCase();
  const shown = useMemo(() => audios.filter((c) => !needle || c.title.toLowerCase().includes(needle)), [audios, needle]);
  const queue = useMemo(() => shown.map(clipTrack), [shown]);
  const allQueue = useMemo(() => audios.map(clipTrack), [audios]);
  useInitialPlay(!videoFirst && initialPlay ? allQueue.find((tr) => tr.id === `clip-${initialPlay}`) : undefined, allQueue);

  return (
    <div>
      <MediaHeader
        title={t("শর্ট ক্লিপ", "Short Clips")}
        count={num(clips.length, lang)}
        query={q}
        onQuery={setQ}
        placeholder={t("ক্লিপ খুঁজুন…", "Search clips…")}
        actions={
          tab === "audio" && queue.length > 0 ? (
            <HeaderIconButton label={t("সব চালান", "Play all")} onClick={() => player.play(queue[0], queue)}>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{t("সব চালান", "Play all")}</span>
            </HeaderIconButton>
          ) : null
        }
        tab={tab}
        onTab={setTab}
        tabs={[
          { value: "audio", label: t("অডিও", "Audio"), count: num(audios.length, lang), icon: Headphones },
          { value: "video", label: t("ভিডিও", "Video"), count: num(videos.length, lang), icon: Video },
        ]}
      />

      <div>
          {tab === "audio" ? (
            shown.length ? (
              <>
                <ul className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-3">
                  {shown.slice(0, limit).map((c, i) => (
                    <AudioRow
                      key={c.id}
                      track={queue[i]}
                      queue={queue}
                      highlight={c.id === initialPlay}
                      meta={
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(c.createdAt, lang)}
                        </span>
                      }
                    />
                  ))}
                </ul>
                {shown.length > limit && (
                  <div className="mt-4 flex justify-center">
                    <button onClick={() => setLimit((l) => l + PAGE)} className="h-11 rounded-full bg-panel-2 px-6 text-sm font-medium text-ink hover:bg-brand hover:text-white">
                      {t(`আরও দেখুন (${num(shown.length - limit, lang)})`, `Show more (${shown.length - limit})`)}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState icon={Sparkles} title={t("কিছু পাওয়া যায়নি", "Nothing found")} />
            )
          ) : videos.length ? (
            <VideoGrid
              initialId={videoFirst ? initialPlay : undefined}
              items={videos
                .filter((v) => !needle || v.title.toLowerCase().includes(needle))
                .map((v) => ({ id: v.id, youtubeId: v.youtubeId!, title: v.title, meta: timeAgo(v.createdAt, lang) }))}
            />
          ) : (
            <EmptyState icon={Video} title={t("কোনো ভিডিও নেই", "No videos yet")} />
          )}
      </div>
    </div>
  );
}

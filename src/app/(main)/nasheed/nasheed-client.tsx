"use client";

import { useMemo, useState } from "react";
import { Music2, Play, Video } from "lucide-react";
import type { Nasheed } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { AudioRow, useInitialPlay } from "@/components/dashboard/audio-row";
import { VideoGrid } from "@/components/dashboard/video-grid";
import { EmptyState, HeaderIconButton, MediaHeader } from "@/components/dashboard/ui";
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

  return (
    <div>
      <MediaHeader
        title={t("হামদ ও নাত", "Hamd & Naat")}
        count={num(nasheeds.length, lang)}
        query={q}
        onQuery={setQ}
        placeholder={t("নাশিদ খুঁজুন…", "Search nasheeds…")}
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
          { value: "audio", label: t("অডিও", "Audio"), count: num(audios.length, lang), icon: Music2 },
          { value: "video", label: t("ভিডিও", "Video"), count: num(videos.length, lang), icon: Video },
        ]}
      />

      <div>
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
    </div>
  );
}

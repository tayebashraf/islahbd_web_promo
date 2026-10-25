"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, Share2 } from "lucide-react";
import type { Track } from "@/components/player/player-provider";
import { usePlayer } from "@/components/player/player-provider";
import { useLang } from "@/components/providers/lang-provider";
import { Equalizer, NumberBadge, PlayButton } from "./ui";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { num } from "@/lib/format";

export function AudioRow({
  track,
  queue,
  index,
  meta,
  aside,
  highlight,
}: {
  track: Track;
  queue: Track[];
  index?: number;
  meta?: React.ReactNode;
  aside?: React.ReactNode;
  highlight?: boolean;
}) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const ref = useRef<HTMLLIElement>(null);
  const [copied, setCopied] = useState(false);
  const current = player.isCurrent(track.id);
  const playing = current && player.playing;

  useEffect(() => {
    if (highlight) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlight]);

  const share = async () => {
    const url = `${SITE_URL}${track.href ?? ""}`;
    try {
      if (navigator.share) await navigator.share({ title: track.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {}
  };

  return (
    <li
      ref={ref}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border p-2.5 transition sm:gap-4 sm:p-3",
        current ? "border-brand/40 bg-brand-soft" : "border-line bg-panel hover:border-brand/40",
        highlight && !current && "ring-2 ring-brand/40",
      )}
    >
      {index !== undefined && (
        <NumberBadge className="hidden sm:flex" n={current ? <Equalizer active={playing} /> : num(index + 1, lang)} />
      )}
      <PlayButton
        playing={playing}
        loading={current && player.loading}
        onClick={() => (playing ? player.pause() : player.play(track, queue))}
        label={playing ? t("থামান", "Pause") : t("শুনুন", "Play")}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[15px] leading-snug text-ink">{track.title}</p>
        {meta && <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-3">{meta}</div>}
      </div>
      {aside && <div className="hidden shrink-0 lg:block">{aside}</div>}
      <div className="flex shrink-0 items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <a
          href={track.src}
          download
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("ডাউনলোড", "Download")}
          title={t("ডাউনলোড", "Download")}
          className="hidden h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-panel hover:text-ink sm:flex"
        >
          <Download className="h-4 w-4" />
        </a>
        <button
          onClick={share}
          aria-label={t("শেয়ার", "Share")}
          title={t("শেয়ার", "Share")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-panel hover:text-ink"
        >
          {copied ? <Check className="h-4 w-4 text-brand" /> : <Share2 className="h-4 w-4" />}
        </button>
      </div>
    </li>
  );
}

/** Autoplays the `?play=` item once after mount (navigation counts as a user gesture). */
export function useInitialPlay(track: Track | undefined, queue: Track[]) {
  const player = usePlayer();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || !track) return;
    done.current = true;
    if (!player.isCurrent(track.id)) player.play(track, queue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);
}

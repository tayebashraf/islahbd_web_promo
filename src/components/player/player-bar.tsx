"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Loader2, Mic2, Music2, Pause, Play, Radio, RotateCcw, RotateCw, SkipBack, SkipForward, Sparkles, X } from "lucide-react";
import { usePlayer, type TrackKind } from "./player-provider";
import { useLang } from "@/components/providers/lang-provider";
import { clock } from "@/lib/format";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<TrackKind, typeof Mic2> = {
  boyan: Mic2,
  nasheed: Music2,
  clip: Sparkles,
  quran: BookOpen,
  recording: Radio,
};

const RATES = [1, 1.25, 1.5, 2, 0.75];

export function PlayerBar() {
  const p = usePlayer();
  const { t } = useLang();
  const Icon = p.current ? KIND_ICON[p.current.kind] : Mic2;
  const pct = p.duration ? (p.time / p.duration) * 100 : 0;
  const hasPrev = p.index > 0;
  const hasNext = p.index + 1 < p.queue.length;

  return (
    <AnimatePresence>
      {p.current && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5 sm:pb-5"
          role="region"
          aria-label={t("অডিও প্লেয়ার", "Audio player")}
        >
          <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-[28px] border border-line bg-panel/95 p-2.5 pr-3 shadow-[0_18px_50px_-12px_rgba(14,26,19,0.28)] backdrop-blur-xl sm:gap-4 sm:p-3 sm:pr-4">
            <Link
              href={p.current.href || "#"}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white hatch sm:h-14 sm:w-14"
              aria-label={p.current.title}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink sm:text-[15px]">{p.current.title}</p>
                  <p className="truncate text-xs text-ink-3">
                    {p.error ? <span className="text-live">{t(p.error, "Couldn't play audio")}</span> : p.current.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  <IconButton label={t("পেছনে ১০ সেকেন্ড", "Back 10s")} onClick={() => p.skip(-10)} className="hidden md:flex">
                    <RotateCcw className="h-4 w-4" />
                  </IconButton>
                  <IconButton label={t("আগের", "Previous")} onClick={p.prev} disabled={!hasPrev && p.time < 5} className="hidden sm:flex">
                    <SkipBack className="h-4 w-4" fill="currentColor" />
                  </IconButton>
                  <button
                    onClick={p.toggle}
                    aria-label={p.playing ? t("থামান", "Pause") : t("চালান", "Play")}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/25 transition hover:bg-brand-strong active:scale-95"
                  >
                    {p.loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : p.playing ? (
                      <Pause className="h-5 w-5" fill="currentColor" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                    )}
                  </button>
                  <IconButton label={t("পরের", "Next")} onClick={p.next} disabled={!hasNext}>
                    <SkipForward className="h-4 w-4" fill="currentColor" />
                  </IconButton>
                  <IconButton label={t("সামনে ১০ সেকেন্ড", "Forward 10s")} onClick={() => p.skip(10)} className="hidden md:flex">
                    <RotateCw className="h-4 w-4" />
                  </IconButton>
                  <button
                    onClick={() => p.setRate(RATES[(RATES.indexOf(p.rate) + 1) % RATES.length])}
                    className="hidden h-9 min-w-12 items-center justify-center rounded-full bg-panel-2 px-2.5 font-num text-xs font-semibold text-ink-2 transition hover:text-ink sm:flex"
                    aria-label={t("গতি", "Playback speed")}
                  >
                    {p.rate}×
                  </button>
                  <IconButton label={t("বন্ধ করুন", "Close")} onClick={p.close}>
                    <X className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <div className="mt-1.5 flex items-center gap-2.5">
                <span className="w-10 text-right font-num text-[11px] text-ink-3">{clock(p.time)}</span>
                <input
                  type="range"
                  className="seek flex-1"
                  min={0}
                  max={p.duration || 0}
                  step={1}
                  value={Math.min(p.time, p.duration || 0)}
                  onChange={(e) => p.seek(Number(e.target.value))}
                  style={{ ["--pct" as string]: `${pct}%` }}
                  aria-label={t("অগ্রগতি", "Seek")}
                />
                <span className="w-10 font-num text-[11px] text-ink-3">{clock(p.duration)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition hover:bg-panel-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent",
        className,
      )}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CalendarClock, Loader2, MapPin, Pause, Play, Users } from "lucide-react";
import type { Boyan, LiveStatus as ApiLiveStatus, RecurringMajlis } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { EXCLUSIVE_AUDIO_EVENT, usePlayer } from "@/components/player/player-provider";
import { formatDate, num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LiveVisualizer } from "./live-visualizer";
import { LiveChat } from "./live-chat";
import { RecentRecordings, RecurringMajlisList, nextOccurrence } from "./listen-sections";

const BACKEND = "https://api.islahbd.com";
const STATUS_URL = `${BACKEND}/api/live/status/`;
const POLL_MS = 5000;
// CDN HLS origins → same-origin proxy paths (see rewrites in next.config.ts).
const PROXIES: [string, string][] = [
  ["https://cdn.islahbd.com/live", "/hls"],
  ["https://cdn2.islahbd.com/live", "/hls2"],
];

// Rewrite CDN HLS URLs to the same-origin proxy to avoid browser CORS blocks.
function toProxiedUrl(streamUrl: string): string {
  const hit = PROXIES.find(([origin]) => streamUrl.startsWith(origin));
  return hit ? streamUrl.replace(hit[0], hit[1]) : streamUrl;
}

type LiveStatus = ApiLiveStatus & { chatOpen?: boolean };

export function ListenClient({ recentBoyans, majlis }: { recentBoyans: Boyan[]; majlis: RecurringMajlis[] }) {
  const { t, lang } = useLang();
  const globalPlayer = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Web Audio analyser for the visualiser. Wired only when hls.js feeds the
  // element (MSE blob) or the source is same-origin: Safari's native HLS and
  // CORS-less sources go silent once routed through Web Audio.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const ensureAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const node = ctx.createAnalyser();
        node.fftSize = 512;
        node.smoothingTimeConstant = 0.8;
        ctx.createMediaElementSource(audio).connect(node);
        node.connect(ctx.destination);
        audioCtxRef.current = ctx;
        setAnalyser(node);
      }
      void audioCtxRef.current.resume();
    } catch {
      /* visualizer falls back to procedural motion */
    }
  }, []);

  const teardownMedia = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    hlsRef.current?.destroy();
    hlsRef.current = null;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  }, []);

  const stop = useCallback(() => {
    teardownMedia();
    setPlaying(false);
    setLoading(false);
    setError("");
  }, [teardownMedia]);

  // One audio source at a time: stop here when the site-wide player starts.
  useEffect(() => {
    const onExclusive = () => stop();
    document.addEventListener(EXCLUSIVE_AUDIO_EVENT, onExclusive);
    return () => document.removeEventListener(EXCLUSIVE_AUDIO_EVENT, onExclusive);
  }, [stop]);

  // Poll live status; tear down when stream goes offline.
  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch(STATUS_URL, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as LiveStatus;
        if (!active) return;
        setStatus(data);
        if (!data.isLive) stop();
      } catch {
        /* transient — keep last status */
      }
    };
    fetchStatus();
    const id = setInterval(fetchStatus, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
      teardownMedia();
    };
  }, [stop, teardownMedia]);

  // Lets the HLS retry timer call the latest `play` without referencing it before declaration.
  const playRef = useRef<(url?: string) => void>(() => {});

  const play = useCallback(
    async (url?: string) => {
      const rawUrl = url ?? status?.streamUrl;
      const streamUrl = rawUrl ? toProxiedUrl(rawUrl) : undefined;
      const audio = audioRef.current;
      if (!streamUrl || !audio) return;

      globalPlayer.pause();
      teardownMedia();
      setError("");
      setLoading(true);

      const isHls = streamUrl.includes(".m3u8");
      // Prefer hls.js wherever MSE exists (newer desktop Chrome claims native HLS
      // but fails on this stream); native playback is for iOS Safari.
      const native = !isHls || (!Hls.isSupported() && !!audio.canPlayType("application/vnd.apple.mpegurl"));
      if (!native || streamUrl.startsWith("/")) ensureAnalyser();

      // Plain audio or Safari/iOS native HLS — just set src and play.
      if (native) {
        audio.src = streamUrl;
        try {
          await audio.play();
          setPlaying(true);
        } catch {
          setError(t("চালানো যায়নি — আবার চেষ্টা করুন", "Couldn't play — try again"));
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!Hls.isSupported()) {
        setError(t("এই ব্রাউজার HLS সাপোর্ট করে না", "This browser doesn't support HLS"));
        setLoading(false);
        return;
      }

      const hls = new Hls({
        lowLatencyMode: true,
        // Retry manifest aggressively — HLS files appear ~4s after RTMP connects.
        manifestLoadingMaxRetry: 8,
        manifestLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 6,
        levelLoadingRetryDelay: 1000,
        fragLoadingMaxRetry: 6,
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(audio);

      hls.once(Hls.Events.MANIFEST_PARSED, async () => {
        try {
          await audio.play();
          setPlaying(true);
        } catch {
          setError(t("চালানো যায়নি — আবার চেষ্টা করুন", "Couldn't play — try again"));
          teardownMedia();
        } finally {
          setLoading(false);
        }
      });

      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          // Stream not ready yet (ffmpeg still starting) — retry in 3s.
          setError(t("স্ট্রিম লোড হচ্ছে, একটু অপেক্ষা করুন…", "Stream is starting, please wait…"));
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            playRef.current(rawUrl); // pass original url; play() will re-proxy it
          }, 3000);
        } else {
          setError(t("স্ট্রিম লোড করা যায়নি", "Couldn't load the stream"));
          teardownMedia();
          setPlaying(false);
          setLoading(false);
        }
      });
    },
    [status?.streamUrl, teardownMedia, t, globalPlayer, ensureAnalyser],
  );
  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const live = status?.isLive ?? false;
  const recordings = status?.recordings?.length ? status.recordings : status?.recording ? [status.recording] : [];
  const upcoming = majlis
    .map((m) => ({ m, next: nextOccurrence(m) }))
    .filter((r) => r.next)
    .sort((a, b) => a.next!.getTime() - b.next!.getTime())[0];

  return (
    <div className="space-y-8 pb-6 sm:space-y-10">
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
          setError("");
        }}
        onWaiting={() => setLoading(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setError(t("অডিও এরর — আবার চেষ্টা করুন", "Audio error — try again"));
          setPlaying(false);
          setLoading(false);
        }}
      />

      {/* ── Live stage: visualiser + floating chat ───────────────── */}
      <section className="overflow-hidden rounded-3xl border border-line bg-panel">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative flex flex-col items-center bg-[linear-gradient(180deg,var(--canvas-2),var(--panel))] px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">
            <div className="flex w-full items-center justify-between gap-2">
              <span
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold",
                  live ? "bg-live/10 text-live" : "bg-panel-2 text-ink-3",
                )}
              >
                <span className="relative flex h-2 w-2">
                  {live && <span className="absolute inset-0 animate-ping rounded-full bg-live" />}
                  <span className={cn("relative h-2 w-2 rounded-full", live ? "bg-live" : "bg-ink-3")} />
                </span>
                {live ? t("সরাসরি চলছে", "Live now") : t("অফলাইন", "Offline")}
              </span>
              {live && (
                <span className="flex items-center gap-1.5 rounded-full bg-panel-2 px-3 py-1 text-[13px] text-ink-2">
                  <Users className="h-3.5 w-3.5 text-brand" />
                  {t(`${num(status?.listeners ?? 0, lang)} জন শুনছেন`, `${status?.listeners ?? 0} listening`)}
                </span>
              )}
            </div>

            <div className="relative my-2 aspect-square w-[210px] sm:w-[240px] lg:w-[260px]">
              <LiveVisualizer analyser={playing ? analyser : null} active={live && playing} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={playing ? stop : () => play()}
                  disabled={!live || loading}
                  aria-label={playing ? t("থামান", "Pause") : t("লাইভ শুনুন", "Listen live")}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full transition sm:h-[72px] sm:w-[72px]",
                    live ? "bg-brand text-white shadow-[0_10px_30px_-8px_var(--brand)] hover:scale-105 active:scale-95" : "cursor-not-allowed bg-panel-2 text-ink-3",
                  )}
                >
                  {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : playing ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="ms-1 h-7 w-7" fill="currentColor" />}
                </button>
              </div>
            </div>

            <div className="w-full text-center">
              <h1 className="line-clamp-2 font-heading text-[20px] leading-snug font-bold text-ink sm:text-2xl">
                {live && status?.title ? status.title : t("এখন লাইভ চলছে না", "Not live right now")}
              </h1>
              {live ? (
                <>
                  {status?.speaker && <p className="mt-1 text-[14.5px] text-ink-2">{status.speaker}</p>}
                  {status?.location && (
                    <p className="mt-1 flex items-center justify-center gap-1 text-[13px] text-ink-3">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
                      <span className="line-clamp-1">{status.location}</span>
                    </p>
                  )}
                </>
              ) : upcoming ? (
                <p className="mx-auto mt-2 inline-flex max-w-full items-center gap-2 rounded-2xl border border-line bg-panel px-3 py-2 text-[13.5px] text-ink-2">
                  <CalendarClock className="h-4 w-4 shrink-0 text-brand" />
                  <span className="truncate">
                    {t("পরবর্তী মজলিস", "Next majlis")}: {upcoming.m.title} · {formatDate(upcoming.next!.toISOString(), lang, { weekday: "short", year: undefined, timeZone: undefined })}
                    {upcoming.m.details[0]?.time && ` · ${upcoming.m.details[0].time}`}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-[14px] text-ink-3">{t("লাইভ শুরু হলে এখানেই শুনতে পারবেন", "You can listen here once the live starts")}</p>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 flex items-center justify-center gap-1.5 text-sm text-live">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col px-4 pt-1 pb-4 sm:px-5 sm:pb-5 lg:pt-5">
            <LiveChat open={live && status?.chatOpen !== false} />
          </div>
        </div>
      </section>

      <RecentRecordings recordings={recordings} boyans={recentBoyans} />
      <RecurringMajlisList majlis={majlis} />
    </div>
  );
}

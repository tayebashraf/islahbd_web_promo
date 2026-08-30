"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Radio, Users, Loader2, AlertCircle, Clock, MapPin } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { cn } from "@/lib/utils";

const BACKEND = "https://api.islahbd.com";
const STATUS_URL = `${BACKEND}/api/live/status/`;
const RECORDING_URL = `${BACKEND}/api/live/recording/`;
const POLL_MS = 5000;
const CDN_ORIGIN = "https://cdn.islahbd.com/live";

// Rewrite CDN HLS URLs to same-origin proxy to avoid browser CORS blocks.
function toProxiedUrl(streamUrl: string): string {
  if (streamUrl.startsWith(CDN_ORIGIN)) {
    return streamUrl.replace(CDN_ORIGIN, "/hls");
  }
  return streamUrl;
}

interface LiveStatus {
  isLive: boolean;
  title: string;
  speaker: string;
  listeners: number;
  provider: string;
  streamUrl: string;
}

interface LastRecording {
  title: string;
  speaker: string;
  location: string;
  audioUrl: string;
  duration: string;
  endedAt: string | null;
}

function isRecording(raw: unknown): raw is LastRecording {
  return !!raw && typeof raw === "object" && !!(raw as LastRecording).audioUrl;
}

function timeAgo(iso: string | null, t: ReturnType<typeof useLang>["t"]): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return t("এইমাত্র", "just now");
  if (mins < 60) return t(`${mins} মিনিট আগে`, `${mins} min ago`);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t(`${hours} ঘণ্টা আগে`, `${hours}h ago`);
  const days = Math.floor(hours / 24);
  return t(`${days} দিন আগে`, `${days}d ago`);
}

function LivePulse({ className }: { className?: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full bg-red-500", className)}
      style={{ opacity: visible ? 1 : 0.2, transition: "opacity 0.3s ease" }}
    />
  );
}

export function ListenClient() {
  const { t } = useLang();
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [recording, setRecording] = useState<LastRecording | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Separate player state for the recent-live recording, so it can play
  // independently of (and be interrupted by) the live stream.
  const recAudioRef = useRef<HTMLAudioElement>(null);
  const [recPlaying, setRecPlaying] = useState(false);

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

  // Fetch the most recent finished broadcast once, and again whenever the
  // live stream ends (a fresh recording appears right after that).
  useEffect(() => {
    let active = true;
    const fetchRecording = async () => {
      try {
        const res = await fetch(RECORDING_URL, { cache: "no-store" });
        if (!res.ok) return;
        const data: unknown = await res.json();
        if (!active) return;
        setRecording(isRecording(data) ? data : null);
      } catch {
        /* transient — keep last known recording */
      }
    };
    fetchRecording();
    return () => {
      active = false;
    };
  }, [status?.isLive]);

  const play = useCallback(
    async (url?: string) => {
      const rawUrl = url ?? status?.streamUrl;
      const streamUrl = rawUrl ? toProxiedUrl(rawUrl) : undefined;
      const audio = audioRef.current;
      if (!streamUrl || !audio) return;

      recAudioRef.current?.pause();
      setRecPlaying(false);

      teardownMedia();
      setError("");
      setLoading(true);

      const isHls = streamUrl.includes(".m3u8");

      // Safari/iOS native HLS — just set src and play.
      if (!isHls || audio.canPlayType("application/vnd.apple.mpegurl")) {
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
            play(rawUrl); // pass original url; play() will re-proxy it
          }, 3000);
        } else {
          setError(t("স্ট্রিম লোড করা যায়নি", "Couldn't load the stream"));
          teardownMedia();
          setPlaying(false);
          setLoading(false);
        }
      });
    },
    [status?.streamUrl, teardownMedia, t],
  );

  const toggleRecording = useCallback(() => {
    const audio = recAudioRef.current;
    if (!audio || !recording) return;
    if (recPlaying) {
      audio.pause();
      return;
    }
    // Interrupt the live stream if it's playing — one audio source at a time.
    stop();
    if (!audio.src) audio.src = recording.audioUrl;
    audio.play().catch(() => setError(t("রেকর্ডিং চালানো যায়নি", "Couldn't play the recording")));
  }, [recPlaying, recording, stop, t]);

  const live = status?.isLive ?? false;

  return (
    <div className="relative min-h-screen overflow-hidden gradient-hero islamic-pattern-subtle pt-24 pb-20">
      {/* Ambient glow orbs, matching the hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px] transition-colors duration-700",
            live ? "bg-red-500/10" : "bg-gold/6",
          )}
        />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-emerald-deep/6 blur-[100px]" />
      </div>

      {/* Geometric ornament, matching the hero */}
      <div className="absolute top-24 right-8 hidden opacity-10 animate-geometric lg:block">
        <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
          <polygon points="60,4 112,30 112,90 60,116 8,90 8,30" stroke="#CBA135" strokeWidth="1.5" />
          <polygon points="60,20 96,40 96,80 60,100 24,80 24,40" stroke="#CBA135" strokeWidth="1" />
          <circle cx="60" cy="60" r="8" stroke="#CBA135" strokeWidth="1" />
        </svg>
      </div>

      <audio
        ref={audioRef}
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
      <audio
        ref={recAudioRef}
        onPlay={() => setRecPlaying(true)}
        onPause={() => setRecPlaying(false)}
        onEnded={() => setRecPlaying(false)}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-gold">
            {t("সরাসরি সম্প্রচার", "Live Broadcast")}
          </span>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            {t("লাইভ শুনুন", "Listen Live")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {t(
              "ব্রাউজার থেকে সরাসরি ওয়াজ, বয়ান ও মজলিশ শুনুন — কোনো অ্যাপ ছাড়াই।",
              "Listen to live Waz, Boyan and Majlis right in your browser — no app needed.",
            )}
          </p>
        </motion.div>

        {/* Live player card */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            "relative overflow-hidden rounded-3xl border bg-card p-10 text-center shadow-xl transition-colors duration-500",
            live ? "border-red-500/25 prayer-card-glow" : "border-border",
          )}
        >
          {live && (
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
          )}

          <div className="relative flex flex-col items-center gap-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={live ? "live" : "offline"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold",
                  live
                    ? "border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {live ? <LivePulse /> : <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />}
                {live ? t("লাইভ চলছে", "Live Now") : t("অফলাইন", "Offline")}
              </motion.div>
            </AnimatePresence>

            <div>
              <h2 className="font-display text-2xl font-bold text-card-foreground sm:text-3xl">
                {live && status?.title ? status.title : t("লাইভ সম্প্রচার", "Live Broadcast")}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {live && status?.speaker ? status.speaker : "islahBD"}
              </p>
            </div>

            <div className="relative">
              {live && (
                <span
                  className="absolute inset-[-6px] rounded-full border border-red-500/30 animate-ping"
                  style={{ animationDuration: "2.2s" }}
                />
              )}
              <button
                onClick={playing ? stop : () => play()}
                disabled={!live || loading}
                aria-label={playing ? t("থামান", "Pause") : t("শুনুন", "Play")}
                className={cn(
                  "relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-2xl transition-all",
                  !live
                    ? "cursor-not-allowed bg-muted text-muted-foreground shadow-none"
                    : loading
                      ? "gradient-gold opacity-80"
                      : "gradient-gold hover:scale-105 hover:brightness-110 active:scale-95",
                )}
              >
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : playing ? (
                  <Pause className="h-9 w-9" fill="currentColor" />
                ) : (
                  <Play className="ml-1 h-9 w-9" fill="currentColor" />
                )}
              </button>
            </div>

            <div className="flex h-5 items-center">
              {live ? (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {t(`${status?.listeners ?? 0} জন শুনছেন`, `${status?.listeners ?? 0} listening`)}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("এখন কোনো লাইভ সম্প্রচার চলছে না।", "No live broadcast right now.")}
                </p>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Recent live (last recording) card */}
        <AnimatePresence>
          {!live && recording && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="card-hover mt-6 rounded-3xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-deep dark:text-emerald-400">
                <Radio className="h-3.5 w-3.5" />
                {t("সাম্প্রতিক লাইভ", "Recent Live")}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleRecording}
                  aria-label={recPlaying ? t("থামান", "Pause") : t("শুনুন", "Play")}
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full gradient-emerald text-white shadow-lg transition hover:scale-105 hover:brightness-110 active:scale-95"
                >
                  {recPlaying ? (
                    <Pause className="h-6 w-6" fill="currentColor" />
                  ) : (
                    <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                  )}
                </button>

                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate font-display text-lg font-bold text-card-foreground">
                    {recording.title || t("সরাসরি সম্প্রচার", "Live Broadcast")}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {recording.speaker || "islahBD"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/80">
                    {recording.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recording.duration}
                      </span>
                    )}
                    {recording.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {recording.location}
                      </span>
                    )}
                    {recording.endedAt && <span>{timeAgo(recording.endedAt, t)}</span>}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

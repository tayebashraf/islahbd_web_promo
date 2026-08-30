"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Play, Pause, Radio, Users, Loader2, AlertCircle, Clock, MapPin } from "lucide-react";
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

function timeAgoBn(iso: string | null): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  return `${days} দিন আগে`;
}

export function ListenClient() {
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
          setError("চালানো যায়নি — আবার চেষ্টা করুন");
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!Hls.isSupported()) {
        setError("এই ব্রাউজার HLS সাপোর্ট করে না");
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
          setError("চালানো যায়নি — আবার চেষ্টা করুন");
          teardownMedia();
        } finally {
          setLoading(false);
        }
      });

      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          // Stream not ready yet (ffmpeg still starting) — retry in 3s.
          setError("স্ট্রিম লোড হচ্ছে, একটু অপেক্ষা করুন…");
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            play(rawUrl); // pass original url; play() will re-proxy it
          }, 3000);
        } else {
          setError("স্ট্রিম লোড করা যায়নি");
          teardownMedia();
          setPlaying(false);
          setLoading(false);
        }
      });
    },
    [status?.streamUrl, teardownMedia],
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
    audio.play().catch(() => setError("রেকর্ডিং চালানো যায়নি"));
  }, [recPlaying, recording, stop]);

  const live = status?.isLive ?? false;

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md flex-col gap-6 px-4 py-12">
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
          setError("অডিও এরর — আবার চেষ্টা করুন");
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

      {/* ── Live player card ── */}
      <section
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-sm",
          live && "border-[#CBA135]/30",
        )}
      >
        {/* Ambient glow when live */}
        {live && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#CBA135]/10 via-transparent to-transparent" />
        )}

        <div className="relative flex flex-col items-center gap-6">
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold",
              live
                ? "bg-red-500/15 text-red-600 dark:text-red-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                live ? "animate-pulse bg-red-500" : "bg-muted-foreground/50",
              )}
            />
            {live ? "সরাসরি সম্প্রচার" : "অফলাইন"}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-card-foreground">
              {live && status?.title ? status.title : "লাইভ সম্প্রচার"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {live && status?.speaker ? status.speaker : "ইসলাহবিডি"}
            </p>
          </div>

          <button
            onClick={playing ? stop : () => play()}
            disabled={!live || loading}
            aria-label={playing ? "থামান" : "শুনুন"}
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition",
              !live
                ? "cursor-not-allowed bg-muted text-muted-foreground shadow-none"
                : loading
                  ? "bg-[#CBA135]/70"
                  : "bg-[#CBA135] hover:scale-105 hover:bg-[#b8912e] active:scale-95",
            )}
          >
            {loading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : playing ? (
              <Pause className="h-8 w-8" fill="currentColor" />
            ) : (
              <Play className="ml-1 h-8 w-8" fill="currentColor" />
            )}
          </button>

          {live ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {status?.listeners ?? 0} জন শুনছেন
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              এখন কোনো লাইভ সম্প্রচার চলছে না।
            </p>
          )}

          {error && (
            <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ── Recent live (last recording) card ── */}
      {!live && recording && (
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#065F46] dark:text-[#10B981]">
            <Radio className="h-3.5 w-3.5" />
            সাম্প্রতিক লাইভ
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleRecording}
              aria-label={recPlaying ? "থামান" : "শুনুন"}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#065F46] text-white shadow-md transition hover:scale-105 active:scale-95 dark:bg-[#059669]"
            >
              {recPlaying ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
              )}
            </button>

            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-bold text-card-foreground">
                {recording.title || "সরাসরি সম্প্রচার"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {recording.speaker || "ইসলাহবিডি"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground/80">
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
                {recording.endedAt && <span>{timeAgoBn(recording.endedAt)}</span>}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";

const BACKEND = "https://islahbd-production.up.railway.app";
const STATUS_URL = `${BACKEND}/api/live/status/`;
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

export function ListenClient() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const play = useCallback(
    async (url?: string) => {
      const rawUrl = url ?? status?.streamUrl;
      const streamUrl = rawUrl ? toProxiedUrl(rawUrl) : undefined;
      const audio = audioRef.current;
      if (!streamUrl || !audio) return;

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

  const live = status?.isLive ?? false;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-6 px-4 py-12 text-center">
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

      {/* Live / Offline badge */}
      <div
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
          live
            ? "bg-red-500/15 text-red-600 dark:text-red-400"
            : "bg-gray-500/10 text-gray-500"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-red-500" : "bg-gray-400"}`}
        />
        {live ? "LIVE" : "অফলাইন"}
      </div>

      {/* Title / speaker */}
      <div>
        <h1 className="text-2xl font-extrabold">
          {live && status?.title ? status.title : "লাইভ সম্প্রচার"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {live && status?.speaker ? status.speaker : "ইসলাহবিডি"}
        </p>
      </div>

      {/* Play / Pause button */}
      <button
        onClick={playing ? stop : () => play()}
        disabled={!live || loading}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition ${
          !live
            ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700"
            : loading
              ? "bg-gradient-to-br from-violet-400 to-sky-300"
              : "bg-gradient-to-br from-violet-500 to-sky-400 hover:scale-105 active:scale-95"
        }`}
        aria-label={playing ? "থামান" : "শুনুন"}
      >
        {loading ? (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : playing ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>

      {/* Listener count */}
      {live && (
        <p className="text-xs text-gray-400">{status?.listeners ?? 0} জন শুনছেন</p>
      )}
      {!live && (
        <p className="text-sm text-gray-400">এখন কোনো লাইভ সম্প্রচার চলছে না।</p>
      )}
      {error && <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>}
    </main>
  );
}

function PlayIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const BACKEND = "https://islahbd-production.up.railway.app";
const STATUS_URL = `${BACKEND}/api/live/status/`;
const POLL_MS = 15000;

interface LiveStatus {
  isLive: boolean;
  title: string;
  speaker: string;
  listeners: number;
  provider: string;
  streamUrl: string; // resolved playback url (HLS .m3u8 or Icecast mount)
}

export function ListenClient() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Detach hls.js and pause the media element. React state (playing/loading)
  // is synced by the <audio> onPause handler, so we never setState in effects.
  const teardownMedia = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    hlsRef.current?.destroy();
    hlsRef.current = null;
  };

  // Poll live status from the backend; auto-tear-down when it goes offline.
  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch(STATUS_URL, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as LiveStatus;
        if (!active) return;
        setStatus(data);
        if (!data.isLive) teardownMedia();
      } catch {
        /* transient network error — keep last known status */
      }
    };
    fetchStatus();
    const id = setInterval(fetchStatus, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
      teardownMedia();
    };
  }, []);

  const stop = () => {
    teardownMedia();
    setPlaying(false);
    setLoading(false);
  };

  const play = async () => {
    const url = status?.streamUrl;
    const audio = audioRef.current;
    if (!url || !audio) return;
    setError("");
    setLoading(true);

    // Safari/iOS play HLS natively; everyone else needs hls.js for .m3u8.
    const isHls = url.includes(".m3u8");
    try {
      if (isHls && !audio.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
        const hls = new Hls({ lowLatencyMode: true });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) {
            setError("স্ট্রিম লোড করা যায়নি");
            stop();
          }
        });
      } else {
        audio.src = url;
      }
      await audio.play();
      setPlaying(true);
    } catch {
      setError("চালানো যায়নি — আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  const live = status?.isLive ?? false;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <audio
        ref={audioRef}
        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onWaiting={() => setLoading(true)}
        onPause={() => setPlaying(false)}
      />

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

      <div>
        <h1 className="text-2xl font-extrabold">
          {live && status?.title ? status.title : "লাইভ সম্প্রচার"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {live && status?.speaker ? status.speaker : "ইসলাহবিডি"}
        </p>
      </div>

      <button
        onClick={playing ? stop : play}
        disabled={!live || loading}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition ${
          !live
            ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700"
            : "bg-gradient-to-br from-violet-500 to-sky-400 hover:scale-105"
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

      {live && (
        <p className="text-xs text-gray-400">{status?.listeners ?? 0} জন শুনছেন</p>
      )}
      {!live && (
        <p className="text-sm text-gray-400">এখন কোনো লাইভ সম্প্রচার চলছে না।</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
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

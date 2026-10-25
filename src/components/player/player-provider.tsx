"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type TrackKind = "boyan" | "nasheed" | "clip" | "quran" | "recording";

export interface Track {
  id: string;
  title: string;
  subtitle?: string;
  src: string;
  kind: TrackKind;
  href?: string;
}

interface PlayerState {
  current: Track | null;
  queue: Track[];
  index: number;
  playing: boolean;
  loading: boolean;
  time: number;
  duration: number;
  rate: number;
  error: string;
}

interface PlayerApi extends PlayerState {
  /** Plays `track`; when `queue` is given it replaces the up-next list. */
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  setRate: (rate: number) => void;
  close: () => void;
  isCurrent: (id: string) => boolean;
}

const PlayerContext = createContext<PlayerApi | null>(null);

const STORAGE_KEY = "islahbd-player";
/** Fired when the global player starts, so page-local players (live HLS) can yield. */
export const EXCLUSIVE_AUDIO_EVENT = "islahbd:exclusive-audio";

const KIND_LABEL: Record<TrackKind, string> = {
  boyan: "বয়ান",
  nasheed: "হামদ ও নাত",
  clip: "শর্ট ক্লিপ",
  quran: "কুরআন তিলাওয়াত",
  recording: "লাইভ রেকর্ডিং",
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeAt = useRef(0);
  const [state, setState] = useState<PlayerState>({
    current: null,
    queue: [],
    index: -1,
    playing: false,
    loading: false,
    time: 0,
    duration: 0,
    rate: 1,
    error: "",
  });
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  });

  const patch = useCallback((p: Partial<PlayerState>) => setState((s) => ({ ...s, ...p })), []);

  const load = useCallback(
    (track: Track, autoplay: boolean, startAt = 0) => {
      const audio = audioRef.current;
      if (!audio) return;
      resumeAt.current = startAt;
      audio.src = track.src;
      audio.playbackRate = stateRef.current.rate;
      if (autoplay) {
        document.dispatchEvent(new CustomEvent(EXCLUSIVE_AUDIO_EVENT, { detail: "global" }));
        patch({ loading: true, error: "" });
        audio.play().catch(() => patch({ loading: false, playing: false }));
      }
    },
    [patch],
  );

  const play = useCallback(
    (track: Track, queue?: Track[]) => {
      const s = stateRef.current;
      if (s.current?.id === track.id && audioRef.current?.src) {
        document.dispatchEvent(new CustomEvent(EXCLUSIVE_AUDIO_EVENT, { detail: "global" }));
        audioRef.current.play().catch(() => {});
        return;
      }
      const q = queue && queue.length ? queue : s.queue.some((t) => t.id === track.id) ? s.queue : [track];
      const index = Math.max(0, q.findIndex((t) => t.id === track.id));
      setState((prev) => ({ ...prev, current: track, queue: q, index, time: 0, duration: 0 }));
      load(track, true);
    },
    [load],
  );

  const goTo = useCallback(
    (index: number) => {
      const s = stateRef.current;
      const track = s.queue[index];
      if (!track) return;
      setState((prev) => ({ ...prev, current: track, index, time: 0, duration: 0 }));
      load(track, true);
    },
    [load],
  );

  const next = useCallback(() => goTo(stateRef.current.index + 1), [goTo]);
  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 5) {
      audio.currentTime = 0;
      return;
    }
    goTo(stateRef.current.index - 1);
  }, [goTo]);

  const pause = useCallback(() => audioRef.current?.pause(), []);
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !stateRef.current.current) return;
    if (audio.paused) {
      document.dispatchEvent(new CustomEvent(EXCLUSIVE_AUDIO_EVENT, { detail: "global" }));
      audio.play().catch(() => {});
    } else audio.pause();
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(seconds)) audio.currentTime = Math.max(0, seconds);
  }, []);
  const skip = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime + delta);
  }, []);

  const setRate = useCallback(
    (rate: number) => {
      if (audioRef.current) audioRef.current.playbackRate = rate;
      patch({ rate });
    },
    [patch],
  );

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    patch({ current: null, queue: [], index: -1, playing: false, loading: false, time: 0, duration: 0 });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [patch]);

  // Restore the last session (paused) so a reload keeps your place.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { track: Track; time: number; queue?: Track[] };
      if (!saved?.track?.src) return;
      const queue = saved.queue?.length ? saved.queue : [saved.track];
      // One-time restore from storage after hydration (SSR has no localStorage).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((s) => ({
        ...s,
        current: saved.track,
        queue,
        index: Math.max(0, queue.findIndex((t) => t.id === saved.track.id)),
        time: saved.time || 0,
      }));
      load(saved.track, false, saved.time || 0);
    } catch {}
  }, [load]);

  const { current } = state;

  // Persist position every few seconds.
  useEffect(() => {
    if (!current) return;
    const id = setInterval(() => {
      const s = stateRef.current;
      if (!s.current) return;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ track: s.current, time: audioRef.current?.currentTime ?? 0, queue: s.queue.slice(0, 200) }),
        );
      } catch {}
    }, 4000);
    return () => clearInterval(id);
  }, [current]);

  // Lock-screen / hardware media keys.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.subtitle || "islahbd",
      album: KIND_LABEL[current.kind],
      artwork: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    });
    const ms = navigator.mediaSession;
    ms.setActionHandler("play", () => toggle());
    ms.setActionHandler("pause", () => pause());
    ms.setActionHandler("previoustrack", () => prev());
    ms.setActionHandler("nexttrack", () => next());
    ms.setActionHandler("seekbackward", () => skip(-10));
    ms.setActionHandler("seekforward", () => skip(10));
  }, [current, toggle, pause, prev, next, skip]);

  const api = useMemo<PlayerApi>(
    () => ({
      ...state,
      play,
      toggle,
      pause,
      next,
      prev,
      seek,
      skip,
      setRate,
      close,
      isCurrent: (id: string) => current?.id === id,
    }),
    [state, current, play, toggle, pause, next, prev, seek, skip, setRate, close],
  );

  return (
    <PlayerContext.Provider value={api}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onLoadedMetadata={(e) => {
          const a = e.currentTarget;
          if (resumeAt.current) {
            a.currentTime = resumeAt.current;
            resumeAt.current = 0;
          }
          patch({ duration: a.duration || 0 });
        }}
        onDurationChange={(e) => patch({ duration: e.currentTarget.duration || 0 })}
        onTimeUpdate={(e) => patch({ time: e.currentTarget.currentTime })}
        onPlaying={() => patch({ playing: true, loading: false, error: "" })}
        onPlay={() => patch({ playing: true })}
        onPause={() => patch({ playing: false })}
        onWaiting={() => patch({ loading: true })}
        onCanPlay={() => patch({ loading: false })}
        onEnded={() => {
          const s = stateRef.current;
          if (s.index + 1 < s.queue.length) goTo(s.index + 1);
          else patch({ playing: false });
        }}
        onError={() => {
          if (!stateRef.current.current) return;
          patch({ playing: false, loading: false, error: "অডিও চালানো যায়নি" });
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerApi {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

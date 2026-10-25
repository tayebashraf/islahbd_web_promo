"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { usePlayer } from "@/components/player/player-provider";
import { useLang } from "@/components/providers/lang-provider";
import { youtubeThumb } from "@/lib/format";

export interface VideoItem {
  id: number;
  youtubeId: string;
  title: string;
  meta?: string;
}

export function VideoGrid({ items, initialId }: { items: VideoItem[]; initialId?: number }) {
  const [open, setOpen] = useState<VideoItem | null>(() => items.find((v) => v.id === initialId) ?? null);
  const player = usePlayer();

  useEffect(() => {
    if (open) player.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((v) => (
          <li key={v.id}>
            <button onClick={() => setOpen(v)} className="group block w-full text-left">
              <span className="relative block aspect-video overflow-hidden rounded-[22px] bg-panel-2">
                <Image src={youtubeThumb(v.youtubeId)} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-brand-strong shadow-lg transition group-hover:scale-110">
                  <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                </span>
              </span>
              <span className="mt-2.5 block px-1">
                <span className="line-clamp-2 text-sm font-medium text-ink">{v.title}</span>
                {v.meta && <span className="mt-0.5 block truncate text-xs text-ink-3">{v.meta}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <VideoModal video={open} onClose={() => setOpen(null)} />
    </>
  );
}

function VideoModal({ video, onClose }: { video: VideoItem | null; onClose: () => void }) {
  const { t } = useLang();
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
        >
          <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-3 text-white">
              <p className="truncate text-sm font-medium">{video.title}</p>
              <button onClick={onClose} aria-label={t("বন্ধ করুন", "Close")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video overflow-hidden rounded-[22px] bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

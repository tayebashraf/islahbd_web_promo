"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Images, X } from "lucide-react";
import type { GalleryAlbum, Wallpaper } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, PageHeader, Panel, Segmented } from "@/components/dashboard/ui";
import { formatDate, num } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Shot {
  url: string;
  title: string;
}

export function GalleryClient({ albums, wallpapers, initialTab }: { albums: GalleryAlbum[]; wallpapers: Wallpaper[]; initialTab?: "wallpapers" }) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState<"albums" | "wallpapers">(initialTab ?? (albums.length ? "albums" : "wallpapers"));
  const [albumId, setAlbumId] = useState(albums[0]?.id);
  const [viewer, setViewer] = useState<{ shots: Shot[]; index: number } | null>(null);
  const album = albums.find((a) => a.id === albumId);
  const photos = album ? [...album.photos].sort((a, b) => a.order - b.order) : [];

  return (
    <div>
      <PageHeader
        eyebrow={t("ছবি", "Photos")}
        title={t("গ্যালারি", "Gallery")}
        muted={t(`${num(albums.reduce((s, a) => s + a.imageCount, 0), lang)}টি ছবি`, "")}
        actions={
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "albums", label: t("অ্যালবাম", "Albums") },
              { value: "wallpapers", label: t("ওয়ালপেপার", "Wallpapers") },
            ]}
          />
        }
      />

      {tab === "albums" ? (
        albums.length === 0 ? (
          <EmptyState icon={Images} title={t("কোনো অ্যালবাম নেই", "No albums yet")} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {albums.map((a) => {
                const cover = a.coverUrl || a.photos[0]?.url;
                const on = a.id === albumId;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAlbumId(a.id)}
                    className={cn("panel flex items-center gap-4 p-3 text-start transition", on ? "ring-2 ring-brand" : "hover:ring-2 hover:ring-brand/20")}
                  >
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-panel-2">
                      {cover && <Image src={cover} alt="" fill sizes="64px" className="object-cover" unoptimized />}
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-semibold text-ink">{a.title}</span>
                      <span className="mt-0.5 block text-xs text-ink-3">
                        {t(`${num(a.imageCount, lang)}টি ছবি`, `${a.imageCount} photos`)} · {formatDate(a.createdAt, lang)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {album && (
              <Panel className="mt-4 sm:mt-5">
                <h2 className="text-base font-semibold text-ink">{album.title}</h2>
                <div className="mt-4 columns-2 gap-3 md:columns-3 xl:columns-4 [&>*]:mb-3">
                  {photos.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setViewer({ shots: photos.map((x) => ({ url: x.url, title: album.title })), index: i })}
                      className="block w-full overflow-hidden rounded-[18px] bg-panel-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={album.title} loading="lazy" className="w-full transition duration-500 hover:scale-105" />
                    </button>
                  ))}
                </div>
              </Panel>
            )}
          </>
        )
      ) : wallpapers.length === 0 ? (
        <EmptyState icon={Images} title={t("কোনো ওয়ালপেপার নেই", "No wallpapers yet")} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
          {wallpapers.map((w, i) => (
            <div key={w.id} className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-panel-2">
              <button onClick={() => setViewer({ shots: wallpapers.map((x) => ({ url: x.url, title: x.title })), index: i })} className="absolute inset-0">
                <Image src={w.url} alt={w.title} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
              </button>
              <a
                href={w.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 flex h-10 items-center gap-1.5 rounded-full bg-white/95 px-3.5 text-xs font-semibold text-brand-strong shadow-lg"
              >
                <Download className="h-3.5 w-3.5" /> {t("ডাউনলোড", "Download")}
              </a>
            </div>
          ))}
        </div>
      )}

      <Lightbox state={viewer} onClose={() => setViewer(null)} onIndex={(index) => setViewer((v) => (v ? { ...v, index } : v))} />
    </div>
  );
}

function Lightbox({ state, onClose, onIndex }: { state: { shots: Shot[]; index: number } | null; onClose: () => void; onIndex: (i: number) => void }) {
  const { t } = useLang();
  const count = state?.shots.length ?? 0;
  const go = useCallback((d: number) => state && onIndex((state.index + d + count) % count), [state, count, onIndex]);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, go, onClose]);

  const shot = state?.shots[state.index];
  return (
    <AnimatePresence>
      {shot && (
        <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot.url} alt={shot.title} className="max-h-[85vh] max-w-full rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={onClose} aria-label={t("বন্ধ করুন", "Close")} className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
            <X className="h-5 w-5" />
          </button>
          {count > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t("আগের", "Previous")} className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t("পরের", "Next")} className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <a href={shot.url} download target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="absolute bottom-5 flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-strong">
            <Download className="h-4 w-4" /> {t("ডাউনলোড", "Download")}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

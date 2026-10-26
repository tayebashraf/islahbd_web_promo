"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Moon, Sun } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { useStoredString } from "@/lib/use-client-store";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { HAFEZI_JUZ_START, HAFEZI_PAGES, HAFEZI_PAGE_KEY, HAFEZI_PDF, HAFEZI_PDF_OFFSET, HAFEZI_SURAH_START, QURAN_SURAHS } from "@/lib/quran";

const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38";

type PdfPage = {
  getViewport: (o: { scale: number }) => { width: number; height: number };
  render: (o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void>; cancel: () => void };
};
type PdfDoc = { numPages: number; getPage: (n: number) => Promise<PdfPage> };
type PdfLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: { url: string; disableRange?: boolean }) => { promise: Promise<PdfDoc>; onProgress?: (p: { loaded: number; total: number }) => void };
};

let docPromise: Promise<PdfDoc> | null = null;

/** Loads pdf.js from the CDN once and opens the mushaf; the document is shared across visits. */
function openMushaf(onProgress: (ratio: number) => void): Promise<PdfDoc> {
  if (!docPromise) {
    docPromise = (import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${PDFJS}/pdf.min.mjs`) as Promise<PdfLib>).then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = `${PDFJS}/pdf.worker.min.mjs`;
      const task = lib.getDocument({ url: HAFEZI_PDF });
      task.onProgress = (p) => p.total && onProgress(p.loaded / p.total);
      return task.promise;
    });
    docPromise.catch(() => (docPromise = null));
  }
  return docPromise;
}

/** The scanned pages carry the scanner's web address along the bottom edge; trim it away. */
const TRIM_BOTTOM = 0.035;

const clampPage = (p: number) => Math.min(HAFEZI_PAGES, Math.max(1, Math.round(p) || 1));

/** Which surah a mushaf page falls in (the last surah starting on or before it). */
function surahOnPage(page: number) {
  let s = 1;
  for (let i = 1; i <= 114; i++) if (HAFEZI_SURAH_START[i] <= page) s = i;
  return s;
}
function juzOnPage(page: number) {
  let j = 1;
  for (let i = 1; i <= 30; i++) if (HAFEZI_JUZ_START[i] <= page) j = i;
  return j;
}

function PageCanvas({ doc, page, night }: { doc: PdfDoc; page: number; night: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState<number | null>(null);
  const [ratio, setRatio] = useState(0.68);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let task: { cancel: () => void } | null = null;
    let alive = true;
    doc.getPage(page + HAFEZI_PDF_OFFSET).then((p) => {
      if (!alive) return;
      const base = p.getViewport({ scale: 1 });
      setRatio(base.width / (base.height * (1 - TRIM_BOTTOM)));
      const width = canvas.parentElement?.clientWidth || base.width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const viewport = p.getViewport({ scale: (width / base.width) * dpr });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const r = p.render({ canvasContext: ctx, viewport });
      task = r;
      r.promise.then(() => alive && setReady(page)).catch(() => {});
    });
    return () => {
      alive = false;
      task?.cancel();
    };
  }, [doc, page]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,.25)]" style={{ aspectRatio: ratio }}>
      <canvas ref={ref} className={cn("absolute inset-x-0 top-0 block h-auto w-full transition-opacity duration-300", ready === page ? "opacity-100" : "opacity-0", night && "invert hue-rotate-180")} />
      {ready !== page && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      )}
    </div>
  );
}

const WIDE = "(min-width: 1024px)";
function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

export function HafeziReader() {
  const { t, lang } = useLang();
  const [savedPage, setSavedPage] = useStoredString(HAFEZI_PAGE_KEY);
  const page = clampPage(Number(savedPage) || 1);
  const setPage = useCallback((p: number) => setSavedPage(String(clampPage(p))), [setSavedPage]);
  const [doc, setDoc] = useState<PdfDoc | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [night, setNight] = useState(false);
  const wide = useWide();
  const touch = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    openMushaf((r) => alive && setProgress(r))
      .then((d) => alive && setDoc(d))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  // On wide screens show an open book: odd page on the right, even on the left.
  const step = wide ? 2 : 1;
  const right = wide ? (page % 2 === 1 ? page : page - 1) : page;
  const left = wide && right + 1 <= HAFEZI_PAGES ? right + 1 : null;
  const next = useCallback(() => setPage(right + step), [right, step, setPage]);
  const prev = useCallback(() => setPage(right - step), [right, step, setPage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,select,textarea")) return;
      // The mushaf reads right to left: ← moves forward.
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const surah = surahOnPage(right);
  const juz = juzOnPage(right);

  return (
    <div className="mx-auto max-w-[1100px] pb-10">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/quran" aria-label={t("ফিরে যান", "Back")} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink hover:border-brand/40">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-[20px] font-bold text-ink sm:text-[24px]">{t("হাফেজী কুরআন", "Hafezi Quran")}</h1>
          <p className="truncate text-[13px] text-ink-3">
            {t(`সূরা ${QURAN_SURAHS[surah - 1].bangla} · পারা ${num(juz, lang)}`, `Surah ${QURAN_SURAHS[surah - 1].english} · Juz ${juz}`)}
          </p>
        </div>
        <button
          onClick={() => setNight((v) => !v)}
          aria-label={t("রাতের মোড", "Night mode")}
          className={cn("flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-ink hover:border-brand/40", night && "border-brand bg-brand text-white")}
        >
          {night ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <select value={surah} onChange={(e) => setPage(HAFEZI_SURAH_START[Number(e.target.value)])} aria-label={t("সূরা", "Surah")} className="h-10 min-w-0 rounded-xl border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-brand">
          {QURAN_SURAHS.map((s) => (
            <option key={s.number} value={s.number}>
              {num(s.number, lang)}. {lang === "bn" ? s.bangla : s.english}
            </option>
          ))}
        </select>
        <select value={juz} onChange={(e) => setPage(HAFEZI_JUZ_START[Number(e.target.value)])} aria-label={t("পারা", "Juz")} className="h-10 min-w-0 rounded-xl border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-brand">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
            <option key={j} value={j}>
              {t(`পারা ${num(j, lang)}`, `Juz ${j}`)}
            </option>
          ))}
        </select>
        <form
          key={page}
          onSubmit={(e) => {
            e.preventDefault();
            setPage(Number(new FormData(e.currentTarget).get("p")));
          }}
          className="flex h-10 min-w-0 items-center rounded-xl border border-line bg-panel px-2 focus-within:border-brand"
        >
          <span className="shrink-0 text-[12px] text-ink-3">{t("পৃষ্ঠা", "Page")}</span>
          <input name="p" type="number" min={1} max={HAFEZI_PAGES} defaultValue={page} className="w-full min-w-0 bg-transparent px-1 text-center font-num text-sm text-ink outline-none" />
        </form>
      </div>

      {error ? (
        <div className="rounded-2xl border border-line bg-panel p-10 text-center text-ink-3">{t("কুরআন লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।", "Could not load the mushaf. Check your connection and try again.")}</div>
      ) : !doc ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-panel py-24">
          <Loader2 className="h-7 w-7 animate-spin text-brand" />
          <div className="h-1.5 w-56 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="text-sm text-ink-3">{t(`কুরআন লোড হচ্ছে… ${num(Math.round(progress * 100), lang)}%`, `Loading the mushaf… ${Math.round(progress * 100)}%`)}</p>
        </div>
      ) : (
        <div
          className="relative"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            touch.current = null;
            // Swiping right turns to the next page, like a printed mushaf.
            if (dx > 60) next();
            if (dx < -60) prev();
          }}
        >
          <div dir="rtl" className={cn("mx-auto grid gap-3", wide ? "max-w-[980px] grid-cols-2" : "max-w-[520px] grid-cols-1")}>
            <PageCanvas doc={doc} page={right} night={night} />
            {left && <PageCanvas doc={doc} page={left} night={night} />}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-3">
        <button onClick={next} disabled={(left ?? right) >= HAFEZI_PAGES} className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-panel px-5 text-sm font-medium text-ink hover:border-brand/40 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" />
          {t("পরের পৃষ্ঠা", "Next")}
        </button>
        <span className="min-w-[88px] text-center font-num text-sm text-ink-3">
          {num(right, lang)}
          {left ? `–${num(left, lang)}` : ""} / {num(HAFEZI_PAGES, lang)}
        </span>
        <button onClick={prev} disabled={right <= 1} className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-panel px-5 text-sm font-medium text-ink hover:border-brand/40 disabled:opacity-40">
          {t("আগের পৃষ্ঠা", "Previous")}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

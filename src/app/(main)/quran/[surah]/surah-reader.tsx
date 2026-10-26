"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookMarked,
  BookOpenText,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader2,
  Pause,
  Play,
  Settings2,
  Share2,
  Square,
  X,
} from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { useStoredString } from "@/lib/use-client-store";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  AYAH_QARIS,
  BISMILLAH,
  BOOKMARKS_KEY,
  DEFAULT_SETTINGS,
  LAST_READ_KEY,
  QURAN_SURAHS,
  SETTINGS_KEY,
  TAFSIRS,
  TRANSLATIONS,
  ayahAudioUrl,
  loadSurah,
  loadTafsir,
  loadTawzihul,
  loadWordByWord,
  parseBookmarks,
  parseJson,
  stripBasmala,
  type Ayah,
  type QuranSettings,
  type Word,
} from "@/lib/quran";

/** Persisted reader settings (font sizes, translation, word-by-word, qari, tafsir). */
function useQuranSettings() {
  const [raw, setRaw] = useStoredString(SETTINGS_KEY);
  const settings = parseJson<QuranSettings>(raw, DEFAULT_SETTINGS);
  const update = (patch: Partial<QuranSettings>) => setRaw(JSON.stringify({ ...settings, ...patch }));
  return [settings, update] as const;
}

export function useQuranBookmarks() {
  const [raw, setRaw] = useStoredString(BOOKMARKS_KEY);
  const list = parseBookmarks(raw);
  const toggle = (key: string) => setRaw(JSON.stringify(list.includes(key) ? list.filter((k) => k !== key) : [key, ...list]));
  return { list, has: (key: string) => list.includes(key), toggle };
}

export function SurahReader({ number }: { number: number }) {
  const { t, lang } = useLang();
  const surah = QURAN_SURAHS[number - 1];
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [error, setError] = useState(false);
  const [settings, update] = useQuranSettings();
  const [panel, setPanel] = useState(false);
  const [tafsirFor, setTafsirFor] = useState<number | null>(null);
  const bookmarks = useQuranBookmarks();
  const [, setLastRead] = useStoredString(LAST_READ_KEY);

  useEffect(() => {
    let alive = true;
    loadSurah(number)
      .then((rows) => alive && setAyahs(rows))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [number]);

  // Optional second translation and word-by-word, loaded only when switched on.
  const [tawzihul, setTawzihul] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    if (settings.translation !== "tawzihul" || tawzihul) return;
    loadTawzihul().then(setTawzihul).catch(() => {});
  }, [settings.translation, tawzihul]);
  const [wbw, setWbw] = useState<Record<number, Word[]> | null>(null);
  const wbwLoading = settings.wordByWord && !wbw;
  useEffect(() => {
    if (!settings.wordByWord || wbw) return;
    let alive = true;
    loadWordByWord(number, surah.ayahs)
      .then((w) => alive && setWbw(w))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [settings.wordByWord, wbw, number, surah.ayahs]);

  /* ── Recitation: one ayah at a time, optionally continuing ── */
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [continuous, setContinuous] = useState(false);
  const qari = AYAH_QARIS.find((q) => q.id === settings.qari) ?? AYAH_QARIS[0];

  const playAyah = useCallback(
    (n: number, keepGoing: boolean) => {
      const el = audioRef.current;
      if (!el || !qari) return;
      el.src = ayahAudioUrl(qari, number, n);
      el.play().catch(() => setPlaying(null));
      setPlaying(n);
      setContinuous(keepGoing);
      document.getElementById(`ayah-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [number, qari],
  );
  const stop = () => {
    audioRef.current?.pause();
    setPlaying(null);
    setContinuous(false);
  };
  const onEnded = () => {
    if (continuous && playing && playing < surah.ayahs) playAyah(playing + 1, true);
    else setPlaying(null);
  };

  /* ── Reading position: remember the ayah nearest the middle of the screen ── */
  useEffect(() => {
    if (!ayahs) return;
    const hash = window.location.hash.match(/^#ayah-(\d+)$/);
    if (hash) requestAnimationFrame(() => document.getElementById(`ayah-${hash[1]}`)?.scrollIntoView({ block: "center" }));
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).map((e) => Number((e.target as HTMLElement).dataset.n));
        if (!seen.length) return;
        clearTimeout(timer);
        timer = setTimeout(() => setLastRead(JSON.stringify({ s: number, a: Math.min(...seen), at: Date.now() })), 600);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-ayah]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [ayahs, number, setLastRead]);

  const translationOf = (a: Ayah) => (settings.translation === "tawzihul" ? (tawzihul?.[`${number}:${a.n}`] ?? (tawzihul ? a.t : "")) : a.t);
  const prev = number > 1 ? QURAN_SURAHS[number - 2] : null;
  const next = number < 114 ? QURAN_SURAHS[number] : null;

  return (
    <div className="mx-auto max-w-[860px] pb-28">
      <audio ref={audioRef} onEnded={onEnded} onPause={() => !continuous && setPlaying((p) => (audioRef.current?.ended ? null : p))} preload="none" />

      <Link href="/quran" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t("আল-কুরআন", "Al-Quran")}
      </Link>

      {/* Surah header */}
      <header className="hero-surface relative overflow-hidden rounded-3xl p-6 text-center sm:p-8">
        <div className="star-lattice pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="relative">
          <p className="font-arabic text-[34px] leading-tight sm:text-[42px]" dir="rtl">
            {surah.arabic}
          </p>
          <h1 className="mt-1 font-heading text-[22px] font-bold sm:text-[26px]">
            {t(`সূরা ${surah.bangla}`, `Surah ${surah.english}`)}
          </h1>
          <p className="mt-1 text-sm text-white/75">
            {t(surah.meaning, surah.meaning)} · {surah.madani ? t("মাদানী", "Madani") : t("মাক্কী", "Makki")} · {t(`${num(surah.ayahs, lang)} আয়াত`, `${surah.ayahs} ayahs`)}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {playing && continuous ? (
              <button onClick={stop} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-strong">
                <Square className="h-4 w-4 fill-current" />
                {t("তিলাওয়াত থামান", "Stop recitation")}
              </button>
            ) : (
              <button onClick={() => playAyah(1, true)} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-strong">
                <Play className="h-4 w-4 fill-current" />
                {t("পুরো সূরা শুনুন", "Play surah")}
              </button>
            )}
            <button onClick={() => setPanel((v) => !v)} className="inline-flex h-11 items-center gap-2 rounded-full bg-white/15 px-5 text-sm font-medium text-white ring-1 ring-white/25">
              <Settings2 className="h-4 w-4" />
              {t("সেটিংস", "Settings")}
            </button>
            <JumpToAyah total={surah.ayahs} />
          </div>
          {qari && <p className="mt-3 text-[12.5px] text-white/70">{t(`ক্বারী: ${qari.name}`, `Qari: ${qari.en || qari.name}`)}</p>}
        </div>
      </header>

      <AnimatePresence>{panel && <SettingsPanel settings={settings} update={update} onClose={() => setPanel(false)} />}</AnimatePresence>

      {number !== 1 && number !== 9 && (
        <p className="font-arabic my-7 text-center text-[30px] leading-loose text-brand-strong" dir="rtl">
          {BISMILLAH}
        </p>
      )}

      {error ? (
        <p className="mt-10 text-center text-sm text-ink-3">{t("সূরা লোড করা যায়নি। আবার চেষ্টা করুন।", "Couldn't load the surah. Try again.")}</p>
      ) : !ayahs ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {ayahs.map((a) => (
            <AyahCard
              key={a.n}
              surah={number}
              a={a}
              text={stripBasmala(number, a.n, a.a)}
              translation={settings.showTranslation ? translationOf(a) : ""}
              words={settings.wordByWord ? wbw?.[a.n] : undefined}
              wbwLoading={wbwLoading}
              arabicSize={settings.arabicSize}
              transSize={settings.transSize}
              playing={playing === a.n}
              onPlay={() => (playing === a.n ? stop() : playAyah(a.n, false))}
              onTafsir={() => setTafsirFor(a.n)}
              bookmarked={bookmarks.has(`${number}:${a.n}`)}
              onBookmark={() => bookmarks.toggle(`${number}:${a.n}`)}
            />
          ))}
        </ol>
      )}

      {/* Previous / next surah */}
      <nav className="mt-8 grid grid-cols-2 gap-3">
        {prev ? (
          <Link href={`/quran/${prev.number}`} className="flex items-center gap-2 rounded-2xl border border-line bg-panel p-4 hover:border-brand/40">
            <ChevronLeft className="h-5 w-5 shrink-0 text-brand rtl:rotate-180" />
            <span className="min-w-0">
              <span className="block text-xs text-ink-3">{t("আগের সূরা", "Previous")}</span>
              <span className="block truncate font-medium text-ink">{t(prev.bangla, prev.english)}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/quran/${next.number}`} className="flex items-center justify-end gap-2 rounded-2xl border border-line bg-panel p-4 text-end hover:border-brand/40">
            <span className="min-w-0">
              <span className="block text-xs text-ink-3">{t("পরের সূরা", "Next")}</span>
              <span className="block truncate font-medium text-ink">{t(next.bangla, next.english)}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-brand rtl:rotate-180" />
          </Link>
        )}
      </nav>

      <AnimatePresence>
        {tafsirFor !== null && (
          <TafsirSheet surah={number} ayah={tafsirFor} source={settings.tafsir} onSource={(id) => update({ tafsir: id })} onClose={() => setTafsirFor(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── One ayah ─────────────────────────────────────────────────── */

function AyahCard({
  surah,
  a,
  text,
  translation,
  words,
  wbwLoading,
  arabicSize,
  transSize,
  playing,
  onPlay,
  onTafsir,
  bookmarked,
  onBookmark,
}: {
  surah: number;
  a: Ayah;
  text: string;
  translation: string;
  words?: Word[];
  wbwLoading: boolean;
  arabicSize: number;
  transSize: number;
  playing: boolean;
  onPlay: () => void;
  onTafsir: () => void;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const ref = `${surah}:${a.n}`;
  const name = QURAN_SURAHS[surah - 1];
  const copy = async () => {
    await navigator.clipboard?.writeText(`${text}\n\n${a.t}\n— ${t(`সূরা ${name.bangla}`, `Surah ${name.english}`)} ${num(ref, lang)}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const share = async () => {
    const url = `${window.location.origin}/quran/${surah}#ayah-${a.n}`;
    try {
      if (navigator.share) await navigator.share({ title: `${name.bangla} ${ref}`, text: a.t, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  };
  const playWord = (src?: string) => src && new Audio(src).play().catch(() => {});

  const action = "flex h-9 w-9 items-center justify-center rounded-full text-ink-3 transition hover:bg-panel-2 hover:text-brand";
  return (
    <li id={`ayah-${a.n}`} data-ayah data-n={a.n} className={cn("scroll-mt-24 rounded-2xl border bg-panel p-4 transition sm:p-5", playing ? "border-brand/50 bg-brand-soft/40" : "border-line")}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-brand-soft px-2 font-num text-sm font-semibold text-brand">{num(a.n, lang)}</span>
          <span className="hidden text-[12px] text-ink-3 sm:inline">{t(`পারা ${num(a.j, lang)} · পৃষ্ঠা ${num(a.p, lang)}`, `Juz ${a.j} · Page ${a.p}`)}</span>
        </span>
        <span className="flex items-center">
          <button onClick={onPlay} aria-label={playing ? t("থামান", "Pause") : t("তিলাওয়াত", "Recite")} className={cn(action, playing && "bg-brand text-white hover:bg-brand-strong hover:text-white")}>
            {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4" />}
          </button>
          <button onClick={onTafsir} aria-label={t("তাফসীর", "Tafsir")} title={t("তাফসীর", "Tafsir")} className={action}>
            <BookOpenText className="h-4 w-4" />
          </button>
          <button onClick={onBookmark} aria-pressed={bookmarked} aria-label={t("বুকমার্ক", "Bookmark")} className={cn(action, bookmarked && "text-brand")}>
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button onClick={copy} aria-label={t("কপি", "Copy")} className={action}>
            {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
          </button>
          <button onClick={share} aria-label={t("শেয়ার", "Share")} className={action}>
            <Share2 className="h-4 w-4" />
          </button>
        </span>
      </div>

      <p className="font-arabic mt-4 text-start leading-[2.1] text-ink" dir="rtl" style={{ fontSize: arabicSize }}>
        {text}
        <span className="ms-2 inline-flex h-[1.4em] min-w-[1.4em] items-center justify-center rounded-full border border-brand/40 align-middle font-num text-[0.5em] text-brand">
          {a.n.toLocaleString("ar-EG")}
        </span>
      </p>

      {wbwLoading && !words && <p className="mt-3 text-xs text-ink-3">{t("শব্দার্থ লোড হচ্ছে…", "Loading word meanings…")}</p>}
      {words && (
        <div className="mt-3 flex flex-wrap justify-start gap-1.5" dir="rtl">
          {words.map((w, i) => (
            <button key={i} type="button" onClick={() => playWord(w.audio)} className="rounded-xl border border-line bg-panel-2 px-2.5 py-1.5 text-center transition hover:border-brand/40">
              <span className="font-arabic block text-[20px] leading-snug text-ink">{w.text}</span>
              <span className="block text-[11.5px] leading-tight text-ink-2" dir="ltr">
                {w.meaning}
              </span>
            </button>
          ))}
        </div>
      )}

      {translation && (
        <p className="mt-3 leading-relaxed text-ink-2" style={{ fontSize: transSize }}>
          {translation}
        </p>
      )}
    </li>
  );
}

/* ── Jump to an ayah ──────────────────────────────────────────── */

function JumpToAyah({ total }: { total: number }) {
  const { t, lang } = useLang();
  return (
    <label className="relative inline-flex h-11 items-center rounded-full bg-white/15 ps-4 pe-2 text-sm text-white ring-1 ring-white/25">
      <span className="me-2">{t("আয়াত", "Ayah")}</span>
      <select
        defaultValue=""
        onChange={(e) => {
          const n = e.target.value;
          if (n) {
            document.getElementById(`ayah-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            history.replaceState(null, "", `#ayah-${n}`);
          }
        }}
        className="h-9 cursor-pointer rounded-full bg-white/15 px-2 text-sm text-white outline-none [&>option]:text-ink"
      >
        <option value="" disabled>
          —
        </option>
        {Array.from({ length: total }, (_, i) => (
          <option key={i} value={i + 1}>
            {num(i + 1, lang)}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ── Settings ─────────────────────────────────────────────────── */

function SettingsPanel({ settings, update, onClose }: { settings: QuranSettings; update: (p: Partial<QuranSettings>) => void; onClose: () => void }) {
  const { t, lang } = useLang();
  const [qq, setQq] = useState("");
  const qaris = useMemo(() => {
    const n = qq.trim().toLowerCase();
    return n ? AYAH_QARIS.filter((q) => q.name.includes(n) || q.en.toLowerCase().includes(n) || q.ar.includes(n)) : AYAH_QARIS;
  }, [qq]);
  const toggle = (on: boolean, set: (v: boolean) => void, label: string) => (
    <button type="button" onClick={() => set(!on)} aria-pressed={on} className="flex w-full items-center justify-between rounded-xl bg-panel-2 px-4 py-3 text-sm text-ink">
      {label}
      <span className={cn("relative h-6 w-11 rounded-full transition", on ? "bg-brand" : "bg-line")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "start-[22px]" : "start-0.5")} />
      </span>
    </button>
  );
  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-4 rounded-3xl border border-line bg-panel p-5 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.4)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-ink">{t("পড়ার সেটিংস", "Reading settings")}</h2>
        <button onClick={onClose} aria-label={t("বন্ধ", "Close")} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-panel-2">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block">
            <span className="flex justify-between text-sm text-ink-2">
              {t("আরবি লেখার আকার", "Arabic size")}
              <span className="font-num">{num(settings.arabicSize, lang)}</span>
            </span>
            <input type="range" min={22} max={46} value={settings.arabicSize} onChange={(e) => update({ arabicSize: +e.target.value })} className="mt-2 w-full accent-[var(--brand)]" />
          </label>
          <label className="block">
            <span className="flex justify-between text-sm text-ink-2">
              {t("অনুবাদের আকার", "Translation size")}
              <span className="font-num">{num(settings.transSize, lang)}</span>
            </span>
            <input type="range" min={13} max={24} value={settings.transSize} onChange={(e) => update({ transSize: +e.target.value })} className="mt-2 w-full accent-[var(--brand)]" />
          </label>
          {toggle(settings.showTranslation, (v) => update({ showTranslation: v }), t("অনুবাদ দেখান", "Show translation"))}
          {toggle(settings.wordByWord, (v) => update({ wordByWord: v }), t("শব্দে শব্দে অর্থ", "Word by word"))}
        </div>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-ink-2">{t("অনুবাদ", "Translation")}</p>
            <div className="space-y-2">
              {TRANSLATIONS.map((tr) => (
                <button
                  key={tr.key}
                  type="button"
                  onClick={() => update({ translation: tr.key })}
                  className={cn("w-full rounded-xl border p-3 text-start transition", settings.translation === tr.key ? "border-brand bg-brand-soft" : "border-line hover:border-brand/40")}
                >
                  <span className="block text-sm font-semibold text-ink">{tr.name}</span>
                  <span className="block text-xs text-ink-3">{tr.scholar}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center justify-between text-sm text-ink-2">
              {t("ক্বারী (আয়াতভিত্তিক তিলাওয়াত)", "Qari (per ayah)")}
              <span className="text-xs text-ink-3">{t(`${num(AYAH_QARIS.length, lang)} জন`, `${AYAH_QARIS.length}`)}</span>
            </p>
            <input value={qq} onChange={(e) => setQq(e.target.value)} placeholder={t("ক্বারী খুঁজুন…", "Search qari…")} className="mb-2 h-10 w-full rounded-xl border border-line bg-panel-2 px-3 text-sm outline-none focus:border-brand" />
            <select value={settings.qari} onChange={(e) => update({ qari: e.target.value })} size={5} className="w-full rounded-xl border border-line bg-panel p-1 text-sm text-ink outline-none">
              {qaris.map((q) => (
                <option key={q.id} value={q.id} className="rounded-lg px-2 py-1.5">
                  {lang === "bn" ? q.name : q.en || q.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ── Tafsir sheet ─────────────────────────────────────────────── */

function TafsirSheet({ surah, ayah, source, onSource, onClose }: { surah: number; ayah: number; source: string; onSource: (id: string) => void; onClose: () => void }) {
  const { t, lang } = useLang();
  const tafsir = TAFSIRS.find((x) => x.id === source) ?? TAFSIRS[0];
  const [result, setResult] = useState<{ key: string; text: string } | null>(null);
  const key = `${tafsir.id}:${surah}:${ayah}`;

  useEffect(() => {
    let alive = true;
    loadTafsir(tafsir, surah, ayah)
      .then((text) => alive && setResult({ key, text }))
      .catch(() => alive && setResult({ key, text: "" }));
    return () => {
      alive = false;
    };
  }, [tafsir, surah, ayah, key]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const loading = result?.key !== key;
  const rtl = tafsir.lang === "আরবি" || tafsir.lang === "উর্দু";
  const name = QURAN_SURAHS[surah - 1];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal
        aria-label={t("তাফসীর", "Tafsir")}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-line bg-panel sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-heading text-[17px] font-bold text-ink">
              <BookMarked className="h-4 w-4 text-brand" />
              {t("তাফসীর", "Tafsir")}
            </p>
            <p className="text-xs text-ink-3">{t(`সূরা ${name.bangla} · আয়াত ${num(ayah, lang)}`, `Surah ${name.english} · Ayah ${ayah}`)}</p>
          </div>
          <button onClick={onClose} aria-label={t("বন্ধ", "Close")} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-panel-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="scroll-hide flex gap-1.5 overflow-x-auto border-b border-line px-4 py-3">
          {TAFSIRS.map((x) => (
            <button
              key={x.id}
              onClick={() => onSource(x.id)}
              className={cn("shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] whitespace-nowrap transition", x.id === tafsir.id ? "border-brand bg-brand text-white" : "border-line text-ink-2 hover:border-brand/40")}
            >
              {x.name}
              <span className="ms-1 opacity-70">· {x.lang}</span>
            </button>
          ))}
        </div>
        <div className="overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
            </div>
          ) : result?.text ? (
            <div
              dir={rtl ? "rtl" : "ltr"}
              className={cn("leading-[1.95] whitespace-pre-line text-ink-2", rtl ? "font-arabic text-[19px]" : "text-[15.5px]")}
              dangerouslySetInnerHTML={{ __html: sanitize(result.text) }}
            />
          ) : (
            <p className="py-8 text-center text-sm text-ink-3">{t(`এই আয়াতের জন্য ${tafsir.name}-এর তাফসীর পাওয়া যায়নি।`, "No tafsir found for this ayah in this source.")}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Tafsir sources may carry light HTML (paragraphs, bold); keep text formatting, drop anything else. */
function sanitize(html: string) {
  return html
    .replace(/<\s*(script|style|iframe|object|embed)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<(?!\/?(p|br|b|strong|i|em|h\d|ul|ol|li|span|sup|sub)\b)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

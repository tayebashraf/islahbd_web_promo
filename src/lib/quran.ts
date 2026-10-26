/**
 * Shared data and helpers for the digital Quran (reader, hafezi mushaf,
 * audio, search). Mirrors the app's Quran feature: the Arabic text with the
 * Mohiuddin Khan translation and I'rab ship as static JSON in public/quran
 * (built by scripts/build-quran-data.py); word-by-word, tafsir and the
 * Tawzihul translation are fetched from the same sources the app uses.
 */
import QARI_DATA from "./quran-qaris.json";
import JUZ_DATA from "./quran-juz.json";
import { API_BASE } from "./api";

export { QURAN_SURAHS, type QuranSurah } from "./quran-surahs";

/* ── Ayahs ───────────────────────────────────────────────────── */

/** n: ayah number, a: Arabic (Uthmani), t: Bangla (Mohiuddin Khan), p: Madani page, j: juz, h: Hafezi page */
export type Ayah = { n: number; a: string; t: string; p: number; j: number; h: number | null };

const surahCache = new Map<number, Promise<Ayah[]>>();
export function loadSurah(n: number): Promise<Ayah[]> {
  if (!surahCache.has(n)) {
    surahCache.set(
      n,
      fetch(`/quran/surah/${n}.json`).then((r) => {
        if (!r.ok) throw new Error("surah");
        return r.json();
      }),
    );
  }
  return surahCache.get(n)!;
}

export const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
/** The first ayah of every surah except Al-Fatihah opens with the basmala in this text; show it once as a header instead. */
export function stripBasmala(surah: number, n: number, text: string) {
  if (surah === 1 || n !== 1) return text;
  // Compare letters only: the source orders shadda/fatha differently from surah to surah.
  const words = text.split(" ");
  const skeleton = words.slice(0, 4).join(" ").replace(/[\u064B-\u065F\u0670]/g, "").replace(/ٱ/g, "ا");
  return skeleton === "بسم الله الرحمن الرحيم" ? words.slice(4).join(" ") : text;
}

export const JUZ_STARTS = JUZ_DATA as { j: number; s: number; a: number }[];

/* ── Translations ────────────────────────────────────────────── */

export type TranslationKey = "mohiuddin" | "tawzihul";
export const TRANSLATIONS: { key: TranslationKey; name: string; scholar: string; note: string }[] = [
  { key: "mohiuddin", name: "মাওলানা মুহিউদ্দীন খান", scholar: "তাফসীরে মা'আরেফুল কুরআন", note: "সর্বাধিক নির্ভরযোগ্য মূল বাংলা অনুবাদ" },
  { key: "tawzihul", name: "তাওযীহুল কুরআন", scholar: "মুফতী মুহাম্মাদ তাকী উসমানী (দা.বা.)", note: "সহজ, প্রাঞ্জল ও প্রামাণ্য অনুবাদ" },
];

let tawzihul: Promise<Record<string, string>> | null = null;
/** The whole Tawzihul translation keyed "surah:ayah" (one request, cached). */
export function loadTawzihul() {
  tawzihul ??= fetch(`${API_BASE}/api/quran/translations/tawzihul/`).then((r) => r.json());
  return tawzihul;
}

/* ── Word by word (quran.com) ────────────────────────────────── */

export type Word = { text: string; meaning: string; audio?: string };
const wbwCache = new Map<number, Promise<Record<number, Word[]>>>();

export function loadWordByWord(surah: number, ayahs: number): Promise<Record<number, Word[]>> {
  if (!wbwCache.has(surah)) {
    const pages = Math.ceil(ayahs / 50);
    wbwCache.set(
      surah,
      Promise.all(
        Array.from({ length: pages }, (_, i) =>
          fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah}?words=true&word_fields=text_uthmani,audio_url&language=bn&per_page=50&page=${i + 1}`).then((r) => r.json()),
        ),
      ).then((res) => {
        const out: Record<number, Word[]> = {};
        for (const page of res)
          for (const v of page.verses ?? [])
            out[v.verse_number] = (v.words ?? [])
              .filter((w: { char_type_name: string }) => w.char_type_name === "word")
              .map((w: { text_uthmani: string; translation?: { text: string }; audio_url?: string }) => ({
                text: w.text_uthmani,
                meaning: w.translation?.text ?? "",
                audio: w.audio_url ? `https://audio.qurancdn.com/${w.audio_url}` : undefined,
              }));
        return out;
      }),
    );
  }
  return wbwCache.get(surah)!;
}

/* ── Tafsir ──────────────────────────────────────────────────── */

export type Tafsir = { id: string; name: string; lang: string; slug?: string; quranCom?: number; source?: "tawzihul" | "irab" };

/** Same list (and order) as the app's tafsir sheet, plus the bundled I'rab. */
export const TAFSIRS: Tafsir[] = [
  { id: "tawzihul", name: "তাফসীরে তাওযীহুল কুরআন", lang: "বাংলা", source: "tawzihul" },
  { id: "ibn-kathir-bn", name: "তাফসীর ইবনে কাসীর", lang: "বাংলা", slug: "bn-tafseer-ibn-e-kaseer" },
  { id: "bayan-ul-quran", name: "بیان القرآن (বয়ানুল কুরআন)", lang: "উর্দু", slug: "ur-tafsir-bayan-ul-quran" },
  { id: "maarif", name: "মা'আরিফুল কুরআন", lang: "ইংরেজি", slug: "en-tafsir-maarif-ul-quran" },
  { id: "jalalayn", name: "تفسير الجلالين (জালালাইন)", lang: "আরবি", slug: "ar-tafsir-al-jalalayn" },
  { id: "ruh", name: "روح المعاني (রূহুল মা'আনী)", lang: "আরবি", slug: "tafsir-al-alusi" },
  { id: "baghawi", name: "تفسير البغوي (বাগাভী)", lang: "আরবি", slug: "ar-tafsir-al-baghawi" },
  { id: "qurtubi", name: "تفسير القرطبي (কুরতুবী)", lang: "আরবি", slug: "ar-tafseer-al-qurtubi" },
  { id: "tabari", name: "تفسير الطبري (তাবারী)", lang: "আরবি", slug: "ar-tafsir-al-tabari" },
  { id: "irab", name: "إعراب القرآن (ই'রাব)", lang: "আরবি", source: "irab" },
  { id: "jadwal", name: "الجدول في إعراب القرآن", lang: "আরবি", slug: "al-jadwal-fi-i-rab-al-quran" },
  { id: "durr", name: "الدر المصون", lang: "আরবি", slug: "al-dur-al-masun-lil-samin-al-halabi" },
  { id: "lubab", name: "اللباب في علوم الكتاب", lang: "আরবি", slug: "al-lubab-fi-ulum-al-kitab" },
  { id: "darwish", name: "إعراب القرآن وبيانه (درويش)", lang: "আরবি", slug: "i-rab-al-quran-li-al-darwish" },
];

let tawzihulTafsir: Promise<Record<string, string>> | null = null;
const irabCache = new Map<number, Promise<Record<string, string>>>();

export async function loadTafsir(t: Tafsir, surah: number, ayah: number): Promise<string> {
  if (t.source === "tawzihul") {
    tawzihulTafsir ??= fetch(`${API_BASE}/api/quran/tafseer/tawzihul/`).then((r) => r.json());
    return (await tawzihulTafsir)[`${surah}:${ayah}`] ?? "";
  }
  if (t.source === "irab") {
    if (!irabCache.has(surah)) irabCache.set(surah, fetch(`/quran/irab/${surah}.json`).then((r) => (r.ok ? r.json() : {})));
    return (await irabCache.get(surah)!)[String(ayah)] ?? "";
  }
  const mirrors = [
    `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${t.slug}/${surah}/${ayah}.json`,
    `https://fastly.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${t.slug}/${surah}/${ayah}.json`,
    `https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/${t.slug}/${surah}/${ayah}.json`,
  ];
  for (const url of mirrors) {
    try {
      const r = await fetch(url);
      if (r.ok) return ((await r.json()) as { text?: string }).text ?? "";
    } catch {}
  }
  return "";
}

/* ── Qaris and audio ─────────────────────────────────────────── */

export type QuranQari = { id: string; name: string; en: string; ar: string; ayah: string; server: string; hasAyah: boolean };
export const QURAN_QARIS = QARI_DATA as QuranQari[];
/** Qaris with verse-by-verse recordings (for following along in the reader). */
export const AYAH_QARIS = QURAN_QARIS.filter((q) => q.hasAyah && q.ayah);

const pad3 = (n: number) => String(n).padStart(3, "0");
export const ayahAudioUrl = (q: QuranQari, surah: number, ayah: number) => `https://everyayah.com/data/${q.ayah}/${pad3(surah)}${pad3(ayah)}.mp3`;
export const surahAudioUrl = (q: QuranQari, surah: number) => `${q.server.endsWith("/") ? q.server : `${q.server}/`}${pad3(surah)}.mp3`;

/* ── Hafezi 15-line mushaf (610 pages) ───────────────────────── */

export const HAFEZI_PAGES = 610;
export const HAFEZI_PDF = "https://raw.githubusercontent.com/tawhiidjamil/islahbd-quran-assets/main/hafezi_quran.pdf";
/** PDF page = mushaf page + offset (the PDF opens with a cover). */
export const HAFEZI_PDF_OFFSET = 1;
export const HAFEZI_SURAH_START: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208, 11: 221, 12: 235, 13: 249, 14: 255, 15: 261, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 331, 23: 342, 24: 350, 25: 359, 26: 366, 27: 376, 28: 385, 29: 396, 30: 404, 31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 445, 38: 452, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 495, 45: 498, 46: 502, 47: 506, 48: 511, 49: 515, 50: 518, 51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 567, 70: 569, 71: 571, 72: 573, 73: 576, 74: 578, 75: 580, 76: 582, 77: 584, 78: 586, 79: 587, 80: 589,
  81: 590, 82: 591, 83: 592, 84: 594, 85: 595, 86: 596, 87: 597, 88: 597, 89: 598, 90: 600, 91: 600, 92: 601, 93: 602, 94: 602, 95: 603, 96: 603, 97: 604, 98: 604, 99: 605, 100: 605,
  101: 606, 102: 606, 103: 607, 104: 607, 105: 607, 106: 608, 107: 608, 108: 608, 109: 608, 110: 609, 111: 609, 112: 609, 113: 610, 114: 610,
};
export const HAFEZI_JUZ_START: Record<number, number> = {
  1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 122, 8: 142, 9: 162, 10: 182, 11: 202, 12: 222, 13: 242, 14: 262, 15: 282,
  16: 302, 17: 322, 18: 342, 19: 362, 20: 382, 21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 586,
};

/* ── Reading state (this device) ─────────────────────────────── */

export const LAST_READ_KEY = "islah_quran_last";
export const BOOKMARKS_KEY = "islah_quran_bookmarks";
export const HAFEZI_PAGE_KEY = "islah_quran_hafezi_page";
export const SETTINGS_KEY = "islah_quran_settings";

export type QuranSettings = {
  arabicSize: number;
  transSize: number;
  showTranslation: boolean;
  translation: TranslationKey;
  wordByWord: boolean;
  qari: string;
  tafsir: string;
};
export const DEFAULT_SETTINGS: QuranSettings = {
  arabicSize: 30,
  transSize: 16,
  showTranslation: true,
  translation: "mohiuddin",
  wordByWord: false,
  qari: AYAH_QARIS[0]?.id ?? "",
  tafsir: "tawzihul",
};

export function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

/** Bookmarks are "surah:ayah" keys, newest first. */
export function parseBookmarks(raw: string | null): string[] {
  try {
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

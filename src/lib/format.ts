import { INTL_LOCALE, localDigits, type Lang } from "./i18n";

export function bnNum(value: number | string): string {
  return localDigits(value, "bn");
}

/** Localized digits: Bangla, Arabic-Indic or Urdu numerals; Latin for English. */
export function num(value: number | string, lang: Lang): string {
  return localDigits(value, lang);
}

export function formatDate(iso: string, lang: Lang, opts?: Intl.DateTimeFormatOptions): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
    ...opts,
  }).format(d);
}

export function formatTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : INTL_LOCALE[lang], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(d);
}

/** Hijri date without the trailing era marker ("যুগ" / "AH"). */
export function formatHijri(date: Date, lang: Lang): string {
  try {
    const base = lang === "en" ? "en-US" : INTL_LOCALE[lang].split("-u-")[0];
    const nu = lang === "ur" ? "-nu-arabext" : "";
    const parts = new Intl.DateTimeFormat(`${base}-u-ca-islamic-umalqura${nu}`, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(date);
    return parts
      .filter((p) => p.type !== "era")
      .map((p) => p.value)
      .join("")
      .replace(/[\s,]+$/, "")
      .trim();
  } catch {
    return "";
  }
}

/** Seconds → m:ss or h:mm:ss. */
export function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export function timeAgo(iso: string | null | undefined, lang: Lang): string {
  if (!iso) return "";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (lang === "bn") {
    if (mins < 1) return "এইমাত্র";
    if (mins < 60) return `${bnNum(mins)} মিনিট আগে`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${bnNum(hours)} ঘণ্টা আগে`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${bnNum(days)} দিন আগে`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${bnNum(months)} মাস আগে`;
    return `${bnNum(Math.floor(months / 12))} বছর আগে`;
  }
  const rtf = new Intl.RelativeTimeFormat(INTL_LOCALE[lang], { numeric: "auto", style: lang === "en" ? "short" : "long" });
  if (mins < 60) return rtf.format(-Math.max(mins, 0), "minute");
  const hours = Math.floor(mins / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 30) return rtf.format(-days, "day");
  const months = Math.floor(days / 30);
  if (months < 12) return rtf.format(-months, "month");
  return rtf.format(-Math.floor(months / 12), "year");
}

/** Speaker strings carry several spellings of the same honorific — show one. */
export function shortSpeaker(speaker: string): string {
  return speaker
    .replace(/\s*(দামাত\s*বার[া]?কাতুহুম|দা\.?\s*বা\.?)\s*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

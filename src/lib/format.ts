import { INTL_LOCALE, localDigits, type Lang } from "./i18n";
import { calculatePrayerTimes } from "./prayer-times";

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

const HIJRI_MONTHS_BN = [
  "মুহাররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি", "জমাদিউল আউয়াল", "জমাদিউস সানি",
  "রজব", "শাবান", "রমজান", "শাওয়াল", "জিলকদ", "জিলহজ্জ",
];

/**
 * The Islamic day turns over at Maghrib (sunset), not at midnight.
 *
 * In Islamic calendar reckoning (and in the islahbd mobile app's
 * `HijriDateHelper.dart`), before Maghrib the active Islamic day is the one
 * that began at yesterday's sunset. Thus, between midnight and Maghrib (which
 * includes morning, Dhuhr, and Asr), the Hijri date corresponds to
 * yesterday's Gregorian date (`date - 1 day`).
 *
 * Once Maghrib arrives (sunset), the new Islamic day begins (`date`).
 *
 * This guarantees 100% synchronization between the website and mobile app.
 */
export function toIslamicDayDate(date: Date): Date {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(date);
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? date.getHours());
    const minute = Number(parts.find((p) => p.type === "minute")?.value ?? date.getMinutes());
    const currentMins = hour * 60 + minute;

    // Calculate exact Maghrib time for Dhaka on this date
    const pt = calculatePrayerTimes(23.8103, 90.4125, date, 6);
    const [mH, mM] = pt.Maghrib.split(":").map(Number);
    const maghribMins = !Number.isNaN(mH) && !Number.isNaN(mM) ? mH * 60 + mM : 17 * 60 + 25;

    // If before Maghrib, the Islamic day corresponds to yesterday
    if (currentMins < maghribMins) {
      return new Date(date.getTime() - 24 * 60 * 60 * 1000);
    }
    return date;
  } catch {
    return date;
  }
}

/** Umm al-Qura day / month (1–12) / year as numbers — with Maghrib rollover. */
function hijriParts(date: Date): { day: number; month: number; year: number } {
  const islamicDate = toIslamicDayDate(date);
  const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura-nu-latn", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).formatToParts(islamicDate);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { day: get("day"), month: get("month"), year: get("year") };
}

/**
 * Hijri date without the trailing era marker ("যুগ" / "AH").
 * Respects Maghrib rollover to match the mobile app's calendar.
 */
export function formatHijri(date: Date, lang: Lang, { short = false } = {}): string {
  try {
    if (lang === "bn") {
      const { day, month, year } = hijriParts(date);
      const head = `${bnNum(day)} ${HIJRI_MONTHS_BN[month - 1]}`;
      return short ? head : `${head} ${bnNum(year)}`;
    }
    const islamicDate = toIslamicDayDate(date);
    const base = lang === "en" ? "en-US" : INTL_LOCALE[lang].split("-u-")[0];
    const nu = lang === "ur" ? "-nu-arabext" : "";
    const parts = new Intl.DateTimeFormat(`${base}-u-ca-islamic-umalqura${nu}`, {
      day: "numeric",
      month: short ? "short" : "long",
      timeZone: "Asia/Dhaka",
      ...(short ? {} : { year: "numeric" }),
    }).formatToParts(islamicDate);
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

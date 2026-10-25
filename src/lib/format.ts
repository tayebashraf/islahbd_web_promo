const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function bnNum(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Localized digits: Bangla numerals for `bn`, Latin otherwise. */
export function num(value: number | string, lang: "bn" | "en"): string {
  return lang === "bn" ? bnNum(value) : String(value);
}

export function formatDate(iso: string, lang: "bn" | "en", opts?: Intl.DateTimeFormatOptions): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
    ...opts,
  }).format(d);
}

export function formatTime(iso: string, lang: "bn" | "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(d);
}

/** Hijri date without the trailing era marker ("যুগ" / "AH"). */
export function formatHijri(date: Date, lang: "bn" | "en"): string {
  try {
    const parts = new Intl.DateTimeFormat(`${lang === "bn" ? "bn-BD" : "en-US"}-u-ca-islamic-umalqura`, {
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

export function timeAgo(iso: string | null | undefined, lang: "bn" | "en"): string {
  if (!iso) return "";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  const t = (bn: string, en: string) => (lang === "bn" ? bn : en);
  if (mins < 1) return t("এইমাত্র", "just now");
  if (mins < 60) return t(`${bnNum(mins)} মিনিট আগে`, `${mins} min ago`);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t(`${bnNum(hours)} ঘণ্টা আগে`, `${hours}h ago`);
  const days = Math.floor(hours / 24);
  if (days < 30) return t(`${bnNum(days)} দিন আগে`, `${days}d ago`);
  const months = Math.floor(days / 30);
  if (months < 12) return t(`${bnNum(months)} মাস আগে`, `${months}mo ago`);
  return t(`${bnNum(Math.floor(months / 12))} বছর আগে`, `${Math.floor(months / 12)}y ago`);
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

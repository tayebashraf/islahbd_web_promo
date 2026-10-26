/**
 * Bangla (Bongabdo) date on the revised Bangladesh calendar — the same rules
 * as the app's BanglaDateHelper: the year starts on 14 April (1 Boishakh);
 * Boishakh–Ashwin have 31 days, Kartik–Magh and Chaitra 30, Falgun 29 (30 in
 * a Gregorian leap year).
 */

const MONTHS_BN = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"];
const MONTHS_EN = ["Boishakh", "Joishtho", "Asharh", "Srabon", "Bhadro", "Ashwin", "Kartik", "Ogrohayon", "Poush", "Magh", "Falgun", "Choitro"];
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const bn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[+d]);

export function banglaDate(date: Date): { day: number; month: number; year: number } {
  // The calendar day in Bangladesh, whatever the viewer's own timezone.
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const y = get("year");
  const m = get("month");
  const d = get("day");

  const beforeNewYear = m < 4 || (m === 4 && d < 14);
  const year = beforeNewYear ? y - 594 : y - 593;
  const start = Date.UTC(beforeNewYear ? y - 1 : y, 3, 14);
  let left = Math.round((Date.UTC(y, m - 1, d) - start) / 86_400_000);

  const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const lengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, leap ? 30 : 29, 30];
  let month = 0;
  while (month < 11 && left >= lengths[month]) {
    left -= lengths[month];
    month++;
  }
  return { day: left + 1, month, year };
}

/** "১০ কার্তিক ১৪৩৩ বঙ্গাব্দ" / "10 Kartik 1433 BS". */
export function formatBanglaDate(date: Date, lang: "bn" | string): string {
  const { day, month, year } = banglaDate(date);
  return lang === "bn" ? `${bn(day)} ${MONTHS_BN[month]} ${bn(year)} বঙ্গাব্দ` : `${day} ${MONTHS_EN[month]} ${year} BS`;
}

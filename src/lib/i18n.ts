import { DICT } from "./i18n-dict";

export type Lang = "bn" | "en" | "ar" | "ur";

const DIGITS: Partial<Record<Lang, string[]>> = {
  bn: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
  ar: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
  ur: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
};

/** Rewrites Latin digits in the script of `lang`. */
export function localDigits(value: number | string, lang: Lang): string {
  const set = DIGITS[lang];
  return set ? String(value).replace(/\d/g, (d) => set[Number(d)]) : String(value);
}

/** Intl locale per UI language (Arabic avoids the Saudi default of a Hijri calendar). */
export const INTL_LOCALE: Record<Lang, string> = {
  bn: "bn-BD",
  en: "en-GB",
  ar: "ar-EG",
  ur: "ur-PK-u-nu-arabext",
};

/**
 * Arabic / Urdu lookup by the English source text. Numbers in the text are
 * matched as `{n}` and put back, in the target script, in the same order.
 */
export function translate(en: string, lang: "ar" | "ur"): string {
  const nums: string[] = [];
  const key = en.replace(/\d+(\.\d+)?/g, (m) => {
    nums.push(m);
    return "{n}";
  });
  const hit = DICT[key];
  if (!hit) return en;
  let i = 0;
  return hit[lang === "ar" ? 0 : 1].replace(/\{n\}/g, () => localDigits(nums[i++] ?? "", lang));
}

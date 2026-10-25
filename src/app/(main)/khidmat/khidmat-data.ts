import {
  Award,
  BadgeCheck,
  Building2,
  CalendarClock,
  Crown,
  Gem,
  GraduationCap,
  HandCoins,
  Heart,
  HeartHandshake,
  Medal,
  Shield,
  Star,
  Utensils,
  type LucideIcon,
} from "lucide-react";

/**
 * Data and helpers for the khidmat (donation) page. It mirrors
 * markazulihsan.com/khidmat: the madrasa's own API runs the funds, member
 * records and bKash / SSLCommerz checkout; we reach it through the
 * `/mk-api/khidmat` rewrite in next.config.ts.
 */

export const KHIDMAT_API = "/mk-api/khidmat";
export const RECEIPT_WHATSAPP = "8801314803334";
export const RECEIPT_PHONE_LABEL = "+880 1314-803334";

/** Lifetime members' yearly dues, kept in a published Google Sheet. */
const LIFETIME_SHEET =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU_Ho2JCxvqg9PEeyxVXrdrHPsMpkXd_IJxHhu-mMQH07LYqcCh4jTYWM-5n9XFB9Hk5ngvRYd-xw7/pub?gid=0&single=true&output=csv";

export type Fund = {
  id: number;
  name: string;
  name_en?: string;
  category: string;
  description?: string;
  min_amount?: number | string;
  suggested_amounts?: number[];
};

/** Used until (or if) the live list from the API arrives. */
export const FALLBACK_FUNDS: Fund[] = [
  { id: 1, name: "স্থায়ী দাতা সদস্য", category: "permanent", description: "স্থায়ী অনুদান প্রদানের মাধ্যমে জামেয়ার দ্বীনি খেদমতের অংশীদার হোন।", min_amount: 500, suggested_amounts: [500, 1000, 2000, 5000, 10000] },
  { id: 2, name: "মাসিক দাতা সদস্য", category: "monthly", description: "প্রতি মাসে নিয়মিত অনুদান দিয়ে দ্বীনি শিক্ষার্থীদের পড়াশোনায় সহায়তা করুন।", min_amount: 300, suggested_amounts: [300, 500, 1000, 2000, 5000] },
  { id: 3, name: "আজীবন দাতা সদস্য", category: "lifetime", description: "আজীবন সদস্য পদ গ্রহণ করে মাদরাসার সার্বিক অগ্রগতিতে স্থায়ী ভূমিকা রাখুন।", min_amount: 3000, suggested_amounts: [3000, 5000, 10000, 25000, 50000] },
  { id: 4, name: "সাধারণ ও যাকাত দাতা", category: "general", description: "আপনার ফরয যাকাত ও নফল সাদাকাহ প্রদান করে এতিম-অসহায় ছাত্রদের পাশে দাঁড়ান।", min_amount: 100, suggested_amounts: [500, 1000, 2000, 5000, 10000] },
  { id: 5, name: "স্টুডেন্ট ফি (শিক্ষার্থী বেতন ও অনুদান)", category: "student_fee", description: "অসচ্ছল বা নির্দিষ্ট শিক্ষার্থীর মাসিক শিক্ষাব্যয় ও আবাসিক ফি স্পন্সর করুন।", min_amount: 500, suggested_amounts: [1000, 2000, 3000, 5000] },
  { id: 6, name: "লিল্লাহ বোর্ডিং ও গোরাবা তহবিল", category: "lillah", description: "লিল্লাহ বোর্ডিংয়ের অসচ্ছল ও এতিম ছাত্রদের খাদ্য, পোশাক ও চিকিৎসার সার্বিক ব্যবস্থা।", min_amount: 200, suggested_amounts: [500, 1000, 2500, 5000] },
  { id: 7, name: "মসজিদ ও মাদরাসা নির্মাণ ফান্ড", category: "construction", description: "মাদরাসা ভবন সম্প্রসারণ ও মসজিদ নির্মাণে সাদাকায়ে জারিয়ার অংশ নিন।", min_amount: 500, suggested_amounts: [1000, 5000, 10000, 20000, 50000] },
];

export const DEFAULT_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

export const FUND_LOOK: Record<string, { icon: LucideIcon; tone: string }> = {
  permanent: { icon: BadgeCheck, tone: "#417360" },
  monthly: { icon: CalendarClock, tone: "#0284C7" },
  lifetime: { icon: Crown, tone: "#B8860B" },
  general: { icon: HandCoins, tone: "#059669" },
  student_fee: { icon: GraduationCap, tone: "#7C3AED" },
  lillah: { icon: Utensils, tone: "#DC2626" },
  construction: { icon: Building2, tone: "#A16207" },
};
export const lookFor = (f: Fund) => FUND_LOOK[f.category] ?? { icon: HeartHandshake, tone: "#417360" };

/** Which form a fund opens. */
export function formFor(f: Fund): "lifetime" | "monthly" | "permanent" | "quick" {
  if (f.category === "lifetime" || f.name.includes("আজীবন")) return "lifetime";
  if (f.category === "monthly" || f.name.includes("মাসিক")) return "monthly";
  if (f.category === "permanent" || f.name.includes("স্থায়ী")) return "permanent";
  return "quick";
}
export const isZakatFund = (f: Fund) => f.category === "general" || f.category === "zakat" || /যাকাত|zakat/i.test(f.name);

/** Minimum pledge for new permanent / monthly members. */
export const MEMBER_MIN = { monthly: 10, permanent: 100000 } as const;
export const PERMANENT_PRESETS = [100000, 200000, 500000, 1000000];

export const LIFETIME_TIERS: { id: string; amount: number; title: string; color: string; icon: LucideIcon }[] = [
  { id: "platinum", amount: 100000, title: "প্ল্যাটিনাম সদস্য", color: "#B45309", icon: Crown },
  { id: "diamond", amount: 75000, title: "ডায়মন্ড সদস্য", color: "#0284C7", icon: Gem },
  { id: "gold", amount: 50000, title: "গোল্ড সদস্য", color: "#B8860B", icon: Star },
  { id: "silver", amount: 25000, title: "সিলভার সদস্য", color: "#64748B", icon: Shield },
  { id: "vip", amount: 10000, title: "ভিআইপি সদস্য", color: "#0F766E", icon: Award },
  { id: "well_wisher", amount: 5000, title: "শুভাকাঙ্ক্ষী সদস্য", color: "#7C3AED", icon: Heart },
  { id: "supporter", amount: 3000, title: "সহযোগী সদস্য", color: "#0D9488", icon: Medal },
];

export const BANK: { label: string; value: string; copy?: boolean }[] = [
  { label: "ব্যাংক", value: "Al-Arafah Islami Bank PLC" },
  { label: "অ্যাকাউন্টের নাম", value: "Madrasah Markazul Ihsan Dhaka" },
  { label: "শাখা", value: "Jatrabari Branch, Dhaka" },
  { label: "অ্যাকাউন্ট নম্বর", value: "0511020014127", copy: true },
  { label: "রাউটিং নম্বর", value: "015273222", copy: true },
  { label: "সুইফট কোড", value: "ALARIIDH" },
];

/* ── Numbers & phones ─────────────────────────────────────────── */

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
export const toEnDigits = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
export const digitsOnly = (s: string) => toEnDigits(s).replace(/[^0-9]/g, "");
export const taka = (n: number) => n.toLocaleString("bn-BD", { maximumFractionDigits: 0 });
export const bnYear = (n: number) => taka(n).replace(/,/g, "");

/** "+88017…", "88017…", "17…" → "017…". */
export function normPhone(raw: string) {
  let p = toEnDigits(raw).trim().replace(/[^0-9+]/g, "");
  if (p.startsWith("+880")) p = "0" + p.slice(4);
  else if (p.startsWith("880")) p = "0" + p.slice(3);
  else if (p.length === 10 && !p.startsWith("0")) p = "0" + p;
  return p;
}

/** Error text for a Bangladeshi mobile number, or null when it is valid (or optional and empty). */
export function phoneError(raw: string, required: boolean) {
  if (!raw.trim()) return required ? "মোবাইল নম্বর লিখুন" : null;
  const p = normPhone(raw);
  if (p.length < 11) return "মোবাইল নম্বর ১১ ডিজিটের হতে হবে";
  return /^01[3-9]\d{8}$/.test(p) ? null : "সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)";
}

/** bKash adds a 1.3% service charge on top, so the madrasa receives the full amount. */
export function withFee(amount: number, method: PayMethod) {
  if (!(amount > 0)) return { total: 0, fee: 0 };
  if (method === "bkash") {
    const fee = Math.round((13 * amount) / 1000);
    return { total: amount + fee, fee };
  }
  return { total: amount, fee: 0 };
}

export type PayMethod = "bkash" | "sslcommerz" | "bank";

export const GATEWAYS = {
  bkash: { name: "বিকাশ", sub: "বিকাশ অ্যাকাউন্ট থেকে", logo: "/images/khidmat/bkash-logo.svg", endpoint: `${KHIDMAT_API}/bkash/create` },
  sslcommerz: { name: "কার্ড / নগদ", sub: "কার্ড, নেট ব্যাংকিং, নগদ, রকেট", logo: "/images/khidmat/sslcommerz-logo.svg", endpoint: `${KHIDMAT_API}/sslcommerz/create` },
} as const;

/** POST JSON to the madrasa API; resolves to the parsed body (or null) and the HTTP status. */
export async function postJson<T = Record<string, unknown>>(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => null)) as T | null;
  return { ok: res.ok, data };
}

/* ── Lifetime member lookup (Google Sheet) ────────────────────── */

export type LifetimeMember = { memberId: string; name: string; pledgedAmount: string; address: string; mobile: string; joinYear: string; dueYears: number[] };

/**
 * Columns: 1 member id, 2 name, 3 pledged amount, 4 address, 5 mobile,
 * 6.. one per year from 2018. A non-empty cell means paid unless it says
 * reject/closed/cancel/unactive. Unpaid years from 2024 up to now are due.
 */
export async function findLifetimeMember(memberId: string, phone: string): Promise<LifetimeMember | null> {
  const res = await fetch(LIFETIME_SHEET, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch failed");
  const now = new Date().getFullYear();
  const rows: LifetimeMember[] = [];
  for (const line of (await res.text()).split("\n")) {
    const c = line
      .trim()
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((v) => v.trim().replace(/^"|"$/g, "").trim());
    if (c.length < 6) continue;
    const id = parseInt(c[1].replace(/[^0-9]/g, ""), 10);
    if (!id || id <= 0) continue;
    let joinYear = "";
    const dueYears: number[] = [];
    for (let y = 2018; y <= 2028; y++) {
      const cell = (c[6 + (y - 2018)] || "").trim();
      const low = cell.toLowerCase();
      const paid = cell.length > 0 && cell !== "0" && !["reject", "clos", "cancel", "unactive"].some((k) => low.includes(k));
      if (paid && !joinYear) joinYear = String(y);
      if (joinYear && y <= now && !paid && y >= 2024) dueYears.push(y);
    }
    rows.push({ memberId: c[1], name: c[2], pledgedAmount: c[3], address: c[4], mobile: c[5], joinYear, dueYears });
  }
  const wantId = digitsOnly(memberId);
  const wantPhone = digitsOnly(phone);
  return (
    rows.find((r) => {
      const id = digitsOnly(r.memberId);
      const mob = digitsOnly(r.mobile);
      return id === wantId && (mob.includes(wantPhone) || wantPhone.includes(mob) || (wantPhone.length >= 6 && mob.endsWith(wantPhone.slice(-6))));
    }) ?? null
  );
}

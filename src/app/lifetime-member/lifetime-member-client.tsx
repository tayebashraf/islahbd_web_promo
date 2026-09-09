"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import {
  Crown,
  Users,
  BookMarked,
  PartyPopper,
  HeartHandshake,
  HeartPulse,
  BookOpenCheck,
  Sparkles,
  Star,
  MapPin,
  X,
  Loader2,
  Gem,
  Medal,
  Shield,
  Heart,
  UserPlus,
  UserCheck,
  PhoneCall,
  Calendar,
  Clock,
  Navigation,
  Check,
  Copy,
  ChevronRight,
  Search,
  Tag,
  User,
  Briefcase,
  Home,
  Handshake,
  BadgeCheck,
  Wallet,
  Send,
  Receipt,
  Landmark,
  CircleAlert,
  CircleCheck,
  ArrowRight,
  Sparkle,
} from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm5.8 14.07c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.3-3.4-.7-2.87-1.2-4.72-4.13-4.86-4.32-.14-.19-1.16-1.55-1.16-2.95s.72-2.1.98-2.38c.24-.27.53-.34.71-.34l.5.01c.16 0 .38-.06.6.46.24.57.8 1.98.87 2.12.07.14.11.3.02.49-.09.19-.14.3-.27.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

// Target Conference Date: December 5, 2026, 09:00 AM
const TARGET_DATE = new Date(2026, 11, 5, 9, 0, 0);

const TIERS = [
  {
    id: "platinum",
    icon: Crown,
    color: "#D97706",
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    border: "border-amber-500/40",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    amountBn: "১,০০,০০০ টাকা",
    amountEn: "৳100,000",
    monthlyBn: "মাসে প্রায় ৮,৩৩৪ টাকা",
    monthlyEn: "Approx. ৳8,334 / month",
    titleBn: "প্ল্যাটিনাম সদস্য",
    titleEn: "Platinum Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
    num: 100000,
  },
  {
    id: "diamond",
    icon: Gem,
    color: "#0EA5E9",
    gradient: "from-sky-500/20 via-sky-500/10 to-transparent",
    border: "border-sky-500/40",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    amountBn: "৭৫,০০০ টাকা",
    amountEn: "৳75,000",
    monthlyBn: "মাসে প্রায় ৬,২৫০ টাকা",
    monthlyEn: "Approx. ৳6,250 / month",
    titleBn: "ডায়মন্ড সদস্য",
    titleEn: "Diamond Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
    num: 75000,
  },
  {
    id: "gold",
    icon: Star,
    color: "#EAB308",
    gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
    border: "border-yellow-500/40",
    badgeBg: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    amountBn: "৫০,০০০ টাকা",
    amountEn: "৳50,000",
    monthlyBn: "মাসে প্রায় ৪,১৬৭ টাকা",
    monthlyEn: "Approx. ৳4,167 / month",
    titleBn: "গোল্ড সদস্য",
    titleEn: "Gold Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
    num: 50000,
  },
  {
    id: "silver",
    icon: Shield,
    color: "#64748B",
    gradient: "from-slate-500/20 via-slate-500/10 to-transparent",
    border: "border-slate-500/40",
    badgeBg: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
    amountBn: "২৫,০০০ টাকা",
    amountEn: "৳25,000",
    monthlyBn: "মাসে প্রায় ২,০৮৪ টাকা",
    monthlyEn: "Approx. ৳2,084 / month",
    titleBn: "সিলভার সদস্য",
    titleEn: "Silver Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
    num: 25000,
  },
  {
    id: "vip",
    icon: Medal,
    color: "#059669",
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    border: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    amountBn: "১০,০০০ টাকা",
    amountEn: "৳10,000",
    monthlyBn: "মাসে প্রায় ৮৩৪ টাকা",
    monthlyEn: "Approx. ৳834 / month",
    titleBn: "ভিআইপি সদস্য",
    titleEn: "VIP Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
    num: 10000,
  },
  {
    id: "well_wisher",
    icon: Heart,
    color: "#8B5CF6",
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
    border: "border-purple-500/40",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    amountBn: "৫,০০০ টাকা",
    amountEn: "৳5,000",
    monthlyBn: "মাসে প্রায় ৪১৭ টাকা",
    monthlyEn: "Approx. ৳417 / month",
    titleBn: "শুভাকাঙ্ক্ষী সদস্য",
    titleEn: "Well-Wisher Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
    num: 5000,
  },
];

const BENEFITS = [
  {
    icon: Users,
    titleBn: "উলামা ও তালেবে ইলমদের সাথে সংযোগ",
    titleEn: "Bond with Ulama & Students",
    bn: "উলামায়ে কেরাম ও তালিবুল ইলমদের সাথে সার্বক্ষণিক আত্মিক ও দ্বীনি সম্পর্কে জুড়ে থাকা যায়।",
    en: "Stay spiritually connected with the Ulama and devoted students of Quranic knowledge.",
  },
  {
    icon: BookMarked,
    titleBn: "বিশেষ রেজিস্ট্রি খাতায় স্থায়ী নাম",
    titleEn: "Permanent Record in Registry",
    bn: "মাদরাসার বিশেষ সংরক্ষিত রেজিস্ট্রি খাতায় আপনার নাম আজীবন সদস্য হিসেবে লিপিবদ্ধ হয়ে যায়।",
    en: "Your name is forever inscribed in the madrasah's special institutional registry.",
  },
  {
    icon: PartyPopper,
    titleBn: "বাৎসরিক সম্মেলনে সরাসরি সান্নিধ্য",
    titleEn: "Annual Conference Gathering",
    bn: "বছরে কমপক্ষে একবার আজীবন সদস্য সম্মেলনে অংশগ্রহণের মাধ্যমে উলামায়ে কেরাম ও মাশায়েখদের সান্নিধ্যে আহার ও বিশেষ দোয়ায় শরীক থাকা যায়।",
    en: "Attend the annual Lifetime Member Conference — dining and joining heartfelt special prayers with the Ulama and scholars.",
  },
  {
    icon: HeartHandshake,
    titleBn: "প্রতিদিনের বিশেষ দোয়ার সৌভাগ্য",
    titleEn: "Daily Special Dua of Huffaz",
    bn: "প্রতিদিন শত শত হাফেয ও আলেম মাদরাসার বিশেষ দোয়ায় আজীবন সদস্যদের ইহকালীন ও পরকালীন সার্বিক কল্যাণে মুনাজাত করেন।",
    en: "Hundreds of Huffaz and Islamic scholars pray daily for lifetime members in the madrasah's congregational dua.",
  },
  {
    icon: HeartPulse,
    titleBn: "অসুস্থতা ও বিপদে বিশেষ দোয়ার ব্যবস্থা",
    titleEn: "Emergency Dua Support in Hardship",
    bn: "কোনো সদস্য বা তাঁর আপনজন অসুস্থ হলে বা বিপদে পড়লে মাদরাসায় তাঁর জন্য বিশেষ খাস দোয়ার এন্তেজাম করা হয়।",
    en: "Special dedicated prayers are immediately arranged whenever a member or their beloved falls ill or faces distress.",
  },
  {
    icon: BookOpenCheck,
    titleBn: "ইন্তেকালে কুরআন খতম ও সওয়াব রেসানী",
    titleEn: "Quran Khatam for Deceased",
    bn: "কোনো সদস্য বা তাঁর ঘনিষ্ঠজন মারা গেলে মাদরাসার উদ্যোগে কুরআন খতম করে পরম শ্রদ্ধায় সওয়াব রেসানী করা হয়।",
    en: "A complete Quran khatam is reverently performed and the divine reward conveyed for a deceased member or loved ones.",
  },
  {
    icon: Sparkles,
    titleBn: "চিরন্তন সদকায়ে জারিয়ার অংশীদার",
    titleEn: "Perpetual Sadaqah Jariyah",
    bn: "মৃত্যুর পরও কিয়ামত পর্যন্ত অব্যাহত সদকায়ে জারিয়ারূপে মাদরাসার প্রতিটি দ্বীনি খেদমতের সওয়াবের অংশ আমলনামায় জমা হতে থাকবে।",
    en: "Even after death, endless blessings from every student educated and verse recited flow into your book of deeds.",
  },
  {
    icon: Star,
    titleBn: "নায়েবে রাসূলদের সাথে হাশরের সুসংবাদ",
    titleEn: "Blessed Company on Judgment Day",
    bn: "আলেম-উলামাদের সাথে খাঁটি মহব্বতের কারণে প্রিয় নবীজী ﷺ এর হাদীসের ভাষ্য অনুযায়ী নায়েবে রাসূলদের সাথে হাশর হওয়ার পরম সৌভাগ্য অর্জন হতে পারে।",
    en: "Out of sincere love for Islamic scholars, hadith promises the honour of being resurrected in the company of the inheritors of the Prophets.",
  },
];

const CONTACTS = [
  { display: "+880 1916-387935", raw: "8801916387935", noteBn: "প্রধান হেল্পলাইন", noteEn: "Main Helpline" },
  { display: "+880 1718-763978", raw: "8801718763978", noteBn: "সদস্য সংগ্রহ উইং", noteEn: "Membership Wing" },
  { display: "+880 1314-803334", raw: "8801314803334", noteBn: "সম্মেলন তথ্যকেন্দ্র", noteEn: "Conference Info Desk" },
];

const OFFICE_WHATSAPP = "8801718763978";

const PAYMENT_NUMBERS = [
  { labelBn: "বিকাশ (মার্চেন্ট/ব্যক্তিগত):", labelEn: "bKash (Merchant/Personal):", number: "01718-763978" },
  { labelBn: "নগদ (পার্সোনাল):", labelEn: "Nagad (Personal):", number: "01916-387935" },
  { labelBn: "রকেট / ব্যাংক একাউন্ট:", labelEn: "Rocket / Bank Account:", number: "01314-803334" },
];

const PAYMENT_METHODS = [
  { name: "বিকাশ", nameEn: "bKash", icon: Wallet, color: "#E11D48" },
  { name: "নগদ", nameEn: "Nagad", icon: Landmark, color: "#EA580C" },
  { name: "রকেট", nameEn: "Rocket", icon: Send, color: "#9333EA" },
  { name: "ব্যাংক", nameEn: "Bank", icon: Landmark, color: "#2563EB" },
  { name: "ক্যাশ (অফিসে)", nameEn: "Cash (Office)", icon: Receipt, color: "#16A34A" },
];

const MEMBER_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU_Ho2JCxvqg9PEeyxVXrdrHPsMpkXd_IJxHhu-mMQH07LYqcCh4jTYWM-5n9XFB9Hk5ngvRYd-xw7/pub?gid=0&single=true&output=csv";

interface MemberRecord {
  punchCode: string;
  memberId: string;
  name: string;
  pledgedAmount: string;
  address: string;
  mobile: string;
  joinYear: string;
  dueYears: number[];
  yearlyRecords: Record<number, string>;
}

function normalizeBanglaDigits(input: string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  let out = input;
  for (let i = 0; i < 10; i++) {
    out = out.split(banglaDigits[i]).join(String(i));
  }
  return out;
}

function normalizePhone(input: string): string {
  let clean = normalizeBanglaDigits(input).trim().replace(/[^0-9+]/g, "");
  if (clean.startsWith("+880")) clean = "0" + clean.slice(4);
  else if (clean.startsWith("880")) clean = "0" + clean.slice(3);
  else if (clean.length === 10 && !clean.startsWith("0")) clean = "0" + clean;
  return clean;
}

function splitCsvLine(line: string): string[] {
  const pattern = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  return line
    .split(pattern)
    .map((c) => c.trim().replace(/^"|"$/g, "").trim());
}

function parseMemberCsv(csvText: string): MemberRecord[] {
  const records: MemberRecord[] = [];
  const lines = csvText.split("\n");
  const currentYear = new Date().getFullYear();
  const startYear = 2018;
  const dataEndYear = 2028;
  const startYearCol = 6;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const cols = splitCsvLine(line);
    if (cols.length < 6) continue;

    const idStr = cols[1];
    const idNum = parseInt(idStr.replace(/[^0-9]/g, ""), 10);
    if (!idNum || idNum <= 0) continue;

    const punchCode = cols[0];
    const memberId = idStr;
    const name = cols[2];
    const pledgedAmount = cols[3];
    const address = cols[4];
    const mobile = cols[5];

    let joinYear = "তথ্য নেই";
    let hasJoined = false;
    const dueYears: number[] = [];
    const yearlyRecords: Record<number, string> = {};

    for (let year = startYear; year <= dataEndYear; year++) {
      const colIndex = startYearCol + (year - startYear);
      if (colIndex < cols.length) {
        const cellData = (cols[colIndex] || "").trim();
        yearlyRecords[year] = cellData;
        const lower = cellData.toLowerCase();
        const isPaid =
          cellData.length > 0 &&
          cellData !== "0" &&
          !lower.includes("reject") &&
          !lower.includes("clos") &&
          !lower.includes("cancel") &&
          !lower.includes("unactive");

        if (isPaid && !hasJoined) {
          joinYear = String(year);
          hasJoined = true;
        }
        if (hasJoined && year <= currentYear && !isPaid && year >= 2024) {
          dueYears.push(year);
        }
      }
    }

    records.push({ punchCode, memberId, name, pledgedAmount, address, mobile, joinYear, dueYears, yearlyRecords });
  }

  return records;
}

async function searchMember(memberId: string, mobile: string): Promise<MemberRecord | null> {
  const res = await fetch(MEMBER_CSV_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch failed");
  const text = await res.text();
  const members = parseMemberCsv(text);

  const cleanId = normalizeBanglaDigits(memberId).trim().replace(/[^0-9]/g, "");
  const cleanMobile = normalizeBanglaDigits(mobile).trim().replace(/[^0-9]/g, "");

  for (const m of members) {
    const mCleanId = normalizeBanglaDigits(m.memberId).trim().replace(/[^0-9]/g, "");
    const mCleanMobile = normalizeBanglaDigits(m.mobile).trim().replace(/[^0-9]/g, "");

    const idMatches = mCleanId === cleanId;
    const mobileMatches =
      cleanMobile.length === 0 ||
      mCleanMobile.includes(cleanMobile) ||
      cleanMobile.includes(mCleanMobile) ||
      (cleanMobile.length >= 6 && mCleanMobile.endsWith(cleanMobile.slice(-6)));

    if (idMatches && mobileMatches) return m;
  }
  return null;
}

function validateBdPhone(value: string, required: boolean): string | null {
  if (!value.trim()) return required ? "মোবাইল নম্বর প্রদান করুন" : null;
  const clean = normalizeBanglaDigits(value).trim().replace(/[^0-9+]/g, "");
  let bdClean = clean;
  if (bdClean.startsWith("+880")) bdClean = "0" + bdClean.slice(4);
  else if (bdClean.startsWith("880")) bdClean = "0" + bdClean.slice(3);
  else if (bdClean.length === 10 && !bdClean.startsWith("0")) bdClean = "0" + bdClean;

  if (bdClean.startsWith("01") || (!bdClean.startsWith("+") && bdClean.length <= 11)) {
    if (bdClean.length < 11) return `মোবাইল নম্বর কম হয়েছে (${bdClean.length}/১১ ডিজিট)`;
    if (bdClean.length > 11) return `মোবাইল নম্বর বেশি হয়েছে (${bdClean.length}/১১ ডিজিট)`;
    if (!/^01[3-9]\d{8}$/.test(bdClean)) return "সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)";
  } else if (clean.startsWith("+")) {
    if (clean.length < 8 || clean.length > 15) return "সঠিক আন্তর্জাতিক নম্বর লিখুন";
  } else if (clean.length < 11) {
    return "১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)";
  }
  return null;
}

function useCountdown(target: Date) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setLeft({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}

function CountdownBox({ value, label, isSeconds }: { value: number; label: string; isSeconds?: boolean }) {
  const formatted = value < 10 ? `0${value}` : `${value}`;
  return (
    <div className="flex-1 min-w-0 flex flex-col items-center">
      <div
        className={`w-full max-w-[70px] h-12 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-card border ${
          isSeconds ? "border-gold/60 shadow-sm" : "border-border"
        } relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent opacity-50 pointer-events-none" />
        <span className="text-base sm:text-2xl font-extrabold text-foreground font-display tracking-tight">
          {formatted}
        </span>
      </div>
      <span className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared field components (mirrors app TextField/PhoneField)
// ─────────────────────────────────────────────
function FieldLabel({ label, helper }: { label: string; helper?: string }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      {helper && <span className="text-[11px] text-muted-foreground/70">{helper}</span>}
    </div>
  );
}

function TextInput({
  label,
  hint,
  icon: Icon,
  value,
  onChange,
  error,
  helper,
  type = "text",
}: {
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  helper?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} helper={helper} />
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-secondary/60 border text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 placeholder:font-normal outline-none transition-colors focus:border-gold ${
            error ? "border-red-500/60" : "border-border"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500 leading-snug">{error}</p>}
    </div>
  );
}

function PhoneInput({
  label,
  hint,
  value,
  onChange,
  error,
  helper,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  helper?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} helper={helper} />
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pr-2 border-r border-border/70">
          <span className="text-sm">🇧🇩</span>
          <span className="text-xs font-bold text-muted-foreground">+880</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(normalizeBanglaDigits(e.target.value).replace(/[^0-9+]/g, "").slice(0, 14))}
          placeholder={hint}
          className={`w-full h-11 pl-[4.7rem] pr-3.5 rounded-xl bg-secondary/60 border text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 placeholder:font-normal outline-none transition-colors focus:border-gold ${
            error ? "border-red-500/60" : "border-border"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500 leading-snug">{error}</p>}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <Icon className="w-[18px] h-[18px] text-gold-dark dark:text-gold shrink-0" />
      <h4 className="text-[13.5px] font-bold text-foreground">{title}</h4>
    </div>
  );
}

export function LifetimeMemberClient() {
  const { t } = useLang();

  const [portalOpen, setPortalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<0 | 1>(0);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

  // ── New Member form state ──
  const [selectedTierId, setSelectedTierId] = useState("gold");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newWhatsapp, setNewWhatsapp] = useState("");
  const [newProfession, setNewProfession] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [mediumName, setMediumName] = useState("");
  const [mediumPhone, setMediumPhone] = useState("");
  const [newErrors, setNewErrors] = useState<Record<string, string | null>>({});
  const [reviewOpen, setReviewOpen] = useState(false);

  const currentTier = useMemo(() => TIERS.find((x) => x.id === selectedTierId) ?? TIERS[2], [selectedTierId]);

  // ── Existing member state ──
  const [existingId, setExistingId] = useState("");
  const [existingMobile, setExistingMobile] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundMember, setFoundMember] = useState<MemberRecord | null>(null);
  const [selectedDueYears, setSelectedDueYears] = useState<Set<number>>(new Set());

  // ── Payment instructions modal ──
  const [payModal, setPayModal] = useState<null | {
    title: string;
    titleEn: string;
    amountText: string;
    applicantName: string;
    applicantPhone: string;
    memberId?: string;
    yearsToPay?: number[];
  }>(null);
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("বিকাশ");
  const [senderError, setSenderError] = useState<string | null>(null);

  // ── Success dialog ──
  const [successDialog, setSuccessDialog] = useState<null | { title: string; description: string; waMessage: string }>(null);

  const openPortal = (tab: 0 | 1 = 0) => {
    setPortalTab(tab);
    setPortalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/-/g, ""));
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  useEffect(() => {
    if (!portalOpen && !payModal && !successDialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (successDialog) setSuccessDialog(null);
      else if (payModal) setPayModal(null);
      else if (portalOpen) setPortalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [portalOpen, payModal, successDialog]);

  // ── New member submit ──
  const validateNewMemberForm = () => {
    const errs: Record<string, string | null> = {
      name: newName.trim() ? null : "নাম প্রদান করুন",
      phone: validateBdPhone(newPhone, true),
      profession: newProfession.trim() ? null : "পেশা / পদবী প্রদান করুন",
      address: newAddress.trim() ? null : "বর্তমান ঠিকানা প্রদান করুন",
      whatsapp: validateBdPhone(newWhatsapp, false),
      mediumPhone: validateBdPhone(mediumPhone, false),
    };
    setNewErrors(errs);
    return Object.values(errs).every((e) => !e);
  };

  const submitNewMemberForm = () => {
    if (!validateNewMemberForm()) return;
    setReviewOpen(true);
  };

  const completeNewMemberSubmissionWithoutPay = () => {
    const name = newName.trim();
    const phone = normalizePhone(newPhone);
    const wa = newWhatsapp.trim() ? normalizePhone(newWhatsapp) : phone;
    const profession = newProfession.trim();
    const address = newAddress.trim();
    const mName = mediumName.trim();
    const mPhone = mediumPhone.trim() ? normalizePhone(mediumPhone) : "";
    const tier = currentTier;

    const waMessage = encodeURIComponent(
      "আসসালামু আলাইকুম,\n" +
        "আমি জামেআ মারকাযুল ইহসানের নতুন আজীবন সদস্য হওয়ার জন্য আবেদন করছি:\n\n" +
        `👤 নাম: ${name}\n` +
        `📞 মোবাইল: ${phone}\n` +
        `💬 হোয়াটসঅ্যাপ: ${wa}\n` +
        `💼 পেশা: ${profession || "উল্লেখ নেই"}\n` +
        `🏠 ঠিকানা: ${address || "উল্লেখ নেই"}\n` +
        `💰 বাৎসরিক অনুদান ক্যাটাগরি: ${t(tier.amountBn, tier.amountEn)} (${t(tier.titleBn, tier.titleEn)})\n` +
        `🤝 মাধ্যম: ${mName || "নেই"}\n` +
        `📱 মাধ্যমের মোবাইল: ${mPhone || "নেই"}\n\n` +
        "দয়া করে আমার আবেদনটি রেকর্ড করে সদস্য কার্ড ইস্যু করার ব্যবস্থা করবেন। জাযাকাল্লাহু খাইরান।"
    );

    setReviewOpen(false);
    setSuccessDialog({
      title: t("আবেদন সফলভাবে গৃহীত হয়েছে!", "Application Submitted Successfully!"),
      description: t(
        "আপনার তথ্য মারকাযুল ইহসান দপ্তরে জমা দেওয়া হয়েছে। কনফার্মেশনের জন্য অফিস হোয়াটসঅ্যাপে বার্তা পাঠাতে পারেন।",
        "Your information has been submitted to the Markazul Ihsan office. Message the office WhatsApp for confirmation."
      ),
      waMessage,
    });
  };

  const openPayForNewMember = () => {
    setReviewOpen(false);
    setSenderNumber(newPhone);
    setTrxId("");
    setPaymentMethod("বিকাশ");
    setSenderError(null);
    setPayModal({
      title: "নতুন সদস্য অনুদান পরিশোধ",
      titleEn: "New Member Contribution Payment",
      amountText: t(currentTier.amountBn, currentTier.amountEn),
      applicantName: newName.trim(),
      applicantPhone: normalizePhone(newPhone),
    });
  };

  // ── Existing member search ──
  const runSearch = async () => {
    const memberId = normalizeBanglaDigits(existingId).trim();
    const rawMobile = existingMobile.trim();
    if (!memberId || !rawMobile) {
      setSearchError(t("দয়া করে সদস্য নম্বর এবং মোবাইল নম্বর উভয়ই লিখুন", "Please enter both member ID and mobile number"));
      return;
    }
    setSearching(true);
    setSearchError(null);
    setFoundMember(null);
    setSelectedDueYears(new Set());
    try {
      const mobile = normalizePhone(rawMobile);
      const result = await searchMember(memberId, mobile);
      if (result) {
        setFoundMember(result);
        setSelectedDueYears(new Set(result.dueYears));
      } else {
        setSearchError(
          t(
            `দুঃখিত! সদস্য নং (${memberId}) এবং মোবাইল নম্বরের সাথে কোনো সদস্যের তথ্য মেলেনি। অনুগ্রহ করে সঠিক সদস্য আইডি ও মোবাইল নম্বর দিয়ে আবার চেষ্টা করুন।`,
            `Sorry! No member found matching ID (${memberId}) and mobile number. Please try again with the correct member ID and mobile number.`
          )
        );
      }
    } catch {
      setSearchError(t("তথ্য আনতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।", "Failed to fetch data. Please check your internet connection."));
    } finally {
      setSearching(false);
    }
  };

  const toggleDueYear = (year: number) => {
    setSelectedDueYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const openPayForExisting = () => {
    if (!foundMember) return;
    const years = Array.from(selectedDueYears).sort((a, b) => a - b);
    setSenderNumber(foundMember.mobile);
    setTrxId("");
    setPaymentMethod("বিকাশ");
    setSenderError(null);
    setPayModal({
      title: "আজীবন সদস্য বকেয়া/চলতি অনুদান",
      titleEn: "Lifetime Member Due/Current Contribution",
      amountText: `${foundMember.pledgedAmount}${years.length > 1 ? ` × ${years.length} ${t("বছর", "years")}` : ""}`,
      applicantName: foundMember.name,
      applicantPhone: foundMember.mobile,
      memberId: foundMember.memberId,
      yearsToPay: years,
    });
  };

  const submitPayment = () => {
    if (!payModal) return;
    const num = senderNumber.trim();
    if (!num) {
      setSenderError(t("দয়া করে প্রেরকের মোবাইল নম্বর লিখুন", "Please enter the sender's mobile number"));
      return;
    }
    const yearsStr = payModal.yearsToPay && payModal.yearsToPay.length > 0 ? payModal.yearsToPay.join(", ") : t("চলতি বছর", "Current year");
    const methodBn = paymentMethod;

    const waMsg = encodeURIComponent(
      "আসসালামু আলাইকুম,\n" +
        "আমি আজীবন সদস্য অনুদান পরিশোধের রসিদ ও বিবরণ পাঠাচ্ছি:\n\n" +
        (payModal.memberId ? `🆔 সদস্য নং: ${payModal.memberId}\n` : "") +
        `👤 নাম: ${payModal.applicantName}\n` +
        `📞 মোবাইল: ${payModal.applicantPhone}\n` +
        `💰 অনুদানের পরিমাণ: ${payModal.amountText}\n` +
        `🗓️ পরিশোধিত বছর: ${yearsStr}\n` +
        `💳 পেমেন্ট মাধ্যম: ${methodBn}\n` +
        `📱 প্রেরক নম্বর: ${num}\n` +
        `🔖 TrxID: ${trxId.trim() || "নগদ/প্রযোজ্য নয়"}\n\n` +
        "দয়া করে যাচাই করে অফিসিয়াল রসিদ নিশ্চিত করুন। জাযাকাল্লাহু খাইরান।"
    );

    setPayModal(null);
    setSuccessDialog({
      title: t("পেমেন্ট তথ্য সফলভাবে দাখিল হয়েছে!", "Payment Details Submitted Successfully!"),
      description: t(
        "আপনার পেমেন্টের বিবরণী মারকাযুল ইহসানের একাউন্ট শাখায় পাঠানো হয়েছে। অফিস হোয়াটসঅ্যাপে স্লিপ পাঠিয়ে রসিদ কনফার্ম করুন।",
        "Your payment details have been sent to the Markazul Ihsan accounts office. Send the slip on office WhatsApp to confirm your receipt."
      ),
      waMessage: waMsg,
    });
  };

  const dueCount = foundMember?.dueYears.length ?? 0;
  const paidCount = foundMember
    ? Object.values(foundMember.yearlyRecords).filter((v) => v && v !== "0" && !v.toLowerCase().includes("unactive")).length
    : 0;

  const relevantYears = useMemo(() => {
    if (!foundMember) return [];
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(foundMember.joinYear, 10) || 2018;
    const years: number[] = [];
    for (let y = startYear; y <= currentYear; y++) years.push(y);
    return years;
  }, [foundMember]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-gold/30 selection:text-foreground pb-20 sm:pb-12">
      {/* ─── MAIN CONTENT (No header, No footer) ─── */}
      <main className="flex-1 relative overflow-hidden py-6 sm:py-12 lg:py-16" id="main-content">
        {/* Ambient Decorative Background */}
        <div className="absolute inset-0 gradient-gold opacity-[0.04] pointer-events-none" />
        <div className="absolute inset-0 islamic-pattern-subtle opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-emerald-deep/10 blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12 lg:space-y-16">
          {/* 1. HERO BANNER */}
          <motion.div
            className="text-center pt-2 sm:pt-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Calligraphy / Bismillah */}
            <p className="font-arabic text-lg sm:text-2xl text-gold mb-2.5 opacity-90 select-none">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Organization Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold-dark dark:text-gold text-xs sm:text-sm font-semibold mb-3.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{t("জামেআ মারকাযুল ইহসান ঢাকা", "Jamea Markazul Ihsan Dhaka")}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground tracking-tight mb-3 text-balance leading-tight">
              {t(
                <>
                  আজীবন সদস্য <span className="text-gold">সম্মেলন ২০২৬</span>
                </>,
                <>
                  Lifetime Member <span className="text-gold">Conference 2026</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty px-2">
              {t(
                "পরম শ্রদ্ধেয় শায়েখ হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেব (দামাত বারাকাতুহুম) এর স্নেহধন্য দ্বীনি মারকাযের স্থায়ী সহযোগী ও সদকায়ে জারিয়ার অংশীদার হোন।",
                "Join as a noble Lifetime Member of Jamea Markazul Ihsan Dhaka under the guidance of Hazrat Maulana Shah Tayyeb Ashraf Shaheb and earn perpetual rewards."
              )}
            </p>
          </motion.div>

          {/* 2. DATE, VENUE & COUNTDOWN CARD */}
          <motion.div
            className="rounded-2xl sm:rounded-3xl border border-gold/40 bg-gradient-to-br from-card via-card to-gold/5 p-4 sm:p-7 lg:p-10 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-32 sm:w-40 h-32 sm:h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Event Details */}
              <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t("সম্মেলন তারিখ ও সময়", "Conference Date & Time")}</span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gold-dark dark:text-gold font-display leading-snug">
                  {t("৫ই ডিসেম্বর ২০২৬ (শনিবার)", "5 December 2026 (Saturday)")}
                </h2>

                <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center justify-center lg:justify-start gap-1.5">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span>{t("সকাল ৯:০০ ঘটিকা হইতে আরম্ভ", "Starts at 09:00 AM")}</span>
                  </div>
                  <div className="flex items-start justify-center lg:justify-start gap-1.5">
                    <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      {t(
                        "গুলশানে আল্লামা শাহ আব্দুল মতীন কমপ্লেক্স, পাইটি, ডেমরা, ঢাকা",
                        "Gulshane Allama Shah Abdul Matin Complex, Paiti, Demra, Dhaka"
                      )}
                    </span>
                  </div>
                </div>

                {/* Direct Google Maps & WhatsApp Navigation */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href="https://maps.google.com/?q=Demra,Dhaka,Bangladesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-gold" />
                    <span>{t("গুগল ম্যাপে লোকেশন", "View Location")}</span>
                  </a>
                  <a
                    href={`https://wa.me/8801916387935?text=${encodeURIComponent(
                      t(
                        "আসসালামু আলাইকুম, আমি আজীবন সদস্য সম্মেলন ২০২৬ সম্পর্কে তথ্য জানতে চাই।",
                        "Assalamu Alaikum, I would like to know more about Lifetime Member Conference 2026."
                      )
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 text-xs font-semibold transition-all"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>{t("হোয়াটসঅ্যাপে তথ্য নিন", "Ask on WhatsApp")}</span>
                  </a>
                </div>
              </div>

              {/* Countdown Clocks */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-border/80">
                <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("সম্মেলন শুরু হতে বাকি", "Countdown to Conference")}
                </span>
                <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2.5 max-w-sm mx-auto">
                  <CountdownBox value={days} label={t("দিন", "Days")} />
                  <span className="text-gold text-sm sm:text-lg font-bold pb-4 sm:pb-5">:</span>
                  <CountdownBox value={hours} label={t("ঘণ্টা", "Hours")} />
                  <span className="text-gold text-sm sm:text-lg font-bold pb-4 sm:pb-5">:</span>
                  <CountdownBox value={minutes} label={t("মিনিট", "Mins")} />
                  <span className="text-gold text-sm sm:text-lg font-bold pb-4 sm:pb-5">:</span>
                  <CountdownBox value={seconds} label={t("সেকেন্ড", "Secs")} isSeconds />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. ABOUT LIFETIME MEMBERSHIP */}
          <motion.div
            className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-7 lg:p-10 shadow-md relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark dark:text-gold shrink-0">
                <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-2xl text-foreground">
                {t("আজীবন সদস্য কী ও এর মহৎ উদ্দেশ্য?", "What is Lifetime Membership?")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-line text-pretty">
              {t(
                `আমাদের পরম শ্রদ্ধেয় শায়েখ হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেব (দামাত বারাকাতুহুম) এর প্রতিষ্ঠিত ও পরিচালিত দ্বীনি প্রতিষ্ঠান "জামেআ মারকাযুল ইহসান ঢাকা (গুলশানে আল্লামা শাহ আব্দুল মতীন কমপ্লেক্স)"।

প্রতিষ্ঠানটির সামগ্রিক উন্নতি-অগ্রগতি এবং শত শত তালিবুল ইলম ও কুরআনের হাফেজদের আর্থিক খেদমতের সহযোগিতাকে বেগবান করার লক্ষ্যে যাঁরা বাৎসরিক নির্দিষ্ট অনুদান প্রদানের অঙ্গীকার করেন, তাঁরাই হলেন এই জামেআর সম্মানিত আজীবন সদস্য। এটি দুনিয়া ও আখেরাতের এক চিরন্তন সদকায়ে জারিয়া।`,
                `Jamea Markazul Ihsan Dhaka (Gulshane Allama Shah Abdul Matin Complex) is an esteemed Islamic institution founded and led by our respected mentor, Hazrat Maulana Shah Tayyeb Ashraf Shaheb (may Allah preserve him).

Those noble souls who pledge a fixed annual contribution to support the comprehensive growth of the institution and the ongoing care of hundreds of Quranic students and scholars become its honoured Lifetime Members — establishing a lasting Sadaqah Jariyah for both this world and the Hereafter.`
              )}
            </p>
          </motion.div>

          {/* 4. ANNUAL CONTRIBUTION TIERS */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-2xl mx-auto px-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark dark:text-gold text-xs font-semibold mb-2">
                <Gem className="w-3.5 h-3.5" />
                <span>{t("সদস্যপদ ক্যাটাগরি", "Membership Categories")}</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-3xl text-foreground mb-1.5">
                {t("বাৎসরিক অনুদান ক্যাটাগরি ও স্তরসমূহ", "Annual Contribution Tiers")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t(
                  "আপনার সুবিধাজনক যেকোনো ক্যাটাগরি বেছে নিয়ে আজই আজীবন সদস্য ফরম পূরণ করুন।",
                  "Choose any category suitable for you and apply online today."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {TIERS.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.id}
                    className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${tier.border} bg-card hover:shadow-lg transition-all duration-300 group overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity`} />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: `${tier.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: tier.color }} />
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tier.badgeBg}`}>
                          {t(tier.titleBn, tier.titleEn)}
                        </span>
                      </div>

                      <div className="mb-2">
                        <p className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
                          {t(tier.amountBn, tier.amountEn)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t(tier.subBn, tier.subEn)}
                        </p>
                      </div>

                      <div className="pt-2 pb-3 border-t border-border/50 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        {t(tier.monthlyBn, tier.monthlyEn)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTierId(tier.id);
                        openPortal(0);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-border bg-background hover:bg-secondary text-foreground text-xs font-semibold transition-all group-hover:border-gold/50 group-hover:bg-gold/10"
                    >
                      <span>{t("এই ক্যাটাগরিতে আবেদন", "Select Category")}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 5. 8 BENEFITS GRID & ACTION PORTAL */}
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* 8 Benefits */}
            <motion.div
              className="lg:col-span-7 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark dark:text-gold text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t("ফায়দা ও বরকত", "Benefits & Virtues")}</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-3xl text-foreground">
                  {t("আজীবন সদস্য হওয়ার ৮টি বিশেষ ফায়দা", "8 Core Benefits of Membership")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BENEFITS.map((b, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col gap-1.5 p-3.5 sm:p-4 rounded-2xl border border-border bg-card hover:border-gold/40 transition-all"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                        <b.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark dark:text-gold" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-[13px] text-foreground leading-snug">
                        {t(b.titleBn, b.titleEn)}
                      </h4>
                    </div>
                    <p className="text-[11px] sm:text-xs leading-relaxed text-muted-foreground pl-0.5">
                      {t(b.bn, b.en)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Card */}
            <motion.div
              className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-gold/40 bg-gradient-to-br from-card via-card to-gold/10 p-5 sm:p-7 shadow-xl lg:sticky lg:top-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center mb-4 shadow-md">
                <Crown className="w-6 h-6 text-[#111827]" />
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-1.5">
                {t("সদস্য সেবা পোর্টাল", "Member Service Portal")}
              </h3>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {t(
                  "আপনি কি জামেআর নতুন আজীবন সদস্য হতে চান অথবা ইতোমধ্যেই একজন সম্মানিত সদস্য হিসেবে আপনার বাৎসরিক অনুদান হিসেব দেখতে ও পরিশোধ করতে চান?",
                  "Apply as a new lifetime member, or manage existing membership dues and annual contributions online."
                )}
              </p>

              <div className="space-y-2 mb-5 p-3 sm:p-3.5 rounded-xl bg-background/80 border border-border">
                <button
                  onClick={() => openPortal(0)}
                  className="w-full flex items-center gap-2 text-xs text-foreground font-medium hover:text-gold-dark dark:hover:text-gold transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-gold shrink-0" />
                  <span>{t("নতুন সদস্য আবেদন", "New Member Application")}</span>
                </button>
                <button
                  onClick={() => openPortal(1)}
                  className="w-full flex items-center gap-2 text-xs text-foreground font-medium hover:text-gold-dark dark:hover:text-gold transition-colors text-left"
                >
                  <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t("পুরাতন সদস্য — হিসাব ও অনুদান পরিশোধ", "Existing Member Dues & Verification")}</span>
                </button>
              </div>

              <button
                onClick={() => openPortal(0)}
                className="w-full inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-xl gradient-gold text-[#111827] font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:brightness-105 active:scale-95 transition-all focus-ring"
              >
                <Crown className="w-4 h-4" />
                <span>{t("আজীবন সদস্য সেবা পোর্টাল খুলুন", "Open Member Service Portal")}</span>
              </button>

              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-3 text-center">
                {t("সরাসরি অনলাইনে আবেদন ও অনুদান হিসেব পরিচালনা করুন।", "Apply and manage your contributions directly online.")}
              </p>
            </motion.div>
          </div>

          {/* 6. DUA & ASPIRATION CARD */}
          <motion.div
            className="rounded-2xl sm:rounded-3xl border border-gold/40 bg-gradient-to-br from-card via-card to-gold/5 p-4 sm:p-7 lg:p-10 shadow-md text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HeartHandshake className="w-8 h-8 sm:w-10 sm:h-10 text-gold-dark dark:text-gold mx-auto mb-2.5" />
            <h3 className="font-display font-bold text-lg sm:text-2xl text-gold-dark dark:text-gold mb-2">
              {t("আমাদের ফিকির ও দোয়া", "Our Aspiration & Dua")}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto whitespace-pre-line text-pretty">
              {t(
                `দ্বীনি এ খেদমতে অংশগ্রহণ করার লক্ষ্যে আমরা নিজেরা সদস্য হওয়ার ও নিজেদের আপনজন প্রিয়জনদেরকে সদস্য করার ফিকির করবো ইনশাআল্লাহ।

সেই সাথে দোয়া করবো, মহান আল্লাহ রাব্বুল আলামীন নিজ দয়া ও অনুগ্রহে খুব বেশি কবুল করুন এবং সফল করুন। আমীন।`,
                `To take part in this noble religious endeavor, let us strive to become members ourselves and encourage our beloved family and friends to join.

And let us pray that Allah, the Most Merciful, accepts this purely for His sake and crowns it with immense success and eternal rewards. Ameen.`
              )}
            </p>
          </motion.div>

          {/* 7. DIRECT CONTACT & HELPLINE */}
          <motion.div
            className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-7 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-xl text-foreground leading-snug">
                  {t("জরুরি হেল্পলাইন ও সরাসরি যোগাযোগ", "Helpline & Direct Support")}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  {t(
                    "সম্মেলন ও সদস্যপদ সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি যোগাযোগ করুন",
                    "Reach out directly for membership or conference inquiries"
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CONTACTS.map((c) => (
                <div
                  key={c.raw}
                  className="flex flex-col justify-between gap-2.5 p-3.5 rounded-2xl border border-border bg-background hover:border-gold/40 transition-all"
                >
                  <div>
                    <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-gold-dark dark:text-gold mb-0.5">
                      {t(c.noteBn, c.noteEn)}
                    </span>
                    <p className="font-bold text-foreground text-sm sm:text-base font-mono tracking-tight">
                      {c.display}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/60">
                    {/* Copy Number */}
                    <button
                      onClick={() => copyToClipboard(c.display)}
                      className="flex-1 inline-flex items-center justify-center gap-1 h-8 px-2 rounded-lg border border-border hover:bg-secondary text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all"
                      title={t("নাম্বার কপি করুন", "Copy Number")}
                    >
                      {copiedNumber === c.display ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">{t("কপি হয়েছে", "Copied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t("কপি", "Copy")}</span>
                        </>
                      )}
                    </button>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${c.raw}?text=${encodeURIComponent(
                        t(
                          "আসসালামু আলাইকুম, আমি জামেআ মারকাযুল ইহসানের আজীবন সদস্য সম্মেলন ২০২৬ সম্পর্কে জানতে আগ্রহী।",
                          "Assalamu Alaikum, I am interested in learning about the Lifetime Member Conference 2026 of Jamea Markazul Ihsan."
                        )
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white hover:brightness-110 active:scale-95 transition-all shrink-0"
                      aria-label={t("হোয়াটসঅ্যাপে বার্তা পাঠান", "Chat on WhatsApp")}
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                    </a>

                    {/* Direct Call */}
                    <a
                      href={`tel:+${c.raw}`}
                      className="w-8 h-8 rounded-lg bg-gold/15 text-gold-dark dark:text-gold flex items-center justify-center hover:bg-gold/25 active:scale-95 transition-all shrink-0"
                      aria-label={t("কল করুন", "Call")}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* ─── MOBILE STICKY FLOATING BOTTOM BAR (Clean Mobile UX) ─── */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-40">
        <div className="backdrop-blur-xl bg-card/95 border border-gold/40 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
          <button
            onClick={() => openPortal(0)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl gradient-gold text-[#111827] font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <Crown className="w-4 h-4" />
            <span>{t("সদস্য পোর্টাল খুলুন", "Open Member Portal")}</span>
          </button>
          <a
            href={`https://wa.me/8801916387935?text=${encodeURIComponent(
              t(
                "আসসালামু আলাইকুম, আমি জামেআ মারকাযুল ইহসানের আজীবন সদস্য সম্মেলন সম্পর্কে জানতে চাই।",
                "Assalamu Alaikum, I would like to inquire about the Lifetime Member Conference."
              )
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shrink-0 shadow-md"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* ─── MEMBER SERVICE PORTAL MODAL (New / Existing Member Tabs) ─── */}
      <AnimatePresence>
        {portalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t("আজীবন সদস্য সেবা পোর্টাল", "Lifetime Member Service Portal")}
            onClick={(e) => e.target === e.currentTarget && setPortalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative w-full sm:max-w-2xl h-[94vh] sm:h-[88vh] bg-background rounded-t-3xl sm:rounded-3xl overflow-hidden border border-gold/40 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-[#111827]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                      {t("আজীবন সদস্য সেবা পোর্টাল", "Lifetime Member Service Portal")}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {t("জামেআ মারকাযুল ইহসান ঢাকা", "Jamea Markazul Ihsan Dhaka")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPortalOpen(false)}
                  aria-label={t("বন্ধ করুন", "Close")}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Segmented Tab Switcher */}
              <div className="p-3 sm:p-4 pb-0 shrink-0">
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-secondary border border-border">
                  <button
                    onClick={() => setPortalTab(0)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-bold transition-all ${
                      portalTab === 0
                        ? "bg-background text-foreground shadow-sm border border-gold/40"
                        : "text-muted-foreground"
                    }`}
                  >
                    <UserPlus className={`w-4 h-4 ${portalTab === 0 ? "text-gold-dark dark:text-gold" : ""}`} />
                    <span>{t("নতুন সদস্য আবেদন", "New Member")}</span>
                  </button>
                  <button
                    onClick={() => setPortalTab(1)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-bold transition-all ${
                      portalTab === 1
                        ? "bg-background text-foreground shadow-sm border border-gold/40"
                        : "text-muted-foreground"
                    }`}
                  >
                    <UserCheck className={`w-4 h-4 ${portalTab === 1 ? "text-gold-dark dark:text-gold" : ""}`} />
                    <span>{t("পুরাতন সদস্য", "Existing Member")}</span>
                  </button>
                </div>
              </div>

              {/* Tab Content (scrollable) */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                {portalTab === 0 ? (
                  <div className="space-y-5">
                    {/* 1. Tier Selection */}
                    <div>
                      <SectionHeader icon={Crown} title={t("১. বাৎসরিক অনুদান ক্যাটাগরি", "1. Annual Contribution Category")} />
                      <div className="space-y-2">
                        {TIERS.map((tier) => {
                          const Icon = tier.icon;
                          const isSelected = selectedTierId === tier.id;
                          return (
                            <button
                              key={tier.id}
                              onClick={() => setSelectedTierId(tier.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                                isSelected ? "shadow-sm" : "bg-card border-border hover:border-gold/30"
                              }`}
                              style={
                                isSelected
                                  ? { borderColor: tier.color, backgroundColor: `${tier.color}14` }
                                  : undefined
                              }
                            >
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${tier.color}${isSelected ? "33" : "1f"}` }}
                              >
                                <Icon className="w-[18px] h-[18px]" style={{ color: tier.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-bold text-foreground">{t(tier.amountBn, tier.amountEn)}</p>
                                <p
                                  className="text-xs font-semibold"
                                  style={{ color: isSelected ? tier.color : undefined }}
                                >
                                  {t(tier.titleBn, tier.titleEn)}
                                </p>
                              </div>
                              <div
                                className="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0"
                                style={{ borderColor: isSelected ? tier.color : "var(--border)", backgroundColor: isSelected ? tier.color : "transparent" }}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Personal Info */}
                    <div>
                      <SectionHeader icon={User} title={t("২. আবেদনকারীর ব্যক্তিগত বিবরণ", "2. Applicant's Personal Details")} />
                      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
                        <TextInput
                          label={t("আপনার পূর্ণ নাম *", "Your Full Name *")}
                          hint={t("যেমন: মুহাম্মদ আব্দুল্লাহ", "e.g. Muhammad Abdullah")}
                          icon={User}
                          value={newName}
                          onChange={setNewName}
                          error={newErrors.name}
                        />
                        <PhoneInput
                          label={t("মোবাইল নম্বর *", "Mobile Number *")}
                          hint="017XXXXXXXX"
                          value={newPhone}
                          onChange={setNewPhone}
                          error={newErrors.phone}
                          helper={t("১১ ডিজিট", "11 digits")}
                        />
                        <PhoneInput
                          label={t("হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)", "WhatsApp Number (Optional)")}
                          hint={t("খালি রাখলে মোবাইল নং ব্যবহৃত হবে", "Leave blank to use mobile number")}
                          value={newWhatsapp}
                          onChange={setNewWhatsapp}
                          error={newErrors.whatsapp}
                        />
                        <TextInput
                          label={t("পেশা / পদবী *", "Profession / Designation *")}
                          hint={t("যেমন: ব্যবসা / চাকরি / শিক্ষকতা", "e.g. Business / Job / Teaching")}
                          icon={Briefcase}
                          value={newProfession}
                          onChange={setNewProfession}
                          error={newErrors.profession}
                        />
                        <TextInput
                          label={t("বর্তমান ঠিকানা *", "Current Address *")}
                          hint={t("যেমন: উত্তরা, ঢাকা", "e.g. Uttara, Dhaka")}
                          icon={Home}
                          value={newAddress}
                          onChange={setNewAddress}
                          error={newErrors.address}
                        />
                      </div>
                    </div>

                    {/* 3. Medium / Reference */}
                    <div>
                      <SectionHeader icon={Handshake} title={t("৩. রেফারেন্স / মাধ্যম", "3. Reference / Medium")} />
                      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
                        <TextInput
                          label={t("কার মাধ্যমে সদস্য হচ্ছেন? (নাম)", "Through whom are you joining? (Name)")}
                          hint={t("যেমন: মাওলানা আব্দুল মতীন", "e.g. Maulana Abdul Matin")}
                          icon={BadgeCheck}
                          value={mediumName}
                          onChange={setMediumName}
                        />
                        <PhoneInput
                          label={t("মাধ্যমের মোবাইল নম্বর (ঐচ্ছিক)", "Medium's Mobile Number (Optional)")}
                          hint="017XXXXXXXX"
                          value={mediumPhone}
                          onChange={setMediumPhone}
                          error={newErrors.mediumPhone}
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={submitNewMemberForm}
                      className="w-full h-[52px] inline-flex items-center justify-center gap-2 rounded-2xl gradient-gold text-[#111827] font-bold text-[15px] shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all"
                    >
                      <span>{t("আবেদন পর্যালোচনা ও পরবর্তী ধাপ", "Review Application & Next Step")}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Hero Search Card */}
                    <div className="p-5 rounded-3xl border border-gold/60 bg-gradient-to-br from-card via-card to-gold/10 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                          <HeartHandshake className="w-5 h-5 text-gold-dark dark:text-gold" />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-foreground">{t("সদস্য তথ্য ও অনুদান হিসেব", "Member Info & Contribution Ledger")}</p>
                          <p className="text-[11px] text-muted-foreground">{t("সদস্য নম্বর ও মোবাইল নম্বর দিয়ে মুহূর্তেই দেখুন", "Look it up instantly with member ID and mobile number")}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <TextInput
                          label={t("সদস্য নাম্বার (Member ID) *", "Member ID *")}
                          hint={t("যেমন: ১ বা ৫৯", "e.g. 1 or 59")}
                          icon={Tag}
                          value={existingId}
                          onChange={(v) => setExistingId(v.replace(/[^0-9০-৯]/g, ""))}
                        />
                        <PhoneInput
                          label={t("নিবন্ধিত মোবাইল নম্বর *", "Registered Mobile Number *")}
                          hint="01718XXXXXX"
                          value={existingMobile}
                          onChange={setExistingMobile}
                          helper={t("১১ ডিজিট", "11 digits")}
                        />
                      </div>

                      <button
                        onClick={runSearch}
                        disabled={searching}
                        className="w-full mt-4 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow disabled:opacity-70 active:scale-[0.98] transition-all"
                      >
                        {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        <span>{searching ? t("অনুসন্ধান হচ্ছে...", "Searching...") : t("হিসেব ও বকেয়া দেখুন", "View Ledger & Dues")}</span>
                      </button>
                    </div>

                    {searchError && (
                      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-red-500/30 bg-red-500/10">
                        <CircleAlert className="w-[18px] h-[18px] text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[12.5px] leading-relaxed text-red-700 dark:text-red-300">{searchError}</p>
                      </div>
                    )}

                    {foundMember ? (
                      <div className="p-4.5 rounded-3xl border-[1.5px] border-gold/70 bg-card shadow-sm p-[18px]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-lg font-bold text-foreground truncate">{foundMember.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {t("সদস্য আইডি", "Member ID")}: #{foundMember.memberId} | {t("মোবাইল", "Mobile")}: {foundMember.mobile}
                            </p>
                          </div>
                          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-gold/15 border border-gold text-[12.5px] font-bold text-gold-dark dark:text-gold">
                            {foundMember.pledgedAmount}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11.5px] font-bold">
                            {t("পরিশোধিত", "Paid")}: {paidCount} {t("বছর", "years")}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold ${
                              dueCount > 0
                                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {dueCount > 0 ? `${t("বকেয়া", "Due")}: ${dueCount} ${t("বছর", "years")}` : `${t("কোনো বকেয়া নেই", "No dues")} ✓`}
                          </span>
                        </div>

                        <div className="h-px bg-border my-4" />

                        <p className="text-[13.5px] font-bold text-foreground mb-2.5">
                          {t("বাৎসরিক অনুদান হিসেব ও বকেয়া বছর নির্বাচন:", "Annual Contribution Ledger & Due Year Selection:")}
                        </p>

                        <div className="space-y-2">
                          {relevantYears.map((year) => {
                            const cell = foundMember.yearlyRecords[year] || "";
                            const isPaid = cell.length > 0 && cell !== "0" && !cell.toLowerCase().includes("unactive");
                            const isSelected = selectedDueYears.has(year);
                            return (
                              <div
                                key={year}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border"
                                style={{
                                  backgroundColor: isPaid ? "var(--secondary)" : isSelected ? "rgba(180,83,9,0.08)" : "transparent",
                                  borderColor: isPaid ? "rgba(16,185,129,0.4)" : isSelected ? "#B45309" : "var(--border)",
                                }}
                              >
                                {isPaid ? (
                                  <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                ) : isSelected ? (
                                  <div className="w-5 h-5 rounded bg-[#B45309] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded border-[1.5px] border-muted-foreground/40 shrink-0" />
                                )}
                                <span className="text-[13.5px] font-bold text-foreground">
                                  {year} {t("সাল", "")}
                                </span>
                                <div className="flex-1" />
                                {isPaid ? (
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11.5px] font-bold">
                                    {t("পরিশোধিত", "Paid")} ✓
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => toggleDueYear(year)}
                                    className={`px-2.5 py-1 rounded-lg text-[11.5px] font-bold transition-colors ${
                                      isSelected ? "bg-[#B45309] text-white" : "bg-red-500/10 text-red-600 dark:text-red-400"
                                    }`}
                                  >
                                    {isSelected ? t("নির্বাচিত ✓", "Selected ✓") : t("বকেয়া (সিলেক্ট করুন)", "Due (Select)")}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={openPayForExisting}
                          className="w-full mt-4 h-[50px] inline-flex items-center justify-center gap-2 rounded-2xl bg-[#B45309] text-white font-bold text-sm shadow active:scale-[0.98] transition-all"
                        >
                          <Wallet className="w-5 h-5" />
                          <span>
                            {selectedDueYears.size === 0
                              ? t("অনুদানের জন্য পরবর্তী ধাপে যান", "Continue to Contribution")
                              : t(
                                  `নির্বাচিত ${selectedDueYears.size}টি বছরের অনুদান পাঠান →`,
                                  `Pay for ${selectedDueYears.size} selected year(s) →`
                                )}
                          </span>
                        </button>
                      </div>
                    ) : (
                      !searching && (
                        <div className="p-4 rounded-2xl border border-border bg-card">
                          <div className="flex items-center gap-2 mb-2">
                            <PhoneCall className="w-[22px] h-[22px] text-emerald-500" />
                            <p className="text-[13px] font-bold text-foreground">
                              {t("সদস্য নম্বর মনে নেই বা সহায়তা প্রয়োজন?", "Don't remember your member number or need help?")}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {t(
                              "মারকাযুল ইহসানের একাউন্ট শাখায় যোগাযোগ করে আপনার সদস্য নম্বর ও বিবরণ জেনে নিতে পারেন:",
                              "Contact the Markazul Ihsan accounts office to retrieve your member number and details:"
                            )}
                          </p>
                          <div className="flex gap-2.5">
                            <a
                              href="tel:+8801718763978"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border border-primary text-primary text-xs font-semibold"
                            >
                              <PhoneCall className="w-4 h-4" />
                              <span>{t("কল করুন", "Call")}</span>
                            </a>
                            <a
                              href={`https://wa.me/8801718763978?text=${encodeURIComponent(t("আসসালামু আলাইকুম, আমি আজীবন সদস্য তথ্য জানতে চাচ্ছি।", "Assalamu Alaikum, I would like to know my lifetime member details."))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#25D366] text-white text-xs font-semibold"
                            >
                              <WhatsAppIcon className="w-4 h-4" />
                              <span>{t("হোয়াটসঅ্যাপ", "WhatsApp")}</span>
                            </a>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── NEW MEMBER: REVIEW & PAYMENT PREFERENCE SHEET ─── */}
      <AnimatePresence>
        {reviewOpen && (
          <div
            className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && setReviewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl p-5 sm:p-6"
            >
              <div className="mx-auto sm:hidden w-11 h-[4.5px] rounded-full bg-muted-foreground/30 mb-4" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-full bg-emerald-500/15">
                  <Wallet className="w-[22px] h-[22px] text-emerald-500" />
                </div>
                <h3 className="text-[17px] font-bold text-foreground">{t("আবেদন পর্যালোচনা ও অনুদান", "Review Application & Contribution")}</h3>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/60 border border-border space-y-2 mb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] text-muted-foreground">{t("নাম:", "Name:")}</span>
                  <span className="text-[13px] font-semibold text-foreground text-right">{newName.trim()}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] text-muted-foreground">{t("মোবাইল:", "Mobile:")}</span>
                  <span className="text-[13px] font-semibold text-foreground text-right">{newPhone.trim()}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] text-muted-foreground">{t("নির্বাচিত ক্যাটাগরি:", "Selected Category:")}</span>
                  <span className="text-[13px] font-bold text-foreground text-right">
                    {t(currentTier.amountBn, currentTier.amountEn)} ({t(currentTier.titleBn, currentTier.titleEn)})
                  </span>
                </div>
                {mediumName.trim() && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] text-muted-foreground">{t("মাধ্যম:", "Medium:")}</span>
                    <span className="text-[13px] font-semibold text-foreground text-right">
                      {mediumName.trim()} {mediumPhone.trim() && `(${mediumPhone.trim()})`}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm font-bold text-foreground mb-3.5">
                {t("আপনি কি এখনই প্রথম অনুদান পরিশোধ করতে চান?", "Would you like to pay your first contribution now?")}
              </p>

              <button
                onClick={openPayForNewMember}
                className="w-full h-[52px] inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow active:scale-[0.98] transition-all mb-2.5"
              >
                <Wallet className="w-5 h-5" />
                <span>{t("হ্যাঁ, এখনই অনুদান পাঠাবো (বিকাশ/নগদ/ব্যাংক)", "Yes, I'll pay now (bKash/Nagad/Bank)")}</span>
              </button>

              <button
                onClick={completeNewMemberSubmissionWithoutPay}
                className="w-full h-[52px] inline-flex items-center justify-center gap-2 rounded-2xl border border-border text-foreground font-bold text-sm active:scale-[0.98] transition-all"
              >
                <Send className="w-[18px] h-[18px]" />
                <span>{t("পরবর্তীতে অনুদান প্রদান করবো (ফরম জমা দিন)", "I'll contribute later (Submit form)")}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── PAYMENT INSTRUCTIONS & RECEIPT SHEET ─── */}
      <AnimatePresence>
        {payModal && (
          <div
            className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && setPayModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-background rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl p-5 sm:p-6"
            >
              <div className="mx-auto sm:hidden w-11 h-[4.5px] rounded-full bg-muted-foreground/30 mb-4" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-full bg-[#B45309]/15">
                  <Receipt className="w-[22px] h-[22px] text-[#B45309]" />
                </div>
                <h3 className="text-[16.5px] font-bold text-foreground">{t(payModal.title, payModal.titleEn)}</h3>
              </div>

              {/* Payment Numbers Notice Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-gold/5 to-gold/10 border border-gold/50 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Landmark className="w-[18px] h-[18px] text-[#B45309]" />
                  <span className="text-[13px] font-bold text-[#B45309]">{t("অফিসিয়াল পেমেন্ট নম্বরসমূহ", "Official Payment Numbers")}</span>
                </div>
                <div className="h-px bg-gold/30 mb-2.5" />
                <div className="space-y-1.5">
                  {PAYMENT_NUMBERS.map((p) => (
                    <div key={p.number} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t(p.labelBn, p.labelEn)}</span>
                      <button
                        onClick={() => copyToClipboard(p.number)}
                        className="flex items-center gap-1 text-[#B45309] font-bold text-[12.5px]"
                      >
                        <span>{p.number}</span>
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[11.5px] text-muted-foreground mt-2">
                  {t("টাকা পাঠানোর পর নিচের তথ্যগুলো পূরণ করে রসিদ নিশ্চিত করুন:", "After sending, fill in the details below to confirm your receipt:")}
                </p>
              </div>

              {/* Method chips */}
              <p className="text-[12.5px] font-semibold text-muted-foreground mb-2">{t("পেমেন্টের মাধ্যম বেছে নিন *", "Choose payment method *")}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  const isSel = paymentMethod === m.name;
                  return (
                    <button
                      key={m.name}
                      onClick={() => setPaymentMethod(m.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-bold transition-colors"
                      style={{
                        backgroundColor: isSel ? m.color : "var(--secondary)",
                        color: isSel ? "#fff" : "var(--foreground)",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isSel ? "#fff" : m.color }} />
                      <span>{t(m.name, m.nameEn)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 mb-5">
                <TextInput
                  label={t("যে নম্বর থেকে টাকা পাঠিয়েছেন *", "Number you sent the payment from *")}
                  hint="017XXXXXXXX"
                  icon={PhoneCall}
                  value={senderNumber}
                  onChange={(v) => {
                    setSenderNumber(v);
                    setSenderError(null);
                  }}
                  error={senderError}
                />
                <TextInput
                  label={t("ট্রানজেকশন আইডি (TrxID) / রেফারেন্স", "Transaction ID (TrxID) / Reference")}
                  hint={t("যেমন: 9J3K8LM2", "e.g. 9J3K8LM2")}
                  icon={Sparkle}
                  value={trxId}
                  onChange={setTrxId}
                />
              </div>

              <button
                onClick={submitPayment}
                className="w-full h-[54px] inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white font-bold text-[14.5px] shadow active:scale-[0.98] transition-all"
              >
                <CircleCheck className="w-5 h-5" />
                <span>{t("পেমেন্ট নিশ্চিত করুন ও রসিদ পাঠান", "Confirm Payment & Send Receipt")}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SUCCESS DIALOG ─── */}
      <AnimatePresence>
        {successDialog && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-background rounded-3xl border border-border shadow-2xl p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck className="w-[26px] h-[26px] text-emerald-500 shrink-0" />
                <h3 className="text-base font-bold text-foreground">{successDialog.title}</h3>
              </div>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground mb-5">{successDialog.description}</p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSuccessDialog(null)}
                  className="flex-1 h-11 rounded-xl border border-border text-foreground text-sm font-semibold"
                >
                  {t("বন্ধ করুন", "Close")}
                </button>
                <a
                  href={`https://wa.me/${OFFICE_WHATSAPP}?text=${successDialog.waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSuccessDialog(null)}
                  className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold"
                >
                  <MessageCircleIcon />
                  <span>{t("অফিস হোয়াটসঅ্যাপে পাঠান", "Send on Office WhatsApp")}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageCircleIcon() {
  return <WhatsAppIcon className="w-4 h-4" />;
}

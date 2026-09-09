"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import {
  Crown,
  Users,
  BookOpen,
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
  Check,
  Copy,
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
  Megaphone,
  Award,
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

const BENEFITS = [
  {
    icon: Users,
    color: "#0F766E",
    bn: "উলামায়ে কেরাম ও তালিবুল ইলমদের সাথে জুড়ে থাকা যায়।",
    en: "Stay spiritually connected with the Ulama and devoted students of Quranic knowledge.",
  },
  {
    icon: BookOpen,
    color: "#1E3A8A",
    bn: "মাদরাসার বিশেষ রেজিস্ট্রি খাতায় তাঁর নাম রেকর্ড হয়ে যায়।",
    en: "Your name is permanently recorded in the madrasah's special institutional registry.",
  },
  {
    icon: PartyPopper,
    color: "#B45309",
    bn: "বছরে কমপক্ষে একবার আজীবন সদস্য সম্মেলনে অংশগ্রহণের মাধ্যমে উলামায়ে কেরাম ও তালিবুল ইলমদের সাথে উঠা-বসা, খাওয়া-দাওয়া ও বিশেষ দোয়ায় শরীক থাকা যায়।",
    en: "Attend the annual Lifetime Member Conference — dining and joining heartfelt special prayers with the Ulama and students.",
  },
  {
    icon: HeartHandshake,
    color: "#701A75",
    bn: "প্রতিদিন শত শত হাফেয ও আলেম মাদরাসার বিশেষ দোয়ায় সদস্যদের সার্বিক কল্যাণে দোয়া করতে থাকেন।",
    en: "Hundreds of Huffaz and Islamic scholars pray daily for the overall wellbeing of members in the madrasah's congregational dua.",
  },
  {
    icon: HeartPulse,
    color: "#E11D48",
    bn: "কোনো সদস্য বা তাঁর আপনজন অসুস্থ হলে বা বিপদে পড়লে তাঁর জন্য বিশেষ দোয়ার ব্যবস্থা করা হয়।",
    en: "Special dedicated prayers are immediately arranged whenever a member or their beloved falls ill or faces distress.",
  },
  {
    icon: BookOpenCheck,
    color: "#0284C7",
    bn: "কোনো সদস্য বা তাঁর ঘনিষ্ঠজন মারা গেলে কুরআন খতম করে সওয়াব রেসানী করা হয়।",
    en: "A complete Quran khatam is performed and the reward conveyed for a deceased member or their loved ones.",
  },
  {
    icon: Award,
    color: "#10B981",
    bn: "মৃত্যুর পরও সদকায়ে জারিয়ারূপে মাদরাসার দ্বীনি খেদমতের একটা অংশ তাঁর আমলনামায় যেতে থাকবে।",
    en: "Even after death, a share of the madrasah's religious service continues flowing into their book of deeds as Sadaqah Jariyah.",
  },
  {
    icon: Star,
    color: "#D97706",
    bn: "আলেম-উলামাদের সাথে মহব্বতের কারণে হাদীসের ভাষ্য অনুযায়ী নায়েবে রাসূলদের সাথে হাশর হওয়ার সৌভাগ্য অর্জন হতে পারে।",
    en: "Out of love for Islamic scholars, hadith promises the honour of being resurrected in the company of the inheritors of the Prophets.",
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

const TIERS = [
  { id: "platinum", icon: Crown, color: "#D97706", amountBn: "১,০০,০০০ টাকা", amountEn: "৳100,000", titleBn: "প্ল্যাটিনাম সদস্য (Platinum Member)", titleEn: "Platinum Member", subBn: "বাৎসরিক নির্ধারিত অনুদান ১,০০,০০০ টাকা", subEn: "Fixed annual contribution ৳100,000" },
  { id: "diamond", icon: Gem, color: "#0EA5E9", amountBn: "৭৫,০০০ টাকা", amountEn: "৳75,000", titleBn: "ডায়মন্ড সদস্য (Diamond Member)", titleEn: "Diamond Member", subBn: "বাৎসরিক নির্ধারিত অনুদান ৭৫,০০০ টাকা", subEn: "Fixed annual contribution ৳75,000" },
  { id: "gold", icon: Star, color: "#F59E0B", amountBn: "৫০,০০০ টাকা", amountEn: "৳50,000", titleBn: "গোল্ড সদস্য (Gold Member)", titleEn: "Gold Member", subBn: "বাৎসরিক নির্ধারিত অনুদান ৫০,০০০ টাকা", subEn: "Fixed annual contribution ৳50,000" },
  { id: "silver", icon: Shield, color: "#64748B", amountBn: "২৫,০০০ টাকা", amountEn: "৳25,000", titleBn: "সিলভার সদস্য (Silver Member)", titleEn: "Silver Member", subBn: "বাৎসরিক নির্ধারিত অনুদান ২৫,০০০ টাকা", subEn: "Fixed annual contribution ৳25,000" },
  { id: "vip", icon: Medal, color: "#059669", amountBn: "১০,০০০ টাকা", amountEn: "৳10,000", titleBn: "ভিআইপি সদস্য (VIP Member)", titleEn: "VIP Member", subBn: "বাৎসরিক নির্ধারিত অনুদান ১০,০০০ টাকা", subEn: "Fixed annual contribution ৳10,000" },
  { id: "well_wisher", icon: Heart, color: "#7C3AED", amountBn: "৫,০০০ টাকা", amountEn: "৳5,000", titleBn: "শুভাকাঙ্ক্ষী সদস্য (Well-Wisher Member)", titleEn: "Well-Wisher Member", subBn: "বাৎসরিক নির্ধারিত অনুদান ৫,০০০ টাকা", subEn: "Fixed annual contribution ৳5,000" },
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
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setLeft({ days, hours, minutes });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[62px] h-[46px] flex items-center justify-center rounded-xl bg-card border-[1.2px] border-gold/70 shadow-sm">
        <span className="text-lg font-extrabold text-gold-dark dark:text-gold tracking-tight">{value}</span>
      </div>
      <span className="mt-1 text-[10.5px] font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}

function CountdownSeparator() {
  return <span className="text-lg font-bold text-gold/50 px-2 pb-4">:</span>;
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

  const { days, hours, minutes } = useCountdown(TARGET_DATE);

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

        <div className="max-w-2xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-4">
          {/* 1. MERGED ANNOUNCEMENT & COUNTDOWN CARD */}
          <motion.div
            className="rounded-[22px] border-[1.5px] border-gold/70 bg-gradient-to-br from-card via-card to-gold/10 p-4 sm:p-6 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center text-center">
              {/* Announcement Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B] shadow-md mb-3">
                <Megaphone className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-bold tracking-wide">
                  {t("★ বিশেষ এলান ও দাওয়াত ★", "★ Special Announcement ★")}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-gold-dark dark:text-gold tracking-tight">
                {t("৫ই ডিসেম্বর ২০২৬ (শনিবার)", "5 December 2026 (Saturday)")}
              </h1>
              <p className="mt-1 text-base sm:text-lg font-bold text-amber-800 dark:text-amber-400">
                {t("চলতি বছর আজীবন সদস্য সম্মেলন", "This Year's Lifetime Member Conference")}
              </p>
              <p className="mt-0.5 text-[13.5px] font-semibold text-sky-700 dark:text-sky-400">
                {t("অনুষ্ঠিত হবে ইনশাআল্লাহ", "Will be held, InshaAllah")}
              </p>

              {/* Venue Pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-background/90 border border-gold/35">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-[11.5px] font-semibold text-foreground/80 text-center">
                  {t(
                    "স্থান: গুলশানে আল্লামা শাহ আব্দুল মতীন কমপ্লেক্স, পাইটি, ডেমরা, ঢাকা।",
                    "Venue: Gulshane Allama Shah Abdul Matin Complex, Paiti, Demra, Dhaka."
                  )}
                </span>
              </div>

              {/* Countdown */}
              <div className="mt-4 flex items-center justify-center">
                <CountdownBox value={days} label={t("দিন বাকি", "Days Left")} />
                <CountdownSeparator />
                <CountdownBox value={hours} label={t("ঘণ্টা", "Hours")} />
                <CountdownSeparator />
                <CountdownBox value={minutes} label={t("মিনিট", "Mins")} />
              </div>
            </div>
          </motion.div>

          {/* 2. ABOUT LIFETIME MEMBERSHIP */}
          <motion.div
            className="rounded-[20px] border-[1.2px] border-gold/40 bg-card p-5 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[14.5px] font-semibold leading-[1.65] text-foreground/90 whitespace-pre-line text-pretty">
              {t(
                `আমাদের পরম শ্রদ্ধেয় শায়েখ হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেব (দামাত বারাকাতুহুম) এর প্রতিষ্ঠিত ও পরিচালিত দ্বীনি প্রতিষ্ঠান "জামেআ মারকাযুল ইহসান ঢাকা (গুলশানে আল্লামা শাহ আব্দুল মতীন কমপ্লেক্স)"।

প্রতিষ্ঠানটির সামগ্রিক উন্নতি-অগ্রগতি এবং শত শত তালিবুল ইলম ও কুরআনের হাফেজদের আর্থিক খেদমতের সহযোগিতাকে বেগবান করার লক্ষ্যে যাঁরা বাৎসরিক নির্দিষ্ট অনুদান প্রদানের অঙ্গীকার করেন, তাঁরাই হলেন এই জামেআর সম্মানিত আজীবন সদস্য। এটি দুনিয়া ও আখেরাতের এক চিরন্তন সদকায়ে জারিয়া।`,
                `Jamea Markazul Ihsan Dhaka (Gulshane Allama Shah Abdul Matin Complex) is an esteemed Islamic institution founded and led by our respected mentor, Hazrat Maulana Shah Tayyeb Ashraf Shaheb (may Allah preserve him).

Those noble souls who pledge a fixed annual contribution to support the comprehensive growth of the institution and the ongoing care of hundreds of Quranic students and scholars become its honoured Lifetime Members — establishing a lasting Sadaqah Jariyah for both this world and the Hereafter.`
              )}
            </p>
          </motion.div>

          {/* 3. MEMBER PORTAL ACTION CARD */}
          <motion.div
            className="rounded-[24px] border-[1.5px] border-gold/65 bg-gradient-to-br from-card via-card to-gold/10 p-5 shadow-lg"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#B45309]/15 shrink-0">
                <HeartHandshake className="w-6 h-6 text-[#B45309]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-foreground">
                  {t("আজীবন সদস্য সেবা ও অনুদান পোর্টাল", "Lifetime Member Service & Contribution Portal")}
                </h3>
                <p className="text-[11.5px] text-amber-800 dark:text-muted-foreground">
                  {t("নতুন আবেদন অথবা বিদ্যমান সদস্যের অনুদান ও রসিদ", "New application, or existing member dues & receipts")}
                </p>
              </div>
            </div>

            <p className="mt-3.5 text-[13px] leading-relaxed text-foreground/80">
              {t(
                "আপনি কি জামেআর নতুন আজীবন সদস্য হতে চান অথবা ইতোমধ্যেই একজন সম্মানিত সদস্য হিসেবে আপনার বাৎসরিক অনুদান হিসেব দেখতে ও পরিশোধ করতে চান?",
                "Would you like to become a new lifetime member of the Jamea, or, as an existing honoured member, view and pay your annual contribution?"
              )}
            </p>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => openPortal(0)}
                className="w-full inline-flex items-center justify-center gap-2 h-[46px] rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow active:scale-[0.98] transition-all"
              >
                <UserPlus className="w-[18px] h-[18px]" />
                <span>{t("নতুন আজীবন সদস্য হতে আবেদন করুন", "Apply to Become a New Lifetime Member")}</span>
              </button>
              <button
                onClick={() => openPortal(1)}
                className="w-full inline-flex items-center justify-center gap-2 h-[46px] rounded-2xl border-[1.4px] border-gold bg-background text-[#B45309] font-bold text-[13.5px] active:scale-[0.98] transition-all"
              >
                <UserCheck className="w-[18px] h-[18px]" />
                <span>{t("পুরাতন সদস্য (হিসাব ও অনুদান প্রদান)", "Existing Member (Ledger & Contribution)")}</span>
              </button>
            </div>
          </motion.div>

          {/* 4. BENEFITS LIST */}
          <motion.div
            className="rounded-[20px] border border-border bg-card p-[18px] shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3.5">
              <Sparkles className="w-[22px] h-[22px] text-gold" />
              <h3 className="font-bold text-base text-foreground">
                {t("আজীবন সদস্য হওয়ার ফায়দা ও উপকারিতা", "Benefits & Virtues of Lifetime Membership")}
              </h3>
            </div>

            <div className="space-y-3">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3.5 px-3.5 py-3.5 rounded-2xl"
                  style={{ backgroundColor: `${b.color}0f`, border: `1px solid ${b.color}40` }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <div
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: b.color }}
                  >
                    <b.icon className="w-[18px] h-[18px] text-white" />
                  </div>
                  <p className="text-[13.5px] font-semibold leading-[1.45] text-foreground">{t(b.bn, b.en)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 5. DUA & ASPIRATION CARD */}
          <motion.div
            className="rounded-[20px] border border-gold/50 bg-gradient-to-br from-card via-card to-gold/5 p-5 shadow-sm text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <HeartHandshake className="w-7 h-7 text-[#B45309] mx-auto mb-2.5" />
            <h3 className="font-bold text-base text-[#B45309] mb-2">
              {t("আমাদের ফিকির ও দোয়া", "Our Aspiration & Dua")}
            </h3>
            <p className="text-[13.5px] leading-[1.6] text-foreground/80 max-w-2xl mx-auto whitespace-pre-line text-pretty">
              {t(
                `দ্বীনি এ খেদমতে অংশগ্রহণ করার লক্ষ্যে আমরা নিজেরা সদস্য হওয়ার ও নিজেদের আপনজন প্রিয়জনদেরকে সদস্য করার ফিকির করবো ইনশাআল্লাহ।

সেই সাথে দোয়া করবো, মহান আল্লাহ রাব্বুল আলামীন নিজ দয়া ও অনুগ্রহে খুব বেশি কবুল করুন এবং সফল করুন। আমীন।`,
                `To take part in this noble religious endeavor, let us strive to become members ourselves and encourage our beloved family and friends to join.

And let us pray that Allah, the Most Merciful, accepts this purely for His sake and crowns it with immense success and eternal rewards. Ameen.`
              )}
            </p>
          </motion.div>

          {/* 6. DIRECT CONTACT & HELPLINE */}
          <motion.div
            className="rounded-[20px] border border-border bg-card p-[18px] shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-full bg-emerald-500/15 shrink-0">
                <PhoneCall className="w-[22px] h-[22px] text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground leading-snug">
                  {t("জরুরি হেল্পলাইন ও যোগাযোগ", "Helpline & Direct Support")}
                </h3>
                <p className="text-[11.5px] text-muted-foreground">
                  {t("যেকোনো তথ্যের জন্য সরাসরি যোগাযোগ করুন (WhatsApp রিকমেন্ডেড)", "Reach out directly for any information (WhatsApp recommended)")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {CONTACTS.map((c) => (
                <div
                  key={c.raw}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-border bg-background"
                >
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <PhoneCall className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-[15px] tracking-tight">{c.display}</p>
                    <p className="text-[11px] text-muted-foreground">{t(c.noteBn, c.noteEn)}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(c.display)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                    title={t("নাম্বার কপি করুন", "Copy Number")}
                  >
                    {copiedNumber === c.display ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`https://wa.me/${c.raw}?text=${encodeURIComponent(
                      t(
                        "আসসালামু আলাইকুম, আমি জামেআ মারকাযুল ইহসানের আজীবন সদস্য সম্মেলন ২০২৬ সম্পর্কে জানতে আগ্রহী।",
                        "Assalamu Alaikum, I am interested in learning about the Lifetime Member Conference 2026 of Jamea Markazul Ihsan."
                      )
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow shrink-0"
                    aria-label={t("হোয়াটসঅ্যাপে বার্তা পাঠান", "Chat on WhatsApp")}
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={`tel:+${c.raw}`}
                    className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"
                    aria-label={t("কল করুন", "Call")}
                  >
                    <PhoneCall className="w-[18px] h-[18px]" />
                  </a>
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

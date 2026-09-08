"use client";

import React, { useState, useEffect } from "react";
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
  ExternalLink,
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
  MessageCircle,
} from "lucide-react";
import { LIFETIME_FORM_URL } from "@/lib/constants";

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

export function LifetimeMemberClient() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

  const openModal = (tierId?: string) => {
    if (tierId) setSelectedTier(tierId);
    setIframeLoading(true);
    setModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModalOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

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
                      onClick={() => openModal(tier.id)}
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
                {t("সদস্য সেবা ও আবেদন কেন্দ্র", "Member Service & Application")}
              </h3>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {t(
                  "আপনি কি জামেআর নতুন আজীবন সদস্য হতে চান অথবা ইতোমধ্যেই একজন সম্মানিত সদস্য হিসেবে আপনার বাৎসরিক অনুদান হিসেব দেখতে ও পরিশোধ করতে চান?",
                  "Apply as a new lifetime member, or manage existing membership dues and annual contributions online."
                )}
              </p>

              <div className="space-y-2 mb-5 p-3 sm:p-3.5 rounded-xl bg-background/80 border border-border">
                <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                  <UserPlus className="w-4 h-4 text-gold shrink-0" />
                  <span>{t("নতুন সদস্য আবেদন", "New Member Application")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                  <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t("পুরাতন সদস্য — হিসাব ও অনুদান পরিশোধ", "Existing Member Dues & Verification")}</span>
                </div>
              </div>

              <button
                onClick={() => openModal()}
                className="w-full inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-xl gradient-gold text-[#111827] font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:brightness-105 active:scale-95 transition-all focus-ring"
              >
                <Crown className="w-4 h-4" />
                <span>{t("অনলাইন ফরম পূরণ করুন", "Open Online Form")}</span>
              </button>

              <a
                href={LIFETIME_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t("নতুন উইন্ডোতে খুলুন", "Open in New Tab")}</span>
              </a>

              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-3 text-center">
                {t("ফরমটি Google Forms দ্বারা সুরক্ষিত ও সরাসরি নিবন্ধিত।", "Form is safely secured and processed by Google Forms.")}
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
            onClick={() => openModal()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl gradient-gold text-[#111827] font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <Crown className="w-4 h-4" />
            <span>{t("অনলাইন আবেদন ফরম", "Apply Online")}</span>
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

      {/* ─── MODAL GOOGLE FORM WEBVIEW ─── */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t("আজীবন সদস্য ফরম", "Lifetime Member Form")}
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative w-full sm:max-w-2xl h-[92vh] sm:h-[86vh] bg-background rounded-t-3xl sm:rounded-3xl overflow-hidden border border-gold/40 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-[#111827]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                      {t("আজীবন সদস্য অনলাইন ফরম", "Lifetime Member Online Form")}
                    </span>
                    {selectedTier && (
                      <span className="text-[10px] text-gold-dark dark:text-gold font-semibold block truncate">
                        {t("নির্বাচিত ক্যাটাগরি: ", "Selected: ")}
                        {t(
                          TIERS.find((x) => x.id === selectedTier)?.titleBn || "",
                          TIERS.find((x) => x.id === selectedTier)?.titleEn || ""
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={LIFETIME_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title={t("নতুন ট্যাবে খুলুন", "Open in New Tab")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setModalOpen(false)}
                    aria-label={t("বন্ধ করুন", "Close")}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Iframe */}
              <div className="relative flex-1 bg-white">
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background">
                    <Loader2 className="w-7 h-7 text-gold animate-spin" />
                    <span className="text-xs text-muted-foreground font-medium">
                      {t("নিরাপদ অনলাইন ফরম লোড হচ্ছে...", "Loading secure form...")}
                    </span>
                  </div>
                )}
                <iframe
                  src={LIFETIME_FORM_URL}
                  title={t("আজীবন সদস্য অনলাইন ফরম", "Lifetime Member Online Form")}
                  className="w-full h-full border-0"
                  onLoad={() => setIframeLoading(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

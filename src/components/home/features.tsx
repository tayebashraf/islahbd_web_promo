"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { BookOpen, ScrollText, HandMetal, Compass, Calendar, Star, Clock, Moon, CircleDot, CheckCircle2, MapPin, Music, Radio, BookMarked, Heart, Users, Library } from "lucide-react";

function LiveDot() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"
      style={{ opacity: on ? 1 : 0.15, transition: "opacity 0.3s ease" }}
    />
  );
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, ScrollText, HandMetal, Compass, Calendar, Star, Clock, Moon, CircleDot, MapPin, Music, Radio, BookMarked, Heart, Users, Library,
};

const FEATURES_DATA = [
  {
    icon: "Clock",
    gradient: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    bn: "নামাজের সময়",
    en: "Prayer Times",
    descBn: "সঠিক অবস্থান-ভিত্তিক নামাজের সময় এবং আযানের রিমাইন্ডার।",
    descEn: "Accurate location-based prayer times with Adhan reminders.",
  },
  {
    icon: "BookOpen",
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bn: "কুরআন",
    en: "Quran",
    descBn: "অডিও তেলাওয়াত সহ কুরআন এবং হাফেজি কুরআন পিডিএফ।",
    descEn: "Quran with audio recitation and Hafezi Quran PDF.",
  },
  {
    icon: "ScrollText",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-600 dark:text-pink-400",
    bn: "আমল",
    en: "Amal",
    descBn: "দৈনন্দিন ইসলামিক আমলসমূহ একত্রিত করুন।",
    descEn: "Curated daily Islamic deeds and practices.",
  },
  {
    icon: "HandMetal",
    gradient: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    bn: "দোয়া ও আযকার",
    en: "Dua & Dhikr",
    descBn: "সকাল-সন্ধ্যার আযকার, মাসনুন দোয়া অডিও সহ।",
    descEn: "Morning/evening adhkar and Masnoon duas with audio.",
  },
  {
    icon: "MapPin",
    gradient: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-sky-600 dark:text-sky-400",
    bn: "হজ্জ ও উমরাহ",
    en: "Hajj & Umrah",
    descBn: "হজ্জ ও উমরাহর গাইড, ধাপে ধাপে নির্দেশিকা।",
    descEn: "Step-by-step Hajj and Umrah guide with detailed instructions.",
  },
  {
    icon: "CircleDot",
    gradient: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    bn: "ডিজিটাল তাসবিহ",
    en: "Digital Tasbeeh",
    descBn: "হ্যাপটিক ফিডব্যাক সহ ডিজিটাল তাসবিহ কাউন্টার।",
    descEn: "Digital tasbeeh counter with haptic feedback.",
  },
  {
    icon: "Compass",
    gradient: "from-cyan-500/20 to-sky-500/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    bn: "কিবলা দিক",
    en: "Qibla Direction",
    descBn: "GPS-ভিত্তিক সঠিক কিবলার দিক অ্যানিমেটেড কম্পাস সহ।",
    descEn: "GPS-based accurate Qibla direction with animated compass.",
  },
  {
    icon: "Calendar",
    gradient: "from-teal-500/20 to-emerald-500/10",
    iconColor: "text-teal-600 dark:text-teal-400",
    bn: "ইসলামিক ক্যালেন্ডার",
    en: "Islamic Calendar",
    descBn: "হিজরি ক্যালেন্ডার, রমজান ট্র্যাকার, ইসলামিক ইভেন্ট।",
    descEn: "Hijri calendar, Ramadan tracker, Islamic events.",
  },
  {
    icon: "Radio",
    gradient: "from-red-500/25 to-rose-600/15",
    iconColor: "text-red-600 dark:text-red-400",
    bn: "লাইভ",
    en: "Live",
    descBn: "মারকাজুল ইহসানের লাইভ প্রোগ্রাম সরাসরি দেখুন।",
    descEn: "Watch Markazul Ihsan live programs in real-time.",
    isLive: true,
  },
  {
    icon: "Music",
    gradient: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-600 dark:text-green-400",
    bn: "হামদ ও নাত",
    en: "Hamd & Naat",
    descBn: "ইসলামিক হামদ, নাত ও নাশিদ সংগ্রহ।",
    descEn: "Collection of Islamic Hamd, Naat and Nasheed.",
  },
  {
    icon: "BookMarked",
    gradient: "from-amber-500/20 to-yellow-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    bn: "ফাযায়েল",
    en: "Fazilat",
    descBn: "আমলের ফাযায়েল ও মর্যাদা সম্পর্কে জানুন।",
    descEn: "Learn about the virtues and merits of Islamic deeds.",
  },
  {
    icon: "Star",
    gradient: "from-gold/20 to-amber-500/10",
    iconColor: "text-gold",
    bn: "মালফুযাত",
    en: "Malfuzat",
    descBn: "বুজুর্গানে দ্বীনের বাণী ও উপদেশ সমগ্র।",
    descEn: "Sayings and wisdoms of Islamic scholars.",
  },
  {
    icon: "Heart",
    gradient: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bn: "ওয়াজিফা ও দরূদ",
    en: "Wazifa & Darud",
    descBn: "বিশেষ ওয়াজিফা এবং দরূদ শরিফের সংকলন।",
    descEn: "Collection of special Wazifa and Darud Sharif.",
  },
  {
    icon: "Moon",
    gradient: "from-indigo-500/20 to-violet-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bn: "রমজান",
    en: "Ramadan",
    descBn: "সেহরি-ইফতার সময়, রোজার ট্র্যাকার এবং বিশেষ দোয়া।",
    descEn: "Sehri-Iftar times, fasting tracker and special duas.",
  },
  {
    icon: "Library",
    gradient: "from-stone-500/20 to-amber-500/10",
    iconColor: "text-stone-600 dark:text-stone-400",
    bn: "লাইব্রেরি",
    en: "Library",
    descBn: "ইসলামিক বইয়ের ডিজিটাল লাইব্রেরি ও বুকশপ।",
    descEn: "Digital Islamic library and bookshop.",
  },
];

const HIGHLIGHTS = [
  { bn: "ডার্ক ও লাইট মোড", en: "Dark & Light mode" },
  { bn: "বাংলা + ইংরেজি ভাষা", en: "Bangla + English" },
  { bn: "অফলাইন সাপোর্ট", en: "Offline support" },
  { bn: "পুশ নোটিফিকেশন", en: "Push notifications" },
  { bn: "কাস্টমাইজযোগ্য হোম", en: "Customizable home" },
];

export function Features() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 lg:py-32 bg-card/50" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("ফিচারসমূহ", "Features")}
          </span>
          <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-5 text-balance">
            {t(
              <>সবকিছু এক <span className="text-gold">অ্যাপে</span></>,
              <>Everything in <span className="text-gold">One App</span></>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t(
              "মারকাজুল ইহসানের islahbd অ্যাপে পাচ্ছেন আপনার দৈনন্দিন ইসলামিক জীবনের জন্য প্রয়োজনীয় সব সরঞ্জাম।",
              "Markazul Ihsan's islahbd app — all tools for your daily Islamic life in one beautiful place."
            )}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {HIGHLIGHTS.map((h) => (
              <span key={h.en} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {t(h.bn, h.en)}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3">
          {FEATURES_DATA.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] || Star;
            return (
              <motion.div
                key={feature.en}
                className={`relative group p-5 rounded-2xl border transition-all card-hover cursor-default bg-gradient-to-br ${feature.gradient} ${
                  (feature as { isLive?: boolean }).isLive
                    ? "border-red-500/35 bg-card ring-1 ring-red-500/20 hover:border-red-500/55 hover:ring-red-500/35"
                    : "border-border bg-card hover:border-gold/30"
                }`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                {/* Live badge */}
                {(feature as { isLive?: boolean }).isLive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30">
                    <LiveDot />
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Live</span>
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-background/60 ${feature.iconColor} ${
                  (feature as { isLive?: boolean }).isLive ? "ring-1 ring-red-500/25" : ""
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1.5 leading-snug">
                  {t(feature.bn, feature.en)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(feature.descBn, feature.descEn)}
                </p>
                {/* Hover accent */}
                <div className={`absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl bg-gradient-to-r opacity-0 transition-opacity ${
                  (feature as { isLive?: boolean }).isLive
                    ? "from-transparent via-red-500 to-transparent group-hover:opacity-70"
                    : "from-transparent via-gold to-transparent group-hover:opacity-60"
                }`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

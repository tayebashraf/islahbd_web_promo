"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { BookOpen, ScrollText, HandMetal, Compass, Calendar, Calculator, Star, Clock, Moon, CircleDot, CheckCircle2 } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, ScrollText, HandMetal, Compass, Calendar, Calculator, Star, Clock, Moon, CircleDot,
};

const FEATURES_DATA = [
  {
    icon: "Clock",
    gradient: "from-gold/20 to-amber-500/10",
    iconColor: "text-gold",
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
    descBn: "অডিও তেলাওয়াত, অনুবাদ, তাফসীর এবং ওয়ার্ড-বাই-ওয়ার্ড মোড।",
    descEn: "Audio recitation, translation, tafseer, and word-by-word mode.",
  },
  {
    icon: "ScrollText",
    gradient: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    bn: "হাদিস",
    en: "Hadith",
    descBn: "বিশুদ্ধ হাদিস সংগ্রহ বাংলা অনুবাদ সহ।",
    descEn: "Authentic hadith collections with Bangla translations.",
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
    icon: "Compass",
    gradient: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-sky-600 dark:text-sky-400",
    bn: "কিবলা দিক",
    en: "Qibla Direction",
    descBn: "GPS-ভিত্তিক সঠিক কিবলার দিক অ্যানিমেটেড কম্পাস সহ।",
    descEn: "GPS-based accurate Qibla direction with animated compass.",
  },
  {
    icon: "CircleDot",
    gradient: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    bn: "ডিজিটাল তাসবিহ",
    en: "Digital Tasbih",
    descBn: "হ্যাপটিক ফিডব্যাক সহ ডিজিটাল তাসবিহ কাউন্টার।",
    descEn: "Digital tasbih counter with haptic feedback.",
  },
  {
    icon: "Calendar",
    gradient: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    bn: "ইসলামিক ক্যালেন্ডার",
    en: "Islamic Calendar",
    descBn: "হিজরি ক্যালেন্ডার, রমজান ট্র্যাকার, ইসলামিক ইভেন্ট।",
    descEn: "Hijri calendar, Ramadan tracker, Islamic events.",
  },
  {
    icon: "Calculator",
    gradient: "from-teal-500/20 to-cyan-500/10",
    iconColor: "text-teal-600 dark:text-teal-400",
    bn: "যাকাত ক্যালকুলেটর",
    en: "Zakat Calculator",
    descBn: "স্বর্ণ, রূপা ও সম্পদের উপর সঠিক যাকাত হিসাব।",
    descEn: "Accurate zakat calculation on gold, silver and assets.",
  },
  {
    icon: "Moon",
    gradient: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bn: "রমজান মোড",
    en: "Ramadan Mode",
    descBn: "সেহরি-ইফতার সময়, রোজার ট্র্যাকার এবং বিশেষ দোয়া।",
    descEn: "Sehri-Iftar times, fasting tracker and special duas.",
  },
  {
    icon: "Star",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-600 dark:text-pink-400",
    bn: "ইসলামিক নাম",
    en: "Islamic Names",
    descBn: "অর্থ ও উৎস সহ হাজারো ইসলামিক নামের সংগ্রহ।",
    descEn: "Thousands of Islamic names with meanings and origins.",
  },
];

const HIGHLIGHTS = [
  { bn: "ডার্ক ও লাইট মোড", en: "Dark & Light mode" },
  { bn: "বাংলা + ইংরেজি ভাষা", en: "Bangla + English" },
  { bn: "অফলাইন সাপোর্ট", en: "Offline support" },
  { bn: "পুশ নোটিফিকেশন", en: "Push notifications" },
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
              <>সবকিছু এক <span className="text-gold">জায়গায়</span></>,
              <>Everything in <span className="text-gold">One Place</span></>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t(
              "একটি অ্যাপেই পাচ্ছেন আপনার দৈনন্দিন ইসলামিক জীবনের জন্য প্রয়োজনীয় সব সরঞ্জাম।",
              "Get all the tools you need for your daily Islamic life in one beautiful app."
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
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURES_DATA.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] || Star;
            return (
              <motion.div
                key={feature.en}
                className={`relative group p-5 rounded-2xl border border-border bg-card hover:border-gold/30 transition-all card-hover cursor-default bg-gradient-to-br ${feature.gradient}`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-background/60 ${feature.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1.5 leading-snug">
                  {t(feature.bn, feature.en)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(feature.descBn, feature.descEn)}
                </p>
                {/* Hover accent */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

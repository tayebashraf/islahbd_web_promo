"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const LIFETIME_FORM_URL = "https://forms.gle/VyEPrekRV8ihGPpY8";

// Target Conference Date: December 5, 2026, 09:00 AM (matches app)
const TARGET_DATE = new Date(2026, 11, 5, 9, 0, 0);

const BENEFITS = [
  {
    icon: Users,
    bn: "উলামায়ে কেরাম ও তালিবুল ইলমদের সাথে জুড়ে থাকা যায়।",
    en: "Stay connected with the Ulama and students of knowledge.",
  },
  {
    icon: BookMarked,
    bn: "মাদরাসার বিশেষ রেজিস্ট্রি খাতায় তাঁর নাম রেকর্ড হয়ে যায়।",
    en: "Your name is recorded in the madrasah's special registry.",
  },
  {
    icon: PartyPopper,
    bn: "বছরে কমপক্ষে একবার আজীবন সদস্য সম্মেলনে অংশগ্রহণের সুযোগ।",
    en: "Attend the annual Lifetime Member Conference at least once a year.",
  },
  {
    icon: HeartHandshake,
    bn: "প্রতিদিন শত শত হাফেয ও আলেম সদস্যদের কল্যাণে দোয়া করেন।",
    en: "Hundreds of Huffaz and scholars pray for members' wellbeing daily.",
  },
  {
    icon: HeartPulse,
    bn: "কোনো সদস্য বিপদে পড়লে তাঁর জন্য বিশেষ দোয়ার ব্যবস্থা করা হয়।",
    en: "Special prayers are arranged if a member faces hardship.",
  },
  {
    icon: BookOpenCheck,
    bn: "সদস্য বা ঘনিষ্ঠজন মারা গেলে কুরআন খতম করে সওয়াব রেসানী করা হয়।",
    en: "Quran khatam is performed for a deceased member or their kin.",
  },
  {
    icon: Sparkles,
    bn: "মৃত্যুর পরও সদকায়ে জারিয়ারূপে সওয়াব আমলনামায় যেতে থাকে।",
    en: "Continued reward flows as Sadaqah Jariyah even after death.",
  },
  {
    icon: Star,
    bn: "নায়েবে রাসূলদের সাথে হাশর হওয়ার সৌভাগ্য অর্জনের আশা।",
    en: "Hope of being raised alongside the inheritors of the Prophets.",
  },
];

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
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-11 sm:w-16 sm:h-12 flex items-center justify-center rounded-xl bg-background border border-gold/40 shadow-sm">
        <span className="text-lg sm:text-xl font-extrabold text-gold-dark dark:text-gold">
          {value}
        </span>
      </div>
      <span className="mt-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function LifetimeMember() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const { days, hours, minutes } = useCountdown(TARGET_DATE);

  const openModal = () => {
    setIframeLoading(true);
    setModalOpen(true);
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
    <section
      id="lifetime-member"
      className="py-24 lg:py-32 relative overflow-hidden"
      aria-labelledby="lifetime-member-heading"
    >
      <div className="absolute inset-0 gradient-gold opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 islamic-pattern-subtle opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("★ বিশেষ এলান ও দাওয়াত ★", "★ Special Announcement ★")}
          </span>
          <h2
            id="lifetime-member-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-5 text-balance"
          >
            {t(
              <>আজীবন সদস্য <span className="text-gold">সম্মেলন ২০২৬</span></>,
              <>Lifetime Member <span className="text-gold">Conference 2026</span></>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t(
              "জামেআ মারকাযুল ইহসান ঢাকার আজীবন সদস্য হয়ে দ্বীনি খেদমতে শরীক হোন এবং সদকায়ে জারিয়ার অংশীদার হোন।",
              "Become a Lifetime Member of Jamea Markazul Ihsan Dhaka and take part in this ongoing Sadaqah Jariyah."
            )}
          </p>
        </motion.div>

        {/* Countdown + venue card */}
        <motion.div
          className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card to-gold/5 p-6 sm:p-8 lg:p-10 shadow-xl mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <p className="text-2xl sm:text-3xl font-extrabold text-gold-dark dark:text-gold mb-1">
                {t("৫ই ডিসেম্বর ২০২৬ (শনিবার)", "5 December 2026 (Saturday)")}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0 text-gold" />
                <span>
                  {t(
                    "গুলশানে আল্লামা শাহ আব্দুল মতীন কমপ্লেক্স, পাইটি, ডেমরা, ঢাকা",
                    "Allama Shah Abdul Matin Complex, Paithi, Demra, Dhaka"
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <CountdownBox value={days} label={t("দিন", "Days")} />
              <span className="text-gold/40 text-xl font-bold pb-4">:</span>
              <CountdownBox value={hours} label={t("ঘণ্টা", "Hours")} />
              <span className="text-gold/40 text-xl font-bold pb-4">:</span>
              <CountdownBox value={minutes} label={t("মিনিট", "Mins")} />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Benefits grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="font-display font-bold text-xl text-foreground mb-5 flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              {t("আজীবন সদস্য হওয়ার ফায়দা", "Benefits of Lifetime Membership")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card hover:border-gold/30 transition-colors"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <b.icon className="w-4 h-4 text-gold-dark dark:text-gold" />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {t(b.bn, b.en)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action card */}
          <motion.div
            className="lg:col-span-2 rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card to-gold/5 p-6 sm:p-8 shadow-xl lg:sticky lg:top-24"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mb-5 shadow-lg">
              <Crown className="w-7 h-7 text-[#111827]" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              {t("আজীবন সদস্য হতে চান?", "Ready to become a member?")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {t(
                "নিচের বাটনে ক্লিক করে অনলাইন ফরম পূরণ করুন। মাত্র কয়েক মিনিটেই আবেদন সম্পন্ন হবে।",
                "Click the button below to fill out the online application form. It only takes a few minutes."
              )}
            </p>

            <button
              onClick={openModal}
              className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl gradient-gold text-[#111827] font-semibold text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:brightness-95 transition-all focus-ring"
            >
              {t("অনলাইন ফরম পূরণ করুন", "Fill Online Form")}
            </button>

            <a
              href={LIFETIME_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-border bg-transparent hover:bg-secondary text-foreground text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t("নতুন ট্যাবে খুলুন", "Open in New Tab")}
            </a>

            <p className="text-[11px] text-muted-foreground mt-4 text-center">
              {t(
                "ফরম Google Forms দ্বারা পরিচালিত ও সুরক্ষিত।",
                "Form is hosted and secured by Google Forms."
              )}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Webview Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("আজীবন সদস্য ফরম", "Lifetime Member Form")}
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full sm:max-w-2xl h-[92vh] sm:h-[85vh] bg-background rounded-t-3xl sm:rounded-3xl overflow-hidden border border-gold/30 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Crown className="w-4 h-4 text-gold shrink-0" />
                <span className="text-sm font-semibold text-foreground truncate">
                  {t("আজীবন সদস্য অনলাইন ফরম", "Lifetime Member Online Form")}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                aria-label={t("বন্ধ করুন", "Close")}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Webview */}
            <div className="relative flex-1 bg-white">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background">
                  <Loader2 className="w-6 h-6 text-gold animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    {t("ফরম লোড হচ্ছে...", "Loading form...")}
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
    </section>
  );
}

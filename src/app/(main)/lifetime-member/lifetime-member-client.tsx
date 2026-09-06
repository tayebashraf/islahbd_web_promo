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
  Gem,
  Medal,
  Shield,
  Heart,
  UserPlus,
  UserCheck,
  PhoneCall,
} from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm5.8 14.07c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.3-3.4-.7-2.87-1.2-4.72-4.13-4.86-4.32-.14-.19-1.16-1.55-1.16-2.95s.72-2.1.98-2.38c.24-.27.53-.34.71-.34l.5.01c.16 0 .38-.06.6.46.24.57.8 1.98.87 2.12.07.14.11.3.02.49-.09.19-.14.3-.27.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

const LIFETIME_FORM_URL = "https://forms.gle/VyEPrekRV8ihGPpY8";

// Target Conference Date: December 5, 2026, 09:00 AM (matches app)
const TARGET_DATE = new Date(2026, 11, 5, 9, 0, 0);

const TIERS = [
  {
    id: "platinum",
    icon: Crown,
    color: "#D97706",
    amountBn: "১,০০,০০০ টাকা",
    amountEn: "৳100,000",
    titleBn: "প্ল্যাটিনাম সদস্য",
    titleEn: "Platinum Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
  },
  {
    id: "diamond",
    icon: Gem,
    color: "#0EA5E9",
    amountBn: "৭৫,০০০ টাকা",
    amountEn: "৳75,000",
    titleBn: "ডায়মন্ড সদস্য",
    titleEn: "Diamond Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
  },
  {
    id: "gold",
    icon: Star,
    color: "#F59E0B",
    amountBn: "৫০,০০০ টাকা",
    amountEn: "৳50,000",
    titleBn: "গোল্ড সদস্য",
    titleEn: "Gold Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
  },
  {
    id: "silver",
    icon: Shield,
    color: "#64748B",
    amountBn: "২৫,০০০ টাকা",
    amountEn: "৳25,000",
    titleBn: "সিলভার সদস্য",
    titleEn: "Silver Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
  },
  {
    id: "vip",
    icon: Medal,
    color: "#059669",
    amountBn: "১০,০০০ টাকা",
    amountEn: "৳10,000",
    titleBn: "ভিআইপি সদস্য",
    titleEn: "VIP Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
  },
  {
    id: "well_wisher",
    icon: Heart,
    color: "#7C3AED",
    amountBn: "৫,০০০ টাকা",
    amountEn: "৳5,000",
    titleBn: "শুভাকাঙ্ক্ষী সদস্য",
    titleEn: "Well-Wisher Member",
    subBn: "বাৎসরিক নির্ধারিত অনুদান",
    subEn: "Fixed annual contribution",
  },
];

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
    bn: "বছরে কমপক্ষে একবার আজীবন সদস্য সম্মেলনে অংশগ্রহণের মাধ্যমে উলামায়ে কেরাম ও তালিবুল ইলমদের সাথে উঠা-বসা, খাওয়া-দাওয়া ও বিশেষ দোয়ায় শরীক থাকা যায়।",
    en: "Attend the annual Lifetime Member Conference — sitting, dining, and joining special prayers with the Ulama and students of knowledge.",
  },
  {
    icon: HeartHandshake,
    bn: "প্রতিদিন শত শত হাফেয ও আলেম মাদরাসার বিশেষ দোয়ায় সদস্যদের সার্বিক কল্যাণে দোয়া করতে থাকেন।",
    en: "Hundreds of Huffaz and scholars pray daily for members' overall wellbeing in the madrasah's special dua.",
  },
  {
    icon: HeartPulse,
    bn: "কোনো সদস্য বা তাঁর আপনজন অসুস্থ হলে বা বিপদে পড়লে তাঁর জন্য বিশেষ দোয়ার ব্যবস্থা করা হয়।",
    en: "Special prayers are arranged if a member or their loved one falls ill or faces hardship.",
  },
  {
    icon: BookOpenCheck,
    bn: "কোনো সদস্য বা তাঁর ঘনিষ্ঠজন মারা গেলে কুরআন খতম করে সওয়াব রেসানী করা হয়।",
    en: "A Quran khatam is performed and the reward conveyed for a deceased member or their close kin.",
  },
  {
    icon: Sparkles,
    bn: "মৃত্যুর পরও সদকায়ে জারিয়ারূপে মাদরাসার দ্বীনি খেদমতের একটা অংশ তাঁর আমলনামায় যেতে থাকবে।",
    en: "Even after death, a share of the madrasah's religious service keeps flowing into their record as Sadaqah Jariyah.",
  },
  {
    icon: Star,
    bn: "আলেম-উলামাদের সাথে মহব্বতের কারণে হাদীসের ভাষ্য অনুযায়ী নায়েবে রাসূলদের সাথে হাশর হওয়ার সৌভাগ্য অর্জন হতে পারে।",
    en: "Love for the Ulama may, per hadith, grant the fortune of being raised alongside the inheritors of the Prophets.",
  },
];

const CONTACTS = [
  { display: "+880 1916-387935", raw: "8801916387935", noteBn: "প্রধান হেল্পলাইন", noteEn: "Main Helpline" },
  { display: "+880 1718-763978", raw: "8801718763978", noteBn: "সদস্য সংগ্রহ উইং", noteEn: "Membership Wing" },
  { display: "+880 1314-803334", raw: "8801314803334", noteBn: "সম্মেলন তথ্যকেন্দ্র", noteEn: "Conference Info Desk" },
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

export function LifetimeMemberClient() {
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
      className="py-16 sm:py-20 lg:py-28 relative overflow-hidden"
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
          className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card to-gold/5 p-6 sm:p-8 lg:p-10 shadow-xl mb-12"
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

        {/* About Membership */}
        <motion.div
          className="rounded-3xl border border-gold/30 bg-card p-6 sm:p-8 lg:p-10 shadow-lg mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <h3 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-gold" />
            {t("আজীবন সদস্য কী?", "What is Lifetime Membership?")}
          </h3>
          <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">
            {t(
              `আমাদের পরম শ্রদ্ধেয় শায়েখ হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেব (দামাত বারাকাতুহুম) এর প্রতিষ্ঠিত ও পরিচালিত দ্বীনি প্রতিষ্ঠান "জামেআ মারকাযুল ইহসান ঢাকা (গুলশানে আল্লামা শাহ আব্দুল মতীন কমপ্লেক্স)"।

প্রতিষ্ঠানটির সামগ্রিক উন্নতি-অগ্রগতি এবং শত শত তালিবুল ইলম ও কুরআনের হাফেজদের আর্থিক খেদমতের সহযোগিতাকে বেগবান করার লক্ষ্যে যাঁরা বাৎসরিক নির্দিষ্ট অনুদান প্রদানের অঙ্গীকার করেন, তাঁরাই হলেন এই জামেআর সম্মানিত আজীবন সদস্য। এটি দুনিয়া ও আখেরাতের এক চিরন্তন সদকায়ে জারিয়া।`,
              `Jamea Markazul Ihsan Dhaka (Allama Shah Abdul Matin Complex, Gulshan) is a religious institution founded and led by our respected teacher, Hazrat Maulana Shah Tayyeb Ashraf Shaheb (may Allah preserve him).

Those who pledge a fixed annual contribution to advance the institution's overall progress and support the financial welfare of hundreds of students and Huffaz of the Quran are the institution's honoured Lifetime Members — a lasting Sadaqah Jariyah for this world and the next.`
            )}
          </p>
        </motion.div>

        {/* Tier / Category cards */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.14 }}
        >
          <h3 className="font-display font-bold text-xl text-foreground mb-5 flex items-center gap-2">
            <Gem className="w-5 h-5 text-gold" />
            {t("বাৎসরিক অনুদান ক্যাটাগরি", "Annual Contribution Categories")}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.id}
                  className="flex items-center gap-3 p-4 rounded-2xl border bg-card transition-colors"
                  style={{ borderColor: `${tier.color}40` }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${tier.color}1f` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tier.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-[15px] leading-snug">
                      {t(tier.amountBn, tier.amountEn)}
                    </p>
                    <p className="text-xs font-semibold" style={{ color: tier.color }}>
                      {t(tier.titleBn, tier.titleEn)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {t(tier.subBn, tier.subEn)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start mb-12">
          {/* Benefits grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            <h3 className="font-display font-bold text-xl text-foreground mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              {t("আজীবন সদস্য হওয়ার ফায়দা ও উপকারিতা", "Benefits of Lifetime Membership")}
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
              {t("আজীবন সদস্য সেবা ও অনুদান পোর্টাল", "Lifetime Member Service & Donation Portal")}
            </h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {t(
                "আপনি কি জামেআর নতুন আজীবন সদস্য হতে চান অথবা ইতোমধ্যেই একজন সম্মানিত সদস্য হিসেবে আপনার বাৎসরিক অনুদান হিসেব দেখতে ও পরিশোধ করতে চান?",
                "Want to become a new lifetime member, or are you already a member wishing to check and pay your annual contribution?"
              )}
            </p>

            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <UserPlus className="w-4 h-4 text-gold shrink-0" />
                {t("নতুন সদস্য আবেদন", "New member application")}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <UserCheck className="w-4 h-4 text-gold shrink-0" />
                {t("পুরাতন সদস্য — হিসাব ও বকেয়া অনুদান পরিশোধ", "Existing member — dues & payment")}
              </div>
            </div>

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

        {/* Final Dua Card */}
        <motion.div
          className="rounded-3xl border border-gold/40 bg-gradient-to-br from-card via-card to-gold/5 p-6 sm:p-8 lg:p-10 shadow-lg mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <HeartHandshake className="w-8 h-8 text-gold-dark dark:text-gold mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-gold-dark dark:text-gold mb-3">
            {t("আমাদের ফিকির ও দোয়া", "Our Aspiration & Dua")}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
            {t(
              `দ্বীনি এ খেদমতে অংশগ্রহণ করার লক্ষ্যে আমরা নিজেরা সদস্য হওয়ার ও নিজেদের আপনজন প্রিয়জনদেরকে সদস্য করার ফিকির করবো ইনশাআল্লাহ।

সেই সাথে দোয়া করবো, মহান আল্লাহ রাব্বুল আলামীন নিজ দয়া ও অনুগ্রহে খুব বেশি কবুল করুন এবং সফল করুন। আমীন।`,
              `To take part in this religious service, we will, God willing, strive to become members ourselves and encourage our loved ones to join as well.

And we pray that Allah, the Lord of the worlds, accepts this out of His mercy and grants it success. Ameen.`
            )}
          </p>
        </motion.div>

        {/* Helpline / Contacts */}
        <motion.div
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                {t("জরুরি হেল্পলাইন ও যোগাযোগ", "Helpline & Contact")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(
                  "যেকোনো তথ্যের জন্য সরাসরি যোগাযোগ করুন (WhatsApp রিকমেন্ডেড)",
                  "Reach out directly for any information (WhatsApp recommended)"
                )}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {CONTACTS.map((c) => (
              <div
                key={c.raw}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-background"
              >
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">{c.display}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t(c.noteBn, c.noteEn)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`https://wa.me/${c.raw}?text=${encodeURIComponent(
                      t(
                        "আসসালামু আলাইকুম, আমি জামেআ মারকাযুল ইহসানের আজীবন সদস্য সম্মেলন ২০২৬ সম্পর্কে জানতে আগ্রহী।",
                        "Assalamu Alaikum, I'm interested in learning about the Lifetime Member Conference 2026 of Jamea Markazul Ihsan."
                      )
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("হোয়াটসঅ্যাপে যোগাযোগ", "Contact via WhatsApp")}
                    className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center hover:brightness-105 transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href={`tel:+${c.raw}`}
                    aria-label={t("কল করুন", "Call")}
                    className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center hover:bg-gold/20 transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-gold-dark dark:text-gold" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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

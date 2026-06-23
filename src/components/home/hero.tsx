"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Star, Radio, ChevronDown } from "lucide-react";

const STATS = [
  { value: "50K+", bn: "ডাউনলোড", en: "Downloads" },
  { value: "4.8★", bn: "রেটিং", en: "Rating" },
  { value: "15+", bn: "ফিচার", en: "Features" },
];

function LivePulse() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0"
      style={{ opacity: visible ? 1 : 0.2, transition: "opacity 0.3s ease" }}
    />
  );
}

export function Hero() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden gradient-hero islamic-pattern-subtle"
      aria-label="Hero"
    >
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gold/6 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-deep/6 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/3 blur-[150px]" />
      </div>

      {/* Geometric ornament top */}
      <div className="absolute top-20 right-10 opacity-10 animate-geometric hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <polygon points="60,4 112,30 112,90 60,116 8,90 8,30" stroke="#CBA135" strokeWidth="1.5" fill="none" />
          <polygon points="60,20 96,40 96,80 60,100 24,80 24,40" stroke="#CBA135" strokeWidth="1" fill="none" />
          <polygon points="60,36 80,48 80,72 60,84 40,72 40,48" stroke="#CBA135" strokeWidth="0.8" fill="none" />
          <circle cx="60" cy="60" r="8" stroke="#CBA135" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-24 left-8 opacity-8 animate-float hidden lg:block" style={{ animationDelay: "2s" }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" stroke="#065F46" strokeWidth="1" fill="none" />
          <polygon points="40,16 62,28 62,52 40,64 18,52 18,28" stroke="#065F46" strokeWidth="0.7" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            {/* Top badges row */}
            <motion.div
              className="flex flex-wrap items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="gold" className="text-xs px-3 py-1.5 gap-1.5">
                <Bell className="w-3 h-3" />
                {t("islahBD অফিশিয়াল ইসলামিক অ্যাপ", "islahBD Official Islamic App")}
              </Badge>

              {/* Live highlight pill */}
              <a
                href="#live"
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                  bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400
                  hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200
                  hover:scale-105 cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                <LivePulse />
                <Radio className="w-3 h-3" />
                {t("লাইভ চলছে", "Live Now")}
              </a>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.15] tracking-tight text-foreground mb-6 text-balance"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {t(
                <>
                  islahBD —{" "}
                  <span className="text-gold">সর্বদা</span>{" "}
                  আল্লাহকে স্মরণ করুন
                </>,
                <>
                  islahBD —{" "}
                  <span className="text-gold">Always</span>{" "}
                  Remember Allah
                </>
              )}
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl text-pretty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t(
                "নামাজের সময়, কুরআন, আমল, হজ্জ গাইড, দোয়া, তাসবিহ, লাইভ, নাশিদ — সবকিছু এক অ্যাপে। আপনার দৈনন্দিন ইসলামিক জীবনের বিশ্বস্ত সঙ্গী।",
                "Prayer times, Quran, Amal, Hajj guide, Dua, Tasbeeh, Live, Nasheed — everything in one app. Your trusted companion for daily Islamic life."
              )}
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex items-center gap-6 mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {STATS.map((s) => (
                <div key={s.value} className="flex flex-col">
                  <span className="text-2xl font-display font-bold text-foreground">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{t(s.bn, s.en)}</span>
                </div>
              ))}
            </motion.div>

            {/* Live feature highlight card */}
            <motion.div
              id="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/8 via-rose-500/5 to-transparent p-4 group hover:border-red-500/40 transition-all duration-300">
                {/* Animated glow edge */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <Radio className="w-5 h-5 text-red-500" />
                    </div>
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-xl border border-red-500/40 animate-ping" style={{ animationDuration: "2s" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <LivePulse />
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                        {t("লাইভ", "Live")}
                      </span>
                      <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5">
                        {t("মারকাজুল ইহসান", "Markazul Ihsan")}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug mb-1">
                      {t(
                        "সরাসরি লাইভ প্রোগ্রাম — অ্যাপ থেকে দেখুন",
                        "Live programs — watch directly in the app"
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(
                        "মারকাজুল ইহসানের বয়ান, তাফসির ও বিশেষ অনুষ্ঠান সরাসরি দেখুন। নোটিফিকেশন চালু রাখুন।",
                        "Watch Markazul Ihsan lectures, tafseer & special programs live. Enable notifications to never miss one."
                      )}
                    </p>
                  </div>
                </div>

                {/* Bottom shimmer on hover */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>

            {/* Waitlist form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {submitted ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-deep/10 border border-emerald-deep/20 text-emerald-600 dark:text-emerald-400">
                  <Star className="w-5 h-5 fill-current" />
                  <p className="text-sm font-medium">
                    {t("আপনাকে ওয়েটলিস্টে যোগ করা হয়েছে! লঞ্চের সময় জানাবো।", "You're on the waitlist! We'll notify you at launch.")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("আপনার ইমেইল দিন", "Enter your email")}
                    required
                    className="flex-1 h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                  />
                  <Button type="submit" size="lg" className="shrink-0 gap-2">
                    {t("নোটিফাই করুন", "Notify Me")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                {t("কোনো স্প্যাম নেই। যেকোনো সময় আনসাবস্ক্রাইব করুন।", "No spam. Unsubscribe anytime.")}
              </p>
            </motion.div>

            {/* Store buttons */}
            <motion.div
              className="flex items-center gap-3 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="#"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary transition-all group"
                aria-label="Download on App Store"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-foreground" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-muted-foreground leading-none">{t("ডাউনলোড করুন", "Download on")}</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary transition-all group"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                  <path d="M3,20.5v-17c0-0.83,0.94-1.3,1.6-0.8l14,8.5c0.6,0.36,0.6,1.24,0,1.6l-14,8.5C3.94,21.8,3,21.33,3,20.5z" fill="#CBA135" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-muted-foreground leading-none">{t("পান", "Get it on")}</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Right — phone mockup */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="relative animate-float">
              {/* Ambient glow — soft, centered, subtle */}
              <div className="absolute inset-[-8%] rounded-[50%] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(203,161,53,0.18) 0%, rgba(6,95,70,0.10) 50%, transparent 75%)", filter: "blur(32px)" }} />

              {/* iPhone 15 Pro frame */}
              <div className="relative w-[270px] sm:w-[310px]" style={{ aspectRatio: "393/852" }}>

                {/* Physical side buttons — left */}
                <div className="absolute -left-[3.5px] top-[96px] w-[3.5px] h-[34px] rounded-l-[2px]"
                  style={{ background: "linear-gradient(180deg, #4a4a4f 0%, #3a3a3f 40%, #4a4a4f 100%)" }} />
                <div className="absolute -left-[3.5px] top-[148px] w-[3.5px] h-[66px] rounded-l-[2px]"
                  style={{ background: "linear-gradient(180deg, #4a4a4f 0%, #3a3a3f 40%, #4a4a4f 100%)" }} />
                <div className="absolute -left-[3.5px] top-[228px] w-[3.5px] h-[66px] rounded-l-[2px]"
                  style={{ background: "linear-gradient(180deg, #4a4a4f 0%, #3a3a3f 40%, #4a4a4f 100%)" }} />
                {/* Physical side button — right (power) */}
                <div className="absolute -right-[3.5px] top-[168px] w-[3.5px] h-[84px] rounded-r-[2px]"
                  style={{ background: "linear-gradient(180deg, #4a4a4f 0%, #3a3a3f 40%, #4a4a4f 100%)" }} />

                {/* Outer titanium frame */}
                <div
                  className="absolute inset-0 rounded-[3.2rem] pointer-events-none z-30"
                  style={{
                    background: "transparent",
                    boxShadow: [
                      "0 0 0 1.5px #a0a0a8",
                      "0 0 0 3px #6b6b72",
                      "0 0 0 4px #4a4a52",
                      "inset 0 0 0 1px rgba(255,255,255,0.08)",
                    ].join(", "),
                  }}
                />

                {/* Phone body */}
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    borderRadius: "3.2rem",
                    background: "linear-gradient(145deg, #1c1c1e 0%, #0d0d0f 60%, #1a1a1c 100%)",
                    boxShadow: [
                      "0 60px 120px rgba(0,0,0,0.7)",
                      "0 30px 60px rgba(0,0,0,0.5)",
                      "0 0 0 0.5px rgba(255,255,255,0.12)",
                      "inset 0 1px 0 rgba(255,255,255,0.1)",
                    ].join(", "),
                  }}
                >
                  {/* Screen — clipped inside body */}
                  <div className="absolute inset-[3px] overflow-hidden" style={{ borderRadius: "calc(3.2rem - 3px)" }}>
                    {/* App screenshot */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/home.png"
                      alt="islahBD app home screen"
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Screen top-edge glare */}
                    <div
                      className="absolute inset-x-0 top-0 h-[35%] pointer-events-none"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
                      }}
                    />

                    {/* Dynamic Island */}
                    <div
                      className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
                      style={{
                        width: 120,
                        height: 34,
                        borderRadius: 20,
                        background: "#000",
                        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.8)",
                      }}
                    >
                      {/* Front camera dot */}
                      <div className="w-[10px] h-[10px] rounded-full bg-[#1a1a1a] border border-[#2a2a2a] ml-auto mr-3" />
                    </div>

                    {/* Status bar time */}
                    <div className="absolute top-[14px] left-[20px] z-10">
                      <span className="text-white text-[11px] font-semibold" style={{ letterSpacing: "-0.3px" }}>9:41</span>
                    </div>

                    {/* Status bar icons */}
                    <div className="absolute top-[14px] right-[16px] z-10 flex items-center gap-1">
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="white" opacity="0.9"><rect x="0" y="4" width="3" height="7" rx="0.5"/><rect x="4" y="3" width="3" height="8" rx="0.5"/><rect x="8" y="1.5" width="3" height="9.5" rx="0.5"/><rect x="12" y="0" width="3" height="11" rx="0.5"/></svg>
                      <svg width="15" height="11" viewBox="0 0 15 11" fill="white" opacity="0.9"><path d="M7.5 2.2C9.8 2.2 11.9 3.2 13.3 4.8L14.7 3.3C12.9 1.3 10.3 0 7.5 0S2.1 1.3.3 3.3L1.7 4.8C3.1 3.2 5.2 2.2 7.5 2.2z"/><path d="M7.5 5.5c1.4 0 2.7.6 3.6 1.5l1.4-1.5C11.2 4.2 9.4 3.3 7.5 3.3S3.8 4.2 2.5 5.5l1.4 1.5C4.8 6.1 6.1 5.5 7.5 5.5z"/><circle cx="7.5" cy="9" r="1.5"/></svg>
                      <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.4"/><rect x="2" y="2" width="18" height="8" rx="2" fill="white"/><path d="M23 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/></svg>
                    </div>

                    {/* Bottom home indicator */}
                    <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[5px] rounded-full bg-white/30" />
                  </div>

                  {/* Side edge specular highlight */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[3.2rem]"
                    style={{
                      background: "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.04) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -left-14 top-24 glass-dark rounded-2xl px-3 py-2.5 shadow-xl hidden sm:block"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <p className="text-[10px] text-white/60">{t("দৈনিক আয়াত", "Daily Ayah")}</p>
                <p className="text-xs font-arabic text-gold leading-relaxed">إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
              </motion.div>

              <motion.div
                className="absolute -right-10 bottom-32 rounded-2xl px-3 py-2.5 shadow-xl hidden sm:block"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  backdropFilter: "blur(16px)",
                }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full bg-red-500/25 flex items-center justify-center shrink-0">
                    <Radio className="w-3 h-3 text-red-400" />
                    <span className="absolute inset-0 rounded-full border border-red-500/50 animate-ping" style={{ animationDuration: "1.5s" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <LivePulse />
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{t("লাইভ", "Live")}</p>
                    </div>
                    <p className="text-xs text-white font-medium">{t("বয়ান চলছে", "On Air Now")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-14 bottom-16 glass-dark rounded-2xl px-3 py-2.5 shadow-xl hidden sm:block"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-xs">🧭</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60">{t("কিবলা", "Qibla")}</p>
                    <p className="text-xs text-white font-medium">245° SW</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Star, Download, ChevronDown } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "10M+", bn: "ডাউনলোড", en: "Downloads" },
  { value: "4.8★", bn: "রেটিং", en: "Rating" },
  { value: "11+", bn: "বছরের বিশ্বাস", en: "Years Trusted" },
];

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="gold" className="mb-6 text-xs px-3 py-1.5 gap-1.5">
                <Bell className="w-3 h-3" />
                {t("শীঘ্রই আসছে", "Coming Soon")}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.15] tracking-tight text-foreground mb-6 text-balance"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {t(
                <>
                  আর কোনো{" "}
                  <span className="text-gold">নামাজ মিস</span>{" "}
                  করবেন না
                </>,
                <>
                  Never Miss{" "}
                  <span className="text-gold">Another Prayer</span>{" "}
                  Again
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
                "নামাজের সময়, কুরআন তেলাওয়াত, হাদিস, দোয়া, কিবলা — সবকিছু এক অ্যাপে। আপনার দৈনন্দিন ইসলামিক জীবনের বিশ্বস্ত সঙ্গী।",
                "Prayer times, Quran recitation, Hadith, Dua, Qibla — everything in one app. Your trusted companion for daily Islamic life."
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

            {/* Waitlist form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
              transition={{ duration: 0.6, delay: 0.5 }}
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
              {/* Phone frame */}
              <div className="relative w-[280px] sm:w-[320px] h-[580px] sm:h-[640px]">
                {/* Glow */}
                <div className="absolute inset-0 rounded-[3rem] bg-gold/20 blur-3xl scale-110 prayer-card-glow" />

                {/* Phone body */}
                <div className="relative w-full h-full rounded-[3rem] bg-gradient-to-b from-[#1C2333] to-[#0D1117] border border-white/10 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black/80 z-10" />

                  {/* Screen content */}
                  <div className="absolute inset-0 p-4 pt-12 flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-center justify-between px-1 pt-2">
                      <div>
                        <p className="text-[10px] text-white/50">ঢাকা, বাংলাদেশ</p>
                        <p className="text-xs text-white/80 font-medium">{t("আজকের নামাজ", "Today's Prayer")}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
                        <span className="font-arabic text-sm text-[#111827] font-bold">ت</span>
                      </div>
                    </div>

                    {/* Current prayer hero */}
                    <div className="rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 p-4 text-center">
                      <p className="text-[10px] text-gold/80 mb-1">{t("পরবর্তী নামাজ", "Next Prayer")}</p>
                      <p className="text-2xl font-bold text-white mb-0.5">আসর</p>
                      <p className="text-3xl font-display font-bold text-gold">০৪:৩২</p>
                      <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-gold to-gold-light" />
                      </div>
                      <p className="text-[10px] text-white/50 mt-1">১ ঘণ্টা ১৮ মিনিট বাকি</p>
                    </div>

                    {/* Prayer list */}
                    {[
                      { name: "ফজর", time: "০৫:০২", done: true },
                      { name: "যোহর", time: "১২:০৮", done: true },
                      { name: "আসর", time: "০৪:৩২", done: false, active: true },
                      { name: "মাগরিব", time: "০৬:২১", done: false },
                      { name: "এশা", time: "০৭:৪৫", done: false },
                    ].map((p) => (
                      <div
                        key={p.name}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          p.active
                            ? "bg-gold/15 border border-gold/30"
                            : "bg-white/4"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${p.done ? "bg-emerald-400" : p.active ? "bg-gold animate-pulse-gold" : "bg-white/20"}`} />
                          <span className={`text-xs font-medium ${p.active ? "text-gold" : p.done ? "text-white/50" : "text-white/80"}`}>{p.name}</span>
                        </div>
                        <span className={`text-xs ${p.active ? "text-gold font-bold" : "text-white/50"}`}>{p.time}</span>
                      </div>
                    ))}

                    {/* Bottom tabs */}
                    <div className="mt-auto flex items-center justify-around py-2 border-t border-white/8">
                      {["🏠", "📖", "🤲", "🧭", "👤"].map((icon, i) => (
                        <button key={i} className={`text-lg opacity-${i === 0 ? "100" : "40"}`}>{icon}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -left-12 top-20 glass-dark rounded-2xl px-3 py-2.5 shadow-xl hidden sm:block"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <p className="text-[10px] text-white/60">{t("দৈনিক আয়াত", "Daily Ayah")}</p>
                <p className="text-xs font-arabic text-gold leading-relaxed">إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
              </motion.div>

              <motion.div
                className="absolute -right-8 bottom-28 glass-dark rounded-2xl px-3 py-2.5 shadow-xl hidden sm:block"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
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

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Bell, CheckCircle2 } from "lucide-react";

const PERKS = [
  { bn: "সম্পূর্ণ বিনামূল্যে", en: "Completely free" },
  { bn: "বিজ্ঞাপন-মুক্ত অভিজ্ঞতা", en: "Ad-free experience" },
  { bn: "অফলাইন সাপোর্ট", en: "Offline support" },
  { bn: "প্রাইভেসি-ফার্স্ট", en: "Privacy-first design" },
];

export function AppDownload() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  };

  return (
    <section id="download" className="py-24 lg:py-32 relative overflow-hidden" aria-labelledby="download-heading">
      {/* Background */}
      <div className="absolute inset-0 gradient-emerald opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-gold/20 bg-gradient-to-br from-card via-card to-gold/5 p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
          {/* Icon */}
          <motion.div
            className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          >
            <Smartphone className="w-8 h-8 text-[#111827]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
              {t("শীঘ্রই আসছে", "Coming Soon")}
            </span>
            <h2 id="download-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-5 text-balance">
              {t(
                <>অ্যাপটি <span className="text-gold">লঞ্চ হলে</span> প্রথমেই পাবেন</>,
                <>Be the <span className="text-gold">First to Get</span> the App</>
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 text-pretty">
              {t(
                "আমরা কিছু চমৎকার তৈরি করছি। ওয়েটলিস্টে যোগ দিন এবং লঞ্চের দিন সবার আগে বিজ্ঞপ্তি পান।",
                "We're building something amazing. Join the waitlist and get notified on launch day before anyone else."
              )}
            </p>

            {/* Perks */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {PERKS.map((p) => (
                <span key={p.en} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                  {t(p.bn, p.en)}
                </span>
              ))}
            </div>

            {/* Form */}
            {done ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-deep/10 border border-emerald-deep/20 text-emerald-600 dark:text-emerald-400 max-w-sm mx-auto"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium text-left">
                  {t("ধন্যবাদ! লঞ্চের সময় আপনাকে ইমেইল করা হবে।", "Thank you! You'll be emailed when we launch.")}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("আপনার ইমেইল ঠিকানা", "Your email address")}
                  required
                  className="flex-1 h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                />
                <Button type="submit" size="lg" className="shrink-0 gap-2">
                  <Bell className="w-4 h-4" />
                  {t("নোটিফাই করুন", "Notify Me")}
                </Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground mt-3">
              {t("কোনো স্প্যাম নেই। শুধুমাত্র লঞ্চের সময় একটি ইমেইল।", "No spam. Just one email when we launch.")}
            </p>
          </motion.div>

          {/* Store buttons (greyed — coming soon) */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-border bg-secondary/50 opacity-60 cursor-not-allowed">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-foreground" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">{t("আসছে", "Coming Soon")}</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-border bg-secondary/50 opacity-60 cursor-not-allowed">
              <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                <path d="M3,20.5v-17c0-0.83,0.94-1.3,1.6-0.8l14,8.5c0.6,0.36,0.6,1.24,0,1.6l-14,8.5C3.94,21.8,3,21.33,3,20.5z" fill="#CBA135" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">{t("আসছে", "Coming Soon")}</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

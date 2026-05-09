"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { DAILY_AYAHS } from "@/lib/quran-data";
import { Share2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

export function AyahSection() {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const ayah = DAILY_AYAHS[idx];

  useEffect(() => {
    const dayIdx = new Date().getDate() % DAILY_AYAHS.length;
    setIdx(dayIdx);
  }, []);

  const share = async () => {
    const text = `${ayah.arabic}\n\n"${lang === "bn" ? ayah.translationBn : ayah.translation}"\n— ${ayah.reference}\n\ntazkirah.com`;
    if (navigator.share) await navigator.share({ text });
    else await navigator.clipboard.writeText(text);
  };

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" aria-labelledby="ayah-heading">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/3 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("দৈনিক আয়াত", "Daily Ayah")}
          </span>
          <h2 id="ayah-heading" className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            {t("আজকের কুরআনের বাণী", "Today's Quranic Verse")}
          </h2>
        </motion.div>

        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-gold/20 bg-card/80 backdrop-blur-sm p-8 sm:p-12 text-center shadow-xl"
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/30 rounded-br-lg" />

          {/* Bismillah ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/30" />
            <span className="text-gold text-xs tracking-widest">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/30" />
          </div>

          {/* Arabic */}
          <p className="font-arabic text-3xl sm:text-4xl text-foreground leading-loose mb-6 dir-rtl">
            {ayah.arabic}
          </p>

          {/* Transliteration */}
          <p className="text-sm text-muted-foreground italic mb-4 font-light">
            {ayah.transliteration}
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-12 bg-gold/20" />
            <span className="text-gold/40 text-xs">❋</span>
            <div className="h-px w-12 bg-gold/20" />
          </div>

          {/* Translation */}
          <blockquote className="text-lg sm:text-xl font-display text-foreground leading-relaxed mb-3">
            "{lang === "bn" ? ayah.translationBn : ayah.translation}"
          </blockquote>

          {/* Reference */}
          <p className="text-sm text-gold font-medium mb-8">{ayah.reference}</p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIdx((idx - 1 + DAILY_AYAHS.length) % DAILY_AYAHS.length)}
              className="w-10 h-10 rounded-xl border border-border hover:bg-secondary transition-all flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Previous ayah"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center ${
                bookmarked ? "border-gold/40 bg-gold/10 text-gold" : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark ayah"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={share}
              className="w-10 h-10 rounded-xl border border-border hover:bg-secondary transition-all flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Share ayah"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIdx((idx + 1) % DAILY_AYAHS.length)}
              className="w-10 h-10 rounded-xl border border-border hover:bg-secondary transition-all flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Next ayah"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {DAILY_AYAHS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? "w-5 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-border"}`}
                aria-label={`Ayah ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

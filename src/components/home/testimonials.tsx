"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "মোহাম্মদ মোহিন",
    handle: "Google Play",
    avatarInitial: "ম",
    avatarColor: "from-emerald-500 to-teal-600",
    ratingBn: "islahbd একটি পারফেক্ট অ্যাপ! একজন প্রকৃত মুসলিমের দিন হেলা ঈমান, শৃঙ্খলা আর প্রশান্তির এক অপূর্ব মেলবন্ধন।",
    ratingEn: "islahbd is a perfect app! Every Muslim's day begins with faith, discipline, and inner peace — all in one place.",
  },
  {
    name: "মোহাম্মদ ইব্রাহিম",
    handle: "Google Play",
    avatarInitial: "ই",
    avatarColor: "from-gold to-amber-600",
    ratingBn: "আমার মতে রমজান মাসের জন্য সেরা অ্যাপ। প্রতি রমজানে আমি এটা ব্যবহার করি। এত সুন্দর একটা অ্যাপ বানানোর জন্য আপনাদের ধন্যবাদ।",
    ratingEn: "The best app for Ramadan in my opinion. I use it every Ramadan. Thank you for building such a beautiful app.",
  },
  {
    name: "Fatima Rahman",
    handle: "App Store",
    avatarInitial: "F",
    avatarColor: "from-violet-500 to-purple-600",
    ratingBn: "কুরআন তেলাওয়াত এবং দোয়ার জন্য অসাধারণ। অফলাইনেও কাজ করে, যা সত্যিই দরকারী।",
    ratingEn: "Excellent for Quran recitation and duas. Works offline too, which is really useful when traveling.",
  },
  {
    name: "আব্দুর রহমান",
    handle: "Google Play",
    avatarInitial: "আ",
    avatarColor: "from-sky-500 to-blue-600",
    ratingBn: "নামাজের সময় এবং কিবলার দিক পাওয়া এখন অনেক সহজ হয়ে গেছে। প্রতিদিনের সঙ্গী।",
    ratingEn: "Finding prayer times and Qibla direction has become so easy. My daily companion.",
  },
  {
    name: "Nusaiba Ahmed",
    handle: "App Store",
    avatarInitial: "N",
    avatarColor: "from-rose-500 to-pink-600",
    ratingBn: "সকাল-সন্ধ্যার আযকার আর দৈনিক হাদিস পড়ার অভ্যাস এই অ্যাপের কারণে হয়েছে।",
    ratingEn: "This app helped me build the habit of reading morning/evening adhkar and daily hadith.",
  },
  {
    name: "খালিদ হোসেন",
    handle: "Google Play",
    avatarInitial: "খ",
    avatarColor: "from-teal-500 to-cyan-600",
    ratingBn: "যাকাত ক্যালকুলেটরটা সত্যিই অনেক কাজে লাগে। সব ফিচার এক জায়গায় পাওয়া অসাধারণ।",
    ratingEn: "The Zakat calculator is truly useful. Having all features in one place is amazing.",
  },
];

export function Testimonials() {
  const { t } = useLang();

  return (
    <section className="py-24 lg:py-32 bg-card/30" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("রিভিউ", "Reviews")}
          </span>
          <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {t(
              <>মানুষ <span className="text-gold">ভালোবাসে</span></>,
              <>People <span className="text-gold">Love It</span></>
            )}
          </h2>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            {t("50K+ ডাউনলোড • 4.8 রেটিং", "50K+ Downloads • 4.8 Rating")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((review, i) => (
            <motion.div
              key={review.name}
              className="rounded-2xl border border-border bg-card p-6 card-hover"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                "{t(review.ratingBn, review.ratingEn)}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${review.avatarColor} flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
                  {review.avatarInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.handle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

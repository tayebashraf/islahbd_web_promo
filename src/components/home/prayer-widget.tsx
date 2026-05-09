"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { calculatePrayerTimes, getCurrentPrayer, getNextPrayer, type PrayerTimes } from "@/lib/prayer-times";
import { timeUntil, formatHijriDate, formatGregorianDate } from "@/lib/utils";
import { MapPin, Clock, RefreshCw } from "lucide-react";
import { BD_CITIES } from "@/lib/constants";

const PRAYER_NAMES_BN: Record<string, string> = {
  Fajr: "ফজর", Sunrise: "সূর্যোদয়", Dhuhr: "যোহর", Asr: "আসর", Maghrib: "মাগরিব", Isha: "এশা",
};
const PRAYER_ICONS: Record<string, string> = {
  Fajr: "🌙", Sunrise: "🌅", Dhuhr: "☀️", Asr: "🌤", Maghrib: "🌆", Isha: "🌃",
};

export function PrayerWidget() {
  const { t, lang } = useLang();
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [selectedCity, setSelectedCity] = useState(BD_CITIES[0]);
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = calculatePrayerTimes(selectedCity.lat, selectedCity.lng, new Date(), 6);
    setTimes(t);
    setCurrentPrayer(getCurrentPrayer(t));
    setNextPrayer(getNextPrayer(t));
  }, [selectedCity]);

  useEffect(() => {
    if (!nextPrayer) return;
    const tick = setInterval(() => {
      setNow(new Date());
      setCountdown(timeUntil(nextPrayer.time));
    }, 1000);
    return () => clearInterval(tick);
  }, [nextPrayer]);

  const prayers = times
    ? Object.entries(times).map(([name, time]) => ({ name, time }))
    : [];

  return (
    <section className="py-24 lg:py-32" aria-labelledby="prayer-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("নামাজের সময়", "Prayer Times")}
          </span>
          <h2 id="prayer-heading" className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {t("আজকের নামাজের সময়সূচী", "Today's Prayer Schedule")}
          </h2>
          <p className="text-muted-foreground">
            {formatGregorianDate(now, lang)} • {formatHijriDate(now)}
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* City selector */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-gold" />
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = BD_CITIES.find((c) => c.name === e.target.value);
                  if (city) setSelectedCity(city);
                }}
                className="bg-transparent text-foreground font-medium text-sm focus:outline-none cursor-pointer"
                aria-label={t("শহর নির্বাচন করুন", "Select city")}
              >
                {BD_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {lang === "bn" ? c.nameBn : c.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t("লাইভ আপডেট", "Live")}
            </span>
          </div>

          {/* Next prayer countdown */}
          {nextPrayer && (
            <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/3 p-6 mb-6 text-center">
              <p className="text-sm text-gold/80 mb-1">
                {t("পরবর্তী নামাজ", "Next Prayer")} —{" "}
                <strong className="text-gold">
                  {lang === "bn" ? PRAYER_NAMES_BN[nextPrayer.name] : nextPrayer.name}
                </strong>
                {" "}({nextPrayer.time})
              </p>
              <div className="flex items-center justify-center gap-3">
                {[
                  { v: countdown.hours, bn: "ঘণ্টা", en: "hr" },
                  { v: countdown.minutes, bn: "মিনিট", en: "min" },
                  { v: countdown.seconds, bn: "সেকেন্ড", en: "sec" },
                ].map(({ v, bn, en }, i) => (
                  <React.Fragment key={en}>
                    {i > 0 && <span className="text-2xl font-bold text-gold/40">:</span>}
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-display font-bold text-gold animate-countdown tabular-nums">
                        {String(v).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{t(bn, en)}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Prayer cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {prayers.map(({ name, time }) => {
              const isActive = name === currentPrayer;
              const isNext = name === nextPrayer?.name;
              return (
                <div
                  key={name}
                  className={`relative rounded-2xl border p-4 text-center transition-all ${
                    isActive
                      ? "border-gold/40 bg-gradient-to-b from-gold/15 to-gold/5 prayer-card-glow"
                      : isNext
                      ? "border-gold/20 bg-gold/5"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{PRAYER_ICONS[name]}</span>
                  <p className={`text-xs font-semibold mb-1.5 ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                    {lang === "bn" ? PRAYER_NAMES_BN[name] : name}
                  </p>
                  <p className={`text-sm font-bold tabular-nums ${isActive ? "text-gold" : "text-foreground"}`}>
                    {time}
                  </p>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-pulse-gold" />
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            {t(
              "* সঠিক সময়ের জন্য অ্যাপ ডাউনলোড করুন এবং আপনার অবস্থান শেয়ার করুন।",
              "* Download the app for precise times based on your exact location."
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

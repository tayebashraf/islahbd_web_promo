"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { calculatePrayerTimes, getCurrentPrayer, getNextPrayer, type PrayerTimes } from "@/lib/prayer-times";
import { timeUntil, formatHijriDate, formatGregorianDate } from "@/lib/utils";
import { BD_CITIES } from "@/lib/constants";
import { MapPin, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRAYER_NAMES_BN: Record<string, string> = {
  Fajr: "ফজর", Sunrise: "সূর্যোদয়", Dhuhr: "যোহর", Asr: "আসর", Maghrib: "মাগরিব", Isha: "এশা",
};
const PRAYER_ICONS: Record<string, string> = {
  Fajr: "🌙", Sunrise: "🌅", Dhuhr: "☀️", Asr: "🌤", Maghrib: "🌆", Isha: "🌃",
};

export function PrayerTimesClient() {
  const { t, lang } = useLang();
  const [selectedCity, setSelectedCity] = useState(BD_CITIES[0]);
  const [times, setTimes] = useState<PrayerTimes | null>(null);
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
    const interval = setInterval(() => {
      const n = new Date();
      setNow(n);
      setCountdown(timeUntil(nextPrayer.time));
      if (times) {
        setCurrentPrayer(getCurrentPrayer(times));
        setNextPrayer(getNextPrayer(times));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer, times]);

  const prayers = times ? Object.entries(times).map(([name, time]) => ({ name, time })) : [];

  return (
    <div className="min-h-screen pt-24 pb-20 gradient-hero">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("নামাজের সময়", "Prayer Times")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            {lang === "bn" ? selectedCity.nameBn : selectedCity.name} —{" "}
            {t("আজকের সময়সূচী", "Today's Schedule")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {formatGregorianDate(now, lang)} • {formatHijriDate(now)}
          </p>
        </motion.div>

        {/* City selector */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5">
            <MapPin className="w-4 h-4 text-gold" />
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const city = BD_CITIES.find((c) => c.name === e.target.value);
                if (city) setSelectedCity(city);
              }}
              className="bg-transparent text-foreground font-medium text-sm focus:outline-none cursor-pointer"
            >
              {BD_CITIES.map((c) => (
                <option key={c.name} value={c.name}>{lang === "bn" ? c.nameBn : c.name}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-3.5 h-3.5" />
            {t("অ্যাপ ডাউনলোড", "Get App")}
          </Button>
        </div>

        {/* Countdown card */}
        {nextPrayer && (
          <motion.div
            className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/12 via-gold/6 to-transparent p-8 text-center mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              {t("পরবর্তী নামাজ", "Next Prayer")}
            </p>
            <p className="text-2xl font-display font-bold text-foreground mb-1">
              {PRAYER_ICONS[nextPrayer.name]}{" "}
              {lang === "bn" ? PRAYER_NAMES_BN[nextPrayer.name] : nextPrayer.name}
            </p>
            <p className="text-lg text-gold font-semibold mb-5">{nextPrayer.time}</p>
            <div className="flex items-center justify-center gap-4">
              {[
                { v: countdown.hours, bn: "ঘণ্টা", en: "Hours" },
                { v: countdown.minutes, bn: "মিনিট", en: "Min" },
                { v: countdown.seconds, bn: "সেকেন্ড", en: "Sec" },
              ].map(({ v, bn, en }, i) => (
                <React.Fragment key={en}>
                  {i > 0 && <span className="text-3xl font-bold text-gold/30 mb-4">:</span>}
                  <div className="text-center">
                    <div className="text-5xl font-display font-bold text-gold tabular-nums animate-countdown">
                      {String(v).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{t(bn, en)}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}

        {/* Prayer time cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {prayers.map(({ name, time }, i) => {
            const isActive = name === currentPrayer;
            const isNext = name === nextPrayer?.name;
            return (
              <motion.div
                key={name}
                className={`rounded-2xl border p-5 text-center transition-all ${
                  isActive
                    ? "border-gold/50 bg-gradient-to-b from-gold/15 to-gold/5 prayer-card-glow"
                    : isNext
                    ? "border-gold/20 bg-gold/5"
                    : "border-border bg-card"
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <span className="text-3xl mb-3 block">{PRAYER_ICONS[name]}</span>
                <p className={`text-sm font-semibold mb-2 ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                  {lang === "bn" ? PRAYER_NAMES_BN[name] : name}
                </p>
                <p className={`text-xl font-display font-bold tabular-nums ${isActive ? "text-gold" : "text-foreground"}`}>
                  {time}
                </p>
                {isActive && (
                  <span className="mt-2 inline-block text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                    {t("চলমান", "Active")}
                  </span>
                )}
                {isNext && !isActive && (
                  <span className="mt-2 inline-block text-[10px] bg-gold/10 text-gold/80 px-2 py-0.5 rounded-full">
                    {t("পরবর্তী", "Next")}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Other cities */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4 text-sm">
            {t("অন্যান্য শহর", "Other Cities")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BD_CITIES.slice(0, 8).map((city) => {
              const ct = calculatePrayerTimes(city.lat, city.lng, new Date(), 6);
              const next = getNextPrayer(ct);
              return (
                <button
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    city.name === selectedCity.name
                      ? "border-gold/40 bg-gold/8"
                      : "border-border hover:border-gold/20 hover:bg-secondary"
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{lang === "bn" ? city.nameBn : city.name}</p>
                  <p className="text-xs text-gold mt-0.5">{next.time}</p>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t(
            "* সময়গুলো গণনাকৃত। সঠিক সময়ের জন্য স্থানীয় মসজিদ বা অ্যাপ দেখুন।",
            "* Times are calculated estimates. Check local mosque or app for precise times."
          )}
        </p>
      </div>
    </div>
  );
}

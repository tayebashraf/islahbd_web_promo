"use client";

import { useEffect, useState } from "react";
import { useHydrated, useStoredString } from "@/lib/use-client-store";
import { BD_CITIES } from "@/lib/constants";
import { calculatePrayerTimes, getNextPrayer, type PrayerTimes } from "@/lib/prayer-times";

export const PRAYER_BN: Record<string, string> = {
  Fajr: "ফজর",
  Sunrise: "সূর্যোদয়",
  Dhuhr: "যোহর",
  Asr: "আসর",
  Maghrib: "মাগরিব",
  Isha: "এশা",
};

const CITY_KEY = "islahbd-city";
export type City = (typeof BD_CITIES)[number];

/** Ticks every second after mount; `null` during SSR so markup stays deterministic. */
export function useNow(intervalMs = 1000): Date | null {
  const hydrated = useHydrated();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return hydrated ? now : null;
}

/** Dhuhr is Jumu'ah on Fridays. */
export function prayerLabel(name: string, friday: boolean): { bn: string; en: string } {
  if (name === "Dhuhr" && friday) return { bn: "জুমা", en: "Jumu'ah" };
  return { bn: PRAYER_BN[name] ?? name, en: name };
}

/**
 * The part of the day we are in — the same phases as the app: the five
 * prayers, the times prayer is forbidden (sunrise, zawal, sunset) and the
 * nafl windows between them (ishraq, chasht / duha).
 */
export type Phase = {
  key: string;
  bn: string;
  en: string;
  /** The obligatory prayer this phase belongs to, if any (highlights the list). */
  fardh: string;
  forbidden: boolean;
  noticeBn?: string;
  noticeEn?: string;
  start: Date;
  end: Date;
};

function phasesFor(times: PrayerTimes, at: (hhmm: string, dayOffset?: number) => Date, friday: boolean): Phase[] {
  const min = (d: Date, m: number) => new Date(d.getTime() + m * 60_000);
  const fajr = at(times.Fajr);
  const sunrise = at(times.Sunrise);
  const dhuhr = at(times.Dhuhr);
  const asr = at(times.Asr);
  const maghrib = at(times.Maghrib);
  const isha = at(times.Isha);
  const dh = prayerLabel("Dhuhr", friday);
  return [
    { key: "isha-prev", bn: "এশা", en: "Isha", fardh: "Isha", forbidden: false, start: at(times.Isha, -1), end: fajr },
    { key: "fajr", bn: "ফজর", en: "Fajr", fardh: "Fajr", forbidden: false, start: fajr, end: sunrise },
    { key: "sunrise", bn: "সূর্যোদয়", en: "Sunrise", fardh: "", forbidden: true, noticeBn: "সূর্য ওঠার সময় সকল নামাজ নিষেধ", noticeEn: "No prayer while the sun rises", start: sunrise, end: min(sunrise, 15) },
    { key: "ishraq", bn: "ইশরাক", en: "Ishraq", fardh: "", forbidden: false, start: min(sunrise, 15), end: min(sunrise, 120) },
    { key: "chasht", bn: "চাশত / দুহা", en: "Chasht / Duha", fardh: "", forbidden: false, start: min(sunrise, 120), end: min(dhuhr, -10) },
    { key: "zawal", bn: "যাওয়াল", en: "Zawal", fardh: "", forbidden: true, noticeBn: "সূর্য মাথার উপর, এখন নামাজ নিষেধ", noticeEn: "The sun is at its zenith — no prayer now", start: min(dhuhr, -10), end: dhuhr },
    { key: "dhuhr", bn: dh.bn, en: dh.en, fardh: "Dhuhr", forbidden: false, start: dhuhr, end: asr },
    { key: "asr", bn: "আসর", en: "Asr", fardh: "Asr", forbidden: false, start: asr, end: min(maghrib, -15) },
    { key: "sunset", bn: "সূর্যাস্ত", en: "Sunset", fardh: "Asr", forbidden: true, noticeBn: "এখন সকল নামাজ পড়া নিষেধ (আজকের দিনের আসরের নামাজ ব্যতীত)", noticeEn: "All prayers are forbidden now (except today's Asr prayer)", start: min(maghrib, -15), end: maghrib },
    { key: "maghrib", bn: "মাগরিব", en: "Maghrib", fardh: "Maghrib", forbidden: false, start: maghrib, end: isha },
    { key: "isha", bn: "এশা", en: "Isha", fardh: "Isha", forbidden: false, start: isha, end: at(times.Fajr, 1) },
  ];
}

export function usePrayer() {
  const [saved, setSaved] = useStoredString(CITY_KEY);
  const city: City = BD_CITIES.find((c) => c.name === saved) ?? BD_CITIES[0];
  const setCity = (c: City) => setSaved(c.name);
  const now = useNow();

  let times: PrayerTimes | null = null;
  let current = "";
  let next: { name: string; time: string } | null = null;
  let phase: Phase | null = null;
  let upcoming: Phase | null = null;
  let remaining = 0;
  let progress = 0;
  let phaseRemaining = 0;
  let phaseProgress = 0;
  const friday = now ? now.getDay() === 5 : false;

  if (now) {
    times = calculatePrayerTimes(city.lat, city.lng, now, 6);
    next = getNextPrayer(times);
    const at = (hhmm: string, dayOffset = 0) => {
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date(now);
      d.setHours(h, m, 0, 0);
      d.setDate(d.getDate() + dayOffset);
      return d;
    };
    const list = phasesFor(times, at, friday);
    const i = list.findIndex((p) => now >= p.start && now < p.end);
    phase = list[i >= 0 ? i : list.length - 1];
    upcoming = list[(i >= 0 ? i : list.length - 1) + 1] ?? list[1];
    current = phase.fardh;
    phaseRemaining = Math.max(0, Math.floor((phase.end.getTime() - now.getTime()) / 1000));
    const phaseSpan = phase.end.getTime() - phase.start.getTime();
    phaseProgress = phaseSpan > 0 ? Math.min(1, Math.max(0, (now.getTime() - phase.start.getTime()) / phaseSpan)) : 0;

    // Countdown to the next prayer time (used by the prayer-times page).
    let target = at(next.time);
    if (target <= now) target = at(next.time, 1);
    remaining = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    const prev = [...list].reverse().find((p) => p.start <= now && p.fardh)?.start ?? phase.start;
    const span = target.getTime() - prev.getTime();
    progress = span > 0 ? Math.min(1, Math.max(0, (now.getTime() - prev.getTime()) / span)) : 0;
  }

  return { city, setCity, now, times, current, next, phase, upcoming, friday, remaining, progress, phaseRemaining, phaseProgress };
}

export function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")}`;
}

"use client";

import { useEffect, useState } from "react";
import { useHydrated, useStoredString } from "@/lib/use-client-store";
import { BD_CITIES } from "@/lib/constants";
import { calculatePrayerTimes, getCurrentPrayer, getNextPrayer, type PrayerTimes } from "@/lib/prayer-times";

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

export function usePrayer() {
  const [saved, setSaved] = useStoredString(CITY_KEY);
  const city: City = BD_CITIES.find((c) => c.name === saved) ?? BD_CITIES[0];
  const setCity = (c: City) => setSaved(c.name);
  const now = useNow();

  let times: PrayerTimes | null = null;
  let current = "";
  let next: { name: string; time: string } | null = null;
  let remaining = 0;
  let progress = 0;

  if (now) {
    times = calculatePrayerTimes(city.lat, city.lng, now, 6);
    current = getCurrentPrayer(times);
    next = getNextPrayer(times);
    const at = (hhmm: string, dayOffset = 0) => {
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date(now);
      d.setHours(h, m, 0, 0);
      d.setDate(d.getDate() + dayOffset);
      return d;
    };
    let target = at(next.time);
    if (target <= now) target = at(next.time, 1);
    remaining = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    let start = at(times[current as keyof PrayerTimes]);
    if (start > now) start = at(times[current as keyof PrayerTimes], -1);
    const span = target.getTime() - start.getTime();
    progress = span > 0 ? Math.min(1, (now.getTime() - start.getTime()) / span) : 0;
  }

  return { city, setCity, now, times, current, next, remaining, progress };
}

export function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")}`;
}

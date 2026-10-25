"use client";

import { useEffect, useState } from "react";
import { Compass, LocateFixed, MapPin } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { usePrayer } from "@/lib/use-prayer";
import { BD_CITIES } from "@/lib/constants";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

const KAABA = { lat: 21.4225, lng: 39.8262 };
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Initial great-circle bearing from a point to the Kaaba, degrees from true north. */
function qiblaBearing(lat: number, lng: number) {
  const φ1 = rad(lat);
  const φ2 = rad(KAABA.lat);
  const Δλ = rad(KAABA.lng - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

function distanceKm(lat: number, lng: number) {
  const dφ = rad(KAABA.lat - lat);
  const dλ = rad(KAABA.lng - lng);
  const a = Math.sin(dφ / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dλ / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const DIRS: [string, string][] = [
  ["উত্তর", "North"],
  ["উত্তর-পূর্ব", "North-east"],
  ["পূর্ব", "East"],
  ["দক্ষিণ-পূর্ব", "South-east"],
  ["দক্ষিণ", "South"],
  ["দক্ষিণ-পশ্চিম", "South-west"],
  ["পশ্চিম", "West"],
  ["উত্তর-পশ্চিম", "North-west"],
];

type OrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };

export function QiblaClient() {
  const { t, lang } = useLang();
  const { city, setCity } = usePrayer();
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [compassOn, setCompassOn] = useState(false);

  const here = gps ?? { lat: city.lat, lng: city.lng };
  const bearing = qiblaBearing(here.lat, here.lng);
  const km = distanceKm(here.lat, here.lng);
  const dir = DIRS[Math.round(bearing / 45) % 8];

  useEffect(() => {
    if (!compassOn) return;
    const onOrient = (e: Event) => {
      const ev = e as OrientationEvent;
      const h = ev.webkitCompassHeading ?? (ev.absolute && ev.alpha != null ? 360 - ev.alpha : null);
      if (h != null) setHeading(h);
    };
    window.addEventListener("deviceorientationabsolute", onOrient);
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrient);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [compassOn]);

  const startCompass = async () => {
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    try {
      if (typeof DOE.requestPermission === "function" && (await DOE.requestPermission()) !== "granted") return;
    } catch {
      return;
    }
    setCompassOn(true);
  };

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setGps({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // The dial turns with the phone so "N" stays north; the needle then points at the Kaaba.
  const dialRotation = heading != null ? -heading : 0;
  const facing = heading != null && Math.abs(((heading - bearing + 540) % 360) - 180) < 5;

  return (
    <div>
      <PageHeader
        title={t("কিবলা", "Qibla")}
        muted={t(`কিবলা ${num(bearing.toFixed(1), lang)}° — ${dir[0]} দিকে`, `Qibla ${bearing.toFixed(1)}° — towards the ${dir[1].toLowerCase()}`)}
        description={t("মোবাইলে “কম্পাস চালু করুন” চাপুন, তারপর ফোন সমতলে রেখে ঘুরিয়ে কাবার চিহ্ন উপরে আনুন।", "On a phone, tap “Start compass”, hold the phone flat and turn until the Kaaba mark is at the top.")}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <Panel className={cn("flex flex-col items-center py-10 transition-colors", facing && "border-brand bg-brand-soft")}>
          <div className="relative h-[300px] w-[300px]">
            {/* fixed top marker */}
            <svg viewBox="0 0 20 14" className="absolute -top-3 left-1/2 z-10 h-3.5 w-5 -translate-x-1/2 text-brand" aria-hidden>
              <path d="M0 0h20L10 14z" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `rotate(${dialRotation}deg)` }}>
              <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden>
                <circle cx="150" cy="150" r="140" fill="var(--panel)" stroke="var(--line)" strokeWidth="2" />
                <circle cx="150" cy="150" r="112" fill="var(--canvas-2)" />
                {Array.from({ length: 72 }, (_, i) => (
                  <line
                    key={i}
                    x1="150"
                    y1="14"
                    x2="150"
                    y2={i % 9 === 0 ? 30 : 22}
                    stroke={i % 9 === 0 ? "var(--ink-2)" : "var(--line)"}
                    strokeWidth={i % 9 === 0 ? 2.5 : 1.5}
                    transform={`rotate(${i * 5} 150 150)`}
                  />
                ))}
                {["N", "E", "S", "W"].map((c, i) => (
                  <text key={c} x="150" y="52" textAnchor="middle" fontSize="18" fontWeight="600" fill={c === "N" ? "#DC2626" : "var(--ink-2)"} transform={`rotate(${i * 90} 150 150)`}>
                    {c}
                  </text>
                ))}
                <g transform={`rotate(${bearing} 150 150)`}>
                  <line x1="150" y1="150" x2="150" y2="62" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" />
                  <rect x="135" y="40" width="30" height="30" rx="4" fill="#1b1f1d" />
                  <rect x="135" y="47" width="30" height="5" fill="#D9B25E" />
                </g>
                <circle cx="150" cy="150" r="10" fill="var(--brand)" />
              </svg>
            </div>
          </div>
          <p className="mt-6 font-num text-4xl font-semibold text-ink">{num(Math.round(bearing), lang)}°</p>
          <p className="mt-1 text-[15px] text-ink-2">{facing ? t("আপনি এখন কিবলামুখী ✓", "You are facing the qibla ✓") : t(`উত্তর থেকে ঘড়ির কাঁটার দিকে · ${dir[0]}`, `Clockwise from north · ${dir[1]}`)}</p>
          {!compassOn ? (
            <button onClick={startCompass} className="mt-6 flex h-12 items-center gap-2 rounded-2xl bg-brand px-6 text-[15px] font-medium text-white">
              <Compass className="h-5 w-5" /> {t("কম্পাস চালু করুন", "Start compass")}
            </button>
          ) : heading == null ? (
            <p className="mt-6 text-sm text-ink-3">{t("এই ডিভাইসে কম্পাস সেন্সর পাওয়া যায়নি", "No compass sensor found on this device")}</p>
          ) : null}
        </Panel>

        <div className="space-y-4">
          <Panel>
            <p className="text-sm font-semibold text-brand">{t("আপনার অবস্থান", "Your location")}</p>
            <button
              onClick={locate}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-panel-2 text-[15px] text-ink hover:border-brand/40"
            >
              <LocateFixed className={cn("h-5 w-5 text-brand", locating && "animate-spin")} />
              {gps ? t("GPS অবস্থান ব্যবহার হচ্ছে", "Using GPS location") : t("আমার অবস্থান ব্যবহার করুন", "Use my location")}
            </button>
            <p className="mt-4 mb-2 text-sm text-ink-3">{t("অথবা শহর বেছে নিন", "Or pick a city")}</p>
            <div className="grid grid-cols-2 gap-2">
              {BD_CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setGps(null);
                    setCity(c);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-[15px] transition",
                    !gps && c.name === city.name ? "border-brand bg-brand-soft text-brand" : "border-line text-ink hover:border-brand/40",
                  )}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {t(c.nameBn, c.name)}
                </button>
              ))}
            </div>
          </Panel>
          <Panel>
            <p className="text-sm text-ink-3">{t("মক্কা মুকাররমা পর্যন্ত দূরত্ব", "Distance to Makkah")}</p>
            <p className="mt-1 font-num text-3xl font-semibold text-ink">
              {num(Math.round(km).toLocaleString("en"), lang)} <span className="text-lg font-normal text-ink-2">{t("কিমি", "km")}</span>
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

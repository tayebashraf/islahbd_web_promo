"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Ban,
  Bell,
  CalendarDays,
  ChevronsUpDown,
  Clock,
  Compass,
  Grid2x2,
  Headphones,
  HeartHandshake,
  MapPin,
  Moon,
  Pause,
  Play,
  Radio,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import type { Book, Boyan, Clip, LiveStatus, Malfuz, Nasheed } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer, type Track } from "@/components/player/player-provider";
import { FeatureLink, ToneIcon, useShell } from "@/components/dashboard/shell";
import { Equalizer, ViewAll } from "@/components/dashboard/ui";
import { LINKS, QUICK_LINKS, type NavLink } from "@/lib/nav";
import { boyanTrack } from "@/lib/tracks";
import {
  clock,
  formatDate,
  formatHijri,
  formatTime,
  num,
  shortSpeaker,
} from "@/lib/format";
import { prayerLabel, to12h, useNow, usePrayer } from "@/lib/use-prayer";
import { formatBanglaDate } from "@/lib/bangla-date";
import { APP_STORE_URL, BD_CITIES, PLAY_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HERO_INTRO, HeroBanner } from "./hero-banner";

export interface HomeData {
  live: LiveStatus | null;
  boyans: Boyan[];
  boyanCats: { name: string; count: number }[];
  nasheeds: Nasheed[];
  clips: Clip[];
  malfuz: Malfuz[];
  books?: Book[];
  counts: Record<"boyan" | "nasheed" | "clip" | "book", number>;
}

/** Fades a block in as it scrolls into view. */
function Reveal({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8",
      className,
    )}
  >
    {children}
  </div>
);

export function Dashboard({ data }: { data: HomeData }) {
  return (
    <div>
      <Hero live={data.live} />

      {/* Unified Multimedia Section (Boyan, Short Clips, Hamd-Naat, Books) */}
      <MediaSection data={data} />

      {/* Malfuz carousel */}
      {data.malfuz.length > 0 && (
        <section className="bg-canvas-2 py-14 sm:py-20">
          <Container>
            <QuoteCarousel malfuz={data.malfuz} />
          </Container>
        </section>
      )}

      <AppSection />
      <SupportSection />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */

const FIVE = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_ICON: Record<string, LucideIcon> = {
  Fajr: Sunrise,
  Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

type Prayer = ReturnType<typeof usePrayer>;

function Hero({ live }: { live: LiveStatus | null }) {
  const prayer = usePrayer();

  return (
    <>
      <HeroBanner />
      <section className="relative overflow-hidden">
        <Scenery />
        <Container className="relative pt-6 pb-12 sm:pt-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: HERO_INTRO,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <MobilePrayer prayer={prayer} />

            <div className="mx-auto mt-10 hidden max-w-[940px] grid-cols-2 gap-6 lg:grid">
              <DateCard prayer={prayer} />
              <div className="glass-card flex items-center gap-6 p-5">
                <PrayerRing prayer={prayer} size={176} />
                <PrayerList prayer={prayer} className="flex-1" />
              </div>
            </div>

            <QuickMenu />
            {live?.isLive && <LiveBanner live={live} />}
          </motion.div>
        </Container>
      </section>
    </>
  );
}

function remainingClock(sec: number, lang: Parameters<typeof num>[1]) {
  const parts = [
    Math.floor(sec / 3600),
    Math.floor((sec % 3600) / 60),
    sec % 60,
  ];
  return num(parts.map((v) => String(v).padStart(2, "0")).join(":"), lang);
}

function CitySelect({
  prayer,
  className,
}: {
  prayer: Prayer;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <select
      value={prayer.city.name}
      onChange={(e) =>
        prayer.setCity(
          BD_CITIES.find((c) => c.name === e.target.value) ?? BD_CITIES[0],
        )
      }
      className={cn("cursor-pointer bg-transparent outline-none", className)}
      aria-label={t("শহর", "City")}
    >
      {BD_CITIES.map((c) => (
        <option key={c.name} value={c.name}>
          {t(`${c.nameBn}, বাংলাদেশ`, `${c.name}, Bangladesh`)}
        </option>
      ))}
    </select>
  );
}

/** Circular countdown to the next prayer. */
function PrayerRing({ prayer, size }: { prayer: Prayer; size: number }) {
  const { t, lang } = useLang();
  const r = 78;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, prayer.phaseProgress));
  const rem = 1 - p;
  const angle = p * 2 * Math.PI - Math.PI / 2;
  const ph = prayer.phase;
  const up = prayer.upcoming;
  // Forbidden times draw the ring in a warm warning colour.
  const tone = ph?.forbidden ? "#d9653b" : "var(--brand)";
  const track = ph?.forbidden ? "color-mix(in srgb, #d9653b 16%, transparent)" : "var(--brand-soft)";
  const strokeLen = rem > 0.002 ? c * rem : 0;
  const strokeOffset = -c * p;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180" className="h-full w-full" aria-hidden>
        <circle cx="90" cy="90" r={r} fill="none" stroke={track} strokeWidth="9" />
        {strokeLen > 0 && (
          <circle
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke={tone}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${strokeLen} ${c}`}
            strokeDashoffset={strokeOffset}
            transform="rotate(-90 90 90)"
            className="transition-[stroke-dasharray,stroke-dashoffset] duration-700"
          />
        )}
        <circle
          cx={90 + r * Math.cos(angle)}
          cy={90 + r * Math.sin(angle)}
          r="7.5"
          fill="var(--panel)"
          stroke={tone}
          strokeWidth="3"
        />
      </svg>
      {/* Name, countdown, then what comes next — each on one line */}
      <div className="absolute inset-[14%] flex flex-col items-center justify-center text-center">
        <p className="max-w-full truncate leading-tight font-semibold text-ink" style={{ fontSize: Math.min(15, size / 10.5) }}>
          {ph ? t(ph.bn, ph.en) : "—"}
        </p>
        <p className="mt-1 font-num leading-none font-semibold tracking-tight text-ink" style={{ fontSize: Math.round(size / 7.8) }} dir="ltr">
          {prayer.now ? remainingClock(prayer.phaseRemaining, lang) : "--:--:--"}
        </p>
        {up && <p className="mt-1.5 max-w-full truncate text-[11.5px] leading-tight text-ink-3">{t(`পরবর্তী: ${up.bn}`, `Next: ${up.en}`)}</p>}
      </div>
    </div>
  );
}

/** Hijri, Bangla and Gregorian dates, one per line. */
function DateLines({ now, className }: { now: Date | null; className?: string }) {
  const { lang } = useLang();
  if (!now) return <div className={cn("h-[66px]", className)} />;
  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="text-[15px] font-semibold text-ink">{formatHijri(now, lang)}</p>
      <p className="text-[14px] text-ink-2">{formatBanglaDate(now, lang)}</p>
      <p className="text-[13.5px] text-ink-3">{formatDate(now.toISOString(), lang, { month: "long", weekday: "long" })}</p>
    </div>
  );
}

/** "এখন" + a warning pill during forbidden times, or a Jumu'ah pill on Fridays. */
function PhaseBadges({ prayer }: { prayer: Prayer }) {
  const { t } = useLang();
  const ph = prayer.phase;
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="inline-block rounded-full bg-brand-soft px-3 py-0.5 text-[12.5px] text-brand">{t("এখন", "Now")}</span>
      {ph?.forbidden && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#d9653b]/12 px-2.5 py-0.5 text-[12.5px] font-medium text-[#c4552d]">
          <Ban className="h-3.5 w-3.5" />
          {t("নামাজ নিষেধ", "No prayer")}
        </span>
      )}
      {!ph?.forbidden && prayer.friday && (
        <span className="inline-block rounded-full bg-gold-soft px-3 py-0.5 text-[12.5px] font-medium text-gold">{t("জুমার দিন", "Jumu'ah day")}</span>
      )}
    </div>
  );
}

function MobilePrayer({ prayer }: { prayer: Prayer }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const ph = prayer.phase;
  return (
    <div className="lg:hidden">
      {/* Waqt + city beside the ring; notice and dates run full width underneath */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <PhaseBadges prayer={prayer} />
          <p className="mt-2.5 truncate font-heading text-[26px] leading-tight text-ink sm:text-[30px]">{ph ? t(ph.bn, ph.en) : "—"}</p>
          <p className="mt-1.5 flex items-center gap-1 text-sm text-ink-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
            <CitySelect prayer={prayer} className="min-w-0 truncate" />
          </p>
        </div>
        <PrayerRing prayer={prayer} size={136} />
      </div>
      {ph?.forbidden && (
        <p className="mt-3 text-[13px] leading-snug text-[#c4552d]">{t(ph.noticeBn ?? "", ph.noticeEn ?? "")}</p>
      )}
      <DateLines now={prayer.now} className="mt-3 leading-snug" />

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex h-9 items-center gap-1.5 rounded-full bg-brand-soft px-4 text-[13px] font-medium text-brand"
        >
          {open ? t("লুকান", "Hide") : t("আজকের সব ওয়াক্ত", "All prayer times")}
          <ChevronsUpDown className="h-4 w-4" />
        </button>
      </div>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <PrayerList prayer={prayer} className="mt-3" />
      </motion.div>
    </div>
  );
}

function PrayerList({ prayer, className }: { prayer: Prayer; className?: string }) {
  const { t, lang } = useLang();
  return (
    <ul className={cn("space-y-1 rounded-2xl bg-panel/80 p-2", className)}>
      {FIVE.map((name) => {
        const on = prayer.current === name;
        const Icon = PRAYER_ICON[name];
        const label = prayerLabel(name, prayer.friday);
        return (
          <li key={name} className={cn("flex items-center justify-between rounded-xl px-4 py-2.5 text-[15px]", on ? "bg-brand text-white" : "text-ink")}>
            <span className="flex items-center gap-2.5">
              <Icon className={cn("h-4 w-4", on ? "text-white" : "text-brand")} />
              {t(label.bn, label.en)}
            </span>
            <span className="font-num" dir="ltr">
              {prayer.times ? num(to12h(prayer.times[name]), lang) : "--:--"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function DateCard({ prayer }: { prayer: Prayer }) {
  const { t, lang } = useLang();
  const now = useNow(30_000);
  const ph = prayer.phase;
  return (
    <div className="glass-card relative overflow-hidden p-6">
      <MosqueScene className="pointer-events-none absolute end-0 bottom-0 h-40 w-64 text-brand-tint" />
      <div className="relative flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-icon-bg text-brand">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <CitySelect prayer={prayer} className="text-[15px] text-ink-2" />
          <p className="mt-0.5 font-num text-xl font-semibold text-ink">{now ? formatTime(now.toISOString(), lang) : "--:--"}</p>
        </div>
      </div>
      <div className="relative mt-6 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-icon-bg text-brand">
          <CalendarDays className="h-5 w-5" />
        </span>
        <DateLines now={now} />
      </div>
      {(ph?.forbidden || prayer.friday) && (
        <div className="relative mt-5">
          <PhaseBadges prayer={prayer} />
          {ph?.forbidden && <p className="mt-1.5 max-w-[16rem] text-[12.5px] leading-snug text-[#c4552d]">{t(ph.noticeBn ?? "", ph.noticeEn ?? "")}</p>}
        </div>
      )}
    </div>
  );
}

function QuickMenu() {
  const { t } = useLang();
  const { openMore } = useShell();
  const tile =
    "tap group flex flex-col items-center gap-2.5 rounded-2xl px-1 py-2 text-center transition active:scale-95";
  return (
    <nav
      aria-label={t("দ্রুত প্রবেশ", "Quick access")}
      className="mx-auto mt-8 max-w-[940px] lg:glass-card lg:mt-6 lg:px-4 lg:py-4"
    >
      <ul className="grid grid-cols-4 gap-y-5 lg:grid-cols-8">
        {QUICK_LINKS.map((l) => (
          <li key={l.href}>
            <FeatureLink link={l} className={tile}>
              <ToneIcon
                link={l}
                size="lg"
                className="transition group-hover:-translate-y-0.5"
              />
              <span className="text-[13px] sm:text-[14px] leading-snug text-ink">
                {t(l.bn, l.en)}
              </span>
            </FeatureLink>
          </li>
        ))}
        <li>
          <Link href="/more" className={cn(tile, "w-full")}>
            <ToneIcon
              link={{ icon: Grid2x2, tone: "#417360" }}
              size="lg"
              className="transition group-hover:-translate-y-0.5"
            />
            <span className="text-[13px] sm:text-[14px] leading-snug text-ink">
              {t("সব ফিচার", "All features")}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function LiveBanner({ live }: { live: LiveStatus }) {
  const { t } = useLang();
  return (
    <Link
      href={LINKS.live.href}
      className="mx-auto mt-6 flex max-w-[940px] items-center gap-3 rounded-2xl border border-live/30 bg-live/10 p-3 pe-4"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-live text-white">
        <span className="absolute inset-0 animate-ping rounded-full bg-live/40" />
        <Radio className="relative h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-live">
          {t("এখন সরাসরি চলছে", "Live now")}
        </span>
        <span className="block truncate text-[15px] text-ink">
          {live.title}
        </span>
      </span>
      <span className="rounded-full bg-live px-4 py-2 text-sm font-medium text-white">
        {t("শুনুন", "Listen")}
      </span>
    </Link>
  );
}

/** Rub el hizb: two squares, one turned 45°, centred on (x, y). */
function IslamicStar({
  x,
  y,
  r,
  className,
}: {
  x: number;
  y: number;
  r: number;
  className?: string;
}) {
  const sq = (rot: number) =>
    [0, 1, 2, 3]
      .map((i) => {
        const a = rot + (i * Math.PI) / 2;
        return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`;
      })
      .join(" ");
  return (
    <g className={className}>
      <polygon points={sq(0)} />
      <polygon points={sq(Math.PI / 4)} />
    </g>
  );
}

/** Soft sky, clouds and hills behind the hero, with faint Islamic stars. */
function Scenery() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-canvas" />
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 760"
      >
        <g fill="var(--panel)" opacity="0.9">
          <Cloud x={120} y={250} s={1.1} />
          <Cloud x={560} y={90} s={0.8} />
          <Cloud x={1180} y={180} s={1.2} />
          <Cloud x={1320} y={260} s={0.9} />
        </g>
        <g
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          <IslamicStar x={1215} y={214} r={13} className="hero-twinkle" />
          <IslamicStar
            x={1290}
            y={176}
            r={8}
            className="hero-twinkle hero-delay-2"
          />
          <IslamicStar
            x={226}
            y={140}
            r={10}
            className="hero-twinkle hero-delay-1"
          />
          <IslamicStar
            x={136}
            y={190}
            r={8}
            className="hero-twinkle hero-delay-3"
          />
        </g>
        <path
          d="M1262 236 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22z"
          fill="var(--gold)"
          className="hero-twinkle hero-delay-1"
        />
        <path
          d="M0 640 C 200 560 360 600 520 620 S 860 560 1040 600 S 1320 620 1440 580 L1440 760 L0 760Z"
          fill="var(--brand-soft)"
          opacity="0.7"
        />
        <path
          d="M0 690 C 240 640 420 680 640 690 S 1020 650 1220 680 S 1380 690 1440 670 L1440 760 L0 760Z"
          fill="var(--canvas)"
        />
      </svg>

      <style>{`
        .hero-twinkle { transform-box: fill-box; transform-origin: center; animation: hero-twinkle 5s ease-in-out infinite }
        @keyframes hero-twinkle { 0%, 100% { opacity: .12; transform: scale(.9) rotate(0deg) } 50% { opacity: .32; transform: scale(1.05) rotate(20deg) } }
        .hero-delay-1 { animation-delay: -1.3s } .hero-delay-2 { animation-delay: -2.6s } .hero-delay-3 { animation-delay: -3.9s }

        .shaykh-3d { --nm-top: color-mix(in srgb, var(--brand) 80%, white); --nm-mid: var(--brand-strong); --nm-low: color-mix(in srgb, var(--brand-strong) 72%, black); --nm-side: color-mix(in srgb, var(--brand-strong) 55%, black);
          filter: drop-shadow(0 1px 0 var(--nm-side)) drop-shadow(0 1px 0 var(--nm-side)) drop-shadow(0 1px 0 var(--nm-side)) drop-shadow(0 12px 16px rgba(18, 48, 36, .22)) }
        .dark .shaykh-3d { --nm-top: color-mix(in srgb, var(--brand) 30%, white); --nm-mid: color-mix(in srgb, var(--brand) 70%, white); --nm-low: var(--brand); --nm-side: color-mix(in srgb, var(--brand) 45%, black) }
        .shaykh-word { background: linear-gradient(180deg, var(--nm-top) 0%, var(--nm-mid) 52%, var(--nm-low) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; padding-block: .08em }
        .name-glow { background: radial-gradient(closest-side, color-mix(in srgb, var(--gold) 16%, transparent), color-mix(in srgb, var(--brand) 6%, transparent) 60%, transparent); filter: blur(8px) }
        .streak-line { background: linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent) }
        .streak-flare { position: absolute; top: 50%; left: 0; width: 110px; height: 7px; margin-top: -3.5px; border-radius: 9999px; opacity: 0;
          background: radial-gradient(closest-side, #fff, color-mix(in srgb, var(--gold-light) 80%, transparent) 45%, transparent); filter: blur(.6px);
          animation: streak-run 4.8s cubic-bezier(.45,0,.2,1) 2.4s infinite }
        @keyframes streak-run { 0% { left: -8%; opacity: 0 } 12% { opacity: 1 } 80% { opacity: 1 } 100% { left: 92%; opacity: 0 } }
        @media (prefers-reduced-motion: reduce) {
          .hero-twinkle, .streak-flare { animation: none }
        }
      `}</style>
    </div>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="70" ry="22" />
      <ellipse cx="-28" cy="-12" rx="30" ry="22" />
      <ellipse cx="16" cy="-20" rx="36" ry="28" />
    </g>
  );
}

/** Mosque skyline silhouette used inside the date card. */
function MosqueScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 160"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <circle cx="200" cy="40" r="30" opacity="0.25" />
      <g opacity="0.55">
        <rect x="30" y="70" width="6" height="90" />
        <path d="M33 52 l5 18 h-10z" />
        <rect x="220" y="60" width="7" height="100" />
        <path d="M223.5 40 l6 20 h-12z" />
        <path d="M70 160 v-50 q50 -55 100 0 v50z" />
        <path d="M120 70 l3 -10 l3 10z" />
        <path d="M50 160 v-30 q20 -22 40 0 v30z" />
        <path d="M150 160 v-30 q20 -22 40 0 v30z" />
        <rect x="40" y="140" width="190" height="20" />
      </g>
    </svg>
  );
}

/* ── Recent talks ───────────────────────────────────────────── */

// Rounded so server and client render identical style strings.
const BARS = Array.from(
  { length: 64 },
  (_, i) =>
    Math.round(
      (0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))) * 1000,
    ) / 1000,
);

/** Recent talks: the latest one as a big player with a visualiser, the rest below. */
function RecentBoyans({ boyans }: { boyans: Boyan[] }) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const queue = useMemo(() => boyans.map(boyanTrack), [boyans]);
  const fromHere =
    !!player.current && queue.some((q) => q.id === player.current!.id);
  const featured: Track | undefined = fromHere ? player.current! : queue[0];
  const meta = boyans.find((b) => featured && boyanTrack(b).id === featured.id);
  const isFeatured = !!featured && player.isCurrent(featured.id);
  const playing = isFeatured && player.playing;
  const pct = isFeatured && player.duration ? player.time / player.duration : 0;
  const rows = boyans.slice(1, 7);

  if (!featured) return null;

  const toggle = () =>
    playing
      ? player.pause()
      : isFeatured
        ? player.toggle()
        : player.play(featured, queue);

  return (
    <div className="space-y-4">
      <div className="hero-surface relative overflow-hidden rounded-3xl p-5 sm:p-7">
        <div className="star-lattice pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="relative flex items-start gap-4">
          <button
            onClick={toggle}
            aria-label={playing ? t("থামান", "Pause") : t("চালান", "Play")}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-brand-strong shadow-[0_0_0_8px_rgba(255,255,255,0.15)] transition active:scale-95 sm:h-[72px] sm:w-[72px]"
          >
            {isFeatured && player.loading ? (
              <Equalizer active />
            ) : playing ? (
              <Pause className="h-7 w-7" fill="currentColor" />
            ) : (
              <Play className="ms-1 h-7 w-7" fill="currentColor" />
            )}
          </button>
          <button onClick={toggle} className="min-w-0 flex-1 text-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs text-white">
              {playing ? (
                <Equalizer active />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-gold-light" />
              )}
              {playing
                ? t("এখন বাজছে", "Now playing")
                : fromHere && isFeatured
                  ? t("থেমে আছে", "Paused")
                  : t("সর্বশেষ বয়ান", "Latest talk")}
            </span>
            <span className="mt-2 line-clamp-2 block text-[19px] leading-snug font-semibold text-white sm:text-[22px]">
              {featured.title}
            </span>
            <span className="mt-1 block truncate text-sm text-white/75">
              {[
                shortSpeaker(meta?.speaker || featured.subtitle || ""),
                meta?.category,
                meta && formatDate(meta.uploadDate, lang),
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </button>
        </div>

        {/* Visualiser doubles as the seek bar */}
        <button
          dir="ltr"
          aria-label={t("অগ্রগতি", "Seek")}
          onClick={(e) => {
            if (!isFeatured || !player.duration) return;
            const r = e.currentTarget.getBoundingClientRect();
            player.seek(((e.clientX - r.left) / r.width) * player.duration);
          }}
          className="relative mt-6 flex h-16 w-full items-center gap-[3px] sm:h-20"
        >
          {BARS.map((h, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 origin-center rounded-full transition-colors",
                i / BARS.length < pct ? "bg-white" : "bg-white/30",
                i % 2 && "max-sm:hidden",
              )}
              style={{
                height: `${h * 100}%`,
                animation: playing
                  ? `wave 1.1s ${(i % 7) * 0.09}s ease-in-out infinite alternate`
                  : undefined,
              }}
            />
          ))}
        </button>

        <div
          className="relative mt-4 flex items-center justify-between gap-3"
          dir="ltr"
        >
          <span className="font-num text-sm whitespace-nowrap text-white/80 sm:w-28">
            {clock(isFeatured ? player.time : 0)} /{" "}
            {clock(isFeatured ? player.duration : 0)}
          </span>
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              aria-label={t("আগের", "Previous")}
              onClick={player.prev}
              disabled={!isFeatured}
              className="p-2 text-white/80 hover:text-white disabled:opacity-40"
            >
              <SkipBack className="h-5 w-5" fill="currentColor" />
            </button>
            <button
              aria-label={t("পেছনে ১০ সেকেন্ড", "Back 10s")}
              onClick={() => player.skip(-10)}
              disabled={!isFeatured}
              className="p-2 text-white/80 hover:text-white disabled:opacity-40"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              aria-label={t("সামনে ১০ সেকেন্ড", "Forward 10s")}
              onClick={() => player.skip(10)}
              disabled={!isFeatured}
              className="p-2 text-white/80 hover:text-white disabled:opacity-40"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              aria-label={t("পরের", "Next")}
              onClick={player.next}
              disabled={!isFeatured}
              className="p-2 text-white/80 hover:text-white disabled:opacity-40"
            >
              <SkipForward className="h-5 w-5" fill="currentColor" />
            </button>
          </div>
          <span className="hidden w-28 sm:block" />
        </div>
        <style>{`@keyframes wave{0%{transform:scaleY(.45)}100%{transform:scaleY(1)}}`}</style>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((b, i) => {
          const track = queue[i + 1];
          const current = player.isCurrent(track.id);
          const on = current && player.playing;
          return (
            <li key={b.id}>
              <button
                onClick={() =>
                  on ? player.pause() : player.play(track, queue)
                }
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-start transition",
                  current
                    ? "border-brand/40 bg-brand-soft"
                    : "border-line bg-panel hover:border-brand/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    on ? "bg-brand text-white" : "bg-icon-bg text-brand",
                  )}
                >
                  {on ? (
                    <Equalizer active />
                  ) : (
                    <Play className="ms-0.5 h-4 w-4" fill="currentColor" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-[15.5px] text-ink">
                    {b.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-ink-3">
                    {b.category || "General"} · {formatDate(b.uploadDate, lang)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Quote carousel ───────────────────────────────────────────── */

function QuoteCarousel({ malfuz }: { malfuz: Malfuz[] }) {
  const { t, lang } = useLang();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % malfuz.length), 8000);
    return () => clearInterval(id);
  }, [malfuz.length]);
  const m = malfuz[i];
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[160px_1fr] md:gap-10">
      <svg
        viewBox="0 0 120 100"
        className="h-16 w-20 text-brand-tint md:h-28 md:w-36 rtl:-scale-x-100"
        fill="currentColor"
        aria-hidden
      >
        <path d="M8 96 V58 C8 26 22 8 50 4 v18 C34 26 28 36 28 50 h22 v46z M68 96 V58 C68 26 82 8 110 4 v18 C94 26 88 36 88 50 h22 v46z" />
      </svg>
      <div>
        <div className="mb-5 flex gap-2">
          {malfuz.map((x, k) => (
            <button
              key={x.id}
              onClick={() => setI(k)}
              aria-label={t(`মালফুয ${num(k + 1, lang)}`, `Saying ${k + 1}`)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                k === i ? "w-6 bg-brand" : "w-2.5 bg-line",
              )}
            />
          ))}
        </div>
        <motion.blockquote
          key={m.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="line-clamp-6 text-[18px] leading-[1.9] text-ink sm:text-[21px]">
            {m.text}
          </p>
          <footer className="mt-4 text-[15px] text-ink-2 italic">
            — {m.author}
          </footer>
        </motion.blockquote>
        <Link
          href={LINKS.malfuzat.href}
          className="mt-5 inline-block text-[15px] font-medium text-brand hover:underline"
        >
          {t("সব মালফুযাত পড়ুন", "Read all sayings")}
        </Link>
      </div>
    </div>
  );
}

/* ── Media: the app's four multimedia cards ─────────────────── */

const MEDIA: {
  link: NavLink;
  bn: string;
  en: string;
  sub: [string, string];
  count: keyof HomeData["counts"];
}[] = [
  {
    link: LINKS.boyan,
    bn: "বয়ান",
    en: "Boyan",
    sub: ["ওয়াজ শুনুন", "Listen to waz"],
    count: "boyan",
  },
  {
    link: LINKS.clips,
    bn: "সংক্ষিপ্ত ক্লিপ",
    en: "Short clips",
    sub: ["হাইলাইটস", "Highlights"],
    count: "clip",
  },
  {
    link: LINKS.nasheed,
    bn: "হামদ ও নাত",
    en: "Hamd & Naat",
    sub: ["ইসলামিক নাশিদ", "Islamic nasheeds"],
    count: "nasheed",
  },
  {
    link: LINKS.library,
    bn: "বই ও কিতাব",
    en: "Books",
    sub: ["ইসলামিক বই", "Islamic books"],
    count: "book",
  },
];

/** App-style section title: gold-to-green bar + heading. */
function BarTitle({
  title,
  subtitle,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-gold to-brand" />
      <div className="min-w-0">
        <h2 className="font-heading text-[22px] leading-tight font-bold text-ink sm:text-[26px]">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-3">{subtitle}</p>}
      </div>
    </div>
  );
}

function MediaSection({ data }: { data: HomeData }) {
  const { t, lang } = useLang();
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Reveal>
          <BarTitle
            title={t("মিডিয়া", "Media")}
            subtitle={t("দেখুন ও শুনুন", "Watch & listen")}
          />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {MEDIA.map((m) => {
              const n = data.counts?.[m.count] ?? 0;
              return (
                <li key={m.link.href}>
                  <Link
                    href={m.link.href}
                    className="group flex h-full flex-col justify-between gap-5 rounded-2xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_30px_-18px_rgba(65,115,96,0.55)] active:scale-[0.98] sm:p-5"
                  >
                    <span className="flex items-start justify-between">
                      <span
                        className="tone flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                        style={{ ["--tone" as string]: m.link.tone }}
                      >
                        <m.link.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </span>
                      {n > 0 && (
                        <span className="rounded-full bg-panel-2 px-2 py-0.5 font-num text-xs text-ink-3">
                          {num(n, lang)}
                        </span>
                      )}
                    </span>
                    <span>
                      <span className="block text-[16.5px] font-semibold text-ink group-hover:text-brand sm:text-lg">
                        {t(m.bn, m.en)}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-ink-3">
                        {t(...m.sub)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal>
          <BarTitle
            className="mt-12"
            title={t("সাম্প্রতিক বয়ান", "Recent talks")}
            subtitle={t(
              "সর্বশেষ বয়ানটি চাপলেই শুরু হবে",
              "Tap the latest talk to start listening",
            )}
          />
          <RecentBoyans boyans={data.boyans} />
          <ViewAll
            href={LINKS.boyan.href}
            label={t(
              "সব বয়ান শুনুন ও ডাউনলোড করুন",
              "Listen to & download all talks",
            )}
          />
        </Reveal>
      </Container>
    </section>
  );
}

/* ── App download ─────────────────────────────────────────────── */

function PhoneMockup3D() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const chips: {
    bn: string;
    en: string;
    icon: LucideIcon;
    pos: string;
    delay: number;
  }[] = [
    {
      bn: "নামাজের সময়",
      en: "Prayer times",
      icon: Clock,
      pos: "top-10 end-[calc(100%-12px)] sm:end-full sm:me-4",
      delay: 0,
    },
    {
      bn: "কিবলা",
      en: "Qibla",
      icon: Compass,
      pos: "top-48 end-[calc(100%-8px)] sm:end-full sm:me-5",
      delay: 0.6,
    },
    {
      bn: "তাসবীহ",
      en: "Tasbeeh",
      icon: Sparkles,
      pos: "bottom-16 end-[calc(100%-12px)] sm:end-full sm:me-4",
      delay: 1.2,
    },
    {
      bn: "অফলাইন বয়ান",
      en: "Offline talks",
      icon: Headphones,
      pos: "top-20 start-[calc(100%-12px)] sm:start-full sm:ms-4",
      delay: 0.9,
    },
    {
      bn: "আযান-অ্যালার্ম",
      en: "Adhan alarm",
      icon: Bell,
      pos: "bottom-32 start-[calc(100%-8px)] sm:start-full sm:ms-5",
      delay: 1.5,
    },
  ];

  return (
    <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center py-8 sm:py-12">
      {/* 1. Ambient Backdrop Rings & Glows */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        {/* Soft emerald radial aura */}
        <div className="h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-brand/25 via-brand/10 to-transparent blur-3xl dark:from-brand/40 dark:via-brand/15" />
        {/* Outer orbital decorative ring */}
        <div className="absolute h-[430px] w-[430px] rounded-full border border-dashed border-brand/25 animate-geometric dark:border-brand/20" />
        {/* Middle accent ring */}
        <div className="absolute h-[340px] w-[340px] rounded-full border border-brand/20 dark:border-white/10" />
        {/* Inner subtle glow ring */}
        <div className="absolute h-[260px] w-[260px] rounded-full bg-brand-soft/40 blur-sm dark:bg-brand-soft/10" />
      </div>

      {/* 2. Floating Phone Stage (Upright & Straight) */}
      <div className="relative z-10">
        {/* Ground Depth Contact Shadow */}
        <div
          className="pointer-events-none absolute -bottom-8 left-1/2 h-9 w-[78%] -translate-x-1/2 rounded-full bg-black/35 blur-2xl dark:bg-black/75"
          aria-hidden="true"
        />

        {/* Upright Motion Device */}
        <motion.div
          className="relative cursor-pointer select-none"
          animate={
            reduce
              ? undefined
              : {
                  y: [-7, 7, -7],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.025,
            y: -4,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
        >
          {/* Hardware Buttons - Left Edge */}
          <span
            className="absolute -start-[3px] top-[95px] h-[18px] w-[3.5px] rounded-s-sm bg-gradient-to-b from-[#4a524e] to-[#252a27] shadow-sm"
            aria-hidden="true"
          />
          <span
            className="absolute -start-[3px] top-[128px] h-[38px] w-[3.5px] rounded-s-sm bg-gradient-to-b from-[#4a524e] to-[#252a27] shadow-sm"
            aria-hidden="true"
          />
          <span
            className="absolute -start-[3px] top-[174px] h-[38px] w-[3.5px] rounded-s-sm bg-gradient-to-b from-[#4a524e] to-[#252a27] shadow-sm"
            aria-hidden="true"
          />

          {/* Hardware Button - Right Edge (Power/Side Button) */}
          <span
            className="absolute -end-[3.5px] top-[135px] h-[52px] w-[3.5px] rounded-e-sm bg-gradient-to-b from-[#4a524e] to-[#252a27] shadow-sm"
            aria-hidden="true"
          />

          {/* Phone Outer Chassis with Premium Upright Bezel & Symmetrical Shadow */}
          <div
            className="relative w-[255px] rounded-[48px] bg-[#121513] p-[8px] sm:w-[285px] sm:rounded-[52px] sm:p-[9px]"
            style={{
              boxShadow: `
                0 0 0 1px rgba(255, 255, 255, 0.12),
                0 0 0 3px #232926,
                0 0 0 4px #121513,
                0 24px 60px -12px rgba(0, 0, 0, 0.38),
                0 12px 28px -8px rgba(20, 68, 52, 0.22),
                inset 0 1.5px 2px rgba(255, 255, 255, 0.4),
                inset 0 -1.5px 2px rgba(0, 0, 0, 0.75)
              `,
            }}
          >
            {/* Top Speaker Ear-piece */}
            <div className="absolute top-[4px] left-1/2 h-[3.5px] w-14 -translate-x-1/2 rounded-full border-t border-black/80 bg-[#080a09]" />

            {/* Inner Screen Display Bed */}
            <div className="relative overflow-hidden rounded-[40px] bg-black sm:rounded-[43px]">
              <Image
                src="/home.png"
                alt={t("islahbd অ্যাপের হোম স্ক্রিন", "islahbd app home screen")}
                width={1206}
                height={2622}
                priority
                className="block h-auto w-full object-cover"
              />

              {/* Glass Specular Reflection Glare Overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[40px] sm:rounded-[43px]"
                aria-hidden="true"
              >
                <div
                  className="absolute -inset-full opacity-55 dark:opacity-30"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 38%, rgba(255,255,255,0.2) 48%, rgba(255,255,255,0.05) 54%, transparent 64%)",
                  }}
                />
                {/* Bezel Inner Ring Highlight */}
                <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/15 sm:rounded-[43px]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Floating 3D Feature Chips Orbiting the Phone */}
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <motion.div
              key={chip.en}
              className={cn(
                "absolute z-30 flex items-center gap-2.5 rounded-2xl border border-brand/25 bg-panel/95 px-3.5 py-2.5 shadow-[0_12px_28px_-4px_rgba(0,0,0,0.12),0_4px_10px_-2px_rgba(0,0,0,0.06)] backdrop-blur-xl transition hover:border-brand/50 dark:border-white/15 dark:bg-[#181d1a]/95 dark:shadow-[0_14px_32px_-4px_rgba(0,0,0,0.7)]",
                chip.pos,
              )}
              animate={
                reduce
                  ? undefined
                  : {
                      y: [-4, 4, -4],
                    }
              }
              transition={{
                duration: 4.8,
                delay: chip.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.08, y: -2 }}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/30 dark:from-brand/30 dark:to-brand/10 dark:text-emerald-300 dark:ring-brand/40">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[13px] font-semibold tracking-tight text-ink whitespace-nowrap">
                {t(chip.bn, chip.en)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function AppSection() {
  const { t } = useLang();
  return (
    <section className="overflow-hidden bg-canvas-2 py-14 sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-heading text-[26px] leading-snug text-ink sm:text-[34px]">
            {t("অ্যাপ ডাউনলোড করুন", "Download the app")}
            <br />
            <span className="text-brand">
              {t(
                "islahbd — আপনার ইসলামিক সঙ্গী",
                "islahbd — your Islamic companion",
              )}
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink-2">
            {t(
              "আযান-অ্যালার্ম, অফলাইনে বয়ান শোনা, কিবলা, তাসবীহ, হোম-স্ক্রিন উইজেট আর লাইভ মজলিসের নোটিফিকেশন — সব পাবেন অ্যাপে।",
              "Adhan alarms, offline talks, qibla, tasbeeh, home-screen widgets and live majlis alerts — all in the app.",
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <StoreButton
              href={PLAY_STORE_URL}
              top="GET IT ON"
              name="Google Play"
              icon={<PlayLogo />}
            />
            <StoreButton
              href={APP_STORE_URL}
              top="Download on the"
              name="App Store"
              icon={<AppleLogo />}
            />
          </div>
        </Reveal>

        <Reveal>
          <PhoneMockup3D />
        </Reveal>
      </Container>
    </section>
  );
}

function StoreButton({
  href,
  top,
  name,
  icon,
}: {
  href: string;
  top: string;
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      dir="ltr"
      className="flex h-[60px] items-center gap-3 rounded-2xl border border-line bg-panel px-5 transition hover:border-brand/40"
    >
      {icon}
      <span className="leading-tight">
        <span className="block text-[11px] text-ink-2">{top}</span>
        <span className="block text-[15px] font-semibold text-ink">{name}</span>
      </span>
    </a>
  );
}

const PlayLogo = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
    <path
      fill="#34A853"
      d="M3.6 1.8 13.4 12l-9.8 10.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2Z"
    />
    <path
      fill="#FBBC04"
      d="m16.8 8.6-3.4 3.4 3.4 3.4 3.8-2.2c.9-.5.9-1.9 0-2.4l-3.8-2.2Z"
    />
    <path
      fill="#4285F4"
      d="M3.6 1.8c.3-.2.8-.2 1.2 0l12 6.8-3.4 3.4L3.6 1.8Z"
    />
    <path
      fill="#EA4335"
      d="m13.4 12 3.4 3.4-12 6.8c-.4.2-.9.2-1.2 0L13.4 12Z"
    />
  </svg>
);

const AppleLogo = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-7 w-7 text-ink"
    fill="currentColor"
    aria-hidden
  >
    <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.4 1-1.4 1.3-2.7 1.4-2.8-.1 0-2.7-1-2.7-4.2ZM14 5.3c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
  </svg>
);

/* ── Support / sadaqah jariyah ────────────────────────────────── */

function SupportSection() {
  const { t } = useLang();
  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gold-soft/85 p-7 text-center sm:p-12 shadow-sm dark:border-gold/25 dark:bg-gold-soft/20">
            {/* Subtle background ambient glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl dark:bg-gold/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl dark:bg-brand/10" />

            <div className="relative z-10">
              {/* Icon badge */}
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-panel text-gold shadow-sm ring-1 ring-gold/25 dark:bg-panel dark:text-gold dark:ring-white/10">
                <HeartHandshake className="h-7 w-7" />
              </span>

              {/* Title */}
              <h2 className="mt-4 font-heading text-2xl font-bold text-ink sm:text-3xl">
                {t("আমাদের ফিকির ও দোয়া", "Our Aspiration & Dua")}
              </h2>

              {/* Body text */}
              <div className="mx-auto mt-4 max-w-2xl space-y-3.5 text-[16px] leading-[1.9] text-ink-2 sm:text-[17.5px]">
                <p>
                  {t(
                    "দ্বীনি এ খেদমতে অংশগ্রহণ করার লক্ষ্যে আমরা নিজেরা সদস্য হওয়ার ও নিজেদের আপনজন প্রিয়জনদেরকে সদস্য করার ফিকির করবো ইনশাআল্লাহ।",
                    "To participate in this religious service, we intend to become members ourselves and encourage our loved ones to become members, InshaAllah.",
                  )}
                </p>
                <p>
                  {t(
                    "সেই সাথে দোয়া করবো, মহান আল্লাহ রাব্বুল আলামীন নিজ দয়া ও অনুগ্রহে খুব বেশি কবুল করুন এবং সফল করুন। আমীন।",
                    "Along with that, we pray that Almighty Allah, in His mercy and grace, abundantly accepts and grants success. Ameen.",
                  )}
                </p>
              </div>

              {/* Action Buttons: Highlighting Lifetime Member */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href={LINKS.member.href}
                  className="inline-flex h-12 items-center gap-2.5 rounded-2xl bg-brand px-7 text-[15px] font-semibold text-white shadow-md transition hover:bg-brand-strong hover:shadow-lg"
                >
                  <HeartHandshake className="h-4 w-4" />
                  {t("আজীবন সদস্য হোন", "Become a lifetime member")}
                </Link>
                <Link
                  href={LINKS.about.href}
                  className="inline-flex h-12 items-center rounded-2xl border border-line bg-panel px-6 text-[15px] font-medium text-ink transition hover:border-brand/40 hover:bg-panel-2"
                >
                  {t("মাদরাসা পরিচিতি", "About the madrasa")}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

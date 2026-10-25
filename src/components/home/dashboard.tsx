"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  ChevronsUpDown,
  Grid2x2,
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
import { clock, formatDate, formatHijri, formatTime, num, shortSpeaker } from "@/lib/format";
import { PRAYER_BN, to12h, useNow, usePrayer } from "@/lib/use-prayer";
import { APP_STORE_URL, BD_CITIES, PLAY_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
function Reveal({ className, children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) {
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

const Container = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8", className)}>{children}</div>
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
const PRAYER_ICON: Record<string, LucideIcon> = { Fajr: Sunrise, Sunrise, Dhuhr: Sun, Asr: Sun, Maghrib: Sunset, Isha: Moon };

type Prayer = ReturnType<typeof usePrayer>;

function Hero({ live }: { live: LiveStatus | null }) {
  const { t } = useLang();
  const prayer = usePrayer();

  return (
    <section className="relative overflow-hidden">
      <Scenery />
      <Container className="relative pt-6 pb-12 sm:pt-12 sm:pb-20">
        {/* Hero Motion Graphic Headline & Shaykh Accreditation */}
        <div className="mx-auto max-w-4xl text-center px-3 pb-6 sm:pb-10">
          {/* Top Line: Kholifa accreditation badge with animated ambient glow */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft/90 px-4 py-1.5 text-xs sm:text-sm font-medium text-brand shadow-sm backdrop-blur-md dark:border-brand/35 dark:bg-brand-soft/25"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="tracking-wide">
              {t(
                "তরজুমানে আকাবির হযরত মাওলানা শাহ আব্দুল মতিন (রহ.)-এর খলিফা",
                "Khalifah of Tarjuman-e-Akabir Hazrat Mawlana Shah Abdul Matin (Rah.)"
              )}
            </span>
          </motion.div>

          {/* Big Revered Scholar Name: হযরত মাওলানা তৈয়্যব আশরাফ সাহেব দামাত বারাকাতুহুম */}
          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[50px] leading-[1.28] sm:leading-[1.22]"
          >
            {t(
              "হযরত মাওলানা তৈয়্যব আশরাফ সাহেব দামাত বারাকাতুহুম",
              "Hazrat Mawlana Tayeb Ashraf Saheb Damat Barakatuhum"
            )}
          </motion.h1>

          {/* Primary Platform Headline: বয়ান, কুরআন, দোয়া ও আমলের ঠিকানা */}
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
            className="mx-auto mt-3.5 sm:mt-5 font-heading text-xl font-semibold text-ink/90 sm:text-2xl md:text-3xl max-w-2xl"
          >
            {t("বয়ান, কুরআন, দোয়া ও আমলের ঠিকানা", "Sanctuary of Talks, Quran, Duas & Daily Amal")}
          </motion.h2>

          {/* Complementary Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease: "easeOut" }}
            className="mx-auto mt-2.5 sm:mt-3 max-w-xl text-sm sm:text-base text-ink-2 leading-relaxed"
          >
            {t(
              "হযরত মাওলানা তৈয়্যব আশরাফ সাহেব দা.বা.-এর ইসলাহী বয়ান, আত্মশুদ্ধি ও দ্বীনি খেদমত",
              "Islahi talks, spiritual guidance and Islamic service of Hazrat Mawlana Tayeb Ashraf Saheb (db)"
            )}
          </motion.p>
        </div>

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
      </Container>
    </section>
  );
}

function remainingClock(sec: number, lang: Parameters<typeof num>[1]) {
  const parts = [Math.floor(sec / 3600), Math.floor((sec % 3600) / 60), sec % 60];
  return num(parts.map((v) => String(v).padStart(2, "0")).join(":"), lang);
}

function CitySelect({ prayer, className }: { prayer: Prayer; className?: string }) {
  const { t } = useLang();
  return (
    <select
      value={prayer.city.name}
      onChange={(e) => prayer.setCity(BD_CITIES.find((c) => c.name === e.target.value) ?? BD_CITIES[0])}
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
  const r = 70;
  const c = 2 * Math.PI * r;
  const angle = prayer.progress * 2 * Math.PI - Math.PI / 2;
  const name = prayer.current || prayer.next?.name || "";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180" className="h-full w-full" aria-hidden>
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--brand-soft)" strokeWidth="14" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${c * (1 - prayer.progress)} ${c}`}
          strokeDashoffset={-c * prayer.progress}
          transform="rotate(-90 90 90)"
          className="transition-[stroke-dasharray,stroke-dashoffset] duration-700"
        />
        <circle cx={90 + r * Math.cos(angle)} cy={90 + r * Math.sin(angle)} r="10" fill="var(--panel)" stroke="var(--brand)" strokeWidth="3" />
        <circle cx={90 + r * Math.cos(angle)} cy={90 + r * Math.sin(angle)} r="4" fill="var(--brand)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-ink">{name ? t(PRAYER_BN[name], name) : "—"}</p>
        <p className="text-[13px] text-ink-2">
          {prayer.next ? t(`${PRAYER_BN[prayer.next.name] ?? prayer.next.name} পর্যন্ত বাকি`, `Until ${prayer.next.name}`) : t("বাকি সময়", "Remaining")}
        </p>
        <p className="mt-0.5 font-num text-xl font-medium text-ink" dir="ltr">
          {prayer.now ? remainingClock(prayer.remaining, lang) : "--:--:--"}
        </p>
      </div>
    </div>
  );
}

function MobilePrayer({ prayer }: { prayer: Prayer }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const name = prayer.current || "";
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-brand-soft px-4 py-1 text-sm text-brand">{t("এখন", "Now")}</span>
          <p className="mt-2 font-heading text-[34px] leading-none text-ink">{name ? t(PRAYER_BN[name], name) : "—"}</p>
          <p className="mt-3 flex items-center gap-1 text-sm text-ink-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
            <CitySelect prayer={prayer} />
          </p>
          <p className="mt-3 text-[15px] font-semibold text-ink">{prayer.now ? formatHijri(prayer.now, lang) : " "}</p>
          <p className="mt-1 text-sm text-ink-2">{prayer.now ? formatDate(prayer.now.toISOString(), lang, { month: "long", weekday: "long" }) : " "}</p>
        </div>
        <PrayerRing prayer={prayer} size={148} />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t("সব ওয়াক্ত দেখুন", "Show all prayer times")}
          className="flex h-9 w-24 items-center justify-center rounded-full bg-brand-soft text-brand"
        >
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
        return (
          <li key={name} className={cn("flex items-center justify-between rounded-xl px-4 py-2.5 text-[15px]", on ? "bg-brand text-white" : "text-ink")}>
            <span className="flex items-center gap-2.5">
              <Icon className={cn("h-4 w-4", on ? "text-white" : "text-brand")} />
              {t(PRAYER_BN[name], name)}
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
  const { lang } = useLang();
  const now = useNow(30_000);
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
      <div className="relative mt-8 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-icon-bg text-brand">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[15px] text-ink-2">{now ? formatDate(now.toISOString(), lang, { month: "long", weekday: "long" }) : " "}</p>
          <p className="mt-0.5 text-xl font-semibold text-ink">{now ? formatHijri(now, lang) : " "}</p>
        </div>
      </div>
    </div>
  );
}

function QuickMenu() {
  const { t } = useLang();
  const { openMore } = useShell();
  const tile = "tap group flex flex-col items-center gap-2.5 rounded-2xl px-1 py-2 text-center transition active:scale-95";
  return (
    <nav aria-label={t("দ্রুত প্রবেশ", "Quick access")} className="mx-auto mt-8 max-w-[940px] lg:glass-card lg:mt-6 lg:px-4 lg:py-4">
      <ul className="grid grid-cols-4 gap-y-5 lg:grid-cols-8">
        {QUICK_LINKS.map((l) => (
          <li key={l.href}>
            <FeatureLink link={l} className={tile}>
              <ToneIcon link={l} size="lg" className="transition group-hover:-translate-y-0.5" />
              <span className="text-[13px] sm:text-[14px] leading-snug text-ink">{t(l.bn, l.en)}</span>
            </FeatureLink>
          </li>
        ))}
        <li>
          <Link href="/more" className={cn(tile, "w-full")}>
            <ToneIcon link={{ icon: Grid2x2, tone: "#417360" }} size="lg" className="transition group-hover:-translate-y-0.5" />
            <span className="text-[13px] sm:text-[14px] leading-snug text-ink">{t("সব ফিচার", "All features")}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function LiveBanner({ live }: { live: LiveStatus }) {
  const { t } = useLang();
  return (
    <Link href={LINKS.live.href} className="mx-auto mt-6 flex max-w-[940px] items-center gap-3 rounded-2xl border border-live/30 bg-live/10 p-3 pe-4">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-live text-white">
        <span className="absolute inset-0 animate-ping rounded-full bg-live/40" />
        <Radio className="relative h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-live">{t("এখন সরাসরি চলছে", "Live now")}</span>
        <span className="block truncate text-[15px] text-ink">{live.title}</span>
      </span>
      <span className="rounded-full bg-live px-4 py-2 text-sm font-medium text-white">{t("শুনুন", "Listen")}</span>
    </Link>
  );
}

/** Soft sky, clouds, birds and distant hills behind the hero. */
function Scenery() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--canvas-2)_0%,var(--canvas)_100%)]" />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 760">
        <g fill="var(--panel)" opacity="0.9">
          <Cloud x={120} y={250} s={1.1} />
          <Cloud x={560} y={90} s={0.8} />
          <Cloud x={1180} y={180} s={1.2} />
          <Cloud x={1320} y={260} s={0.9} />
        </g>
        <g stroke="var(--ink-3)" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.55">
          <path d="M1180 210 q8 -8 16 0 q8 -8 16 0" />
          <path d="M1230 240 q6 -6 12 0 q6 -6 12 0" />
          <path d="M1270 196 q7 -7 14 0 q7 -7 14 0" />
        </g>
        <g fill="var(--brand)">
          <path d="M486 130 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z" opacity="0.18" />
          <path d="M136 186 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z" opacity="0.15" />
          <path d="M1290 170 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" opacity="0.15" />
        </g>
        <path d="M0 640 C 200 560 360 600 520 620 S 860 560 1040 600 S 1320 620 1440 580 L1440 760 L0 760Z" fill="var(--brand-soft)" opacity="0.7" />
        <path d="M0 690 C 240 640 420 680 640 690 S 1020 650 1220 680 S 1380 690 1440 670 L1440 760 L0 760Z" fill="var(--canvas)" />
      </svg>
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
    <svg viewBox="0 0 260 160" className={className} fill="currentColor" aria-hidden>
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
const BARS = Array.from({ length: 64 }, (_, i) => Math.round((0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))) * 1000) / 1000);

/** Recent talks: the latest one as a big player with a visualiser, the rest below. */
function RecentBoyans({ boyans }: { boyans: Boyan[] }) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const queue = useMemo(() => boyans.map(boyanTrack), [boyans]);
  const fromHere = !!player.current && queue.some((q) => q.id === player.current!.id);
  const featured: Track | undefined = fromHere ? player.current! : queue[0];
  const meta = boyans.find((b) => featured && boyanTrack(b).id === featured.id);
  const isFeatured = !!featured && player.isCurrent(featured.id);
  const playing = isFeatured && player.playing;
  const pct = isFeatured && player.duration ? player.time / player.duration : 0;
  const rows = boyans.slice(1, 7);

  if (!featured) return null;

  const toggle = () => (playing ? player.pause() : isFeatured ? player.toggle() : player.play(featured, queue));

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
            {isFeatured && player.loading ? <Equalizer active /> : playing ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="ms-1 h-7 w-7" fill="currentColor" />}
          </button>
          <button onClick={toggle} className="min-w-0 flex-1 text-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs text-white">
              {playing ? <Equalizer active /> : <span className="h-1.5 w-1.5 rounded-full bg-gold-light" />}
              {playing ? t("এখন বাজছে", "Now playing") : fromHere && isFeatured ? t("থেমে আছে", "Paused") : t("সর্বশেষ বয়ান", "Latest talk")}
            </span>
            <span className="mt-2 line-clamp-2 block text-[19px] leading-snug font-semibold text-white sm:text-[22px]">{featured.title}</span>
            <span className="mt-1 block truncate text-sm text-white/75">
              {[shortSpeaker(meta?.speaker || featured.subtitle || ""), meta?.category, meta && formatDate(meta.uploadDate, lang)].filter(Boolean).join(" · ")}
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
              className={cn("flex-1 origin-center rounded-full transition-colors", i / BARS.length < pct ? "bg-white" : "bg-white/30", i % 2 && "max-sm:hidden")}
              style={{ height: `${h * 100}%`, animation: playing ? `wave 1.1s ${(i % 7) * 0.09}s ease-in-out infinite alternate` : undefined }}
            />
          ))}
        </button>

        <div className="relative mt-4 flex items-center justify-between gap-3" dir="ltr">
          <span className="font-num text-sm whitespace-nowrap text-white/80 sm:w-28">
            {clock(isFeatured ? player.time : 0)} / {clock(isFeatured ? player.duration : 0)}
          </span>
          <div className="flex items-center gap-1 sm:gap-3">
            <button aria-label={t("আগের", "Previous")} onClick={player.prev} disabled={!isFeatured} className="p-2 text-white/80 hover:text-white disabled:opacity-40">
              <SkipBack className="h-5 w-5" fill="currentColor" />
            </button>
            <button aria-label={t("পেছনে ১০ সেকেন্ড", "Back 10s")} onClick={() => player.skip(-10)} disabled={!isFeatured} className="p-2 text-white/80 hover:text-white disabled:opacity-40">
              <RotateCcw className="h-5 w-5" />
            </button>
            <button aria-label={t("সামনে ১০ সেকেন্ড", "Forward 10s")} onClick={() => player.skip(10)} disabled={!isFeatured} className="p-2 text-white/80 hover:text-white disabled:opacity-40">
              <RotateCw className="h-5 w-5" />
            </button>
            <button aria-label={t("পরের", "Next")} onClick={player.next} disabled={!isFeatured} className="p-2 text-white/80 hover:text-white disabled:opacity-40">
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
                onClick={() => (on ? player.pause() : player.play(track, queue))}
                className={cn("flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-start transition", current ? "border-brand/40 bg-brand-soft" : "border-line bg-panel hover:border-brand/40")}
              >
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", on ? "bg-brand text-white" : "bg-icon-bg text-brand")}>
                  {on ? <Equalizer active /> : <Play className="ms-0.5 h-4 w-4" fill="currentColor" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-[15.5px] text-ink">{b.title}</span>
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
      <svg viewBox="0 0 120 100" className="h-16 w-20 text-brand-tint md:h-28 md:w-36 rtl:-scale-x-100" fill="currentColor" aria-hidden>
        <path d="M8 96 V58 C8 26 22 8 50 4 v18 C34 26 28 36 28 50 h22 v46z M68 96 V58 C68 26 82 8 110 4 v18 C94 26 88 36 88 50 h22 v46z" />
      </svg>
      <div>
        <div className="mb-5 flex gap-2">
          {malfuz.map((x, k) => (
            <button
              key={x.id}
              onClick={() => setI(k)}
              aria-label={t(`মালফুয ${num(k + 1, lang)}`, `Saying ${k + 1}`)}
              className={cn("h-2.5 rounded-full transition-all", k === i ? "w-6 bg-brand" : "w-2.5 bg-line")}
            />
          ))}
        </div>
        <motion.blockquote key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="line-clamp-6 text-[18px] leading-[1.9] text-ink sm:text-[21px]">{m.text}</p>
          <footer className="mt-4 text-[15px] text-ink-2 italic">— {m.author}</footer>
        </motion.blockquote>
        <Link href={LINKS.malfuzat.href} className="mt-5 inline-block text-[15px] font-medium text-brand hover:underline">
          {t("সব মালফুযাত পড়ুন", "Read all sayings")}
        </Link>
      </div>
    </div>
  );
}

/* ── Media: the app's four multimedia cards ─────────────────── */

const MEDIA: { link: NavLink; bn: string; en: string; sub: [string, string]; count: keyof HomeData["counts"] }[] = [
  { link: LINKS.boyan, bn: "বয়ান", en: "Boyan", sub: ["ওয়াজ শুনুন", "Listen to waz"], count: "boyan" },
  { link: LINKS.clips, bn: "সংক্ষিপ্ত ক্লিপ", en: "Short clips", sub: ["হাইলাইটস", "Highlights"], count: "clip" },
  { link: LINKS.nasheed, bn: "হামদ ও নাত", en: "Hamd & Naat", sub: ["ইসলামিক নাশিদ", "Islamic nasheeds"], count: "nasheed" },
  { link: LINKS.library, bn: "বই ও কিতাব", en: "Books", sub: ["ইসলামিক বই", "Islamic books"], count: "book" },
];

/** App-style section title: gold-to-green bar + heading. */
function BarTitle({ title, subtitle, className }: { title: React.ReactNode; subtitle?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-gold to-brand" />
      <div className="min-w-0">
        <h2 className="font-heading text-[22px] leading-tight font-bold text-ink sm:text-[26px]">{title}</h2>
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
          <BarTitle title={t("মিডিয়া", "Media")} subtitle={t("দেখুন ও শুনুন", "Watch & listen")} />
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
                      <span className="tone flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12" style={{ ["--tone" as string]: m.link.tone }}>
                        <m.link.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </span>
                      {n > 0 && <span className="rounded-full bg-panel-2 px-2 py-0.5 font-num text-xs text-ink-3">{num(n, lang)}</span>}
                    </span>
                    <span>
                      <span className="block text-[16.5px] font-semibold text-ink group-hover:text-brand sm:text-lg">{t(m.bn, m.en)}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-3">{t(...m.sub)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal>
          <BarTitle className="mt-12" title={t("সাম্প্রতিক বয়ান", "Recent talks")} subtitle={t("সর্বশেষ বয়ানটি চাপলেই শুরু হবে", "Tap the latest talk to start listening")} />
          <RecentBoyans boyans={data.boyans} />
          <ViewAll href={LINKS.boyan.href} label={t("সব বয়ান শুনুন ও ডাউনলোড করুন", "Listen to & download all talks")} />
        </Reveal>
      </Container>
    </section>
  );
}

/* ── App download ─────────────────────────────────────────────── */

function AppSection() {
  const { t } = useLang();
  const chips = [
    { bn: "নামাজের সময়", en: "Prayer times", cls: "top-[6%] start-[0%]" },
    { bn: "কিবলা", en: "Qibla", cls: "top-[40%] start-[-2%]" },
    { bn: "অফলাইন বয়ান", en: "Offline talks", cls: "top-[16%] end-[-2%]" },
    { bn: "আযান-অ্যালার্ম", en: "Adhan alarm", cls: "top-[58%] end-[0%]" },
    { bn: "তাসবীহ", en: "Tasbeeh", cls: "bottom-[8%] start-[6%]" },
  ];
  return (
    <section className="overflow-hidden bg-canvas-2 py-14 sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-heading text-[26px] leading-snug text-ink sm:text-[34px]">
            {t("অ্যাপ ডাউনলোড করুন", "Download the app")}
            <br />
            <span className="text-brand">{t("islahbd — আপনার ইসলামিক সঙ্গী", "islahbd — your Islamic companion")}</span>
          </h2>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink-2">
            {t(
              "আযান-অ্যালার্ম, অফলাইনে বয়ান শোনা, কিবলা, তাসবীহ, হোম-স্ক্রিন উইজেট আর লাইভ মজলিসের নোটিফিকেশন — সব পাবেন অ্যাপে।",
              "Adhan alarms, offline talks, qibla, tasbeeh, home-screen widgets and live majlis alerts — all in the app.",
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <StoreButton href={PLAY_STORE_URL} top="GET IT ON" name="Google Play" icon={<PlayLogo />} />
            <StoreButton href={APP_STORE_URL} top="Download on the" name="App Store" icon={<AppleLogo />} />
          </div>
        </Reveal>

        <Reveal className="relative mx-auto w-full max-w-[400px]">
          <div className="absolute inset-[6%] rounded-full bg-brand-soft" />
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="relative mx-auto w-[56%] -rotate-3 rounded-[34px] border-[6px] border-[#1b1f1d] bg-[#1b1f1d] shadow-[var(--shadow-float)]">
            <Image src="/home.png" alt={t("islahbd অ্যাপের হোম স্ক্রিন", "islahbd app home screen")} width={1206} height={2622} className="rounded-3xl" />
          </div>
          {chips.map((c) => (
            <span key={c.en} className={cn("absolute rounded-xl border border-line bg-panel px-3 py-2 text-[13px] text-brand shadow-sm", c.cls)}>
              {t(c.bn, c.en)}
            </span>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function StoreButton({ href, top, name, icon }: { href: string; top: string; name: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" dir="ltr" className="flex h-[60px] items-center gap-3 rounded-2xl border border-line bg-panel px-5 transition hover:border-brand/40">
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
    <path fill="#34A853" d="M3.6 1.8 13.4 12l-9.8 10.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2Z" />
    <path fill="#FBBC04" d="m16.8 8.6-3.4 3.4 3.4 3.4 3.8-2.2c.9-.5.9-1.9 0-2.4l-3.8-2.2Z" />
    <path fill="#4285F4" d="M3.6 1.8c.3-.2.8-.2 1.2 0l12 6.8-3.4 3.4L3.6 1.8Z" />
    <path fill="#EA4335" d="m13.4 12 3.4 3.4-12 6.8c-.4.2-.9.2-1.2 0L13.4 12Z" />
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 text-ink" fill="currentColor" aria-hidden>
    <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.4 1-1.4 1.3-2.7 1.4-2.8-.1 0-2.7-1-2.7-4.2ZM14 5.3c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
  </svg>
);

/* ── Support / sadaqah jariyah ────────────────────────────────── */

function SupportSection() {
  const { t } = useLang();
  return (
    <section className="py-14 sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <Reveal className="relative mx-auto aspect-square w-full max-w-[360px]">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-[7%] rounded-full bg-panel-2" />
          <DonationBox className="absolute inset-[22%]" />
        </Reveal>
        <Reveal>
          <h2 className="font-heading text-[26px] leading-snug text-ink sm:text-[34px]">
            {t("জামেআর পাশে থাকুন — হোন সদকায়ে জারিয়ার অংশীদার", "Stand by the Jamia — be part of a sadaqah jariyah")}
          </h2>
          <p className="mt-5 text-[16.5px] leading-relaxed text-ink-2">
            {t(
              "মাদরাসা মারকাযুল ইহসানে প্রায় এক হাজার তালিবুল ইলম দ্বীনি শিক্ষা গ্রহণ করছে। ডেমরায় স্থায়ী কমপ্লেক্সের কাজ চলছে। আজীবন সদস্য হয়ে বা অনুদান দিয়ে এই খেদমতে শরিক হোন।",
              "Nearly a thousand students study at Madrasa Markazul Ihsan, and the permanent campus in Demra is being built. Join this service as a lifetime member or with a donation.",
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={LINKS.member.href} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-brand px-6 text-[15px] font-medium text-white transition hover:bg-brand-strong">
              {t("আজীবন সদস্য হোন", "Become a lifetime member")}
              <HeartHandshake className="h-4 w-4" />
            </Link>
            <Link href={LINKS.about.href} className="inline-flex h-12 items-center rounded-2xl border border-line bg-panel px-6 text-[15px] text-ink transition hover:border-brand/40">
              {t("মাদরাসা পরিচিতি", "About the madrasa")}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function DonationBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path d="M72 46c-10-14-34-8-32 10 2 14 32 30 32 30s30-16 32-30c2-18-22-24-32-10z" fill="#E5484D" />
      <circle cx="118" cy="64" r="22" fill="#F5B83D" />
      <circle cx="118" cy="64" r="15" fill="#E8A21E" />
      <text x="118" y="71" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">
        ৳
      </text>
      <rect x="24" y="96" width="152" height="18" rx="3" fill="var(--brand-tint)" />
      <rect x="34" y="114" width="132" height="70" rx="4" fill="var(--brand)" />
      <rect x="64" y="132" width="72" height="30" rx="6" fill="var(--brand-tint)" />
      <rect x="84" y="94" width="34" height="6" rx="3" fill="var(--brand-strong)" />
    </svg>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AudioLines,
  CalendarDays,
  ChevronDown,
  Clock,
  Download,
  Headphones,
  MapPin,
  Megaphone,
  Mic2,
  Music2,
  Quote,
  Radio,
  ScrollText,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import type { AmalSection, Boyan, Clip, GalleryAlbum, LiveStatus, Malfuz, Nasheed, Notice } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { Equalizer, Panel, PanelHeader, Pill, PlayButton, Segmented } from "@/components/dashboard/ui";
import { AreaChart, PillBarChart } from "@/components/dashboard/charts";
import { ALL_LINKS, LINKS } from "@/lib/nav";
import { boyanTrack, clipTrack, nasheedTrack, recordingTrack } from "@/lib/tracks";
import { formatDate, formatHijri, formatTime, num, shortSpeaker, timeAgo, youtubeThumb } from "@/lib/format";
import { PRAYER_BN, to12h, useNow, usePrayer } from "@/lib/use-prayer";
import { BD_CITIES, APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface HomeData {
  live: LiveStatus | null;
  boyans: Boyan[];
  nasheeds: Nasheed[];
  videoNasheeds: Nasheed[];
  clips: Clip[];
  malfuz: Malfuz[];
  notices: Notice[];
  amal: { id: number; section: AmalSection; title: string; itemCount: number }[];
  albums: GalleryAlbum[];
  counts: Record<"boyan" | "nasheed" | "clip" | "malfuz" | "amal" | "books" | "wallpapers" | "photos" | "notices", number>;
  growth: { month: string; total: number }[];
}

const rise = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] as const },
});

export function Dashboard({ data }: { data: HomeData }) {
  const { t, lang } = useLang();
  const now = useNow(60_000);

  return (
    <div>
      {/* Greeting row */}
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
        <motion.h1 {...rise(0)} className="text-[30px] leading-tight font-semibold tracking-tight text-ink sm:text-[40px]">
          {t("আসসালামু আলাইকুম,", "Assalamu Alaikum,")} <span className="font-normal text-ink-3">{t("স্বাগতম", "welcome")}</span>
        </motion.h1>
        <motion.div {...rise(1)} className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex h-11 items-center gap-2.5 rounded-full bg-panel px-4 text-sm text-ink">
            <CalendarDays className="h-4 w-4 text-ink-2" />
            {now ? (
              <>
                <span className="font-medium">{formatHijri(now, lang)}</span>
                <span className="text-ink-3">·</span>
                <span className="text-ink-2">{formatDate(now.toISOString(), lang, { weekday: "short", month: "long", year: undefined })}</span>
              </>
            ) : (
              <span className="skeleton h-4 w-48" />
            )}
          </span>
          <Link href={LINKS.live.href} className="inline-flex h-11 items-center gap-2 rounded-full bg-panel px-4 text-sm font-medium text-ink transition hover:bg-brand hover:text-white">
            <Radio className="h-4 w-4" />
            {t("লাইভ শুনুন", "Listen live")}
          </Link>
        </motion.div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-12">
        <motion.div {...rise(2)} className="flex flex-col gap-4 sm:gap-5 xl:col-span-3">
          <LiveCard live={data.live} />
          <NextPrayerCard />
        </motion.div>
        <motion.div {...rise(3)} className="md:col-span-2 xl:col-span-5 xl:order-none">
          <UploadChart boyans={data.boyans} />
        </motion.div>
        <motion.div {...rise(4)} className="md:col-span-2 xl:col-span-4">
          <LibraryCard data={data} />
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-12">
        <motion.div {...rise(5)} className="xl:col-span-8">
          <RecentBoyans boyans={data.boyans} />
        </motion.div>
        <motion.div {...rise(6)} className="xl:col-span-4">
          <MalfuzCard malfuz={data.malfuz} notices={data.notices} total={data.counts.notices} />
        </motion.div>
      </div>

      {/* Feature grid */}
      <FeatureGrid counts={data.counts} />

      {/* Row 3 */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <PrayerPanel />
        </div>
        <div className="xl:col-span-4">
          <AudioListPanel
            title={t("হামদ ও নাত", "Hamd & Naat")}
            subtitle={t(`${num(data.counts.nasheed, lang)}টি নাশিদ`, `${data.counts.nasheed} nasheeds`)}
            icon={Music2}
            href={LINKS.nasheed.href}
            items={data.nasheeds.map((n) => ({ track: nasheedTrack(n), meta: n.composer || n.lyricist || "" }))}
          />
        </div>
        <div className="md:col-span-2 xl:col-span-4">
          <AudioListPanel
            title={t("শর্ট ক্লিপ", "Short Clips")}
            subtitle={t(`${num(data.counts.clip, lang)}টি ছোট নসীহত`, `${data.counts.clip} short reminders`)}
            icon={Sparkles}
            href={LINKS.clips.href}
            items={data.clips.map((c) => ({ track: clipTrack(c), meta: timeAgo(c.createdAt, lang) }))}
          />
        </div>
      </div>

      {/* Row 4 */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AmalPanel amal={data.amal} />
        </div>
        <div className="xl:col-span-5">
          <GalleryPanel albums={data.albums} videos={data.videoNasheeds} photos={data.counts.photos} />
        </div>
      </div>

      <AppBand />
    </div>
  );
}

/* ── Live (the "credit card") ─────────────────────────────────── */

function LiveCard({ live }: { live: LiveStatus | null }) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const isLive = !!live?.isLive;
  const rec = live?.recording ?? live?.recordings?.[0] ?? null;
  const recTrack = rec?.audioUrl ? recordingTrack(rec) : null;
  const recPlaying = !!recTrack && player.isCurrent(recTrack.id) && player.playing;

  return (
    <Panel className="p-3 sm:p-3">
      <PanelHeader
        className="px-3 pt-3 pb-4"
        title={t("লাইভ মজলিস", "Live majlis")}
        subtitle={isLive ? t("এখন সরাসরি সম্প্রচার চলছে", "Broadcasting right now") : t("সর্বশেষ সম্প্রচার", "Latest broadcast")}
        href={LINKS.live.href}
      />
      <div className="relative overflow-hidden rounded-[22px] bg-brand p-5 text-white">
        <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-8 h-40 w-40 rounded-full bg-black/10" />
        <div className="relative flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight italic">islah<span className="opacity-70">LIVE</span></span>
          {isLive ? (
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {t("সরাসরি", "LIVE")}
            </span>
          ) : (
            <AudioLines className="h-5 w-5 opacity-80" />
          )}
        </div>
        <p className="relative mt-4 text-xs opacity-75">{isLive ? t("এখন চলছে", "On air") : t("রেকর্ডিং", "Recording")}</p>
        <p className="relative mt-0.5 line-clamp-2 text-[22px] leading-snug font-semibold">
          {(isLive ? live?.title : rec?.title) || t("লাইভ সম্প্রচার", "Live broadcast")}
        </p>
        <div className="relative mt-5 flex items-end justify-between gap-3 text-xs">
          <div className="min-w-0">
            <p className="truncate opacity-90">{shortSpeaker((isLive ? live?.speaker : rec?.speaker) || "islahbd")}</p>
            <p className="mt-0.5 truncate opacity-65">
              {isLive
                ? t(`${num(live?.listeners ?? 0, lang)} জন শুনছেন`, `${live?.listeners ?? 0} listening`)
                : [rec?.duration && num(rec.duration, lang), rec?.endedAt && timeAgo(rec.endedAt, lang)].filter(Boolean).join(" · ")}
            </p>
          </div>
          {isLive ? (
            <Link href={LINKS.live.href} className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-brand-strong">
              <Headphones className="h-4 w-4" />
              {t("শুনুন", "Listen")}
            </Link>
          ) : recTrack ? (
            <PlayButton
              playing={recPlaying}
              onClick={() => (recPlaying ? player.pause() : player.play(recTrack))}
              label={t("রেকর্ডিং শুনুন", "Play recording")}
              className={cn("bg-white text-brand-strong hover:bg-white hover:text-brand-strong", recPlaying && "bg-white text-brand-strong")}
            />
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

function NextPrayerCard() {
  const { t, lang } = useLang();
  const { next, remaining } = usePrayer();
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  return (
    <Link href={LINKS.prayer.href} className="panel flex items-center justify-between gap-3 p-5 transition hover:ring-2 hover:ring-brand/20">
      <div className="min-w-0">
        <p className="text-xs text-ink-3">{t("পরবর্তী নামাজ", "Next prayer")}</p>
        {next ? (
          <p className="mt-1 truncate text-[26px] leading-tight font-semibold text-ink">
            {t(PRAYER_BN[next.name], next.name)} <span className="font-num">{num(to12h(next.time), lang)}</span>
          </p>
        ) : (
          <span className="skeleton mt-2 block h-7 w-36" />
        )}
      </div>
      {next && (
        <Pill>
          {h > 0 ? t(`${num(h, lang)}ঘ ${num(m, lang)}মি`, `${h}h ${m}m`) : t(`${num(m, lang)} মিনিট`, `${m} min`)}
        </Pill>
      )}
    </Link>
  );
}

/* ── Upload chart ─────────────────────────────────────────────── */

function UploadChart({ boyans }: { boyans: Boyan[] }) {
  const { t, lang } = useLang();
  const [mode, setMode] = useState<"month" | "category">("month");

  const data = useMemo(() => {
    if (mode === "category") {
      const counts = new Map<string, number>();
      for (const b of boyans) {
        const k = (b.category || "General").replace(/\s+/g, " ").trim();
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([label, value]) => ({ label: label.split(" ").slice(0, 2).join(" "), value, tip: `${label}: ${num(value, lang)}` }));
    }
    const latest = boyans.length ? new Date(boyans.reduce((a, b) => (a > b.uploadDate ? a : b.uploadDate), "")) : new Date();
    const fmt = new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-US", { month: "short" });
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(latest.getFullYear(), latest.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const value = boyans.filter((b) => b.uploadDate.startsWith(key)).length;
      return { label: fmt.format(d), value, tip: t(`${num(value, lang)}টি বয়ান`, `${value} talks`) };
    });
  }, [boyans, mode, lang, t]);

  return (
    <Panel className="h-full">
      <PanelHeader
        icon={Mic2}
        title={t("বয়ান আপলোড", "Boyan uploads")}
        subtitle={t("নতুন অডিও সংযোজনের হিসাব", "How the archive grows")}
        href={LINKS.boyan.href}
        action={
          <Segmented
            size="sm"
            className="hidden sm:inline-flex"
            value={mode}
            onChange={setMode}
            options={[
              { value: "month", label: t("মাসিক", "Monthly") },
              { value: "category", label: t("বিভাগ", "Category") },
            ]}
          />
        }
      />
      <Segmented
        size="sm"
        className="mt-4 sm:hidden"
        value={mode}
        onChange={setMode}
        options={[
          { value: "month", label: t("মাসিক", "Monthly") },
          { value: "category", label: t("বিভাগ", "Category") },
        ]}
      />
      <PillBarChart className="mt-8" data={data} height={264} format={(n) => num(n, lang)} />
    </Panel>
  );
}

/* ── Library total + growth (the "balance" card) ──────────────── */

function LibraryCard({ data }: { data: HomeData }) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const total = data.counts.boyan + data.counts.nasheed + data.counts.clip;
  const fmt = new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-US", { month: "short", year: "2-digit" });
  const series = data.growth.slice(-12).map((g) => ({
    label: fmt.format(new Date(`${g.month}-01T00:00:00`)),
    value: g.total,
    tip: t(`মোট ${num(g.total, lang)}টি`, `${g.total} total`),
  }));
  const queue = data.boyans.map(boyanTrack);

  return (
    <section className="panel flex h-full flex-col overflow-hidden">
      <div className="p-5 pb-0 sm:p-6 sm:pb-0">
        <PanelHeader title={t("অডিও লাইব্রেরি", "Audio library")} subtitle={t("বয়ান, নাশিদ ও ক্লিপ", "Talks, nasheeds & clips")} href={LINKS.boyan.href} />
        <p className="mt-5 text-center text-xs text-ink-3">{t("মোট অডিও", "Total audio")}</p>
        <p className="text-center text-[38px] leading-tight font-semibold tracking-tight text-ink">
          <span className="font-num">{num(total, lang)}</span>
          <span className="text-ink-3">{t("টি", "")}</span>
        </p>
        <div className="mt-2 flex justify-center gap-3 text-[11px] text-ink-3">
          <span>{t("বয়ান", "Talks")} {num(data.counts.boyan, lang)}</span>
          <span>·</span>
          <span>{t("নাশিদ", "Nasheeds")} {num(data.counts.nasheed, lang)}</span>
          <span>·</span>
          <span>{t("ক্লিপ", "Clips")} {num(data.counts.clip, lang)}</span>
        </div>
      </div>
      <div className="relative mt-auto">
        <AreaChart data={series} height={170} className="mt-4" />
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-panel p-1 shadow-lg shadow-black/5">
            <button
              onClick={() => queue[0] && player.play(queue[0], queue)}
              className="flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-white transition hover:bg-brand-strong"
            >
              {t("শুনুন", "Play")} <Headphones className="h-4 w-4" />
            </button>
            <Link href={LINKS.boyan.href} className="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink-2 hover:text-ink">
              {t("সব দেখুন", "Browse")} <ChevronDown className="h-4 w-4 -rotate-90" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Recent boyan table (the "payment history") ───────────────── */

function RecentBoyans({ boyans }: { boyans: Boyan[] }) {
  const { t, lang } = useLang();
  const player = usePlayer();
  const rows = boyans.slice(0, 6);
  const queue = boyans.map(boyanTrack);

  return (
    <Panel className="h-full">
      <PanelHeader title={t("সাম্প্রতিক বয়ান", "Recent talks")} subtitle={t("সর্বশেষ আপলোড হওয়া বয়ান", "Latest uploads")} href={LINKS.boyan.href} />
      <div className="mt-4 -mx-2 sm:overflow-x-auto">
        <table className="w-full table-fixed border-separate sm:table-auto sm:min-w-[560px] border-spacing-y-1 text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-3">
              <th className="px-3 py-2 font-normal">{t("শিরোনাম", "Title")}</th>
              <th className="hidden px-3 py-2 font-normal sm:table-cell">{t("তারিখ", "Date")}</th>
              <th className="hidden px-3 py-2 font-normal md:table-cell">{t("সময়", "Time")}</th>
              <th className="hidden px-3 py-2 font-normal sm:table-cell">{t("স্থান", "Location")}</th>
              <th className="w-16 px-3 py-2 text-right font-normal">{t("শুনুন", "Play")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => {
              const track = queue[i];
              const current = player.isCurrent(track.id);
              const playing = current && player.playing;
              return (
                <tr key={b.id} className={cn("group transition", current ? "bg-brand-soft" : "hover:bg-panel-2")}>
                  <td className="rounded-l-2xl px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel-2 text-brand group-hover:bg-panel">
                        {current ? <Equalizer active={playing} /> : <Mic2 className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink sm:max-w-[280px]">{b.title}</p>
                        <p className="truncate text-[11px] text-brand">
                          {b.category}
                          <span className="text-ink-3 sm:hidden"> · {formatDate(b.uploadDate, lang)}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-2.5 whitespace-nowrap text-ink-2 sm:table-cell">{formatDate(b.uploadDate, lang)}</td>
                  <td className="hidden px-3 py-2.5 whitespace-nowrap text-ink-2 md:table-cell">{formatTime(b.uploadDate, lang)}</td>
                  <td className="hidden px-3 py-2.5 sm:table-cell">
                    <span className="inline-flex max-w-[180px] items-center gap-2 rounded-full bg-panel px-2.5 py-1 text-xs text-ink-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="truncate">{b.location || "—"}</span>
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-3 py-2.5 text-right">
                    <PlayButton
                      size="sm"
                      className="ml-auto"
                      playing={playing}
                      loading={current && player.loading}
                      onClick={() => (playing ? player.pause() : player.play(track, queue))}
                      label={playing ? t("থামান", "Pause") : t("শুনুন", "Play")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ── Malfuz + notice board (the "credit" card) ────────────────── */

function MalfuzCard({ malfuz, notices, total }: { malfuz: Malfuz[]; notices: Notice[]; total: number }) {
  const { t, lang } = useLang();
  const now = useNow(3_600_000);
  const pick = malfuz.length && now ? malfuz[Math.floor(now.getTime() / 86_400_000) % malfuz.length] : malfuz[0];
  const reactions = pick ? Object.values(pick.reactions).reduce((a, b) => a + b, 0) : 0;
  const withImages = notices.filter((n) => n.imageUrl).slice(0, 4);

  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader icon={Quote} title={t("আজকের মালফুযাত", "Today's malfuz")} subtitle={pick?.author || ""} href={LINKS.malfuzat.href} />
      {pick ? (
        <>
          <p className="mt-5 line-clamp-5 text-[17px] leading-relaxed text-ink">{pick.text}</p>
          <div className="mt-3 flex items-center gap-2">
            {Object.entries(pick.reactions).map(([emoji, n]) => (
              <span key={emoji} className="inline-flex items-center gap-1 rounded-full bg-panel-2 px-2 py-0.5 text-xs text-ink-2">
                {emoji} <span className="font-num">{num(n, lang)}</span>
              </span>
            ))}
            {reactions > 0 && <Pill className="ml-auto">{t(`${num(reactions, lang)} প্রতিক্রিয়া`, `${reactions} reactions`)}</Pill>}
          </div>
        </>
      ) : (
        <p className="mt-5 text-sm text-ink-3">{t("এখনো কিছু নেই", "Nothing yet")}</p>
      )}

      <Link href={LINKS.notices.href} className="mt-5 block rounded-[22px] bg-panel-2 p-4 transition hover:ring-2 hover:ring-brand/20 sm:mt-auto">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{t("নোটিশ বোর্ড", "Notice board")}</p>
            <p className="mt-0.5 truncate text-xs text-ink-3">{notices[0]?.description.split("\n")[0] || t("সর্বশেষ ঘোষণা", "Latest announcements")}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink-2">
            <Megaphone className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-4 flex items-center">
          {withImages.map((n, i) => (
            <span key={n.id} className="relative -ml-2 h-11 w-11 overflow-hidden rounded-full border-[3px] border-panel-2 first:ml-0" style={{ zIndex: 10 - i }}>
              <Image src={n.imageUrl!} alt="" fill sizes="44px" className="object-cover" unoptimized />
            </span>
          ))}
          {total > withImages.length && (
            <span className="relative -ml-2 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-panel-2 bg-brand font-num text-xs font-semibold text-white first:ml-0">
              +{num(total - withImages.length, lang)}
            </span>
          )}
        </div>
      </Link>
    </Panel>
  );
}

/* ── Feature grid ─────────────────────────────────────────────── */

function FeatureGrid({ counts }: { counts: HomeData["counts"] }) {
  const { t, lang } = useLang();
  const countFor: Partial<Record<string, number>> = {
    "/boyan": counts.boyan,
    "/nasheed": counts.nasheed,
    "/clips": counts.clip,
    "/quran": 114,
    "/amal": counts.amal,
    "/malfuzat": counts.malfuz,
    "/notices": counts.notices,
    "/gallery": counts.photos + counts.wallpapers,
    "/library": counts.books,
  };
  const links = ALL_LINKS.filter((l) => l.href !== "/" && l.href !== LINKS.member.href);
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between px-1">
        <div>
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">{t("সব ফিচার", "All features")}</h2>
          <p className="text-sm text-ink-3">{t("অ্যাপের সব কিছু, এখন ওয়েবেও", "Everything from the app, now on the web")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {links.map((l) => {
          const Icon = l.icon;
          const c = countFor[l.href];
          return (
            <Link key={l.href} href={l.href} className="panel group flex flex-col gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(14,26,19,0.18)] sm:p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong transition group-hover:bg-brand group-hover:text-white dark:text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                {c ? <span className="font-num text-xs font-semibold text-ink-3">{num(c, lang)}</span> : null}
              </div>
              <div>
                <p className="font-semibold text-ink">{t(l.bn, l.en)}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-3">{t(l.descBn, l.descEn)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ── Prayer times ─────────────────────────────────────────────── */

function PrayerPanel() {
  const { t, lang } = useLang();
  const { city, setCity, times, current, next, progress } = usePrayer();
  return (
    <Panel className="h-full">
      <PanelHeader
        icon={Clock}
        title={t("নামাজের সময়", "Prayer times")}
        subtitle={
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <select
              value={city.name}
              onChange={(e) => setCity(BD_CITIES.find((c) => c.name === e.target.value) ?? BD_CITIES[0])}
              className="cursor-pointer bg-transparent text-xs text-ink-3 outline-none"
              aria-label={t("শহর", "City")}
            >
              {BD_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {t(c.nameBn, c.name)}
                </option>
              ))}
            </select>
          </span>
        }
        href={LINKS.prayer.href}
      />
      <ul className="mt-5 space-y-1.5">
        {(["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map((name) => {
          const isCur = current === name;
          const isNext = next?.name === name;
          return (
            <li
              key={name}
              className={cn(
                "relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-2.5 text-sm",
                isCur ? "bg-brand text-white" : "bg-panel-2 text-ink",
              )}
            >
              {isCur && <span className="absolute inset-y-0 left-0 bg-white/12" style={{ width: `${progress * 100}%` }} />}
              <span className="relative flex items-center gap-2 font-medium">
                {t(PRAYER_BN[name], name)}
                {isNext && <Pill tone="soft">{t("পরবর্তী", "Next")}</Pill>}
              </span>
              <span className={cn("relative font-num font-semibold", !isCur && "text-ink-2")}>{times ? num(to12h(times[name]), lang) : "--:--"}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* ── Compact audio list ───────────────────────────────────────── */

function AudioListPanel({
  title,
  subtitle,
  icon,
  href,
  items,
}: {
  title: string;
  subtitle: string;
  icon: typeof Mic2;
  href: string;
  items: { track: ReturnType<typeof boyanTrack>; meta: string }[];
}) {
  const { t } = useLang();
  const player = usePlayer();
  const queue = items.map((i) => i.track);
  return (
    <Panel className="h-full">
      <PanelHeader icon={icon} title={title} subtitle={subtitle} href={href} />
      <ul className="mt-4 space-y-1">
        {items.map(({ track, meta }) => {
          const current = player.isCurrent(track.id);
          const playing = current && player.playing;
          return (
            <li key={track.id} className={cn("flex items-center gap-3 rounded-2xl p-2 transition", current ? "bg-brand-soft" : "hover:bg-panel-2")}>
              <PlayButton
                size="sm"
                playing={playing}
                loading={current && player.loading}
                onClick={() => (playing ? player.pause() : player.play(track, queue))}
                label={playing ? t("থামান", "Pause") : t("শুনুন", "Play")}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{track.title}</p>
                {meta && <p className="truncate text-[11px] text-ink-3">{meta}</p>}
              </div>
              {current && <Equalizer active={playing} />}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* ── Amal sections ────────────────────────────────────────────── */

const SECTION_LABEL: Record<AmalSection, [string, string]> = {
  amal: ["আমল", "Amal"],
  wazifa: ["ওয়াজিফা", "Wazifa"],
  sunnat: ["সুন্নাত", "Sunnah"],
  fazilat: ["ফযীলত", "Virtues"],
};

function AmalPanel({ amal }: { amal: HomeData["amal"] }) {
  const { t, lang } = useLang();
  const [section, setSection] = useState<AmalSection>("amal");
  const cats = amal.filter((c) => c.section === section);
  const totals = (Object.keys(SECTION_LABEL) as AmalSection[]).map((s) => ({
    s,
    n: amal.filter((c) => c.section === s).reduce((a, c) => a + c.itemCount, 0),
  }));
  return (
    <Panel className="h-full">
      <PanelHeader icon={ScrollText} title={t("আমল ও সুন্নাত", "Amal & Sunnah")} subtitle={t("দৈনন্দিন আমলের সংকলন", "Daily practice collection")} href={LINKS.amal.href} />
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {totals.map(({ s, n }) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={cn(
              "rounded-2xl p-3 text-left transition",
              section === s ? "bg-brand text-white" : "bg-panel-2 text-ink hover:ring-2 hover:ring-brand/20",
            )}
          >
            <p className={cn("text-xs", section === s ? "text-white/75" : "text-ink-3")}>{t(...SECTION_LABEL[s])}</p>
            <p className="font-num text-xl font-semibold">{num(n, lang)}</p>
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
        {cats.slice(0, 8).map((c) => (
          <li key={c.id}>
            <Link href={`/amal?section=${c.section}&category=${c.id}`} className="flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-panel-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft font-num text-xs font-semibold text-brand-strong dark:text-brand">
                {num(c.itemCount, lang)}
              </span>
              <span className="truncate text-sm text-ink">{c.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ── Gallery + video ──────────────────────────────────────────── */

function GalleryPanel({ albums, videos, photos }: { albums: GalleryAlbum[]; videos: Nasheed[]; photos: number }) {
  const { t, lang } = useLang();
  const tiles = albums.flatMap((a) => a.photos.map((p) => ({ ...p, album: a.title }))).slice(0, 5);
  return (
    <Panel className="h-full">
      <PanelHeader icon={Users} title={t("গ্যালারি ও ভিডিও", "Gallery & video")} subtitle={t(`${num(photos, lang)}টি ছবি`, `${photos} photos`)} href={LINKS.gallery.href} />
      <div className="mt-5 grid h-56 grid-cols-3 grid-rows-2 gap-2">
        {tiles.map((p, i) => (
          <Link
            key={p.id}
            href={LINKS.gallery.href}
            className={cn("relative overflow-hidden rounded-2xl bg-panel-2", i === 0 && "col-span-2 row-span-2")}
          >
            <Image src={p.url} alt={p.album} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 hover:scale-105" unoptimized />
          </Link>
        ))}
      </div>
      {videos.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {videos.slice(0, 2).map((v) => (
            <Link key={v.id} href={`/nasheed?tab=video&play=${v.id}`} className="group flex items-center gap-2.5 rounded-2xl bg-panel-2 p-2">
              <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image src={youtubeThumb(v.youtubeId!)} alt="" fill sizes="56px" className="object-cover" unoptimized />
              </span>
              <span className="line-clamp-2 text-xs font-medium text-ink">{v.title}</span>
            </Link>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ── App download band ────────────────────────────────────────── */

function AppBand() {
  const { t } = useLang();
  return (
    <section className="relative mt-8 overflow-hidden rounded-[28px] bg-brand p-6 text-white sm:p-10">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-black/10" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Smartphone className="h-3.5 w-3.5" /> islahbd app
          </span>
          <h2 className="mt-3 text-2xl leading-snug font-semibold sm:text-3xl">
            {t("নামাজের আযান-অ্যালার্ম, অফলাইন অডিও আর কিবলা — অ্যাপে আরও অনেক কিছু", "Adhan alarms, offline audio, qibla and more in the app")}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-strong">
            <Download className="h-4 w-4" /> Google Play
          </a>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center gap-2 rounded-full bg-white/15 px-5 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20">
            <Download className="h-4 w-4" /> App Store
          </a>
        </div>
      </div>
    </section>
  );
}


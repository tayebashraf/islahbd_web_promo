"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Clock, MapPin, Navigation, Pause, Phone, Play } from "lucide-react";
import type { Boyan, LiveRecording, RecurringMajlis } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer, type Track } from "@/components/player/player-provider";
import { Equalizer } from "@/components/dashboard/ui";
import { boyanTrack, recordingTrack } from "@/lib/tracks";
import { formatDate, num, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

/** App-style section title: gold-to-green bar + heading. */
function BarTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-gold to-brand" />
      <div className="min-w-0">
        <h2 className="font-heading text-[19px] leading-tight font-bold text-ink sm:text-[22px]">{title}</h2>
        {sub && <p className="text-[13px] text-ink-3">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Recent recordings (saved on the server after each live) ──── */

export function RecentRecordings({ recordings, boyans }: { recordings: LiveRecording[]; boyans: Boyan[] }) {
  const { t, lang } = useLang();
  const player = usePlayer();

  const items = useMemo(() => {
    const fromLive = recordings.filter((r) => r.audioUrl).slice(0, 3).map((r) => ({ track: recordingTrack(r), duration: r.duration, when: r.endedAt ? timeAgo(r.endedAt, lang) : "", location: r.location }));
    // Fall back to the newest uploads when the server has no live recordings yet.
    const fill = boyans.slice(0, 3 - fromLive.length).map((b) => ({ track: boyanTrack(b), duration: b.duration, when: formatDate(b.uploadDate, lang), location: b.location }));
    return [...fromLive, ...fill];
  }, [recordings, boyans, lang]);
  const queue: Track[] = items.map((i) => i.track);
  if (!items.length) return null;

  return (
    <section>
      <BarTitle title={t("সাম্প্রতিক রেকর্ড হওয়া বয়ান", "Recently recorded talks")} sub={t("লাইভ শেষে সার্ভারে সংরক্ষিত", "Saved after each live broadcast")} />
      <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {items.map((it) => {
          const current = player.isCurrent(it.track.id);
          const playing = current && player.playing;
          return (
            <li key={it.track.id}>
              <button
                onClick={() => (playing ? player.pause() : player.play(it.track, queue))}
                className={cn(
                  "flex h-full w-full items-center gap-3 rounded-2xl border p-3 text-start transition",
                  current ? "border-brand/40 bg-brand-soft" : "border-line bg-panel hover:border-brand/40",
                )}
              >
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", playing ? "bg-brand text-white" : "bg-icon-bg text-brand")}>
                  {playing ? <Equalizer active /> : current ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ms-0.5 h-4 w-4" fill="currentColor" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-[15.5px] text-ink">{it.track.title}</span>
                  <span className="mt-0.5 flex items-center gap-2 text-[12.5px] text-ink-3">
                    {it.duration && (
                      <span className="flex shrink-0 items-center gap-1 font-num">
                        <Clock className="h-3 w-3" />
                        {num(it.duration, lang)}
                      </span>
                    )}
                    {it.when && <span className="shrink-0">{it.when}</span>}
                    {it.location && <span className="truncate">· {it.location}</span>}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Recurring majlis ──────────────────────────────────────────── */

const DAY_BN = ["", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার", "রবিবার"];
const DAY_EN = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ORD_BN = ["", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম"];
const ORD_EN = ["", "1st", "2nd", "3rd", "4th", "5th"];
// Fixed labels: Intl's short month differs between Node and browsers (hydration mismatch).
const MONTH_BN = ["জানু", "ফেব্রু", "মার্চ", "এপ্রি", "মে", "জুন", "জুলা", "আগ", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];
const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Next date (today included) this majlis falls on. Dart weekday: Mon=1…Sun=7. */
export function nextOccurrence(m: RecurringMajlis, from = new Date()): Date | null {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < 70; i++) {
    const wd = d.getDay() === 0 ? 7 : d.getDay();
    const nth = Math.ceil(d.getDate() / 7);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const cancelled = m.cancellations?.some((c) => c.date === iso && !c.detailId);
    if (wd === m.dayOfWeek && (!m.weekNumbers.length || m.weekNumbers.includes(nth)) && !cancelled) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return null;
}

export function RecurringMajlisList({ majlis }: { majlis: RecurringMajlis[] }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(null);

  const rows = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return majlis
      .map((m) => ({ m, next: nextOccurrence(m) }))
      .sort((a, b) => (a.next?.getTime() ?? Infinity) - (b.next?.getTime() ?? Infinity))
      .map((r) => ({ ...r, days: r.next ? Math.round((r.next.getTime() - today.getTime()) / 86400000) : null }));
  }, [majlis]);
  if (!rows.length) return null;

  const when = (m: RecurringMajlis) =>
    m.weekNumbers.length
      ? t(`প্রতি মাসের ${m.weekNumbers.map((n) => ORD_BN[n]).join(", ")} ${DAY_BN[m.dayOfWeek]}`, `${m.weekNumbers.map((n) => ORD_EN[n]).join(", ")} ${DAY_EN[m.dayOfWeek]} of the month`)
      : t(`প্রতি ${DAY_BN[m.dayOfWeek]}`, `Every ${DAY_EN[m.dayOfWeek]}`);
  const badge = (d: number | null) => (d === null ? "" : d === 0 ? t("আজ", "Today") : d === 1 ? t("আগামীকাল", "Tomorrow") : t(`${num(d, lang)} দিন পর`, `in ${d} days`));

  return (
    <section>
      <BarTitle title={t("নিয়মিত মজলিস", "Regular majlis")} sub={t("সাপ্তাহিক ও মাসিক ইসলাহী মজলিসের সময়সূচি", "Weekly and monthly islahi gatherings")} />
      <ul className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
        {rows.map(({ m, next, days }, i) => {
          const expanded = open === m.id;
          const details = m.details.filter((d) => d.is_active).sort((a, b) => a.order - b.order);
          return (
            <li key={m.id} className={cn("overflow-hidden rounded-2xl border bg-panel transition", i === 0 ? "border-brand/40" : "border-line")}>
              <button onClick={() => setOpen(expanded ? null : m.id)} aria-expanded={expanded} className="flex w-full items-center gap-3 p-3.5 text-start">
                {next && (
                  <span className={cn("flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl leading-none", i === 0 ? "bg-brand text-white" : "bg-icon-bg text-brand")}>
                    <span className="font-num text-lg font-semibold">{num(next.getDate(), lang)}</span>
                    <span className="mt-0.5 text-[10px]">{(lang === "bn" ? MONTH_BN : MONTH_EN)[next.getMonth()]}</span>
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[16px] font-semibold text-ink">{m.title}</span>
                    {days !== null && days <= 7 && <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px]", i === 0 ? "bg-live/10 text-live" : "bg-panel-2 text-ink-3")}>{badge(days)}</span>}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-ink-3">
                    {when(m)}
                    {details[0] && ` · ${details[0].time}`}
                  </span>
                </span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-ink-3 transition", expanded && "rotate-180")} />
              </button>

              {expanded && (
                <ul className="space-y-2 border-t border-line bg-panel-2/60 p-3.5">
                  {details.map((d) => {
                    const phone = d.contact.match(/\+?\d[\d\s-]{8,}/)?.[0]?.replace(/[\s-]/g, "");
                    return (
                      <li key={d.id} className="rounded-xl bg-panel p-3">
                        <p className="flex items-start gap-2 text-[15px] font-medium text-ink">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                          {d.location}
                        </p>
                        <p className="mt-1 flex items-center gap-2 ps-6 text-[13px] text-ink-2">
                          <Clock className="h-3.5 w-3.5 text-ink-3" />
                          {d.time}
                        </p>
                        {d.route && <p className="mt-1 ps-6 text-[13px] leading-relaxed text-ink-3">{d.route}</p>}
                        <div className="mt-2.5 flex flex-wrap gap-2 ps-6">
                          {d.map && (
                            <a href={d.map} target="_blank" rel="noopener noreferrer" className="flex h-8 items-center gap-1.5 rounded-full bg-brand px-3 text-xs font-medium text-white">
                              <Navigation className="h-3.5 w-3.5" /> {t("ম্যাপে দেখুন", "Directions")}
                            </a>
                          )}
                          {phone && (
                            <a href={`tel:${phone}`} className="flex h-8 items-center gap-1.5 rounded-full border border-line bg-panel px-3 text-xs text-ink">
                              <Phone className="h-3.5 w-3.5 text-brand" /> {d.contact.split(/[-–]\s*\+?\d/)[0].trim() || t("যোগাযোগ", "Contact")}
                            </a>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

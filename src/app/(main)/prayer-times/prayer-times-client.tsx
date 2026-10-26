"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bed,
  Bell,
  BookOpen,
  Calculator,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Compass,
  Haze,
  Moon,
  MoonStar,
  RotateCcw,
  Smartphone,
  Sparkles,
  Sun,
  SunDim,
  SunMedium,
  Sunrise,
  Sunset,
  TriangleAlert,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel, PanelHeader } from "@/components/dashboard/ui";
import { APP_STORE_URL, BD_CITIES, PLAY_STORE_URL } from "@/lib/constants";
import { formatHijri, num } from "@/lib/format";
import { INTL_LOCALE } from "@/lib/i18n";
import { calculatePrayerTimes } from "@/lib/prayer-times";
import { distanceKm, qiblaBearing } from "@/lib/qibla";
import { prayerLabel, to12h, usePrayer } from "@/lib/use-prayer";
import { cn } from "@/lib/utils";
import { ABOUT, KIND_LABEL, KIND_TONE, PRAYER_FAQS, RAKAT, type Kind, type Rakat } from "./prayer-guide";
import { SkyHero } from "./sky-hero";

const hm = (d: Date) => `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;
const addMin = (d: Date, m: number) => new Date(d.getTime() + m * 60_000);

type Row = {
  key: string;
  /** The usePrayer phase that makes this row "now running". */
  phase?: string[];
  bn: string;
  en: string;
  kind: Kind;
  icon: LucideIcon;
  start: Date;
  end: Date;
  startBn?: string;
  startEn?: string;
  rakat?: Rakat[];
  about: { bn: string; en: string };
};

/** The app's unified timeline: fard, nafl and forbidden times in the order they happen. */
function timeline(
  times: NonNullable<ReturnType<typeof usePrayer>["times"]>,
  at: (hhmm: string, d?: number) => Date,
  friday: boolean,
  /** After midnight, before Fajr: the night rows belong to last night. */
  lastNight: boolean,
): Row[] {
  const fajr = at(times.Fajr);
  const sunrise = at(times.Sunrise);
  const dhuhr = at(times.Dhuhr);
  const asr = at(times.Asr);
  const maghrib = at(times.Maghrib);
  const isha = at(times.Isha, lastNight ? -1 : 0);
  const nextFajr = lastNight ? fajr : at(times.Fajr, 1);
  const dh = prayerLabel("Dhuhr", friday);
  return [
    { key: "fajr", phase: ["fajr"], bn: "ফজর", en: "Fajr", kind: "farz", icon: Haze, start: fajr, end: sunrise, rakat: RAKAT.fajr, about: ABOUT.fajr },
    { key: "sunrise", phase: ["sunrise"], bn: "সূর্যোদয়", en: "Sunrise", kind: "forbidden", icon: Sunrise, start: sunrise, end: addMin(sunrise, 15), about: ABOUT.sunrise },
    { key: "ishraq", phase: ["ishraq"], bn: "ইশরাক", en: "Ishraq", kind: "nafl", icon: SunDim, start: addMin(sunrise, 15), end: addMin(sunrise, 120), about: ABOUT.ishraq },
    { key: "chasht", phase: ["chasht"], bn: "চাশত / দুহা", en: "Chasht / Duha", kind: "nafl", icon: SunMedium, start: addMin(sunrise, 120), end: addMin(dhuhr, -10), about: ABOUT.chasht },
    { key: "zawal", phase: ["zawal"], bn: "যাওয়াল (দ্বিপ্রহর)", en: "Zawal (midday)", kind: "forbidden", icon: Sun, start: addMin(dhuhr, -10), end: dhuhr, about: ABOUT.zawal },
    { key: "dhuhr", phase: ["dhuhr"], bn: dh.bn, en: dh.en, kind: "farz", icon: Sun, start: dhuhr, end: asr, rakat: friday ? RAKAT.jumuah : RAKAT.dhuhr, about: friday ? ABOUT.jumuah : ABOUT.dhuhr },
    { key: "asr", phase: ["asr"], bn: "আসর", en: "Asr", kind: "farz", icon: CloudSun, start: asr, end: maghrib, rakat: RAKAT.asr, about: ABOUT.asr },
    { key: "sunset", phase: ["sunset"], bn: "সূর্যাস্ত", en: "Sunset", kind: "forbidden", icon: Sunset, start: addMin(maghrib, -15), end: maghrib, about: ABOUT.sunset },
    { key: "maghrib", phase: ["maghrib"], bn: "মাগরিব", en: "Maghrib", kind: "farz", icon: Moon, start: maghrib, end: isha, rakat: RAKAT.maghrib, about: ABOUT.maghrib },
    { key: "awwabin", bn: "আউওয়াবীন", en: "Awwabin", kind: "nafl", icon: Sparkles, start: addMin(maghrib, 10), end: isha, about: ABOUT.awwabin },
    { key: "isha", phase: ["isha", "isha-prev"], bn: "এশা", en: "Isha", kind: "farz", icon: MoonStar, start: isha, end: nextFajr, rakat: RAKAT.isha, about: ABOUT.isha },
    { key: "tahajjud", bn: "তাহাজ্জুদ", en: "Tahajjud", kind: "nafl", icon: Bed, start: isha, end: nextFajr, startBn: "বাদ এশা", startEn: "After Isha", about: ABOUT.tahajjud },
  ];
}

export function PrayerTimesClient() {
  const { t, lang } = useLang();
  const prayer = usePrayer();
  const { city, setCity, now, times, phase, friday } = prayer;
  const [open, setOpen] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const at = (hhmm: string, dayOffset = 0) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date(now ?? 0);
    d.setHours(h, m, 0, 0);
    d.setDate(d.getDate() + dayOffset);
    return d;
  };

  const span = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.max(h ? 0 : 1, Math.floor((sec % 3600) / 60));
    return h ? t(`${num(h, lang)} ঘণ্টা ${num(m, lang)} মিনিট`, `${h}h ${m}m`) : t(`${num(m, lang)} মিনিট`, `${m} min`);
  };

  const rows = now && times ? timeline(times, at, friday, phase?.key === "isha-prev") : [];
  const activeIdx = rows.findIndex((r) => phase && r.phase?.includes(phase.key));
  const isPast = (r: Row, i: number) => {
    if (i === activeIdx || !now) return false;
    if (r.key === "isha" || r.key === "tahajjud") return false;
    if (r.key === "asr" && phase?.key === "sunset") return true;
    return now >= r.end;
  };
  const nextIdx = rows.findIndex((r, i) => i !== activeIdx && !isPast(r, i) && now && r.start > now);

  const bearing = qiblaBearing(city.lat, city.lng);
  const km = distanceKm(city.lat, city.lng);
  const fmt = (d: Date) => num(hm(d), lang);

  return (
    <div>
      <PageHeader
        title={t("নামাজের সময়সূচী", "Prayer times")}
        muted={t(`${city.nameBn} ও আশেপাশের এলাকা — আজকের পূর্ণ সময়রেখা`, `${city.name} and nearby — today's full timeline`)}
        description={t(
          "পাঁচ ওয়াক্ত ফরজ নামাজের শুরু ও শেষ সময়, ইশরাক-চাশত-তাহাজ্জুদের মতো নফল নামাজের সময়, নিষিদ্ধ সময়, সেহরি-ইফতার এবং পুরো মাসের সময়সূচী — সব এক জায়গায়।",
          "When each of the five daily prayers starts and ends, the nafl prayers such as Ishraq, Chasht and Tahajjud, the forbidden times, suhoor and iftar, and the whole month's timetable — all in one place.",
        )}
      />

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-12">
        <div className="space-y-4 sm:space-y-5 xl:col-span-5">
          <div className="xl:sticky xl:top-24 space-y-4 sm:space-y-5">
            <SkyHero prayer={prayer} at={at} />

            <div className="grid grid-cols-2 gap-3">
              <div className="panel p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-ink-3">
                  <Utensils className="h-3.5 w-3.5 text-amber-600" />
                  {t("সেহরির শেষ", "Suhoor ends")}
                </p>
                <p className="mt-1 font-num text-2xl font-semibold text-ink">{times ? num(to12h(times.Fajr), lang) : "--:--"}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink-3">
                  <Sunset className="h-3.5 w-3.5 text-orange-500" />
                  {t("ইফতার", "Iftar")}
                </p>
                <p className="mt-1 font-num text-2xl font-semibold text-ink">{times ? num(to12h(times.Maghrib), lang) : "--:--"}</p>
              </div>
              <Link href="/qibla" className="panel group flex flex-col p-4 transition hover:ring-1 hover:ring-brand/30">
                <p className="flex items-center gap-1.5 text-xs font-medium text-ink-3">
                  <Compass className="h-3.5 w-3.5 text-brand" />
                  {t("কিবলার দিক", "Qibla")}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-panel-2">
                    <span className="absolute top-0.5 text-[9px] font-bold text-ink-3">{t("উ", "N")}</span>
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-500" style={{ transform: `rotate(${bearing}deg)` }} aria-hidden>
                      <path d="M12 2 19 21 12 17 5 21Z" fill="currentColor" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-num text-2xl font-semibold text-ink">{num(Math.round(bearing), lang)}°</p>
                    <p className="text-[11px] text-ink-3">{t("উত্তর থেকে", "from north")}</p>
                  </div>
                </div>
                <p className="mt-auto pt-2 text-xs text-ink-2">
                  {t(`কাবা ${num(Math.round(km).toLocaleString("en-US"), lang)} কি.মি. দূরে`, `Kaaba ${Math.round(km).toLocaleString("en-US")} km away`)}
                  <span className="ms-1 text-brand group-hover:underline">→</span>
                </p>
              </Link>
            </div>
          </div>
        </div>

        <Panel className="xl:col-span-7">
          <PanelHeader
            title={t("আজকের সময়রেখা", "Today's timeline")}
            subtitle={t("যেকোনো ওয়াক্তে চাপ দিয়ে রাকাত ও বিস্তারিত দেখুন", "Tap any row for rak'ahs and details")}
            action={
              <div className="hidden items-center gap-3 sm:flex">
                {(Object.keys(KIND_TONE) as Kind[]).map((k) => (
                  <span key={k} className="flex items-center gap-1.5 text-xs font-medium text-ink-3">
                    <span className="h-2 w-2 rounded-full" style={{ background: KIND_TONE[k] }} />
                    {t(KIND_LABEL[k].bn, KIND_LABEL[k].en)}
                  </span>
                ))}
              </div>
            }
          />
          <div className="mt-3 flex items-center gap-3 sm:hidden">
            {(Object.keys(KIND_TONE) as Kind[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5 text-xs font-medium text-ink-3">
                <span className="h-2 w-2 rounded-full" style={{ background: KIND_TONE[k] }} />
                {t(KIND_LABEL[k].bn, KIND_LABEL[k].en)}
              </span>
            ))}
          </div>

          <ul className="mt-4 space-y-2">
            {rows.length === 0 &&
              Array.from({ length: 12 }, (_, i) => <li key={i} className="h-[66px] animate-pulse rounded-[18px] bg-panel-2" />)}
            {rows.map((r, i) => {
              const tone = KIND_TONE[r.kind];
              const active = i === activeIdx;
              const past = isPast(r, i);
              const isNext = i === nextIdx;
              const forbidden = r.kind === "forbidden";
              const expanded = open === r.key;
              const Icon = r.icon;
              const startLabel = r.startBn ? t(r.startBn, r.startEn ?? "") : fmt(r.start);

              let status: string;
              if (active && phase && now) {
                const left = span(Math.max(0, (phase.end.getTime() - now.getTime()) / 1000));
                status = forbidden
                  ? t(`এখন নামাজ পড়বেন না • ${left} বাকি`, `Do not pray now • ${left} left`)
                  : t(`শুরু ${startLabel} • ${left} বাকি`, `Started ${startLabel} • ${left} left`);
              } else if (isNext && now) {
                const inT = span((r.start.getTime() - now.getTime()) / 1000);
                status = t(`শুরু ${startLabel} • ${inT} পর`, `Starts ${startLabel} • in ${inT}`);
              } else if (r.key === "tahajjud" && times) {
                const best = fmt(lastThird(at, times, phase?.key === "isha-prev"));
                status = t(`উত্তম সময় শেষ রাত ${best} থেকে`, `Best from ${best} (last third of the night)`);
              } else {
                status = t(`শুরু ${startLabel}`, `Starts ${startLabel}`);
              }

              return (
                <li key={r.key} className={cn("transition-opacity", past && !expanded && "opacity-55")}>
                  <div
                    className={cn(
                      "overflow-hidden rounded-[18px] border transition",
                      active ? "border-transparent text-white" : forbidden ? "bg-red-50 dark:bg-[#2A1515]" : "bg-panel",
                    )}
                    style={{
                      borderColor: active ? "transparent" : isNext ? `${tone}8C` : forbidden ? `${tone}2E` : undefined,
                      borderWidth: isNext ? 1.5 : undefined,
                      background: active
                        ? `linear-gradient(135deg, ${{ farz: "#047857, #0F766E", nafl: "#2563EB, #1D4ED8", forbidden: "#DC2626, #B91C1C" }[r.kind]})`
                        : undefined,
                      boxShadow: active ? `0 10px 24px -10px ${tone}99` : undefined,
                    }}
                  >
                    <button
                      onClick={() => setOpen(expanded ? null : r.key)}
                      aria-expanded={expanded}
                      className={cn("flex w-full items-center gap-3 text-start", active ? "px-3.5 py-3.5" : "px-3.5 py-3")}
                    >
                      <span
                        className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", active ? "bg-white/20" : "tone")}
                        style={{ ["--tone" as string]: tone }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={cn("truncate font-bold", active ? "text-[17px]" : "text-[15.5px]", !active && (forbidden ? "text-red-600 dark:text-red-400" : "text-ink"))}
                          >
                            {t(r.bn, r.en)}
                          </span>
                          <span
                            className={cn("shrink-0 rounded-full px-2 py-px text-[10px] font-bold", active ? "bg-white/20 text-white" : "tone")}
                            style={{ ["--tone" as string]: isNext && !active ? "#B45309" : tone }}
                          >
                            {active ? t("এখন চলছে", "Now") : isNext ? t("পরবর্তী", "Next") : t(KIND_LABEL[r.kind].bn, KIND_LABEL[r.kind].en)}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block truncate text-xs",
                            active ? "font-semibold text-white/90" : isNext ? "font-semibold text-amber-700 dark:text-amber-400" : "text-ink-3",
                          )}
                        >
                          {status}
                        </span>
                      </span>
                      <span className="shrink-0 text-end">
                        <span className={cn("block text-[10px]", active ? "text-white/70" : "text-ink-3")}>{t("শেষ", "Ends")}</span>
                        <span className={cn("block font-num text-sm font-bold", !active && (forbidden ? "text-red-600 dark:text-red-400" : "text-ink"))}>{fmt(r.end)}</span>
                      </span>
                      <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", active ? "text-white/80" : "text-ink-3", expanded && "rotate-180")} />
                    </button>

                    {expanded && (
                      <div className={cn("border-t px-3.5 pt-3 pb-4 text-sm leading-relaxed", active ? "border-white/15 text-white/90" : "border-line text-ink-2")}>
                        <p className={cn("mb-2 font-num text-xs font-semibold", active ? "text-white" : "text-ink")}>
                          {startLabel} – {fmt(r.end)}
                          <span className={cn("ms-2 font-normal", active ? "text-white/70" : "text-ink-3")}>
                            ({span((r.end.getTime() - r.start.getTime()) / 1000)})
                          </span>
                        </p>
                        <p>{t(r.about.bn, r.about.en)}</p>
                        {r.rakat && <RakatChips rakat={r.rakat} onDark={active} />}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-ink-3">
            {t(
              "* সূর্যোদয়ের পর ১৫ মিনিট, যোহরের আগে ১০ মিনিট এবং মাগরিবের আগে ১৫ মিনিট — অ্যাপের মতোই সতর্কতামূলক হিসাব।",
              "* 15 minutes after sunrise, 10 before Dhuhr and 15 before Maghrib — the same cautious margins the app uses.",
            )}
          </p>
        </Panel>
      </div>

      <RakatTable />
      {times && now && <ForbiddenTimes times={times} at={at} />}
      {now && <MonthTable offset={monthOffset} setOffset={setMonthOffset} city={city} now={now} />}
      {now && <CitiesTable now={now} selected={city.name} onSelect={setCity} />}
      <Method />
      <RelatedTools />
      <Faq />
    </div>
  );
}

/** Start of the last third of the night (Maghrib → next Fajr). */
function lastThird(at: (hhmm: string, d?: number) => Date, times: { Maghrib: string; Fajr: string }, lastNight: boolean) {
  const a = at(times.Maghrib, lastNight ? -1 : 0).getTime();
  const b = at(times.Fajr, lastNight ? 0 : 1).getTime();
  return new Date(a + ((b - a) * 2) / 3);
}

const RAKAT_TONE: Record<Rakat["tone"], string> = { farz: "#059669", sunnah: "#0891B2", nafl: "#2563EB", witr: "#7C3AED" };

function RakatChips({ rakat, onDark }: { rakat: Rakat[]; onDark?: boolean }) {
  const { t, lang } = useLang();
  const total = rakat.reduce((s, r) => s + r.n, 0);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {rakat.map((r, i) => (
        <span
          key={i}
          className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", onDark ? "bg-white/15 text-white" : "tone")}
          style={{ ["--tone" as string]: RAKAT_TONE[r.tone] }}
        >
          <span className="font-num">{num(r.n, lang)}</span>
          {t(r.label.bn, r.label.en)}
        </span>
      ))}
      <span className={cn("ms-1 text-xs font-semibold", onDark ? "text-white" : "text-ink")}>
        = {t(`মোট ${num(total, lang)} রাকাত`, `${total} rak'ahs in all`)}
      </span>
    </div>
  );
}

function RakatTable() {
  const { t, lang } = useLang();
  const list = [
    { key: "fajr", bn: "ফজর", en: "Fajr" },
    { key: "dhuhr", bn: "যোহর", en: "Dhuhr" },
    { key: "jumuah", bn: "জুমা", en: "Jumu'ah" },
    { key: "asr", bn: "আসর", en: "Asr" },
    { key: "maghrib", bn: "মাগরিব", en: "Maghrib" },
    { key: "isha", bn: "এশা", en: "Isha" },
  ];
  return (
    <Panel className="mt-4 sm:mt-5">
      <PanelHeader
        title={t("কোন নামাজ কত রাকাত", "Rak'ahs of each prayer")}
        subtitle={t("হানাফী মাযহাব অনুযায়ী, যে ক্রমে আদায় করতে হয়", "Hanafi school, in the order they are prayed")}
      />
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const rakat = RAKAT[p.key];
          const farz = rakat.filter((r) => r.tone === "farz").reduce((s, r) => s + r.n, 0);
          return (
            <div key={p.key} className="rounded-2xl bg-panel-2 p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold text-ink">{t(p.bn, p.en)}</p>
                <p className="text-xs text-ink-3">
                  {t("ফরজ", "Fard")} <span className="font-num font-semibold text-emerald-600 dark:text-emerald-400">{num(farz, lang)}</span>
                </p>
              </div>
              <ol className="mt-2.5 space-y-1.5">
                {rakat.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-ink-2">
                    <span
                      className="tone flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-num text-xs font-bold"
                      style={{ ["--tone" as string]: RAKAT_TONE[r.tone] }}
                    >
                      {num(r.n, lang)}
                    </span>
                    {t(`রাকাত ${r.label.bn}`, `${r.label.en}`)}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function ForbiddenTimes({ times, at }: { times: { Sunrise: string; Dhuhr: string; Maghrib: string }; at: (hhmm: string, d?: number) => Date }) {
  const { t, lang } = useLang();
  const f = (d: Date) => num(hm(d), lang);
  const sunrise = at(times.Sunrise);
  const dhuhr = at(times.Dhuhr);
  const maghrib = at(times.Maghrib);
  const items = [
    {
      icon: Sunrise,
      bn: "সূর্যোদয়ের সময়",
      en: "While the sun rises",
      range: `${f(sunrise)} – ${f(addMin(sunrise, 15))}`,
      dbn: "সূর্য উঠতে শুরু করার পর প্রায় ১৫ মিনিট কোনো নামাজ পড়া যাবে না — সেদিনের ফজর কাজা হয়ে গেলেও না।",
      den: "No prayer for about 15 minutes after the sun begins to rise — not even a missed Fajr.",
    },
    {
      icon: Sun,
      bn: "ঠিক দ্বিপ্রহরে (যাওয়াল)",
      en: "At midday (zawal)",
      range: `${f(addMin(dhuhr, -10))} – ${f(dhuhr)}`,
      dbn: "সূর্য যখন ঠিক মাথার উপরে থাকে, যোহরের ওয়াক্ত শুরুর আগের কয়েক মিনিট সব নামাজ নিষেধ।",
      den: "When the sun is directly overhead, in the minutes before Dhuhr begins, every prayer is forbidden.",
    },
    {
      icon: Sunset,
      bn: "সূর্যাস্তের সময়",
      en: "While the sun sets",
      range: `${f(addMin(maghrib, -15))} – ${f(maghrib)}`,
      dbn: "সূর্য হলুদ হয়ে যাওয়া থেকে অস্ত যাওয়া পর্যন্ত। শুধু সেদিনের আসর না পড়ে থাকলে পড়া যাবে, তবে এতদূর দেরি করা মাকরূহ।",
      den: "From when the sun turns pale until it sets. Only that day's Asr may still be prayed, though delaying it this far is makruh.",
    },
  ];
  return (
    <Panel className="mt-4 sm:mt-5">
      <PanelHeader icon={TriangleAlert} title={t("নামাজের নিষিদ্ধ সময়", "Forbidden prayer times")} subtitle={t("আজকের হিসাব অনুযায়ী", "Worked out for today")} />
      <div className="mt-4 grid gap-2.5 md:grid-cols-3">
        {items.map(({ icon: Icon, ...it }) => (
          <div key={it.en} className="rounded-2xl border border-red-500/15 bg-red-50 p-4 dark:bg-[#2A1515]">
            <div className="flex items-center gap-2.5">
              <span className="tone flex h-9 w-9 items-center justify-center rounded-xl" style={{ ["--tone" as string]: KIND_TONE.forbidden }}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">{t(it.bn, it.en)}</p>
                <p className="font-num text-[15px] font-bold text-ink">{it.range}</p>
              </div>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-ink-2">{t(it.dbn, it.den)}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-2xl bg-panel-2 px-4 py-3 text-[13px] leading-relaxed text-ink-2">
        {t(
          "এছাড়া ফজরের ফরজ পড়ার পর থেকে সূর্যোদয় পর্যন্ত এবং আসরের ফরজ পড়ার পর থেকে সূর্যাস্ত পর্যন্ত নফল নামাজ পড়া মাকরূহ; তবে কাজা নামাজ, জানাজা ও তিলাওয়াতের সিজদা আদায় করা যায়।",
          "Also, after praying Fajr until sunrise and after praying Asr until sunset, nafl prayers are makruh — though missed prayers, janazah and the prostration of recitation are allowed.",
        )}
      </p>
    </Panel>
  );
}

function MonthTable({
  offset,
  setOffset,
  city,
  now,
}: {
  offset: number;
  setOffset: (n: number) => void;
  city: (typeof BD_CITIES)[number];
  now: Date;
}) {
  const { t, lang } = useLang();
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const locale = INTL_LOCALE[lang];
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(first);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const isToday = (d: Date) => d.toDateString() === now.toDateString();
  const cols = [
    { k: "Fajr", bn: "ফজর / সেহরি", en: "Fajr / Suhoor" },
    { k: "Sunrise", bn: "সূর্যোদয়", en: "Sunrise" },
    { k: "Dhuhr", bn: "যোহর", en: "Dhuhr" },
    { k: "Asr", bn: "আসর", en: "Asr" },
    { k: "Maghrib", bn: "মাগরিব / ইফতার", en: "Maghrib / Iftar" },
    { k: "Isha", bn: "এশা", en: "Isha" },
  ] as const;

  return (
    <Panel className="mt-4 sm:mt-5">
      <PanelHeader
        title={t(`মাসিক সময়সূচী — ${city.nameBn}`, `Monthly timetable — ${city.name}`)}
        subtitle={t("প্রতিটি দিনের ওয়াক্ত শুরুর সময়", "When each prayer begins, day by day")}
        action={
          <div className="flex items-center gap-1">
            <button onClick={() => setOffset(offset - 1)} aria-label={t("আগের মাস", "Previous month")} className="flex h-9 w-9 items-center justify-center rounded-full bg-panel-2 text-ink-2 hover:text-brand">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <span className="min-w-28 text-center text-sm font-semibold text-ink">{monthName}</span>
            <button onClick={() => setOffset(offset + 1)} aria-label={t("পরের মাস", "Next month")} className="flex h-9 w-9 items-center justify-center rounded-full bg-panel-2 text-ink-2 hover:text-brand">
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        }
      />
      <div className="mt-4 -mx-4 overflow-x-auto px-4 [contain:inline-size] sm:-mx-5 sm:px-5">
        <table className="w-full min-w-[620px] border-separate border-spacing-y-1 text-sm">
          <thead>
            <tr className="text-xs text-ink-3">
              <th className="px-3 py-2 text-start font-medium">{t("তারিখ", "Date")}</th>
              {cols.map((c) => (
                <th key={c.k} className="px-2 py-2 text-center font-medium">
                  {t(c.bn, c.en)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: days }, (_, i) => {
              const d = new Date(first.getFullYear(), first.getMonth(), i + 1, 12);
              const pt = calculatePrayerTimes(city.lat, city.lng, d, 6);
              const today = isToday(d);
              const fri = d.getDay() === 5;
              return (
                <tr key={i} className={cn(today ? "bg-brand text-white" : fri ? "bg-brand-soft" : "bg-panel-2")}>
                  <td className="rounded-s-xl px-3 py-1.5 whitespace-nowrap">
                    <span className="font-num font-semibold">{num(i + 1, lang)}</span>
                    <span className={cn("ms-1.5 text-xs", today ? "text-white/80" : "text-ink-3")}>{weekday.format(d)}</span>
                    <span className={cn("block text-[11px] leading-tight", today ? "text-white/70" : "text-ink-3")}>{formatHijri(d, lang, { short: true })}</span>
                  </td>
                  {cols.map((c, j) => (
                    <td key={c.k} className={cn("px-2 py-2 text-center font-num", j === cols.length - 1 && "rounded-e-xl", !today && "text-ink")}>
                      {num(to12h(pt[c.k]), lang)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-3">
        {t("সবুজ সারি আজকের দিন, হালকা সবুজ সারি শুক্রবার (জুমা)।", "The green row is today; light green rows are Fridays (Jumu'ah).")}
      </p>
    </Panel>
  );
}

function CitiesTable({ now, selected, onSelect }: { now: Date; selected: string; onSelect: (c: (typeof BD_CITIES)[number]) => void }) {
  const { t, lang } = useLang();
  const keys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
  return (
    <Panel className="mt-4 sm:mt-5">
      <PanelHeader title={t("বিভাগীয় শহরের আজকের সময়", "Today across divisional cities")} subtitle={t("যেকোনো শহরে চাপ দিলে উপরের সময়রেখা সেই শহরের হয়ে যাবে", "Pick a city to switch the timeline above")} />
      <div className="mt-4 -mx-4 overflow-x-auto px-4 [contain:inline-size] sm:-mx-5 sm:px-5">
        <table className="w-full min-w-[600px] border-separate border-spacing-y-1 text-sm">
          <thead>
            <tr className="text-xs text-ink-3">
              <th className="px-3 py-2 text-start font-medium">{t("শহর", "City")}</th>
              {keys.map((k) => {
                const l = prayerLabel(k, false);
                return (
                  <th key={k} className="px-2 py-2 text-center font-medium">
                    {t(l.bn, l.en)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {BD_CITIES.map((c) => {
              const pt = calculatePrayerTimes(c.lat, c.lng, now, 6);
              const on = c.name === selected;
              return (
                <tr
                  key={c.name}
                  onClick={() => {
                    onSelect(c);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={cn("cursor-pointer transition", on ? "bg-brand-soft ring-1 ring-brand/40" : "bg-panel-2 hover:bg-brand-soft/60")}
                >
                  <td className="rounded-s-xl px-3 py-2.5 font-semibold text-ink">{t(c.nameBn, c.name)}</td>
                  {keys.map((k, j) => (
                    <td key={k} className={cn("px-2 py-2.5 text-center font-num text-ink", j === keys.length - 1 && "rounded-e-xl")}>
                      {num(to12h(pt[k]), lang)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Method() {
  const { t } = useLang();
  const facts = [
    { bn: "ফজর ও এশা: সূর্য দিগন্তের ১৮° নিচে (করাচি পদ্ধতি)", en: "Fajr & Isha: sun 18° below the horizon (Karachi method)" },
    { bn: "আসর: হানাফী মত — ছায়া বস্তুর দ্বিগুণ হলে", en: "Asr: Hanafi — shadow twice the object's length" },
    { bn: "যোহর ও মাগরিব: যাওয়াল ও সূর্যাস্তের ১ মিনিট পর", en: "Dhuhr & Maghrib: 1 minute after zawal and sunset" },
    { bn: "সময় অঞ্চল: বাংলাদেশ সময় (GMT +৬)", en: "Time zone: Bangladesh Standard Time (GMT +6)" },
  ];
  return (
    <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 lg:grid-cols-2">
      <Panel>
        <PanelHeader icon={Calculator} title={t("সময় যেভাবে গণনা করা হয়", "How times are calculated")} subtitle={t("ইসলামিক ফাউন্ডেশনের প্রচলিত নিয়ম", "The convention used in Bangladesh")} />
        <ul className="mt-4 space-y-2">
          {facts.map((f) => (
            <li key={f.en} className="flex items-start gap-2.5 rounded-xl bg-panel-2 px-3.5 py-2.5 text-[13.5px] text-ink-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {t(f.bn, f.en)}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-ink-3">
          {t(
            "* সময়গুলো জ্যোতির্বিদ্যার হিসাবে গণনাকৃত। আপনার এলাকার মসজিদের সময়ের সাথে ১–২ মিনিট পার্থক্য হতে পারে; জামাতের সময় মসজিদ থেকে জেনে নিন।",
            "* Times are astronomical calculations and may differ by 1–2 minutes from your local mosque; check the mosque for congregation times.",
          )}
        </p>
      </Panel>
      <section className="hero-surface relative overflow-hidden rounded-3xl p-6 sm:p-7">
        <div className="star-lattice pointer-events-none absolute inset-0 opacity-10" />
        <div className="relative">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <Smartphone className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-heading text-xl sm:text-2xl">{t("প্রতিটি ওয়াক্তে আজান এলার্ম পান", "Get an azan alarm for every prayer")}</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-white/85">
            {[
              { bn: "জিপিএস দিয়ে ৬৪ জেলার নির্ভুল সময়", en: "Exact times for all 64 districts via GPS" },
              { bn: "আজান, বিপ বা নীরব এলার্ম — প্রতিটি ওয়াক্ত আলাদা", en: "Azan, beep or silent alerts — set per prayer" },
              { bn: "হোম স্ক্রিন উইজেট ও কিবলা কম্পাস", en: "Home-screen widget and Qibla compass" },
            ].map((x) => (
              <li key={x.en} className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                {t(x.bn, x.en)}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-2xl bg-white px-5 text-sm font-semibold text-[#2F5546] transition hover:bg-white/90">
              Google Play
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-2xl border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10">
              App Store
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function RelatedTools() {
  const { t } = useLang();
  const tools = [
    { href: "/qibla", icon: Compass, title: t("ক্বিবলা কম্পাস", "Qibla Direction"), sub: t("সঠিক কাবার দিক নির্ণয়", "Find Kaaba direction") },
    { href: "/tasbeeh", icon: RotateCcw, title: t("ডিজিটাল তাসবীহ", "Digital Tasbeeh"), sub: t("নামাজ পরবর্তী যিকির ও আমল", "Post-prayer adhkar") },
    { href: "/dua", icon: BookOpen, title: t("মাসনূন দোয়া", "Daily Duas"), sub: t("হিসনুল মুসলিম থেকে দোয়া", "Duas from Hisnul Muslim") },
    { href: "/ramadan", icon: CalendarDays, title: t("রমজান ক্যালেন্ডার", "Ramadan Calendar"), sub: t("সেহরি ও ইফতারের সময়সূচি", "Suhoor & Iftar schedule") },
  ];

  return (
    <Panel className="mt-4 sm:mt-5">
      <PanelHeader title={t("প্রয়োজনীয় ইসলামিক টুলস", "Related Islamic Tools")} />
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tools.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center rounded-2xl border border-line bg-panel-2 p-3.5 text-center transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-soft/30"
          >
            <item.icon className="h-6 w-6 text-brand" />
            <span className="mt-2 text-sm font-semibold text-ink">{item.title}</span>
            <span className="mt-0.5 text-[11px] text-ink-3">{item.sub}</span>
          </Link>
        ))}
      </div>
    </Panel>
  );
}

function Faq() {
  const { t } = useLang();
  return (
    <Panel className="mt-4 sm:mt-5">
      <PanelHeader title={t("সাধারণ জিজ্ঞাসা", "Frequently asked questions")} />
      <div className="mt-4 space-y-2">
        {PRAYER_FAQS.map((f) => (
          <details key={f.q.en} className="group rounded-2xl bg-panel-2 px-4 py-3 open:pb-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {t(f.q.bn, f.q.en)}
              <ChevronDown className="h-4 w-4 shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{t(f.a.bn, f.a.en)}</p>
          </details>
        ))}
      </div>
    </Panel>
  );
}

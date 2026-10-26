"use client";

import { useId } from "react";
import { ArrowLeftRight, CircleStop, CirclePlay, Hourglass, Info, MapPin, Moon } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { BD_CITIES } from "@/lib/constants";
import { formatBanglaDate } from "@/lib/bangla-date";
import { clock, formatDate, formatHijri, num } from "@/lib/format";
import { prayerLabel, to12h, type usePrayer } from "@/lib/use-prayer";
import { cn } from "@/lib/utils";

type Prayer = ReturnType<typeof usePrayer>;

const hm = (d: Date) => `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;

/**
 * The app's prayer hero: day sky or moonlit night, the sun / crescent riding
 * an arc between sunrise and sunset, the live waqt and three tiles
 * (starts, ends, time left).
 */
export function SkyHero({ prayer, at }: { prayer: Prayer; at: (hhmm: string, dayOffset?: number) => Date }) {
  const { t, lang } = useLang();
  const { city, setCity, now, times, phase, next, friday, phaseRemaining, remaining } = prayer;

  let isDay = true;
  let arc = 0.5;
  if (now && times) {
    const sunrise = at(times.Sunrise);
    const sunset = at(times.Maghrib);
    isDay = now > sunrise && now < sunset;
    const [from, to] = isDay ? [sunrise, sunset] : now >= sunset ? [sunset, at(times.Sunrise, 1)] : [at(times.Maghrib, -1), sunrise];
    arc = Math.min(1, Math.max(0, (now.getTime() - from.getTime()) / (to.getTime() - from.getTime())));
  }

  const forbidden = phase?.forbidden ?? false;
  const name = phase ? t(phase.bn, phase.en) : "—";
  const short = phase ? phase.bn.length <= 5 : true;
  const nextLabel = next ? prayerLabel(next.name, friday) : null;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[28px] p-4 text-white shadow-[0_18px_40px_-16px_rgba(6,78,59,0.55)] sm:p-5",
        isDay
          ? "bg-[linear-gradient(135deg,#045448,#066657_50%,#0E7A8A)] dark:bg-[linear-gradient(135deg,#022C22,#064E3B_50%,#0B3B4A)]"
          : "bg-[linear-gradient(135deg,#0B172B,#0F2642_50%,#0D323C)] dark:bg-[linear-gradient(135deg,#070F1E,#0C1A2E_50%,#09252F)]",
      )}
    >
      <div
        className="pointer-events-none absolute -top-16 -right-12 h-56 w-56 rounded-full"
        style={{ background: `radial-gradient(circle, ${isDay ? "rgba(251,191,36,0.28)" : "rgba(147,197,253,0.22)"}, transparent 70%)` }}
      />

      <div className="relative">
        {/* Location */}
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/35 bg-amber-400/15 text-amber-400">
            <MapPin className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold leading-tight">{t(city.nameBn, city.name)}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {t("বাংলাদেশ · হানাফী মাযহাব", "Bangladesh · Hanafi")}
            </p>
          </div>
          <label className="relative flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-xs font-semibold transition hover:bg-white/15">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {t("পরিবর্তন", "Change")}
            <select
              value={city.name}
              onChange={(e) => setCity(BD_CITIES.find((c) => c.name === e.target.value) ?? BD_CITIES[0])}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label={t("শহর পরিবর্তন করুন", "Change city")}
            >
              {BD_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {t(c.nameBn, c.name)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="my-3 h-px bg-white/10" />

        {/* Dates */}
        <p className="flex items-center gap-2 text-[15px] font-bold text-amber-400">
          <Moon className="h-4 w-4" fill="currentColor" />
          {now ? `${formatHijri(now, lang)} ${t("হিজরি", "AH")}` : " "}
        </p>
        <p className="mt-0.5 ps-6 text-xs leading-relaxed text-white/70">
          {now ? `${formatDate(now.toISOString(), lang, { weekday: "long", month: "long" })} · ${formatBanglaDate(now, lang)}` : " "}
        </p>

        <div className="my-3 h-px bg-white/10" />

        {/* Live waqt */}
        <p className={cn("flex items-center gap-2 text-xs font-semibold", forbidden ? "text-red-300" : "text-white/75")}>
          <span className="relative flex h-2 w-2">
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", forbidden ? "bg-red-500" : isDay ? "bg-emerald-400" : "bg-sky-400")} />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", forbidden ? "bg-red-500" : isDay ? "bg-emerald-400" : "bg-sky-400")} />
          </span>
          {forbidden ? t("নামাজ নিষিদ্ধ সময়", "Forbidden time") : t("এখন চলছে", "Now running")}
        </p>
        <p className="mt-0.5 truncate text-[28px] font-extrabold leading-tight sm:text-[32px]">{name}</p>

        <SunArc progress={arc} isDay={isDay} />

        {/* Three tiles */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: CirclePlay, color: isDay ? "text-emerald-300" : "text-sky-400", label: short && phase ? t(`${phase.bn} শুরু`, "Starts") : t("শুরু", "Starts"), value: phase ? num(hm(phase.start), lang) : "--:--" },
            { icon: CircleStop, color: "text-orange-400", label: short && phase ? t(`${phase.bn} শেষ`, "Ends") : t("শেষ", "Ends"), value: phase ? num(hm(phase.end), lang) : "--:--" },
            { icon: Hourglass, color: "text-amber-400", label: t("বাকি আছে", "Time left"), value: now ? num(clock(phaseRemaining), lang) : "--:--" },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label + value} className="rounded-2xl border border-white/12 bg-white/8 px-1.5 py-2.5 text-center">
              <p className="flex items-center justify-center gap-1 truncate text-[11.5px] font-semibold text-white/80">
                <Icon className={cn("h-3.5 w-3.5 shrink-0", color)} />
                <span className="truncate">{label}</span>
              </p>
              <p className="mt-1 font-num text-lg font-bold tabular-nums sm:text-xl">{value}</p>
            </div>
          ))}
        </div>

        {forbidden && phase?.noticeBn && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/35 bg-red-500/18 px-3 py-2 text-xs font-semibold text-red-100">
            <Info className="mt-px h-4 w-4 shrink-0 text-red-300" />
            {t(phase.noticeBn, phase.noticeEn ?? "")}
          </p>
        )}

        {/* Next obligatory prayer */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-black/15 px-3.5 py-2.5 text-sm">
          <span className="text-white/75">{t("পরবর্তী নামাজ", "Next prayer")}</span>
          <span className="font-semibold">
            {nextLabel && next ? (
              <>
                {t(nextLabel.bn, nextLabel.en)} <span className="font-num">{num(to12h(next.time), lang)}</span>
                <span className="ms-2 rounded-full bg-amber-400/20 px-2 py-0.5 font-num text-xs text-amber-300">{num(clock(remaining), lang)}</span>
              </>
            ) : (
              "—"
            )}
          </span>
        </div>
      </div>
    </section>
  );
}

const W = 320;
const H = 92;
const Y = H - 14;
const P0 = [16, Y];
const C1 = [16 + W * 0.18, Y - H * 0.88];
const C2 = [W - 16 - W * 0.18, Y - H * 0.88];
const P3 = [W - 16, Y];

function bez(t: number): [number, number] {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * P0[i] + 3 * u * u * t * C1[i] + 3 * u * t * t * C2[i] + t * t * t * P3[i];
  return [f(0), f(1)];
}

const STARS = [
  [0.08, 0.22], [0.16, 0.45], [0.24, 0.16], [0.32, 0.34], [0.4, 0.12], [0.48, 0.4], [0.56, 0.18], [0.64, 0.36],
  [0.72, 0.14], [0.8, 0.3], [0.88, 0.2], [0.94, 0.46], [0.14, 0.62], [0.86, 0.62], [0.36, 0.54], [0.66, 0.56],
];

/** Sun by day, crescent by night, travelling a dashed dome from horizon to horizon. */
function SunArc({ progress, isDay }: { progress: number; isDay: boolean }) {
  const id = useId().replace(/:/g, "");
  const [mx, my] = bez(progress);
  const steps = Math.max(1, Math.ceil(progress * 60));
  const travelled = Array.from({ length: steps + 1 }, (_, i) => bez(Math.min(progress, i / 60)))
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const stops = isDay ? ["#7DD3FC", "#FBBF24", "#FB923C"] : ["#38BDF8", "#818CF8", "#C084FC"];
  const track = isDay ? "rgba(255,255,255,0.22)" : "rgba(147,197,253,0.22)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="my-1 h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`g${id}`} gradientUnits="userSpaceOnUse" x1="0" x2={W} y1="0" y2="0">
          {stops.map((c, i) => (
            <stop key={c} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`h${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.35" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id={`b${id}`} x="-1" y="-1" width="3" height="3">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <mask id={`m${id}`}>
          <circle cx={mx} cy={my} r="9.5" fill="white" />
          <circle cx={mx + 3.8} cy={my - 2.2} r="8.4" fill="black" />
        </mask>
      </defs>

      {!isDay &&
        STARS.map(([x, y], i) => (
          <circle key={i} cx={x * W} cy={y * Y} r={i % 5 === 0 ? 1.5 : 1} fill="white" opacity={i % 3 === 0 ? 0.85 : i % 2 === 0 ? 0.55 : 0.35} />
        ))}

      <rect x="0" y={Y} width={W} height="1" fill={`url(#h${id})`} />
      <path
        d={`M${P0.join(" ")} C${C1.join(" ")} ${C2.join(" ")} ${P3.join(" ")}`}
        fill="none"
        stroke={track}
        strokeWidth="2"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />
      {progress > 0.005 && (
        <>
          <path d={travelled} fill="none" stroke={`url(#g${id})`} strokeWidth="6" strokeLinecap="round" opacity="0.45" filter={`url(#b${id})`} />
          <path d={travelled} fill="none" stroke={`url(#g${id})`} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {isDay ? (
        <g>
          <circle cx={mx} cy={my} r="20" fill="#FBBF24" opacity="0.4" filter={`url(#b${id})`} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={mx + Math.cos(a) * 11.5}
                y1={my + Math.sin(a) * 11.5}
                x2={mx + Math.cos(a) * 14.5}
                y2={my + Math.sin(a) * 14.5}
                stroke="#FDE68A"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={mx} cy={my} r="9" fill="#FBBF24" stroke="white" strokeWidth="1.8" />
          <circle cx={mx} cy={my} r="5" fill="#FFFBEB" />
        </g>
      ) : (
        <g>
          <circle cx={mx} cy={my} r="20" fill="#93C5FD" opacity="0.45" filter={`url(#b${id})`} />
          <circle cx={mx} cy={my} r="9.5" fill="#F8FAFC" mask={`url(#m${id})`} />
          <circle cx={mx - 9} cy={my - 7} r="1.5" fill="#F8FAFC" opacity="0.9" />
        </g>
      )}

      <circle cx={P0[0]} cy={P0[1]} r="3" fill="white" opacity="0.5" />
      <circle cx={P3[0]} cy={P3[1]} r="3" fill="white" opacity="0.5" />
    </svg>
  );
}

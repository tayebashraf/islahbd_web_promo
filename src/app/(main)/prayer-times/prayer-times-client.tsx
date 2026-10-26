"use client";

import { CloudSun, MapPin, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel, PanelHeader, Pill } from "@/components/dashboard/ui";
import { calculatePrayerTimes, getNextPrayer } from "@/lib/prayer-times";
import { BD_CITIES } from "@/lib/constants";
import { formatDate, formatHijri, num } from "@/lib/format";
import { prayerLabel, to12h, usePrayer } from "@/lib/use-prayer";
import { cn } from "@/lib/utils";

const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const ICON = { Fajr: Moon, Sunrise, Dhuhr: Sun, Asr: CloudSun, Maghrib: Sunset, Isha: Moon };

export function PrayerTimesClient() {
  const { t, lang } = useLang();
  const { city, setCity, now, times, current, next, remaining, progress, friday } = usePrayer();
  const label = (name: string) => { const l = prayerLabel(name, friday); return t(l.bn, l.en); };
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <div>
      <PageHeader
        eyebrow={t("নামাজের সময়", "Prayer times")}
        title={t(city.nameBn, city.name)}
        muted={t("— আজকের সময়সূচী", "— today's schedule")}
        description={now ? `${formatDate(now.toISOString(), lang, { weekday: "long", month: "long" })} · ${formatHijri(now, lang)}` : " "}
        actions={
          <label className="flex h-11 items-center gap-2 rounded-full bg-panel px-4 text-sm">
            <MapPin className="h-4 w-4 text-brand" />
            <select
              value={city.name}
              onChange={(e) => setCity(BD_CITIES.find((c) => c.name === e.target.value) ?? BD_CITIES[0])}
              className="cursor-pointer bg-transparent font-medium text-ink outline-none"
              aria-label={t("শহর", "City")}
            >
              {BD_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {t(c.nameBn, c.name)}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-12">
        <section className="relative overflow-hidden rounded-3xl hero-surface p-6 sm:p-8 xl:col-span-5">
          <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10" />
          <p className="relative text-sm opacity-75">{t("পরবর্তী নামাজ", "Next prayer")}</p>
          <p className="relative mt-1 text-3xl font-semibold">
            {next ? (
              <>
                {label(next.name)} <span className="font-num">{num(to12h(next.time), lang)}</span>
              </>
            ) : (
              "—"
            )}
          </p>
          <div className="relative mt-8 flex items-end gap-3 font-num">
            {[
              { v: h, bn: "ঘণ্টা", en: "hours" },
              { v: m, bn: "মিনিট", en: "min" },
              { v: s, bn: "সেকেন্ড", en: "sec" },
            ].map(({ v, bn, en }) => (
              <div key={en} className="flex-1 rounded-2xl bg-white/12 p-4 text-center">
                <p className="text-4xl font-semibold tabular-nums sm:text-5xl">{num(String(v).padStart(2, "0"), lang)}</p>
                <p className="mt-1 text-xs opacity-75">{t(bn, en)}</p>
              </div>
            ))}
          </div>
          <div className="relative mt-6">
            <div className="flex justify-between text-xs opacity-75">
              <span>{current ? label(current) : ""}</span>
              <span>{next ? label(next.name) : ""}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </section>

        <Panel className="xl:col-span-7">
          <PanelHeader title={t("আজকের ওয়াক্ত", "Today's times")} subtitle={t("হানাফী মাযহাব অনুযায়ী গণনাকৃত", "Calculated (Hanafi Asr)")} />
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ORDER.map((name) => {
              const Icon = ICON[name];
              const isCur = current === name;
              const isNext = next?.name === name;
              return (
                <li key={name} className={cn("rounded-2xl p-4 transition", isCur ? "bg-brand text-white" : "bg-panel-2")}>
                  <div className="flex items-center justify-between">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", isCur ? "bg-white/20" : "bg-panel text-brand")}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {isCur && <Pill className="bg-white/20">{t("চলমান", "Now")}</Pill>}
                    {isNext && !isCur && <Pill tone="soft">{t("পরবর্তী", "Next")}</Pill>}
                  </div>
                  <p className={cn("mt-4 text-sm", isCur ? "text-white/80" : "text-ink-3")}>{label(name)}</p>
                  <p className={cn("font-num text-2xl font-semibold", !isCur && "text-ink")}>{times ? num(to12h(times[name]), lang) : "--:--"}</p>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-4 sm:mt-5">
        <PanelHeader title={t("অন্যান্য শহর", "Other cities")} subtitle={t("পরবর্তী নামাজের সময়", "Next prayer in each city")} />
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {BD_CITIES.map((c) => {
            const nx = now ? getNextPrayer(calculatePrayerTimes(c.lat, c.lng, now, 6)) : null;
            const on = c.name === city.name;
            return (
              <button
                key={c.name}
                onClick={() => setCity(c)}
                className={cn("rounded-2xl p-3.5 text-start transition", on ? "bg-brand-soft ring-1 ring-brand/40" : "bg-panel-2 hover:ring-1 hover:ring-brand/20")}
              >
                <p className="text-sm font-semibold text-ink">{t(c.nameBn, c.name)}</p>
                <p className="mt-0.5 text-xs text-ink-3">
                  {nx ? (
                    <>
                      {label(nx.name)} · <span className="font-num text-brand">{num(to12h(nx.time), lang)}</span>
                    </>
                  ) : (
                    " "
                  )}
                </p>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-ink-3">
          {t("* সময়গুলো গণনাকৃত। সঠিক সময়ের জন্য স্থানীয় মসজিদ বা অ্যাপ দেখুন।", "* Times are calculated estimates. Check your local mosque or the app for precise times.")}
        </p>
      </Panel>
    </div>
  );
}

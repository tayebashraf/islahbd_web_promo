"use client";

import { useMemo } from "react";
import { MapPin, Moon, Sunrise, Sunset } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel, PanelHeader } from "@/components/dashboard/ui";
import { calculatePrayerTimes } from "@/lib/prayer-times";
import { BD_CITIES } from "@/lib/constants";
import { formatDate, num } from "@/lib/format";
import { to12h, useNow, usePrayer } from "@/lib/use-prayer";
import { cn } from "@/lib/utils";

const hijri = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { month: "numeric", day: "numeric", year: "numeric" });
function hijriParts(d: Date) {
  const p = Object.fromEntries(hijri.formatToParts(d).map((x) => [x.type, x.value]));
  return { day: Number(p.day), month: Number(p.month), year: Number(String(p.year).replace(/\D/g, "")) };
}

/** Gregorian dates of the current or next Ramadan, starting from `from`. */
function findRamadan(from: Date) {
  const days: Date[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < 420; i++) {
    const h = hijriParts(d);
    if (h.month === 9) days.push(new Date(d));
    else if (days.length) break;
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const at = (base: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
};

export function RamadanClient() {
  const { t, lang } = useLang();
  const { city, setCity } = usePrayer();
  const now = useNow(1000);

  const todayKey = now?.toDateString();
  const days = useMemo(() => (todayKey ? findRamadan(new Date(todayKey)) : []), [todayKey]);
  const inRamadan = !!now && days.length > 0 && days[0].toDateString() <= now.toDateString() && hijriParts(now).month === 9;
  const today = now ? calculatePrayerTimes(city.lat, city.lng, now, 6) : null;

  // Countdown to the next sehri end or iftar today.
  let next: { label: [string, string]; at: Date } | null = null;
  if (now && today) {
    const sehri = at(now, today.Fajr);
    const iftar = at(now, today.Maghrib);
    if (now < sehri) next = { label: ["সাহরির শেষ সময়", "Sehri ends"], at: sehri };
    else if (now < iftar) next = { label: ["ইফতারের সময়", "Iftar"], at: iftar };
    else {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      next = { label: ["আগামীকাল সাহরির শেষ সময়", "Sehri ends tomorrow"], at: at(tomorrow, calculatePrayerTimes(city.lat, city.lng, tomorrow, 6).Fajr) };
    }
  }
  const left = next && now ? Math.max(0, Math.floor((next.at.getTime() - now.getTime()) / 1000)) : 0;
  const clockStr = num([Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60].map((v) => String(v).padStart(2, "0")).join(":"), lang);
  const daysToGo = !inRamadan && now && days[0] ? Math.ceil((days[0].getTime() - new Date(now.toDateString()).getTime()) / 86_400_000) : 0;
  const hYear = days[0] ? hijriParts(days[0]).year : null;

  return (
    <div>
      <PageHeader
        title={t("রমজান", "Ramadan")}
        muted={
          inRamadan
            ? t(`রমজানুল মুবারক ${num(hYear ?? "", lang)} হিজরি`, `Ramadan ${hYear ?? ""} AH`)
            : days.length
              ? t(`রমজান ${num(hYear ?? "", lang)} শুরু হতে বাকি ${num(daysToGo, lang)} দিন`, `${daysToGo} days until Ramadan ${hYear ?? ""}`)
              : " "
        }
        actions={
          <label className="flex h-11 items-center gap-2 rounded-full border border-line bg-panel px-4 text-[15px]">
            <MapPin className="h-4 w-4 text-brand" />
            <select
              value={city.name}
              onChange={(e) => setCity(BD_CITIES.find((c) => c.name === e.target.value) ?? BD_CITIES[0])}
              className="cursor-pointer bg-transparent text-ink outline-none"
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="hero-surface relative overflow-hidden rounded-2xl p-6 lg:col-span-1">
          <div className="star-lattice pointer-events-none absolute inset-0 opacity-[0.08]" />
          <p className="relative text-sm text-white/80">{next ? t(...next.label) : " "}</p>
          <p className="relative mt-1 font-num text-[44px] leading-none font-semibold" dir="ltr">
            {now ? clockStr : "--:--:--"}
          </p>
          <div className="relative mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/12 p-3">
              <Sunrise className="h-5 w-5 text-gold-light" />
              <p className="mt-2 text-xs text-white/75">{t("সাহরি শেষ", "Sehri ends")}</p>
              <p className="font-num text-xl font-semibold">{today ? num(to12h(today.Fajr), lang) : "--:--"}</p>
            </div>
            <div className="rounded-xl bg-white/12 p-3">
              <Sunset className="h-5 w-5 text-gold-light" />
              <p className="mt-2 text-xs text-white/75">{t("ইফতার", "Iftar")}</p>
              <p className="font-num text-xl font-semibold">{today ? num(to12h(today.Maghrib), lang) : "--:--"}</p>
            </div>
          </div>
          {!inRamadan && <p className="relative mt-4 text-xs text-white/70">{t("আজকের সময় — নফল রোজার জন্য", "Today's times — for voluntary fasts")}</p>}
        </section>

        <Panel className="lg:col-span-2">
          <PanelHeader icon={Moon} title={t("রোজার নিয়ত ও ইফতারের দোয়া", "Fasting intention & iftar dua")} />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DuaBox
              title={t("রোজার নিয়ত", "Intention to fast")}
              ar="نَوَيْتُ اَنْ اَصُوْمَ غَدًا مِّنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَّكَ يَا اللّٰهُ فَتَقَبَّلْ مِنِّىْ اِنَّكَ اَنْتَ السَّمِيْعُ الْعَلِيْمُ"
              meaning={t(
                "হে আল্লাহ! আমি আগামীকাল পবিত্র রমজানের ফরজ রোজা রাখার নিয়ত করলাম। আমার পক্ষ থেকে তা কবুল করুন, নিশ্চয়ই আপনি সর্বশ্রোতা, সর্বজ্ঞ।",
                "O Allah, I intend to keep tomorrow's obligatory fast of blessed Ramadan for You; accept it from me — You are the All-Hearing, the All-Knowing.",
              )}
            />
            <DuaBox
              title={t("ইফতারের দোয়া", "Dua at iftar")}
              ar="اَللّٰهُمَّ لَكَ صُمْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ"
              meaning={t("হে আল্লাহ! আমি তোমারই জন্য রোজা রেখেছি এবং তোমারই দেওয়া রিজিক দিয়ে ইফতার করছি। (আবু দাউদ)", "O Allah, for You I fasted and with Your provision I break my fast. (Abu Dawud)")}
            />
          </div>
        </Panel>
      </div>

      {days.length > 0 && (
        <Panel className="mt-5">
          <PanelHeader
            title={t(`সাহরি ও ইফতারের সময়সূচি — রমজান ${num(hYear ?? "", lang)}`, `Sehri & iftar timetable — Ramadan ${hYear ?? ""}`)}
            subtitle={t(`${city.nameBn} · হিসাবকৃত সময়, স্থানীয় মসজিদের সাথে মিলিয়ে নিন`, `${city.name} · calculated times, check with your local mosque`)}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-separate border-spacing-y-1 text-[15px]">
              <thead>
                <tr className="text-start text-sm text-ink-3">
                  <th className="px-3 py-2 text-start font-normal">{t("রোজা", "Fast")}</th>
                  <th className="px-3 py-2 text-start font-normal">{t("তারিখ", "Date")}</th>
                  <th className="px-3 py-2 text-start font-normal">{t("সাহরি শেষ", "Sehri ends")}</th>
                  <th className="px-3 py-2 text-start font-normal">{t("ইফতার", "Iftar")}</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d, i) => {
                  const pt = calculatePrayerTimes(city.lat, city.lng, d, 6);
                  const isToday = now?.toDateString() === d.toDateString();
                  return (
                    <tr key={d.toISOString()} className={cn(isToday ? "bg-brand text-white" : i % 2 ? "bg-panel-2" : "")}>
                      <td className="rounded-s-xl px-3 py-2.5 font-num">{num(i + 1, lang)}</td>
                      <td className="px-3 py-2.5">{formatDate(d.toISOString(), lang, { weekday: "short", month: "short", year: undefined, timeZone: undefined })}</td>
                      <td className="px-3 py-2.5 font-num">{num(to12h(pt.Fajr), lang)}</td>
                      <td className="rounded-e-xl px-3 py-2.5 font-num">{num(to12h(pt.Maghrib), lang)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}

function DuaBox({ title, ar, meaning }: { title: string; ar: string; meaning: string }) {
  return (
    <div className="rounded-xl bg-panel-2 p-4">
      <p className="text-[15px] font-semibold text-brand">{title}</p>
      <p dir="rtl" lang="ar" className="font-arabic mt-2 text-[24px] leading-[2.1] text-ink">
        {ar}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{meaning}</p>
    </div>
  );
}

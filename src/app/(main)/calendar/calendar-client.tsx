"use client";

import { useMemo, useState } from "react";
import { BookMarked, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { num } from "@/lib/format";
import { INTL_LOCALE } from "@/lib/i18n";
import { useNow } from "@/lib/use-prayer";
import { cn } from "@/lib/utils";

export interface CalEvent {
  id: string;
  title: string;
  title_ar?: string;
  date: string;
  date_en: string;
  description: string;
  type: string;
  reference?: string;
}
export interface CalMonth {
  id: string;
  title: string;
  title_ar?: string;
  items: CalEvent[];
}

const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "numeric", year: "numeric" });
function hijri(d: Date) {
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
  return { day: Number(p.day), month: Number(p.month), year: Number(String(p.year).replace(/\D/g, "")) };
}
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/** All Gregorian dates inside the Hijri month that contains `anchor`. */
function monthOf(anchor: Date) {
  let first = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
  while (hijri(first).day !== 1) first = addDays(first, -1);
  const days: Date[] = [];
  for (let d = first; hijri(d).month === hijri(first).month; d = addDays(d, 1)) days.push(d);
  return days;
}

const TYPE: Record<string, [string, string, string]> = {
  history: ["ইতিহাস", "History", "#0284C7"],
  seerah: ["সীরাত", "Seerah", "#417360"],
  ghazwa: ["গাযওয়া", "Battle", "#DC2626"],
  sahaba: ["সাহাবা", "Companions", "#C08A2E"],
  khulafa_e_rashidun: ["খুলাফায়ে রাশেদীন", "Rightly-guided caliphs", "#7C3AED"],
};

const WEEK: [string, string][] = [
  ["রবি", "Sun"],
  ["সোম", "Mon"],
  ["মঙ্গল", "Tue"],
  ["বুধ", "Wed"],
  ["বৃহঃ", "Thu"],
  ["শুক্র", "Fri"],
  ["শনি", "Sat"],
];

export function CalendarClient({ months, source }: { months: CalMonth[]; source: string }) {
  const { t, lang } = useLang();
  const now = useNow(60_000);
  const [offset, setOffset] = useState(0);

  const today = now?.toDateString();
  const days = useMemo(() => {
    if (!today) return [];
    let anchor = new Date(today);
    for (let i = 0; i < Math.abs(offset); i++) {
      const m = monthOf(anchor);
      anchor = offset > 0 ? addDays(m[m.length - 1], 1) : addDays(m[0], -1);
    }
    return monthOf(anchor);
  }, [today, offset]);

  const h = days[0] ? hijri(days[0]) : null;
  const month = h ? months[h.month - 1] : null;
  const eventsByDay = new Map<number, CalEvent[]>();
  for (const e of month?.items ?? []) {
    const d = parseInt(e.date_en, 10);
    if (!Number.isNaN(d)) eventsByDay.set(d, [...(eventsByDay.get(d) ?? []), e]);
  }
  const [sel, setSel] = useState<number | null>(null);
  const shown = sel ? eventsByDay.get(sel) ?? [] : month?.items ?? [];
  const lead = days[0]?.getDay() ?? 0;
  const greg = (d: Date) => new Intl.DateTimeFormat(INTL_LOCALE[lang], { day: "numeric", month: "short" }).format(d);
  const hijriMonthName = days[0] ? new Intl.DateTimeFormat(`${lang === "en" ? "en" : INTL_LOCALE[lang].split("-u-")[0]}-u-ca-islamic-umalqura`, { month: "long", year: "numeric" }).format(days[0]) : "";

  return (
    <div>
      <PageHeader
        title={t("ইসলামিক ক্যালেন্ডার", "Islamic calendar")}
        muted={hijriMonthName.replace(/\s*(AH|যুগ|هـ)\s*$/u, "")}
        description={t("আরবি তারিখভিত্তিক ইসলামি ইতিহাসের গুরুত্বপূর্ণ ঘটনাবলী — তারিখে চাপ দিলে সেদিনের ঘটনা দেখাবে।", "Key events of Islamic history by Hijri date — tap a day to see its events.")}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => (setOffset((o) => o - 1), setSel(null))} aria-label={t("আগের মাস", "Previous month")} className="flex h-10 w-10 items-center justify-center rounded-full bg-panel-2 text-brand">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </button>
            <div className="text-center">
              <p className="font-heading text-xl text-ink">{month ? t(month.title, month.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())) : " "}</p>
              {month?.title_ar && (
                <p dir="rtl" lang="ar" className="font-arabic text-lg text-brand">
                  {month.title_ar}
                </p>
              )}
            </div>
            <button onClick={() => (setOffset((o) => o + 1), setSel(null))} aria-label={t("পরের মাস", "Next month")} className="flex h-10 w-10 items-center justify-center rounded-full bg-panel-2 text-brand">
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEK.map((w, i) => (
              <span key={w[1]} className={cn("py-1 text-xs", i === 5 ? "font-semibold text-brand" : "text-ink-3")}>
                {t(...w)}
              </span>
            ))}
            {Array.from({ length: lead }, (_, i) => (
              <span key={`b${i}`} />
            ))}
            {days.map((d) => {
              const hd = hijri(d).day;
              const isToday = now?.toDateString() === d.toDateString();
              const has = eventsByDay.has(hd);
              const on = sel === hd;
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSel(on ? null : hd)}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-xl border text-ink transition",
                    isToday ? "border-brand bg-brand text-white" : on ? "border-brand bg-brand-soft" : "border-transparent hover:bg-panel-2",
                  )}
                >
                  <span className="font-num text-[17px] font-semibold">{num(hd, lang)}</span>
                  <span className={cn("text-[10px]", isToday ? "text-white/80" : "text-ink-3")}>{greg(d)}</span>
                  {has && <span className={cn("absolute top-1.5 end-1.5 h-1.5 w-1.5 rounded-full", isToday ? "bg-white" : "bg-live")} />}
                </button>
              );
            })}
          </div>
          {offset !== 0 && (
            <button onClick={() => (setOffset(0), setSel(null))} className="mt-4 w-full rounded-xl border border-line py-2.5 text-[15px] text-brand">
              {t("আজকের মাসে ফিরে যান", "Back to this month")}
            </button>
          )}
        </Panel>

        <div className="min-w-0">
          <p className="mb-3 text-[15px] text-ink-2">
            {sel
              ? t(`${num(sel, lang)} তারিখের ঘটনা`, `Events on day ${sel}`)
              : t(`এই মাসের ঘটনাবলী (${num(shown.length, lang)}টি)`, `Events this month (${shown.length})`)}
          </p>
          <ul className="space-y-3">
            {shown.map((e) => {
              const ty = TYPE[e.type] ?? TYPE.history;
              return (
                <li key={e.id} className="rounded-2xl border border-line bg-panel p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-icon-bg px-2.5 py-0.5 text-xs text-brand">{e.date}</span>
                    <span className="rounded-full px-2.5 py-0.5 text-xs text-white" style={{ background: ty[2] }}>
                      {t(ty[0], ty[1])}
                    </span>
                  </div>
                  <p className="mt-2 text-[17px] font-semibold text-ink">{e.title}</p>
                  {e.title_ar && (
                    <p dir="rtl" lang="ar" className="font-arabic text-lg text-brand">
                      {e.title_ar}
                    </p>
                  )}
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{e.description}</p>
                  {e.reference && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-ink-3">
                      <BookMarked className="h-3.5 w-3.5 text-brand" />
                      {e.reference}
                    </p>
                  )}
                </li>
              );
            })}
            {shown.length === 0 && <li className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-3">{t("এই দিনে কোনো ঘটনা নথিভুক্ত নেই", "No events recorded for this day")}</li>}
          </ul>
          <p className="mt-4 text-xs text-ink-3">
            {t("সূত্র", "Sources")}: {source}
          </p>
        </div>
      </div>
    </div>
  );
}

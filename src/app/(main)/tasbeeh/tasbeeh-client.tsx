"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Vibrate, VibrateOff } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { useStoredString } from "@/lib/use-client-store";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

const DHIKR = [
  { id: "subhan", ar: "سُبْحَانَ اللّٰهِ", bn: "সুবহানাল্লাহ", en: "SubhanAllah", target: 33 },
  { id: "hamd", ar: "اَلْحَمْدُ لِلّٰهِ", bn: "আলহামদুলিল্লাহ", en: "Alhamdulillah", target: 33 },
  { id: "akbar", ar: "اَللّٰهُ أَكْبَرُ", bn: "আল্লাহু আকবার", en: "Allahu Akbar", target: 34 },
  { id: "tahlil", ar: "لَا إِلٰهَ إِلَّا اللّٰهُ", bn: "লা ইলাহা ইল্লাল্লাহ", en: "La ilaha illallah", target: 100 },
  { id: "istighfar", ar: "أَسْتَغْفِرُ اللّٰهَ", bn: "আস্তাগফিরুল্লাহ", en: "Astaghfirullah", target: 100 },
  { id: "durud", ar: "اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ", bn: "দরূদ শরীফ", en: "Durood", target: 100 },
  { id: "tasbih", ar: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", bn: "সুবহানাল্লাহি ওয়া বিহামদিহী", en: "SubhanAllahi wa bihamdihi", target: 100 },
];

type Counts = Record<string, number>;

export function TasbeehClient() {
  const { t, lang } = useLang();
  const [stored, setStored] = useStoredString("islahbd-tasbeeh");
  const [vib, setVib] = useStoredString("islahbd-tasbeeh-vibrate");
  const [active, setActive] = useState(DHIKR[0].id);
  const [pulse, setPulse] = useState(0);

  const counts = useMemo<Counts>(() => {
    try {
      return stored ? (JSON.parse(stored) as Counts) : {};
    } catch {
      return {};
    }
  }, [stored]);
  const d = DHIKR.find((x) => x.id === active)!;
  const count = counts[d.id] ?? 0;
  const round = Math.floor(count / d.target);
  const inRound = count % d.target;
  const progress = inRound / d.target;
  const vibrate = vib !== "off";
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const save = (next: Counts) => setStored(JSON.stringify(next));

  const tap = () => {
    save({ ...counts, [d.id]: count + 1 });
    setPulse((p) => p + 1);
    if (vibrate && "vibrate" in navigator) navigator.vibrate((count + 1) % d.target === 0 ? [80, 60, 80] : 18);
  };

  // Space/Enter counts too; the ref keeps the listener on the latest tap.
  const tapRef = useRef(tap);
  useEffect(() => {
    tapRef.current = tap;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "Enter") && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        tapRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const r = 120;
  const c = 2 * Math.PI * r;

  return (
    <div>
      <PageHeader
        title={t("তাসবীহ", "Tasbeeh")}
        muted={t(`আজ পর্যন্ত মোট ${num(total, lang)} বার`, `${total} in total`)}
        description={t("বৃত্তে চাপ দিন অথবা স্পেস বাটন চাপুন — প্রতি চাপে একবার গণনা হবে।", "Tap the circle or press space — each tap counts once.")}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
        <Panel className="flex flex-col items-center py-8 sm:py-10">
          <p dir="rtl" lang="ar" className="font-arabic text-center text-[34px] leading-[1.8] text-ink sm:text-[42px]">
            {d.ar}
          </p>
          <p className="mt-1 text-[17px] text-brand">{t(d.bn, d.en)}</p>

          <motion.button
            key={pulse}
            onClick={tap}
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            aria-label={t("গণনা করুন", "Count")}
            className="tap relative mt-6 h-[280px] w-[280px] rounded-full select-none focus-visible:outline-none sm:h-[300px] sm:w-[300px]"
          >
            <svg viewBox="0 0 280 280" className="absolute inset-0 h-full w-full" aria-hidden>
              <circle cx="140" cy="140" r={r} fill="var(--brand-soft)" stroke="var(--line)" strokeWidth="16" />
              <circle
                cx="140"
                cy="140"
                r={r}
                fill="none"
                stroke="var(--brand)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={c * (1 - progress)}
                transform="rotate(-90 140 140)"
                className="transition-[stroke-dashoffset] duration-300"
              />
            </svg>
            <span className="relative flex flex-col items-center">
              <span className="font-num text-[72px] leading-none font-semibold text-ink">{num(inRound, lang)}</span>
              <span className="mt-2 text-[15px] text-ink-2">
                {t(`লক্ষ্য ${num(d.target, lang)}`, `of ${d.target}`)}
              </span>
              {round > 0 && <span className="mt-1 rounded-full bg-brand px-3 py-0.5 text-sm text-white">{t(`${num(round, lang)} বার পূর্ণ`, `${round} rounds`)}</span>}
            </span>
          </motion.button>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => save({ ...counts, [d.id]: 0 })}
              className="flex h-11 items-center gap-2 rounded-full border border-line bg-panel px-5 text-[15px] text-ink hover:border-brand/40"
            >
              <RotateCcw className="h-4 w-4 text-brand" /> {t("শূন্য করুন", "Reset")}
            </button>
            <button
              onClick={() => setVib(vibrate ? "off" : "on")}
              aria-pressed={vibrate}
              className="flex h-11 items-center gap-2 rounded-full border border-line bg-panel px-5 text-[15px] text-ink hover:border-brand/40"
            >
              {vibrate ? <Vibrate className="h-4 w-4 text-brand" /> : <VibrateOff className="h-4 w-4 text-ink-3" />}
              {t("কম্পন", "Vibration")}
            </button>
          </div>
          <p className="mt-3 text-sm text-ink-3">{t(`এই যিকির মোট ${num(count, lang)} বার`, `${count} times for this dhikr`)}</p>
        </Panel>

        <Panel className="h-fit p-3 sm:p-3">
          <p className="px-2 pt-1 pb-2 text-sm font-semibold text-brand">{t("যিকির বেছে নিন", "Choose a dhikr")}</p>
          <ul className="space-y-1.5">
            {DHIKR.map((x) => {
              const on = x.id === active;
              return (
                <li key={x.id}>
                  <button
                    onClick={() => setActive(x.id)}
                    className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-start transition", on ? "border-brand bg-brand-soft" : "border-transparent hover:bg-panel-2")}
                  >
                    <span className="min-w-0 flex-1">
                      <span dir="rtl" lang="ar" className="font-arabic block text-end text-xl leading-loose text-ink">
                        {x.ar}
                      </span>
                      <span className="block text-sm text-ink-2">{t(x.bn, x.en)}</span>
                    </span>
                    <span className="rounded-full bg-icon-bg px-2.5 py-1 font-num text-xs text-brand">{num(counts[x.id] ?? 0, lang)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

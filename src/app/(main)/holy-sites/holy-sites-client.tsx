"use client";

import { ExternalLink } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader } from "@/components/dashboard/ui";

// Saudi Quran / Sunnah TV channels — the same sources the app plays.
const SITES = [
  { id: "makkah", bn: "মসজিদুল হারাম, মক্কা মুকাররমা", en: "Masjid al-Haram, Makkah", ar: "الْمَسْجِدُ الْحَرَام", handle: "SaudiQuranTv" },
  { id: "madinah", bn: "মসজিদে নববী, মদিনা মুনাওয়ারা", en: "Masjid an-Nabawi, Madinah", ar: "الْمَسْجِدُ النَّبَوِي", handle: "SaudiSunnahTv" },
] as const;

export function HolySitesClient({ ids }: { ids: Record<(typeof SITES)[number]["id"], string> }) {
  const { t } = useLang();
  return (
    <div>
      <PageHeader
        title={t("হারামাইন লাইভ", "Makkah & Madinah live")}
        muted={t("২৪ ঘণ্টা সরাসরি সম্প্রচার", "Broadcasting 24 hours")}
        description={t("ভিডিও চালু না হলে “ইউটিউবে দেখুন” চাপুন।", "If the video does not start, tap “Watch on YouTube”.")}
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {SITES.map((s) => (
          <section key={s.id} className="overflow-hidden rounded-2xl border border-line bg-panel">
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${ids[s.id]}?rel=0&playsinline=1`}
                title={t(s.bn, s.en)}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="flex items-center gap-3 p-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16.5px] font-semibold text-ink">{t(s.bn, s.en)}</span>
                <span dir="rtl" lang="ar" className="font-arabic block text-brand">
                  {s.ar}
                </span>
              </span>
              <a
                href={`https://www.youtube.com/@${s.handle}/live`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-panel-2 px-4 text-sm text-brand hover:bg-brand-soft"
              >
                {t("ইউটিউবে দেখুন", "Watch on YouTube")} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

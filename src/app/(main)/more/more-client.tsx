"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Building2, HandHeart, Mic2, type LucideIcon } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { LINKS, type NavLink } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Same layout as the app's "অন্যান্য" tab: a compact title, then each
 *  category as a coloured header over a grid of small square tiles. */
const GROUPS: { key: string; bn: string; en: string; icon: LucideIcon; colors: [string, string]; links: NavLink[] }[] = [
  {
    key: "worship",
    bn: "ইবাদত",
    en: "Worship",
    icon: HandHeart,
    colors: ["#EA580C", "#FB923C"],
    links: [LINKS.prayer, LINKS.qibla, LINKS.tasbeeh, LINKS.dua, LINKS.sunnat, LINKS.wazifa, LINKS.hajj, LINKS.zakat, LINKS.mosque],
  },
  {
    key: "knowledge",
    bn: "ইলম ও জ্ঞান",
    en: "Knowledge",
    icon: BookOpen,
    colors: ["#0D9488", "#14B8A6"],
    links: [LINKS.quran, LINKS.fatwa, LINKS.amal, LINKS.fazilat, LINKS.munajat, LINKS.library, LINKS.malfuzat, LINKS.poems, LINKS.calendar, LINKS.ramadan, LINKS.blog],
  },
  {
    key: "media",
    bn: "অডিও ও ভিডিও",
    en: "Audio & video",
    icon: Mic2,
    colors: ["#2563EB", "#60A5FA"],
    links: [LINKS.boyan, LINKS.live, LINKS.nasheed, LINKS.clips, LINKS.holySites, LINKS.gallery, LINKS.wallpaper],
  },
  {
    key: "institution",
    bn: "প্রতিষ্ঠান",
    en: "Institution",
    icon: Building2,
    colors: ["#9333EA", "#C084FC"],
    links: [LINKS.paribar, LINKS.about, LINKS.member, LINKS.khidmat, LINKS.notices],
  },
];

export function MoreClient() {
  const { t } = useLang();
  const [toast, setToast] = useState<string | null>(null);
  const soon = (l: NavLink) => {
    setToast(t(`“${l.bn}” শীঘ্রই আসছে, ইনশাআল্লাহ`, `"${l.en}" is coming soon`));
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="mx-auto max-w-[880px] pb-8">
      <header className="mb-4 text-center">
        <h1 className="font-heading text-[20px] leading-tight font-bold text-ink sm:text-2xl">{t("অন্যান্য", "More")}</h1>
        <p className="mt-0.5 text-[12.5px] text-ink-3">{t("সকল ফিচার একসাথে", "All features together")}</p>
      </header>

      <div className="space-y-6">
        {GROUPS.map((g) => (
          <section key={g.key}>
            <h2 className="mb-2.5 flex items-center gap-2.5 px-1">
              <span className="h-[22px] w-[3px] rounded-full" style={{ background: `linear-gradient(${g.colors[0]}, ${g.colors[1]})` }} />
              <g.icon className="h-[18px] w-[18px]" style={{ color: g.colors[0] }} />
              <span className="font-heading text-[17px] font-bold text-ink">{t(g.bn, g.en)}</span>
            </h2>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Tile link={l} onSoon={() => soon(l)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {toast && (
        <div role="status" className="fixed bottom-[calc(var(--nav-h)+16px)] left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs font-medium whitespace-nowrap text-canvas shadow-xl lg:bottom-8">
          {toast}
        </div>
      )}
    </div>
  );
}

function Tile({ link, onSoon }: { link: NavLink; onSoon: () => void }) {
  const { t } = useLang();
  const off = Boolean(link.comingSoon);
  const body = (
    <>
      {off && <span className="absolute end-1 top-1 rounded bg-panel-2 px-1 py-px text-[8px] font-semibold text-ink-3">{t(link.badgeBn || "শীঘ্রই", link.badgeEn || "Soon")}</span>}
      <link.icon className="h-[30px] w-[30px] transition-transform group-hover:scale-110" style={{ color: off ? undefined : link.tone }} strokeWidth={1.8} />
      <span className="line-clamp-2 px-1 text-center text-[11.5px] leading-tight font-semibold text-ink">{t(link.bn, link.en)}</span>
    </>
  );
  const cls = cn(
    "group relative flex aspect-[0.9] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-panel transition active:scale-95",
    off ? "opacity-45" : "hover:border-brand/40 hover:shadow-[0_8px_20px_-16px_rgba(0,0,0,0.35)]",
  );

  if (off)
    return (
      <button type="button" onClick={onSoon} className={cls} aria-label={t(link.bn, link.en)}>
        {body}
      </button>
    );
  if (link.external)
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  return (
    <Link href={link.href} className={cls}>
      {body}
    </Link>
  );
}

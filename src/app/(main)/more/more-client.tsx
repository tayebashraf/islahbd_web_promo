"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronRight,
  HandHeart,
  Mic2,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { ToneIcon } from "@/components/dashboard/shell";
import { PageHeader } from "@/components/dashboard/ui";
import { useLang } from "@/components/providers/lang-provider";
import { LINKS, NAV_GROUPS, type NavLink } from "@/lib/nav";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

interface GroupConfig {
  key: string;
  bn: string;
  en: string;
  descBn: string;
  descEn: string;
  icon: LucideIcon;
  links: NavLink[];
}

export function MoreClient() {
  const { t, lang } = useLang();
  const [q, setQ] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const groups: GroupConfig[] = useMemo(
    () => [
      {
        key: "worship",
        bn: "ইবাদত ও আমল",
        en: "Worship & Daily Deeds",
        descBn: "দৈনন্দিন নামাজ, কিবলা, দোয়া, তাসবীহ ও যিকির-আযকার",
        descEn: "Daily prayer times, qibla, duas and remembrance",
        icon: HandHeart,
        links: [
          LINKS.prayer,
          LINKS.qibla,
          LINKS.tasbeeh,
          LINKS.dua,
          LINKS.sunnat,
          LINKS.wazifa,
          LINKS.hajj,
          LINKS.zakat,
          LINKS.mosque,
        ],
      },
      {
        key: "knowledge",
        bn: "ইলম ও জিজ্ঞাসা",
        en: "Knowledge & Guidance",
        descBn: "পবিত্র কুরআন, আমার জিজ্ঞাসা, লাইব্রেরি, মালফুযাত ও প্রবন্ধ",
        descEn: "Holy Quran, questions, library, sayings and articles",
        icon: BookOpen,
        links: [
          LINKS.quran,
          LINKS.fatwa, // আমার জিজ্ঞাসা (পূর্বে শরঈ জিজ্ঞাসা)
          LINKS.amal,
          LINKS.fazilat,
          LINKS.munajat,
          LINKS.library,
          LINKS.malfuzat,
          LINKS.poems,
          LINKS.calendar,
          LINKS.ramadan,
          LINKS.blog,
        ],
      },
      {
        key: "media",
        bn: "অডিও, ভিডিও ও মিডিয়া",
        en: "Audio, Video & Media",
        descBn: "ইসলাহী বয়ান, সরাসরি মজলিস, নাশিদ ও লাইভ সম্প্রচার",
        descEn: "Islamic talks, live majlis, nasheeds and broadcasts",
        icon: Mic2,
        links: [
          LINKS.boyan,
          LINKS.live,
          LINKS.nasheed,
          LINKS.clips, // শর্ট ক্লিপ (শীঘ্রই আসছে)
          LINKS.holySites,
          LINKS.gallery,
          LINKS.wallpaper,
        ],
      },
      {
        key: "institution",
        bn: "মারকাযুল ইহসান ও খিদমত",
        en: "Markazul Ihsan & Khidmat",
        descBn: "পরিবার ও হযরতের পরিচিতি, আজীবন সদস্য ও খিদমত ফান্ড",
        descEn: "The Shaykh, Jamia profile, membership & welfare fund",
        icon: Building2,
        links: [
          LINKS.paribar,
          LINKS.about,
          LINKS.member,
          LINKS.khidmat,
          LINKS.notices,
        ],
      },
    ],
    [],
  );

  const totalLinks = useMemo(
    () => groups.reduce((acc, g) => acc + g.links.length, 0),
    [groups],
  );

  // Search filtering
  const needle = q.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!needle) return null;
    const all = groups.flatMap((g) => g.links);
    return all.filter(
      (l) =>
        l.bn.toLowerCase().includes(needle) ||
        l.en.toLowerCase().includes(needle) ||
        l.descBn.toLowerCase().includes(needle) ||
        l.descEn.toLowerCase().includes(needle),
    );
  }, [groups, needle]);

  return (
    <div className="mx-auto max-w-[1080px] space-y-7 pb-16">
      {/* ── Page Header ── */}
      <PageHeader
        eyebrow={t("সকল দ্বীনি সেবা ও রিসোর্স", "All Islamic Features & Resources")}
        title={t("অন্যান্য", "More")}
        muted={t(
          `মোট ${num(totalLinks, lang)}টি ফিচার ও সেবা`,
          `${totalLinks} features & services in total`,
        )}
        description={t(
          "ইসলাহ অ্যাপের যাবতীয় দ্বীনি সেবা, কুরআন, আমল, লাইব্রেরি ও খিদমত এক নজরে।",
          "Explore all features, worship tools, Islamic books and community services in one place.",
        )}
      />

      {/* ── Search Bar ── */}
      <div className="relative">
        <label className="flex h-11 w-full items-center gap-3 rounded-2xl border border-line bg-panel px-4 text-sm shadow-xs transition-colors focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/15">
          <Search className="h-4 w-4 shrink-0 text-brand" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(
              "যেকোনো ফিচার, আমল বা সেবা খুঁজুন…",
              "Search any feature, deed or service…",
            )}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label={t("মুছে ফেলুন", "Clear")}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-panel-2 text-ink-3 hover:text-ink"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </label>
      </div>

      {/* ── Search Results View ── */}
      {searchResults !== null ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-ink">
              {t(
                `খোঁজার ফলাফল (${num(searchResults.length, lang)}টি)`,
                `Search Results (${searchResults.length})`,
              )}
            </h2>
            <button
              type="button"
              onClick={() => setQ("")}
              className="text-xs text-brand hover:underline"
            >
              {t("সব দেখুন", "Show all")}
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-3xl border border-line bg-panel p-8 text-center text-sm text-ink-3">
              {t("কোনো ফিচার পাওয়া যায়নি।", "No features found.")}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((link) => (
                <FeatureCard
                  key={link.href}
                  link={link}
                  onComingSoon={() =>
                    showToast(
                      t(
                        `“${link.bn}” সেবাটি শীঘ্রই চালু হচ্ছে, ইনশাআল্লাহ!`,
                        `"${link.en}" is coming soon, Insha'Allah!`,
                      ),
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* ── Categorized Sections (শিরোনাম আকারে আকারে যাবতীয় বিষয়) ── */
        <div className="space-y-8">
          {groups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section key={group.key} className="space-y-3.5">
                {/* ── Section Title Header ── */}
                <div className="flex items-center justify-between border-b border-line/70 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <GroupIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-base font-bold text-ink sm:text-lg">
                        {t(group.bn, group.en)}
                      </h2>
                      <p className="text-xs text-ink-3 sm:block">
                        {t(group.descBn, group.descEn)}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-panel-2 px-2.5 py-0.5 font-num text-[11px] font-medium text-ink-3">
                    {num(group.links.length, lang)}টি
                  </span>
                </div>

                {/* ── Grid of Feature Cards ── */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.links.map((link) => (
                    <FeatureCard
                      key={link.href}
                      link={link}
                      onComingSoon={() =>
                        showToast(
                          t(
                            `“${link.bn}” সেবাটি শীঘ্রই চালু হচ্ছে, ইনশাআল্লাহ!`,
                            `"${link.en}" is coming soon, Insha'Allah!`,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-canvas shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 sm:bottom-8">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// ── Individual Feature Card Component ─────────────────────────────

function FeatureCard({
  link,
  onComingSoon,
}: {
  link: NavLink;
  onComingSoon: () => void;
}) {
  const { t } = useLang();
  const isComingSoon = Boolean(link.comingSoon);

  const innerContent = (
    <div
      className={cn(
        "group relative flex items-center justify-between gap-3 rounded-2xl border border-line bg-panel p-3.5 transition-all sm:p-4",
        isComingSoon
          ? "cursor-pointer opacity-85 hover:border-amber-500/40 hover:bg-amber-500/[0.03]"
          : "hover:-translate-y-0.5 hover:border-brand/40 hover:bg-panel-2/50 hover:shadow-sm",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Tone Icon */}
        <ToneIcon
          link={link}
          size="md"
          className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        />

        {/* Text Information */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-ink group-hover:text-brand">
              {t(link.bn, link.en)}
            </span>

            {/* Coming Soon Badge (যাকাত ক্যালকুলেটর ও শর্ট ক্লিপ এর জন্য) */}
            {isComingSoon && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                <Sparkles className="h-2.5 w-2.5" />
                <span>{t(link.badgeBn || "শীঘ্রই আসছে", link.badgeEn || "Coming Soon")}</span>
              </span>
            )}
          </div>

          <p className="truncate text-xs text-ink-3">
            {t(link.descBn, link.descEn)}
          </p>
        </div>
      </div>

      {/* Action Arrow Indicator */}
      <div className="shrink-0 text-ink-3 transition-colors group-hover:text-brand">
        {link.external ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </div>
    </div>
  );

  // If coming soon, intercept click to show helpful toast
  if (isComingSoon) {
    return (
      <div onClick={onComingSoon} role="button" tabIndex={0}>
        {innerContent}
      </div>
    );
  }

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {innerContent}
      </a>
    );
  }

  return <Link href={link.href}>{innerContent}</Link>;
}

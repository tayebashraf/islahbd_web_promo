"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  HeartHandshake,
  MapPin,
  Maximize2,
  Megaphone,
  Radio,
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import type { Notice } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, PageHeader } from "@/components/dashboard/ui";
import { formatDate, num, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

// Category definitions
type CategoryKey = "all" | "ijtema" | "member" | "boyan";

function detectCategory(n: Notice): { key: CategoryKey; labelBn: string; labelEn: string; color: string } {
  const text = `${n.title} ${n.description}`;
  if (text.includes("আজীবন সদস্য") || text.includes("সদস্য সংগ্রহ")) {
    return {
      key: "member",
      labelBn: "আজীবন সদস্য",
      labelEn: "Lifetime Member",
      color: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    };
  }
  if (text.includes("ইজতেমা") || text.includes("তরবিয়তী") || text.includes("তরবিয়তি") || text.includes("মজলিস")) {
    return {
      key: "ijtema",
      labelBn: "ইজতেমা ও মজলিস",
      labelEn: "Ijtema & Majlis",
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    };
  }
  if (text.includes("জুমার বয়ান") || text.includes("জুমার বয়ান") || text.includes("খুতবা")) {
    return {
      key: "boyan",
      labelBn: "জুমার বয়ান",
      labelEn: "Jummah Boyan",
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    };
  }
  return {
    key: "all",
    labelBn: "বিশেষ বার্তা",
    labelEn: "Announcement",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  };
}

function resolveNoticeTitle(n: Notice): { title: string; subtitle?: string; cleanBody: string } {
  const rawDesc = n.description.trim();
  const lines = rawDesc.split("\n").map((l) => l.trim()).filter(Boolean);

  // If a specific meaningful title is already present in DB
  if (n.title && n.title.toLowerCase() !== "notice") {
    return { title: n.title, cleanBody: rawDesc };
  }

  // Notice 14: Lifetime member notice
  if (rawDesc.includes("আজীবন সদস্য সংগ্রহ সপ্তাহ")) {
    const bodyLines = lines.filter(
      (l) => !l.includes("শিক্ষা প্রতিষ্ঠান") && !l.includes("আজীবন সদস্য সংগ্রহ"),
    );
    return {
      title: 'দ্বীনি শিক্ষা প্রতিষ্ঠান "জামেআ মারকাযুল ইহসান ঢাকা"-এর আজীবন সদস্য সংগ্রহ সপ্তাহ',
      cleanBody: bodyLines.join("\n\n"),
    };
  }

  // Notice 12: Monthly Ijtema August
  if (rawDesc.includes("তরবিয়তি মজলিস তথা মাসিক ইজতেমা") || rawDesc.includes("তরবিয়তী মজলিস")) {
    const bodyLines = lines.filter(
      (l) =>
        !l.includes("শায়েখ") &&
        !l.includes("দ্বীনি শিক্ষা প্রতিষ্ঠান") &&
        !l.includes("জামেয়া মারকাযুল ইহসান, ঢাকা") &&
        !l.includes("তরবিয়তি মজলিস তথা"),
    );
    return {
      title: "তরবিয়তি মজলিস তথা মাসিক ইজতেমা",
      subtitle: "জামেআ মারকাযুল ইহসান ঢাকা • পাইটি, ডেমরা",
      cleanBody: bodyLines.join("\n\n"),
    };
  }

  // Notice 10: Special Date Reminder
  if (rawDesc.includes("আজ ১৮ ই জুন ২০২৬")) {
    const bodyLines = lines.filter((l) => !l.startsWith("আজ ১৮ ই জুন"));
    return {
      title: "আজ ১৮ ই জুন ২০২৬ বৃহস্পতিবার — ইসলাহী ইজতেমা ও বিশেষ বার্তা",
      cleanBody: bodyLines.join("\n\n"),
    };
  }

  // General fallback from first lines
  if (lines.length > 0) {
    let titleCandidate = lines[0];
    let bodyLines = lines.slice(1);
    if (lines.length > 1 && titleCandidate.length < 40 && !titleCandidate.endsWith("।")) {
      titleCandidate = `${titleCandidate} ${lines[1]}`;
      bodyLines = lines.slice(2);
    }
    return {
      title: titleCandidate,
      cleanBody: bodyLines.join("\n\n"),
    };
  }

  return { title: "জামেআ মারকাযুল ইহসান ঘোষণা", cleanBody: rawDesc };
}

export function NoticesClient({ notices }: { notices: Notice[] }) {
  const { t, lang } = useLang();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const categories: { key: CategoryKey; bn: string; en: string }[] = [
    { key: "all", bn: "সব নোটিশ", en: "All Notices" },
    { key: "ijtema", bn: "ইজতেমা ও মজলিস", en: "Ijtema & Majlis" },
    { key: "member", bn: "আজীবন সদস্য", en: "Lifetime Member" },
    { key: "boyan", bn: "জুমার বয়ান", en: "Jummah Boyan" },
  ];

  // Filtering
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const cat = detectCategory(n);
      if (activeCategory !== "all" && cat.key !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const text = `${n.title} ${n.description}`.toLowerCase();
        return text.includes(query);
      }
      return true;
    });
  }, [notices, activeCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-[780px] space-y-6 pb-16">
      <PageHeader
        eyebrow={t("সর্বশেষ ঘোষণা", "Latest Announcements")}
        title={t("নোটিশ বোর্ড", "Notice Board")}
        muted={t(
          `জামেআ মারকাযুল ইহসান ঢাকা • মোট ${num(notices.length, lang)}টি নোটিশ`,
          `Jamea Markazul Ihsan Dhaka • ${notices.length} notices`,
        )}
      />

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("নোটিশ বা বিষয়বস্তু খুঁজুন...", "Search notices or keywords...")}
            className="h-11 w-full rounded-2xl border border-line bg-panel pl-10 pr-4 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => {
            const active = activeCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition active:scale-95",
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "border border-line bg-panel text-ink hover:border-brand/40",
                )}
              >
                {t(c.bn, c.en)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notice List */}
      {filteredNotices.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={t("কোনো নোটিশ পাওয়া যায়নি", "No notices found")}
          hint={t(
            "অনুগ্রহ করে অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার পরিবর্তন করুন।",
            "Try searching with different keywords or clear the active filter.",
          )}
        />
      ) : (
        <div className="space-y-8">
          {filteredNotices.map((n, i) => (
            <NoticeCard
              key={n.id}
              notice={n}
              isNew={i === 0 && !searchQuery && activeCategory === "all"}
              onZoomImage={(url, title) => setLightboxImage({ url, title })}
              onShareSuccess={(msg) => showToast(msg)}
            />
          ))}
        </div>
      )}

      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-md animate-in fade-in sm:p-6"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative flex max-h-[96vh] max-w-[96vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="mb-2 flex w-full items-center justify-between gap-4 px-2 text-white">
              <span className="truncate text-xs font-medium text-white/80 sm:text-sm">
                {lightboxImage.title}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  title="ছবি ডাউনলোড বা নতুন ট্যাবে খুলুন"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="বন্ধ করুন"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image */}
            <div className="overflow-hidden rounded-2xl bg-black/40 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[82vh] max-w-[92vw] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-ink px-4 py-2.5 text-xs font-semibold text-canvas shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// ── Individual Notice Card Component ─────────────────────────────

function NoticeCard({
  notice,
  isNew,
  onZoomImage,
  onShareSuccess,
}: {
  notice: Notice;
  isNew: boolean;
  onZoomImage: (url: string, title: string) => void;
  onShareSuccess: (msg: string) => void;
}) {
  const { t, lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const category = detectCategory(notice);
  const { title, subtitle, cleanBody } = resolveNoticeTitle(notice);

  // Long notice detection
  const isLong = cleanBody.length > 500;
  const displayBody = isLong && !expanded ? cleanBody.slice(0, 480) + "..." : cleanBody;

  // Handle Share
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://islahbd.com/notices";
    const shareData = {
      title,
      text: `${title}\n\n${cleanBody.slice(0, 150)}...\n\nবিস্তারিত দেখুন:`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        onShareSuccess(t("সফলভাবে শেয়ার করা হয়েছে", "Notice shared successfully"));
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${title}\n${url}`);
      setCopied(true);
      onShareSuccess(t("নোটিশের লিঙ্ক কপি করা হয়েছে", "Notice link copied to clipboard"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignored
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-panel shadow-sm transition hover:shadow-md">
      {/* ── 1. Top Image Banner (মোবাইল ভিউতে উপরে সুন্দর ছবি) ── */}
      {notice.imageUrl && (
        <div className="relative w-full overflow-hidden border-b border-line/60 bg-neutral-900/5 dark:bg-neutral-950/40">
          {/* Natural flyer container: never crop poster text */}
          <div
            className="group relative flex w-full cursor-pointer items-center justify-center p-2 sm:p-4"
            onClick={() => onZoomImage(notice.imageUrl!, title)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={notice.imageUrl}
              alt={title}
              loading="lazy"
              className="h-auto max-h-[580px] w-full rounded-2xl object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Floating Top-Left Date Tag */}
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md sm:left-6 sm:top-6">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{formatDate(notice.date, lang)}</span>
            </span>

            {/* Floating Top-Right New Tag */}
            {isNew && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-md sm:right-6 sm:top-6">
                <Sparkles className="h-3 w-3" />
                <span>{t("নতুন ঘোষণা", "New")}</span>
              </span>
            )}

            {/* Floating Bottom-Right Zoom Hint */}
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white opacity-90 shadow-sm backdrop-blur-md transition group-hover:opacity-100 sm:bottom-6 sm:right-6">
              <Maximize2 className="h-3.5 w-3.5" />
              <span>{t("বড় করে দেখুন", "Zoom")}</span>
            </span>
          </div>
        </div>
      )}

      {/* ── 2. Content Body (নিচে সুন্দর করে প্যারাগ্রাফ আকারে সাজিয়ে সবকিছু গুছিয়ে দাও) ── */}
      <div className="p-5 sm:p-7">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold",
                category.color,
              )}
            >
              {t(category.labelBn, category.labelEn)}
            </span>
            <span className="text-xs text-ink-3">
              {timeAgo(notice.date, lang)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 text-xs font-semibold text-ink-3 transition hover:text-brand"
            aria-label="শেয়ার করুন"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? t("কপি হয়েছে", "Copied") : t("শেয়ার", "Share")}</span>
          </button>
        </div>

        {/* Notice Title */}
        <h2 className="mt-3 text-lg font-bold leading-snug text-ink sm:text-xl lg:text-[22px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs font-medium text-ink-3">{subtitle}</p>
        )}

        {/* Structured Paragraphs */}
        <div className="mt-4 space-y-3.5 text-[15px] leading-[1.85] text-ink-2 sm:text-[16px]">
          <NoticeFormattedBody text={displayBody} />
        </div>

        {/* Read More / Read Less button for long text */}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand transition hover:underline"
          >
            <span>{expanded ? t("সংক্ষেপে দেখুন", "Show less") : t("সম্পূর্ণ নোটিশ পড়ুন", "Read full notice")}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </button>
        )}

        {/* Action Footer (Links & Downloads) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {notice.imageUrl && (
              <button
                type="button"
                onClick={() => onZoomImage(notice.imageUrl!, title)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel-2/60 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
              >
                <Maximize2 className="h-3.5 w-3.5 text-brand" />
                <span>{t("পোস্টার দেখুন", "View Poster")}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel-2/60 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
            >
              <Share2 className="h-3.5 w-3.5 text-brand" />
              <span>{t("শেয়ার করুন", "Share")}</span>
            </button>
          </div>

          {/* Deep link CTA for Lifetime Member notices */}
          {cleanBody.includes("lifetime-member") || cleanBody.includes("আজীবন সদস্য") ? (
            <Link
              href="/lifetime-member"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-strong active:scale-95"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>{t("আজীবন সদস্য ফরম", "Apply Online")}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : cleanBody.includes("তরবিয়তী") || cleanBody.includes("ইজতেমা") ? (
            <Link
              href="/listen"
              className="inline-flex items-center gap-1.5 rounded-xl bg-live px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 active:scale-95"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>{t("লাইভ শুনুন", "Listen Live")}</span>
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// ── Smart Body Parser Component ──────────────────────────────────
// Turns raw notice text into well-spaced paragraphs, lists, tiers, and clickable CTAs

function NoticeFormattedBody({ text }: { text: string }) {
  const { t } = useLang();

  // Extract all donation tier lines (amount + টাকা)
  const allLines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const tierLines = allLines.filter((l) => /^[\d,০-৯]+\s*টাকা$/u.test(l));
  const hasTiers = tierLines.length >= 2;

  // Filter out tier lines from raw text so they render once in a unified grid box
  const filteredText = hasTiers
    ? text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => !/^[\d,০-৯]+\s*টাকা$/u.test(l) && l !== "অনলাইন ফরম")
        .join("\n")
    : text;

  // Split into distinct blocks by double newline or single newline
  const paragraphs = filteredText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((p, idx) => {
        const rawLines = p.split("\n").map((l) => l.trim()).filter(Boolean);


        // Check if paragraph is a bullet list (starts with ★ or • or -)
        const isBulletBlock = rawLines.every((l) => /^[★•\-\*]/u.test(l));
        if (isBulletBlock && rawLines.length > 1) {
          return (
            <ul key={idx} className="my-2 space-y-2">
              {rawLines.map((item, bidx) => {
                const cleaned = item.replace(/^[★•\-\*]\s*/u, "");
                return (
                  <li key={bidx} className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                      ★
                    </span>
                    <span className="flex-1 text-ink-2">{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Check if paragraph is an event timing / location line (e.g. তারিখ: ..., স্থানে: ...)
        const hasEventMeta = rawLines.some(
          (l) =>
            l.startsWith("তারিখ:") ||
            l.startsWith("স্থানে:") ||
            l.startsWith("আগামী তারিখ:") ||
            l.startsWith("স্থান :") ||
            l.startsWith("সময়:"),
        );
        if (hasEventMeta) {
          return (
            <div key={idx} className="my-3 rounded-2xl border border-emerald-600/20 bg-emerald-600/5 p-4">
              <div className="space-y-2 text-sm">
                {rawLines.map((l, lidx) => {
                  const isTime = l.includes("সময়") || l.includes("আসর") || l.includes("তারিখ");
                  const Icon = isTime ? Clock : MapPin;
                  return (
                    <div key={lidx} className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                      <span className="font-semibold text-ink">{l}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Check for isolated URL or link
        const urlMatch = p.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          const url = urlMatch[0];
          const isLifetime = url.includes("lifetime-member");
          const cleanedText = p.replace(url, "").trim();
          return (
            <div key={idx} className="my-3 space-y-2">
              {cleanedText && <p className="text-ink-2">{cleanedText}</p>}
              <Link
                href={isLifetime ? "/lifetime-member" : url}
                target={isLifetime ? undefined : "_blank"}
                rel={isLifetime ? undefined : "noopener noreferrer"}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-strong"
              >
                <span>
                  {isLifetime ? t("অনলাইনে আবেদন ফরম পূরণ করুন", "Fill Online Application Form") : url}
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        }

        // Standard Paragraph with regular text
        return (
          <p key={idx} className="leading-relaxed text-ink-2">
            {p}
          </p>
        );
      })}

      {/* Unified Donation Tier Grid */}
      {hasTiers && (
        <div className="my-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
          <span className="block text-xs font-bold tracking-wide text-amber-800 dark:text-amber-300">
            {t("বার্ষিক অনুদানের পরিমাণসমূহ (যেকোনো একটি বেছে নিতে পারেন):", "Annual Contribution Tiers:")}
          </span>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {tierLines.map((amt, aidx) => (
              <div
                key={aidx}
                className="flex items-center justify-center rounded-xl border border-amber-500/20 bg-panel px-3 py-2 font-mono text-sm font-bold text-ink shadow-2xs"
              >
                {amt}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

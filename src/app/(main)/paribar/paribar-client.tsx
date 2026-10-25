"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle2, Copy, ExternalLink, Loader2, Send } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { Panel, Segmented } from "@/components/dashboard/ui";
import { Blocks } from "@/components/book/blocks";
import { BAIYAT, BIO, DONATION, MISSION, SHAYKH, SOCIAL } from "@/data/paribar";
import { applyParibar, type ParibarApplication } from "@/lib/api";
import { cn } from "@/lib/utils";

type SectionId = "bio" | "mission" | "baiyat" | "apply";

const SECTIONS: { id: SectionId; bn: string; en: string }[] = [
  { id: "bio", bn: "পরিচিতি ও জীবনী", en: "Biography" },
  { id: "mission", bn: "লক্ষ্য ও উদ্দেশ্য", en: "Mission" },
  { id: "baiyat", bn: "বায়আত দিকনির্দেশনা", en: "On Bay'ah" },
  { id: "apply", bn: "আবেদন করুন", en: "Apply" },
];

const SOCIAL_PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    bn: "ইউটিউব চ্যানেল",
    en: "YouTube Channel",
    subBn: "ভিডিও বয়ান ও সরাসরি লাইভ",
    subEn: "Video Talks & Live Broadcasts",
    handle: "@islahbd",
    actionBn: "সাবস্ক্রাইব",
    actionEn: "Subscribe",
    url: "https://www.youtube.com/@islahbd",
    iconBg: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white",
    borderHover: "hover:border-red-500/40 hover:shadow-[0_8px_30px_-12px_rgba(239,68,68,0.35)]",
    path: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15V9l5.8 3-5.8 3Z",
  },
  {
    id: "facebook",
    name: "Facebook",
    bn: "ফেসবুক পেইজ",
    en: "Facebook Page",
    subBn: "নিয়মিত পোস্ট, আপডেট ও লাইভ",
    subEn: "Regular Posts, Updates & Live",
    handle: "islahiboyanBD",
    actionBn: "ফলো করুন",
    actionEn: "Follow",
    url: "https://www.facebook.com/islahiboyanBD",
    iconBg: "bg-blue-500/10 text-[#1877F2] dark:bg-blue-500/15 dark:text-blue-400 group-hover:bg-[#1877F2] group-hover:text-white",
    borderHover: "hover:border-blue-500/40 hover:shadow-[0_8px_30px_-12px_rgba(24,119,242,0.35)]",
    path: "M13.5 21.9v-7.7h2.6l.4-3h-3V9.3c0-.9.3-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.7h3.1Z",
  },
  {
    id: "telegram",
    name: "Telegram",
    bn: "টেলিগ্রাম চ্যানেল",
    en: "Telegram Channel",
    subBn: "অডিও বয়ান ও কিতাবের পিডিএফ",
    subEn: "Audio Talks & PDF Books",
    handle: "@eslahiboyanbd",
    actionBn: "জয়েন করুন",
    actionEn: "Join",
    url: "https://t.me/eslahiboyanbd",
    iconBg: "bg-sky-500/10 text-[#229ED9] dark:bg-sky-500/15 dark:text-sky-400 group-hover:bg-[#229ED9] group-hover:text-white",
    borderHover: "hover:border-sky-500/40 hover:shadow-[0_8px_30px_-12px_rgba(34,158,217,0.35)]",
    path: "M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.4ZM9.2 14.1l9-5.7c.4-.3.8-.1.5.2l-7.7 7-.3 3.2-1.5-4.7Z",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    bn: "হোয়াটসঅ্যাপ গ্রুপ",
    en: "WhatsApp Group",
    subBn: "জরুরি নোটিশ ও দিকনির্দেশনা",
    subEn: "Important Notices & Guidance",
    handle: "Islah Community",
    actionBn: "যুক্ত হন",
    actionEn: "Join",
    url: "https://chat.whatsapp.com/EneCvgXzrNtFFuHGz4ENzj",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
    borderHover: "hover:border-emerald-500/40 hover:shadow-[0_8px_30px_-12px_rgba(16,185,129,0.35)]",
    path: "M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm5.7 13.8c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.3.1.2.1.7-.1 1.3Z",
  },
];

export function ParibarClient({ initialTab }: { initialTab?: string }) {
  const { t } = useLang();
  const [activeSec, setActiveSec] = useState<SectionId>(
    SECTIONS.some((s) => s.id === initialTab) ? (initialTab as SectionId) : "bio"
  );

  const scrollTo = (id: SectionId) => {
    setActiveSec(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (initialTab && SECTIONS.some((s) => s.id === initialTab)) {
      const el = document.getElementById(initialTab);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
      }
    }
  }, [initialTab]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Welcome Card: Shaykh's Profile (Social links moved to bottom per user request) */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-[linear-gradient(180deg,var(--canvas-2),var(--panel))] px-5 py-8 text-center sm:py-12">
        <Image
          src="/icon-192.png"
          alt=""
          width={72}
          height={72}
          className="mx-auto h-16 w-16 rounded-2xl ring-4 ring-brand-soft"
        />
        <p className="mt-4 text-[15px] font-medium text-brand">{SHAYKH.welcome}</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-2">{SHAYKH.line}</p>
        <h1 className="mt-2 font-heading text-[28px] font-bold text-ink sm:text-[36px]">{SHAYKH.name}</h1>
        <p className="mt-1 text-[15px] text-gold">{SHAYKH.honor}</p>
      </section>

      {/* Sticky Navigation Pills for Smooth-scrolling across sections */}
      <nav aria-label={t("সেকশনসমূহ", "Sections")} className="sticky top-16 z-20 -mx-4 border-y border-line/60 bg-canvas/95 px-4 py-2.5 backdrop-blur-xl sm:top-[72px] sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        <div className="scroll-hide flex items-center justify-start gap-1.5 overflow-x-auto sm:justify-center">
          {SECTIONS.map((s) => {
            const active = activeSec === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition",
                  active
                    ? "bg-brand font-semibold text-white shadow-xs"
                    : "bg-panel text-ink-2 hover:bg-panel-2 hover:text-ink"
                )}
              >
                {t(s.bn, s.en)}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sequential Flow: All 4 Sections rendered vertically in continuous reading order */}
      <div className="space-y-8">
        {/* Section 1: Biography */}
        <section id="bio" className="scroll-mt-32">
          <Panel className="p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
              <span className="h-5 w-1.5 rounded-full bg-brand" />
              <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                {t("পরিচিতি ও জীবনী", "Biography")}
              </h2>
            </div>
            <Blocks blocks={BIO} />
          </Panel>
        </section>

        {/* Section 2: Mission */}
        <section id="mission" className="scroll-mt-32">
          <Panel className="p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
              <span className="h-5 w-1.5 rounded-full bg-brand" />
              <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                {t("লক্ষ্য ও উদ্দেশ্য", "Mission & Goals")}
              </h2>
            </div>
            <Blocks blocks={MISSION} />
          </Panel>
        </section>

        {/* Section 3: Bay'ah Guidelines */}
        <section id="baiyat" className="scroll-mt-32">
          <Panel className="p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
              <span className="h-5 w-1.5 rounded-full bg-brand" />
              <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                {t("বায়আত সংক্রান্ত দিকনির্দেশনা", "Guidelines on Bay'ah")}
              </h2>
            </div>
            <Blocks blocks={BAIYAT} />
            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-ink-3">
                {t("বায়আত হতে ইচ্ছুক হলে নিচের আবেদন ফরম পূরণ করুন।", "Fill out the form below to apply for bay'ah.")}
              </p>
              <button
                onClick={() => scrollTo("apply")}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-strong"
              >
                <span>{t("বায়আত হতে আবেদন করুন ↓", "Apply for Bay'ah ↓")}</span>
              </button>
            </div>
          </Panel>
        </section>

        {/* Section 4: Application Forms */}
        <section id="apply" className="scroll-mt-32">
          <Panel className="p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
              <span className="h-5 w-1.5 rounded-full bg-brand" />
              <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">
                {t("আবেদন ফরম", "Application Forms")}
              </h2>
            </div>
            <ApplyForms />
          </Panel>
        </section>
      </div>

      {/* Section 5: Official Social Channels (Redesigned with brand icons & interactive cards) */}
      <section className="rounded-3xl border border-line bg-panel p-5 sm:p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-semibold text-brand">
            <Send className="h-3.5 w-3.5" />
            <span>{t("অফিসিয়াল যোগাযোগ", "Official Channels")}</span>
          </div>
          <h2 className="mt-3 font-heading text-xl font-bold text-ink sm:text-2xl">
            {t("অফিসিয়াল সোশ্যাল মিডিয়া ও চ্যানেল", "Official Social Media & Channels")}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-ink-3">
            {t(
              "শায়খের বয়ান, নসিহত ও আপডেট সরাসরি পেতে অফিসিয়াল চ্যানেলগুলোতে যুক্ত থাকুন।",
              "Connect with the official channels to receive talks, advice, and updates."
            )}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          {SOCIAL_PLATFORMS.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative flex items-center justify-between gap-3 rounded-2xl border border-line bg-panel-2/60 p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-panel active:scale-[0.99]",
                s.borderHover
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 shadow-xs",
                    s.iconBg
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold text-ink group-hover:text-brand transition-colors">
                    {t(s.bn, s.en)}
                  </h3>
                  <p className="truncate text-xs text-ink-3 mt-0.5">
                    {t(s.subBn, s.subEn)}
                  </p>
                  <span className="font-num text-[11px] text-ink-3/80 font-medium">
                    {s.handle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 rounded-full bg-panel border border-line/80 px-3 py-1.5 text-xs font-semibold text-ink-2 group-hover:border-brand/40 group-hover:bg-brand group-hover:text-white transition-all shadow-2xs">
                <span>{t(s.actionBn, s.actionEn)}</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Retained for use in About page and anywhere else donation info is legitimately displayed. */
export function DonationCard() {
  const { t } = useLang();
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(v);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };
  const rows: [string, string, string][] = [
    ["বিকাশ / নগদ (পার্সোনাল)", "bKash / Nagad (personal)", DONATION.mobile],
    ["একাউন্ট নাম", "Account name", DONATION.accountName],
    ["একাউন্ট নম্বর", "Account number", DONATION.accountNumber],
    ["ব্যাংক", "Bank", DONATION.bank],
    ["শাখা", "Branch", DONATION.branch],
    ["রাউটিং নম্বর", "Routing number", DONATION.routing],
  ];
  return (
    <Panel>
      <p className="text-[16.5px] font-semibold text-ink">{t("মাদরাসায় অনুদান করুন", "Donate to the madrasa")}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">
        {t("আপনার অনুদান তোলাবায়ে কেরামের খেদমতে ব্যয় হয়।", "Your donation is spent in service of the students.")}
      </p>
      <ul className="mt-3 divide-y divide-line">
        {rows.map(([bn, en, v]) => (
          <li key={en} className="flex items-center gap-2 py-2">
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-ink-3">{t(bn, en)}</span>
              <span className="block truncate font-num text-[15px] text-ink" dir="ltr">
                {v}
              </span>
            </span>
            <button onClick={() => copy(v)} aria-label={t("কপি", "Copy")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel-2 text-brand">
              {copied === v ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </li>
        ))}
      </ul>
      <a
        href={`https://wa.me/${DONATION.contact.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex h-11 items-center justify-center rounded-xl bg-brand text-sm font-medium text-white"
      >
        {t("অনুদান পাঠিয়ে WhatsApp-এ রশিদ নিন", "Send a donation, then get a receipt on WhatsApp")}
      </a>
    </Panel>
  );
}

/* ── Application forms ────────────────────────────────────────── */

const DURATIONS = ["১ দিন", "৩ দিন", "১ সপ্তাহ", "১৫ দিন", "৪০ দিন (চিল্লা)"];

function ApplyForms() {
  const { t } = useLang();
  const [kind, setKind] = useState<"baiyat" | "khanqah">("baiyat");
  const [v, setV] = useState<Record<string, string>>({ duration: DURATIONS[0] });
  const [agree, setAgree] = useState({ food: false, bedding: false });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));
  const val = (k: string) => (v[k] ?? "").trim();

  const dob = val("dob") ? val("dob").split("-").reverse().join("/") : "";
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const app: ParibarApplication =
      kind === "baiyat"
        ? {
            applicationType: "baiyat",
            name: val("name"),
            fatherName: val("father"),
            education: val("education"),
            profession: val("profession"),
            dateOfBirth: dob,
            gram: val("gram"),
            upojla: val("upojla"),
            jela: val("jela"),
            dakghor: val("dakghor"),
            phone: val("phone"),
            familyPhone: val("familyPhone"),
            mediumName: val("mediumName"),
            mediumPhone: val("mediumPhone"),
          }
        : {
            applicationType: "khanqah",
            name: val("name"),
            fatherName: val("father"),
            dateOfBirth: dob,
            address: val("address"),
            phone: val("phone"),
            familyPhone: val("familyPhone"),
            duration: v.duration === "custom" ? `কাস্টম: ${val("days")} দিন` : v.duration,
            agreeFood: agree.food,
            agreeBedding: agree.bedding,
          };
    setState("sending");
    try {
      await applyParibar(app);
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done")
    return (
      <div className="py-10 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand" />
        <p className="mt-4 text-xl font-semibold text-ink">{t("আপনার আবেদনটি সফলভাবে জমা হয়েছে।", "Your application has been submitted.")}</p>
        <p className="mt-2 text-[15px] text-ink-2">{t("শীঘ্রই আপনার সাথে যোগাযোগ করা হবে, ইনশাআল্লাহ।", "We will contact you soon, in shaa Allah.")}</p>
        <button onClick={() => (setState("idle"), setV({ duration: DURATIONS[0] }))} className="mt-6 text-[15px] text-brand underline">
          {t("আরেকটি আবেদন করুন", "Submit another")}
        </button>
      </div>
    );

  const F = ({ k, bn, en, ph, type = "text", req = true, full }: { k: string; bn: string; en: string; ph?: string; type?: string; req?: boolean; full?: boolean }) => (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1.5 block text-[15px] text-ink-2">
        {t(bn, en)}
        {req && <span className="text-live"> *</span>}
      </span>
      <input
        type={type}
        required={req}
        value={v[k] ?? ""}
        onChange={set(k)}
        placeholder={ph}
        inputMode={type === "tel" ? "tel" : undefined}
        className="h-12 w-full rounded-xl border border-line bg-panel px-4 text-[16px] text-ink outline-none focus:border-brand"
      />
    </label>
  );

  return (
    <form onSubmit={submit}>
      <Segmented
        value={kind}
        onChange={setKind}
        options={[
          { value: "baiyat", label: t("বায়আত হওয়ার আবেদন", "Bay'ah application") },
          { value: "khanqah", label: t("খানকায় অবস্থানের আবেদন", "Khanqah stay application") },
        ]}
      />
      <p className="mt-4 text-sm text-ink-3">
        {kind === "baiyat"
          ? t("আত্মশুদ্ধি ও আত্মিক দিকনির্দেশনার জন্য আবেদন", "Apply for spiritual guidance and self-rectification")
          : t("খানকায়ে ইতিকাফ ও ইসলাহী অবস্থানের আবেদন", "Apply to stay at the khanqah for i'tikaf and islah")}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {F({ k: "name", bn: "আবেদনকারীর নাম", en: "Applicant's name", ph: t("আপনার পূর্ণ নাম", "Your full name") })}
        {F({ k: "father", bn: "পিতার নাম", en: "Father's name" })}
        {F({ k: "dob", bn: "জন্ম তারিখ", en: "Date of birth", type: "date" })}
        {kind === "baiyat" ? (
          <>
            {F({ k: "education", bn: "শিক্ষাগত যোগ্যতা", en: "Education", ph: t("যেমন: দাওরায়ে হাদীস / স্নাতক / এইচএসসি", "e.g. Dawrah / graduate / HSC") })}
            {F({ k: "profession", bn: "পেশা", en: "Profession", ph: t("যেমন: শিক্ষকতা / ব্যবসা / চাকরি", "e.g. teaching / business / job") })}
            {F({ k: "gram", bn: "গ্রাম", en: "Village" })}
            {F({ k: "dakghor", bn: "ডাকঘর", en: "Post office" })}
            {F({ k: "upojla", bn: "উপজেলা", en: "Upazila" })}
            {F({ k: "jela", bn: "জেলা", en: "District" })}
          </>
        ) : (
          F({ k: "address", bn: "পূর্ণ ঠিকানা", en: "Full address", ph: t("গ্রাম, ডাকঘর, উপজেলা, জেলা", "Village, post office, upazila, district"), full: true })
        )}
        {F({ k: "phone", bn: "নিজের মোবাইল নম্বর", en: "Your mobile number", type: "tel", ph: "01XXXXXXXXX" })}
        {F({ k: "familyPhone", bn: "পরিবারের নম্বর (ঐচ্ছিক)", en: "Family number (optional)", type: "tel", req: false })}
        {kind === "baiyat" ? (
          <>
            {F({ k: "mediumName", bn: "যার মাধ্যমে বায়আত হবেন — নাম", en: "Introducer's name" })}
            {F({ k: "mediumPhone", bn: "মাধ্যমের মোবাইল নম্বর", en: "Introducer's mobile", type: "tel" })}
          </>
        ) : (
          <>
            <label className="block">
              <span className="mb-1.5 block text-[15px] text-ink-2">{t("কতদিন খানকায় থাকবেন?", "How long will you stay?")}</span>
              <select value={v.duration} onChange={set("duration")} className="h-12 w-full rounded-xl border border-line bg-panel px-4 text-[16px] text-ink outline-none focus:border-brand">
                {DURATIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
                <option value="custom">{t("কাস্টম", "Custom")}</option>
              </select>
            </label>
            {v.duration === "custom" && F({ k: "days", bn: "দিনের সংখ্যা", en: "Number of days", type: "number" })}
            <Agree on={agree.food} onChange={(food) => setAgree((a) => ({ ...a, food }))} text={t("আমি সম্মত আছি যে খানকায় অবস্থানকালীন আমার খাবারের ব্যবস্থা আমাকে নিজ দায়িত্বে করতে হবে।", "I agree to arrange my own food during the stay.")} />
            <Agree on={agree.bedding} onChange={(bedding) => setAgree((a) => ({ ...a, bedding }))} text={t("থাকার ও ঘুমানোর জন্য প্রয়োজনীয় বিছানা-পত্র এবং অন্যান্য জিনিসপত্র আমি নিজ দায়িত্বে সাথে নিয়ে আসবো।", "I will bring my own bedding and other necessities.")} />
          </>
        )}
      </div>

      {state === "error" && <p className="mt-4 rounded-xl bg-live/10 p-3 text-sm text-live">{t("আবেদনটি জমা দেওয়া যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।", "Could not submit. Check your connection and try again.")}</p>}
      <button
        type="submit"
        disabled={state === "sending" || (kind === "khanqah" && !(agree.food && agree.bedding))}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[16px] font-medium text-white disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("আবেদন জমা দিন", "Submit application")}
      </button>
    </form>
  );
}

function Agree({ on, onChange, text }: { on: boolean; onChange: (v: boolean) => void; text: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 sm:col-span-2">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--brand)]" />
      <span className="text-[15px] leading-relaxed text-ink-2">{text}</span>
    </label>
  );
}

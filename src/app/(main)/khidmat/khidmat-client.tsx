"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Copy,
  ExternalLink,
  HandHeart,
  HeartHandshake,
  Landmark,
  MessageCircle,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel, PanelHeader } from "@/components/dashboard/ui";
import { DONATION } from "@/data/paribar";
import { LINKS } from "@/lib/nav";

export function KhidmatClient() {
  const { t } = useLang();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const openApp = (scheme: string, number: string, key: string) => {
    copy(number, key);
    // On mobile devices, attempt to trigger app intent
    if (typeof window !== "undefined") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = scheme;
      }
    }
  };

  return (
    <div className="mx-auto max-w-[880px] space-y-6 pb-12">
      <PageHeader
        title={t("তোলাবায়ে কেরামের খেদমত ফান্ড", "Talaba Khidmat & Zakat Fund")}
        muted={t(
          "জামেআ মারকাযুল ইহসান ঢাকা • যাকাত ও সাধারণ অনুদান",
          "Jamea Markazul Ihsan Dhaka • Zakat & General Donations",
        )}
      />

      {/* ── 1. Hero Notice Card ── */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-50/70 via-panel to-amber-50/40 p-5 shadow-sm sm:p-7 dark:from-emerald-950/20 dark:via-panel dark:to-amber-950/10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
            <HandHeart className="h-5 w-5" />
          </span>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Sparkles className="h-3 w-3" />
              {t("হযরতের সরাসরি তত্ত্বাবধানে পরিচালিত", "Under the direct supervision of the Shaykh")}
            </span>
            <h2 className="text-base font-bold text-ink sm:text-lg">
              {t("আসসালামু আলাইকুম", "Assalamu Alaikum")}
            </h2>
          </div>
        </div>

        <p className="mt-2 text-xs font-medium tracking-wide text-ink-3">
          {t(
            "জামেআর সম্মানিত শুভাকাঙ্খী ও প্রিয় আজীবন সদস্য,",
            "Honourable well-wishers and lifetime members of the Jamia,",
          )}
        </p>

        <p className="mt-3 text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">
          {t(
            "আপনাদের অবগতির জন্য জানানো যাচ্ছে যে, প্রতি বছর আপনাদের সার্বিক সহযোগিতায় মাদরাসার তোলাবায়ে কেরামের খেদমত ফান্ডে (যাকাত ফান্ডে) বিপুল পরিমাণ অর্থ ব্যয় করা হয়। আপনার আত্নীয়-স্বজন, বন্ধু-বান্ধব সহ মহতী এ খেদমতে শরীক হতে সচেষ্ট হবেন। আল্লাহপাক খুব তাওফীক দান করুন।",
            "Please be informed that each year, with your generous support, substantial funds are spent for the welfare of the madrasa's students (Zakat & Khidmat Fund). We warmly encourage you and your near and dear ones to partake in this noble service. May Allah grant abundant blessings.",
          )}
        </p>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
            <p className="text-sm leading-snug text-ink">
              {t(
                "আপনার আজীবন সদস্য অনুদান জমা না হয়ে থাকলে, এই সুযোগে জমা দিয়ে সওয়াব অর্জনের পথ সুগম করুন।",
                "If your lifetime member contribution is due, you may contribute now to reap enduring rewards.",
              )}
            </p>
          </div>
          <Link
            href={LINKS.member.href}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 active:scale-95"
          >
            <span>{t("আজীবন সদস্য সম্মেলন", "Lifetime Member")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ── 2. Mobile Banking Section ── */}
      <Panel className="p-5 sm:p-6">
        <PanelHeader
          icon={QrCode}
          title={t("মোবাইল ব্যাংকিং অনুদান", "Mobile Banking Donation")}
          subtitle={t(
            "বিকাশ বা নগদ পার্সোনাল নাম্বারে 'Send Money' করুন",
            "Send money to bKash or Nagad Personal number",
          )}
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* bKash Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#E2136E]/20 bg-gradient-to-br from-[#E2136E]/5 to-transparent p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#E2136E] px-2.5 py-1 text-xs font-bold text-white">
                bKash বিকাশ
              </span>
              <span className="text-xs font-medium text-ink-3">
                {t("পার্সোনাল", "Personal")}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-ink-3">{t("বিকাশ নম্বর", "bKash Number")}</span>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span className="font-mono text-xl font-bold tracking-wider text-ink sm:text-2xl" dir="ltr">
                  {DONATION.mobile}
                </span>
                <button
                  type="button"
                  onClick={() => copy(DONATION.mobile, "bkash")}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-line bg-panel px-3 text-xs font-semibold text-ink transition hover:border-[#E2136E] hover:text-[#E2136E]"
                  aria-label="বিকাশ নাম্বার কপি করুন"
                >
                  {copiedKey === "bkash" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-600">{t("কপি হয়েছে", "Copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{t("কপি", "Copy")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  openApp(
                    "intent://#Intent;package=com.bKash.customerapp;scheme=bkash;end",
                    DONATION.mobile,
                    "bkash",
                  )
                }
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#E2136E] text-xs font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-95"
              >
                <span>{t("বিকাশ অ্যাপে পাঠান", "Open bKash App")}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Nagad Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#F7941D]/25 bg-gradient-to-br from-[#F7941D]/5 to-transparent p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7941D] px-2.5 py-1 text-xs font-bold text-white">
                Nagad নগদ
              </span>
              <span className="text-xs font-medium text-ink-3">
                {t("পার্সোনাল", "Personal")}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-ink-3">{t("নগদ নম্বর", "Nagad Number")}</span>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span className="font-mono text-xl font-bold tracking-wider text-ink sm:text-2xl" dir="ltr">
                  {DONATION.mobile}
                </span>
                <button
                  type="button"
                  onClick={() => copy(DONATION.mobile, "nagad")}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-line bg-panel px-3 text-xs font-semibold text-ink transition hover:border-[#F7941D] hover:text-[#F7941D]"
                  aria-label="নগদ নাম্বার কপি করুন"
                >
                  {copiedKey === "nagad" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-600">{t("কপি হয়েছে", "Copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{t("কপি", "Copy")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  openApp(
                    "intent://#Intent;package=com.konasl.nagad;scheme=nagad;end",
                    DONATION.mobile,
                    "nagad",
                  )
                }
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F7941D] text-xs font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-95"
              >
                <span>{t("নগদ অ্যাপে পাঠান", "Open Nagad App")}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-ink-3">
          💡 {t(
            "মোবাইল ব্যাংকিংয়ে Send Money করার সময় রেফারেন্সে আপনার নাম বা মোবাইল নম্বর লিখে দিতে পারেন।",
            "When sending money via bKash or Nagad, you can add your name or mobile number in the reference.",
          )}
        </p>
      </Panel>

      {/* ── 3. Bank Account Card ── */}
      <Panel className="p-5 sm:p-6">
        <PanelHeader
          icon={Landmark}
          title={t("ব্যাংক অ্যাকাউন্ট ডিটেইলস", "Bank Account Details")}
          subtitle={t(
            "সরাসরি ব্যাংকের মাধ্যমে অথবা BEFTN / NPSB / অনলাইন ট্রান্সফার",
            "Direct bank deposit or BEFTN / NPSB / Online transfer",
          )}
        />

        <div className="mt-5 rounded-2xl border border-emerald-600/20 bg-emerald-600/5 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-ink sm:text-lg">
                {DONATION.bank}
              </p>
              <p className="text-xs text-ink-3">
                {DONATION.branch} • {DONATION.type}
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-line/70 rounded-xl border border-line bg-panel p-3 sm:p-4">
            {/* Account Name */}
            <div className="flex flex-col py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-xs text-ink-3">{t("অ্যাকাউন্ট নাম", "Account Name")}</span>
              <div className="mt-0.5 flex items-center justify-between gap-2 sm:mt-0">
                <span className="font-semibold text-ink sm:text-[15px]" dir="ltr">
                  {DONATION.accountName}
                </span>
                <button
                  type="button"
                  onClick={() => copy(DONATION.accountName, "accName")}
                  className="p-1 text-ink-3 hover:text-brand"
                  aria-label="অ্যাকাউন্ট নাম কপি"
                >
                  {copiedKey === "accName" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex flex-col py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {t("অ্যাকাউন্ট নম্বর", "Account Number")}
              </span>
              <div className="mt-0.5 flex items-center justify-between gap-3 sm:mt-0">
                <span className="font-mono text-lg font-bold tracking-wider text-ink sm:text-xl" dir="ltr">
                  {DONATION.accountNumber}
                </span>
                <button
                  type="button"
                  onClick={() => copy(DONATION.accountNumber, "accNum")}
                  className="flex h-8 items-center gap-1 rounded-lg border border-line bg-panel-2 px-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white dark:text-emerald-400"
                >
                  {copiedKey === "accNum" ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{t("কপি হয়েছে", "Copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{t("কপি", "Copy")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Routing Number */}
            <div className="flex flex-col py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-xs text-ink-3">{t("রাউটিং নম্বর", "Routing Number")}</span>
              <div className="mt-0.5 flex items-center justify-between gap-2 sm:mt-0">
                <span className="font-mono font-semibold text-ink sm:text-[15px]" dir="ltr">
                  {DONATION.routing}
                </span>
                <button
                  type="button"
                  onClick={() => copy(DONATION.routing, "routing")}
                  className="p-1 text-ink-3 hover:text-brand"
                  aria-label="রাউটিং নম্বর কপি"
                >
                  {copiedKey === "routing" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Branch */}
            <div className="flex flex-col py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-xs text-ink-3">{t("শাখা", "Branch")}</span>
              <span className="mt-0.5 font-medium text-ink sm:mt-0" dir="ltr">
                {DONATION.branch}
              </span>
            </div>
          </div>
        </div>
      </Panel>

      {/* ── 4. Receipt & Confirmation via WhatsApp / Call ── */}
      <Panel className="p-5 sm:p-6">
        <PanelHeader
          icon={ShieldCheck}
          title={t("রশিদ সংগ্রহের জন্য যোগাযোগ", "Receipt Collection & Contact")}
          subtitle={t(
            "অনুদান পাঠিয়ে নিম্নোক্ত নাম্বারে যোগাযোগ করে রশীদ সংগ্রহ করুন",
            "Contact below to receive your official receipt after donating",
          )}
        />

        <div className="mt-4 rounded-2xl border border-line bg-panel-2/50 p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-ink-2">
            {t(
              "যাকাত বা সাধারণ অনুদান পাঠানোর পর ট্রানজেকশনের স্ক্রিনশট বা মেসেজ নিম্নোক্ত নম্বরে হোয়াটসঅ্যাপে পাঠিয়ে নিশ্চিত করুন। অফিস থেকে আপনার নামে দ্রুত মানি রিসিট ইস্যু করা হবে ইনশাআল্লাহ।",
              "After transferring, send the screenshot or SMS via WhatsApp to receive your official donation receipt from the Madrasa administration, Insha'Allah.",
            )}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${DONATION.contact.replace(/\D/g, "")}?text=${encodeURIComponent(
                "আসসালামু আলাইকুম, আমি তোলাবায়ে কেরামের খেদমত ফান্ডে অনুদান পাঠিয়েছি। অনুগ্রহ করে মানি রিসিট প্রদান করুন।",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#20ba5a] active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{t("WhatsApp-এ রশীদ নিন", "Get Receipt on WhatsApp")}</span>
            </a>

            <a
              href={`tel:${DONATION.contact}`}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-panel px-5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:text-brand active:scale-95"
            >
              <Phone className="h-4 w-4" />
              <span className="font-mono" dir="ltr">{DONATION.contact}</span>
            </a>
          </div>
        </div>
      </Panel>

      {/* ── 5. Hadith on Charity ── */}
      <div className="rounded-2xl border border-line/60 bg-panel/60 p-5 text-center">
        <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
          {t("হাদিস শরীফ", "Prophetic Guidance")}
        </p>
        <blockquote className="mt-2 text-[15px] font-medium text-ink italic sm:text-[16px]">
          &ldquo;{t(
            "দান-সদকা সম্পদ কমায় না, বরং তা পবিত্র করে এবং বরকত বৃদ্ধি করে।",
            "Charity does not decrease wealth, rather it purifies it and increases blessings.",
          )}&rdquo;
        </blockquote>
        <p className="mt-1 text-xs text-ink-3">{t("— সহীহ মুসলিম", "— Sahih Muslim")}</p>
      </div>
    </div>
  );
}

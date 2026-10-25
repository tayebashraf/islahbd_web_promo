"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Copy, ExternalLink, HeartHandshake, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { Panel, Segmented } from "@/components/dashboard/ui";
import { Blocks } from "@/components/book/blocks";
import { BAIYAT, BIO, DONATION, MISSION, SHAYKH, SOCIAL } from "@/data/paribar";
import { applyParibar, type ParibarApplication } from "@/lib/api";
import { LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

type Tab = "bio" | "mission" | "baiyat" | "apply";
const TABS: Tab[] = ["bio", "mission", "baiyat", "apply"];

export function ParibarClient({ initialTab }: { initialTab?: string }) {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>(TABS.includes(initialTab as Tab) ? (initialTab as Tab) : "bio");

  const choose = (v: Tab) => {
    setTab(v);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", v);
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      {/* Welcome card, like the app's Paribar tab */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-[linear-gradient(180deg,var(--canvas-2),var(--panel))] px-5 py-8 text-center sm:py-12">
        <Image src="/icon-192.png" alt="" width={72} height={72} className="mx-auto h-16 w-16 rounded-2xl ring-4 ring-brand-soft" />
        <p className="mt-4 text-[15px] text-brand">{SHAYKH.welcome}</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-2">{SHAYKH.line}</p>
        <h1 className="mt-2 font-heading text-[28px] text-ink sm:text-[36px]">{SHAYKH.name}</h1>
        <p className="mt-1 text-[15px] text-gold">{SHAYKH.honor}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {SOCIAL.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-panel px-4 text-sm text-ink hover:border-brand/40">
              {t(s.bn, s.name)} <ExternalLink className="h-3.5 w-3.5 text-brand" />
            </a>
          ))}
        </div>
      </section>

      <div className="scroll-hide -mx-4 my-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Segmented
          value={tab}
          onChange={choose}
          options={[
            { value: "bio", label: t("পরিচিতি ও জীবনী", "Biography") },
            { value: "mission", label: t("লক্ষ্য ও উদ্দেশ্য", "Mission") },
            { value: "baiyat", label: t("বায়আত দিকনির্দেশনা", "On bay'ah") },
            { value: "apply", label: t("আবেদন করুন", "Apply") },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
        <Panel className="p-5 sm:p-8">
          {tab === "bio" && <Blocks blocks={BIO} />}
          {tab === "mission" && <Blocks blocks={MISSION} />}
          {tab === "baiyat" && (
            <>
              <Blocks blocks={BAIYAT} />
              <button onClick={() => choose("apply")} className="mt-6 h-12 rounded-2xl bg-brand px-6 text-[15px] font-medium text-white">
                {t("বায়আত হতে আবেদন করুন", "Apply for bay'ah")}
              </button>
            </>
          )}
          {tab === "apply" && <ApplyForms />}
        </Panel>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <DonationCard />
          <Link href={LINKS.member.href} className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-4 hover:border-brand/40">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-icon-bg text-brand">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[15.5px] font-semibold text-ink">{t("আজীবন সদস্য হোন", "Become a lifetime member")}</span>
              <span className="block text-sm text-ink-3">{t("জামেআর স্থায়ী খেদমতে শরিক হোন", "Join the Jamia's lasting service")}</span>
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}

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

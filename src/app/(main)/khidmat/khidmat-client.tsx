"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Heart, Info, MessageCircle, Phone, ShieldCheck, Sparkles, X } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import { FALLBACK_FUNDS, KHIDMAT_API, RECEIPT_PHONE_LABEL, RECEIPT_WHATSAPP, formFor, lookFor, taka, type Fund } from "./khidmat-data";
import { FormCard, LifetimeForm, MemberForm, QuickDonateForm } from "./khidmat-forms";

/** Live fund list from the madrasa API (falls back to the bundled list). */
export function useFunds() {
  const [funds, setFunds] = useState<Fund[]>(FALLBACK_FUNDS);
  useEffect(() => {
    let alive = true;
    fetch(`${KHIDMAT_API}/funds`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { funds?: Fund[] } | null) => {
        if (alive && d?.funds?.length) setFunds(d.funds);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return funds;
}

function FundForm({ fund }: { fund: Fund }) {
  const look = lookFor(fund);
  const kind = formFor(fund);
  if (kind === "lifetime")
    return (
      <FormCard icon={look.icon} tone={look.tone} title={fund.name} hint="নতুন হলে ফরম পূরণ করে সদস্য হোন, পুরাতন হলে অনুদান পরিশোধ করুন">
        <LifetimeForm />
      </FormCard>
    );
  if (kind === "monthly" || kind === "permanent")
    return (
      <FormCard icon={look.icon} tone={look.tone} title={fund.name} hint="নতুন হলে সদস্য হিসেবে আবেদন করুন, পুরাতন হলে মোবাইল নম্বর দিয়ে অনুদান দিন">
        <MemberForm key={kind} category={kind} suggested={fund.suggested_amounts?.length ? fund.suggested_amounts : [300, 500, 1000, 2000, 5000]} />
      </FormCard>
    );
  return (
    <FormCard icon={look.icon} tone={look.tone} title={fund.name} hint={fund.description}>
      <QuickDonateForm key={fund.id} fund={fund} />
    </FormCard>
  );
}

function FundPicker({ funds, value, onChange }: { funds: Fund[]; value: number; onChange: (id: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {funds.map((f) => {
        const look = lookFor(f);
        const on = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            aria-pressed={on}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border p-2.5 text-start transition sm:p-3",
              on ? "border-brand bg-brand-soft shadow-[0_8px_20px_-16px_var(--brand)]" : "border-line bg-panel hover:border-brand/40",
            )}
          >
            <span className="tone flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ ["--tone" as string]: look.tone }}>
              <look.icon className="h-[18px] w-[18px]" />
            </span>
            <span className={cn("line-clamp-2 text-[13.5px] leading-snug", on ? "font-semibold text-ink" : "text-ink-2")}>{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Payment result (gateways send donors back with ?payment= / ?sslcz=) ── */

type Result = { status: "success" | "fail" | "cancel"; tranId?: string; trx?: string; amount?: string; message?: string };

function readResult(): Result | null {
  const q = new URLSearchParams(window.location.search);
  const sslcz = q.get("sslcz");
  const payment = q.get("payment");
  if (!sslcz && !payment) return null;
  window.history.replaceState(null, "", window.location.pathname);
  if (sslcz === "success" || payment === "success")
    return {
      status: "success",
      tranId: q.get("tran_id") || q.get("tranId") || "",
      trx: q.get("trx") || q.get("trx_id") || "",
      amount: q.get("amount") || "",
      message: q.get("saved") === "0" ? "পেমেন্ট সম্পন্ন হয়েছে, কিন্তু আজীবন সদস্য আবেদন সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে নিচের TrxID সহ হোয়াটসঅ্যাপে যোগাযোগ করুন।" : undefined,
    };
  if (sslcz === "fail" || sslcz === "failure" || payment === "fail") return { status: "fail", tranId: q.get("tran_id") || "", message: q.get("msg") || "পেমেন্ট সম্পন্ন করা যায়নি।" };
  if (sslcz === "cancel" || payment === "cancel") return { status: "cancel", tranId: q.get("tran_id") || "", message: "পেমেন্ট বাতিল করা হয়েছে।" };
  return null;
}

function Modal({ onClose, children, label }: { onClose: () => void; children: React.ReactNode; label: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal
        aria-label={label}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-line bg-panel shadow-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ResultModal({ result, onClose }: { result: Result; onClose: () => void }) {
  const ok = result.status === "success";
  return (
    <Modal onClose={onClose} label={ok ? "অনুদান গৃহীত" : "পেমেন্ট সম্পন্ন হয়নি"}>
      <div className="space-y-5 p-6 text-center sm:p-8">
        <span className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full", ok ? "bg-brand-soft text-brand" : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400")}>
          {ok ? <Check className="h-8 w-8" strokeWidth={3} /> : <X className="h-8 w-8" strokeWidth={3} />}
        </span>
        <div className="space-y-1">
          <h3 className="font-heading text-2xl font-bold text-ink">{ok ? "আলহামদুলিল্লাহ!" : "পেমেন্ট সম্পন্ন হয়নি"}</h3>
          <p className={cn("text-sm", ok ? "font-medium text-brand" : "text-ink-2")}>{ok ? "আপনার অনুদান সফলভাবে গৃহীত হয়েছে।" : result.message}</p>
        </div>
        {ok && result.message && <p className="rounded-xl border border-gold/30 bg-gold-soft p-3 text-[13px] text-ink">{result.message}</p>}
        {ok && (result.trx || result.tranId) && (
          <dl className="space-y-1.5 rounded-2xl border border-line bg-panel-2 p-4 text-start text-[13px]">
            {result.amount && (
              <div className="flex justify-between">
                <dt className="text-ink-3">পরিমাণ</dt>
                <dd className="font-num font-semibold text-brand">৳{Number.isNaN(Number(result.amount)) ? result.amount : taka(Number(result.amount))}</dd>
              </div>
            )}
            {result.trx && (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">TrxID</dt>
                <dd className="font-mono font-semibold break-all text-ink">{result.trx}</dd>
              </div>
            )}
            {result.tranId && (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-3">Invoice</dt>
                <dd className="font-mono break-all text-ink-2">{result.tranId}</dd>
              </div>
            )}
          </dl>
        )}
        {ok && <p className="text-[13px] text-ink-3">আল্লাহ তাআলা আপনার এই দানকে সাদাকায়ে জারিয়া হিসেবে কবুল করুন এবং সর্বোত্তম প্রতিদান দান করুন।</p>}
        <div className="flex flex-col gap-2">
          {ok && (
            <a href={`https://wa.me/${RECEIPT_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-semibold text-white hover:bg-brand-strong">
              <MessageCircle className="h-[18px] w-[18px]" />
              হোয়াটসঅ্যাপে রশিদ সংগ্রহ করুন
            </a>
          )}
          <button type="button" onClick={onClose} className={cn("h-11 rounded-2xl text-sm font-medium", ok ? "text-ink-2 hover:text-ink" : "bg-brand text-white hover:bg-brand-strong")}>
            {ok ? "সম্পন্ন করুন" : "পুনরায় চেষ্টা করুন"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} label="খিদমত ও অনুদান নীতিমালা">
      <div className="flex items-start justify-between gap-3 border-b border-line bg-panel-2 p-5">
        <div>
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-ink">
            <Info className="h-5 w-5 text-brand" />
            খিদমত ও অনুদান নীতিমালা
          </h3>
          <p className="mt-0.5 text-xs text-ink-3">দ্বীনি খাতের বিবরণ ও শরয়ী ব্যবহারের স্পষ্টতা</p>
        </div>
        <button type="button" onClick={onClose} aria-label="বন্ধ করুন" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel text-ink-2 hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-4 overflow-y-auto p-5 text-[14px] leading-relaxed text-ink-2">
        <div className="space-y-2">
          <h4 className="font-semibold text-ink">১. বিভিন্ন খিদমত খাতের পরিচয়</h4>
          <ul className="list-disc space-y-1.5 ps-5">
            <li>
              <strong className="font-semibold text-ink">স্থায়ী ও মাসিক দাতা সদস্য:</strong> মাদরাসার নিয়মিত পরিচালনা, শিক্ষক-স্টাফদের সম্মাননা ও দ্বীনি কার্যক্রমে সহায়তা।
            </li>
            <li>
              <strong className="font-semibold text-ink">আজীবন দাতা সদস্য:</strong> জামেয়ার দীর্ঘমেয়াদী স্থিতিশীলতা ও অবকাঠামোগত প্রসারে এককালীন বা বাৎসরিক অবদান।
            </li>
            <li>
              <strong className="font-semibold text-ink">সাধারণ ও যাকাত ফান্ড:</strong> শুধুমাত্র যাকাত গ্রহণের উপযুক্ত অসচ্ছল ও এতিম ছাত্রদের অন্ন, বস্ত্র ও শিক্ষার প্রয়োজনীয় খাতে শরীয়াহ মোতাবেক বণ্টন।
            </li>
            <li>
              <strong className="font-semibold text-ink">স্টুডেন্ট ফি ও লিল্লাহ বোর্ডিং:</strong> অসচ্ছল মেধাবী শিক্ষার্থীদের মাসিক খাবার ও কিতাবের ব্যবস্থা।
            </li>
          </ul>
        </div>
        <div className="space-y-2 border-t border-line pt-3">
          <h4 className="font-semibold text-ink">২. মোবাইল নম্বর কেন প্রয়োজন?</h4>
          <p>আপনার অনুদানটি সফলভাবে গৃহীত হওয়ার পর ডিজিটাল মানি রিসিট প্রস্তুত হয়। ট্র্যাকিং নিশ্চিত করতে এবং ভবিষ্যতে জামেয়ার বার্ষিক আয়-ব্যয় রিপোর্ট পৌঁছানোর জন্য সঠিক মোবাইল নম্বর প্রদান আবশ্যক।</p>
        </div>
        <div className="space-y-1 rounded-xl border border-gold/30 bg-gold-soft p-4 text-[13px] text-ink">
          <p className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            রাসূলুল্লাহ (সা.) ইরশাদ করেছেন:
          </p>
          <p className="italic">&ldquo;সাদাকাহ মানুষের কোনো ধন-সম্পদ হ্রাস করে না, বরং বৃদ্ধি করে।&rdquo; — সহীহ মুসলিম</p>
        </div>
      </div>
      <div className="flex justify-end border-t border-line p-4">
        <button type="button" onClick={onClose} className="h-10 rounded-xl bg-brand px-6 text-sm font-medium text-white hover:bg-brand-strong">
          বুঝেছি
        </button>
      </div>
    </Modal>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export function KhidmatClient() {
  const funds = useFunds();
  const [fundId, setFundId] = useState(FALLBACK_FUNDS[0].id);
  const fund = funds.find((f) => f.id === fundId) ?? funds[0];
  const [policy, setPolicy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the gateway's return URL
  useEffect(() => setResult(readResult()), []);

  return (
    <div className="mx-auto max-w-[880px] space-y-6 pb-10">
      {/* Hero */}
      <section className="hero-surface relative overflow-hidden rounded-3xl px-5 py-7 text-center sm:px-8 sm:py-10">
        <div className="star-lattice pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="relative">
          <div className="mx-auto mb-5 w-full max-w-md overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
            <Image src="/images/khidmat/markazul-ihsan-banner.jpg" alt="জামেআ মারকাযুল ইহসান ঢাকা" width={1024} height={143} className="h-auto w-full" priority />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs text-white">
            <Sparkles className="h-3.5 w-3.5 text-gold-light" />
            মারকাযুল ইহসান ঢাকা • অনলাইন ডোনেশন ও খিদমত
          </span>
          <h1 className="mt-3 font-heading text-[34px] leading-tight font-bold text-white sm:text-5xl">খিদমত</h1>
          <p className="mx-auto mt-2 max-w-lg text-[14.5px] leading-relaxed text-white/80 sm:text-base">দ্বীনি শিক্ষার খেদমত ও তোলাবাদের কল্যাণে আপনার সদকা, যাকাত ও নিয়মিত অনুদান জমা দিন</p>
        </div>
      </section>

      {/* Donate */}
      <section id="donate" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-gold to-brand" />
          <div className="min-w-0">
            <h2 className="font-heading text-[20px] leading-tight font-bold text-ink sm:text-[22px]">আপনার অনুদান প্রদান করুন</h2>
            <p className="text-[13px] text-ink-3">তহবিল নির্বাচন করে সরাসরি অনলাইনে অনুদান প্রদান করুন</p>
          </div>
        </div>
        <FundPicker funds={funds} value={fund.id} onChange={setFundId} />
        {fund.description && formFor(fund) !== "quick" && <p className="px-1 text-[13.5px] text-ink-2">{fund.description}</p>}
        <AnimatePresence mode="wait">
          <motion.div key={fund.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
            <FundForm fund={fund} />
          </motion.div>
        </AnimatePresence>
        <p className="px-1 text-center text-[13px] leading-relaxed text-ink-3">
          মারকাযুল ইহসানে আপনার দান সাদাকায়ে জারিয়া হিসেবে গণ্য হবে এবং এতিম-অসহায় শিক্ষার্থীদের কল্যাণে ব্যয় হবে।{" "}
          <button type="button" onClick={() => setPolicy(true)} className="font-medium text-brand underline">
            বিস্তারিত জানুন
          </button>
        </p>
      </section>

      {/* Salam note */}
      <Panel className="space-y-5 p-6 text-center sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Heart className="h-7 w-7 fill-current" />
        </span>
        <div className="space-y-1.5">
          <h2 className="font-heading text-2xl font-bold text-ink">আসসালামু আলাইকুম</h2>
          <p className="font-medium text-brand">জামেআর সম্মানিত শুভাকাঙ্খী ও প্রিয় আজীবন ও নিয়মিত সদস্যবৃন্দ!</p>
        </div>
        <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-ink-2">
          আপনাদের অবগতির জন্য জানানো যাচ্ছে যে, প্রতি বছর আপনাদের সার্বিক সহযোগিতায় মাদরাসার তোলাবায়ে কেরামের খেদমত ফান্ডে (যাকাত ফান্ডে) বিপুল পরিমাণ অর্থ ব্যয় করা হয়। মহান আল্লাহ তাআলার সন্তুষ্টি ও পরকালীন মহা-সাওয়াব অর্জনের লক্ষ্যে এ মহতী দ্বীনি খেদমতে শরীক হতে সচেষ্ট হবেন। আল্লাহপাক খুব তাওফীক দান করুন।
        </p>
        <p className="mx-auto max-w-2xl rounded-2xl border-s-4 border-gold bg-brand-soft/60 p-4 text-start text-[15px] leading-relaxed text-ink">
          আপনার আজীবন বা মাসিক <strong className="font-semibold text-brand">&lsquo;সদস্য অনুদান&rsquo;</strong> নিয়মিত জমা দিয়ে দ্বীনের খাদেম ও হাফেজে কোরআন তৈরির এই পবিত্র কাফেলায় সার্বক্ষণিক সহযোগী হয়ে থাকুন।
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-[13px] text-ink-2">
          {[
            { icon: ShieldCheck, label: "১০০% শরীয়াহসম্মত ব্যবহার" },
            { icon: Check, label: "স্বয়ংক্রিয় ডিজিটাল রসিদ" },
            { icon: Sparkles, label: "সাদাকায়ে জারিয়ার সওয়াব" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel-2 px-3 py-1.5">
              <Icon className="h-4 w-4 text-brand" />
              {label}
            </span>
          ))}
        </div>
      </Panel>

      {/* Receipt */}
      <section className="hero-surface relative overflow-hidden rounded-3xl p-6 text-center sm:p-10">
        <div className="star-lattice pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="relative flex flex-col items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-gold-light">
            <MessageCircle className="h-7 w-7" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">রশিদ সংগ্রহের জন্য যোগাযোগ করুন</h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-white/80">অনুদান পাঠিয়ে সরাসরি মানি রিসিট সংগ্রহ করতে বা কোনো পরামর্শের জন্য নিচের হোয়াটসঅ্যাপ নম্বরে মেসেজ পাঠান</p>
          <a
            href={`https://wa.me/${RECEIPT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-flex h-14 items-center gap-3 rounded-2xl bg-gold px-7 font-num text-lg font-bold tracking-wide text-[#1d1607] shadow-lg transition hover:brightness-105"
          >
            {RECEIPT_PHONE_LABEL}
            <Phone className="h-5 w-5" />
          </a>
        </div>
      </section>

      <AnimatePresence>
        {policy && <PolicyModal onClose={() => setPolicy(false)} />}
        {result && <ResultModal result={result} onClose={() => setResult(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Compact widget for other pages (About, Paribar) ──────────── */

const QUICK = ["general", "lillah", "student_fee", "construction"];

export function DonateWidget({ className }: { className?: string }) {
  const funds = useFunds();
  const quick = funds.filter((f) => formFor(f) === "quick" && QUICK.includes(f.category));
  const list = quick.length ? quick : funds.filter((f) => formFor(f) === "quick");
  const [fundId, setFundId] = useState<number | null>(null);
  const fund = list.find((f) => f.id === fundId) ?? list[0];
  if (!fund) return null;

  return (
    <Panel className={cn("space-y-4", className)}>
      <div>
        <p className="text-[16.5px] font-semibold text-ink">মাদরাসায় অনুদান করুন</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">বিকাশ, কার্ড/নগদ বা ব্যাংকে সরাসরি অনুদান দিন — তোলাবায়ে কেরামের খেদমতে ব্যয় হবে।</p>
      </div>
      <div className="scroll-hide -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
        {list.map((f) => {
          const on = f.id === fund.id;
          const look = lookFor(f);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFundId(f.id)}
              aria-pressed={on}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] whitespace-nowrap transition",
                on ? "border-brand bg-brand text-white" : "border-line bg-panel text-ink-2 hover:border-brand/40",
              )}
            >
              <look.icon className="h-3.5 w-3.5" />
              {f.name.replace(/\s*\(.*\)$/, "")}
            </button>
          );
        })}
      </div>
      <QuickDonateForm key={fund.id} fund={fund} />
      <Link href="/khidmat" className="flex items-center justify-center gap-1.5 border-t border-line pt-3 text-sm font-medium text-brand hover:underline">
        দাতা সদস্য হতে বা সব তহবিল দেখতে খিদমত পাতায় যান
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </Panel>
  );
}

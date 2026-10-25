"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, CircleAlert, Copy, Info, Landmark, LoaderCircle, MessageCircle, ShieldCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BANK, GATEWAYS, RECEIPT_WHATSAPP, postJson, taka, toEnDigits, withFee, type PayMethod } from "./khidmat-data";

/* ── Form pieces ──────────────────────────────────────────────── */

const inputBase =
  "h-12 w-full rounded-xl border bg-panel text-[15px] text-ink outline-none transition placeholder:text-ink-3 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  tel,
  numeric,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string | null;
  tel?: boolean;
  numeric?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-medium text-ink-2">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute start-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-brand/70" />
        <input
          type={tel ? "tel" : "text"}
          inputMode={tel || numeric ? "numeric" : undefined}
          value={value}
          onChange={(e) => onChange(tel ? toEnDigits(e.target.value).replace(/[^0-9+]/g, "").slice(0, 14) : e.target.value)}
          placeholder={placeholder}
          className={cn(inputBase, "ps-11 pe-4", error ? "border-red-400" : "border-line")}
        />
      </span>
      {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

/** ৳ amount input; keeps digits only (Bangla digits are converted). */
export function AmountField({ label, value, onChange, placeholder, error }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string | null }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-medium text-ink-2">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[17px] font-semibold text-brand">৳</span>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(toEnDigits(e.target.value).replace(/[^0-9]/g, "").slice(0, 8))}
          placeholder={placeholder ?? "সংখ্যায় লিখুন"}
          className={cn(inputBase, "ps-10 pe-4 font-num font-semibold", error ? "border-red-400" : "border-line")}
        />
      </span>
      {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

export function AmountChips({ amounts, value, onPick }: { amounts: number[]; value: number; onPick: (n: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {amounts.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPick(n)}
          className={cn(
            "rounded-full border px-3 py-1.5 font-num text-[13px] font-medium transition",
            value === n ? "border-brand bg-brand text-white" : "border-line bg-panel text-ink-2 hover:border-brand/40 hover:text-ink",
          )}
        >
          ৳{taka(n)}
        </button>
      ))}
    </div>
  );
}

export function SelectField({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-medium text-ink-2">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputBase, "cursor-pointer appearance-none border-line ps-4 pe-10 font-medium")}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
      </span>
    </label>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-[13.5px] leading-relaxed text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
      <CircleAlert className="mt-0.5 h-[18px] w-[18px] shrink-0" />
      {message}
    </p>
  );
}

export function PrimaryButton({ children, onClick, busy, busyLabel, icon: Icon = ArrowRight, className }: { children: React.ReactNode; onClick: () => void; busy?: boolean; busyLabel?: string; icon?: LucideIcon; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={cn(
        "inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-[15.5px] font-semibold text-white shadow-[0_10px_24px_-14px_var(--brand)] transition hover:bg-brand-strong active:scale-[0.99] disabled:opacity-70",
        className,
      )}
    >
      {busy ? (
        <>
          <LoaderCircle className="h-5 w-5 animate-spin" />
          {busyLabel ?? "অপেক্ষা করুন…"}
        </>
      ) : (
        <>
          <span>{children}</span>
          <Icon className="h-5 w-5 rtl:rotate-180" />
        </>
      )}
    </button>
  );
}

/** Success state shown after an application is accepted. */
export function DoneNote({ title, children, onReset }: { title: string; children: React.ReactNode; onReset?: () => void }) {
  return (
    <div className="space-y-3 py-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Check className="h-8 w-8" strokeWidth={3} />
      </span>
      <h4 className="font-heading text-xl font-bold text-ink">{title}</h4>
      <p className="mx-auto max-w-sm text-[14.5px] leading-relaxed text-ink-2">{children}</p>
      {onReset && (
        <button type="button" onClick={onReset} className="mt-1 rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink hover:bg-panel-2">
          নতুন আবেদন করুন
        </button>
      )}
    </div>
  );
}

/* ── Bank details ─────────────────────────────────────────────── */

export function BankDetails() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 2200);
  };
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand/25 bg-panel p-4 sm:flex-row sm:gap-5 sm:p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Landmark className="h-6 w-6" />
      </span>
      <dl className="grid min-w-0 flex-1 grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-[13.5px] sm:gap-x-4 sm:text-sm">
        {BANK.map((b) => (
          <div key={b.label} className="contents">
            <dt className="whitespace-nowrap text-ink-3">{b.label}:</dt>
            <dd className="flex min-w-0 items-center gap-1 font-medium text-ink [overflow-wrap:anywhere]">
              <span className={b.copy ? "font-num" : undefined}>{b.value}</span>
              {b.copy && (
                <button type="button" onClick={() => copy(b.label, b.value)} title="কপি করুন" aria-label={`${b.label} কপি করুন`} className="shrink-0 rounded-md p-1 text-ink-3 hover:bg-brand-soft hover:text-brand">
                  {copied === b.label ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── Payment box: method, totals and checkout ─────────────────── */

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn("text-[13.5px]", strong ? "font-semibold text-ink" : "text-ink-2")}>{label}</span>
      <span className={cn("text-end font-num tabular-nums", strong ? "text-[17px] font-bold text-ink" : "text-sm font-medium text-ink")}>{value}</span>
    </div>
  );
}

/**
 * `buildBody` validates the form and returns the request body (or null to stop).
 * `bankAction` replaces the default "send money, get receipt on WhatsApp" button
 * when the bank option is chosen (e.g. to submit an application instead).
 */
export function PaymentBox({ amount, isZakat = false, buildBody, bankAction }: { amount: number; isZakat?: boolean; buildBody: () => unknown | null; bankAction?: React.ReactNode }) {
  const [method, setMethod] = useState<PayMethod>("bkash");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const base = amount > 0 ? amount : 0;
  const { total, fee } = method === "bank" ? { total: base, fee: 0 } : withFee(base, method);

  const pay = async () => {
    if (method === "bank" || busy) return;
    const body = buildBody();
    if (!body) return;
    const gw = GATEWAYS[method];
    setBusy(true);
    setError(null);
    try {
      const { ok, data } = await postJson<Record<string, unknown>>(gw.endpoint, body);
      const url = method === "bkash" ? data?.bkashURL || data?.redirectURL : data?.redirectURL || data?.GatewayPageURL || data?.gateway_url || data?.redirect_url;
      if (ok && data?.success && typeof url === "string") {
        window.location.href = url;
        return;
      }
      setError((data?.message as string) || "পেমেন্ট শুরু করা যায়নি। একটু পরে আবার চেষ্টা করুন।");
    } catch {
      setError("সার্ভার সংযোগে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    }
    setBusy(false);
  };

  const options: { id: PayMethod; name: string; sub: string; badge: string; free?: boolean }[] = [
    { id: "bkash", name: GATEWAYS.bkash.name, sub: GATEWAYS.bkash.sub, badge: "চার্জ প্রযোজ্য" },
    { id: "sslcommerz", name: GATEWAYS.sslcommerz.name, sub: GATEWAYS.sslcommerz.sub, badge: "চার্জ প্রযোজ্য" },
    { id: "bank", name: "ব্যাংক অ্যাকাউন্ট", sub: "সরাসরি ব্যাংকে জমা", badge: "চার্জ ফ্রি", free: true },
  ];
  const toBank = (
    <button type="button" onClick={() => setMethod("bank")} className="font-semibold text-brand underline">
      ব্যাংক অ্যাকাউন্ট
    </button>
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2.5 text-sm font-semibold text-ink">পেমেন্ট মাধ্যম নির্বাচন করুন</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {options.map((o) => {
            const on = method === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setMethod(o.id)}
                aria-pressed={on}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-2xl border-2 px-1.5 py-3 text-center transition sm:p-4",
                  on ? "border-brand bg-brand-soft" : "border-line bg-panel hover:border-brand/40",
                )}
              >
                {on && (
                  <span className="absolute end-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                )}
                <span className="flex h-9 w-full items-center justify-center">
                  {o.id === "bank" ? (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                      <Landmark className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className={cn("relative block", o.id === "bkash" ? "h-9 w-9" : "h-7 w-full max-w-[84px]")}>
                      <Image src={GATEWAYS[o.id].logo} alt={o.name} fill className="object-contain" unoptimized />
                    </span>
                  )}
                </span>
                <span className="text-[13px] leading-tight font-semibold text-ink sm:text-sm">{o.name}</span>
                <span className="hidden text-[11.5px] leading-tight text-ink-3 sm:block">{o.sub}</span>
                <span className={cn("mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", o.free ? "bg-brand text-white" : "bg-gold-soft text-gold")}>{o.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-line bg-panel-2 p-4 sm:p-5">
        <Row label="অনুদানের পরিমাণ" value={`${taka(base)} টাকা`} />
        <Row label="গেটওয়ে ফি" value={method === "bank" ? "চার্জ ফ্রি" : method === "bkash" ? (fee > 0 ? `+ ${taka(fee)} টাকা` : "০ টাকা") : "গেটওয়েতে প্রযোজ্য"} />
        <div className="h-px bg-line" />
        <Row label="সর্বমোট পরিশোধ করবেন" value={`${taka(total)} টাকা`} strong />
        <div className={cn("-mx-1 flex items-center justify-between gap-3 rounded-xl px-3 py-2.5", isZakat ? "bg-brand text-white" : "bg-brand-soft text-brand")}>
          <span className="text-[13.5px] font-semibold">{isZakat ? "আদায়কৃত যাকাতের পরিমাণ" : "মাদরাসায় জমা হবে"}</span>
          <span className="font-num text-[17px] font-bold tabular-nums">{taka(base)} টাকা</span>
        </div>
      </div>

      {method !== "bank" && base > 0 && (
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>
            {method === "bkash" ? (
              <>
                বিকাশ গেটওয়ে সার্ভিস চার্জ আপনার অনুদানের সাথে যোগ হবে, তাই মাদরাসায় পুরো <strong className="font-semibold text-ink">{taka(base)} টাকা</strong>
                {isZakat ? " যাকাত হিসেবে আদায় হবে।" : " জমা হবে।"} চার্জ ছাড়া সরাসরি দিতে চাইলে {toBank} নির্বাচন করুন।
              </>
            ) : (
              <>SSLCOMMERZ গেটওয়েতে আপনার নির্বাচিত মাধ্যমের নিজস্ব সার্ভিস চার্জ প্রযোজ্য হতে পারে। চার্জ ছাড়া সরাসরি দিতে চাইলে {toBank} নির্বাচন করুন।</>
            )}
          </span>
        </p>
      )}

      {method === "bank" ? (
        <div className="space-y-3">
          <p className="text-center text-sm leading-relaxed font-semibold text-brand">
            কোনো প্রকার চার্জ ছাড়াই আপনার {isZakat ? "যাকাত/যাকাতের একটা অংশ" : "অনুদান"} সরাসরি নিচের ব্যাংক অ্যাকাউন্টে প্রদান করুন।
          </p>
          <BankDetails />
          {bankAction ?? (
            <a
              href={`https://wa.me/${RECEIPT_WHATSAPP}?text=${encodeURIComponent(`আসসালামু আলাইকুম। আমি ব্যাংকে ${base > 0 ? `${base} টাকা ` : ""}অনুদান পাঠিয়েছি। রসিদ চাই।`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand text-[15.5px] font-semibold text-white hover:bg-brand-strong"
            >
              <MessageCircle className="h-5 w-5" />
              টাকা পাঠিয়ে হোয়াটসঅ্যাপে রসিদ নিন
            </a>
          )}
        </div>
      ) : (
        <>
          {error && <ErrorNote message={error} />}
          <PrimaryButton onClick={pay} busy={busy} busyLabel="পেমেন্ট পেজ প্রস্তুত হচ্ছে…">
            {GATEWAYS[method].name} দিয়ে {total > 0 ? `${taka(total)} টাকা ` : ""}পরিশোধ করুন
          </PrimaryButton>
          {method === "sslcommerz" && <p className="-mt-1 text-center text-[12px] text-ink-3">ভিসা, মাস্টারকার্ড, নগদ, রকেট ও ইন্টারনেট ব্যাংকিং সমর্থিত</p>}
          <p className="flex items-center justify-center gap-1.5 text-[12px] text-ink-3">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            নিরাপদ পেমেন্ট • পেমেন্ট শেষে স্বয়ংক্রিয় ডিজিটাল রসিদ
          </p>
        </>
      )}
    </div>
  );
}

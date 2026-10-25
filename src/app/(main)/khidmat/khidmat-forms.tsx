"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Hash, House, Minus, Phone, Plus, Search, Send, User, UserRound, Briefcase, Wallet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_AMOUNTS,
  KHIDMAT_API,
  LIFETIME_TIERS,
  MEMBER_MIN,
  PERMANENT_PRESETS,
  bnYear,
  findLifetimeMember,
  isZakatFund,
  normPhone,
  phoneError,
  postJson,
  taka,
  toEnDigits,
  type Fund,
  type LifetimeMember,
} from "./khidmat-data";
import { AmountChips, AmountField, DoneNote, ErrorNote, Field, PaymentBox, PrimaryButton, SelectField } from "./khidmat-ui";

const numberOf = (s: string) => parseInt(toEnDigits(s).replace(/[^0-9]/g, ""), 10) || 0;

/** Card wrapper for a fund's form: icon, title and a one-line hint. */
export function FormCard({ icon: Icon, tone, title, hint, children }: { icon: LucideIcon; tone: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-panel">
      <div className="flex items-center gap-3 border-b border-line bg-panel-2/60 px-4 py-4 sm:px-6">
        <span className="tone flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ ["--tone" as string]: tone }}>
          <Icon className="h-[22px] w-[22px]" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-[18px] leading-tight font-bold text-ink sm:text-xl">{title}</h3>
          {hint && <p className="mt-0.5 text-[13px] text-ink-3">{hint}</p>}
        </div>
      </div>
      <div className="space-y-5 p-4 sm:p-6">{children}</div>
    </div>
  );
}

/* ── Quick donation: general / zakat / student fee / lillah / construction ── */

export function QuickDonateForm({ fund }: { fund: Fund }) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [anon, setAnon] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ phone?: string | null; amount?: string | null }>({});
  const top = useRef<HTMLDivElement>(null);
  const value = numberOf(amount);
  const min = Math.max(10, Number(fund.min_amount) || 0);
  const presets = fund.suggested_amounts?.length ? fund.suggested_amounts : DEFAULT_AMOUNTS;

  return (
    <div ref={top} className="scroll-mt-28 space-y-5">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field label="মোবাইল নম্বর *" icon={Phone} value={phone} onChange={(v) => (setPhone(v), setErrors((e) => ({ ...e, phone: null })))} placeholder="017XXXXXXXX" error={errors.phone} tel />
        <AmountField label="পরিমাণ *" value={amount} onChange={(v) => (setAmount(v), setErrors((e) => ({ ...e, amount: null })))} error={errors.amount} />
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="me-1 text-[12.5px] text-ink-3">দ্রুত নির্বাচন:</span>
        <AmountChips amounts={presets} value={value} onPick={(n) => (setAmount(String(n)), setErrors((e) => ({ ...e, amount: null })))} />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 select-none">
        <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--brand)]" />
        <span className="text-[14px] text-ink-2">নাম ও ঠিকানা প্রকাশে অনিচ্ছুক (শুধু মোবাইল নম্বর দিয়ে দান করুন)</span>
      </label>
      {!anon && (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field label="আপনার নাম (ঐচ্ছিক)" icon={User} value={name} onChange={(v) => setName(v.slice(0, 120))} placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ" />
          <Field label="ঠিকানা (ঐচ্ছিক)" icon={House} value={address} onChange={(v) => setAddress(v.slice(0, 200))} placeholder="যেমন: যাত্রাবাড়ী, ঢাকা" />
        </div>
      )}

      <div className="border-t border-line pt-5">
        <PaymentBox
          amount={value}
          isZakat={isZakatFund(fund)}
          buildBody={() => {
            const next = {
              phone: phoneError(phone, true),
              amount: value ? (value < min ? `এই তহবিলের সর্বনিম্ন অনুদান ${taka(min)} টাকা` : null) : "অনুদানের পরিমাণ লিখুন",
            };
            setErrors(next);
            if (next.phone || next.amount) {
              top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              return null;
            }
            return {
              amount: value,
              phone: normPhone(phone),
              donorName: anon ? "" : name.trim(),
              donorAddress: anon ? "" : address.trim(),
              fundId: fund.id,
              fundName: fund.name,
              category: fund.category,
            };
          }}
        />
      </div>
    </div>
  );
}

/* ── Permanent / monthly donor members ────────────────────────── */

type Member = { donorId: string; name: string; pledge: number; duesMonths: number };

export function MemberForm({ category, suggested }: { category: "monthly" | "permanent"; suggested: number[] }) {
  const monthly = category === "monthly";
  const min = MEMBER_MIN[category];
  const [kind, setKind] = useState("");

  // New member
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pledge, setPledge] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [donorId, setDonorId] = useState<string | null>(null);
  const pledgeValue = numberOf(pledge);

  // Existing member
  const [lookPhone, setLookPhone] = useState("");
  const [looking, setLooking] = useState(false);
  const [lookError, setLookError] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [months, setMonths] = useState(1);

  const validate = () => {
    const next = {
      name: name.trim() ? null : "আপনার নাম লিখুন",
      phone: phoneError(phone, true),
      address: address.trim() ? null : "ঠিকানা লিখুন",
      pledge: pledgeValue >= min ? null : monthly ? "অনুদানের পরিমাণ লিখুন (সর্বনিম্ন ১০ টাকা)" : `স্থায়ী দাতা সদস্যের অনুদান সর্বনিম্ন ${taka(min)} টাকা`,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };
  const application = () => ({ kind: "new", category, name: name.trim(), phone: normPhone(phone), address: address.trim(), pledge: pledgeValue });

  const apply = async () => {
    if (saving || !validate()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const { ok, data } = await postJson<{ ok?: boolean; donorId?: string; message?: string }>(`${KHIDMAT_API}/member/apply`, application());
      if (ok && data?.ok) setDonorId(data.donorId ?? "");
      else setSaveError(data?.message || "আবেদন জমা হয়নি। একটু পরে আবার চেষ্টা করুন।");
    } catch {
      setSaveError("ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    }
    setSaving(false);
  };

  const lookup = async () => {
    const err = phoneError(lookPhone, true);
    if (err) return setLookError(err);
    setLooking(true);
    setLookError(null);
    setMember(null);
    try {
      const { ok, data } = await postJson<{ ok?: boolean; member?: Member; message?: string }>(`${KHIDMAT_API}/member/lookup`, { phone: normPhone(lookPhone), category });
      if (ok && data?.ok && data.member) {
        setMember(data.member);
        setMonths(Math.min(24, Math.max(1, data.member.duesMonths)));
      } else setLookError(data?.message || "সদস্য তথ্য পাওয়া যায়নি।");
    } catch {
      setLookError("ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    }
    setLooking(false);
  };

  return (
    <>
      <SelectField
        label="আপনি কি নতুন নাকি পুরাতন সদস্য? *"
        value={kind}
        onChange={setKind}
        placeholder="সদস্যের ধরন নির্বাচন করুন"
        options={[
          { value: "new", label: "নতুন সদস্য — আবেদন করুন" },
          { value: "existing", label: monthly ? "পুরাতন সদস্য — মাসিক অনুদান পরিশোধ" : "পুরাতন সদস্য — অনুদান পরিশোধ" },
        ]}
      />

      {kind === "new" &&
        (donorId !== null ? (
          <DoneNote title="আবেদন সফলভাবে গৃহীত হয়েছে!">
            {donorId ? (
              <>
                আপনার সদস্য নং <strong className="font-num text-ink">{donorId}</strong>।{" "}
              </>
            ) : null}
            ব্যাংকে টাকা পাঠিয়ে হোয়াটসঅ্যাপে রসিদ নিন, ইনশাআল্লাহ।
          </DoneNote>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="পূর্ণ নাম *" icon={User} value={name} onChange={setName} placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ" error={errors.name} />
              <Field label="মোবাইল নম্বর *" icon={Phone} value={phone} onChange={setPhone} placeholder="017XXXXXXXX" error={errors.phone} tel />
              <div className="sm:col-span-2">
                <Field label="ঠিকানা *" icon={House} value={address} onChange={setAddress} placeholder="যেমন: যাত্রাবাড়ী, ঢাকা" error={errors.address} />
              </div>
            </div>
            <div className="space-y-2">
              <AmountField
                label={monthly ? "প্রতি মাসে কত টাকা দিতে চান? *" : `অনুদানের পরিমাণ (সর্বনিম্ন ${taka(min)} টাকা) *`}
                value={pledge}
                onChange={setPledge}
                placeholder={monthly ? "যে কোনো পরিমাণ লিখুন" : `সর্বনিম্ন ${taka(min)} টাকা`}
                error={errors.pledge}
              />
              <AmountChips amounts={monthly ? suggested : PERMANENT_PRESETS} value={pledgeValue} onPick={(n) => setPledge(String(n))} />
            </div>
            <div className="border-t border-line pt-5">
              <p className="mb-3 text-sm font-semibold text-ink">{monthly ? "প্রথম মাসের অনুদান পরিশোধ করুন" : "অনুদান পরিশোধ করুন"}</p>
              <PaymentBox
                amount={pledgeValue}
                buildBody={() => {
                  if (!validate()) return null;
                  // Register the member alongside the payment (best effort).
                  if (donorId === null) postJson<{ ok?: boolean; donorId?: string }>(`${KHIDMAT_API}/member/apply`, application()).catch(() => {});
                  return { member: application() };
                }}
                bankAction={
                  <div className="space-y-2">
                    {saveError && <ErrorNote message={saveError} />}
                    <PrimaryButton onClick={apply} busy={saving} busyLabel="জমা হচ্ছে…" icon={Send}>
                      ব্যাংকে পাঠাবো — আবেদন জমা দিন
                    </PrimaryButton>
                  </div>
                }
              />
            </div>
          </div>
        ))}

      {kind === "existing" && (
        <div className="space-y-4">
          <Field label="নিবন্ধিত মোবাইল নম্বর *" icon={Phone} value={lookPhone} onChange={setLookPhone} placeholder="017XXXXXXXX" tel />
          <PrimaryButton onClick={lookup} busy={looking} busyLabel="খোঁজা হচ্ছে…" icon={Search}>
            অনুদানের তথ্য দেখুন
          </PrimaryButton>
          {lookError && <ErrorNote message={lookError} />}
          {member && (
            <div className="space-y-4">
              <MemberSummary
                name={member.name}
                rows={[
                  ["সদস্য নং", member.donorId],
                  [monthly ? "মাসিক অনুদান" : "অনুদান", `${taka(member.pledge)} টাকা`],
                  ["বকেয়া", member.duesMonths ? `${taka(member.duesMonths)} মাস` : "কোনো বকেয়া নেই", member.duesMonths ? "due" : "ok"],
                ]}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">কত মাসের অনুদান দেবেন?</span>
                <div className="flex items-center gap-2">
                  <StepButton label="এক মাস কম" onClick={() => setMonths((m) => Math.max(1, m - 1))} icon={Minus} />
                  <span className="min-w-[4.5rem] text-center font-num text-base font-bold text-brand">{taka(months)} মাস</span>
                  <StepButton label="এক মাস বেশি" onClick={() => setMonths((m) => Math.min(24, m + 1))} icon={Plus} />
                </div>
              </div>
              <PaymentBox amount={member.pledge * months} buildBody={() => ({ member: { kind: "existing", category, phone: normPhone(lookPhone), months } })} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

function StepButton({ label, onClick, icon: Icon }: { label: string; onClick: () => void; icon: LucideIcon }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink hover:bg-panel-2">
      <Icon className="h-4 w-4" />
    </button>
  );
}

function MemberSummary({ name, rows }: { name: string; rows: [string, string, ("due" | "ok")?][] }) {
  return (
    <div className="space-y-2 rounded-2xl border border-brand/25 bg-brand-soft/50 p-4">
      <p className="text-base font-bold text-brand">{name}</p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13.5px]">
        {rows.map(([k, v, state]) => (
          <div key={k} className="contents">
            <dt className="text-ink-3">{k}</dt>
            <dd className={cn("text-end font-medium", state === "due" ? "text-red-600 dark:text-red-400" : state === "ok" ? "text-brand" : "text-ink")}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── Lifetime donor members ───────────────────────────────────── */

const STEPS = ["ক্যাটাগরি", "ব্যক্তিগত তথ্য", "রেফারেন্স", "পেমেন্ট"];

export function LifetimeForm() {
  const top = useRef<HTMLDivElement>(null);
  const scrollTop = () => top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const [kind, setKind] = useState("");

  // New member wizard
  const [step, setStep] = useState(0);
  const [tierId, setTierId] = useState("gold");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [profession, setProfession] = useState("");
  const [address, setAddress] = useState("");
  const [refName, setRefName] = useState("");
  const [refPhone, setRefPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [payNow, setPayNow] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false); // application already stored (saved on reaching the last step)
  const tier = LIFETIME_TIERS.find((x) => x.id === tierId) ?? LIFETIME_TIERS[2];

  const application = () => ({
    tierId: tier.id,
    tierTitle: tier.title,
    amount: `${taka(tier.amount)} টাকা`,
    name: name.trim(),
    phone: normPhone(phone),
    whatsapp: whatsapp.trim() ? normPhone(whatsapp) : "",
    profession: profession.trim(),
    address: address.trim(),
    mediumName: refName.trim(),
    mediumPhone: refPhone.trim() ? normPhone(refPhone) : "",
    paymentMethod: "",
    senderNumber: "",
    trxId: "",
  });

  const submit = async (paymentMethod = "") => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    if (saved && !paymentMethod) {
      setDone(true);
      setSaving(false);
      scrollTop();
      return;
    }
    try {
      const { ok, data } = await postJson<{ ok?: boolean }>(`${KHIDMAT_API}/lifetime-member`, { ...application(), paymentMethod });
      if (ok && data?.ok) {
        setSaved(true);
        setDone(true);
        scrollTop();
      } else setSaveError("আবেদন জমা হয়নি। একটু পরে আবার চেষ্টা করুন অথবা হেল্পলাইনে যোগাযোগ করুন।");
    } catch {
      setSaveError("ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    }
    setSaving(false);
  };

  const next = () => {
    if (step === 1) {
      const e = {
        name: name.trim() ? null : "আপনার নাম লিখুন",
        phone: phoneError(phone, true),
        whatsapp: phoneError(whatsapp, false),
        profession: profession.trim() ? null : "পেশা / পদবী লিখুন",
        address: address.trim() ? null : "বর্তমান ঠিকানা লিখুন",
      };
      setErrors((x) => ({ ...x, ...e }));
      if (!Object.values(e).every((v) => !v)) return;
    }
    if (step === 2) {
      const e = phoneError(refPhone, false);
      setErrors((x) => ({ ...x, mediumPhone: e }));
      if (e) return;
      // Store the application as soon as it is complete, before payment.
      if (!saved)
        postJson<{ ok?: boolean }>(`${KHIDMAT_API}/lifetime-member`, application())
          .then(({ ok }) => ok && setSaved(true))
          .catch(() => {});
    }
    setStep((s) => Math.min(3, s + 1));
    scrollTop();
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setTierId("gold");
    for (const set of [setName, setPhone, setWhatsapp, setProfession, setAddress, setRefName, setRefPhone]) set("");
    setErrors({});
    setPayNow(true);
  };

  // Existing member (looked up in the yearly dues sheet)
  const [memberId, setMemberId] = useState("");
  const [lookPhone, setLookPhone] = useState("");
  const [looking, setLooking] = useState(false);
  const [lookError, setLookError] = useState<string | null>(null);
  const [found, setFound] = useState<LifetimeMember | null>(null);
  const [years, setYears] = useState<Set<number>>(new Set());
  const [custom, setCustom] = useState("");
  const yearly = found ? numberOf(found.pledgedAmount.replace(/\/-.*$/, "")) || null : null;
  const due = useMemo(() => (found ? (yearly ? yearly * Math.max(1, years.size) : numberOf(custom)) : 0), [found, yearly, years, custom]);

  const lookup = async () => {
    const err = phoneError(lookPhone, true);
    if (!memberId.trim() || err) return setLookError(memberId.trim() ? err : "সদস্য নম্বর লিখুন");
    setLooking(true);
    setLookError(null);
    setFound(null);
    try {
      const m = await findLifetimeMember(memberId, normPhone(lookPhone));
      if (m) {
        setFound(m);
        setYears(new Set(m.dueYears));
        setCustom("");
      } else setLookError(`সদস্য নং (${memberId}) ও এই মোবাইল নম্বরের সাথে কোনো তথ্য মেলেনি। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।`);
    } catch {
      setLookError("তথ্য আনতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    }
    setLooking(false);
  };

  return (
    <div ref={top} className="scroll-mt-28 space-y-5">
      <SelectField
        label="আপনি কি নতুন নাকি পুরাতন সদস্য? *"
        value={kind}
        onChange={setKind}
        placeholder="সদস্যের ধরন নির্বাচন করুন"
        options={[
          { value: "new", label: "নতুন সদস্য — আবেদন ফরম" },
          { value: "existing", label: "পুরাতন সদস্য — বকেয়া/চলতি অনুদান পরিশোধ" },
        ]}
      />

      {kind === "new" &&
        (done ? (
          <DoneNote title="আবেদন সফলভাবে গৃহীত হয়েছে!" onReset={reset}>
            আপনার তথ্য মারকাযুল ইহসান দপ্তরে জমা হয়েছে। শীঘ্রই অফিস থেকে আপনার সাথে যোগাযোগ করা হবে, ইনশাআল্লাহ।
          </DoneNote>
        ) : (
          <div className="space-y-5">
            <ol className="grid grid-cols-4 gap-1.5 sm:gap-2" aria-label={`ধাপ ${taka(step + 1)} / ৪`}>
              {STEPS.map((s, i) => (
                <li key={s} className="space-y-1.5">
                  <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-brand" : "bg-panel-2")} />
                  <span className={cn("block text-center text-[11px] leading-tight font-medium sm:text-xs", i === step ? "text-brand" : "text-ink-3")}>{s}</span>
                </li>
              ))}
            </ol>

            {step === 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-ink">বাৎসরিক অনুদান ক্যাটাগরি নির্বাচন করুন</p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {LIFETIME_TIERS.map((x) => {
                    const on = x.id === tierId;
                    return (
                      <button
                        key={x.id}
                        type="button"
                        onClick={() => setTierId(x.id)}
                        aria-pressed={on}
                        className={cn("flex items-center gap-3 rounded-2xl border-2 p-3 text-start transition", on ? "border-brand bg-brand-soft" : "border-line bg-panel hover:border-brand/40")}
                      >
                        <span className="tone flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ ["--tone" as string]: x.color }}>
                          <x.icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-num text-base font-bold text-ink">{taka(x.amount)} টাকা</span>
                          <span className="block text-[12.5px] text-ink-3">{x.title} • বাৎসরিক</span>
                        </span>
                        <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", on ? "border-brand bg-brand" : "border-line")}>
                          {on && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3.5">
                <p className="text-sm font-semibold text-ink">আবেদনকারীর ব্যক্তিগত বিবরণ</p>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="পূর্ণ নাম *" icon={User} value={name} onChange={setName} placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ" error={errors.name} />
                  </div>
                  <Field label="মোবাইল নম্বর *" icon={Phone} value={phone} onChange={setPhone} placeholder="017XXXXXXXX" error={errors.phone} tel />
                  <Field label="হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)" icon={Phone} value={whatsapp} onChange={setWhatsapp} placeholder="খালি রাখলে মোবাইল নম্বর" error={errors.whatsapp} tel />
                  <Field label="পেশা / পদবী *" icon={Briefcase} value={profession} onChange={setProfession} placeholder="যেমন: ব্যবসা / চাকরি" error={errors.profession} />
                  <Field label="বর্তমান ঠিকানা *" icon={House} value={address} onChange={setAddress} placeholder="যেমন: উত্তরা, ঢাকা" error={errors.address} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3.5">
                <p className="text-sm font-semibold text-ink">রেফারেন্স / মাধ্যম (ঐচ্ছিক)</p>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <Field label="কার মাধ্যমে সদস্য হচ্ছেন? (নাম)" icon={UserRound} value={refName} onChange={setRefName} placeholder="যেমন: মাওলানা আব্দুল মতীন" />
                  <Field label="মাধ্যমের মোবাইল নম্বর" icon={Phone} value={refPhone} onChange={setRefPhone} placeholder="017XXXXXXXX" error={errors.mediumPhone} tel />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <dl className="divide-y divide-line rounded-2xl border border-line text-sm">
                  {[
                    ["নাম", name.trim()],
                    ["মোবাইল", normPhone(phone)],
                    ["ক্যাটাগরি", `${tier.title} — ${taka(tier.amount)} টাকা (বাৎসরিক)`],
                    ["পেশা", profession.trim()],
                    ["ঠিকানা", address.trim()],
                    ...(refName.trim() ? [["মাধ্যম", refName.trim()]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-3 px-4 py-2.5">
                      <dt className="shrink-0 text-ink-3">{k}</dt>
                      <dd className="min-w-0 text-end font-medium break-words text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[
                    { pay: true, icon: Wallet, title: "এখনই অনুদান পরিশোধ করবো", sub: "বিকাশ / কার্ড / ব্যাংকিং" },
                    { pay: false, icon: Send, title: "পরে পরিশোধ করবো", sub: "শুধু আবেদন ফরম জমা দিন" },
                  ].map((o) => (
                    <button
                      key={o.title}
                      type="button"
                      onClick={() => setPayNow(o.pay)}
                      aria-pressed={payNow === o.pay}
                      className={cn("flex items-center gap-3 rounded-2xl border-2 p-3 text-start transition", payNow === o.pay ? "border-brand bg-brand-soft" : "border-line bg-panel")}
                    >
                      <o.icon className="h-5 w-5 shrink-0 text-brand" />
                      <span>
                        <span className="block text-sm font-semibold text-ink">{o.title}</span>
                        <span className="block text-xs text-ink-3">{o.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {payNow ? (
                  <PaymentBox
                    amount={tier.amount}
                    buildBody={() => ({ lifetime: { kind: "new", application: application() } })}
                    bankAction={
                      <div className="space-y-2">
                        {saveError && <ErrorNote message={saveError} />}
                        <PrimaryButton onClick={() => submit("ব্যাংক ট্রান্সফার")} busy={saving} busyLabel="জমা হচ্ছে…" icon={Send}>
                          ব্যাংকে পাঠাবো — আবেদন ফরম জমা দিন
                        </PrimaryButton>
                      </div>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {saveError && <ErrorNote message={saveError} />}
                    <PrimaryButton onClick={() => submit()} busy={saving} busyLabel="জমা হচ্ছে…" icon={Send}>
                      আবেদন ফরম জমা দিন
                    </PrimaryButton>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => (setStep((s) => Math.max(0, s - 1)), scrollTop())}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-line px-4 text-sm font-medium text-ink hover:bg-panel-2 sm:px-5"
                >
                  <ArrowLeft className="h-[18px] w-[18px] rtl:rotate-180" />
                  পেছনে
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand text-[15px] font-semibold text-white hover:bg-brand-strong"
                >
                  পরবর্তী ধাপ
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </button>
              )}
            </div>
          </div>
        ))}

      {kind === "existing" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label="সদস্য নম্বর (Member ID) *" icon={Hash} value={memberId} onChange={(v) => setMemberId(v.replace(/[^0-9০-৯]/g, ""))} placeholder="যেমন: ৫৯" numeric />
            <Field label="নিবন্ধিত মোবাইল নম্বর *" icon={Phone} value={lookPhone} onChange={setLookPhone} placeholder="017XXXXXXXX" tel />
          </div>
          <PrimaryButton onClick={lookup} busy={looking} busyLabel="অনুসন্ধান হচ্ছে…" icon={Search}>
            হিসেব ও বকেয়া দেখুন
          </PrimaryButton>
          {lookError && <ErrorNote message={lookError} />}
          {found && (
            <div className="space-y-4">
              <MemberSummary
                name={found.name}
                rows={[
                  ["সদস্য নং", found.memberId],
                  ["বাৎসরিক অনুদান", found.pledgedAmount || "—"],
                  ...(found.joinYear ? ([["সদস্য হয়েছেন", bnYear(Number(found.joinYear))]] as [string, string][]) : []),
                ]}
              />
              {found.dueYears.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-ink">বকেয়া বছর নির্বাচন করুন</p>
                  <div className="flex flex-wrap gap-2">
                    {found.dueYears.map((y) => {
                      const on = years.has(y);
                      return (
                        <button
                          key={y}
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            setYears((s) => {
                              const n = new Set(s);
                              if (n.has(y)) n.delete(y);
                              else n.add(y);
                              return n;
                            })
                          }
                          className={cn("rounded-xl border-2 px-3.5 py-1.5 font-num text-sm font-semibold", on ? "border-brand bg-brand text-white" : "border-line text-ink-2")}
                        >
                          {bnYear(y)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-brand">আলহামদুলিল্লাহ! কোনো বকেয়া নেই। চাইলে অগ্রিম অনুদান দিতে পারেন।</p>
              )}
              {!yearly && <AmountField label="অনুদানের পরিমাণ *" value={custom} onChange={setCustom} />}
              <PaymentBox
                amount={due}
                buildBody={() => {
                  if (due < 10) {
                    setLookError("অনুদানের পরিমাণ সর্বনিম্ন ১০ টাকা হতে হবে।");
                    return null;
                  }
                  return {
                    lifetime: {
                      kind: "existing",
                      memberId: toEnDigits(found.memberId),
                      phone: normPhone(lookPhone),
                      name: found.name,
                      years: [...years].sort((a, b) => a - b),
                      amount: due,
                    },
                  };
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

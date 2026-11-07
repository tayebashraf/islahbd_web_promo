"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ChevronRight, CircleAlert, CircleCheck, HandHeart, Loader2, Search, TrendingUp, X } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";

interface Tier {
  id: string;
  amount: number;
  title: string;
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toEn = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

function cleanPhone(value: string) {
  const digits = toEn(value).replace(/[^0-9]/g, "");
  return digits.startsWith("880") ? "0" + digits.slice(3) : digits;
}

const inputCls =
  "w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[14px] text-foreground outline-none focus:border-primary";

/**
 * "বাৎসরিক অনুদান বাড়াতে চাই" under the existing-member search. The member proves who they are (member number +
 * mobile), picks a bigger package and sends a request; the office approves it, and from that year the
 * new amount applies. Earlier years stay as they were.
 */
export function UpgradePackage({ memberId, mobile, tiers }: { memberId: string; mobile: string; tiers: Tier[] }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [found, setFound] = useState<{ name: string; pledge: number } | null>(null);
  const [tierId, setTierId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const start = () => {
    setId(memberId);
    setPhone(mobile);
    setFound(null);
    setTierId("");
    setError(null);
    setDone(null);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  const money = (n: number) => `৳${n.toLocaleString(lang === "bn" ? "bn-BD" : "en-IN")}`;
  const bigger = found ? tiers.filter((x) => x.amount > found.pledge).sort((a, b) => a.amount - b.amount) : [];

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    const number = toEn(id).replace(/[^0-9]/g, "");
    const mobileNo = cleanPhone(phone);
    if (!number || !/^01[3-9]\d{8}$/.test(mobileNo)) {
      setError(t("সদস্য নম্বর ও সঠিক ১১ অঙ্কের মোবাইল নম্বর লিখুন।", "Enter your member ID and an 11-digit mobile number."));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lifetime-member/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: number, mobile: mobileNo }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok && data.member && data.member.phone_verified !== false) {
        setFound({ name: String(data.member.name ?? ""), pledge: Number(data.member.pledge) || 0 });
      } else if (res.status === 404) {
        setError(t("সদস্য নম্বর ও মোবাইল নম্বর একই সদস্যের সাথে মেলেনি।", "Member ID and mobile number do not match."));
      } else {
        setError(data?.member?.message || data?.message || t("এই মুহূর্তে যাচাই করা যাচ্ছে না। একটু পরে চেষ্টা করুন।", "Cannot verify right now. Please try again shortly."));
      }
    } catch {
      setError(t("ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।", "Check your connection and try again."));
    }
    setLoading(false);
  };

  const send = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lifetime-member/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: toEn(id), phone: cleanPhone(phone), tierId }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) setDone(data.message || t("আপনার অনুরোধ অফিসে পৌঁছেছে।", "Your request has reached the office."));
      else setError(data?.message || t("অনুরোধ পাঠানো যায়নি। একটু পরে চেষ্টা করুন।", "Could not send the request. Please try again."));
    } catch {
      setError(t("ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।", "Check your connection and try again."));
    }
    setLoading(false);
  };

  const year = new Date().getFullYear();
  const yearText = lang === "bn" ? year.toLocaleString("bn-BD", { useGrouping: false }) : String(year);

  return (
    <>
      <button
        type="button"
        onClick={start}
        className="group w-full mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#0F766E] px-4 py-3 text-left text-white shadow-md shadow-amber-900/20 transition hover:brightness-110 active:scale-[0.99]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/40">
          <TrendingUp className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold leading-snug">{t("বাৎসরিক অনুদান বাড়াতে চাই", "Increase my yearly contribution")}</span>
          <span className="block text-[12px] text-white/85 leading-snug">{t("আরও বড় অংকে খেদমতে শরিক হতে এখানে চাপুন", "Tap here to give a bigger share")}</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("বাৎসরিক অনুদান বাড়ান", "Increase yearly contribution")}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full sm:max-w-md max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-background p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[17px] font-bold text-foreground">{t("বাৎসরিক অনুদান বাড়ান", "Increase your yearly contribution")}</h3>
                <p className="text-[12.5px] text-muted-foreground mt-0.5">
                  {t("নতুন পরিমাণ বেছে অনুরোধ পাঠান — অফিস অনুমোদন করলে চালু হবে।", "Pick the new amount and send a request. It starts once the office approves.")}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("বন্ধ করুন", "Close")} className="p-1.5 -mr-1.5 rounded-lg text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="text-center py-2 space-y-3">
                <CircleCheck className="w-12 h-12 mx-auto text-emerald-500" />
                <p className="text-[15px] font-bold text-foreground">{done}</p>
                <button type="button" onClick={() => setOpen(false)} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-[15px]">
                  {t("ঠিক আছে", "Done")}
                </button>
              </div>
            ) : !found ? (
              <form onSubmit={verify} className="space-y-3">
                <label className="block">
                  <span className="block text-[12.5px] font-semibold text-foreground mb-1">{t("সদস্য নাম্বার (Member ID)", "Member ID")}</span>
                  <input value={id} onChange={(e) => setId(e.target.value.replace(/[^0-9০-৯]/g, ""))} inputMode="numeric" className={inputCls} placeholder={t("যেমন: ৫৯", "e.g. 59")} />
                </label>
                <label className="block">
                  <span className="block text-[12.5px] font-semibold text-foreground mb-1">{t("নিবন্ধিত মোবাইল নম্বর", "Registered mobile number")}</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className={inputCls} placeholder="01718XXXXXX" />
                </label>
                <button type="submit" disabled={loading} className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>{loading ? t("যাচাই হচ্ছে...", "Checking...") : t("পরের ধাপ", "Next")}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-3.5">
                <div className="rounded-2xl border border-border px-4 py-3">
                  <p className="text-[15px] font-bold text-foreground truncate">{found.name}</p>
                  <p className="text-[12.5px] text-muted-foreground">{t("এখন আপনার বাৎসরিক অনুদান", "Your yearly contribution now")}: <b className="text-foreground">{money(found.pledge)}</b></p>
                </div>
                {bigger.length === 0 ? (
                  <p className="text-sm font-semibold text-emerald-600 text-center py-1">{t("আপনি সর্বোচ্চ পরিমাণে অনুদান দিচ্ছেন। জাযাকাল্লাহু খাইরান।", "You already give the highest amount. Jazakallahu khairan.")}</p>
                ) : (
                  <>
                    <p className="text-[13px] font-semibold text-foreground">{t("নতুন বাৎসরিক অনুদান বেছে নিন", "Choose the new yearly amount")}</p>
                    <div className="space-y-2" role="radiogroup" aria-label={t("নতুন বাৎসরিক অনুদান", "New yearly amount")}>
                      {bigger.map((x) => {
                        const on = tierId === x.id;
                        return (
                          <button
                            key={x.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setTierId(x.id)}
                            className={`w-full flex items-center justify-between gap-3 px-4 h-12 rounded-xl border-2 text-left ${on ? "border-primary bg-primary/5" : "border-border"}`}
                          >
                            <span className="text-[15px] font-bold text-primary shrink-0">{money(x.amount)} <span className="text-[11.5px] font-medium text-muted-foreground">{t("/ বছর", "/ year")}</span></span>
                            <span className="text-[12px] text-muted-foreground truncate">{x.title}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                      {t(
                        `অনুমোদনের পর ${yearText} সাল থেকে নতুন পরিমাণ ধরা হবে। আগের বছরগুলোর হিসাব আগের মতোই থাকবে, আর এ বছর যা দিয়েছেন তা নতুন পরিমাণের সাথে গণ্য হবে।`,
                        `Once approved, the new amount applies from ${yearText}. Earlier years stay as they were, and what you have paid this year counts toward the new amount.`
                      )}
                    </p>
                    <button type="button" onClick={send} disabled={loading || !tierId} className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] disabled:opacity-50">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HandHeart className="w-4 h-4" />}
                      <span>{loading ? t("পাঠানো হচ্ছে...", "Sending...") : t("অনুরোধ পাঠান", "Send request")}</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-2xl border border-red-500/30 bg-red-500/10">
                <CircleAlert className="w-[18px] h-[18px] text-red-500 shrink-0 mt-0.5" />
                <p className="text-[12.5px] leading-relaxed text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

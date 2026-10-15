"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, X, CheckCircle2, Copy, Check, Download, ShieldCheck } from "lucide-react";

export interface LifetimeReceiptData {
  receiptNo: string;
  date: string;
  name: string;
  memberId?: string;
  address?: string;
  amount: number;
  amountInWords?: string;
  mobile: string;
  tierTitle?: string;
  trxId?: string;
  paymentMethod?: string;
  donationType?: "monthly" | "yearly";
}

export function numberToBanglaWords(num: number | string): string {
  const n = typeof num === "string" ? parseInt(num.replace(/[^0-9]/g, ""), 10) : Math.floor(num);
  if (isNaN(n) || n === 0) return "শূন্য টাকা মাত্র";

  const ones = [
    "", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ",
    "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোল", "সতেরো", "আঠারো", "উনিশ", "বিশ",
    "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ", "ত্রিশ",
    "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ", "চল্লিশ",
    "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ", "পঞ্চাশ",
    "একান্ন", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট", "ষাট",
    "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর", "সত্তর",
    "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি", "আশি",
    "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "অষ্টআশি", "ঊননব্বই", "নব্বই",
    "একানব্বই", "বানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"
  ];

  function convertChunk(val: number): string {
    let res = "";
    if (val >= 100) {
      const h = Math.floor(val / 100);
      res += (ones[h] ? ones[h] + " শত " : "");
      val %= 100;
    }
    if (val > 0) {
      res += ones[val] + " ";
    }
    return res.trim();
  }

  const crore = Math.floor(n / 10000000);
  let rem = n % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  const hundred = rem;

  let out = "";
  if (crore > 0) out += (crore < 100 ? ones[crore] : convertChunk(crore)) + " কোটি ";
  if (lakh > 0) out += ones[lakh] + " লক্ষ ";
  if (thousand > 0) out += ones[thousand] + " হাজার ";
  if (hundred > 0) out += convertChunk(hundred) + " ";

  return out.trim() + " টাকা মাত্র";
}

function toBanglaDigits(input: string | number): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(input).replace(/[0-9]/g, (w) => banglaDigits[+w]);
}

export function LifetimeReceiptModal({
  data,
  isOpen,
  onClose,
}: {
  data: LifetimeReceiptData | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const words = data.amountInWords || numberToBanglaWords(data.amount);
  const formattedAmount = data.amount.toLocaleString("en-IN");
  const banglaAmount = toBanglaDigits(formattedAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTrx = () => {
    if (data.trxId && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(data.trxId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-border overflow-hidden my-auto"
        >
          {/* Header Action Ribbon */}
          <div className="no-print flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-bangla">অফিসিয়াল আজীবন সদস্য মানি রসিদ</h4>
                <p className="text-[11px] text-emerald-200">মারকাযুল ইহসান অনলাইন পেমেন্ট ভেরিফাইড</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer font-bangla"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট রসিদ</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Voucher Paper */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bangla">
            <div
              ref={receiptRef}
              id="lifetime-official-receipt"
              className="relative bg-[#FCFDF9] dark:bg-slate-900 border-2 border-[#15803D]/40 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(21, 128, 61, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
              }}
            >
              {/* Left Vertical Band: "MONEY RECEIPT" (Matches physical receipt Image 4) */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 bg-gradient-to-b from-[#14532D] via-[#166534] to-[#14532D] flex items-center justify-center shadow-inner">
                <span
                  className="text-white/90 font-serif font-black tracking-[0.28em] text-[10px] sm:text-[11px] uppercase whitespace-nowrap select-none"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  MONEY RECEIPT
                </span>
              </div>

              {/* Main Content inside with Left Margin */}
              <div className="pl-8 sm:pl-10">
                {/* Top Center Header */}
                <div className="text-center border-b-2 border-[#15803D]/30 pb-3 relative">
                  {/* Decorative Conference Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-600/30 text-amber-900 dark:text-amber-300 text-[11px] font-bold mb-1 shadow-2xs">
                    <span>★</span>
                    <span>আজীবন সদস্য সম্মেলন</span>
                    <span>★</span>
                  </div>

                  <p className="text-[10.5px] font-semibold text-[#166534] dark:text-emerald-400">
                    জামেয়া-র সার্বিক উন্নতি-অগ্রগতির লক্ষ্যে
                  </p>

                  <h1 className="text-xl sm:text-2xl font-black text-[#14532D] dark:text-emerald-300 tracking-tight mt-1 leading-snug">
                    জামেয়া মারকাযুল ইহসান ঢাকা
                  </h1>

                  <h2 className="text-[11px] sm:text-[12px] font-extrabold tracking-widest text-slate-700 dark:text-slate-300 uppercase font-sans">
                    JAMEA MARKAZUL IHSAN DHAKA
                  </h2>

                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-serif mt-0.5" dir="rtl">
                    جامعة مركز الإحسان دكا الإسلامية
                  </p>
                </div>

                {/* Receipt Number & Date */}
                <div className="flex items-center justify-between text-xs sm:text-[13px] pt-3 pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-600 dark:text-slate-400">রসিদ নং:</span>
                    <span className="font-mono font-black text-[#14532D] dark:text-emerald-400 text-sm sm:text-base">
                      {data.receiptNo}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-600 dark:text-slate-400">তারিখ:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{data.date}</span>
                  </div>
                </div>

                {/* Form Fields Table / Lines */}
                <div className="py-3 space-y-2.5 text-xs sm:text-[13px] leading-relaxed">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">নাম:</span>
                    <span className="flex-1 font-extrabold text-[#14532D] dark:text-emerald-300 border-b border-dotted border-slate-400 dark:border-slate-600 pb-0.5">
                      {data.name}
                    </span>
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className="font-bold text-slate-700 dark:text-slate-300">সদস্য নং:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 border-b border-dotted border-slate-400 dark:border-slate-600 pb-0.5 min-w-[80px]">
                        {data.memberId || "অনলাইন-নতুন"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">ঠিকানা:</span>
                    <span className="flex-1 text-slate-800 dark:text-slate-200 border-b border-dotted border-slate-400 dark:border-slate-600 pb-0.5">
                      {data.address || "ঢাকা, বাংলাদেশ"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={data.donationType === "monthly"}
                        readOnly
                        className="rounded border-slate-400 text-emerald-600"
                      />
                      <span>মাসিক</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={data.donationType !== "monthly"}
                        readOnly
                        className="rounded border-slate-400 text-emerald-600"
                      />
                      <span>বার্ষিক ({data.tierTitle || "আজীবন সদস্য অনুদান"})</span>
                    </label>

                    {data.trxId && (
                      <div className="ml-auto flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                        <span>TrxID:</span>
                        <strong className="text-foreground">{data.trxId}</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className="font-bold text-slate-700 dark:text-slate-300">পরিমাণ:</span>
                      <span className="font-mono font-black text-base text-[#14532D] dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-300 dark:border-emerald-700">
                        ৳ {banglaAmount} /- ({formattedAmount} BDT)
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 flex-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">কথায়:</span>
                      <span className="flex-1 font-bold text-emerald-900 dark:text-emerald-300 border-b border-dotted border-slate-400 dark:border-slate-600 pb-0.5">
                        {words}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">মোবাইল:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 border-b border-dotted border-slate-400 dark:border-slate-600 pb-0.5 flex-1">
                      {data.mobile}
                    </span>
                    {data.paymentMethod && (
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                        [ {data.paymentMethod} ]
                      </span>
                    )}
                  </div>
                </div>

                {/* Signatures (Bottom) */}
                <div className="pt-8 pb-3 grid grid-cols-2 gap-4 text-center text-[11px]">
                  <div>
                    {/* Simulated Signature */}
                    <div className="h-6 flex items-end justify-center">
                      <span className="font-serif italic font-bold text-emerald-900 dark:text-emerald-400 text-sm tracking-wider">
                        Principal / মুহতামিম
                      </span>
                    </div>
                    <div className="border-t border-slate-500 w-36 mx-auto pt-1 font-bold text-slate-700 dark:text-slate-300">
                      প্রিন্সিপালের স্বাক্ষর
                    </div>
                  </div>

                  <div>
                    <div className="h-6 flex items-end justify-center">
                      <span className="font-sans font-bold text-slate-800 dark:text-slate-200 text-xs">
                        Accounts / PGW
                      </span>
                    </div>
                    <div className="border-t border-slate-500 w-36 mx-auto pt-1 font-bold text-slate-700 dark:text-slate-300">
                      আদায়কারীর স্বাক্ষর
                    </div>
                  </div>
                </div>

                {/* Footer Address Info */}
                <div className="pt-2 border-t border-slate-300 dark:border-slate-700 text-[10px] sm:text-[10.5px] text-slate-600 dark:text-slate-400 leading-relaxed text-center space-y-0.5">
                  <p>
                    <strong className="font-bold text-slate-800 dark:text-slate-200">স্থায়ী ক্যাম্পাস:</strong> পাইটি, ডেমরা, ঢাকা •{" "}
                    <strong className="font-bold text-slate-800 dark:text-slate-200">অস্থায়ী ক্যাম্পাস:</strong> ৬নং শহীদ ফারুক সড়ক, পশ্চিম যাত্রাবাড়ী, ঢাকা-১২০৪
                  </p>
                  <p className="font-mono font-semibold">
                    মোবাইল: ০১৯০৬-৮৩২৪৫০, ০১৭৬৫-৮১১৯৪৭ • markazulihsandhaka2018@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions for user */}
            <div className="no-print mt-4 flex items-center justify-between gap-3 flex-wrap">
              {data.trxId && (
                <button
                  type="button"
                  onClick={handleCopyTrx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "কপি হয়েছে!" : `TrxID কপি: ${data.trxId}`}</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer font-bangla"
                >
                  <Printer className="w-4 h-4" />
                  <span>রসিদ প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary text-foreground text-xs font-semibold cursor-pointer"
                >
                  সম্পন্ন
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

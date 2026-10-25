'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/ui';

export default function WriterApplicationPage() {
  return (
    <div className="w-full max-w-[640px] mx-auto py-8 px-4 font-kalpurush">
      <PageHeader
        eyebrow="লেখক প্যানেল ও প্রকাশনা"
        title="লেখক নিবন্ধন ও প্রকাশনা ব্যবস্থাপনা"
      />

      <div className="fb-card p-6 sm:p-8 text-center space-y-5 mt-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
          <ShieldCheck size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-ink">
            নিবন্ধন কেন্দ্রীয়ভাবে সংরক্ষিত
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            ইসলাহ ব্লগে সাধারণ পাঠকদের জন্য উন্মুক্ত লেখক নিবন্ধন আপাতত স্থগিত রাখা হয়েছে। প্রামাণ্য তাহকিক ও গুণগত মান নিশ্চিত করতে সকল নিবন্ধ কেন্দ্রীয় সম্পাদনা পর্ষদ, ওয়েব অ্যাডমিন ও মোবাইল অ্যাডমিন অ্যাপের মাধ্যমে প্রকাশিত হয়।
          </p>
        </div>

        <div className="p-4 rounded-xl bg-canvas-2 border border-line text-xs sm:text-sm text-ink-2 space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-semibold text-ink">
            <Lock size={15} />
            <span>অ্যাডমিন প্যানেল নিয়ন্ত্রণ</span>
          </div>
          <p className="text-muted-foreground">
            অনুমোদিত সম্পাদক ও গবেষকবৃন্দ অ্যাডমিন ড্যাশবোর্ড থেকে লেখা পরিচালনা ও সরাসরি পাবলিশ করতে পারবেন।
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-strong transition active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>ব্লগে ফিরে যান</span>
          </Link>
          <Link
            href="/blog/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-line bg-panel text-ink font-semibold text-sm hover:border-brand/40 transition active:scale-95"
          >
            <BookOpen size={16} />
            <span>অ্যাডমিন লগইন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

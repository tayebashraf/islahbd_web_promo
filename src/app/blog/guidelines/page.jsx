import React from 'react';
import { PageHeader } from '@/components/dashboard/ui';
import { FileCheck } from 'lucide-react';

export const metadata = {
  title: 'লেখার নীতিমালা ও তথ্যসূত্র মানদণ্ড | ইসলাহ ব্লগ',
  description: 'ইসলাহ ব্লগে লেখা ও তাহকিকের ক্ষেত্রে অনুসৃত ইলমী নীতি ও একাডেমিক মানদণ্ড।',
};

export default function GuidelinesPage() {
  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      <PageHeader
        title="লেখার নীতিমালা ও তথ্যসূত্র"
        muted="একাডেমিক মানদণ্ড"
        description="ইসলাহ ব্লগে প্রতিটি লেখার মান ও প্রামাণিকতা রক্ষার্থে সম্পাদক ও লেখকদের জন্য আবশ্যকীয় ইলমী নীতিমালা।"
      />

      <div className="fb-card p-6 sm:p-8 space-y-4">
        <div className="space-y-4 text-ink-2 leading-relaxed text-sm sm:text-base">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink mb-1">
              ১. বিশুদ্ধ সূত্রের রেফারেন্স বাধ্যতামূলক
            </h3>
            <p className="text-muted-foreground">
              প্রতিটি ঐতিহাসিক ঘটনা বা হাদিসের মূল আরবি কিতাবের নাম, খণ্ড ও হাদিস নম্বর উল্লেখ করতে হবে (যেমন: সহীহ বুখারী, সিরাতে ইবনে হিশাম, আর-রাহিকুল মাখতুম)।
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink mb-1">
              ২. দুর্বল ও অপ্রমাণিত বর্ণনা পরিহার
            </h3>
            <p className="text-muted-foreground">
              রাসূলুল্লাহ ﷺ-এর শানে কোনো ভিত্তিহীন (মওজু) বা অতিরঞ্জিত বর্ণনা প্রচার থেকে সম্পূর্ণ বিরত থাকতে হবে।
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink mb-1">
              ৩. ভাষার শালীনতা ও সম্মানবোধ
            </h3>
            <p className="text-muted-foreground">
              রাসূলুল্লাহ ﷺ ও সাহাবায়ে কেরামের নামোল্লেখের সময় উপযুক্ত তা'জীম ও দরূদ-সালাম (ﷺ, রাযিয়াল্লাহু আনহু) সংযোজন নিশ্চিত করতে হবে।
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink mb-1">
              ৪. বিশুদ্ধ বাংলা ও নির্ভুল বানানরীতি
            </h3>
            <p className="text-muted-foreground">
              প্রমিত বাংলা বানান ও যতিচিহ্নের সঠিক ব্যবহার নিশ্চিত করা আবশ্যক। পরিভাষা ব্যবহারের ক্ষেত্রে মূল ইসলামী ভাবধারা বজায় রাখতে হবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

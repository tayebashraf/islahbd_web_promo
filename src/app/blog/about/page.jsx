import React from 'react';
import { PageHeader } from '@/components/dashboard/ui';
import { Info } from 'lucide-react';

export const metadata = {
  title: 'আমাদের লক্ষ্য ও দর্শন | ইসলাহ ব্লগ',
  description: 'ইসলাহ ব্লগের উদ্দেশ্য, লক্ষ্য এবং প্রামাণ্য ইসলামিক পাবলিশিং দর্শন।',
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      <PageHeader
        title="আমাদের লক্ষ্য ও দর্শন"
        muted="পরিচিতি ও রূপরেখা"
        description="রাসূলুল্লাহ ﷺ-এর পবিত্র সীরাত, তাযকিয়ায়ে নফস ও প্রামাণ্য ইসলামিক জ্ঞান চর্চার উন্মুক্ত আর্কাইভ।"
      />

      <div className="fb-card p-6 sm:p-8 space-y-5">
        <p className="text-base text-brand font-semibold leading-relaxed">
          রাসূলুল্লাহ ﷺ-এর পবিত্র সীরাত, জীবন, চরিত্র ও শিক্ষাকে আন্তর্জাতিক মানের আধুনিক সামাজিক ও ডিজিটাল প্রকাশনার মাধ্যমে মানুষের হৃদয়ে পৌঁছে দেওয়াই ইসলাহ ব্লগের মূল উদ্দেশ্য।
        </p>

        <div className="space-y-4 text-ink-2 leading-relaxed text-sm sm:text-base">
          <div>
            <h3 className="text-lg font-bold text-ink mb-1">
              ১. প্রামাণিক ইলমী দায়িত্বশীলতা
            </h3>
            <p>
              সীরাতের প্রতিটি তথ্য যেন কুরআন, বিশুদ্ধ হাদিসগ্রন্থ এবং নির্ভরযোগ্য সীরাত শাস্ত্রীয় মূল উৎসের আলোকে লিখিত হয়—তা নিশ্চিত করাই আমাদের সর্বোচ্চ অগ্রাধিকার।
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink mb-1">
              ২. সমকালীন প্রাসঙ্গিকতা
            </h3>
            <p>
              রাসূলুল্লাহ ﷺ সমগ্র মানবজাতির জন্য সর্বোত্তম আদর্শ। আধুনিক সমাজ, পরিবার, অর্থনীতি ও মানব সম্পর্কের ক্ষেত্রে সীরাতের সমাধান তুলে ধরাই আমাদের উদ্দেশ্য।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-canvas-2 border border-line my-4 space-y-2">
            <div className="font-arabic text-xl sm:text-2xl text-right text-ink leading-relaxed">
              لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground text-left">
              "নিশ্চয়ই তোমাদের জন্য আল্লাহর রাসূলের মধ্যে রয়েছে উত্তম আদর্শ।" — সূরা আল-আহযাব: ২১
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink mb-1">
              ৩. তাযকিয়া ও আত্মশুদ্ধি
            </h3>
            <p>
              শুধুমাত্র তাত্ত্বিক আলোচনা নয়, বরং অন্তরের ইসলাহ, আখলাক উন্নয়ন এবং সুন্নাহভিত্তিক সুন্দর জীবন গঠনের প্রেরণা জাগ্রত করা আমাদের নিরন্তর প্রচেষ্টা।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

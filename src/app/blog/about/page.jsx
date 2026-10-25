import React from 'react';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import Button from '@/components/sirat/ui/Button';
import { Info } from 'lucide-react';

export const metadata = {
  title: 'আমাদের লক্ষ্য ও দর্শন',
  description: 'সীরাত.ব্লগের উদ্দেশ্য, লক্ষ্য এবং কন্টেন্ট-ফার্স্ট পাবলিশিং দর্শন।',
};

export default function AboutPage() {
  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />

      <main className="fb-feed-container" aria-label="আমাদের লক্ষ্য ও দর্শন">
        <div className="fb-card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Info size={24} color="#1877F2" />
            <h1 style={{ fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>
              আমাদের লক্ষ্য ও দর্শন
            </h1>
          </div>

          <p style={{ fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)', fontWeight: '500', marginBottom: 'var(--space-4)' }}>
            রাসূলুল্লাহ ﷺ-এর পবিত্র সীরাত, জীবন, চরিত্র ও শিক্ষাকে আন্তর্জাতিক মানের আধুনিক সামাজিক ও ডিজিটাল প্রকাশনার মাধ্যমে মানুষের হৃদয়ে পৌঁছে দেওয়াই সীরাত.ব্লগের মূল উদ্দেশ্য।
          </p>

          <div style={{ fontFamily: 'var(--font-bengali-body)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-bengali-body)', color: 'var(--color-text-primary)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginTop: 'var(--space-4)', marginBottom: 'var(--space-1)' }}>
              ১. প্রামাণিক ইলমী দায়িত্বশীলতা
            </h3>
            <p style={{ marginBottom: 'var(--space-3)' }}>
              সীরাতের প্রতিটি তথ্য যেন কুরআন, বিশুদ্ধ হাদিসগ্রন্থ এবং নির্ভরযোগ্য সীরাত শাস্ত্রীয় মূল উৎসের আলোকে লিখিত হয়—তা নিশ্চিত করাই আমাদের সর্বোচ্চ অগ্রাধিকার।
            </p>

            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginTop: 'var(--space-4)', marginBottom: 'var(--space-1)' }}>
              ২. সমকালীন প্রাসঙ্গিকতা
            </h3>
            <p style={{ marginBottom: 'var(--space-3)' }}>
              রাসূলুল্লাহ ﷺ সমগ্র মানবজাতির জন্য সর্বোত্তম আদর্শ। আধুনিক সমাজ, পরিবার, অর্থনীতি ও মানব সম্পর্কের ক্ষেত্রে সীরাতের সমাধান তুলে ধরাই আমাদের উদ্দেশ্য।
            </p>

            <div className="fb-post-hadith-box" style={{ margin: 'var(--space-4) 0' }}>
              <div className="fb-post-hadith-arabic">
                لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ
              </div>
              <div className="fb-post-hadith-translation">
                "নিশ্চয়ই তোমাদের জন্য আল্লাহর রাসূলের মধ্যে রয়েছে উত্তম আদর্শ।" — সূরা আল-আহযাব: ২১
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              আপনিও কি লিখতে চান?
            </span>
            <Button variant="primary" size="sm" href="/blog/apply">
              লেখক আবেদন করুন
            </Button>
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}

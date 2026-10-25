import React from 'react';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import Button from '@/components/sirat/ui/Button';
import { FileCheck } from 'lucide-react';

export const metadata = {
  title: 'লেখার নীতিমালা ও সিরাত যাচাই পদ্ধতি',
  description: 'সীরাত.ব্লগে লেখা জমা ও সম্পাদনার ক্ষেত্রে অনুসৃত নীতি ও একাডেমিক মানদণ্ড।',
};

export default function GuidelinesPage() {
  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />

      <main className="fb-feed-container" aria-label="লেখার নীতিমালা">
        <div className="fb-card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <FileCheck size={24} color="#1877F2" />
            <h1 style={{ fontFamily: 'var(--font-kalpurush), Kalpurush, sans-serif', fontSize: '1.25rem', fontWeight: 700 }}>
              লেখার নীতিমালা ও তথ্যসূত্র মানদণ্ড
            </h1>
          </div>

          <p style={{ fontFamily: 'var(--font-kalpurush), Kalpurush, sans-serif', fontSize: '13.5px', color: '#64748B', marginBottom: 'var(--space-4)' }}>
            সীরাত.ব্লগে প্রতিটি লেখার মান ও প্রামাণিকতা রক্ষার্থে লেখকদের জন্য আবশ্যক নীতিমালা:
          </p>

          <div style={{ fontFamily: 'var(--font-kalpurush), Kalpurush, sans-serif', fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-primary)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
              ১. বিশুদ্ধ সূত্রের রেফারেন্স বাধ্যতামূলক
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              প্রতিটি ঐতিহাসিক ঘটনা বা হাদিসের মূল আরবি কিতাবের নাম, খণ্ড ও হাদিস নম্বর উল্লেখ করতে হবে (যেমন: সহীহ বুখারী, সিরাতে ইবনে হিশাম, আর-রাহিকুল মাখতুম)।
            </p>

            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
              ২. দুর্বল ও অপ্রমাণিত বর্ণনা পরিহার
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              রাসূলুল্লাহ ﷺ-এর শানে কোনো ভিত্তিহীন (মওজু) বা অতিরঞ্জিত বর্ণনা প্রচার থেকে সম্পূর্ণ বিরত থাকতে হবে।
            </p>

            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
              ৩. ভাষার শালীনতা ও সম্মানবোধ
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              রাসূলুল্লাহ ﷺ ও সাহাবায়ে কেরামের নামোল্লেখের সময় উপযুক্ত তা'জীম ও দরূদ-সালাম (ﷺ, রাযিয়াল্লাহু আনহু) সংযোজন নিশ্চিত করতে হবে।
            </p>
          </div>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              নীতিমালায় সম্মত থাকলে
            </span>
            <Button variant="primary" size="sm" href="/blog/apply">
              লেখক হিসেবে আবেদন করুন
            </Button>
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import AuthorProfile from '@/components/sirat/author/AuthorProfile';
import PostCard from '@/components/sirat/feed/PostCard';
import Button from '@/components/sirat/ui/Button';
import { getAuthorById, sampleArticles } from '@/lib/sirat/sampleData';
import { BookOpen, Sparkles, ArrowLeft } from 'lucide-react';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function AuthorDetailPage() {
  const params = useParams();
  const author = getAuthorById(params.id);
  const authorArticles = sampleArticles.filter((a) => a.authorId === params.id);
  const [activeTab, setActiveTab] = useState('articles');

  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />

      <main className="fb-feed-container" aria-label="লেখক প্রোফাইল ও টাইমলাইন">
        {/* Back Link */}
        <div style={{ marginBottom: '10px' }}>
          <Link
            href="/blog/authors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-kalpurush)',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--color-brand-primary)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={15} />
            <span>সকল গবেষক ও লেখক তালিকা</span>
          </Link>
        </div>

        {author ? (
          <>
            {/* 1. Facebook-Style Author Profile Card */}
            <AuthorProfile author={author} articleCount={authorArticles.length} />

            {/* 2. Sticky Tab Filter Bar */}
            <div
              className="fb-card"
              style={{
                padding: '6px 10px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('articles')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'articles' ? 'var(--color-brand-primary)' : 'transparent',
                  color: activeTab === 'articles' ? '#FFFFFF' : 'var(--color-text-primary)',
                  fontFamily: 'var(--font-kalpurush)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <BookOpen size={14} />
                <span>প্রকাশিত প্রবন্ধসমূহ ({toBanglaNum(authorArticles.length)})</span>
              </button>
            </div>

            {/* 3. Author's Stream of Articles (PostCards) */}
            <div className="fb-posts-stream">
              {authorArticles.map((article) => (
                <PostCard key={article.id} article={article} />
              ))}

              {authorArticles.length === 0 && (
                <div className="fb-card" style={{ padding: '36px 16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '14px', color: '#64748B' }}>
                    এই লেখকের এখনও কোনো প্রকাশিত প্রবন্ধ নেই।
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="fb-card" style={{ padding: '36px 16px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              লেখকের তথ্য পাওয়া যায়নি
            </h2>
            <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13.5px', color: '#64748B', marginBottom: '16px' }}>
              আপনি যে লেখকের প্রোফাইল খুঁজছেন তা হয়তো মুছে ফেলা হয়েছে বা লিংকটি সঠিক নয়।
            </p>
            <Button variant="primary" href="/blog/authors">
              সকল লেখক দেখুন
            </Button>
          </div>
        )}
      </main>

      <RightSidebar />
    </div>
  );
}

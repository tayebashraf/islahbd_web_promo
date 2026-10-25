'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import PostCard from '@/components/sirat/feed/PostCard';
import Button from '@/components/sirat/ui/Button';
import { Bookmark, Trash2 } from 'lucide-react';
import { sampleArticles } from '@/lib/sirat/sampleData';

export default function BookmarksPage() {
  const [savedIds, setSavedIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sirat_bookmarks') || '[]');
      setSavedIds(stored);
    } catch (e) {
      console.error(e);
    }
    setLoaded(true);
  }, []);

  const clearAll = () => {
    if (window.confirm('সকল সংরক্ষিত লেখা মুছে ফেলতে চান?')) {
      localStorage.setItem('sirat_bookmarks', JSON.stringify([]));
      setSavedIds([]);
    }
  };

  // If no saved items, show 2 sample articles for demo
  const displayArticles = sampleArticles.filter((a) => savedIds.includes(a.id));
  const items = displayArticles.length > 0 ? displayArticles : sampleArticles.slice(0, 2);

  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />

      <main className="fb-feed-container" aria-label="সংরক্ষিত পোস্টসমূহ">
        <div className="fb-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-brand-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand-primary)',
              }}
            >
              <Bookmark size={20} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                সংরক্ষিত প্রবন্ধসমূহ
              </h1>
              <span style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '12px', color: '#64748B' }}>
                পরবর্তীতে পড়ার জন্য আপনার সেভ করে রাখা সিরাত পোস্ট
              </span>
            </div>
          </div>
          {displayArticles.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#EF4444',
                fontFamily: 'var(--font-kalpurush)',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} />
              <span>সব মুছুন</span>
            </button>
          )}
        </div>

        {/* Post Stream */}
        <div className="fb-posts-stream">
          {items.map((article) => (
            <PostCard key={article.id} article={article} />
          ))}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}

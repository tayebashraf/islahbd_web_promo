'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from '@/components/sirat/feed/PostCard';
import { Bookmark, Trash2, BookOpen } from 'lucide-react';
import { sampleArticles } from '@/lib/sirat/sampleData';
import { PageHeader, EmptyState } from '@/components/dashboard/ui';
import BlogNav from '@/components/sirat/layout/BlogNav';

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

  const displayArticles = sampleArticles.filter((a) => savedIds.includes(a.id));
  const items = displayArticles.length > 0 ? displayArticles : sampleArticles.slice(0, 2);

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      {/* Blog Desktop Tab Navigation */}
      <BlogNav />

      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="সংরক্ষিত প্রবন্ধসমূহ"
          muted="ব্যক্তিগত লাইব্রেরি"
          description="পরবর্তীতে পড়ার জন্য আপনার সেভ করে রাখা প্রিয় ইসলামিক নিবন্ধ ও সীরাত পোস্ট।"
        />
        {displayArticles.length > 0 && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl hover:bg-rose-100 transition active:scale-95"
          >
            <Trash2 size={13} />
            <span>সব মুছুন</span>
          </button>
        )}
      </div>

      {/* Post Stream */}
      {items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="কোনো সংরক্ষিত প্রবন্ধ নেই"
          hint="পড়ার সময় যেকোনো পোস্টের বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করতে পারেন।"
        />
      ) : (
        <div className="fb-posts-stream space-y-4">
          {items.map((article) => (
            <PostCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

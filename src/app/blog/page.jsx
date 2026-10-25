'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PostCard from '@/components/sirat/feed/PostCard';
import { sampleArticles, sampleTopics } from '@/lib/sirat/sampleData';
import { PageHeader, EmptyState } from '@/components/dashboard/ui';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const INITIAL_BATCH_SIZE = 4;
const LOAD_MORE_BATCH_SIZE = 3;

const BLOG_CATEGORIES = [
  { slug: 'all', name: 'সব প্রবন্ধ' },
  { slug: 'sirat', name: 'সিরাত চর্চা' },
  { slug: 'akhlaq', name: 'আখলাক ও শামায়েল' },
  { slug: 'hadith', name: 'হাদিস ও সুন্নাহ' },
  { slug: 'makki-jiban', name: 'মক্কী জীবন' },
  { slug: 'madani-jiban', name: 'মাদানী জীবন' },
  { slug: 'tafsir', name: 'তাফসির ও আয়াত' },
  { slug: 'islamic-history', name: 'ইতিহাস ও ঐতিহ্য' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [feedPosts, setFeedPosts] = useState(sampleArticles);
  const [displayedCount, setDisplayedCount] = useState(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [streamCycle, setStreamCycle] = useState(1);
  const sentinelRef = useRef(null);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return feedPosts;
    return feedPosts.filter((art) => art.topicSlug === selectedCategory);
  }, [feedPosts, selectedCategory]);

  // Reset displayed count when category changes
  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    setDisplayedCount(INITIAL_BATCH_SIZE);
  };

  // Continuous infinite stream: As reader scrolls, stream earlier archive
  const loadMorePosts = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      setFeedPosts((prev) => {
        if (displayedCount >= prev.length) {
          const nextCycle = streamCycle + 1;
          setStreamCycle(nextCycle);
          const archivedBatch = [...sampleArticles]
            .sort((a, b) => (b.jazakallahCount || 0) - (a.jazakallahCount || 0))
            .map((art) => ({
              ...art,
              id: `${art.id}-archive-${nextCycle}`,
            }));
          return [...prev, ...archivedBatch];
        }
        return prev;
      });

      setDisplayedCount((prev) => prev + LOAD_MORE_BATCH_SIZE);
      setIsLoadingMore(false);
    }, 350);
  }, [isLoadingMore, displayedCount, streamCycle]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { rootMargin: '350px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMorePosts, isLoadingMore]);

  const visiblePosts = filteredPosts.slice(0, displayedCount);

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush">
      {/* 1. Official Islah Page Header */}
      <PageHeader
        title="ইসলাহ ব্লগ"
        muted="জ্ঞানভিত্তিক ইসলামিক নিবন্ধ ও সীরাত চর্চা"
        description="রাসূলুল্লাহ ﷺ-এর সীরাত, তাযকিয়ায়ে নফস, হাদীস ও প্রামাণ্য ইসলামিক গবেষণাধর্মী উন্মুক্ত ডিজিটাল আর্কাইভ।"
      />

      {/* 2. Sleek Horizontal Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {BLOG_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleSelectCategory(cat.slug)}
              className={cn(
                "inline-flex shrink-0 items-center rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer",
                active
                  ? "bg-brand text-white shadow-sm"
                  : "border border-line bg-panel text-ink hover:border-brand/40"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 3. Feed Posts Stream */}
      {visiblePosts.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="এই বিভাগে কোনো প্রবন্ধ পাওয়া যায়নি"
          hint="অন্য কোনো বিষয় বা 'সব প্রবন্ধ' নির্বাচন করে পড়ুন।"
        />
      ) : (
        <div className="fb-posts-stream space-y-4">
          {visiblePosts.map((article) => (
            <PostCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* 4. Loading Shimmer Skeleton */}
      {isLoadingMore && (
        <div className="fb-feed-skeleton-card fade-in mt-4" aria-live="polite">
          <div className="fb-skeleton-header">
            <div className="fb-skeleton-pulse fb-skeleton-avatar" />
            <div className="fb-skeleton-meta">
              <div className="fb-skeleton-pulse fb-skeleton-line" style={{ width: '40%' }} />
              <div className="fb-skeleton-pulse fb-skeleton-line" style={{ width: '25%' }} />
            </div>
          </div>
          <div className="fb-skeleton-pulse fb-skeleton-line fb-skeleton-line--title" />
          <div className="fb-skeleton-pulse fb-skeleton-line fb-skeleton-line--full" />
          <div className="fb-skeleton-pulse fb-skeleton-line fb-skeleton-line--full" />
          <div className="fb-skeleton-pulse fb-skeleton-line fb-skeleton-line--short" />
          <div className="fb-skeleton-loading-text">
            <span>পূর্ববর্তী ও জনপ্রিয় সিরাত প্রবন্ধ লোড হচ্ছে...</span>
          </div>
        </div>
      )}

      {/* 5. Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="fb-feed-sentinel" />
    </div>
  );
}

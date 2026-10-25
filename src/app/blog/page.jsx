'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PostCard from '@/components/sirat/feed/PostCard';
import { sampleArticles, sampleTopics } from '@/lib/sirat/sampleData';
import { EmptyState } from '@/components/dashboard/ui';
import BlogHero from '@/components/sirat/layout/BlogHero';
import { BookOpen, Sparkles, Heart, Feather, Compass, Layers, Bookmark, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const INITIAL_BATCH_SIZE = 4;
const LOAD_MORE_BATCH_SIZE = 3;

const BLOG_CATEGORIES = [
  { slug: 'all', name: 'সব প্রবন্ধ', icon: Sparkles },
  { slug: 'sirat', name: 'সিরাত চর্চা', icon: BookOpen },
  { slug: 'akhlaq', name: 'আখলাক ও শামায়েল', icon: Heart },
  { slug: 'hadith', name: 'হাদিস ও সুন্নাহ', icon: Feather },
  { slug: 'makki-jiban', name: 'মক্কী জীবন', icon: Compass },
  { slug: 'madani-jiban', name: 'মাদানী জীবন', icon: Layers },
  { slug: 'tafsir', name: 'তাফসির ও আয়াত', icon: Bookmark },
  { slug: 'islamic-history', name: 'ইতিহাস ও ঐতিহ্য', icon: ShieldCheck },
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
      {/* 1. Dignified Islamic Blog Hero & Desktop Tab Nav */}
      <BlogHero />

      {/* 2. Sleek Horizontal Category Filters */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs sm:text-sm font-semibold text-ink-2 flex items-center gap-1.5">
            <span>🏷️ বিষয়শ্রেণী ফিল্টার</span>
          </span>
          <span className="text-xs text-ink-3">
            {filteredPosts.length} টি প্রবন্ধ
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BLOG_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.slug;
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleSelectCategory(cat.slug)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer shadow-2xs",
                  active
                    ? "bg-brand text-white shadow-sm ring-2 ring-brand/20"
                    : "border border-line bg-panel text-ink hover:border-brand/40 hover:bg-brand-soft/40"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", active ? "text-white" : "text-brand")} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
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

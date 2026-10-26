'use client';

import React, { Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/sirat/feed/PostCard';
import { sampleArticles } from '@/lib/sirat/sampleData';
import { EmptyState } from '@/components/dashboard/ui';
import BlogNav, { BLOG_CATEGORIES } from '@/components/sirat/layout/BlogNav';
import { BookOpen, X } from 'lucide-react';

const INITIAL_BATCH_SIZE = 4;
const LOAD_MORE_BATCH_SIZE = 3;

/** The topic filter lives in the header's blog menu, which links here with `?topic=`. */
export default function HomePage() {
  return (
    <Suspense>
      <TopicFeed />
    </Suspense>
  );
}

function TopicFeed() {
  const topic = useSearchParams().get('topic') || 'all';
  // A new topic remounts the feed so paging starts over.
  return <Feed key={topic} selectedCategory={topic} />;
}

function Feed({ selectedCategory }) {
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
  const category = selectedCategory !== 'all' ? BLOG_CATEGORIES.find((c) => c.slug === selectedCategory) : null;

  return (
    // Phones: cancel the shell's side padding so posts run edge to edge.
    <div className="blog-feed -mx-4 w-auto max-w-[760px] py-1 font-kalpurush sm:mx-auto sm:w-full sm:py-4">
      <BlogNav />

      {category && (
        <div className="mb-3 flex items-center justify-between gap-3 px-4 sm:px-1">
          <p className="text-sm text-ink-2">
            <span className="font-semibold text-ink">{category.name}</span>
            <span className="mx-1.5 text-ink-3">·</span>
            {filteredPosts.length} টি প্রবন্ধ
          </p>
          <Link href="/blog" className="inline-flex items-center gap-1 rounded-full bg-panel-2 px-3 py-1 text-xs font-semibold text-ink-2 hover:text-brand">
            <X className="h-3.5 w-3.5" />
            সব প্রবন্ধ
          </Link>
        </div>
      )}

      {/* 3. Feed Posts Stream */}
      {visiblePosts.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="এই বিভাগে কোনো প্রবন্ধ পাওয়া যায়নি"
          hint="অন্য কোনো বিষয় বা 'সব প্রবন্ধ' নির্বাচন করে পড়ুন।"
        />
      ) : (
        <div className="fb-posts-stream sm:space-y-4">
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

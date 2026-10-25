'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import StoryCarousel from '@/components/sirat/feed/StoryCarousel';
import CreatePostBox from '@/components/sirat/feed/CreatePostBox';
import PostCard from '@/components/sirat/feed/PostCard';
import { sampleArticles } from '@/lib/sirat/sampleData';

import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/sirat/auth';

const INITIAL_BATCH_SIZE = 3;
const LOAD_MORE_BATCH_SIZE = 3;

export default function HomePage() {
  const [feedPosts, setFeedPosts] = useState(sampleArticles);
  const [displayedCount, setDisplayedCount] = useState(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [streamCycle, setStreamCycle] = useState(1);
  const sentinelRef = useRef(null);
  const { isWriter } = useAuth();

  const handleNewPost = (newPost) => {
    setFeedPosts((prev) => [newPost, ...prev]);
    setDisplayedCount((prev) => prev + 1);
  };

  // Continuous infinite stream: As user scrolls, seamlessly stream previous & popular posts
  const loadMorePosts = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      setFeedPosts((prev) => {
        // If we've displayed all current posts, seamlessly append from popular & earlier archive
        if (displayedCount >= prev.length) {
          const nextCycle = streamCycle + 1;
          setStreamCycle(nextCycle);
          // Sort by engagement / popularity for the continuous stream
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
    }, 400);
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

  const visiblePosts = feedPosts.slice(0, displayedCount);

  return (
    <div className="fb-layout fade-in">
      {/* 1. Left Sidebar (Sticky Shortcuts & Navigation) */}
      <LeftSidebar />

      {/* 2. Center News Feed */}
      <main className="fb-feed-container" aria-label="নিউজ ফিড">
        {/* Top: Facebook Story Highlights Carousel */}
        <StoryCarousel />

        {/* Create Post Box - ONLY for Approved Writers; Readers see application invitation */}
        {isWriter ? (
          <CreatePostBox onNewPost={handleNewPost} />
        ) : (
          <div style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            fontFamily: 'var(--font-kalpurush)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-text-primary)' }}>
                  সীরাত.ব্লগে তাহকিক লেখক ও গবেষক হতে চান?
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
                  সাধারণ পাঠকদের জন্য লেখালেখি উন্মুক্ত নয়; আবেদন করে অনুমোদিত লেখক হয়ে সিরাত চর্চায় অংশ নিন।
                </div>
              </div>
            </div>
            <Link
              href="/blog/apply"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#047857',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              <span>লেখক হিসেবে আবেদন করুন</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {/* Endless Facebook Feed Posts Stream */}
        <div className="fb-posts-stream">
          {visiblePosts.map((article) => (
            <PostCard key={article.id} article={article} />
          ))}
        </div>

        {/* Loading Shimmer Skeleton when streaming older / popular posts */}
        {isLoadingMore && (
          <div className="fb-feed-skeleton-card fade-in" aria-live="polite">
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
              <span>✨ পূর্ববর্তী ও জনপ্রিয় সিরাত প্রবন্ধ লোড হচ্ছে...</span>
            </div>
          </div>
        )}

        {/* Always-Active Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="fb-feed-sentinel" />
      </main>

      {/* 3. Right Sidebar (Daily Hadith & Active Scholars / Contacts) */}
      <RightSidebar />
    </div>
  );
}

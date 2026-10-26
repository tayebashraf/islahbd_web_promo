'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/sirat/feed/PostCard';
import { fetchSiratArticles, fetchSiratPlatformSettings, fetchSiratTopics } from '@/lib/sirat/sirat-api';
import { EmptyState } from '@/components/dashboard/ui';
import BlogNav from '@/components/sirat/layout/BlogNav';
import { BookOpen, Megaphone, X } from 'lucide-react';

const INITIAL_BATCH_SIZE = 4;
const LOAD_MORE_BATCH_SIZE = 3;

/**
 * The feed of published posts. Posts belong to topic profiles; the header's
 * blog menu links here with `?topic=<profile slug>` to show one profile.
 */
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
  return (
    <>
      <Announcement />
      <Feed key={topic} topic={topic} />
    </>
  );
}

/** Banner set from the admin panel (ইসলাহ ব্লগ → সেটিংস). */
function Announcement() {
  const [note, setNote] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchSiratPlatformSettings().then((s) => alive && s.announcementActive && s.announcementText && setNote(s));
    return () => {
      alive = false;
    };
  }, []);
  if (!note) return null;
  const body = (
    <>
      <Megaphone className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{note.announcementText}</span>
    </>
  );
  const cls =
    '-mx-4 mb-3 flex max-w-[760px] items-start gap-2.5 bg-brand-soft px-4 py-3 font-kalpurush text-sm leading-relaxed font-semibold text-brand sm:mx-auto sm:rounded-2xl';
  return note.announcementLink ? (
    <Link href={note.announcementLink} className={`${cls} hover:underline`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function Feed({ topic }) {
  const [posts, setPosts] = useState(null);
  const [profile, setProfile] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(INITIAL_BATCH_SIZE);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetchSiratArticles(topic === 'all' ? {} : { topicSlug: topic }).then((list) => alive && setPosts(list));
    if (topic !== 'all') {
      fetchSiratTopics().then((list) => alive && setProfile(list.find((t) => t.slug === topic) ?? null));
    }
    return () => {
      alive = false;
    };
  }, [topic]);

  const total = posts?.length ?? 0;
  const hasMore = displayedCount < total;

  // Reveal more posts as the reader nears the end of the list.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setDisplayedCount((n) => n + LOAD_MORE_BATCH_SIZE),
      { rootMargin: '350px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, displayedCount]);

  return (
    // Phones: cancel the shell's side padding so posts run edge to edge.
    <div className="blog-feed -mx-4 w-auto max-w-[760px] py-1 font-kalpurush sm:mx-auto sm:w-full sm:py-4">
      <BlogNav />

      {topic !== 'all' && (
        <div className="mb-3 flex items-center justify-between gap-3 px-4 sm:px-1">
          <p className="text-sm text-ink-2">
            <span className="font-semibold text-ink">{profile?.name ?? posts?.[0]?.topicName ?? ''}</span>
            {posts && (
              <>
                <span className="mx-1.5 text-ink-3">·</span>
                {total} টি পোস্ট
              </>
            )}
          </p>
          <Link href="/blog" className="inline-flex items-center gap-1 rounded-full bg-panel-2 px-3 py-1 text-xs font-semibold text-ink-2 hover:text-brand">
            <X className="h-3.5 w-3.5" />
            সব পোস্ট
          </Link>
        </div>
      )}

      {posts === null ? (
        <FeedSkeleton />
      ) : total === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="এখানে এখনো কোনো পোস্ট নেই"
          hint="শীঘ্রই নতুন লেখা আসছে, ইনশাআল্লাহ। অন্য বিষয়গুলো দেখতে উপরের মেনু খুলুন।"
        />
      ) : (
        <div className="fb-posts-stream sm:space-y-4">
          {posts.slice(0, displayedCount).map((article) => (
            <PostCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="fb-feed-sentinel">
          <FeedSkeleton />
        </div>
      )}
    </div>
  );
}

function FeedSkeleton() {
  return (
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
    </div>
  );
}

'use client';

import React, { Suspense, useCallback, useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/sirat/feed/PostCard';
import { fetchSiratArticles, fetchSiratPlatformSettings, fetchSiratQuizFeed, fetchSiratTopics } from '@/lib/sirat/sirat-api';
import { EmptyState } from '@/components/dashboard/ui';
import BlogNav from '@/components/sirat/layout/BlogNav';
import { BookOpen, Megaphone, X } from 'lucide-react';

const INITIAL_BATCH_SIZE = 4;
const LOAD_MORE_BATCH_SIZE = 3;
const QUIZ_PAGE_SIZE = 10;

/**
 * The feed: every profile's posts together, newest first. While the admins
 * have the quiz on, a question of the quiz bank follows every few posts, in
 * order, and the rest of the questions follow once the posts run out.
 * A profile's name links here with `?topic=<profile slug>` to show its posts.
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

/** Posts with a quiz after every `every` posts; leftover quizzes at the end. */
function interleave(posts, quizzes, every) {
  const out = [];
  let q = 0;
  posts.forEach((post, i) => {
    out.push(post);
    if ((i + 1) % every === 0 && q < quizzes.length) out.push(quizzes[q++]);
  });
  return out.concat(quizzes.slice(q));
}

function Feed({ topic }) {
  const [posts, setPosts] = useState(null);
  const [profile, setProfile] = useState(null);
  const [quiz, setQuiz] = useState({ every: 2, total: 0, items: [] });
  const quizLoading = useRef(false);
  const [displayedCount, setDisplayedCount] = useState(INITIAL_BATCH_SIZE);
  const sentinelRef = useRef(null);
  const withQuiz = topic === 'all';

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

  const loadQuizzes = useCallback((offset) => {
    if (quizLoading.current) return;
    quizLoading.current = true;
    fetchSiratQuizFeed(offset, QUIZ_PAGE_SIZE).then(({ every, total, results }) => {
      quizLoading.current = false;
      setQuiz((q) => ({ every, total, items: [...q.items.slice(0, offset), ...results] }));
    });
  }, []);

  useEffect(() => {
    if (withQuiz) loadQuizzes(0);
  }, [withQuiz, loadQuizzes]);

  const items = useMemo(
    () => (posts && withQuiz ? interleave(posts, quiz.items, quiz.every) : posts ?? []),
    [posts, withQuiz, quiz.items, quiz.every]
  );
  const total = posts?.length ?? 0;
  const moreQuizzes = withQuiz && quiz.items.length < quiz.total;
  const hasMore = displayedCount < items.length || moreQuizzes;

  // Fetch the next questions before the reader reaches the place of the first missing one.
  useEffect(() => {
    if (!posts || !moreQuizzes) return;
    const loaded = quiz.items.length;
    const slot = (loaded + 1) * quiz.every <= posts.length ? (loaded + 1) * quiz.every + loaded : posts.length + loaded;
    if (slot <= displayedCount + LOAD_MORE_BATCH_SIZE * 2) loadQuizzes(loaded);
  }, [posts, moreQuizzes, quiz.items.length, quiz.every, displayedCount, loadQuizzes]);

  // Reveal more posts as the reader nears the end of the list.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      // While the next questions are still loading there is nothing more to reveal.
      (entries) =>
        entries[0].isIntersecting && setDisplayedCount((n) => (n < items.length ? n + LOAD_MORE_BATCH_SIZE : n)),
      { rootMargin: '350px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, displayedCount, items.length]);

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
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="এখানে এখনো কোনো পোস্ট নেই"
          hint="শীঘ্রই নতুন লেখা আসছে, ইনশাআল্লাহ।"
        />
      ) : (
        <div className="fb-posts-stream sm:space-y-4">
          {items.slice(0, displayedCount).map((article) => (
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

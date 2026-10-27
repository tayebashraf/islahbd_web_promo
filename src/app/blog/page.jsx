'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/sirat/feed/PostCard';
import {
  fetchSiratArticles,
  fetchSiratManualSettings,
  fetchSiratPlatformSettings,
  fetchSiratTopics,
} from '@/lib/sirat/sirat-api';
import { EmptyState } from '@/components/dashboard/ui';
import BlogNav from '@/components/sirat/layout/BlogNav';
import { BookOpen, Megaphone, X } from 'lucide-react';

const INITIAL_BATCH_SIZE = 4;
const LOAD_MORE_BATCH_SIZE = 3;
// Posts this browser has already shown (ids), newest last.
const SEEN_KEY = 'blog-seen';
const SEEN_LIMIT = 5000;
// When this browser last showed each manual post: {id: time}.
const MANUAL_SHOWN_KEY = 'blog-manual-shown';
// A manual post after every this many other posts, unless the admin set it.
const MANUAL_EVERY = 2;

/**
 * The feed: every profile's posts together (quiz questions come in as posts
 * of their own, a few a day). Posts this reader has not seen yet come first,
 * oldest first, so a new reader starts from the very first post and a
 * returning one carries on where they stopped; the ones already seen follow,
 * newest first. Every post reaches every reader once.
 * The admins' own posts (`source` "manual") are not in that order: one comes
 * after every one or two other posts (set in the admin panel), the one this
 * browser showed longest ago first, round and round, so they never sink.
 * A profile's name links here with `?topic=<profile slug>` to show its posts,
 * newest first.
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

function readSeen() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function markSeen(id) {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
    if (seen.includes(id)) return;
    seen.push(id);
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen.slice(-SEEN_LIMIT)));
  } catch {
    // Private windows may block storage; the feed then stays newest first.
  }
}

/** `posts` come newest first: unseen ones oldest first, then the seen ones. */
function unseenFirst(posts) {
  const seen = readSeen();
  return [...posts.filter((p) => !seen.has(p.id)).reverse(), ...posts.filter((p) => seen.has(p.id))];
}

function readManualShown() {
  try {
    return JSON.parse(localStorage.getItem(MANUAL_SHOWN_KEY) || '{}');
  } catch {
    return {};
  }
}

function markManualShown(id) {
  try {
    const shown = readManualShown();
    shown[id] = Date.now();
    localStorage.setItem(MANUAL_SHOWN_KEY, JSON.stringify(shown));
  } catch {
    // Without storage the rotation starts over on each visit.
  }
}

/**
 * The feed with the manual posts woven in: after every `every` other posts
 * the next manual post, never-shown ones first (newest first), then the one
 * shown longest ago; when they run out they start again. Each item is
 * {key, article}.
 */
function weave(posts, every) {
  const manual = posts.filter((p) => p.source === 'manual');
  const others = unseenFirst(posts.filter((p) => p.source !== 'manual'));
  const shown = readManualShown();
  const cycle = [...manual].sort((a, b) => (shown[a.id] ?? 0) - (shown[b.id] ?? 0));
  const out = [];
  let turn = 0;
  const nextManual = () => {
    const article = cycle[turn % cycle.length];
    out.push({ key: `${article.id}-${turn}`, article });
    turn += 1;
  };
  others.forEach((article, i) => {
    out.push({ key: `${article.id}`, article });
    if (cycle.length && (i + 1) % every === 0) nextManual();
  });
  // Every manual post at least once, even when there are few other posts.
  while (turn < cycle.length) nextManual();
  return out;
}

/** Marks its post seen once the post's top reaches the upper part of the screen. */
function SeenMarker({ id, manual, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (manual) markManualShown(id);
          else markSeen(id);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -40% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, manual]);
  return <div ref={ref}>{children}</div>;
}

function Feed({ topic }) {
  const [posts, setPosts] = useState(null);
  const [profile, setProfile] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(INITIAL_BATCH_SIZE);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let alive = true;
    if (topic === 'all') {
      Promise.all([fetchSiratArticles(), fetchSiratManualSettings()]).then(([list, manual]) => {
        if (!alive) return;
        // Ordered once on arrival, so posts do not jump while being read.
        if (manual.enabled === false) {
          setPosts(unseenFirst(list).map((article) => ({ key: `${article.id}`, article })));
        } else {
          setPosts(weave(list, Math.max(1, Number(manual.every) || MANUAL_EVERY)));
        }
      });
    } else {
      fetchSiratArticles({ topicSlug: topic }).then(
        (list) => alive && setPosts(list.map((article) => ({ key: `${article.id}`, article })))
      );
    }
    if (topic !== 'all') {
      fetchSiratTopics().then((list) => alive && setProfile(list.find((t) => t.slug === topic) ?? null));
    }
    return () => {
      alive = false;
    };
  }, [topic]);

  const items = posts ?? [];
  const total = items.length;
  const hasMore = displayedCount < items.length;

  // Reveal more posts as the reader nears the end of the list.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
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
            <span className="font-semibold text-ink">{profile?.name ?? posts?.[0]?.article.topicName ?? ''}</span>
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
          {items.slice(0, displayedCount).map(({ key, article }) => (
            <SeenMarker key={key} id={article.id} manual={article.source === 'manual'}>
              <PostCard article={article} />
            </SeenMarker>
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

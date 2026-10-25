'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/sirat/feed/PostCard';
import { sampleTopics, sampleArticles } from '@/lib/sirat/sampleData';
import { Layers, ArrowLeft, BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/ui';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const topic = sampleTopics.find((t) => t.slug === slug);
  const topicArticles = sampleArticles.filter((a) => a.topic === slug || (topic && a.topicName === topic.name));

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      {/* Back Link */}
      <div className="mb-3">
        <Link
          href="/blog/topics"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-panel text-ink hover:border-brand/40 text-xs sm:text-sm font-semibold transition active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>সকল সিরাত পর্ব ও বিষয়সমূহ</span>
        </Link>
      </div>

      {topic ? (
        <>
          {/* Topic Header Card */}
          <div className="fb-card p-5 sm:p-6 mb-4">
            <div className="flex items-center gap-3.5 mb-2.5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 text-white shadow-sm"
                style={{
                  background: topic.gradient || 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
                }}
              >
                {topic.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground block mb-0.5">
                  {topic.categoryName || 'সিরাত গবেষণা পর্ব'}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-brand m-0">
                  {topic.name}
                </h1>
              </div>
            </div>

            <p className="text-sm text-ink-2 leading-relaxed mb-3">
              {topic.description} — এই পর্বের অধীনে সংকলিত তাহকিককৃত গবেষণামূলক প্রবন্ধসমূহ নিচে উপস্থাপন করা হলো।
            </p>

            {/* Subtopic Tags */}
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {topic.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-brand bg-brand-soft border border-line px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-line pt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen size={13} className="text-brand" />
              <span>
                সর্বমোট <strong className="text-ink">{toBanglaNum(topicArticles.length || topic.articleCount)}</strong> টি গবেষণামূলক প্রবন্ধ
              </span>
            </div>
          </div>

          {/* Articles Stream */}
          <div className="fb-posts-stream space-y-4">
            {topicArticles.map((article) => (
              <PostCard key={article.id} article={article} />
            ))}

            {topicArticles.length === 0 && (
              <EmptyState
                icon={BookOpen}
                title="এই পর্বে কোনো প্রবন্ধ পাওয়া যায়নি"
                hint="শীঘ্রই এই বিষয়ে নতুন গবেষণামূলক প্রবন্ধ যুক্ত করা হবে।"
              />
            )}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Layers}
          title="বিষয়টি পাওয়া যায়নি"
          hint="আপনি যে বিষয়টি খুঁজছেন তা তালিকায় নেই।"
          action={
            <Link
              href="/blog/topics"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-strong transition"
            >
              সকল বিষয় দেখুন
            </Link>
          }
        />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AuthorProfile from '@/components/sirat/author/AuthorProfile';
import PostCard from '@/components/sirat/feed/PostCard';
import Button from '@/components/sirat/ui/Button';
import { getAuthorById, sampleArticles } from '@/lib/sirat/sampleData';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/ui';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function AuthorDetailPage() {
  const params = useParams();
  const author = getAuthorById(params.id);
  const authorArticles = sampleArticles.filter((a) => a.authorId === params.id);

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      {/* Back Link */}
      <div className="mb-3">
        <Link
          href="/blog/authors"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-panel text-ink hover:border-brand/40 text-xs sm:text-sm font-semibold transition active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>সকল গবেষক ও লেখক তালিকা</span>
        </Link>
      </div>

      {author ? (
        <>
          {/* Author Profile Card */}
          <AuthorProfile author={author} articleCount={authorArticles.length} />

          {/* Published Articles Header */}
          <div className="flex items-center gap-2 px-3 py-2 my-4 rounded-xl border border-line bg-panel text-sm font-semibold text-ink">
            <BookOpen size={16} className="text-brand" />
            <span>প্রকাশিত প্রবন্ধসমূহ ({toBanglaNum(authorArticles.length)})</span>
          </div>

          {/* Author's Stream of Articles */}
          <div className="fb-posts-stream space-y-4">
            {authorArticles.map((article) => (
              <PostCard key={article.id} article={article} />
            ))}

            {authorArticles.length === 0 && (
              <EmptyState
                icon={BookOpen}
                title="কোনো প্রকাশিত প্রবন্ধ নেই"
                hint="এই লেখকের এখনও কোনো নতুন প্রকাশিত প্রবন্ধ নেই।"
              />
            )}
          </div>
        </>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="লেখকের তথ্য পাওয়া যায়নি"
          hint="আপনি যে লেখকের প্রোফাইল খুঁজছেন তা হয়তো সরানো হয়েছে।"
          action={
            <Button variant="primary" href="/blog/authors">
              সকল লেখক দেখুন
            </Button>
          }
        />
      )}
    </div>
  );
}

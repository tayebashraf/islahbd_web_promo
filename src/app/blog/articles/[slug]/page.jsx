'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { sampleArticles } from '@/lib/sirat/sampleData';
import { fetchSiratArticleBySlug, fetchSiratArticles } from '@/lib/sirat/sirat-api';
import ReadingProgressBar from '@/components/sirat/ui/ReadingProgressBar';
import ArticleHeader from '@/components/sirat/article/ArticleHeader';
import ArticleBody from '@/components/sirat/article/ArticleBody';
import ArticleActions from '@/components/sirat/article/ArticleActions';
import ArticleReferences from '@/components/sirat/article/ArticleReferences';
import CommentSection from '@/components/sirat/article/CommentSection';
import PostCard from '@/components/sirat/feed/PostCard';
import Button from '@/components/sirat/ui/Button';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug;

  const [article, setArticle] = useState(() => {
    return sampleArticles.find((a) => a.slug === slug) || null;
  });
  const [related, setRelated] = useState([]);
  const [fontSize, setFontSize] = useState('normal');

  // Posts written from the admin apps live in the API; samples are the offline fallback.
  useEffect(() => {
    let alive = true;
    fetchSiratArticleBySlug(slug).then((found) => {
      if (!alive || !found) return;
      setArticle(found);
      fetchSiratArticles({ topicSlug: found.topicSlug }).then(
        (list) => alive && setRelated(list.filter((a) => a.slug !== found.slug).slice(0, 2))
      );
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (!article) {
    return (
      <div className="w-full max-w-[760px] mx-auto text-center py-16 px-4 font-kalpurush">
        <div className="fb-card p-8">
          <h1 className="font-kalpurush text-2xl font-bold mb-3 text-ink">
            প্রবন্ধটি পাওয়া যায়নি
          </h1>
          <p className="text-muted-foreground mb-6">
            আপনি যে লেখাটি খুঁজছেন সেটি সরানো হয়েছে অথবা লিংকটি সঠিক নয়।
          </p>
          <Button variant="primary" href="/blog">
            ব্লগ হোমে ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  const relatedArticles = related;

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      <ReadingProgressBar />

      {/* Main Reading Card */}
      <div className="fb-card p-4 sm:p-7">
        {/* Header */}
        <ArticleHeader article={article} />

        {/* Body */}
        <ArticleBody content={article.content} fontSize={fontSize} />

        {/* References */}
        <ArticleReferences references={article.references} />

        {/* Actions Bar */}
        <ArticleActions
          articleId={article.id}
          initialJazakallah={article.jazakallahCount || 24}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          commentCount={article.commentCount ?? 0}
        />

        {/* In-feed Comments Section */}
        <CommentSection articleId={article.id} />
      </div>

      {/* Related Posts */}
      {relatedArticles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-kalpurush text-base font-bold text-muted-foreground mb-3 px-2">
            সম্পর্কিত আরও পোস্ট
          </h3>
          <div className="space-y-4">
            {relatedArticles.map((rel) => (
              <PostCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

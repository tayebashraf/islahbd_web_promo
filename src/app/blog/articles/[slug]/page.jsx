'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { sampleArticles, getAuthorById } from '@/lib/sirat/sampleData';
import { getArticleBySlug } from '@/lib/sirat/firestore';
import ReadingProgressBar from '@/components/sirat/ui/ReadingProgressBar';
import ArticleHeader from '@/components/sirat/article/ArticleHeader';
import ArticleBody from '@/components/sirat/article/ArticleBody';
import ArticleActions from '@/components/sirat/article/ArticleActions';
import ArticleReferences from '@/components/sirat/article/ArticleReferences';
import CommentSection from '@/components/sirat/article/CommentSection';
import AuthorCard from '@/components/sirat/author/AuthorCard';
import PostCard from '@/components/sirat/feed/PostCard';
import Button from '@/components/sirat/ui/Button';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug;

  const [article, setArticle] = useState(() => {
    return sampleArticles.find((a) => a.slug === slug) || null;
  });
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    async function loadArticle() {
      const found = await getArticleBySlug(slug);
      if (found) {
        setArticle(found);
      }
    }
    loadArticle();
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

  const author = getAuthorById(article.authorId);
  const relatedArticles = sampleArticles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.topicSlug === article.topicSlug || a.authorId === article.authorId)
    )
    .slice(0, 2);

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      <ReadingProgressBar />

      {/* Main Reading Card */}
      <div className="fb-card p-4 sm:p-7">
        {/* Header */}
        <ArticleHeader article={article} author={author} />

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
          commentCount={2}
        />

        {/* Author Card Footer */}
        {author && (
          <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border-secondary)' }}>
            <AuthorCard author={author} />
          </div>
        )}

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

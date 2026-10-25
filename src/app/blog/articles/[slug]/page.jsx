'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { sampleArticles, getAuthorById } from '@/lib/sirat/sampleData';
import { getArticleBySlug } from '@/lib/sirat/firestore';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
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
      <div className="fb-layout">
        <LeftSidebar />
        <main className="fb-feed-container" style={{ textAlign: 'center', paddingTop: 'var(--space-16)' }}>
          <div className="fb-card" style={{ padding: 'var(--space-8)' }}>
            <h1
              style={{
                fontFamily: 'var(--font-bengali-body)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--weight-bold)',
                marginBottom: 'var(--space-3)',
              }}
            >
              প্রবন্ধটি পাওয়া যায়নি
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
              আপনি যে লেখাটি খুঁজছেন সেটি সরানো হয়েছে অথবা লিংকটি সঠিক নয়।
            </p>
            <Button variant="primary" href="/blog">
              হোম ফিডে ফিরে যান
            </Button>
          </div>
        </main>
        <RightSidebar />
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
    <div className="fb-layout fade-in">
      <ReadingProgressBar />
      {/* 1. Left Sidebar */}
      <LeftSidebar />

      {/* 2. Center Reading Feed Card */}
      <main className="fb-feed-container" aria-label="প্রবন্ধ পাঠ">
        <div className="fb-card" style={{ padding: 'var(--space-6)' }}>
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

        {/* Related Posts in Feed */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <h3
              style={{
                fontFamily: 'var(--font-bengali-ui)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-3)',
                paddingLeft: 'var(--space-2)',
              }}
            >
              সম্পর্কিত আরও পোস্ট
            </h3>
            {relatedArticles.map((rel) => (
              <PostCard key={rel.id} article={rel} />
            ))}
          </div>
        )}
      </main>

      {/* 3. Right Sidebar */}
      <RightSidebar />
    </div>
  );
}

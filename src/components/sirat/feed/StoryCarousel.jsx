'use client';

import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/sirat/ui/Avatar';
import { sampleArticles, getAuthorById } from '@/lib/sirat/sampleData';
import { Plus } from 'lucide-react';
import './storycarousel.css';

const storyGradients = [
  'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
  'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
  'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
  'linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)',
  'linear-gradient(135deg, #1D2B64 0%, #F8CDDA 100%)',
];

export const StoryCarousel = () => {
  const featuredArticles = sampleArticles.slice(0, 4);

  return (
    <div className="fb-story-carousel" aria-label="সিরাত হাইলাইটস ও স্টোরি">
      {/* Create Story Card */}
      <Link href="/dashboard/new" className="fb-story-card fb-create-story-card">
        <div className="fb-create-story__img-wrap">
          <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>📖</span>
          </div>
        </div>
        <div className="fb-create-story__btn">
          <Plus size={20} strokeWidth={3} />
        </div>
        <span className="fb-create-story__label">প্রবন্ধ তৈরি</span>
      </Link>

      {/* Story Cards */}
      {featuredArticles.map((article, idx) => {
        const author = getAuthorById(article.authorId);
        return (
          <Link
            key={article.id}
            href={`/blog/articles/${article.slug}`}
            className="fb-story-card"
          >
            <div
              className="fb-story-card__bg"
              style={{
                background: storyGradients[idx % storyGradients.length],
              }}
            />
            <div className="fb-story-card__overlay" />

            <div className="fb-story-card__avatar">
              <Avatar
                src={author?.photoURL}
                name={article.authorName}
                size="sm"
              />
            </div>

            <span className="fb-story-card__title">{article.title}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default StoryCarousel;

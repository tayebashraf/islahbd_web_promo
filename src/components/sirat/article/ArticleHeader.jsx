import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/sirat/ui/Avatar';
import VerifiedBadge from '@/components/sirat/author/VerifiedBadge';
import { Volume2 } from 'lucide-react';
import './articleheader.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export const ArticleHeader = ({ article, onListenClick }) => {
  if (!article) return null;

  // Posts are published under a topic profile ("সিরাত চর্চা", ...), not a person.
  const topic = article.topicDetails;
  const profileName = topic?.name || article.topicName || article.authorName;
  const profileHref = `/blog?topic=${article.topicSlug}`;

  return (
    <header className="article-header">
      <div className="article-header__meta-top">
        <span className="article-header__breadcrumb-text">
          <Link href="/blog">ব্লগ</Link> › <Link href={profileHref}>{profileName}</Link>
        </span>
      </div>

      {/* Title: Harmonious 1-2 Sizes Larger than Body, Serif Font */}
      <h1 className="article-header__title">{article.title}</h1>

      {/* Subtitle / Excerpt */}
      {article.subtitle && (
        <p className="article-header__subtitle">{article.subtitle}</p>
      )}

      {/* Author Row Directly Below Title (Zero Space Wastage) */}
      <div className="article-header__author-row">
        <div className="article-header__author-meta">
          <Avatar src={topic?.avatar} name={profileName} size="sm" />
          <div className="article-header__author-info">
            <div className="article-header__author-name-row">
              <Link href={profileHref} className="article-header__author-name">
                {profileName}
              </Link>
              {topic?.isVerified !== false && <VerifiedBadge isVerified size={15} showLabel={false} />}
            </div>
            <div className="article-header__date-row">
              <span>{formatTimestamp(article.publishedAt)}</span>
              <span>•</span>
              <span>{toBanglaNum(article.readingTime || 5)} মিনিট পাঠ</span>
            </div>
          </div>
        </div>

        {onListenClick && (
          <button
            type="button"
            className="article-listen-btn"
            onClick={onListenClick}
            aria-label="সিরাত প্রবন্ধ শুনুন"
          >
            <Volume2 size={15} />
            <span>শুনুন</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default ArticleHeader;

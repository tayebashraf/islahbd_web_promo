import Link from 'next/link';
import './articlecard.css';

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function ArticleCard({ article, variant = 'default' }) {
  const {
    slug,
    title,
    excerpt,
    authorName,
    topicName,
    readingTime,
    publishedAt,
    coverImageURL,
  } = article;

  const cardClass = `article-card ${variant === 'featured' ? 'article-card--featured' : ''} ${variant === 'horizontal' ? 'article-card--horizontal' : ''} ${variant === 'compact' ? 'article-card--compact' : ''}`;

  const inner = (
    <>
      {variant === 'horizontal' && coverImageURL && (
        <img
          src={coverImageURL}
          alt=""
          className="article-card__image"
          loading="lazy"
        />
      )}
      <div className={variant === 'horizontal' ? 'article-card__content' : undefined}>
        {topicName && (
          <span className="article-card__category">{topicName}</span>
        )}
        <h3 className="article-card__title">{title}</h3>
        {excerpt && variant !== 'compact' && (
          <p className="article-card__excerpt">{excerpt}</p>
        )}
        <div className="article-card__meta">
          {authorName && (
            <span className="article-card__author">{authorName}</span>
          )}
          {publishedAt && (
            <>
              <span className="article-card__dot" aria-hidden="true" />
              <span className="article-card__date">{formatTimestamp(publishedAt)}</span>
            </>
          )}
          {readingTime && (
            <>
              <span className="article-card__dot" aria-hidden="true" />
              <span className="article-card__reading-time">
                {toBanglaNum(readingTime)} মিনিট পড়া
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Link href={`/blog/articles/${slug}`} className={cardClass}>
      {inner}
    </Link>
  );
}

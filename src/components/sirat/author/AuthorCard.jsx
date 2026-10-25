'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/sirat/ui/Avatar';
import VerifiedBadge from './VerifiedBadge';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { BookOpen, UserPlus, Check, Sparkles } from 'lucide-react';
import './authorcard.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export const AuthorCard = ({ author, className = '' }) => {
  const [following, setFollowing] = useState(false);
  const { success } = useToast();

  if (!author) return null;

  const handleFollowToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!following) {
      setFollowing(true);
      success(`${author.displayName}-কে অনুসরণ করা হচ্ছে`);
    } else {
      setFollowing(false);
    }
  };

  const expertiseList = author.expertise ? author.expertise.split(',').map((s) => s.trim()) : [];

  return (
    <div className={`author-card ${className}`}>
      {/* Top Banner Ribbon */}
      <div className="author-card__banner">
        <div className="author-card__banner-pattern" />
      </div>

      <div className="author-card__body">
        <div className="author-card__avatar-row">
          <Avatar
            src={author.photoURL}
            name={author.displayName}
            size="lg"
            className="author-card__avatar"
          />
          <button
            type="button"
            className={`author-card__follow-btn ${following ? 'author-card__follow-btn--active' : ''}`}
            onClick={handleFollowToggle}
          >
            {following ? (
              <>
                <Check size={13} />
                <span>অনুসরণ করছেন</span>
              </>
            ) : (
              <>
                <UserPlus size={13} />
                <span>অনুসরণ করুন</span>
              </>
            )}
          </button>
        </div>

        <div className="author-card__content">
          <div className="author-card__name-row">
            <Link href={`/blog/authors/${author.id}`} className="author-card__name">
              {author.displayName}
            </Link>
            <VerifiedBadge status={author.writerStatus} isVerified={author.isVerified} size={15} showLabel={false} />
          </div>

          {author.bio && <p className="author-card__bio">{author.bio}</p>}

          {/* Expertise Chips */}
          {expertiseList.length > 0 && (
            <div className="author-card__expertise-pills">
              {expertiseList.map((tag, idx) => (
                <span key={idx} className="author-card__expertise-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer: Article Count & Profile Link */}
          <div className="author-card__footer">
            <div className="author-card__stats">
              <BookOpen size={14} color="#64748B" />
              <span>
                <strong>{toBanglaNum(author.articleCount || 12)}</strong> টি সিরাত প্রবন্ধ
              </span>
            </div>

            <Link href={`/blog/authors/${author.id}`} className="author-card__view-link">
              <span>প্রোফাইল ও সকল লেখা</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;

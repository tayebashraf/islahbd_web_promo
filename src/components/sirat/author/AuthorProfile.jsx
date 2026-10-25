'use client';

import React, { useState } from 'react';
import Avatar from '@/components/sirat/ui/Avatar';
import VerifiedBadge from './VerifiedBadge';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { BookOpen, Heart, Award, UserPlus, Check, Share2, ShieldCheck, MapPin } from 'lucide-react';
import './authorprofile.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export const AuthorProfile = ({ author, articleCount = 0 }) => {
  const [following, setFollowing] = useState(false);
  const { success } = useToast();

  if (!author) return null;

  const handleFollowToggle = () => {
    if (!following) {
      setFollowing(true);
      success(`${author.displayName}-কে অনুসরণ করা হচ্ছে`);
    } else {
      setFollowing(false);
    }
  };

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      success('লেখকের প্রোফাইল লিংক কপি করা হয়েছে');
    }
  };

  return (
    <div className="fb-author-profile-card">
      {/* 1. Facebook-Style Profile Cover Banner */}
      <div className="fb-author-cover">
        <div className="fb-author-cover__pattern" />
        <div className="fb-author-cover__badge">
          <ShieldCheck size={14} />
          <span>ভেরিফাইড সিরাত গবেষক</span>
        </div>
      </div>

      {/* 2. Overlapping Profile Head */}
      <div className="fb-author-head">
        <div className="fb-author-head__avatar-wrap">
          <Avatar
            src={author.photoURL}
            name={author.displayName}
            size="xl"
            className="fb-author-head__avatar"
          />
        </div>

        <div className="fb-author-head__actions">
          <button
            type="button"
            className={`fb-author-btn fb-author-btn--follow ${following ? 'fb-author-btn--following' : ''}`}
            onClick={handleFollowToggle}
          >
            {following ? (
              <>
                <Check size={15} />
                <span>অনুসরণ করছেন</span>
              </>
            ) : (
              <>
                <UserPlus size={15} />
                <span>+ অনুসরণ করুন</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="fb-author-btn fb-author-btn--share"
            onClick={handleShareProfile}
            title="প্রোফাইল শেয়ার করুন"
          >
            <Share2 size={15} />
            <span>শেয়ার</span>
          </button>
        </div>
      </div>

      {/* 3. Scholar Name, Title & Bio */}
      <div className="fb-author-info">
        <div className="fb-author-name-row">
          <h1 className="fb-author-name">{author.displayName}</h1>
          <VerifiedBadge status={author.writerStatus} isVerified={author.isVerified} size={18} showLabel={true} />
        </div>

        {author.expertise && (
          <p className="fb-author-expertise">
            <span>গবেষণার ক্ষেত্র:</span> {author.expertise}
          </p>
        )}

        {author.bio && <p className="fb-author-bio">{author.bio}</p>}

        {/* 4. Scholar Stats Bar */}
        <div className="fb-author-stats-bar">
          <div className="fb-author-stat-item">
            <BookOpen size={16} color="#1877F2" />
            <div>
              <strong>{toBanglaNum(articleCount || author.articleCount || 12)}</strong>
              <span>টি সিরাত প্রবন্ধ</span>
            </div>
          </div>

          <div className="fb-author-stat-divider" />

          <div className="fb-author-stat-item">
            <Heart size={16} color="#E11D48" />
            <div>
              <strong>{toBanglaNum(author.jazaakAllahCount || 145)}</strong>
              <span>জাযাকাল্লাহ প্রাপ্ত</span>
            </div>
          </div>

          <div className="fb-author-stat-divider" />

          <div className="fb-author-stat-item">
            <Award size={16} color="#D97706" />
            <div>
              <strong>১০০%</strong>
              <span>তাহকিককৃত সূত্র</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;

'use client';

import React, { useState } from 'react';
import { Bookmark, Share2, MessageCircle } from 'lucide-react';
import Modal from '@/components/sirat/ui/Modal';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { ReactionButton, useReaction } from '@/components/sirat/ui/Reactions';
import './articleactions.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export const ArticleActions = ({
  article,
  fontSize,
  onFontSizeChange,
  commentCount = 0,
}) => {
  const reaction = useReaction(article);
  const articleId = article.id;
  const [saved, setSaved] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { success } = useToast();

  const handleBookmarkToggle = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('sirat_bookmarks') || '[]');
      let updated;
      if (saved) {
        updated = bookmarks.filter((id) => id !== articleId);
        setSaved(false);
        success('সংরক্ষণ থেকে সরানো হয়েছে');
      } else {
        updated = [...bookmarks, articleId];
        setSaved(true);
        success('প্রবন্ধটি সংরক্ষণ করা হয়েছে');
      }
      localStorage.setItem('sirat_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      success('লিংক কপি করা হয়েছে!');
      setShareModalOpen(false);
    }
  };

  return (
    <>
      <div className="article-actions-bar">
        {/* Left: Arabic Reaction + Comments/Durood Jump */}
        <div className="article-actions-bar__left">
          <ReactionButton reaction={reaction} className="article-reaction" />

          {/* Comments & Durood Jump */}
          <a
            href="#comments"
            className="action-btn"
            aria-label="মন্তব্য ও দরূদ বিভাগে যান"
          >
            <MessageCircle size={15} />
            <span>মন্তব্য ও দরূদ ({commentCount > 0 ? toBanglaNum(commentCount) : '২'})</span>
          </a>
        </div>

        {/* Right: Bookmark, Share, Font Scaler */}
        <div className="article-actions-bar__right">
          {/* Bookmark */}
          <button
            type="button"
            className={`action-btn ${saved ? 'action-btn--active' : ''}`}
            onClick={handleBookmarkToggle}
            aria-pressed={saved}
            aria-label={saved ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'}
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
            <span>{saved ? 'সংরক্ষিত' : 'সংরক্ষণ'}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            className="action-btn"
            onClick={() => setShareModalOpen(true)}
            aria-label="শেয়ার করুন"
          >
            <Share2 size={15} />
            <span>শেয়ার</span>
          </button>

          {/* Font Scaler */}
          {onFontSizeChange && (
            <div className="font-scaler" title="ফন্ট সাইজ পরিবর্তন">
              <button
                type="button"
                className="font-scaler__btn"
                onClick={() => onFontSizeChange('small')}
                aria-label="ছোট ফন্ট"
              >
                A-
              </button>
              <button
                type="button"
                className="font-scaler__btn"
                onClick={() => onFontSizeChange('normal')}
                aria-label="সাধারণ ফন্ট"
              >
                A
              </button>
              <button
                type="button"
                className="font-scaler__btn"
                onClick={() => onFontSizeChange('large')}
                aria-label="বড় ফন্ট"
              >
                A+
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="প্রবন্ধটি শেয়ার করুন"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            রাসূলুল্লাহ ﷺ-এর সিরাত ও জ্ঞানভিত্তিক এই লেখাটি অন্যদের সাথে শেয়ার করে সাদাকাহ জারিয়াহর অংশীদার হোন।
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              style={{
                flex: 1,
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)',
                backgroundColor: 'var(--color-bg-secondary)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}
            />
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#FFFFFF',
                fontWeight: 'var(--weight-semibold)',
                fontFamily: 'var(--font-bengali-ui)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              লিংক কপি
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ArticleActions;

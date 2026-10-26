'use client';

import React, { useState, useRef } from 'react';
import { Bookmark, Share2, MessageCircle } from 'lucide-react';
import Modal from '@/components/sirat/ui/Modal';
import { useToast } from '@/components/sirat/ui/ToastContext';
import {
  ARABIC_CALLIGRAPHY_LIST,
  ARABIC_CALLIGRAPHY_MAP,
  CalligraphyJazakallahIcon,
} from '@/components/sirat/ui/ArabicCalligraphyIcons';
import './articleactions.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export const ArticleActions = ({
  articleId,
  initialJazakallah = 0,
  fontSize,
  onFontSizeChange,
  commentCount = 0,
}) => {
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionPopupOpen, setReactionPopupOpen] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(initialJazakallah || 24);
  const [saved, setSaved] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { success } = useToast();
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnterContainer = () => {
    clearTimeout(hoverTimeoutRef.current);
    setReactionPopupOpen(true);
  };

  const handleMouseLeaveContainer = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setReactionPopupOpen(false);
    }, 250);
  };

  const handleDefaultReactionToggle = (e) => {
    e.stopPropagation();
    if (currentReaction) {
      setCurrentReaction(null);
      setReactionsCount((c) => Math.max(0, c - 1));
    } else {
      const defaultReact = ARABIC_CALLIGRAPHY_MAP.jazakallah;
      setCurrentReaction(defaultReact);
      setReactionsCount((c) => c + 1);
      success(`${defaultReact.arabic} — জানানো হয়েছে`);
    }
  };

  const handleSelectReaction = (e, reactObj) => {
    e.stopPropagation();
    if (!currentReaction) {
      setReactionsCount((c) => c + 1);
    }
    setCurrentReaction(reactObj);
    setReactionPopupOpen(false);
    success(`${reactObj.arabic} (${reactObj.bangla})`);
  };

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
          {/* Reaction Container with Popup */}
          <div
            className="fb-arabic-reaction-container"
            onMouseEnter={handleMouseEnterContainer}
            onMouseLeave={handleMouseLeaveContainer}
            style={{ position: 'relative' }}
          >
            {reactionPopupOpen && (
              <div className="fb-arabic-reaction-popup" role="tooltip" onMouseEnter={handleMouseEnterContainer}>
                {ARABIC_CALLIGRAPHY_LIST.map((react) => {
                  const IconComp = react.Icon;
                  return (
                    <button
                      key={react.id}
                      type="button"
                      className="fb-calligraphy-popup-item"
                      onClick={(e) => handleSelectReaction(e, react)}
                      aria-label={react.arabic}
                    >
                      <IconComp size={44} />
                      <span className="fb-calligraphy-tooltip">{react.arabic}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              className={`action-btn ${
                currentReaction ? 'action-btn--active' : 'action-btn--primary'
              }`}
              onClick={handleDefaultReactionToggle}
              aria-label="جَزَاكَ ٱللَّٰهُ প্রতিক্রিয়া দিন"
              style={{ color: currentReaction ? currentReaction.color : 'inherit' }}
            >
              {currentReaction ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <currentReaction.Icon size={18} />
                  <span style={{ fontFamily: 'var(--font-arabic-calligraphy), var(--sirat-font-arabic), serif', fontSize: '1rem', fontWeight: 'bold' }}>
                    {currentReaction.arabic}
                  </span>
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CalligraphyJazakallahIcon size={18} />
                  <span style={{ fontFamily: 'var(--font-arabic-calligraphy), var(--sirat-font-arabic), serif', fontSize: '1rem', fontWeight: 'bold' }}>
                    جَزَاكَ ٱللَّٰهُ
                  </span>
                </span>
              )}
              <span className="action-btn__count">
                {toBanglaNum(reactionsCount)}
              </span>
            </button>
          </div>

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

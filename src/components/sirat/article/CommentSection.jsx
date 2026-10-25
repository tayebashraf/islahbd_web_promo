'use client';

import React, { useState } from 'react';
import Avatar from '@/components/sirat/ui/Avatar';
import VerifiedBadge from '@/components/sirat/author/VerifiedBadge';
import { Sparkles, Send } from 'lucide-react';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { DUROOD_SUGGESTIONS } from '@/components/sirat/feed/PostCard';
import { getAdabTerminology } from '@/lib/sirat/adabUtils';
import './commentsection.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

const initialComments = [
  {
    id: 'c1',
    authorName: 'মুহাম্মাদ খালিদ',
    authorAvatar: '',
    isVerified: true,
    time: '২ ঘন্টা আগে',
    text: 'মাশাআল্লাহ, অত্যন্ত চমৎকার ও প্রামাণ্য আলোচনা। বিশেষ করে তায়েফের ঘটনার শিক্ষাগুলো আমাদের জীবনের জন্য দিকনির্দেশনা স্বরূপ।',
    jazakallahCount: 14,
    isDurood: false,
  },
  {
    id: 'c2',
    authorName: 'তাহমিদ হাসান',
    authorAvatar: '',
    isVerified: false,
    time: '৫ ঘন্টা আগে',
    text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    jazakallahCount: 8,
    isDurood: true,
  },
];

export const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const { success, error } = useToast();

  const handleQuickDurood = (item) => {
    const newComment = {
      id: 'c_' + Date.now(),
      authorName: commentName.trim() || 'মুফতী আব্দুল্লাহ',
      authorAvatar: '',
      isVerified: false,
      time: 'এইমাত্র',
      text: item.arabic,
      jazakallahCount: 0,
      isDurood: true,
    };
    setComments([newComment, ...comments]);
    success(`صلى الله عليه وسلم — "${item.arabic}" দরূদ শরীফ পেশ করা হয়েছে!`);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      error('দয়া করে মন্তব্য বা দরূদ লিখুন');
      return;
    }

    const isArabicDurood =
      commentText.includes('صَلَّى') ||
      commentText.includes('صَلِّ') ||
      commentText.includes('ﷺ');

    const newComment = {
      id: 'c_' + Date.now(),
      authorName: commentName.trim() || 'মুফতী আব্দুল্লাহ',
      authorAvatar: '',
      isVerified: false,
      time: 'এইমাত্র',
      text: commentText.trim(),
      jazakallahCount: 0,
      isDurood: isArabicDurood,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentName('');
    success('আপনার মন্তব্য প্রকাশিত হয়েছে। জাযাকাল্লাহ!');
  };

  return (
    <section id="comments" className="comment-section" aria-label="মন্তব্য ও আরজ">
      <h3 className="comment-section__title">
        মন্তব্য ({toBanglaNum(comments.length)})
      </h3>

      {/* Sleek Horizontal Scrollable Durood Ribbon */}
      <div className="fb-durood-ribbon" style={{ marginBottom: '12px' }}>
        <div className="fb-durood-ribbon__chips">
          {DUROOD_SUGGESTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="fb-durood-ribbon-pill"
              onClick={() => handleQuickDurood(item)}
              title={item.label}
            >
              <span className="fb-durood-ribbon-pill__ar">{item.arabic}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Facebook-Style Comment Form */}
      <form className="fb-comment-input-row" onSubmit={handleAddComment}>
        <Avatar name="মুফতী আব্দুল্লাহ" size="sm" />
        <div className="fb-comment-input-wrap">
          <input
            type="text"
            placeholder="দরূদ শরীফ অথবা আপনার মূল্যবান মন্তব্য লিখুন..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="fb-comment-send-btn"
            aria-label="মন্তব্য পাঠান"
            disabled={!commentText.trim()}
          >
            <Send size={15} />
          </button>
        </div>
      </form>

      {/* Comments Bubble Stream */}
      <div className="fb-comment-bubble-list" style={{ marginTop: '16px' }}>
        {comments.map((comment) => {
          const cAdab = getAdabTerminology({
            currentUser: { name: 'মুফতী আব্দুল্লাহ', seniorityRank: 2 },
            targetPerson: { name: comment.authorName, seniorityRank: comment.seniorityRank || 1 },
            isReplying: true,
          });

          return (
            <div key={comment.id} className="fb-comment-bubble-row">
              <Avatar name={comment.authorName} size="sm" />
              <div className="fb-comment-bubble-content">
                <div
                  className={`fb-comment-bubble ${
                    comment.isDurood ? 'fb-comment-bubble--durood' : ''
                  }`}
                >
                  <div className="fb-comment-bubble__head">
                    <span className="fb-comment-bubble__author-name">
                      {comment.authorName}
                    </span>
                    {comment.isVerified && <VerifiedBadge size={10} showLabel={false} />}
                  </div>

                  {comment.isDurood ? (
                    <p className="fb-comment-bubble__arabic-durood">{comment.text}</p>
                  ) : (
                    <p className="fb-comment-bubble__text">{comment.text}</p>
                  )}
                </div>

                {/* Clean Action Row (জাযাকাল্লাহ • আরজ/প্রস্তাবনা/উত্তর • সময়) */}
                <div className="fb-comment-action-row">
                  <button
                    type="button"
                    className="fb-comment-action-btn fb-comment-action-btn--jazakallah"
                    onClick={() => {
                      setComments((prev) =>
                        prev.map((item) =>
                          item.id === comment.id
                            ? { ...item, jazakallahCount: (item.jazakallahCount || 0) + 1 }
                            : item
                        )
                      );
                      success('মন্তব্যে জাযাকাল্লাহ জানানো হয়েছে');
                    }}
                  >
                    <span>জাযাকাল্লাহ</span>
                    {comment.jazakallahCount > 0 && (
                      <span className="fb-comment-action-count">
                        {toBanglaNum(comment.jazakallahCount)}
                      </span>
                    )}
                  </button>
                  <span className="fb-comment-dot">•</span>
                  <button
                    type="button"
                    className="fb-comment-action-btn"
                    onClick={() => setCommentText(`@${comment.authorName} `)}
                  >
                    {cAdab.replyBtnLabel}
                  </button>
                  <span className="fb-comment-dot">•</span>
                  <span className="fb-comment-time">{comment.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CommentSection;

'use client';

import React, { useEffect, useState } from 'react';
import Avatar from '@/components/sirat/ui/Avatar';
import { Send } from 'lucide-react';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { DUROOD_SUGGESTIONS } from '@/components/sirat/feed/PostCard';
import { getAdabTerminology } from '@/lib/sirat/adabUtils';
import { fetchSiratComments, postSiratComment } from '@/lib/sirat/sirat-api';
import './commentsection.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

const COMMENTER_KEY = 'sirat_commenter_name';
const isDuroodText = (t) => t.includes('صَلَّى') || t.includes('صَلِّ') || t.includes('ﷺ');

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (!iso || Number.isNaN(mins) || mins < 1) return 'এইমাত্র';
  if (mins < 60) return `${toBanglaNum(mins)} মিনিট আগে`;
  if (mins < 1440) return `${toBanglaNum(Math.floor(mins / 60))} ঘণ্টা আগে`;
  return `${toBanglaNum(Math.floor(mins / 1440))} দিন আগে`;
}

const toComment = (c) => ({
  id: c.id,
  authorName: c.authorName,
  time: timeAgo(c.createdAt),
  text: c.text,
  isDurood: isDuroodText(c.text || ''),
  replies: (c.replies || []).map(toComment),
});

/** Readers' comments on a post, saved on the server (none are invented). */
export const CommentSection = ({ slug }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const { success, error } = useToast();

  useEffect(() => {
    let alive = true;
    if (slug) fetchSiratComments(slug).then((list) => alive && setComments(list.map(toComment)));
    try {
      const saved = localStorage.getItem(COMMENTER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the saved name after hydration
      if (saved) setCommentName(saved);
    } catch {}
    return () => {
      alive = false;
    };
  }, [slug]);

  const send = async (text) => {
    const name = commentName.trim();
    if (!name) {
      error('মন্তব্য করার আগে আপনার নাম লিখুন');
      return false;
    }
    try {
      localStorage.setItem(COMMENTER_KEY, name);
    } catch {}
    const saved = await postSiratComment(slug, { authorName: name, text, ...(replyTo ? { parent: replyTo.id } : {}) });
    if (!saved?.id) {
      error('মন্তব্য পাঠানো যায়নি, আবার চেষ্টা করুন');
      return false;
    }
    if (saved.status && saved.status !== 'approved') {
      success('ধন্যবাদ! অনুমোদনের পর মন্তব্যটি দেখা যাবে');
    } else {
      const entry = toComment(saved);
      setComments((prev) =>
        replyTo ? prev.map((c) => (c.id === replyTo.id ? { ...c, replies: [...c.replies, entry] } : c)) : [entry, ...prev]
      );
      success('আপনার মন্তব্য প্রকাশিত হয়েছে। জাযাকাল্লাহ!');
    }
    setReplyTo(null);
    return true;
  };

  const handleQuickDurood = (item) => send(item.arabic);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      error('দয়া করে মন্তব্য বা দরূদ লিখুন');
      return;
    }
    if (await send(commentText.trim())) setCommentText('');
  };

  const renderComment = (comment, isReply = false) => {
    const cAdab = getAdabTerminology({
      currentUser: { name: 'পাঠক', seniorityRank: 2 },
      targetPerson: { name: comment.authorName, seniorityRank: 1 },
      isReplying: true,
    });
    return (
      <div key={comment.id} className="fb-comment-bubble-row" style={isReply ? { marginLeft: 36 } : undefined}>
        <Avatar name={comment.authorName} size="sm" />
        <div className="fb-comment-bubble-content">
          <div className={`fb-comment-bubble ${comment.isDurood ? 'fb-comment-bubble--durood' : ''}`}>
            <div className="fb-comment-bubble__head">
              <span className="fb-comment-bubble__author-name">{comment.authorName}</span>
            </div>
            <p className={comment.isDurood ? 'fb-comment-bubble__arabic-durood' : 'fb-comment-bubble__text'}>{comment.text}</p>
          </div>
          <div className="fb-comment-action-row">
            {!isReply && (
              <>
                <button type="button" className="fb-comment-action-btn" onClick={() => setReplyTo(comment)}>
                  {cAdab.replyBtnLabel}
                </button>
                <span className="fb-comment-dot">•</span>
              </>
            )}
            <span className="fb-comment-time">{comment.time}</span>
          </div>
          {comment.replies?.map((r) => renderComment(r, true))}
        </div>
      </div>
    );
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

      {replyTo && (
        <div className="fb-comment-replying-banner fade-in">
          <span>{replyTo.authorName}-এর মন্তব্যে উত্তর দিচ্ছেন</span>
          <button type="button" className="fb-comment-replying-cancel" onClick={() => setReplyTo(null)}>
            ✕ বাতিল
          </button>
        </div>
      )}

      <input
        className="fb-commenter-name"
        type="text"
        placeholder="আপনার নাম"
        value={commentName}
        onChange={(e) => setCommentName(e.target.value)}
        maxLength={60}
        aria-label="আপনার নাম"
      />
      <form className="fb-comment-input-row" onSubmit={handleAddComment}>
        <Avatar name={commentName || 'পাঠক'} size="sm" />
        <div className="fb-comment-input-wrap">
          <input
            type="text"
            placeholder="দরূদ শরীফ অথবা আপনার মূল্যবান মন্তব্য লিখুন..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="fb-comment-send-btn" aria-label="মন্তব্য পাঠান" disabled={!commentText.trim()}>
            <Send size={15} />
          </button>
        </div>
      </form>

      <div className="fb-comment-bubble-list" style={{ marginTop: '16px' }}>
        {comments.length === 0 ? (
          <p className="fb-comment-empty">এখনো কোনো মন্তব্য নেই — প্রথম মন্তব্যটি আপনার হোক।</p>
        ) : (
          comments.map((c) => renderComment(c))
        )}
      </div>
    </section>
  );
};

export default CommentSection;

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Avatar from '@/components/sirat/ui/Avatar';
import VerifiedBadge from '@/components/sirat/author/VerifiedBadge';
import Modal from '@/components/sirat/ui/Modal';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { getAuthorById } from '@/lib/sirat/sampleData';
import { ReactionButton, useReaction } from '@/components/sirat/ui/Reactions';
import {
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Sparkles,
  HelpCircle,
  Check,
  Clock,
  Lock,
  Edit3,
  Trash2,
  Copy,
  ShieldCheck,
  Save,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/lib/sirat/auth';
import { fetchSiratComments, postSiratComment, recordArticleView } from '@/lib/sirat/sirat-api';
import { sampleTopics } from '@/lib/sirat/sampleData';
import { getQuoteFontSize } from './CreatePostBox';
import { getAdabTerminology } from '@/lib/sirat/adabUtils';
import Button from '@/components/sirat/ui/Button';
import './postcard.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

/** "এইমাত্র", "৫ মিনিট আগে", "২১ ঘণ্টা আগে", "৩ দিন আগে", then the date. */
function formatTimestamp(ts) {
  if (!ts) return 'এইমাত্র';
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'এইমাত্র';
  if (mins < 60) return `${toBanglaNum(mins)} মিনিট আগে`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${toBanglaNum(hours)} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${toBanglaNum(days)} দিন আগে`;
  return new Intl.DateTimeFormat('bn-BD', {
    month: 'long',
    day: 'numeric',
    ...(date.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}),
  }).format(date);
}

/**
 * Shown views = real views × this. Temporary, for the testing phase only —
 * set back to 1 when the blog goes public.
 */
const VIEW_COUNT_MULTIPLIER = 3;

// Pre-defined Quick Durood Suggestions (কুরআনুল কারীমের খাঁটি আরবি ফন্টে)
const COMMENTER_KEY = 'sirat_commenter_name';
const isDuroodText = (t) => t.includes('صَلَّى') || t.includes('صَلِّ') || t.includes('ﷺ');

/** API comment → the shape the comment list renders. */
function toComment(c) {
  return {
    id: c.id,
    name: c.authorName,
    text: c.text,
    time: c.createdAt ? formatTimestamp(c.createdAt) : 'এইমাত্র',
    isDurood: isDuroodText(c.text || ''),
    replies: (c.replies || []).map(toComment),
  };
}

/** The API sends `{}` for a post's unused quiz / quote data; treat that as none. */
function normalizePost(article) {
  const filled = (d) => (d && typeof d === 'object' && Object.keys(d).length > 0 ? d : null);
  return { ...article, quizData: filled(article.quizData), quoteData: filled(article.quoteData) };
}

export const DUROOD_SUGGESTIONS = [
  {
    id: 'd1',
    arabic: 'صَلَّىٰ ٱللَّٰهُ عَلَيْهِ وَسَلَّمَ',
    label: 'সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম',
  },
  {
    id: 'd2',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
    label: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ...',
  },
  {
    id: 'd3',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ',
    label: 'আল্লাহুম্মা সাল্লি ওয়া সাল্লিম...',
  },
  {
    id: 'd4',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ عَدَدَ مَا ذَكَرَهُ الذَّاكِرُونَ',
    label: 'আদাদা মা যাকারাহুয যাকিরূন...',
  },
  {
    id: 'd5',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَعَلَىٰ آلِهِ وَسَلِّمْ',
    label: 'আন-নাবিয়্যিল উম্মিয়্যি...',
  },
];

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** `&#x27;` → `'` and the like: the clamped text shows the post's HTML as plain text. */
function decodeEntity(match, name) {
  if (name[0] === '#') {
    const hex = name[1] === 'x' || name[1] === 'X';
    const code = parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : match;
  }
  return NAMED_ENTITIES[name.toLowerCase()] ?? match;
}

export const PostCard = ({ article }) => {
  const [currentArticle, setCurrentArticle] = useState(() => normalizePost(article));
  const [isDeleted, setIsDeleted] = useState(false);

  const author = getAuthorById(currentArticle.authorId);
  const postAdab = getAdabTerminology({
    currentUser: { name: 'পাঠক', seniorityRank: 2 },
    targetPerson: author,
  });

  const { user, userProfile, isAdmin } = useAuth();

  // Author & Admin permission checks
  const isAuthor = Boolean(
    user && (
      user.uid === currentArticle.authorId ||
      userProfile?.displayName === currentArticle.authorName ||
      userProfile?.uid === currentArticle.authorId ||
      user.email === 'abdullah@sirat.blog'
    )
  );
  const canManagePost = isAuthor || isAdmin || userProfile?.role === 'admin' || userProfile?.role === 'scholar';

  const [expanded, setExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [duroodDraftOpen, setDuroodDraftOpen] = useState(false);
  const reaction = useReaction(article);
  const [comments, setComments] = useState([]);
  // Commenter name: the signed-in account, else the name this reader typed before.
  const [commenterName, setCommenterName] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(currentArticle.title || '');
  const [editSubtitle, setEditSubtitle] = useState(currentArticle.subtitle || currentArticle.excerpt || '');
  const [editContent, setEditContent] = useState(
    currentArticle.content || currentArticle.quoteData?.text || currentArticle.quizData?.question || ''
  );
  const [editTopicSlug, setEditTopicSlug] = useState(currentArticle.topicSlug || 'seerah-basics');
  const [editReference, setEditReference] = useState(currentArticle.quoteData?.reference || '');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizState, setQuizState] = useState('idle'); // 'idle' | 'countdown' | 'revealed'
  const [countdownLeft, setCountdownLeft] = useState(3);
  const countdownTimerRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const cardRef = useRef(null);
  const [viewCount, setViewCount] = useState(article.viewCount || 0);

  // Real comments from the server (none are invented here).
  useEffect(() => {
    let alive = true;
    if (article.slug) {
      fetchSiratComments(article.slug).then((list) => alive && setComments(list.map(toComment)));
    }
    let saved = '';
    try {
      saved = localStorage.getItem(COMMENTER_KEY) || '';
    } catch {}
    const name = user?.displayName || userProfile?.displayName || saved;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the saved name after hydration
    if (name) setCommenterName(name);
    return () => {
      alive = false;
    };
  }, [article.slug, user?.displayName, userProfile?.displayName]);

  // Count a view once per browser session when the post is actually seen.
  useEffect(() => {
    const el = cardRef.current;
    const slug = article.slug;
    if (!el || !slug) return;
    const key = `sirat_viewed_${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {}
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        try {
          sessionStorage.setItem(key, '1');
        } catch {}
        setViewCount((n) => n + 1);
        recordArticleView(slug).then((res) => res?.viewCount && setViewCount(res.viewCount));
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [article.slug]);
  const { success, error, info } = useToast();
  const commentInputRef = useRef(null);

  // Close options dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
        setOptionsMenuOpen(false);
      }
    };
    if (optionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsMenuOpen]);

  // Load existing quiz attempt from Firestore or guest session
  React.useEffect(() => {
    if (typeof window === 'undefined' || !currentArticle.quizData) return;

    if (user?.uid) {
      const loadAttempt = async () => {
        try {
          const res = await fetch(`/api/quiz?uid=${user.uid}&articleId=${currentArticle.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.answered && data.attempt?.selectedOptionId) {
              setSelectedQuizOption(data.attempt.selectedOptionId);
              setQuizState('revealed');
              return;
            }
          }
        } catch (e) {
          // Fallback: check localStorage with user-specific key
          try {
            const savedAttempts = JSON.parse(localStorage.getItem(`sirat_quiz_${user.uid}`) || '{}');
            const attempt = savedAttempts[currentArticle.id];
            if (attempt && attempt.selectedOptionId) {
              setSelectedQuizOption(attempt.selectedOptionId);
              setQuizState('revealed');
              return;
            }
          } catch (err) {
            console.error(err);
          }
        }
      };
      loadAttempt();
    } else {
      // Guest reader: check sessionStorage
      try {
        const guestAttempt = JSON.parse(sessionStorage.getItem(`sirat_guest_quiz_${currentArticle.id}`) || 'null');
        if (guestAttempt && guestAttempt.selectedOptionId) {
          setSelectedQuizOption(guestAttempt.selectedOptionId);
          setQuizState('revealed');
        } else {
          setSelectedQuizOption(null);
          setQuizState('idle');
        }
      } catch (err) {
        setSelectedQuizOption(null);
        setQuizState('idle');
      }
    }
  }, [currentArticle.id, currentArticle.quizData, user?.uid]);

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const handleQuizOptionClick = (optId) => {
    if (quizState === 'revealed') return;

    setSelectedQuizOption(optId);
    setQuizState('countdown');
    setCountdownLeft(3);

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    let currentCount = 3;
    countdownTimerRef.current = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCountdownLeft(currentCount);
      } else {
        clearInterval(countdownTimerRef.current);
        setCountdownLeft(0);
        setQuizState('revealed');

        const isCorrectAnswer = optId === article.quizData?.correctOptionId;

        if (user?.uid) {
          // Save to Firestore for logged in user
          fetch('/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              articleId: article.id,
              selectedOptionId: optId,
              isCorrect: isCorrectAnswer,
            }),
          }).catch((err) => console.error('Failed to save quiz to Firestore:', err));

          // Also save to user-specific localStorage as backup
          try {
            const savedAttempts = JSON.parse(localStorage.getItem(`sirat_quiz_${user.uid}`) || '{}');
            savedAttempts[article.id] = {
              selectedOptionId: optId,
              answeredAt: Date.now(),
              isCorrect: isCorrectAnswer,
            };
            localStorage.setItem(`sirat_quiz_${user.uid}`, JSON.stringify(savedAttempts));
          } catch (e) {
            console.error(e);
          }
        } else {
          // Guest reader: save to sessionStorage so they see their result
          try {
            sessionStorage.setItem(
              `sirat_guest_quiz_${article.id}`,
              JSON.stringify({
                selectedOptionId: optId,
                answeredAt: Date.now(),
                isCorrect: isCorrectAnswer,
              })
            );
          } catch (e) {
            console.error(e);
          }
        }

        if (isCorrectAnswer) {
          success('🎉 মাশাআল্লাহ! সঠিক উত্তর দিয়েছেন।');
        }
      }
    }, 1000);
  };


  // Sync bookmark state from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('sirat_bookmarks') || '[]');
        setBookmarked(saved.includes(article.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [article.id]);

  const handleToggleBookmark = (e) => {
    e?.stopPropagation();
    if (typeof window !== 'undefined') {
      try {
        let saved = JSON.parse(localStorage.getItem('sirat_bookmarks') || '[]');
        if (saved.includes(article.id)) {
          saved = saved.filter((id) => id !== article.id);
          setBookmarked(false);
          success('বুকমার্ক থেকে সরানো হয়েছে');
        } else {
          saved.push(article.id);
          setBookmarked(true);
          success('প্রবন্ধটি আপনার বুকমার্কে সংরক্ষিত হয়েছে');
        }
        localStorage.setItem('sirat_bookmarks', JSON.stringify(saved));
        window.dispatchEvent(new Event('sirat_bookmarks_changed'));
      } catch (e) {
        console.error(e);
      }
    }
  };

  /** Saves a comment (or reply) on the server, then shows it. */
  const sendComment = async (text, parent) => {
    const name = commenterName.trim();
    if (!name) {
      error('মন্তব্য করার আগে আপনার নাম লিখুন');
      return false;
    }
    try {
      localStorage.setItem(COMMENTER_KEY, name);
    } catch {}
    const saved = await postSiratComment(currentArticle.slug, { authorName: name, text, ...(parent ? { parent } : {}) });
    if (!saved?.id || String(saved.id).startsWith('local')) {
      error('মন্তব্য পাঠানো যায়নি, আবার চেষ্টা করুন');
      return false;
    }
    if (saved.status && saved.status !== 'approved') {
      success('ধন্যবাদ! অনুমোদনের পর মন্তব্যটি দেখা যাবে');
      return true;
    }
    const entry = toComment(saved);
    setComments((prev) =>
      parent ? prev.map((c) => (c.id === parent ? { ...c, replies: [...(c.replies || []), entry] } : c)) : [entry, ...prev]
    );
    return true;
  };

  const handleQuickDuroodSend = async (duroodItem) => {
    if (await sendComment(duroodItem.arabic)) success('দরূদ শরীফ যুক্ত হয়েছে');
  };

  const handleStartReply = (comment) => {
    const replyAdab = getAdabTerminology({
      currentUser: { name: 'পাঠক', seniorityRank: 2 },
      targetPerson: { name: comment.name, seniorityRank: comment.seniorityRank },
      isReplying: true,
    });
    setReplyingTo({
      id: comment.id,
      name: comment.name,
      bannerText: replyAdab.replyingBannerText,
      placeholder: replyAdab.inputPlaceholder,
    });
    setCommentInput('');
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text) return;
    if (await sendComment(text, replyingTo?.id)) {
      setReplyingTo(null);
      setCommentInput('');
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/articles/${article.slug}`;
      navigator.clipboard.writeText(url);
      success('পোস্টের লিংক কপি করা হয়েছে');
      setShareModalOpen(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      error('পোস্টের শিরোনাম আবশ্যক');
      return;
    }
    setIsSavingEdit(true);
    try {
      const updatedFields = {
        title: editTitle.trim(),
        subtitle: editSubtitle.trim(),
        content: editContent.trim(),
        topicSlug: editTopicSlug,
        excerpt: editSubtitle.trim() || editContent.trim().slice(0, 150) + '...',
      };

      if (currentArticle.quoteData) {
        updatedFields.quoteData = {
          ...currentArticle.quoteData,
          text: editContent.trim(),
          reference: editReference.trim(),
        };
      }

      const res = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentArticle.id,
          ...updatedFields,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentArticle((prev) => ({
          ...prev,
          ...updatedFields,
        }));
        setEditModalOpen(false);
        success('পোস্টটি সফলভাবে সম্পাদনা ও আপডেট করা হয়েছে।');
      } else {
        error(data.error || 'আপডেট করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles?id=${encodeURIComponent(currentArticle.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setIsDeleted(true);
        setDeleteModalOpen(false);
        success('পোস্টটি সফলভাবে মুছে ফেলা হয়েছে।');
      } else {
        error(data.error || 'পোস্ট মুছতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) {
    return null;
  }

  // Keep line breaks so each line (e.g. an Urdu line above Bangla) keeps its own direction.
  const rawText =
    currentArticle.content
      ?.replace(/<br\s*\/?>|<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{2,}/g, '\n')
      .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, decodeEntity)
      .trim() ||
    currentArticle.excerpt ||
    '';
  // Posts belong to a topic profile ("সিরাত কুইজ", "আত্মশুদ্ধি", ...), not a person.
  const topic = currentArticle.topicDetails;
  const profile = {
    name: topic?.name || currentArticle.topicName || currentArticle.authorName,
    avatar: topic?.avatar || null,
    isVerified: topic ? topic.isVerified !== false : true,
  };
  const profileHref = `/blog?topic=${currentArticle.topicSlug}`;

  return (
    <article className="fb-post-card" ref={cardRef}>
      {/* 1. Post Header — the topic profile the post is published under */}
      <div className="fb-post-header">
        <div className="fb-post-header__left">
          <Link href={profileHref}>
            <Avatar src={profile.avatar} name={profile.name} size="md" />
          </Link>
          <div className="fb-post-author-info">
            <Link href={profileHref} className="fb-post-author-name">
              <span>{profile.name}</span>
              {profile.isVerified && <VerifiedBadge isVerified size={15} showLabel={false} />}
            </Link>
            <div className="fb-post-time-row">
              <span>{formatTimestamp(currentArticle.publishedAt)}</span>
              <span>•</span>
              <span className="fb-post-views" title="এই পোস্টটি যতজন দেখেছেন">
                <Eye size={12} />
                {toBanglaNum(viewCount * VIEW_COUNT_MULTIPLIER)}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            type="button"
            className="fb-post-menu-btn"
            onClick={handleToggleBookmark}
            title={bookmarked ? 'বুকমার্ক থেকে সরান' : 'বুকমার্কে সংরক্ষণ করুন'}
            aria-label="বুকমার্ক"
            style={{ color: bookmarked ? '#1877F2' : 'inherit' }}
          >
            <Bookmark size={18} fill={bookmarked ? '#1877F2' : 'none'} />
          </button>

          <div className="fb-post-menu-anchor" ref={optionsMenuRef}>
            <button
              type="button"
              className="fb-post-menu-btn"
              onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
              title="অপশন ও নিয়ন্ত্রণ"
              aria-label="অপশন"
            >
              <MoreHorizontal size={20} />
            </button>

            {optionsMenuOpen && (
              <div className="fb-post-options-dropdown">
                <button
                  type="button"
                  className="fb-post-dropdown-item"
                  onClick={() => {
                    handleCopyLink();
                    setOptionsMenuOpen(false);
                  }}
                >
                  <Copy size={14} />
                  <span>লিংক কপি করুন</span>
                </button>

                <button
                  type="button"
                  className="fb-post-dropdown-item"
                  onClick={() => {
                    handleToggleBookmark();
                    setOptionsMenuOpen(false);
                  }}
                >
                  <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
                  <span>{bookmarked ? 'বুকমার্ক থেকে সরান' : 'বুকমার্কে সেভ করুন'}</span>
                </button>

                <button
                  type="button"
                  className="fb-post-dropdown-item"
                  onClick={() => {
                    setShareModalOpen(true);
                    setOptionsMenuOpen(false);
                  }}
                >
                  <Share2 size={14} />
                  <span>শেয়ার করুন</span>
                </button>

                {canManagePost && (
                  <>
                    <div className="fb-post-dropdown-divider" />
                    <button
                      type="button"
                      className="fb-post-dropdown-item fb-post-dropdown-item--primary"
                      onClick={() => {
                        setEditTitle(currentArticle.title || '');
                        setEditSubtitle(currentArticle.subtitle || currentArticle.excerpt || '');
                        setEditContent(
                          currentArticle.content ||
                          currentArticle.quoteData?.text ||
                          currentArticle.quizData?.question ||
                          ''
                        );
                        setEditTopicSlug(currentArticle.topicSlug || 'seerah-basics');
                        setEditReference(currentArticle.quoteData?.reference || '');
                        setEditModalOpen(true);
                        setOptionsMenuOpen(false);
                      }}
                    >
                      <Edit3 size={14} />
                      <span>{isAuthor ? 'পোস্ট সম্পাদনা করুন' : 'অ্যাডমিন সম্পাদনা'}</span>
                    </button>

                    <button
                      type="button"
                      className="fb-post-dropdown-item fb-post-dropdown-item--danger"
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setOptionsMenuOpen(false);
                      }}
                    >
                      <Trash2 size={14} />
                      <span>{isAuthor ? 'পোস্ট মুছে ফেলুন' : 'অ্যাডমিন ডিলিট'}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thin Divider Line under Author Row, ABOVE the Title */}
      <div className="fb-post-divider-line" />

      {/* 2. Post Content / Body */}
      <div className="fb-post-body">
        {/* If this is a Facebook-style Colored Quote Post */}
        {currentArticle.quoteData ? (
          <div
            className="fb-colored-quote-card"
            style={{
              background: currentArticle.quoteData.gradient || 'linear-gradient(135deg, #064E3B, #047857)',
              color: currentArticle.quoteData.textColor || '#FFFFFF',
            }}
          >
            {(() => {
              const fontStyle = getQuoteFontSize(currentArticle.quoteData.text.length);
              return (
                <div
                  className="fb-colored-quote-text"
                  style={{
                    fontSize: fontStyle.fontSize,
                    lineHeight: fontStyle.lineHeight,
                    fontWeight: fontStyle.fontWeight,
                  }}
                >
                  {currentArticle.quoteData.text}
                </div>
              );
            })()}
            {currentArticle.quoteData.reference && (
              <div className="fb-colored-quote-ref">
                <span>📚 {currentArticle.quoteData.reference}</span>
              </div>
            )}
          </div>
        ) : currentArticle.quizData ? (
          /* If this is an Interactive Seerah Quiz Post */
          <div className="seerah-quiz-container">
            <div className="seerah-quiz-header">
              <span className="seerah-quiz-badge">
                <HelpCircle size={13} /> সিরাত কুইজ
              </span>
              {quizState === 'revealed' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-kalpurush)',
                    backgroundColor: 'var(--color-bg-primary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border-secondary)',
                  }}
                >
                  <Lock size={11} />
                  <span>উত্তর প্রদান সম্পন্ন</span>
                </span>
              )}
            </div>
            <div className="seerah-quiz-question">{currentArticle.quizData.question}</div>
            <div className="seerah-quiz-options-grid">
              {currentArticle.quizData.options.map((opt, idx) => {
                const letters = ['ক', 'খ', 'গ', 'ঘ'];
                const isSelected = selectedQuizOption === opt.id;
                const isCorrect = opt.id === currentArticle.quizData.correctOptionId;
                let btnClass = 'seerah-quiz-option-btn';

                if (quizState === 'countdown') {
                  if (isSelected) btnClass += ' seerah-quiz-option-btn--selecting';
                } else if (quizState === 'revealed') {
                  if (isCorrect) btnClass += ' seerah-quiz-option-btn--correct';
                  else if (isSelected && !isCorrect) btnClass += ' seerah-quiz-option-btn--wrong';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={btnClass}
                    onClick={() => handleQuizOptionClick(opt.id)}
                    disabled={quizState === 'revealed'}
                  >
                    <span className="seerah-quiz-option-letter">
                      {quizState === 'revealed' && isCorrect ? (
                        <Check size={14} strokeWidth={3} />
                      ) : quizState === 'revealed' && isSelected && !isCorrect ? (
                        '✕'
                      ) : (
                        letters[idx]
                      )}
                    </span>
                    <span className="seerah-quiz-option-text">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Step 1: Active 3-Second Countdown Box (Mind-change allowed) */}
            {quizState === 'countdown' && (
              <div className="seerah-quiz-countdown-box">
                <div className="seerah-quiz-countdown-top">
                  <div className="seerah-quiz-countdown-label">
                    <Clock size={16} />
                    <span>উত্তর লক হতে বাকি:</span>
                  </div>
                  <div className="seerah-quiz-countdown-badge">
                    {toBanglaNum(countdownLeft)}
                  </div>
                </div>
                <div className="seerah-quiz-countdown-progress-bg">
                  <div
                    className="seerah-quiz-countdown-progress-fill"
                    style={{ width: `${((4 - countdownLeft) / 3) * 100}%` }}
                  />
                </div>
                <div className="seerah-quiz-countdown-hint">
                  💡 সময় শেষ হওয়ার আগে পরিবর্তন করতে চাইলে অন্য যেকোনো অপশনে ক্লিক করুন
                </div>
              </div>
            )}

            {/* Step 2: Locked Reveal - Celebration Banner on Correct Answer */}
            {quizState === 'revealed' && selectedQuizOption === currentArticle.quizData.correctOptionId && (
              <div className="seerah-quiz-celebration-banner fade-in">
                <div className="seerah-quiz-sparkles-row">✨ 🌟 🎉 🌟 ✨</div>
                <div className="seerah-quiz-celebration-title">🎉 মাশাআল্লাহ! আপনি সঠিক উত্তর দিয়েছেন।</div>
                <div className="seerah-quiz-celebration-sub">
                  {currentArticle.quizData.explanation || 'জাযাকাল্লাহু খাইরান! রাসূল ﷺ-এর সিরাতের জ্ঞানে আল্লাহ আপনার ইলম ও বারাকাহ বৃদ্ধি করুন।'}
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#047857', opacity: 0.9, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={11} />
                  <span>আপনার উত্তর সংরক্ষিত হয়েছে (১টি অ্যাকাউন্ট থেকে ১ বারই অংশগ্রহণযোগ্য)</span>
                </div>
              </div>
            )}

            {/* Step 2: Locked Reveal - Helpful Result when Wrong Option Selected */}
            {quizState === 'revealed' && selectedQuizOption !== currentArticle.quizData.correctOptionId && (
              <div
                style={{
                  marginTop: '14px',
                  backgroundColor: '#FEF2F2',
                  border: '1.5px solid #FECACA',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-kalpurush)',
                }}
                className="fade-in"
              >
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>
                  পরবর্তী প্রশ্নের জন্য শুভকামনা!
                </div>
                <div style={{ fontSize: '12.5px', color: '#7F1D1D', marginBottom: '8px', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  সঠিক উত্তরটি সবুজ রঙে চিহ্নিত করা হয়েছে। {article.quizData.explanation || ''}
                </div>
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#991B1B', opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={11} />
                  <span>আপনার উত্তর সংরক্ষিত হয়েছে (১টি অ্যাকাউন্ট থেকে ১ বারই অংশগ্রহণযোগ্য)</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Standard Article / Post */
          <>
            <h3 className="fb-post-title">
              <Link href={`/blog/articles/${currentArticle.slug}`}>{currentArticle.title}</Link>
            </h3>

            {/* Text Container: Click directly on text to toggle expand/collapse */}
            <div
              className="fb-post-text-wrapper"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'লেখাটি সংক্ষেপ করতে ক্লিক করুন' : 'সম্পূর্ণ লেখা পড়তে ক্লিক করুন'}
            >
              {expanded ? (
                <div
                  className="fb-post-text fade-in"
                  dangerouslySetInnerHTML={{ __html: currentArticle.content }}
                />
              ) : (
                <p className="fb-post-text fb-post-text--clamped">
                  {rawText}
                </p>
              )}
            </div>

            {/* Embedded Arabic Hadith/Ayat box (RTL & Right Aligned) */}
            {currentArticle.hadithSnippet && (
              <div className="fb-post-hadith-box">
                <div className="fb-post-hadith-arabic">{currentArticle.hadithSnippet.arabic}</div>
                {currentArticle.hadithSnippet.translation && (
                  <div className="fb-post-hadith-translation">{currentArticle.hadithSnippet.translation}</div>
                )}
                {currentArticle.hadithSnippet.ref && (
                  <div className="fb-post-hadith-ref">— {currentArticle.hadithSnippet.ref}</div>
                )}
              </div>
            )}

            {/* Multiple Sources / References List */}
            {currentArticle.sources && currentArticle.sources.length > 0 && (
              <div className="fb-post-sources-list">
                <span className="fb-post-sources-label">📚 সূত্রসমূহ:</span>
                {currentArticle.sources.map((src, idx) => (
                  <span key={idx} className="fb-post-source-tag">
                    {src}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>


      {/* 4. Action Buttons Bar (Unified: جَزَاكَ ٱللَّٰهُ, মন্তব্য ও দরূদ, শেয়ার) */}
      <div className="fb-post-actions-bar">
        <ReactionButton reaction={reaction} />

        {/* Unified Comment & Durood / Arzh Button */}
        <button
          type="button"
          className={`fb-post-action-btn ${commentsOpen ? 'fb-post-action-btn--active' : ''}`}
          onClick={() => setCommentsOpen(!commentsOpen)}
          aria-label={postAdab.actionBtnLabel}
        >
          <MessageSquare size={17} />
          <span>{postAdab.actionBtnLabel} ({toBanglaNum(comments.length)})</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          className="fb-post-action-btn"
          onClick={() => setShareModalOpen(true)}
          aria-label="পোস্ট শেয়ার করুন"
        >
          <Share2 size={17} />
          <span>শেয়ার</span>
        </button>
      </div>

      {/* 5. Modern In-Feed Comments with Sleek Durood Ribbon */}
      {commentsOpen && (
        <div className="fb-infeed-comments">
          {/* Sleek Horizontal Scrollable Durood Ribbon (কুইক দরূদ রিবন - লেবেলমুক্ত ও মসৃণ স্ক্রল) */}
          <div className="fb-durood-ribbon">
            <div className="fb-durood-ribbon__chips">
              {DUROOD_SUGGESTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="fb-durood-ribbon-pill"
                  onClick={() => handleQuickDuroodSend(item)}
                  title={item.label}
                >
                  <span className="fb-durood-ribbon-pill__ar">{item.arabic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Replying Banner */}
          {replyingTo && (
            <div className="fb-comment-replying-banner fade-in">
              <span>{replyingTo.bannerText}</span>
              <button
                type="button"
                className="fb-comment-replying-cancel"
                onClick={() => setReplyingTo(null)}
              >
                ✕ বাতিল
              </button>
            </div>
          )}

          {/* Write Custom Comment Form */}
          {!user && (
            <input
              className="fb-commenter-name"
              type="text"
              placeholder="আপনার নাম"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              maxLength={60}
              aria-label="আপনার নাম"
            />
          )}
          <form className="fb-comment-input-row" onSubmit={handleAddComment}>
            <Avatar name={commenterName || 'পাঠক'} size="sm" />
            <div className="fb-comment-input-wrap">
              <input
                ref={commentInputRef}
                type="text"
                placeholder={replyingTo ? replyingTo.placeholder : postAdab.inputPlaceholder}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                type="submit"
                className="fb-comment-send-btn"
                aria-label={replyingTo ? 'উত্তর পাঠান' : postAdab.submitTooltip}
                disabled={!commentInput.trim()}
              >
                <Send size={15} />
              </button>
            </div>
          </form>

          {/* Comment Bubbles Stream */}
          <div className="fb-comment-bubble-list">
            {comments.map((c) => {
              const cAdab = getAdabTerminology({
                currentUser: { name: 'পাঠক', seniorityRank: 2 },
                targetPerson: { name: c.name, seniorityRank: c.seniorityRank },
                isReplying: true,
              });

              return (
                <div key={c.id} className="fb-comment-item-wrap">
                  <div className="fb-comment-bubble-row">
                    <Avatar name={c.name} size="sm" />
                    <div className="fb-comment-bubble-content">
                      <div
                        className={`fb-comment-bubble ${
                          c.isDurood ? 'fb-comment-bubble--durood' : ''
                        }`}
                      >
                        <div className="fb-comment-bubble__head">
                          <span className="fb-comment-bubble__author-name">{c.name}</span>
                        </div>

                        {c.isDurood ? (
                          <p className="fb-comment-bubble__arabic-durood">{c.text}</p>
                        ) : (
                          <p className="fb-comment-bubble__text">{c.text}</p>
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
                                item.id === c.id
                                  ? { ...item, jazakallahCount: (item.jazakallahCount || 0) + 1 }
                                  : item
                              )
                            );
                            success('মন্তব্যে জাযাকাল্লাহ জানানো হয়েছে');
                          }}
                        >
                          <span>জাযাকাল্লাহ</span>
                          {c.jazakallahCount > 0 && (
                            <span className="fb-comment-action-count">
                              {toBanglaNum(c.jazakallahCount)}
                            </span>
                          )}
                        </button>
                        <span className="fb-comment-dot">•</span>
                        <button
                          type="button"
                          className="fb-comment-action-btn"
                          onClick={() => handleStartReply(c)}
                        >
                          {cAdab.replyBtnLabel}
                        </button>
                        <span className="fb-comment-dot">•</span>
                        <span className="fb-comment-time">{c.time}</span>
                      </div>
                    </div>
                  </div>

                {/* Nested Threaded Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div className="fb-comment-nested-replies">
                    {c.replies.map((reply) => (
                      <div key={reply.id} className="fb-comment-bubble-row fb-comment-bubble-row--reply">
                        <Avatar name={reply.name} size="xs" />
                        <div className="fb-comment-bubble-content">
                          <div className="fb-comment-bubble">
                            <div className="fb-comment-bubble__head">
                              <span className="fb-comment-bubble__author-name">{reply.name}</span>
                            </div>
                            <p className="fb-comment-bubble__text">{reply.text}</p>
                          </div>
                          <div className="fb-comment-action-row">
                            <span className="fb-comment-time">{reply.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="পোস্টটি শেয়ার করুন"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            "{currentArticle.title}" — সিরাতের এই গুরুত্বপূর্ণ প্রবন্ধটি অন্যদের সাথে শেয়ার করুন।
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? `${window.location.origin}/articles/${currentArticle.slug}` : ''}
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

      {/* Edit Post Modal (Author & Admin Access) */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={isAuthor ? 'পোস্ট সম্পাদনা করুন' : 'অ্যাডমিন সম্পাদনা কন্ট্রোল'}
        maxWidth="640px"
      >
        <form onSubmit={handleSaveEdit} style={{ fontFamily: 'var(--font-kalpurush)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isAuthor && isAdmin && (
            <div style={{ padding: '8px 12px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', color: '#1D4ED8', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              <span>আপনি <strong>প্রধান অ্যাডমিন পারমিশন</strong> দিয়ে এই পোস্টটি সম্পাদনা করছেন।</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
              পোস্টের শিরোনাম / মূল বিষয়
            </label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
              সারসংক্ষেপ / উপ-শিরোনাম
            </label>
            <input
              type="text"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              placeholder="সংক্ষিপ্ত বিবরণ"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
              মূল বক্তব্য / প্রবন্ধের বিবরণ
            </label>
            <textarea
              rows={5}
              required
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', lineHeight: 1.6 }}
            />
          </div>

          {currentArticle.quoteData && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                উদ্ধৃতি তথ্যসূত্র (Reference)
              </label>
              <input
                type="text"
                value={editReference}
                onChange={(e) => setEditReference(e.target.value)}
                placeholder="যেমন: সহীহ বুখারী, হাদিস নং..."
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
              বিষয় বা বিভাগ
            </label>
            <select
              value={editTopicSlug}
              onChange={(e) => setEditTopicSlug(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit' }}
            >
              {sampleTopics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" loading={isSavingEdit}>
              <Save size={15} style={{ marginRight: '6px' }} />
              পরিবর্তন সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal (Author & Admin Access) */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="পোস্ট মুছে ফেলার নিশ্চিতকরণ"
        maxWidth="480px"
      >
        <div style={{ fontFamily: 'var(--font-kalpurush)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px' }}>
            <AlertTriangle size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#991B1B', marginBottom: '4px' }}>
                আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান?
              </div>
              <div style={{ fontSize: '12.5px', color: '#7F1D1D', lineHeight: 1.5 }}>
                মুছে ফেলার পর এটি স্থায়ীভাবে বিলুপ্ত হবে এবং ফিড থেকে সরিয়ে নেওয়া হবে।
              </div>
            </div>
          </div>

          <div style={{ padding: '10px 12px', backgroundColor: '#F8FAFC', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', marginBottom: '18px', fontSize: '13px' }}>
            <strong>শিরোনাম:</strong> {currentArticle.title}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button type="button" variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              বাতিল
            </Button>
            <button
              type="button"
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="admin-action-btn admin-btn-ban"
              style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={15} />
              <span>{isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'স্থায়ীভাবে মুছে ফেলুন'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </article>
  );
};

export default PostCard;

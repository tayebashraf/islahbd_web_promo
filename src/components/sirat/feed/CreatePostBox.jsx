'use client';

import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@/components/sirat/ui/Avatar';
import Modal from '@/components/sirat/ui/Modal';
import Button from '@/components/sirat/ui/Button';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { sampleTopics } from '@/lib/sirat/sampleData';
import {
  PenSquare,
  HelpCircle,
  Quote,
  Plus,
  Trash2,
  Sparkles,
  AlignRight,
  BookMarked,
  Type,
  Pilcrow,
  Palette,
  Send,
  X,
  CheckCircle,
  Check,
  CheckSquare,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/lib/sirat/auth';
import { createArticle } from '@/lib/sirat/firestore';
import './createpostbox.css';

// 10 Facebook-Style Colored Background Presets for Quotes
export const QUOTE_BACKGROUNDS = [
  { id: 'bg-emerald', label: 'ইসলামিক এমারেল্ড', gradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)', textColor: '#FFFFFF' },
  { id: 'bg-gold', label: 'সূবর্ণ নূর', gradient: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)', textColor: '#FFFFFF' },
  { id: 'bg-royal-blue', label: 'নীল দিগন্ত', gradient: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #0284C7 100%)', textColor: '#FFFFFF' },
  { id: 'bg-crimson', label: 'রয়েল রুবি', gradient: 'linear-gradient(135deg, #831843 0%, #9D174D 50%, #BE185D 100%)', textColor: '#FFFFFF' },
  { id: 'bg-obsidian', label: 'কালো ক্যালিগ্রাফি', gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)', textColor: '#F8FAFC' },
  { id: 'bg-teal', label: 'মরু উদ্যান', gradient: 'linear-gradient(135deg, #134E4A 0%, #0F766E 50%, #14B8A6 100%)', textColor: '#FFFFFF' },
  { id: 'bg-purple', label: 'রজনীগন্ধা পার্পল', gradient: 'linear-gradient(135deg, #3B0764 0%, #581C87 50%, #7E22CE 100%)', textColor: '#FFFFFF' },
  { id: 'bg-sunset', label: 'সন্ধ্যা রক্তিম', gradient: 'linear-gradient(135deg, #9A3412 0%, #EA580C 50%, #F97316 100%)', textColor: '#FFFFFF' },
  { id: 'bg-charcoal', label: 'ধূসর অভিজাত', gradient: 'linear-gradient(135deg, #18181B 0%, #27272A 50%, #3F3F46 100%)', textColor: '#FFFFFF' },
  { id: 'bg-pearl', label: 'মুক্তা শুভ্র', gradient: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)', textColor: '#0F172A', border: '2px solid #CBD5E1' },
];

export function getQuoteFontSize(textLength) {
  if (textLength <= 40) return { fontSize: '26px', lineHeight: '1.45', fontWeight: 800 };
  if (textLength <= 80) return { fontSize: '21px', lineHeight: '1.55', fontWeight: 700 };
  if (textLength <= 150) return { fontSize: '17.5px', lineHeight: '1.65', fontWeight: 600 };
  return { fontSize: '15px', lineHeight: '1.75', fontWeight: 500 };
}

export const CreatePostBox = ({ onNewPost }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('article'); // 'article' | 'quiz' | 'quote'

  // Standard Blocks
  const [blocks, setBlocks] = useState([
    { id: 'b_1', type: 'title', value: '', color: 'default' },
    { id: 'b_2', type: 'paragraph', value: '', color: 'default' },
  ]);
  const [sources, setSources] = useState(['']);
  const [selectedTopic, setSelectedTopic] = useState('makki-life');

  // Quiz State
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState([
    { id: 'opt_1', text: '' },
    { id: 'opt_2', text: '' },
    { id: 'opt_3', text: '' },
    { id: 'opt_4', text: '' },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState('opt_1');
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizPreviewSelected, setQuizPreviewSelected] = useState(null);
  const [previewQuizState, setPreviewQuizState] = useState('idle'); // 'idle' | 'countdown' | 'revealed'
  const [previewCountdownLeft, setPreviewCountdownLeft] = useState(3);
  const previewTimerRef = useRef(null);

  const handlePreviewOptionClick = (optId) => {
    if (previewQuizState === 'revealed') return;

    setQuizPreviewSelected(optId);
    setPreviewQuizState('countdown');
    setPreviewCountdownLeft(3);

    if (previewTimerRef.current) {
      clearInterval(previewTimerRef.current);
    }

    let currentCount = 3;
    previewTimerRef.current = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setPreviewCountdownLeft(currentCount);
      } else {
        clearInterval(previewTimerRef.current);
        setPreviewCountdownLeft(0);
        setPreviewQuizState('revealed');
      }
    }, 1000);
  };

  const handleResetPreviewQuiz = () => {
    if (previewTimerRef.current) {
      clearInterval(previewTimerRef.current);
    }
    setPreviewQuizState('idle');
    setQuizPreviewSelected(null);
    setPreviewCountdownLeft(3);
  };

  // Quote State
  const [quoteText, setQuoteText] = useState('');
  const [quoteRef, setQuoteRef] = useState('');
  const [selectedBgId, setSelectedBgId] = useState('bg-emerald');

  const [avatarSrc, setAvatarSrc] = useState(null);
  const { success, error } = useToast();
  const { user, userProfile } = useAuth();

  const currentUser = {
    uid: user?.uid || 'user-me',
    displayName: userProfile?.displayName || user?.displayName || 'মুফতী আব্দুল্লাহ',
    photoURL: avatarSrc || user?.photoURL || '',
  };

  useEffect(() => {
    const updateAvatar = () => {
      const saved = localStorage.getItem('sirat_user_avatar');
      setAvatarSrc(saved || null);
    };
    updateAvatar();
    window.addEventListener('sirat_avatar_change', updateAvatar);
    return () => window.removeEventListener('sirat_avatar_change', updateAvatar);
  }, []);

  // Block management
  const handleAddBlock = (type) => {
    const newBlock = {
      id: 'b_' + Date.now() + Math.random().toString(36).substring(2, 5),
      type,
      value: '',
      color: 'default',
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleUpdateBlock = (id, value) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)));
  };

  const handleRemoveBlock = (id) => {
    if (blocks.length <= 1) {
      setBlocks([{ id: 'b_' + Date.now(), type: 'paragraph', value: '', color: 'default' }]);
    } else {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Sources management
  const handleAddSourceRow = () => setSources((prev) => [...prev, '']);
  const handleSourceChange = (index, value) => {
    const updated = [...sources];
    updated[index] = value;
    setSources(updated);
  };
  const handleRemoveSourceRow = (index) => {
    const updated = sources.filter((_, i) => i !== index);
    setSources(updated.length > 0 ? updated : ['']);
  };

  // Quiz Option update
  const handleUpdateQuizOption = (optId, text) => {
    setQuizOptions((prev) => prev.map((o) => (o.id === optId ? { ...o, text } : o)));
  };

  // Submit Post
  const handlePostSubmit = (e) => {
    e.preventDefault();

    let title = '';
    let htmlContent = '';
    let excerpt = '';
    let postSources = sources.map((s) => s.trim()).filter(Boolean);
    let quizData = null;
    let quoteData = null;

    if (mode === 'article') {
      const hasContent = blocks.some((b) => b.value.trim().length > 0);
      if (!hasContent) {
        error('দয়া করে কিছু লিখুন');
        return;
      }
      if (postSources.length === 0) {
        error('তথ্যসূত্র উল্লেখ করা আবশ্যক! দয়া করে নির্ভরযোগ্য কিতাবের নাম লিখুন।');
        return;
      }

      blocks.forEach((b) => {
        if (b.type === 'title') {
          if (!title) title = b.value.trim();
          htmlContent += `<h3>${b.value.trim()}</h3>`;
        } else if (b.type === 'paragraph') {
          if (!excerpt) excerpt = b.value.trim().substring(0, 150);
          htmlContent += `<p>${b.value.trim()}</p>`;
        } else if (b.type === 'arabic') {
          htmlContent += `<div class="fb-post-hadith-box"><div class="fb-post-hadith-arabic">${b.value.trim()}</div></div>`;
        } else if (b.type === 'quote') {
          htmlContent += `<blockquote>${b.value.trim()}</blockquote>`;
        }
      });
      title = title || 'সিরাত ভাবনা ও ঐতিহাসিক তাৎপর্য';
      excerpt = excerpt || title;
    } else if (mode === 'quiz') {
      if (!quizQuestion.trim()) {
        error('দয়া করে সিরাত কুইজের প্রশ্নটি লিখুন');
        return;
      }
      const filledOptions = quizOptions.filter((o) => o.text.trim().length > 0);
      if (filledOptions.length < 2) {
        error('কমপক্ষে ২টি অপশন পূরণ করুন');
        return;
      }

      title = `সিরাত কুইজ: ${quizQuestion.trim()}`;
      excerpt = quizQuestion.trim();
      quizData = {
        question: quizQuestion.trim(),
        options: quizOptions.map((o) => ({ id: o.id, text: o.text.trim() || 'অপশন' })),
        correctOptionId,
        explanation: quizExplanation.trim() || 'রাসূলুল্লাহ ﷺ-এর জীবনচরিত থেকে বিশুদ্ধ তথ্যের ভিত্তিতে প্রস্তুতকৃত।',
      };
      if (postSources.length === 0) {
        postSources = ['সিরাত গ্রন্থমালা ও সহীহ হাদিস'];
      }
    } else if (mode === 'quote') {
      if (!quoteText.trim()) {
        error('দয়া করে আপনার সিরাত উদ্ধৃতি বা অনুভূতিটি লিখুন');
        return;
      }
      title = 'সিরাত উদ্ধৃতি ও অনুভূতি';
      excerpt = quoteText.trim().substring(0, 120);
      const bgObj = QUOTE_BACKGROUNDS.find((bg) => bg.id === selectedBgId) || QUOTE_BACKGROUNDS[0];
      quoteData = {
        text: quoteText.trim(),
        reference: quoteRef.trim() || 'রাসূলুল্লাহ ﷺ-এর অনুপম চরিত্র',
        bgId: selectedBgId,
        gradient: bgObj.gradient,
        textColor: bgObj.textColor,
      };
      if (postSources.length === 0) {
        postSources = [quoteRef.trim() || 'সিরাত ও শামায়েল'];
      }
    }

    const newPost = {
      id: 'p_' + Date.now(),
      slug: 'post-' + Date.now(),
      title,
      content: htmlContent,
      excerpt,
      sources: postSources,
      quizData,
      quoteData,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      topicName: sampleTopics.find((t) => t.slug === selectedTopic)?.name || 'সিরাত কুইজ ও ভাবনা',
      topicSlug: selectedTopic,
      publishedAt: { seconds: Date.now() / 1000 },
      readingTime: 1,
      jazakallahCount: 1,
      duroodCount: 4,
    };

    createArticle(newPost).catch((err) => console.error('Error saving post:', err));

    if (onNewPost) {
      onNewPost(newPost);
    }

    // Reset Form
    setBlocks([
      { id: 'b_1', type: 'title', value: '', color: 'default' },
      { id: 'b_2', type: 'paragraph', value: '', color: 'default' },
    ]);
    setQuizQuestion('');
    setQuoteText('');
    setSources(['']);
    setModalOpen(false);
    success(
      mode === 'quiz'
        ? 'সিরাত কুইজ সফলভাবে প্রকাশিত হয়েছে!'
        : mode === 'quote'
        ? 'উদ্ধৃতি সফলভাবে প্রকাশিত হয়েছে!'
        : 'সিরাত পোস্ট সফলভাবে প্রকাশিত হয়েছে!'
    );
  };

  return (
    <>
      <div className="fb-create-post-card">
        {/* Top: Avatar + Trigger button */}
        <div className="fb-create-post__top">
          <Avatar src={avatarSrc} name={currentUser.displayName} size="md" />
          <button
            type="button"
            className="fb-create-post__input-btn"
            onClick={() => {
              setMode('article');
              setModalOpen(true);
            }}
            aria-label="নতুন সিরাত পোস্ট তৈরি করুন"
          >
            {currentUser.displayName}, রাসূল ﷺ-এর সিরাত নিয়ে কিছু লিখুন...
          </button>
        </div>

        <hr className="fb-create-post__divider" />

        {/* Bottom 3 Quick Triggers Requested by User */}
        <div className="fb-create-post__bottom">
          {/* ১. সিরাত লিখুন */}
          <button
            type="button"
            className="fb-create-post__action-btn"
            onClick={() => {
              setMode('article');
              setModalOpen(true);
            }}
          >
            <PenSquare size={18} color="#FA383E" />
            <span>সিরাত লিখুন</span>
          </button>

          {/* ২. সিরাত কুইজ */}
          <button
            type="button"
            className="fb-create-post__action-btn"
            onClick={() => {
              setMode('quiz');
              if (!quizQuestion) {
                setQuizQuestion('রাসূলুল্লাহ ﷺ কোন ঐতিহাসিক প্রান্তরে বিদায় হজের ভাষণ দিয়েছিলেন?');
                setQuizOptions([
                  { id: 'opt_1', text: 'আরাফাতের ময়দানে (জাবালে রহমত)' },
                  { id: 'opt_2', text: 'মিনার প্রান্তরে' },
                  { id: 'opt_3', text: 'মুযদালিফায়' },
                  { id: 'opt_4', text: 'বদর ময়দানে' },
                ]);
                setCorrectOptionId('opt_1');
                setQuizExplanation('১০ম হিজরিতে রাসূলুল্লাহ ﷺ বিদায় হজে আরাফাতের ময়দানে ঐতিহাসিক বিশ্বজনীন মানবাধিকারের ভাষণ প্রদান করেন।');
              }
              setModalOpen(true);
            }}
          >
            <HelpCircle size={18} color="#059669" />
            <span>সিরাত কুইজ</span>
          </button>

          {/* ৩. উদ্ধৃতি ও অনুভূতি */}
          <button
            type="button"
            className="fb-create-post__action-btn"
            onClick={() => {
              setMode('quote');
              if (!quoteText) {
                setQuoteText('রাসূলুল্লাহ ﷺ ছিলেন মানুষের মধ্যে সর্বোত্তম চরিত্রের অধিকারী ও পরম দয়ালু।');
                setQuoteRef('সহীহ বুখারী ও মুসলিম');
              }
              setModalOpen(true);
            }}
          >
            <Quote size={18} color="#F59E0B" />
            <span>উদ্ধৃতি ও অনুভূতি</span>
          </button>
        </div>
      </div>

      {/* Dynamic Modular Composer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="600px"
        title={
          mode === 'quiz'
            ? 'সিরাত কুইজ তৈরি ও প্রকাশ'
            : mode === 'quote'
            ? 'উদ্ধৃতি ও রঙিন বাণী তৈরি'
            : 'সিরাত প্রবন্ধ ও পোস্ট তৈরি'
        }
      >
        <form onSubmit={handlePostSubmit} className="fb-composer-container">
          {/* 1. Mode Switcher Tabs */}
          <div className="fb-composer-tabs">
            <button
              type="button"
              onClick={() => setMode('article')}
              className={`fb-composer-tab ${mode === 'article' ? 'fb-composer-tab--active-article' : ''}`}
            >
              <PenSquare size={14} />
              <span>প্রবন্ধ লিখন</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('quiz')}
              className={`fb-composer-tab ${mode === 'quiz' ? 'fb-composer-tab--active-quiz' : ''}`}
            >
              <HelpCircle size={14} />
              <span>সিরাত কুইজ</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('quote')}
              className={`fb-composer-tab ${mode === 'quote' ? 'fb-composer-tab--active-quote' : ''}`}
            >
              <Quote size={14} />
              <span>উদ্ধৃতি ও বাণী</span>
            </button>
          </div>

          {/* 2. Author Row & Topic Selector */}
          <div className="fb-composer-author-row">
            <div className="fb-composer-author-left">
              <Avatar src={avatarSrc} name={currentUser.displayName || 'মুফতী মাহমুদুর রহমান'} size="sm" />
              <div className="fb-composer-author-info">
                <span className="fb-composer-author-name">{currentUser.displayName || 'মুফতী মাহমুদুর রহমান কাসেমী'}</span>
                <span className="fb-composer-author-badge">✨ তাহকিক লেখক</span>
              </div>
            </div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="fb-composer-topic-select"
            >
              {sampleTopics.map((topic) => (
                <option key={topic.id} value={topic.slug}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* ============================================================
              MODE 1: ARTICLE (সিরাত প্রবন্ধ ও আলোচনা)
              ============================================================ */}
          {mode === 'article' && (
            <>
              {/* Dynamic Blocks Container */}
              <div className="fb-composer-blocks-list">
                {blocks.map((block, idx) => (
                  <div key={block.id} className="fb-composer-block-item fade-in">
                    <div className="fb-composer-block-header">
                      <span className="fb-composer-block-tag">
                        {block.type === 'title' && '📌 প্রবন্ধের শিরোনাম *'}
                        {block.type === 'paragraph' && '📝 মূল আলোচনা ও বিবরণ *'}
                        {block.type === 'arabic' && '🕌 আরবি হাদিস / কোরআনের আয়াত'}
                        {block.type === 'quote' && '💬 সালাফ বা কিতাবের উদ্ধৃতি'}
                      </span>
                      {blocks.length > 1 && block.type !== 'title' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBlock(block.id)}
                          className="fb-composer-block-del"
                          title="এই অংশটি মুছুন"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    {block.type === 'title' && (
                      <input
                        type="text"
                        placeholder="যেমন: হুদাইবিয়ার সন্ধি ও নববী রাষ্ট্রনীতি..."
                        value={block.value}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        className="fb-composer-input"
                        autoFocus
                      />
                    )}

                    {block.type === 'paragraph' && (
                      <textarea
                        placeholder="এখানে সিরাতের প্রামাণ্য ইতিহাস, শিক্ষণীয় দিক ও তাহকিক আলোচনা লিখুন..."
                        value={block.value}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        className="fb-composer-textarea"
                        rows={4}
                      />
                    )}

                    {block.type === 'arabic' && (
                      <textarea
                        placeholder="عن النبي ﷺ أنه قال... (আরবি ইবারত বা সনদ লিখুন)"
                        value={block.value}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        className="fb-composer-arabic-textarea"
                        dir="rtl"
                        rows={2}
                      />
                    )}

                    {block.type === 'quote' && (
                      <textarea
                        placeholder="ঐতিহাসিক কিতাব বা নির্ভরযোগ্য আলেমদের উক্তি লিখুন..."
                        value={block.value}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        className="fb-composer-textarea"
                        rows={2}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Block Builder Bar */}
              <div className="fb-composer-toolbar">
                <span className="fb-composer-toolbar-label">+ বাড়তি অংশ যোগ করুন:</span>
                <div className="fb-composer-toolbar-btns">
                  <button
                    type="button"
                    onClick={() => handleAddBlock('arabic')}
                    className="fb-composer-tool-btn fb-composer-tool-btn--arabic"
                    title="আরবি হাদিস/আয়াত"
                  >
                    <AlignRight size={13} />
                    <span>আরবি হাদিস</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('quote')}
                    className="fb-composer-tool-btn fb-composer-tool-btn--quote"
                    title="উদ্ধৃতি"
                  >
                    <Quote size={13} />
                    <span>উদ্ধৃতি</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('paragraph')}
                    className="fb-composer-tool-btn"
                    title="আরেকটি অনুচ্ছেদ"
                  >
                    <Pilcrow size={13} />
                    <span>প্যারাগ্রাফ</span>
                  </button>
                </div>
              </div>

              {/* Mandatory Reference Row */}
              <div className="fb-composer-sources-card">
                <div className="fb-composer-sources-header">
                  <span className="fb-composer-sources-title">
                    <BookMarked size={14} />
                    <span>তথ্যসূত্র ও নির্ভরযোগ্য কিতাব (বাধ্যতামূলক) *</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSourceRow}
                    className="fb-composer-add-source-btn"
                  >
                    <Plus size={12} />
                    <span>আরও সূত্র যোগ করুন</span>
                  </button>
                </div>

                <div className="fb-composer-sources-inputs">
                  {sources.map((src, index) => (
                    <div key={index} className="fb-composer-source-row">
                      <input
                        type="text"
                        placeholder="যেমন: সহীহ বুখারী, হাদিস নং ১২৩৪ / আর-রাহিকুল মাখতুম, পৃ. ১২০"
                        value={src}
                        onChange={(e) => handleSourceChange(index, e.target.value)}
                        className="fb-composer-source-input"
                      />
                      {sources.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSourceRow(index)}
                          className="fb-composer-source-del"
                          title="মুছুন"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ============================================================
              MODE 2: QUIZ (সিরাত কুইজ)
              ============================================================ */}
          {mode === 'quiz' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>
                  💡 প্রশ্ন লিখুন, ৪টি অপশন দিন এবং যেটি সঠিক উত্তর তার পাশের গোল টিকচিহ্নটিতে ক্লিক করুন।
                </span>
              </div>

              <div className="fb-composer-field">
                <label className="fb-composer-label">
                  <span>কুইজের প্রশ্ন *</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রাসূলুল্লাহ ﷺ কোন হিজরিতে বদর যুদ্ধে অংশগ্রহণ করেন?"
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  className="fb-composer-input"
                  required
                />
              </div>

              {/* 4 Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {quizOptions.map((opt, idx) => {
                  const letters = ['ক', 'খ', 'গ', 'ঘ'];
                  const isCorrect = correctOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: isCorrect ? '2px solid #10B981' : '1px solid #CBD5E1',
                        backgroundColor: isCorrect ? '#F0FDF4' : '#FFFFFF',
                        padding: '6px 10px',
                        borderRadius: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '13px', color: isCorrect ? '#059669' : '#64748B' }}>
                        {letters[idx]}.
                      </span>
                      <input
                        type="text"
                        placeholder={`অপশন ${letters[idx]}`}
                        value={opt.text}
                        onChange={(e) => handleUpdateQuizOption(opt.id, e.target.value)}
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          fontFamily: 'inherit',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setCorrectOptionId(opt.id)}
                        title={isCorrect ? 'সঠিক উত্তর হিসেবে চিহ্নিত' : 'সঠিক উত্তর হিসেবে চিহ্নিত করতে ক্লিক করুন'}
                        style={{
                          border: 'none',
                          background: isCorrect ? '#10B981' : '#E2E8F0',
                          color: isCorrect ? '#FFFFFF' : '#64748B',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="fb-composer-field">
                <label className="fb-composer-label">
                  <span>সঠিক উত্তরের সংক্ষিপ্ত ব্যাখ্যা (ঐচ্ছিক):</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ২য় হিজরির ১৭ই রমজান ঐতিহাসিক বদর প্রান্তর যুদ্ধ সংঘটিত হয়।"
                  value={quizExplanation}
                  onChange={(e) => setQuizExplanation(e.target.value)}
                  className="fb-composer-input"
                />
              </div>

              {/* Interactive Live Quiz Preview with Celebration Effect Demo */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#059669', marginBottom: '6px' }}>
                  👀 লাইভ ইন্টারেক্টিভ কুইজ প্রিভিউ (ক্লিক করে টেস্ট করুন):
                </span>
                <div className="seerah-quiz-container" style={{ margin: 0, padding: '14px' }}>
                  <div className="seerah-quiz-header">
                    <span className="seerah-quiz-badge">
                      <HelpCircle size={13} /> সিরাত কুইজ
                    </span>
                    {previewQuizState === 'revealed' && (
                      <button
                        type="button"
                        onClick={handleResetPreviewQuiz}
                        className="seerah-quiz-reset-btn"
                        style={{ margin: 0, padding: '2px 8px', fontSize: '11px' }}
                      >
                        <RotateCcw size={10} />
                        <span>পুনরায় খেলুন</span>
                      </button>
                    )}
                  </div>
                  <div className="seerah-quiz-question">{quizQuestion || 'আপনার প্রশ্ন এখানে দেখা যাবে'}</div>
                  <div className="seerah-quiz-options-grid">
                    {quizOptions.map((opt, idx) => {
                      const letters = ['ক', 'খ', 'গ', 'ঘ'];
                      const isSelected = quizPreviewSelected === opt.id;
                      const isCorrect = opt.id === correctOptionId;
                      let btnClass = 'seerah-quiz-option-btn';

                      if (previewQuizState === 'countdown') {
                        if (isSelected) btnClass += ' seerah-quiz-option-btn--selecting';
                      } else if (previewQuizState === 'revealed') {
                        if (isCorrect) btnClass += ' seerah-quiz-option-btn--correct';
                        else if (isSelected && !isCorrect) btnClass += ' seerah-quiz-option-btn--wrong';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={btnClass}
                          onClick={() => handlePreviewOptionClick(opt.id)}
                          disabled={previewQuizState === 'revealed'}
                        >
                          <span className="seerah-quiz-option-letter">
                            {previewQuizState === 'revealed' && isCorrect ? (
                              <Check size={14} strokeWidth={3} />
                            ) : previewQuizState === 'revealed' && isSelected && !isCorrect ? (
                              '✕'
                            ) : (
                              letters[idx]
                            )}
                          </span>
                          <span className="seerah-quiz-option-text">{opt.text || `অপশন ${letters[idx]}`}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 3s Countdown Ribbon in Preview */}
                  {previewQuizState === 'countdown' && (
                    <div className="seerah-quiz-countdown-box">
                      <div className="seerah-quiz-countdown-top">
                        <div className="seerah-quiz-countdown-label">
                          <Clock size={15} />
                          <span>উত্তর লক হতে বাকি:</span>
                        </div>
                        <div className="seerah-quiz-countdown-badge">
                          {toBanglaNum(previewCountdownLeft)}
                        </div>
                      </div>
                      <div className="seerah-quiz-countdown-progress-bg">
                        <div
                          className="seerah-quiz-countdown-progress-fill"
                          style={{ width: `${((4 - previewCountdownLeft) / 3) * 100}%` }}
                        />
                      </div>
                      <div className="seerah-quiz-countdown-hint">
                        💡 সময় শেষ হওয়ার আগে পরিবর্তন করতে চাইলে অন্য অপশনে ক্লিক করুন
                      </div>
                    </div>
                  )}

                  {/* Celebration / Welcome Sparkle Banner */}
                  {previewQuizState === 'revealed' && quizPreviewSelected === correctOptionId && (
                    <div className="seerah-quiz-celebration-banner fade-in">
                      <div className="seerah-quiz-sparkles-row">✨ 🌟 🎉 🌟 ✨</div>
                      <div className="seerah-quiz-celebration-title">🎉 মাশাআল্লাহ! আপনি সঠিক উত্তর দিয়েছেন।</div>
                      <div className="seerah-quiz-celebration-sub">
                        {quizExplanation || 'জাযাকাল্লাহু খাইরান! রাসূল ﷺ-এর সিরাতের জ্ঞানে আল্লাহ আপনার ইলম ও বারাকাহ বৃদ্ধি করুন।'}
                      </div>
                    </div>
                  )}

                  {previewQuizState === 'revealed' && quizPreviewSelected !== correctOptionId && (
                    <div style={{ marginTop: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '12.5px', color: '#991B1B' }}>
                      <div style={{ fontWeight: 800, marginBottom: '3px' }}>পরবর্তী প্রশ্নের জন্য শুভকামনা!</div>
                      <div>সঠিক উত্তরটি সবুজ রঙে চিহ্নিত করা হয়েছে। {quizExplanation || ''}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              MODE 3: QUOTE (উদ্ধৃতি ও রঙিন ব্যাকগ্রাউন্ড — Facebook Style)
              ============================================================ */}
          {mode === 'quote' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="fb-composer-field">
                <label className="fb-composer-label">
                  <span>উদ্ধৃতি / অনুভূতি লিখুন *</span>
                </label>
                <textarea
                  placeholder="রাসূলুল্লাহ ﷺ-এর কোনো বাণী বা চরিত্র সম্পর্কিত গভীর অনুভূতি লিখুন..."
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  className="fb-composer-textarea"
                  style={{ minHeight: '80px' }}
                  required
                />
              </div>

              <div className="fb-composer-field">
                <label className="fb-composer-label">
                  <span>উদ্ধৃতির সূত্র / কিতাবের নাম:</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সহীহ বুখারী: ৬০২৪ / আল-বিদায়া ওয়ান নিহায়া"
                  value={quoteRef}
                  onChange={(e) => setQuoteRef(e.target.value)}
                  className="fb-composer-input"
                />
              </div>

              {/* 10 Facebook-Style Background Swatches */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  🎨 ব্যাকগ্রাউন্ড থিম নির্বাচন করুন:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {QUOTE_BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedBgId(bg.id)}
                      title={bg.label}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: bg.gradient,
                        border: selectedBgId === bg.id ? '3px solid #1877F2' : '1px solid rgba(0,0,0,0.15)',
                        transform: selectedBgId === bg.id ? 'scale(1.12)' : 'scale(1)',
                        cursor: 'pointer',
                        transition: 'transform 150ms ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              <div>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>
                  👀 লাইভ ফেসবুক-স্টাইল প্রিভিউ:
                </span>
                {(() => {
                  const currentBg = QUOTE_BACKGROUNDS.find((b) => b.id === selectedBgId) || QUOTE_BACKGROUNDS[0];
                  const fontStyle = getQuoteFontSize(quoteText.length);
                  return (
                    <div
                      className="fb-colored-quote-card"
                      style={{
                        background: currentBg.gradient,
                        color: currentBg.textColor,
                        border: currentBg.border || 'none',
                        borderRadius: '10px',
                      }}
                    >
                      <div
                        className="fb-colored-quote-text"
                        style={{
                          fontSize: fontStyle.fontSize,
                          lineHeight: fontStyle.lineHeight,
                          fontWeight: fontStyle.fontWeight,
                        }}
                      >
                        {quoteText || 'আপনার সিরাত উদ্ধৃতি এখানে স্বয়ংক্রিয় ফন্ট সাইজে প্রদর্শিত হবে'}
                      </div>
                      {quoteRef && (
                        <div className="fb-colored-quote-ref">
                          <span>📚 {quoteRef}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Modal Footer / Publish Button */}
          <div className="fb-composer-footer">
            <button
              type="submit"
              className="fb-composer-submit-btn"
            >
              <Send size={16} />
              <span>
                {mode === 'quiz'
                  ? 'সিরাত কুইজ প্রকাশ করুন'
                  : mode === 'quote'
                  ? 'উদ্ধৃতি প্রকাশ করুন'
                  : 'সিরাত পোস্ট প্রকাশ করুন'}
              </span>
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePostBox;


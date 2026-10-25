'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Edit3,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/sirat/ui/Button';
import Modal from '@/components/sirat/ui/Modal';
import { useToast } from '@/components/sirat/ui/ToastContext';
import ArticleBody from '@/components/sirat/article/ArticleBody';
import { sampleTopics } from '@/lib/sirat/sampleData';
import './editor.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export const RichTextEditor = ({
  initialData = {},
  onSave,
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [subtitle, setSubtitle] = useState(initialData.subtitle || '');
  const [content, setContent] = useState(initialData.content || '');
  const [topicSlug, setTopicSlug] = useState(initialData.topicSlug || 'makki-life');
  const [references, setReferences] = useState(initialData.references ? initialData.references.join('\n') : '');
  const [mode, setMode] = useState('edit'); // 'edit' | 'preview'
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const textareaRef = useRef(null);
  const { success, error } = useToast();

  // Calculate word count and reading time
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  // Auto-save simulated
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        setLastSaved(new Date());
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [title, subtitle, content, topicSlug]);

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previous = textarea.value;
    const selected = previous.substring(start, end);

    const replacement = before + (selected || '') + after;
    const newContent = previous.substring(0, start) + replacement + previous.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected ? selected.length : 0)
      );
    }, 0);
  };

  const handleInsertArabic = () => {
    insertText('<div class="arabic-text">', '</div>\n');
  };

  const handleInsertHadith = () => {
    const template = `\n<div class="hadith-block">
  <div class="hadith-arabic">إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ</div>
  <div class="hadith-translation">"নিশ্চয়ই সমস্ত কাজ নিয়তের ওপর নির্ভরশীল।"</div>
  <div class="hadith-reference">— সহীহ বুখারী, হাদিস: ১</div>
</div>\n`;
    insertText(template);
  };

  const handleInsertQuote = () => {
    insertText('<blockquote>', '</blockquote>\n');
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    if (onSave) {
      await onSave({ title, subtitle, content, topicSlug, references: references.split('\n').filter(Boolean) });
    }
    setSaving(false);
    setLastSaved(new Date());
    success('খসড়া সফলভাবে সংরক্ষণ করা হয়েছে');
  };

  const handlePublishSubmit = async () => {
    if (!title.trim()) {
      error('দয়া করে প্রবন্ধের শিরোনাম লিখুন');
      return;
    }
    if (!content.trim()) {
      error('দয়া করে প্রবন্ধের মূল বক্তব্য লিখুন');
      return;
    }

    setSaving(true);
    if (onSubmit) {
      await onSubmit({
        title,
        subtitle,
        content,
        topicSlug,
        references: references.split('\n').filter(Boolean),
      });
    }
    setSaving(false);
    setPublishModalOpen(false);
    success('আপনার প্রবন্ধটি সম্পাদনা পর্যালোচনার জন্য জমা হয়েছে। জাযাকাল্লাহ!');
  };

  return (
    <div className="editor-wrapper">
      {/* Topbar */}
      <div className="editor-topbar">
        <div className="editor-topbar__left">
          <Link
            href="/blog/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              fontFamily: 'var(--font-bengali-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>ড্যাশবোর্ড</span>
          </Link>
          <div className="toolbar-divider" />
          <select
            value={topicSlug}
            onChange={(e) => setTopicSlug(e.target.value)}
            aria-label="বিষয় নির্বাচন করুন"
            style={{
              fontFamily: 'var(--font-bengali-ui)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-brand-primary)',
              backgroundColor: 'var(--color-brand-subtle)',
              border: '1px solid rgba(45, 95, 45, 0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.75rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {sampleTopics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="editor-topbar__right">
          {lastSaved && (
            <span className="editor-status">
              <CheckCircle2 size={13} color="var(--color-brand-primary)" />
              <span>সংরক্ষিত</span>
            </span>
          )}

          {/* Toggle Mode */}
          <button
            className="toolbar-btn"
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            aria-label={mode === 'edit' ? 'প্রিভিউ দেখুন' : 'সম্পাদনা করুন'}
          >
            {mode === 'edit' ? <Eye size={15} /> : <Edit3 size={15} />}
            <span>{mode === 'edit' ? 'প্রিভিউ' : 'সম্পাদনা'}</span>
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            loading={saving}
          >
            <Save size={15} />
            <span>খসড়া</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setPublishModalOpen(true)}
          >
            <Send size={15} />
            <span>জমা দিন</span>
          </Button>
        </div>
      </div>

      {/* Formatting Toolbar (Only in Edit mode) */}
      {mode === 'edit' && (
        <div className="editor-toolbar">
          <button
            className="toolbar-btn"
            onClick={() => insertText('<h2>', '</h2>\n')}
            title="শিরোনাম ২"
          >
            <Heading2 size={16} />
            <span>H2</span>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => insertText('<h3>', '</h3>\n')}
            title="শিরোনাম ৩"
          >
            <Heading3 size={16} />
            <span>H3</span>
          </button>

          <div className="toolbar-divider" />

          <button
            className="toolbar-btn"
            onClick={() => insertText('<strong>', '</strong>')}
            title="বোল্ড"
          >
            <Bold size={16} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => insertText('<em>', '</em>')}
            title="ইটালিক"
          >
            <Italic size={16} />
          </button>
          <button
            className="toolbar-btn"
            onClick={handleInsertQuote}
            title="উদ্ধৃতি"
          >
            <Quote size={16} />
          </button>

          <div className="toolbar-divider" />

          {/* Special Islamic Editorial Blocks */}
          <button
            className="toolbar-btn toolbar-btn--special"
            onClick={handleInsertArabic}
            title="আরবি টেক্সট ব্লক"
          >
            <span>عربي আরবি</span>
          </button>

          <button
            className="toolbar-btn toolbar-btn--special"
            onClick={handleInsertHadith}
            title="হাদিস বা আয়াত রেফারেন্স ব্লক"
          >
            <BookOpen size={14} />
            <span>হাদিস রেফারেন্স</span>
          </button>
        </div>
      )}

      {/* Canvas */}
      <div className="editor-canvas">
        {mode === 'edit' ? (
          <>
            <input
              type="text"
              className="editor-input-title"
              placeholder="প্রবন্ধের মূল শিরোনাম..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <input
              type="text"
              className="editor-input-subtitle"
              placeholder="উপ-শিরোনাম বা সারসংক্ষেপ (ঐচ্ছিক)..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <textarea
              ref={textareaRef}
              className="editor-textarea"
              placeholder="রাসূলুল্লাহ ﷺ-এর সিরাত নিয়ে আপনার সুগভীর গবেষণা ও আলোচনা লিখুন..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="editor-stats-footer">
              <div>
                <span>শব্দসংখ্যা: {toBanglaNum(wordCount)}</span> •{' '}
                <span>আনুমানিক পাঠ সময়: {toBanglaNum(readingTime)} মিনিট</span>
              </div>
              <div>বাংলা ও আরবি টাইপোগ্রাফি স্বয়ংক্রিয়ভাবে সুবিন্যস্ত হবে</div>
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-bengali-ui)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--color-brand-primary)',
                  backgroundColor: 'var(--color-brand-subtle)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {sampleTopics.find((t) => t.slug === topicSlug)?.name || 'সিরাত'}
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-bengali-body)',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-bold)',
                  marginTop: 'var(--space-4)',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {title || 'শিরোনামহীন প্রবন্ধ'}
              </h1>
              {subtitle && (
                <p
                  style={{
                    fontFamily: 'var(--font-bengali-ui)',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            <ArticleBody content={content || '<p>কোনো বিষয়বস্তু লেখা হয়নি।</p>'} />
          </div>
        )}
      </div>

      {/* Publish Dialog */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="পর্যালোচনার জন্য জমা দিন"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p
            style={{
              fontFamily: 'var(--font-bengali-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            সীরাত.ব্লগে প্রকাশিত প্রতিটি লেখা সম্পাদনা পর্ষদ ও প্রামাণিক আলেমদের দ্বারা পর্যালোচিত হয়। জমা দেওয়ার পর লেখাটি যাচাই প্রক্রিয়া সম্পন্ন করে প্রকাশ করা হবে।
          </p>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-bengali-ui)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-medium)',
                marginBottom: 'var(--space-1)',
              }}
            >
              তথ্যসূত্র ও গ্রন্থপঞ্জি (প্রতি লাইনে একটি)
            </label>
            <textarea
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="উদাহরণ:&#10;১. সহীহ বুখারী, কিতাবুল মাগাযী&#10;২. সিরাতে ইবনে হিশাম"
              style={{
                width: '100%',
                minHeight: '80px',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)',
                backgroundColor: 'var(--color-bg-surface)',
                fontFamily: 'var(--font-bengali-ui)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-2)',
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPublishModalOpen(false)}
            >
              বাতিল
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublishSubmit}
              loading={saving}
            >
              নিশ্চিত ও জমা দিন
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RichTextEditor;

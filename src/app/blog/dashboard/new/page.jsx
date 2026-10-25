'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import RichTextEditor from '@/components/sirat/editor/RichTextEditor';
import { createArticle } from '@/lib/sirat/firestore';
import { useAuth } from '@/lib/sirat/auth';
import Button from '@/components/sirat/ui/Button';

export default function NewArticlePage() {
  const router = useRouter();
  const { user, userProfile, isWriter } = useAuth();

  if (!isWriter) {
    return (
      <div className="narrow-container fade-in" style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'var(--font-kalpurush)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ShieldCheck size={36} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          শুধুমাত্র অনুমোদিত সিরাত গবেষক ও লেখকদের জন্য উন্মুক্ত
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          সীরাত.ব্লগে বিশুদ্ধ তাহকিক ও নির্ভরযোগ্য হাদিস শাস্ত্রীয় মানদণ্ড রক্ষার্থে কেবল যাচাইকৃত আলেম ও গবেষকবৃন্দ প্রবন্ধ প্রকাশ করতে পারেন।
        </p>
        <Link href="/blog/apply">
          <Button variant="primary" size="lg">
            <span>লেখক হিসেবে আবেদন করুন</span>
            <ChevronRight size={16} style={{ marginLeft: '6px' }} />
          </Button>
        </Link>
      </div>
    );
  }

  const handleSave = async (data) => {
    try {
      await createArticle({
        ...data,
        status: 'draft',
        authorId: user ? user.uid : 'author-1',
        authorName: userProfile ? userProfile.displayName : 'মুফতী আব্দুল্লাহ',
        authorAvatar: '',
        excerpt: data.subtitle || data.content.slice(0, 150) + '...',
      });
    } catch (err) {
      console.error('Save draft error:', err);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const created = await createArticle({
        ...data,
        status: 'published',
        authorId: user ? user.uid : 'author-1',
        authorName: userProfile ? userProfile.displayName : 'মুফতী আব্দুল্লাহ',
        authorAvatar: '',
        excerpt: data.subtitle || data.content.slice(0, 150) + '...',
      });
      setTimeout(() => {
        router.push("/blog");
      }, 1200);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  return (
    <div className="fade-in">
      <RichTextEditor onSave={handleSave} onSubmit={handleSubmit} />
    </div>
  );
}

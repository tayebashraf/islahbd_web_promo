'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PostCard from '@/components/sirat/feed/PostCard';
import Avatar from '@/components/sirat/ui/Avatar';
import Button from '@/components/sirat/ui/Button';
import Tabs from '@/components/sirat/ui/Tabs';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { useAuth } from '@/lib/sirat/auth';
import { getArticles } from '@/lib/sirat/firestore';
import { sampleArticles } from '@/lib/sirat/sampleData';
import { PenSquare, Camera, Trash2, CheckCircle2, BookOpen, Heart, Eye, UserCheck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import FeedbackConsultationBox from '@/components/sirat/layout/FeedbackConsultationBox';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('published');
  const [photoURL, setPhotoURL] = useState(null);
  const [publishedArticles, setPublishedArticles] = useState([]);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();
  const { user, userProfile, isWriter, isPendingWriter, loginAsDemoScholar } = useAuth();

  const currentUser = {
    displayName: userProfile?.displayName || user?.displayName || 'মুফতী আব্দুল্লাহ',
    email: userProfile?.email || user?.email || 'abdullah@sirat.blog',
    expertise: userProfile?.expertise || (isWriter ? 'সিরাত গবেষক ও লেখক' : 'সিরাত অনুরাগী পাঠক'),
    isVerified: isWriter,
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('sirat_user_avatar');
      if (savedPhoto) {
        setPhotoURL(savedPhoto);
      }
    }

    async function loadData() {
      try {
        const list = await getArticles({ status: 'published', pageSize: 10 });
        setPublishedArticles(list.length > 0 ? list : sampleArticles.slice(0, 4));
      } catch {
        setPublishedArticles(sampleArticles.slice(0, 4));
      }
    }
    loadData();
  }, [user]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      error('ছবির সাইজ সর্বোচ্চ ৪ মেগাবাইট হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setPhotoURL(dataUrl);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sirat_user_avatar', dataUrl);
        window.dispatchEvent(new Event('sirat_avatar_change'));
      }
      success('প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoURL(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sirat_user_avatar');
      window.dispatchEvent(new Event('sirat_avatar_change'));
    }
    success('প্রোফাইল ছবি সরানো হয়েছে');
  };

  const published = sampleArticles.slice(0, 3);
  const drafts = [
    {
      id: 'd1',
      title: 'নবীজী ﷺ-এর শিক্ষাদান পদ্ধতি ও সমকালীন প্রাসঙ্গিকতা',
      time: '১৫ মিনিট আগে সংরক্ষিত',
    },
    {
      id: 'd2',
      title: 'হুদাইবিয়ার সন্ধি: দূরদর্শী রাষ্ট্রনীতির এক অনুপম দৃষ্টান্ত',
      time: '২ ঘন্টা আগে সংরক্ষিত',
    },
  ];

  const tabs = [
    { id: 'published', label: 'আমার পোস্টসমূহ', count: toBanglaNum(publishedArticles.length) },
    { id: 'drafts', label: 'খসড়াসমূহ', count: toBanglaNum(drafts.length) },
    { id: 'switcher', label: 'স্কলার প্রোফাইল সুইচার' },
  ];

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      <div className="space-y-4">
        {/* User Cover / Profile Card */}
        <div className="fb-card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {/* Avatar with Camera Upload Overlay */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar src={photoURL} name={currentUser.displayName} size="xl" />
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-brand-primary)',
                    color: '#FFFFFF',
                    border: '2px solid var(--color-bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                  title="প্রোফাইল ছবি পরিবর্তন করুন"
                  aria-label="ছবি আপলোড করুন"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div>
                <h1 style={{ fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{currentUser.displayName}</span>
                  {currentUser.isVerified && (
                    <CheckCircle2 size={16} color="#1877F2" fill="#E7F3FF" />
                  )}
                </h1>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  {currentUser.expertise}
                </span>

                {photoURL && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-error)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: 0,
                    }}
                  >
                    <Trash2 size={11} />
                    <span>ছবি সরান</span>
                  </button>
                )}
              </div>
            </div>

            {isWriter ? (
              <Button variant="primary" size="sm" href="/dashboard/new">
                <PenSquare size={15} />
                <span>নতুন পোস্ট লিখুন</span>
              </Button>
            ) : (
              <Button variant="primary" size="sm" href="/blog/apply" style={{ backgroundColor: '#059669', borderColor: '#047857' }}>
                <ShieldCheck size={15} />
                <span>লেখক হিসেবে আবেদন করুন</span>
              </Button>
            )}
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--color-border-secondary)',
              textAlign: 'center',
            }}
          >
            <div>
              <strong style={{ fontSize: 'var(--text-lg)', display: 'block', color: 'var(--color-brand-primary)' }}>
                {toBanglaNum(publishedArticles.length)}
              </strong>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>মোট প্রবন্ধ</span>
            </div>
            <div>
              <strong style={{ fontSize: 'var(--text-lg)', display: 'block', color: 'var(--color-error)' }}>
                {toBanglaNum(320)}
              </strong>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>জাযাকাল্লাহ</span>
            </div>
            <div>
              <strong style={{ fontSize: 'var(--text-lg)', display: 'block', color: '#1877F2' }}>
                {toBanglaNum(1450)}
              </strong>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>পাঠক সংখ্যা</span>
            </div>
          </div>
        </div>

        {/* If NOT an approved writer, display the prominent Writer Application CTA Banner */}
        {!isWriter && (
          <div
            className="fb-card fade-in"
            style={{
              padding: '16px 20px',
              marginBottom: 'var(--space-4)',
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              border: '1.5px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '15px', fontWeight: 800, color: '#065F46', margin: '0 0 2px' }}>
                  সীরাত.ব্লগে তাহকিক গবেষক ও লেখক হিসেবে যুক্ত হোন
                </h3>
                <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '12.5px', color: '#047857', margin: 0, lineHeight: 1.5 }}>
                  বিশুদ্ধ সিরাত প্রচার ও গবেষণামূলক প্রবন্ধ প্রকাশ করতে ভেরিফাইড লেখক হিসেবে অন্তর্ভুক্তি আবেদন করুন।
                </p>
              </div>
            </div>

            <Button variant="primary" href="/blog/apply" style={{ backgroundColor: '#059669', borderColor: '#047857', whiteSpace: 'nowrap' }}>
              <span>লেখক হিসেবে আবেদন করুন</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        )}

        {/* Tabs Card */}
        <div className="fb-card" style={{ padding: 'var(--space-2) var(--space-4) 0', marginBottom: 'var(--space-4)' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content Stream */}
        <div className="fb-posts-stream">
          {activeTab === 'published' &&
            publishedArticles.map((article) => (
              <PostCard key={article.id} article={article} />
            ))}

          {activeTab === 'drafts' &&
            drafts.map((d) => (
              <div key={d.id} className="fb-card" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>
                    {d.title}
                  </h4>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{d.time}</span>
                </div>
                <Button variant="ghost" size="sm" href="/dashboard/new">
                  সম্পাদনা
                </Button>
              </div>
            ))}

          {activeTab === 'switcher' && (
            <div className="fb-card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                অন্যান্য স্কলার বা পাঠক প্রোফাইল হিসেবে টেস্ট করুন:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'author-1', name: 'ড. আবদুর রহমান (প্রবীণ গবেষক - ভেরিফাইড)' },
                  { id: 'author-4', name: 'শায়খ আহমাদ আলী (সিনিয়র স্কলার - ভেরিফাইড)' },
                  { id: 'author-2', name: 'উস্তাযা ফাতিমা খান (প্রক্রিয়াধীন লেখক)' },
                  { id: 'reader-1', name: 'মুহাম্মাদ খালিদ (সাধারণ পাঠক)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      loginAsDemoScholar(item.id);
                      success(`${item.name} হিসেবে সফলভাবে লগইন করা হয়েছে!`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      background: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border-secondary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-kalpurush)',
                      fontSize: '13.5px',
                    }}
                  >
                    <UserCheck size={16} color="var(--color-brand-primary)" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Advice & Consultation Widget */}
          <FeedbackConsultationBox />
        </div>
      </div>
    </div>
  );
}

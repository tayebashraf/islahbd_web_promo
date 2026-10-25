'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import AuthorCard from '@/components/sirat/author/AuthorCard';
import { sampleAuthors } from '@/lib/sirat/sampleData';
import { Users, Sparkles, PenTool, Search, ShieldCheck } from 'lucide-react';

const FILTER_TOPICS = ['সব গবেষক', 'সিরাত গবেষণা', 'হাদিস শাস্ত্র', 'নববী আখলাক', 'মক্কী জীবন', 'মাদানী জীবন', 'তাফসির'];

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function AuthorsPage() {
  const [selectedTopic, setSelectedTopic] = useState('সব গবেষক');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAuthors = sampleAuthors.filter((author) => {
    const matchesSearch =
      author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (author.expertise && author.expertise.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTopic =
      selectedTopic === 'সব গবেষক' ||
      (author.expertise && author.expertise.includes(selectedTopic));

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />

      <main className="fb-feed-container" aria-label="লেখক ও গবেষকবৃন্দ">
        {/* 1. Header Card with Scholar Counter */}
        <div className="fb-card" style={{ padding: '18px 20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-brand-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-brand-primary)',
                }}
              >
                <Users size={20} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                  সিরাত লেখক ও গবেষকবৃন্দ
                </h1>
                <span style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '12px', color: '#64748B' }}>
                  {toBanglaNum(sampleAuthors.length)} জন প্রামাণ্য আলেম ও সিরাত গবেষক নিবন্ধিত
                </span>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '11.5px', color: '#065F46', fontWeight: 700, fontFamily: 'var(--font-kalpurush)' }}>
              <ShieldCheck size={13} />
              <span>১০০% তাহকিককৃত</span>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '6px 0 14px' }}>
            সীরাত.ব্লগে নিয়মিত গবেষণামূলক প্রবন্ধ রচনা করেন এমন বিশুদ্ধ আকিদা ও প্রামাণ্য সনদধারী আলেম-গবেষকদের তালিকা।
          </p>

          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="লেখকের নাম বা গবেষণার বিষয় লিখে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border-secondary)',
                backgroundColor: 'var(--color-bg-primary)',
                fontFamily: 'var(--font-kalpurush)',
                fontSize: '13px',
                color: 'var(--color-text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Filter Chips Ribbon */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {FILTER_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedTopic === topic ? 'var(--color-brand-primary)' : 'var(--color-border-secondary)',
                  backgroundColor: selectedTopic === topic ? 'var(--color-brand-primary)' : 'var(--color-bg-primary)',
                  color: selectedTopic === topic ? '#FFFFFF' : 'var(--color-text-primary)',
                  fontFamily: 'var(--font-kalpurush)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease',
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Scholar Onboarding CTA Card */}
        <div
          className="fb-card"
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
            color: '#FFFFFF',
            padding: '16px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PenTool size={20} color="#FBBF24" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '15px', fontWeight: 700, margin: '0 0 2px', color: '#FFFFFF' }}>
                আপনি কি সিরাত বিষয়ক গবেষক বা আলেম?
              </h3>
              <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '12.5px', color: '#CBD5E1', margin: 0 }}>
                সীরাত.ব্লগের ভেরিফাইড লেখক হিসেবে অন্তর্ভুক্তি পেতে আবেদন করুন।
              </p>
            </div>
          </div>

          <Link
            href="/blog/apply"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-kalpurush)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>লেখক হিসেবে আবেদন করুন</span>
            <span>→</span>
          </Link>
        </div>

        {/* 3. Scholars Cards Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredAuthors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}

          {filteredAuthors.length === 0 && (
            <div className="fb-card" style={{ padding: '36px 16px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '14px', color: '#64748B' }}>
                এই ক্যাটাগরিতে কোনো লেখকের সন্ধান পাওয়া যায়নি।
              </p>
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}

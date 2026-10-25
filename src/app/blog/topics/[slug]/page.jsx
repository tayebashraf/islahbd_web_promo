'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import PostCard from '@/components/sirat/feed/PostCard';
import { sampleTopics, sampleArticles } from '@/lib/sirat/sampleData';
import { Layers, ArrowLeft, BookOpen } from 'lucide-react';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const topic = sampleTopics.find((t) => t.slug === slug);
  const topicArticles = sampleArticles.filter((a) => a.topic === slug || (topic && a.topicName === topic.name));

  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />

      <main className="fb-feed-container" aria-label="বিষয়ভিত্তিক সিরাত ফিড">
        {/* Back Link */}
        <div style={{ marginBottom: '12px' }}>
          <Link
            href="/blog/topics"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-kalpurush)',
              fontSize: '13px',
              fontWeight: 700,
              color: '#065F46',
              textDecoration: 'none',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-secondary)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <ArrowLeft size={14} />
            <span>সকল সিরাত পর্ব ও বিষয়সমূহ</span>
          </Link>
        </div>

        {topic ? (
          <>
            {/* Topic Header Card */}
            <div className="fb-card" style={{ padding: '20px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: topic.gradient || 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: '#FFFFFF',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                >
                  {topic.icon}
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-kalpurush)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#64748B',
                      display: 'block',
                      marginBottom: '2px',
                    }}
                  >
                    {topic.categoryName || 'সিরাত গবেষণা পর্ব'}
                  </span>
                  <h1
                    style={{
                      fontFamily: 'var(--font-kalpurush)',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      margin: 0,
                      color: '#065F46',
                    }}
                  >
                    {topic.name}
                  </h1>
                </div>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-kalpurush)',
                  fontSize: '13.5px',
                  color: '#475569',
                  lineHeight: 1.65,
                  margin: '0 0 12px',
                }}
              >
                {topic.description} — এই পর্বের অধীনে সংকলিত তাহকিককৃত গবেষণামূলক প্রবন্ধসমূহ নিচে উপস্থাপন করা হলো।
              </p>

              {/* Subtopic Tags */}
              {topic.tags && topic.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {topic.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: 'var(--font-kalpurush)',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: '#065F46',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        padding: '2px 9px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                style={{
                  borderTop: '1px solid var(--color-border-secondary)',
                  paddingTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-kalpurush)',
                  fontSize: '12px',
                  color: '#64748B',
                }}
              >
                <BookOpen size={13} color="#065F46" />
                <span>
                  সর্বমোট <strong>{toBanglaNum(topicArticles.length || topic.articleCount)}</strong> টি গবেষণামূলক প্রবন্ধ
                </span>
              </div>
            </div>

            {/* Articles Stream */}
            <div className="fb-posts-stream">
              {topicArticles.map((article) => (
                <PostCard key={article.id} article={article} />
              ))}

              {topicArticles.length === 0 && (
                <div className="fb-card" style={{ padding: '36px 16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '14px', color: '#64748B' }}>
                    এই পর্বে এখনও কোনো নতুন প্রবন্ধ প্রকাশিত হয়নি।
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="fb-card" style={{ padding: '36px 16px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              বিষয়টি পাওয়া যায়নি
            </h2>
            <Link
              href="/blog/topics"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontFamily: 'var(--font-kalpurush)',
                fontWeight: 700,
                fontSize: '13px',
                marginTop: '10px',
              }}
            >
              সকল বিষয় দেখুন
            </Link>
          </div>
        )}
      </main>

      <RightSidebar />
    </div>
  );
}

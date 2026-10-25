'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { sampleTopics, sampleAuthors } from '@/lib/sirat/sampleData';
import {
  Layers,
  Search,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle,
  PenTool,
  Bookmark,
  Users,
  Feather,
} from 'lucide-react';
import './topics.css';
import BlogNav from '@/components/sirat/layout/BlogNav';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'historical' | 'thematic'

  // Total stats calculation
  const totalArticles = useMemo(() => {
    return sampleTopics.reduce((acc, t) => acc + (t.articleCount || 0), 0);
  }, []);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return sampleTopics.filter((topic) => {
      const matchesTab =
        activeTab === 'all' || topic.category === activeTab;
      const matchesSearch =
        !searchQuery.trim() ||
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (topic.tags && topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="w-full max-w-[800px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      {/* Blog Desktop Tab Navigation */}
      <BlogNav />

      <div className="topics-hub">
          {/* 1. Islamic Hero Banner Card */}
          <div className="topics-hero">
            <div className="topics-hero__banner">
              <div className="topics-hero__pattern" />
              <div className="topics-hero__badge">
                <Layers size={13} />
                <span>সিরাত গবেষণার মূল ক্ষেত্রসমূহ</span>
              </div>
              <h1 className="topics-hero__title">
                সিরাত পর্ব ও শাস্ত্রীয় বিষয়শ্রেণী
              </h1>
              <p className="topics-hero__subtitle">
                রাসূলুল্লাহ ﷺ-এর পবিত্র নবুওয়াতী জীবন, শাশ্বত সুন্নাহ ও আলোকিত জীবনাদর্শের প্রামাণ্য ইলমী সংকলন। আপনার পছন্দের বিষয়টি নির্বাচন করে তাহকিককৃত প্রবন্ধসমূহ পাঠ করুন।
              </p>
            </div>

            {/* Quick Stats Strip */}
            <div className="topics-hero__stats">
              <div className="topics-hero__stat-item">
                <BookOpen size={14} color="#065F46" />
                <span><strong>{toBanglaNum(sampleTopics.length)}</strong> টি মূল বিষয়শ্রেণী</span>
              </div>
              <span className="topics-hero__stat-dot">•</span>
              <div className="topics-hero__stat-item">
                <Sparkles size={14} color="#D97706" />
                <span><strong>{toBanglaNum(totalArticles)}</strong>+ তাহকিককৃত প্রবন্ধ</span>
              </div>
              <span className="topics-hero__stat-dot">•</span>
              <div className="topics-hero__stat-item">
                <Users size={14} color="#1877F2" />
                <span><strong>{toBanglaNum(sampleAuthors.length)}</strong> জন বিশিষ্ট গবেষক</span>
              </div>
            </div>
          </div>

          {/* 2. Interactive Controls (Search & Categorized Tabs) */}
          <div className="topics-controls">
            {/* Search Input */}
            <div className="topics-search-bar">
              <Search size={16} color="#64748B" />
              <input
                type="text"
                className="topics-search-input"
                placeholder="বিষয়, পর্ব বা টপিক খুঁজুন (যেমন: মক্কী, আখলাক, হাদিস, ওহী)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}
                >
                  মুছুন
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="topics-tabs">
              <button
                type="button"
                className={`topics-tab-btn ${activeTab === 'all' ? 'topics-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span>সকল বিষয়</span>
                <span>({toBanglaNum(sampleTopics.length)})</span>
              </button>

              <button
                type="button"
                className={`topics-tab-btn ${activeTab === 'historical' ? 'topics-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('historical')}
              >
                <span>🕋 ঐতিহাসিক সিরাত পর্ব</span>
                <span>({toBanglaNum(sampleTopics.filter((t) => t.category === 'historical').length)})</span>
              </button>

              <button
                type="button"
                className={`topics-tab-btn ${activeTab === 'thematic' ? 'topics-tab-btn--active' : ''}`}
                onClick={() => setActiveTab('thematic')}
              >
                <span>🌿 শাস্ত্রীয় ও আত্মিক ক্ষেত্র</span>
                <span>({toBanglaNum(sampleTopics.filter((t) => t.category === 'thematic').length)})</span>
              </button>
            </div>
          </div>

          {/* 3. Featured Spotlight Card (When not searching) */}
          {!searchQuery && activeTab === 'all' && (
            <Link href="/blog/topics/akhlaq" className="topic-spotlight-card">
              <div className="topic-spotlight-left">
                <div className="topic-spotlight-icon">
                  🌿
                </div>
                <div className="topic-spotlight-info">
                  <div className="topic-spotlight-tag">
                    <Sparkles size={11} />
                    <span>বিশেষ নির্বাচিত বিষয়শ্রেণী</span>
                  </div>
                  <h3 className="topic-spotlight-title">
                    রাসূলুল্লাহ ﷺ-এর আখলাক ও শামায়েল
                  </h3>
                  <p className="topic-spotlight-desc">
                    নবীজী ﷺ-এর মহান চরিত্র মাহাত্ম্য, খুলুকে আযীম ও সৃষ্টির প্রতি তাঁর অপার দয়ার নির্বাচিত প্রামাণ্য আলোচনা।
                  </p>
                </div>
              </div>
              <div className="topic-spotlight-btn">
                <span>সরাসরি পাঠ করুন</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          )}

          {/* 4. Topics 2-Column Responsive Grid */}
          <div className="topics-grid">
            {filteredTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/blog/topics/${topic.slug}`}
                className="topic-card"
              >
                <div>
                  {/* Card Head */}
                  <div className="topic-card__head">
                    <div
                      className="topic-card__icon-box"
                      style={{ background: topic.gradient || 'linear-gradient(135deg, #065F46 0%, #047857 100%)' }}
                    >
                      {topic.icon}
                    </div>

                    <div className="topic-card__meta">
                      <span className="topic-card__category-badge">
                        {topic.categoryName || 'সিরাত গবেষণা'}
                      </span>
                      <h2 className="topic-card__title">
                        {topic.name}
                      </h2>
                    </div>
                  </div>

                  {/* Card Description */}
                  <p className="topic-card__desc">
                    {topic.description}
                  </p>

                  {/* Subtopics / Tags */}
                  {topic.tags && topic.tags.length > 0 && (
                    <div className="topic-card__tags">
                      {topic.tags.map((tag, idx) => (
                        <span key={idx} className="topic-card__tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="topic-card__footer">
                  <span className="topic-card__count-badge">
                    📚 {toBanglaNum(topic.articleCount)} টি প্রবন্ধ
                  </span>

                  <span className="topic-card__explore-btn">
                    <span>প্রবেশ করুন</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* No results fallback */}
          {filteredTopics.length === 0 && (
            <div
              className="fb-card"
              style={{
                textAlign: 'center',
                padding: '36px 20px',
                fontFamily: 'var(--font-kalpurush)',
              }}
            >
              <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
                "{searchQuery}" বিষয়ক কোনো ক্যাটাগরি পাওয়া যায়নি।
              </p>
            </div>
          )}

        </div>
      </div>
  );
}

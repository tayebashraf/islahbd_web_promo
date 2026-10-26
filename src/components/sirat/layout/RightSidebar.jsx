'use client';

import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/sirat/ui/Avatar';
import VerifiedBadge from '@/components/sirat/author/VerifiedBadge';
import { sampleAuthors, sampleTopics } from '@/lib/sirat/sampleData';
import { Sparkles, TrendingUp, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/sirat/auth';
import './rightsidebar.css';

export const RightSidebar = () => {
  const verifiedAuthors = sampleAuthors.filter((a) => a.isVerified);
  const { isWriter } = useAuth();

  return (
    <aside className="fb-right-sidebar fb-layout__right" aria-label="দৈনিক বাণী ও সক্রিয় গবেষকবৃন্দ">

      {/* Daily Hadith / Reflection Widget */}
      <div className="fb-right-widget">
        <div className="fb-right-widget__header">
          <span className="fb-right-widget__title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--color-brand-primary)" />
            <span>দৈনিক সিরাত বাণী</span>
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>আজকের ভাবনা</span>
        </div>
        <div className="fb-daily-hadith__arabic">
          إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الأَخْلَاقِ
        </div>
        <p className="fb-daily-hadith__text">
          "নিশ্চয়ই আমি সর্বোত্তম চরিত্রের পূর্ণতা বিধানের জন্যই প্রেরিত হয়েছি।"
        </p>
        <div className="fb-daily-hadith__ref">— মুসনাদে আহমাদ: ৮৯৫২</div>
      </div>

      {/* Active Scholars / Contacts */}
      <div className="fb-right-widget">
        <div className="fb-right-widget__header">
          <span className="fb-right-widget__title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="var(--color-brand-primary)" />
            <span>সম্মানিত লেখক ও গবেষক</span>
          </span>
          <Link
            href="/blog/authors"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-primary)', fontWeight: 'var(--weight-semibold)' }}
          >
            সব দেখুন
          </Link>
        </div>

        <div className="fb-contacts-list">
          {verifiedAuthors.map((author) => (
            <Link
              key={author.id}
              href={`/blog/authors/${author.id}`}
              className="fb-contact-item"
            >
              <div className="fb-contact-avatar-wrap">
                <Avatar
                  src={author.photoURL}
                  name={author.displayName}
                  size="sm"
                />
                <span className="fb-online-dot" />
              </div>
              <div className="fb-contact-info">
                <span className="fb-contact-name">
                  <span>{author.displayName}</span>
                  <VerifiedBadge size={9} showLabel={false} />
                </span>
                <span className="fb-contact-desc">{author.expertise}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Sirat Topics */}
      <div className="fb-right-widget">
        <div className="fb-right-widget__header">
          <span className="fb-right-widget__title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} color="var(--color-brand-primary)" />
            <span>জনপ্রিয় সিরাত পর্ব</span>
          </span>
        </div>
        <div className="fb-trending-tags">
          {sampleTopics.map((t) => (
            <Link key={t.id} href={`/blog/topics/${t.slug}`} className="fb-tag-pill">
              #{t.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;

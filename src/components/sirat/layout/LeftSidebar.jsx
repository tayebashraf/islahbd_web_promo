'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bookmark,
  BookOpen,
  Users,
  PenSquare,
  FileCheck,
  Info,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import Avatar from '@/components/sirat/ui/Avatar';
import { useAuth } from '@/lib/sirat/auth';
import { sampleTopics } from '@/lib/sirat/sampleData';
import './leftsidebar.css';

export const LeftSidebar = () => {
  const pathname = usePathname();
  const [avatarSrc, setAvatarSrc] = useState(null);
  const { user, userProfile, isWriter } = useAuth();

  const currentUser = {
    displayName: userProfile?.displayName || user?.displayName || 'মুফতী আব্দুল্লাহ',
    email: userProfile?.email || user?.email || 'abdullah@sirat.blog',
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

  return (
    <aside className="fb-left-sidebar fb-layout__left" aria-label="শর্টকাট ও নেভিগেশন">
      <div>
        {/* User profile shortcut */}
        <div className="fb-sidebar-group">
          <Link href="/blog/dashboard" className="fb-sidebar-item">
            <Avatar src={avatarSrc} name={currentUser.displayName} size="sm" />
            <span>{currentUser.displayName}</span>
          </Link>

          <Link
            href="/blog/bookmarks"
            className={`fb-sidebar-item ${pathname === '/blog/bookmarks' ? 'fb-sidebar-item--active' : ''}`}
          >
            <div className="fb-sidebar-icon-wrap" style={{ color: '#1877F2' }}>
              <Bookmark size={20} />
            </div>
            <span>সংরক্ষিত প্রবন্ধসমূহ</span>
          </Link>

          <Link
            href="/blog/authors"
            className={`fb-sidebar-item ${pathname === '/blog/authors' ? 'fb-sidebar-item--active' : ''}`}
          >
            <div className="fb-sidebar-icon-wrap" style={{ color: '#2D8A4E' }}>
              <Users size={20} />
            </div>
            <span>লেখক ও গবেষকবৃন্দ</span>
          </Link>

          <Link
            href="/dashboard/new"
            className={`fb-sidebar-item ${pathname === '/dashboard/new' ? 'fb-sidebar-item--active' : ''}`}
          >
            <div className="fb-sidebar-icon-wrap" style={{ color: '#FA383E' }}>
              <PenSquare size={20} />
            </div>
            <span>নতুন পোস্ট লিখুন</span>
          </Link>
        </div>

        <hr className="fb-sidebar-divider" />

        {/* Sirat Topics */}
        <div className="fb-sidebar-group">
          <div className="fb-sidebar-header">
            <span>সিরাত অনুষঙ্গ</span>
            <Link href="/blog/topics" className="fb-sidebar-see-all">
              সব দেখুন
            </Link>
          </div>

          {sampleTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/blog/topics/${topic.slug}`}
              className={`fb-sidebar-item ${pathname === `/topics/${topic.slug}` ? 'fb-sidebar-item--active' : ''}`}
            >
              <div className="fb-sidebar-topic-icon" style={{ backgroundColor: topic.color + '22', color: topic.color }}>
                {topic.icon || '📖'}
              </div>
              <div className="fb-sidebar-topic-text">
                <strong>{topic.name}</strong>
              </div>
            </Link>
          ))}
        </div>

        <hr className="fb-sidebar-divider" />

        {/* Platform Links */}
        <div className="fb-sidebar-group">
          <div className="fb-sidebar-header">
            <span>প্ল্যাটফর্ম</span>
          </div>

          {!isWriter && (
            <Link href="/blog/apply" className="fb-sidebar-item">
              <div className="fb-sidebar-icon-wrap" style={{ color: '#059669' }}>
                <FileCheck size={20} />
              </div>
              <span style={{ fontWeight: 700, color: '#059669' }}>লেখক হওয়ার আবেদন</span>
            </Link>
          )}

          <Link href="/blog/guidelines" className="fb-sidebar-item">
            <div className="fb-sidebar-icon-wrap" style={{ color: '#65676B' }}>
              <ShieldCheck size={20} />
            </div>
            <span>লেখার নীতিমালা</span>
          </Link>

          <Link href="/blog/about" className="fb-sidebar-item">
            <div className="fb-sidebar-icon-wrap" style={{ color: '#65676B' }}>
              <Info size={20} />
            </div>
            <span>আমাদের সম্পর্কে</span>
          </Link>
        </div>

        {/* Footer Meta */}
        <div className="fb-sidebar-footer">
          <p>© ২০২৬ ইসলাহ ব্লগ • রাসূলুল্লাহ ﷺ-এর জীবন ও আদর্শ</p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;

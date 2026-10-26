'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Home,
  BookOpen,
  Globe,
  Users,
  Bookmark,
  Sun,
  Moon,
  LogOut,
  PenSquare,
  LayoutDashboard,
  HelpCircle,
  Settings,
  Info,
  ChevronRight,
  Type,
  X,
  Bell,
  CheckCheck,
  Sparkles,
  Volume2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/sirat/auth';
import {
  subscribeToUserNotifications,
  markFirebaseNotificationAsRead,
  markAllFirebaseNotificationsAsRead,
  requestPushNotificationPermission,
  defaultMockNotifications,
} from '@/lib/sirat/notifications';
import Avatar from '@/components/sirat/ui/Avatar';
import './header.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, isWriter, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultMockNotifications);
  const [notificationTab, setNotificationTab] = useState('all'); // 'all' | 'unread'
  const [pushStatus, setPushStatus] = useState('default'); // 'default' | 'granted' | 'denied'
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [fontSize, setFontSize] = useState('normal');
  const settingsRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentUser = user || {
    uid: 'demo-user',
    displayName: 'মুফতী আব্দুল্লাহ',
    email: 'abdullah@example.com',
    role: 'writer',
    photoURL: null,
  };

  // Real-time Firebase Notification Listener
  useEffect(() => {
    const unsub = subscribeToUserNotifications(currentUser.uid, (list) => {
      if (list && list.length > 0) {
        setNotifications(list);
      }
    });
    return () => unsub && unsub();
  }, [currentUser.uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllFirebaseNotificationsAsRead(currentUser.uid, notifications);
  };

  const handleNotificationClick = async (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    await markFirebaseNotificationAsRead(currentUser.uid, item.id);
    setNotificationsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleEnablePush = async () => {
    const res = await requestPushNotificationPermission();
    if (res.status) {
      setPushStatus(res.status);
      if (res.status === 'granted') {
        alert('ইসলাহ ব্লগ পুশ নোটিফিকেশন সফলভাবে সক্রিয় করা হয়েছে!');
      }
    }
  };

  // Theme & Avatar Handling
  useEffect(() => {
    const storedTheme = localStorage.getItem('color-scheme') || 'light';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);

    const storedFont = localStorage.getItem('sirat_font_scale') || 'normal';
    setFontSize(storedFont);
    document.documentElement.setAttribute('data-font-size', storedFont);

    const updateAvatar = () => {
      const saved = localStorage.getItem('sirat_user_avatar');
      setAvatarSrc(saved || null);
    };

    updateAvatar();
    window.addEventListener('sirat_avatar_change', updateAvatar);
    return () => window.removeEventListener('sirat_avatar_change', updateAvatar);
  }, []);

  // Close settings and notifications on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('color-scheme', next);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = next;
  };

  const handleFontChange = (size) => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('sirat_font_scale', size);
  };

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleTabClick = (e, href) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleLogoClick = (e) => {
    if (pathname === '/blog') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const navTabs = [
    { href: '/', icon: <Globe size={23} />, title: 'ইসলাহ ওয়েব' },
    { href: '/blog', icon: <Home size={23} />, title: 'নিউজ ফিড' },
    { href: '/blog/bookmarks', icon: <Bookmark size={23} />, title: 'সংরক্ষিত প্রবন্ধসমূহ' },
    { href: '/blog/search', icon: <Search size={23} />, title: 'অনুসন্ধান' },
  ];

  return (
    <header className="sirat-app-header" role="banner">
      <div className="sirat-header-inner">
        {/* LEFT: Islah Blog Brand Logo & IslahBD Return Link */}
        <div className="sirat-header-left">
          <Link
            href="/blog"
            className="siratbook-brand-logo"
            title="ইসলাহ ব্লগ হোম (শীর্ষে যেতে ক্লিক করুন)"
            onClick={handleLogoClick}
          >
            <span className="siratbook-brand-text">ইসলাহ ব্লগ</span>
          </Link>
          <Link
            href="/"
            className="sirat-back-link"
            title="ইসলাহ প্রধান ড্যাশবোর্ডে ফিরে যান"
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              fontWeight: 700,
              backgroundColor: 'rgba(45, 138, 78, 0.1)',
              color: 'var(--color-islamic-green, #2D8A4E)',
              padding: '4px 10px',
              borderRadius: '20px',
              textDecoration: 'none',
              marginLeft: '8px',
              border: '1px solid rgba(45, 138, 78, 0.25)',
              transition: 'all 0.2s',
            }}>
              ← ইসলাহ
            </span>
          </Link>
        </div>

        {/* CENTER: 4 Equal Navigation Tabs */}
        <nav className="sirat-header-center" aria-label="প্রধান নেভিগেশন">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`sirat-equal-tab ${isActive ? 'sirat-equal-tab--active' : ''}`}
                title={tab.title}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleTabClick(e, tab.href)}
              >
                {tab.icon}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Actions (Search, Write, Notifications, Profile & Settings) */}
        <div className="sirat-header-right">
          {/* Search Trigger */}
          <button
            type="button"
            className={`sirat-circle-btn ${searchOpen ? 'sirat-circle-btn--active' : ''}`}
            onClick={() => setSearchOpen(!searchOpen)}
            title="অনুসন্ধান"
            aria-label="অনুসন্ধান"
          >
            <Search size={18} />
          </button>

          {/* Quick Post Button - ONLY for approved writers */}
          {isWriter && (
            <Link
              href="/dashboard/new"
              className="sirat-circle-btn"
              title="নতুন প্রবন্ধ বা দাওয়াত লিখুন"
              aria-label="লিখুন"
            >
              <PenSquare size={18} />
            </Link>
          )}

          {/* Notifications Trigger & Dropdown */}
          <div className="sirat-notifications-anchor" ref={notificationRef}>
            <button
              type="button"
              className={`sirat-circle-btn ${notificationsOpen ? 'sirat-circle-btn--active' : ''}`}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="নোটিফিকেশন"
              aria-expanded={notificationsOpen}
              aria-label="নোটিফিকেশন"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="sirat-notification-badge">
                  {toBanglaNum(unreadCount)}
                </span>
              )}
            </button>

            {/* Facebook-Grade Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div className="fb-notifications-menu scale-in" role="menu">
                <div className="fb-notifications-header">
                  <div className="fb-notifications-title-row">
                    <h3 className="fb-notifications-title">নোটিফিকেশন</h3>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="fb-notifications-mark-read"
                        onClick={markAllAsRead}
                        title="সবগুলো পঠিত হিসেবে চিহ্নিত করুন"
                      >
                        <CheckCheck size={14} />
                        <span>সব পঠিত করুন</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="fb-notifications-tabs">
                    <button
                      type="button"
                      className={`fb-notifications-tab ${notificationTab === 'all' ? 'fb-notifications-tab--active' : ''}`}
                      onClick={() => setNotificationTab('all')}
                    >
                      সকল ({toBanglaNum(notifications.length)})
                    </button>
                    <button
                      type="button"
                      className={`fb-notifications-tab ${notificationTab === 'unread' ? 'fb-notifications-tab--active' : ''}`}
                      onClick={() => setNotificationTab('unread')}
                    >
                      অপঠিত ({toBanglaNum(unreadCount)})
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="fb-notifications-list">
                  {notifications
                    .filter((n) => (notificationTab === 'unread' ? !n.read : true))
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`fb-notification-item ${!item.read ? 'fb-notification-item--unread' : ''}`}
                        onClick={() => handleNotificationClick(item)}
                      >
                        <div className="fb-notification-icon-box">
                          <span>{item.icon}</span>
                        </div>
                        <div className="fb-notification-content">
                          <p className="fb-notification-title">
                            <strong>{item.title}</strong>
                          </p>
                          {item.snippet && (
                            <p className="fb-notification-snippet">{item.snippet}</p>
                          )}
                          <span className="fb-notification-time">{item.time}</span>
                        </div>
                        {!item.read && <span className="fb-notification-unread-dot" />}
                      </div>
                    ))}

                  {notifications.filter((n) => (notificationTab === 'unread' ? !n.read : true)).length === 0 && (
                    <div className="fb-notifications-empty">
                      <span>কোনো নতুন নোটিফিকেশন নেই</span>
                    </div>
                  )}
                </div>

                {/* Firebase Push Notification Activation Footer */}
                <div className="fb-notifications-footer">
                  <button
                    type="button"
                    className="fb-notifications-push-btn"
                    onClick={handleEnablePush}
                    title="ব্রাউজার পুশ নোটিফিকেশন সক্রিয় করুন"
                  >
                    <Volume2 size={13} />
                    <span>{pushStatus === 'granted' ? 'পুশ নোটিফিকেশন চালু আছে ✓' : 'পুশ নোটিফিকেশন সক্রিয় করুন'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings & Profile Trigger */}
          <div className="sirat-settings-anchor" ref={settingsRef}>
            <button
              type="button"
              className={`sirat-settings-btn ${settingsOpen ? 'sirat-settings-btn--active' : ''}`}
              onClick={() => setSettingsOpen(!settingsOpen)}
              aria-expanded={settingsOpen}
              aria-label="সেটিংস ও প্রোফাইল মেনু"
              title="সেটিংস ও প্রোফাইল"
            >
              <Avatar
                src={avatarSrc || currentUser.photoURL}
                name={currentUser.displayName}
                size="sm"
              />
              <span className="sirat-gear-badge">
                <Settings size={10} />
              </span>
            </button>

            {/* Facebook-Grade Settings & Profile Drawer */}
            {settingsOpen && (
              <div className="fb-settings-menu scale-in" role="menu">
                {/* 1. User Profile Header */}
                <Link
                  href="/blog/dashboard"
                  className="fb-settings-profile-card"
                  onClick={() => setSettingsOpen(false)}
                >
                  <Avatar
                    src={avatarSrc || currentUser.photoURL}
                    name={currentUser.displayName}
                    size="md"
                  />
                  <div className="fb-settings-profile-meta">
                    <span className="fb-settings-name">{currentUser.displayName}</span>
                    <span className="fb-settings-email">{currentUser.email}</span>
                    {isWriter ? (
                      <span className="fb-settings-writer-badge">
                        <ShieldCheck size={12} />
                        <span>তাহকিক লেখক ও গবেষক</span>
                      </span>
                    ) : isPendingWriter ? (
                      <span className="fb-settings-pending-badge">
                        <Clock size={12} />
                        <span>লেখক আবেদন বিবেচনাধীন</span>
                      </span>
                    ) : (
                      <span className="fb-settings-reader-badge">
                        <span>সম্মানিত পাঠক</span>
                      </span>
                    )}
                  </div>
                </Link>

                <div className="fb-settings-divider" />

                {/* 2. Theme Toggle Mode */}
                <div className="fb-settings-row">
                  <div className="fb-settings-row-label">
                    <span className="fb-settings-row-title">ডার্ক মোড</span>
                    <span className="fb-settings-row-desc">চোখের আরামদায়ক প্রদর্শন</span>
                  </div>
                  <button
                    type="button"
                    className={`fb-toggle-switch ${theme === 'dark' ? 'fb-toggle-switch--active' : ''}`}
                    onClick={handleThemeToggle}
                    aria-label="ডার্ক মোড পরিবর্তন"
                  >
                    <div className="fb-toggle-thumb">
                      {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                    </div>
                  </button>
                </div>

                <div className="fb-settings-divider" />

                {/* 3. Bengali Font Scaling Control */}
                <div className="fb-settings-font-box">
                  <span className="fb-settings-row-title">বাংলা লেখার আকার</span>
                  <div className="fb-font-pills-row">
                    <button
                      type="button"
                      className={`fb-font-pill ${fontSize === 'small' ? 'fb-font-pill--active' : ''}`}
                      onClick={() => handleFontChange('small')}
                    >
                      ছোট
                    </button>
                    <button
                      type="button"
                      className={`fb-font-pill ${fontSize === 'normal' ? 'fb-font-pill--active' : ''}`}
                      onClick={() => handleFontChange('normal')}
                    >
                      স্বাভাবিক
                    </button>
                    <button
                      type="button"
                      className={`fb-font-pill ${fontSize === 'large' ? 'fb-font-pill--active' : ''}`}
                      onClick={() => handleFontChange('large')}
                    >
                      বড়
                    </button>
                  </div>
                </div>

                <div className="fb-settings-divider" />

                {/* 4. Navigation & Shortcuts */}
                <div className="fb-settings-links-list">

                  {isWriter && (
                    <>
                      <Link
                        href="/dashboard/new"
                        className="fb-settings-link"
                        onClick={() => setSettingsOpen(false)}
                      >
                        <PenSquare size={17} color="var(--color-brand-primary)" />
                        <span>নতুন প্রবন্ধ ও পোস্ট লিখুন</span>
                        <ChevronRight size={15} className="fb-settings-arrow" />
                      </Link>

                      <Link
                        href="/blog/dashboard"
                        className="fb-settings-link"
                        onClick={() => setSettingsOpen(false)}
                      >
                        <FileText size={17} color="var(--color-text-secondary)" />
                        <span>আমার ড্যাশবোর্ড ও পোস্টসমূহ</span>
                        <ChevronRight size={15} className="fb-settings-arrow" />
                      </Link>
                    </>
                  )}

                  <Link
                    href="/blog/bookmarks"
                    className="fb-settings-link"
                    onClick={() => setSettingsOpen(false)}
                  >
                    <Bookmark size={17} color="var(--color-text-secondary)" />
                    <span>সংরক্ষিত প্রবন্ধসমূহ</span>
                    <ChevronRight size={15} className="fb-settings-arrow" />
                  </Link>

                  <Link
                    href="/blog/guidelines"
                    className="fb-settings-link"
                    onClick={() => setSettingsOpen(false)}
                  >
                    <HelpCircle size={17} color="#059669" />
                    <span>নীতিমালা ও সহায়তা</span>
                    <ChevronRight size={15} className="fb-settings-arrow" />
                  </Link>

                  <Link
                    href="/blog/about"
                    className="fb-settings-link"
                    onClick={() => setSettingsOpen(false)}
                  >
                    <Info size={17} color="var(--color-text-secondary)" />
                    <span>ইসলাহ ব্লগ সম্পর্কে</span>
                    <ChevronRight size={15} className="fb-settings-arrow" />
                  </Link>
                </div>

                <div className="fb-settings-divider" />

                {/* 5. Logout */}
                <button
                  type="button"
                  className="fb-settings-logout-btn"
                  onClick={() => {
                    signOut();
                    setSettingsOpen(false);
                  }}
                >
                  <LogOut size={17} />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sleek Search Overlay */}
      {searchOpen && (
        <div className="fb-search-overlay-bar fade-in">
          <form onSubmit={handleSearchSubmit} className="fb-search-overlay-form">
            <Search size={17} color="var(--color-text-tertiary)" />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="ইসলাহ ব্লগে হাদিস, সিরাত বা লেখক অনুসন্ধান করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="অনুসন্ধান"
            />
            <button
              type="button"
              className="fb-search-close-btn"
              onClick={() => setSearchOpen(false)}
              aria-label="অনুসন্ধান বন্ধ করুন"
            >
              <X size={16} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

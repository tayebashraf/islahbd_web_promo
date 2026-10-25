'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
  Printer,
  Sparkles,
  Search,
  Check,
  AlertCircle,
  ExternalLink,
  Phone,
  Ban,
  Unlock,
  Award,
  FileText,
  Save,
  Bell,
  Heart,
  BarChart3,
  UserCheck,
  Edit3,
  MousePointerClick,
  Share2,
  Bookmark,
  MessageSquare,
  Layers,
  Compass,
  Inbox,
  Send,
  Lock,
  KeyRound,
  EyeOff,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/components/sirat/ui/ToastContext';
import { sampleAuthors, sampleTopics } from '@/lib/sirat/sampleData';
import Modal from '@/components/sirat/ui/Modal';
import Button from '@/components/sirat/ui/Button';
import FeedbackConsultationBox from '@/components/sirat/layout/FeedbackConsultationBox';
import './admin.css';

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'applications' | 'articles' | 'quizzes' | 'customization'

  // Data states
  const [applications, setApplications] = useState([]);
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [authorStats, setAuthorStats] = useState([]);
  const [clickStats, setClickStats] = useState({
    totalClicks: 43520,
    jazakallahClicks: 12450,
    duroodClicks: 18450,
    bookmarkClicks: 4120,
    shareClicks: 2890,
    quizAttemptsClicks: 3670,
    commentRepliesClicks: 1940,
  });
  const [topicViewsStats, setTopicViewsStats] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [settings, setSettings] = useState({
    siteName: 'সীরাত.ব্লগ',
    tagline: 'রাসূলুল্লাহ ﷺ-এর পুণ্যময় জীবনচরিত ও বিশুদ্ধ জ্ঞানভিত্তিক তাহকিক সংকলন',
    announcementActive: true,
    announcementText: '📢 মাশাআল্লাহ! পবিত্র রবিউল আউয়াল উপলক্ষে বিশেষ সিরাত রচনা প্রতিযোগিতা ও তাহকিক লেখক রেজিস্ট্রেশন চলছে।',
    announcementLink: '/apply',
    writerApplicationsOpen: true,
    strictHadithReferences: true,
    duroodDailyGoal: 25000,
    currentDuroodCount: 18450,
    autoModerateComments: true,
    contactPhone: '+8801718763978',
    contactDisplayPhone: '০১৭১৮-৭৬৩৯৭৮',
  });

  // Filter & Search states
  const [appFilter, setAppFilter] = useState('all');
  const [articleFilter, setArticleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [printDossierModalOpen, setPrintDossierModalOpen] = useState(false);

  // Ban Modal
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [banReasonInput, setBanReasonInput] = useState('');

  // Edit Phone / Role Modal
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editPhoneInput, setEditPhoneInput] = useState('');
  const [editRoleInput, setEditRoleInput] = useState('reader');

  // Admin Article Edit & Delete Modals
  const [editArticleModalOpen, setEditArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [adminEditTitle, setAdminEditTitle] = useState('');
  const [adminEditSubtitle, setAdminEditSubtitle] = useState('');
  const [adminEditContent, setAdminEditContent] = useState('');
  const [adminEditTopicSlug, setAdminEditTopicSlug] = useState('seerah-basics');
  const [adminEditReference, setAdminEditReference] = useState('');
  const [deleteArticleModalOpen, setDeleteArticleModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const [loading, setLoading] = useState(true);
  const { success, error, info } = useToast();

  // Admin Security Gate State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Check existing session authorization on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem('sirat_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthorized(true);
      }
      setAuthChecked(true);
    }
  }, []);

  // Load all admin data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [appRes, artRes, userRes, setRes, statRes] = await Promise.all([
        fetch('/api/admin/applications'),
        fetch('/api/admin/articles'),
        fetch('/api/admin/users'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/analytics'),
      ]);

      const [appData, artData, userData, setData, statData] = await Promise.all([
        appRes.json(),
        artRes.json(),
        userRes.json(),
        setRes.json(),
        statRes.json(),
      ]);

      if (appData.success) setApplications(appData.applications || []);
      if (artData.success) setArticles(artData.articles || []);
      if (userData.success) setUsers(userData.users || []);
      if (setData.success) setSettings(setData.settings || {});
      if (statData.success) {
        setAuthorStats(statData.authors || []);
        if (statData.clickAnalytics) setClickStats(statData.clickAnalytics);
        if (statData.topicInterestAnalytics) setTopicViewsStats(statData.topicInterestAnalytics);
        if (statData.feedbackList) setFeedbackList(statData.feedbackList);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadAdminData();
    }
  }, [isAuthorized]);

  // Handle PIN / Secret Password Verification
  const handleVerifyPin = (e) => {
    e?.preventDefault();
    setPinError('');

    const cleanPin = pinInput.trim().toLowerCase();
    const VALID_PINS = ['763978', '01718763978', 'admin1234', 'sirat2026', '123456'];

    if (VALID_PINS.includes(cleanPin)) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sirat_admin_auth', 'true');
      }
      setIsAuthorized(true);
      success('✨ আলহামদুলিল্লাহ! প্রধান অ্যাডমিন প্যানেল সফলভাবে উন্মুক্ত হয়েছে।');
    } else {
      setPinError('ভুল পিন বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক অ্যাডমিন পিন প্রদান করুন।');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      error('ভুল পিন বা পাসওয়ার্ড প্রদান করা হয়েছে');
    }
  };

  // Handle Lock Admin Session
  const handleLockAdmin = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sirat_admin_auth');
    }
    setIsAuthorized(false);
    setPinInput('');
    info('🔒 অ্যাডমিন প্যানেল সুরক্ষিতভাবে লক করা হয়েছে।');
  };

  // Handle Application Status Update
  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === appId || app.applicationId === appId ? { ...app, status: newStatus } : app
          )
        );
        if (selectedApp && (selectedApp.id === appId || selectedApp.applicationId === appId)) {
          setSelectedApp((prev) => ({ ...prev, status: newStatus }));
        }

        if (newStatus === 'approved') {
          const targetApp = applications.find((a) => a.id === appId || a.applicationId === appId) || selectedApp;
          if (targetApp) {
            localStorage.setItem('sirat_writer_approved', 'true');
            localStorage.setItem('sirat_approved_author_name', targetApp.fullName || 'অনুমোদিত গবেষক');
            const approvedAuthor = {
              uid: targetApp.uid || `writer_${Date.now()}`,
              displayName: targetApp.fullName || 'অনুমোদিত সিরাত গবেষক',
              email: targetApp.email || 'author@sirat.blog',
              phone: targetApp.phone || '',
              role: 'writer',
              isWriter: true,
              isVerified: true,
              writerStatus: 'approved',
              institution: targetApp.institution || '',
              expertise: targetApp.department || 'সিরাত গবেষক ও তাহকিক লেখক',
            };
            localStorage.setItem('sirat_demo_user', JSON.stringify(approvedAuthor));
            window.dispatchEvent(new Event('sirat_auth_update'));

            // Also add/update in users state
            setUsers((prevUsers) => {
              const exists = prevUsers.some((u) => u.displayName === targetApp.fullName || u.email === targetApp.email);
              if (exists) {
                return prevUsers.map((u) =>
                  u.displayName === targetApp.fullName || u.email === targetApp.email
                    ? { ...u, role: 'writer', isWriter: true, isVerified: true, writerStatus: 'approved' }
                    : u
                );
              }
              return [approvedAuthor, ...prevUsers];
            });
          }
        }

        success(`আবেদনটি সফলভাবে '${newStatus === 'approved' ? 'অনুমোদিত' : newStatus === 'under_review' ? 'পর্যালোচনাধীন' : 'প্রত্যাখ্যাত'}' করা হয়েছে।`);
      } else {
        error(data.error || 'আপডেট করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    }
  };


  // Handle User Ban / Unban
  const handleBanUserSubmit = async () => {
    if (!userToBan) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: userToBan.uid,
          action: 'ban',
          isBanned: true,
          banReason: banReasonInput || 'প্রশাসনিক সিদ্ধান্তে অ্যাকাউন্ট সাময়িক স্থগিত',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.uid === userToBan.uid
              ? { ...u, isBanned: true, banReason: banReasonInput || 'প্রশাসনিক সিদ্ধান্তে অ্যাকাউন্ট সাময়িক স্থগিত' }
              : u
          )
        );
        setBanModalOpen(false);
        setUserToBan(null);
        setBanReasonInput('');
        success('ইউজারকে সফলভাবে ব্যান ও স্থগিত করা হয়েছে।');
      } else {
        error(data.error || 'ব্যান করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    }
  };

  const handleUnbanUser = async (user) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          action: 'ban',
          isBanned: false,
          banReason: '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.uid === user.uid ? { ...u, isBanned: false, banReason: '' } : u))
        );
        success('ইউজারের ব্যান তুলে নেওয়া হয়েছে।');
      } else {
        error(data.error || 'আনব্যান করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    }
  };

  // Handle Edit Phone & Role
  const handleEditUserSubmit = async () => {
    if (!editingUser) return;
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: editingUser.uid,
          action: 'update_phone',
          phone: editPhoneInput,
        }),
      });

      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: editingUser.uid,
          action: 'update_role',
          role: editRoleInput,
        }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.uid === editingUser.uid
            ? {
                ...u,
                phone: editPhoneInput,
                role: editRoleInput,
                isWriter: editRoleInput === 'writer' || editRoleInput === 'scholar' || editRoleInput === 'admin',
              }
            : u
        )
      );

      setEditUserModalOpen(false);
      setEditingUser(null);
      success('ইউজারের ফোন ও পদবী সফলভাবে আপডেট করা হয়েছে।');
    } catch (err) {
      error('আপডেট করতে ব্যর্থ হয়েছে');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        success('প্ল্যাটফর্ম কাস্টমাইজেশন ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
      } else {
        error(data.error || 'সংরক্ষণ করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    }
  };

  // Handle Admin Article Edit
  const handleAdminSaveArticle = async (e) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      const updatedFields = {
        title: adminEditTitle.trim(),
        subtitle: adminEditSubtitle.trim(),
        content: adminEditContent.trim(),
        topicSlug: adminEditTopicSlug,
        excerpt: adminEditSubtitle.trim() || adminEditContent.trim().slice(0, 150) + '...',
      };

      if (editingArticle.quoteData) {
        updatedFields.quoteData = {
          ...editingArticle.quoteData,
          text: adminEditContent.trim(),
          reference: adminEditReference.trim(),
        };
      }

      const res = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingArticle.id,
          ...updatedFields,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setArticles((prev) =>
          prev.map((art) => (art.id === editingArticle.id ? { ...art, ...updatedFields } : art))
        );
        setEditArticleModalOpen(false);
        setEditingArticle(null);
        success('প্রবন্ধটি সফলভাবে অ্যাডমিন প্যানেল থেকে সম্পাদনা করা হয়েছে।');
      } else {
        error(data.error || 'আপডেট করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    }
  };

  // Handle Admin Article Delete
  const handleAdminDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      const res = await fetch(`/api/articles?id=${encodeURIComponent(articleToDelete.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((art) => art.id !== articleToDelete.id));
        setDeleteArticleModalOpen(false);
        setArticleToDelete(null);
        success('প্রবন্ধটি সফলভাবে সাইট ও ডাটাবেজ থেকে মুছে ফেলা হয়েছে।');
      } else {
        error(data.error || 'মুছতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      userFilter === 'all'
        ? true
        : userFilter === 'banned'
        ? Boolean(u.isBanned)
        : userFilter === 'writer'
        ? u.isWriter || u.role === 'writer' || u.role === 'scholar'
        : userFilter === 'reader'
        ? u.role === 'reader' && !u.isWriter
        : true;

    const matchesSearch =
      !searchQuery ||
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesFilter = appFilter === 'all' || app.status === appFilter;
    const matchesSearch =
      !searchQuery ||
      app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Articles
  const filteredArticles = articles.filter((art) => {
    const matchesFilter =
      articleFilter === 'all'
        ? true
        : articleFilter === 'quiz'
        ? Boolean(art.quizData)
        : articleFilter === 'quote'
        ? Boolean(art.quoteData)
        : art.status === articleFilter;
    const matchesSearch =
      !searchQuery ||
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.authorName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalViewsCalculated = users.reduce((sum, u) => sum + (u.totalViews || 0), 0);
  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;
  const bannedUsersCount = users.filter((u) => u.isBanned).length;
  const writersCount = users.filter((u) => u.isWriter || u.role === 'writer' || u.role === 'scholar').length;
  const readersCount = users.filter((u) => u.role === 'reader' && !u.isWriter).length;

  if (!authChecked) {
    return (
      <div className="admin-clean-login-wrapper">
        <div className="admin-clean-spinner">
          <ShieldCheck size={32} color="#047857" />
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="admin-clean-login-wrapper">
        <div className={`admin-clean-login-card fade-in ${isShaking ? 'admin-clean-shake' : ''}`}>
          <div className="admin-clean-brand">
            <div className="admin-clean-logo">
              <ShieldCheck size={26} color="#047857" />
            </div>
            <h1 className="admin-clean-title">অ্যাডমিন প্যানেল</h1>
            <p className="admin-clean-sub">
              সুপার অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে গোপন পিন বা পাসওয়ার্ড দিন
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="admin-clean-form">
            <div className="admin-clean-field">
              <label className="admin-clean-label">গোপন পিন / পাসওয়ার্ড</label>
              <div className="admin-clean-input-wrap">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError('');
                  }}
                  placeholder="পিন লিখুন (যেমন: 763978)"
                  className={`admin-clean-input ${pinError ? 'admin-clean-input--error' : ''}`}
                  autoFocus
                />
                <button
                  type="button"
                  className="admin-clean-eye"
                  onClick={() => setShowPin(!showPin)}
                  tabIndex={-1}
                  title={showPin ? 'লুকান' : 'দেখুন'}
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pinError && (
                <div className="admin-clean-error fade-in">
                  <AlertCircle size={13} color="#DC2626" />
                  <span>{pinError}</span>
                </div>
              )}
            </div>

            <button type="submit" className="admin-clean-submit">
              <span>লগইন করুন</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="admin-clean-footer">
            <Link href="/blog" className="admin-clean-back">
              ← মূল সাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="admin-wrapper">
      {/* Top Banner Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 className="admin-brand-title">সীরাত.ব্লগ — প্রধান প্রশাসনিক ও তাহকিক কন্ট্রোল প্যানেল</h1>
              <div className="admin-brand-sub">
                سِيرَة.كوم • সার্বজনীন কাস্টমাইজেশন, ইউজার মনিটরিং ও তাহকিক গবেষণা প্ল্যাটফর্ম
              </div>
            </div>
          </div>

          <div className="admin-header-actions">
            <div className="admin-live-badge">
              <span className="admin-live-dot" />
              <span>লাইভ অ্যাডমিন সেশন</span>
            </div>
            <button
              type="button"
              onClick={handleLockAdmin}
              className="admin-btn-lock"
              title="অ্যাডমিন প্যানেল সুরক্ষিতভাবে লক করুন"
            >
              <Lock size={14} />
              <span>লক করুন</span>
            </button>
            <Link href="/blog" className="admin-btn-light">
              <ExternalLink size={14} />
              <span>মূল সাইট দেখুন</span>
            </Link>
          </div>
        </div>
      </header>


      {/* Main Container */}
      <div className="admin-container">
        {/* Metrics Grid */}
        <div className="admin-metrics-grid">
          <div className="admin-metric-card">
            <div className="admin-metric-icon-box admin-metric-icon-blue">
              <Eye size={22} />
            </div>
            <div>
              <div className="admin-metric-value">{toBanglaNum(totalViewsCalculated)}</div>
              <div className="admin-metric-label">মোট প্রবন্ধ পাঠ ও ভিউ সংখ্যা</div>
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-icon-box admin-metric-icon-amber">
              <Users size={22} />
            </div>
            <div>
              <div className="admin-metric-value">{toBanglaNum(users.length)}</div>
              <div className="admin-metric-label">নিবন্ধিত মোবাইল অ্যাকাউন্ট</div>
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-icon-box admin-metric-icon-emerald">
              <Award size={22} />
            </div>
            <div>
              <div className="admin-metric-value">{toBanglaNum(writersCount)}</div>
              <div className="admin-metric-label">অনুমোদিত গবেষক ও লেখক</div>
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-icon-box admin-metric-icon-purple">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="admin-metric-value">{toBanglaNum(settings.currentDuroodCount || 18450)}</div>
              <div className="admin-metric-label">মোট সংগৃহীত দরূদ শরীফ</div>
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-icon-box admin-metric-icon-red">
              <Ban size={22} />
            </div>
            <div>
              <div className="admin-metric-value">{toBanglaNum(bannedUsersCount)}</div>
              <div className="admin-metric-label">স্থগিত / ব্যানড একাউন্ট</div>
            </div>
          </div>
        </div>

        {/* 6 Tabs Navigation */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={16} />
            <span>এনালিটিক্স ও প্রবৃদ্ধি</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>ইউজার ও ফোন ডিরেক্টরি</span>
            <span className="admin-tab-count">{toBanglaNum(users.length)}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <ShieldCheck size={16} />
            <span>লেখক ও গবেষক আবেদন</span>
            {pendingAppsCount > 0 && <span className="admin-tab-count">{toBanglaNum(pendingAppsCount)}</span>}
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            <BookOpen size={16} />
            <span>প্রবন্ধ ও পোস্ট মনিটরিং</span>
            <span className="admin-tab-count">{toBanglaNum(articles.length)}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <HelpCircle size={16} />
            <span>সিরাত কুইজ কন্ট্রোল</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'customization' ? 'active' : ''}`}
            onClick={() => setActiveTab('customization')}
          >
            <Sliders size={16} />
            <span>সাইট কাস্টমাইজেশন ও পলিসি</span>
          </button>
        </div>

        {/* ============================================================
            TAB 1: ANALYTICS & GROWTH
           ============================================================ */}
        {activeTab === 'analytics' && (
          <div className="admin-analytics-container">
            {/* Section 1: User Breakdown & Core Overview */}
            <div className="admin-content-card" style={{ marginBottom: '24px' }}>
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  <Users size={20} color="#047857" />
                  <span>ব্যবহারকারী ও পাঠক শ্রেণিবিভাগ (User Breakdown & Statistics)</span>
                </h2>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
                প্ল্যাটফর্মে নিবন্ধিত মোট ব্যবহারকারী, সাধারণ পাঠক এবং অনুমোদিত লেখকদের স্পষ্ট অনুপাত:
              </p>

              <div className="admin-user-breakdown-grid">
                <div className="admin-breakdown-card admin-breakdown-card--readers">
                  <div className="admin-breakdown-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="admin-breakdown-info">
                    <div className="admin-breakdown-label">শুধুমাত্র সাধারণ পাঠক (Pure Readers)</div>
                    <div className="admin-breakdown-count">
                      {toBanglaNum(users.filter((u) => u.role === 'reader' && !u.isWriter).length || 4320)} জন
                    </div>
                    <div className="admin-breakdown-note">যারা শুধুমাত্র প্রবন্ধ ও সিরাত চর্চা করছেন</div>
                  </div>
                  <span className="admin-breakdown-badge">৮৯% পাঠক</span>
                </div>

                <div className="admin-breakdown-card admin-breakdown-card--writers">
                  <div className="admin-breakdown-icon">
                    <Award size={24} />
                  </div>
                  <div className="admin-breakdown-info">
                    <div className="admin-breakdown-label">অনুমোদিত লেখক ও গবেষক (Approved Authors)</div>
                    <div className="admin-breakdown-count">
                      {toBanglaNum(users.filter((u) => u.isWriter || u.role === 'writer' || u.role === 'scholar').length || 48)} জন
                    </div>
                    <div className="admin-breakdown-note">যাদের তাহকিক প্রবন্ধ রচনার অনুমোদন রয়েছে</div>
                  </div>
                  <span className="admin-breakdown-badge admin-breakdown-badge--gold">ভেরিফাইড</span>
                </div>

                <div className="admin-breakdown-card admin-breakdown-card--pending">
                  <div className="admin-breakdown-icon">
                    <Clock size={24} />
                  </div>
                  <div className="admin-breakdown-info">
                    <div className="admin-breakdown-label">অপেক্ষমান লেখক আবেদন</div>
                    <div className="admin-breakdown-count">
                      {toBanglaNum(pendingAppsCount || 12)} জন
                    </div>
                    <div className="admin-breakdown-note">তাহকিক কমিটি কর্তৃক পর্যালোচনার অপেক্ষায়</div>
                  </div>
                  <span className="admin-breakdown-badge admin-breakdown-badge--amber">পেন্ডিং</span>
                </div>

                <div className="admin-breakdown-card admin-breakdown-card--clicks">
                  <div className="admin-breakdown-icon">
                    <MousePointerClick size={24} />
                  </div>
                  <div className="admin-breakdown-info">
                    <div className="admin-breakdown-label">সর্বমোট পাঠক ক্লিক ও এনগেজমেন্ট</div>
                    <div className="admin-breakdown-count">
                      {toBanglaNum(clickStats.totalClicks || 43520)} বার
                    </div>
                    <div className="admin-breakdown-note">জাযাকাল্লাহ, দরূদ, বুকমার্ক ও শেয়ারসহ মোট ইন্টারঅ্যাকশন</div>
                  </div>
                  <span className="admin-breakdown-badge admin-breakdown-badge--blue">সক্রিয়</span>
                </div>
              </div>
            </div>

            {/* Section 2: Engagement & Click Tracking Breakdown (কে কত ক্লিক করেছেন) */}
            <div className="admin-content-card" style={{ marginBottom: '24px' }}>
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  <MousePointerClick size={20} color="#047857" />
                  <span>পাঠক ক্লিক ও এনগেজমেন্ট অ্যানালিটিক্স (কে কত ক্লিক করেছেন)</span>
                </h2>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                পাঠকরা কোন বাটন ও ফিচারে সবচেয়ে বেশি ক্লিক ও ইন্টারঅ্যাক্ট করছেন তার সুনির্দিষ্ট পরিসংখ্যান:
              </p>

              <div className="admin-clicks-grid">
                <div className="admin-click-pill-card">
                  <div className="admin-click-pill-icon" style={{ backgroundColor: '#FDF2F8', color: '#DB2777' }}>
                    <Heart size={20} />
                  </div>
                  <div>
                    <div className="admin-click-pill-val">{toBanglaNum(clickStats.jazakallahClicks || 12450)}</div>
                    <div className="admin-click-pill-label">💖 জাযাকাল্লাহ ক্লিক</div>
                  </div>
                </div>

                <div className="admin-click-pill-card">
                  <div className="admin-click-pill-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="admin-click-pill-val">{toBanglaNum(clickStats.duroodClicks || 18450)}</div>
                    <div className="admin-click-pill-label">🌸 দরূদ শরীফ প্রেরণ ক্লিক</div>
                  </div>
                </div>

                <div className="admin-click-pill-card">
                  <div className="admin-click-pill-icon" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                    <Bookmark size={20} />
                  </div>
                  <div>
                    <div className="admin-click-pill-val">{toBanglaNum(clickStats.bookmarkClicks || 4120)}</div>
                    <div className="admin-click-pill-label">🔖 বুকমার্ক ও সেভ ক্লিক</div>
                  </div>
                </div>

                <div className="admin-click-pill-card">
                  <div className="admin-click-pill-icon" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                    <Share2 size={20} />
                  </div>
                  <div>
                    <div className="admin-click-pill-val">{toBanglaNum(clickStats.shareClicks || 2890)}</div>
                    <div className="admin-click-pill-label">📤 শেয়ার ও লিংক কপি</div>
                  </div>
                </div>

                <div className="admin-click-pill-card">
                  <div className="admin-click-pill-icon" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <div className="admin-click-pill-val">{toBanglaNum(clickStats.quizAttemptsClicks || 3670)}</div>
                    <div className="admin-click-pill-label">🎯 সিরাত কুইজে অংশগ্রহণ</div>
                  </div>
                </div>

                <div className="admin-click-pill-card">
                  <div className="admin-click-pill-icon" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="admin-click-pill-val">{toBanglaNum(clickStats.commentRepliesClicks || 1940)}</div>
                    <div className="admin-click-pill-label">💬 মন্তব্য ও আরজ প্রদান</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Topic & Content Popularity Trends (কে কোন জিনিসটা বেশি দেখতেছেন) */}
            <div className="admin-content-card" style={{ marginBottom: '24px' }}>
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  <TrendingUp size={20} color="#047857" />
                  <span>জনপ্রিয় বিষয় ও পাঠক আগ্রহ ট্র্যাকিং (কোন জিনিসটা বেশি দেখতেছেন)</span>
                </h2>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
                পাঠকরা কোন বিষয়ের পোস্টগুলোতে সবচেয়ে বেশি সময় ব্যয় করছেন ও বেশি ভিউ হচ্ছে:
              </p>

              <div className="admin-topic-interest-list">
                {(topicViewsStats.length > 0
                  ? topicViewsStats
                  : [
                      { topicName: 'মক্কী জীবন ও নবুওয়াত', percentage: 32, totalViews: 35400, clicks: 8420, color: '#047857' },
                      { topicName: 'মাদানী জীবন ও ইসলামী রাষ্ট্রনীতি', percentage: 26, totalViews: 28900, clicks: 6300, color: '#059669' },
                      { topicName: 'শামায়েল ও চারিত্রিক সৌন্দর্য', percentage: 20, totalViews: 22100, clicks: 5100, color: '#D97706' },
                      { topicName: 'সিরাত কুইজ ও প্রতিযোগিতা', percentage: 13, totalViews: 14300, clicks: 3670, color: '#2563EB' },
                      { topicName: 'সাহাবায়ে কেরাম ও ঐতিহাসিক সন্ধি', percentage: 9, totalViews: 10200, clicks: 2400, color: '#7C3AED' },
                    ]
                ).map((item, idx) => (
                  <div key={idx} className="admin-topic-interest-item">
                    <div className="admin-topic-interest-header">
                      <span className="admin-topic-interest-name">
                        <strong>#{toBanglaNum(idx + 1)} {item.topicName}</strong>
                      </span>
                      <span className="admin-topic-interest-stats">
                        <span>👁️ {toBanglaNum(item.totalViews)} ভিউ</span>
                        <span>👆 {toBanglaNum(item.clicks)} ক্লিক</span>
                        <strong style={{ color: item.color }}>{toBanglaNum(item.percentage)}% পাঠক</strong>
                      </span>
                    </div>
                    <div className="admin-topic-progress-bar-bg">
                      <div
                        className="admin-topic-progress-bar-fill"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Author Performance Leaderboard */}
            <div className="admin-content-card" style={{ marginBottom: '24px' }}>
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  <Award size={20} color="#047857" />
                  <span>লেখক পারফরম্যান্স ও পোস্ট ভিউ লিডারবোর্ড</span>
                </h2>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                কোন লেখক কতটা পোস্ট করেছেন, কতজন পাঠক তাদের লেখা পড়েছেন এবং সংগৃহীত দরূদ ও পাঠক এনগেজমেন্টের পূর্ণাঙ্গ চিত্র:
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-author-table">
                  <thead>
                    <tr>
                      <th>লেখক ও গবেষকের নাম</th>
                      <th>প্রতিষ্ঠান</th>
                      <th>মোবাইল নম্বর</th>
                      <th>মোট পোস্ট</th>
                      <th>মোট ভিউ (পাঠক)</th>
                      <th>দরূদ সংখ্যা</th>
                      <th>পদবী ও মর্যাদা</th>
                      <th>অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorStats.map((author) => (
                      <tr key={author.uid}>
                        <td>
                          <strong>{author.name}</strong>
                        </td>
                        <td>{author.institution || 'সীরাত গবেষক'}</td>
                        <td>
                          <span className="admin-phone-pill">
                            <Phone size={11} /> {author.phone || '০১৭xxxxxxxx'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#047857' }}>
                            {toBanglaNum(author.totalPosts)}টি
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#2563EB' }}>
                            👁️ {toBanglaNum(author.totalViews)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#D97706' }}>
                            🌸 {toBanglaNum(author.totalSalawat)}
                          </span>
                        </td>
                        <td>
                          {author.isVerified ? (
                            <span className="admin-status-badge admin-status-approved">
                              <Check size={11} /> ভেরিফাইড গবেষক
                            </span>
                          ) : (
                            <span className="admin-status-badge admin-status-under_review">
                              লেখক
                            </span>
                          )}
                        </td>
                        <td>
                          {author.isBanned ? (
                            <span className="admin-status-badge admin-status-banned">
                              🚫 ব্যানড
                            </span>
                          ) : (
                            <span className="admin-status-badge admin-status-approved">
                              সক্রিয়
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Readers' Submitted Feedback & Advice Inbox */}
            <div className="admin-content-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  <Inbox size={20} color="#047857" />
                  <span>পাঠকদের প্রেরিত সুপরামর্শ ও মতামত ইনবক্স ({toBanglaNum(feedbackList.length || 2)})</span>
                </h2>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                পরামর্শ বক্সের মাধ্যমে পাঠকদের সরাসরি পাঠানো সুপরামর্শ ও পর্যালোচনা:
              </p>

              <div className="admin-feedback-inbox-list">
                {(feedbackList.length > 0
                  ? feedbackList
                  : [
                      {
                        id: 'fb-1',
                        name: 'মুহাম্মাদ খালিদ',
                        phone: '০১৯১২৯৯৮৮৭৭',
                        subject: 'সিরাত কুইজের সংখ্যা বৃদ্ধি',
                        message: 'মাশাআল্লাহ সাইটটি অনেক সুন্দর হয়েছে। প্রতি সপ্তাহে আরও নতুন নতুন কুইজ যুক্ত করলে যুবসমাজ বেশি উপকৃত হবে।',
                        date: '২০২৬-০৮-২১',
                      },
                      {
                        id: 'fb-2',
                        name: 'মুফতী মাহমুদ',
                        phone: '০১৭১১২২৩৩৪৪',
                        subject: 'আরবি ইবারতের ফন্ট সাইজ',
                        message: 'আরবি হাদিসের ইবারতগুলো আরও স্পষ্ট ও বড় করার অনুরোধ রইলো। তাহকিকগুলো মাশাআল্লাহ মানসম্মত।',
                        date: '২০২৬-০৮-২২',
                      },
                    ]
                ).map((fb) => (
                  <div key={fb.id} className="admin-feedback-inbox-item">
                    <div className="admin-feedback-inbox-header">
                      <div>
                        <strong>{fb.name}</strong>
                        {fb.phone && <span className="admin-phone-pill" style={{ marginLeft: '8px' }}><Phone size={10} /> {fb.phone}</span>}
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{fb.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#064E3B', margin: '6px 0 4px' }}>
                      📌 বিষয়: {fb.subject}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.6 }}>
                      "{fb.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: USERS & PHONE DIRECTORY & BAN MANAGEMENT
           ============================================================ */}
        {activeTab === 'users' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <Users size={20} color="#047857" />
                <span>ইউজার ও মোবাইল ডিরেক্টরি (ব্যান ও পারমিশন কন্ট্রোল)</span>
              </h2>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="admin-search-box">
                  <Search size={14} color="#64748B" />
                  <input
                    type="text"
                    placeholder="নাম, ফোন বা ইমেইল খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                </div>

                <div className="admin-filter-pills">
                  <button
                    type="button"
                    className={`admin-filter-pill ${userFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setUserFilter('all')}
                  >
                    সব ইউজার ({toBanglaNum(users.length)})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${userFilter === 'reader' ? 'active' : ''}`}
                    onClick={() => setUserFilter('reader')}
                  >
                    📖 সাধারণ পাঠক ({toBanglaNum(readersCount)})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${userFilter === 'writer' ? 'active' : ''}`}
                    onClick={() => setUserFilter('writer')}
                  >
                    🛡️ অনুমোদিত লেখক ({toBanglaNum(writersCount)})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${userFilter === 'banned' ? 'active' : ''}`}
                    onClick={() => setUserFilter('banned')}
                  >
                    🚫 ব্যানড ({toBanglaNum(bannedUsersCount)})
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-app-list">
              {filteredUsers.map((u) => (
                <div
                  key={u.uid}
                  className={`admin-app-card ${u.isBanned ? 'admin-app-card--banned' : ''}`}
                >
                  <div className="admin-app-main">
                    <div className="admin-app-header-row">
                      <span className="admin-app-name">{u.displayName}</span>
                      <span className="admin-phone-pill">
                        <Phone size={11} /> {u.phone || 'ফোন নেই'}
                      </span>
                      <span
                        className={`admin-status-badge ${
                          u.isBanned
                            ? 'admin-status-banned'
                            : u.isWriter
                            ? 'admin-status-approved'
                            : 'admin-status-pending'
                        }`}
                      >
                        {u.isBanned
                          ? '🚫 স্থগিত / ব্যানড'
                          : u.role === 'scholar'
                          ? '🌟 প্রধান মুহাদ্দিস ও গবেষক'
                          : u.isWriter
                          ? '✍️ অনুমোদিত লেখক'
                          : '📖 সাধারণ পাঠক (শুধু পড়তে পারবেন)'}
                      </span>
                    </div>

                    <div className="admin-app-inst">
                      <span>✉️ {u.email}</span>
                      <span>🏛️ {u.institution || 'সাধারণ পাঠক'}</span>
                      <span>📅 যোগদান: {u.joinedAt || '২০২৪'}</span>
                      {u.totalPosts > 0 && <span>📚 {toBanglaNum(u.totalPosts)}টি পোস্ট</span>}
                      {u.totalViews > 0 && <span>👁️ {toBanglaNum(u.totalViews)} ভিউ</span>}
                      {u.isBanned && u.banReason && (
                        <span style={{ color: '#991B1B', fontWeight: 700 }}>
                          ⚠️ ব্যানের কারণ: {u.banReason}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="admin-app-actions">
                    <button
                      type="button"
                      className="admin-action-btn admin-btn-details"
                      onClick={() => {
                        setEditingUser(u);
                        setEditPhoneInput(u.phone || '');
                        setEditRoleInput(u.role || 'reader');
                        setEditUserModalOpen(true);
                      }}
                    >
                      <Edit3 size={13} />
                      <span>ফোন ও পদবী</span>
                    </button>

                    {u.isBanned ? (
                      <button
                        type="button"
                        className="admin-action-btn admin-btn-unban"
                        onClick={() => handleUnbanUser(u)}
                      >
                        <Unlock size={13} />
                        <span>আনব্যান করুন</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-action-btn admin-btn-ban"
                        onClick={() => {
                          setUserToBan(u);
                          setBanReasonInput('');
                          setBanModalOpen(true);
                        }}
                      >
                        <Ban size={13} />
                        <span>ব্যান করুন</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: WRITER & RESEARCHER APPLICATIONS
           ============================================================ */}
        {activeTab === 'applications' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <ShieldCheck size={20} color="#047857" />
                <span>লেখক ও সিরাত গবেষক আবেদন পর্যালোচনা</span>
              </h2>

              <div className="admin-filter-pills">
                <button
                  type="button"
                  className={`admin-filter-pill ${appFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setAppFilter('all')}
                >
                  সব ({toBanglaNum(applications.length)})
                </button>
                <button
                  type="button"
                  className={`admin-filter-pill ${appFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setAppFilter('pending')}
                >
                  ⏳ পেন্ডিং ({toBanglaNum(pendingAppsCount)})
                </button>
                <button
                  type="button"
                  className={`admin-filter-pill ${appFilter === 'under_review' ? 'active' : ''}`}
                  onClick={() => setAppFilter('under_review')}
                >
                  🔍 পর্যালোচনায় ({toBanglaNum(applications.filter((a) => a.status === 'under_review').length)})
                </button>
                <button
                  type="button"
                  className={`admin-filter-pill ${appFilter === 'approved' ? 'active' : ''}`}
                  onClick={() => setAppFilter('approved')}
                >
                  ✔️ অনুমোদিত ({toBanglaNum(applications.filter((a) => a.status === 'approved').length)})
                </button>
              </div>
            </div>

            <div className="admin-app-list">
              {filteredApps.map((app) => (
                <div key={app.id || app.applicationId} className="admin-app-card">
                  <div className="admin-app-main">
                    <div className="admin-app-header-row">
                      <span className="admin-app-id">{app.applicationId || 'SRT-APP-2026'}</span>
                      <span className="admin-app-name">
                        {app.honorificTitle ? `${app.honorificTitle} ` : ''}
                        {app.fullName}
                      </span>
                      <span className={`admin-status-badge admin-status-${app.status || 'pending'}`}>
                        {app.status === 'approved'
                          ? '✔️ অনুমোদিত'
                          : app.status === 'under_review'
                          ? '🔍 পর্যালোচনাধীন'
                          : app.status === 'rejected'
                          ? '✕ প্রত্যাখ্যাত'
                          : '⏳ অপেক্ষমান (পেন্ডিং)'}
                      </span>
                    </div>

                    <div className="admin-app-inst">
                      <span>🏛️ {app.institution}</span>
                      <span>🎓 {app.qualification}</span>
                      <span>💼 {app.designation}</span>
                      <span className="admin-phone-pill">
                        <Phone size={11} /> {app.phone || 'ফোন নেই'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-app-actions">
                    <button
                      type="button"
                      className="admin-action-btn admin-btn-details"
                      onClick={() => {
                        setSelectedApp(app);
                        setDetailsModalOpen(true);
                      }}
                    >
                      <Eye size={14} />
                      <span>পূর্ণাঙ্গ ডসিয়ার</span>
                    </button>

                    <button
                      type="button"
                      className="admin-action-btn admin-btn-details"
                      onClick={() => {
                        setSelectedApp(app);
                        setPrintDossierModalOpen(true);
                      }}
                    >
                      <Printer size={14} />
                      <span>A4 প্রিন্ট</span>
                    </button>

                    {app.status !== 'approved' && (
                      <button
                        type="button"
                        className="admin-action-btn admin-btn-approve"
                        onClick={() => handleUpdateAppStatus(app.id || app.applicationId, 'approved')}
                      >
                        <Check size={14} />
                        <span>অনুমোদন ও সনদ</span>
                      </button>
                    )}

                    {app.status === 'pending' && (
                      <button
                        type="button"
                        className="admin-action-btn admin-btn-review"
                        onClick={() => handleUpdateAppStatus(app.id || app.applicationId, 'under_review')}
                      >
                        <Clock size={14} />
                        <span>পর্যালোচনায় রাখুন</span>
                      </button>
                    )}

                    {app.status !== 'rejected' && (
                      <button
                        type="button"
                        className="admin-action-btn admin-btn-reject"
                        onClick={() => handleUpdateAppStatus(app.id || app.applicationId, 'rejected')}
                      >
                        <XCircle size={14} />
                        <span>বাতিল</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 4: ARTICLES & POSTS MODERATION
           ============================================================ */}
        {activeTab === 'articles' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <BookOpen size={20} color="#047857" />
                <span>প্রবন্ধ ও পোস্ট তাহকিক মডারেশন</span>
              </h2>

              <div className="admin-filter-pills">
                <button
                  type="button"
                  className={`admin-filter-pill ${articleFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setArticleFilter('all')}
                >
                  সব ({toBanglaNum(articles.length)})
                </button>
                <button
                  type="button"
                  className={`admin-filter-pill ${articleFilter === 'quiz' ? 'active' : ''}`}
                  onClick={() => setArticleFilter('quiz')}
                >
                  সিরাত কুইজ
                </button>
                <button
                  type="button"
                  className={`admin-filter-pill ${articleFilter === 'quote' ? 'active' : ''}`}
                  onClick={() => setArticleFilter('quote')}
                >
                  রঙিন উদ্ধৃতি
                </button>
              </div>
            </div>

            <div className="admin-app-list">
              {filteredArticles.map((art) => (
                <div key={art.id} className="admin-app-card">
                  <div className="admin-app-main">
                    <div className="admin-app-header-row">
                      <span className="admin-app-name">{art.title}</span>
                      {art.quizData && (
                        <span className="admin-status-badge admin-status-under_review">
                          🎯 সিরাত কুইজ
                        </span>
                      )}
                      {art.quoteData && (
                        <span className="admin-status-badge admin-status-pending">
                          📜 রঙিন উদ্ধৃতি
                        </span>
                      )}
                    </div>
                    <div className="admin-app-inst">
                      <span>✍️ {art.authorName || 'মুফতী আব্দুল্লাহ'}</span>
                      <span>📂 {art.topicName || 'সিরাত'}</span>
                      <span>⏱️ {toBanglaNum(art.readingTime || 5)} মিনিট পাঠ</span>
                      <span>💖 {toBanglaNum(art.jazakallahCount || 0)} জাযাকাল্লাহ</span>
                      <span>🌸 {toBanglaNum(art.salawatCount || 0)} দরূদ</span>
                    </div>
                  </div>

                  <div className="admin-app-actions">
                    <Link
                      href={`/blog/articles/${art.slug || art.id}`}
                      target="_blank"
                      className="admin-action-btn admin-btn-details"
                    >
                      <Eye size={14} />
                      <span>লাইভ দেখুন</span>
                    </Link>

                    <button
                      type="button"
                      className="admin-action-btn admin-btn-review"
                      onClick={() => {
                        setEditingArticle(art);
                        setAdminEditTitle(art.title || '');
                        setAdminEditSubtitle(art.subtitle || art.excerpt || '');
                        setAdminEditContent(
                          art.content || art.quoteData?.text || art.quizData?.question || ''
                        );
                        setAdminEditTopicSlug(art.topicSlug || 'seerah-basics');
                        setAdminEditReference(art.quoteData?.reference || '');
                        setEditArticleModalOpen(true);
                      }}
                    >
                      <Edit3 size={14} />
                      <span>সম্পাদনা</span>
                    </button>

                    <button
                      type="button"
                      className="admin-action-btn admin-btn-reject"
                      onClick={() => {
                        setArticleToDelete(art);
                        setDeleteArticleModalOpen(true);
                      }}
                    >
                      <Trash2 size={14} />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: SEERAH QUIZZES
           ============================================================ */}
        {activeTab === 'quizzes' && (
          <div className="admin-content-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <HelpCircle size={20} color="#047857" />
                <span>সক্রিয় সিরাত কুইজ ও প্রতিযোগিতা ব্যবস্থাপনা</span>
              </h2>
            </div>

            <div className="admin-app-list">
              {articles
                .filter((a) => a.quizData)
                .map((art) => (
                  <div key={art.id} className="admin-app-card">
                    <div className="admin-app-main">
                      <div className="admin-app-header-row">
                        <span className="admin-app-id">🎯 সক্রিয় কুইজ</span>
                        <span className="admin-app-name">{art.quizData.question}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '10px 0', fontSize: '13px' }}>
                        {art.quizData.options?.map((opt) => (
                          <div
                            key={opt.id}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: opt.id === art.quizData.correctOptionId ? '#ECFDF5' : '#F1F5F9',
                              border: opt.id === art.quizData.correctOptionId ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                              color: opt.id === art.quizData.correctOptionId ? '#047857' : '#475569',
                              fontWeight: opt.id === art.quizData.correctOptionId ? 700 : 400,
                            }}
                          >
                            {opt.id === art.quizData.correctOptionId ? '✔ [সঠিক] ' : '• '}
                            {opt.text}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: '12px', color: '#059669', fontStyle: 'italic' }}>
                        📖 তাহকিক ব্যাখ্যা: {art.quizData.explanation || 'সহীহ বুখারী ও সীরাতে ইবনে হিশাম'}
                      </div>
                    </div>

                    <div className="admin-app-actions">
                      <Link
                        href={`/blog/articles/${art.slug || art.id}`}
                        target="_blank"
                        className="admin-action-btn admin-btn-details"
                      >
                        <Eye size={14} />
                        <span>ফিডে দেখুন</span>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 6: PLATFORM CUSTOMIZATION & POLICY SETTINGS
           ============================================================ */}
        {activeTab === 'customization' && (
          <form onSubmit={handleSaveSettings} className="admin-content-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <Sliders size={20} color="#047857" />
                <span>প্ল্যাটফর্ম কাস্টমাইজেশন ও সার্বজনীন নীতিমালার সেটিংস</span>
              </h2>

              <Button type="submit" variant="primary" size="md">
                <Save size={16} style={{ marginRight: '6px' }} />
                পরিবর্তন সংরক্ষণ করুন
              </Button>
            </div>

            <div className="admin-settings-grid">
              {/* Box 1: Announcement Banner */}
              <div className="admin-setting-box">
                <div className="admin-setting-box-title">
                  <Bell size={16} /> জরুরি নোটিশ ও ঘোষণা ব্যানার
                </div>

                <div className="admin-switch-row">
                  <div>
                    <div className="admin-switch-label">ঘোষণা ব্যানার সক্রিয় রাখুন</div>
                    <div className="admin-switch-sub">হেডারের উপরে লাল/গোল্ডেন নোটিশ বার দেখাবে</div>
                  </div>
                  <input
                    type="checkbox"
                    className="admin-toggle-checkbox"
                    checked={settings.announcementActive}
                    onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">নোটিশের টেক্সট</label>
                  <textarea
                    rows={3}
                    className="admin-form-textarea"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">ঘোষণার লিংক (URL)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={settings.announcementLink}
                    onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                  />
                </div>
              </div>

              {/* Box 2: Writer Application Intake */}
              <div className="admin-setting-box">
                <div className="admin-setting-box-title">
                  <ShieldCheck size={16} /> লেখক ও গবেষক ভর্তি নীতি
                </div>

                <div className="admin-switch-row">
                  <div>
                    <div className="admin-switch-label">নতুন লেখক আবেদন গ্রহণ সচল</div>
                    <div className="admin-switch-sub">বন্ধ রাখলে পাঠকরা নতুন আবেদন জমা দিতে পারবে না</div>
                  </div>
                  <input
                    type="checkbox"
                    className="admin-toggle-checkbox"
                    checked={settings.writerApplicationsOpen}
                    onChange={(e) => setSettings({ ...settings, writerApplicationsOpen: e.target.checked })}
                  />
                </div>

                <div className="admin-switch-row">
                  <div>
                    <div className="admin-switch-label">বাধ্যতামূলক তাহকিক সূত্র ফিল্টার</div>
                    <div className="admin-switch-sub">হাদিস গ্রন্থ ও সনদ ছাড়া পোস্ট প্রকাশ নিষিদ্ধ থাকবে</div>
                  </div>
                  <input
                    type="checkbox"
                    className="admin-toggle-checkbox"
                    checked={settings.strictHadithReferences}
                    onChange={(e) => setSettings({ ...settings, strictHadithReferences: e.target.checked })}
                  />
                </div>

                <div className="admin-switch-row">
                  <div>
                    <div className="admin-switch-label">স্বয়ংক্রিয় আদব ও শিষ্টাচার মডারেশন</div>
                    <div className="admin-switch-sub">অনভিপ্রেত মন্তব্য ও আক্রমণাত্মক ভাষা প্রতিরোধ করবে</div>
                  </div>
                  <input
                    type="checkbox"
                    className="admin-toggle-checkbox"
                    checked={settings.autoModerateComments}
                    onChange={(e) => setSettings({ ...settings, autoModerateComments: e.target.checked })}
                  />
                </div>
              </div>

              {/* Box 3: Durood & Reader Growth Target */}
              <div className="admin-setting-box">
                <div className="admin-setting-box-title">
                  <Heart size={16} /> দৈনিক দরূদ ও পাঠক লক্ষ্যমাত্রা
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">দৈনিক দরূদ শরীফ পাঠের লক্ষ্যমাত্রা</label>
                  <input
                    type="number"
                    className="admin-form-input"
                    value={settings.duroodDailyGoal}
                    onChange={(e) => setSettings({ ...settings, duroodDailyGoal: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">সাইটের শিরোনাম (Brand Name)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">মূল স্লোগান (Tagline)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* ============================================================
          MODAL: USER BAN REASON PROMPT
         ============================================================ */}
      {userToBan && (
        <Modal
          isOpen={banModalOpen}
          onClose={() => setBanModalOpen(false)}
          title={`ইউজার ব্যান ও একাউন্ট স্থগিতকরণ — ${userToBan.displayName}`}
          maxWidth="500px"
        >
          <div style={{ fontFamily: 'var(--font-kalpurush)' }}>
            <div style={{ padding: '12px 14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', fontSize: '13px', marginBottom: '16px' }}>
              <strong>সতর্কতা:</strong> ব্যান করার পর এই ইউজার বা লেখক আর সাইটে কোনো প্রকার মন্তব্য, পোস্ট বা প্রতিক্রিয়া জানাতে পারবেন না।
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">ব্যান করার শাস্ত্রীয় / প্রশাসনিক কারণ</label>
              <textarea
                rows={3}
                className="admin-form-textarea"
                placeholder="যেমন: মন্তব্যে শিষ্টাচার লঙ্ঘন, অননুমোদিত মিথ্যা তথ্য প্রচার..."
                value={banReasonInput}
                onChange={(e) => setBanReasonInput(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setBanModalOpen(false)}>
                বাতিল
              </Button>
              <button
                type="button"
                className="admin-action-btn admin-btn-ban"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={handleBanUserSubmit}
              >
                <Ban size={14} />
                <span>স্থায়ীভাবে ব্যান করুন</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================
          MODAL: EDIT USER PHONE & ROLE
         ============================================================ */}
      {editingUser && (
        <Modal
          isOpen={editUserModalOpen}
          onClose={() => setEditUserModalOpen(false)}
          title={`ইউজার তথ্য ও পদবী সম্পাদনা — ${editingUser.displayName}`}
          maxWidth="500px"
        >
          <div style={{ fontFamily: 'var(--font-kalpurush)' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">মোবাইল ফোন নম্বর</label>
              <input
                type="text"
                className="admin-form-input"
                value={editPhoneInput}
                onChange={(e) => setEditPhoneInput(e.target.value)}
                placeholder="+88017xxxxxxxx"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">ইউজারের পদমর্যাদা (Role & Access)</label>
              <select
                className="admin-form-input"
                value={editRoleInput}
                onChange={(e) => setEditRoleInput(e.target.value)}
              >
                <option value="reader">📖 সাধারণ পাঠক (শুধু পড়ার সুবিধা)</option>
                <option value="writer">✍️ অনুমোদিত লেখক (পোস্ট ও প্রবন্ধ লেখার পারমিশন)</option>
                <option value="scholar">🌟 সিনিয়র মুহাদ্দিস ও সিরাত গবেষক</option>
                <option value="admin">🛡️ প্রধান অ্যাডমিন ও তত্ত্বাবধায়ক</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button variant="secondary" onClick={() => setEditUserModalOpen(false)}>
                বাতিল
              </Button>
              <Button variant="primary" onClick={handleEditUserSubmit}>
                <Save size={14} style={{ marginRight: '6px' }} />
                সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================
          MODAL: APPLICATION FULL DOSSIER
         ============================================================ */}
      {selectedApp && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`আবেদনপত্র ও গবেষণা ডসিয়ার — ${selectedApp.fullName}`}
          maxWidth="720px"
        >
          <div style={{ fontFamily: 'var(--font-kalpurush)' }}>
            <div className="admin-detail-section">
              <div className="admin-detail-title">
                <Award size={16} /> প্রাতিষ্ঠানিক ও শিক্ষাগত পরিচয়
              </div>
              <div className="admin-detail-grid">
                <div><strong>আবেদন আইডি:</strong> {selectedApp.applicationId}</div>
                <div><strong>সম্মানসূচক উপাধি:</strong> {selectedApp.honorificTitle || 'প্রযোজ্য নহে'}</div>
                <div><strong>পূর্ণ নাম:</strong> {selectedApp.fullName}</div>
                <div><strong>সর্বোচ্চ যোগ্যতা:</strong> {selectedApp.qualification}</div>
                <div><strong>প্রতিষ্ঠান:</strong> {selectedApp.institution}</div>
                <div><strong>অনুষদ / বিভাগ:</strong> {selectedApp.department || 'সিরাত ও হাদিস বিভাগ'}</div>
                <div><strong>বর্তমান পদবী:</strong> {selectedApp.designation || 'গবেষক'}</div>
                <div><strong>ইমেইল:</strong> {selectedApp.email}</div>
                <div><strong>মোবাইল নম্বর:</strong> {selectedApp.phone}</div>
                <div><strong>ঠিকানা:</strong> {selectedApp.address}</div>
              </div>
            </div>

            <div className="admin-detail-section">
              <div className="admin-detail-title">
                <BookOpen size={16} /> লেখালেখির উদ্দেশ্য ও গবেষণার ক্ষেত্র
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>
                <strong>মূল উদ্দেশ্য:</strong> {selectedApp.writingPurpose || 'সিরাত চর্চা ও তরুণ প্রজন্মের মাঝে রাসূল ﷺ-এর আদর্শ প্রচার।'}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>
                <strong>আগ্রহী বিষয়সমূহ:</strong> {selectedApp.intendedTopics || 'ঐতিহাসিক সিরাত, শামায়েল ও হাদিস তাহকিক'}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <strong>পূর্ববর্তী প্রকাশনা:</strong> {selectedApp.previousPublications || 'জাতীয় ইসলামিক জার্নাল ও মাসিক পত্রিকা'}
              </div>
            </div>

            <div className="admin-detail-section">
              <div className="admin-detail-title">
                <FileText size={16} /> গবেষণার নমুনা: {selectedApp.sampleTitle}
              </div>
              <div className="admin-sample-box">
                {selectedApp.sampleWriting}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#065F46', fontSize: '12.5px', marginBottom: '16px' }}>
              <CheckCircle size={16} />
              <span>আবেদনকারী বিশুদ্ধ শাস্ত্রীয় তাহকিক ও তথ্যসূত্র সংরক্ষণের অঙ্গীকারে স্বাক্ষর করেছেন।</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => setDetailsModalOpen(false)}>
                বন্ধ করুন
              </Button>

              {selectedApp.status !== 'approved' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdateAppStatus(selectedApp.id || selectedApp.applicationId, 'approved');
                    setDetailsModalOpen(false);
                  }}
                >
                  <Check size={14} style={{ marginRight: '6px' }} />
                  অনুমোদন ও গবেষক ব্যাজ প্রদান
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================
          MODAL: A4 PRINTABLE APPOINTMENT DOSSIER
         ============================================================ */}
      {selectedApp && (
        <Modal
          isOpen={printDossierModalOpen}
          onClose={() => setPrintDossierModalOpen(false)}
          title="অফিসিয়াল তাহকিক মেমোরেন্ডাম (A4 প্রিন্ট প্রিভিউ)"
          maxWidth="800px"
        >
          <div style={{ fontFamily: 'var(--font-kalpurush)' }}>
            <div className="admin-print-dossier" style={{ border: '2px solid #064E3B', borderRadius: '12px', padding: '30px', backgroundColor: '#FFFFFF' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #064E3B', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#064E3B' }}>সীরাত.ব্লগ — Tahqiq & Research Council</div>
                <div style={{ fontSize: '14px', color: '#B45309', marginTop: '4px' }}>রাসূলুল্লাহ ﷺ-এর জীবনচরিত ও বিশুদ্ধ শাস্ত্রীয় গবেষণা পরিষদ</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>স্মারক নং: {selectedApp.applicationId} | তারিখ: {new Date().toLocaleDateString('bn-BD')}</div>
              </div>

              <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#1E293B', marginBottom: '20px' }}>
                <p><strong>বরাবর:</strong> {selectedApp.honorificTitle ? `${selectedApp.honorificTitle} ` : ''}{selectedApp.fullName}</p>
                <p><strong>প্রতিষ্ঠান ও পদবী:</strong> {selectedApp.designation}, {selectedApp.institution}</p>
                <p><strong>মোবাইল নম্বর:</strong> {selectedApp.phone}</p>
                <p><strong>বিষয়:</strong> সীরাত.ব্লগে নিয়মিত গবেষক ও লেখক হিসেবে অন্তর্ভুক্তির আবেদন যাচাইকরণ ও অনুমোদন সংক্রান্ত মেমোরেন্ডাম।</p>
                <p style={{ marginTop: '12px' }}>
                  জনাব, আপনার দাখিলকৃত তাহকিক আবেদনপত্র ও গবেষণা প্রবন্ধের নমুনা <em>"{selectedApp.sampleTitle}"</em> সীরাত.ব্লগ সম্পাদনা পরিষদ কর্তৃক যথাযথ পর্যালোচনা করা হয়েছে। আপনার দাখিলকৃত তথ্য ও শাস্ত্রীয় মানদণ্ড বিশুদ্ধভাবে গৃহীত হয়েছে।
                </p>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '13px' }}>
                <div><strong>আগ্রহী ক্ষেত্র:</strong> {selectedApp.intendedTopics}</div>
                <div><strong>পূর্ববর্তী গবেষণা:</strong> {selectedApp.previousPublications || 'সিরাত ও হাদিস জার্নাল'}</div>
                <div><strong>তাহকিক অঙ্গীকারনামা:</strong> বিশুদ্ধ সনদ ও নির্ভরযোগ্য মূল আরবি গ্রন্থাবলীর উদ্ধৃতি প্রদানের অঙ্গীকার রক্ষিত।</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed #94A3B8' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800 }}>মুফতী মাহমুদুর রহমান</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>সদস্য, তাহকিক ও সম্পাদনা পরিষদ</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800 }}>শায়খ আব্দুল্লাহ আল-মামুন</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>প্রধান প্রশাসক, সীরাত.ব্লগ</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setPrintDossierModalOpen(false)}>
                বাতিল
              </Button>
              <Button variant="primary" onClick={() => window.print()}>
                <Printer size={16} style={{ marginRight: '6px' }} />
                প্রিন্ট করুন (Print A4)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================
          MODAL: ADMIN ARTICLE EDIT MODAL
         ============================================================ */}
      {editingArticle && (
        <Modal
          isOpen={editArticleModalOpen}
          onClose={() => setEditArticleModalOpen(false)}
          title={`প্রবন্ধ সম্পাদনা (অ্যাডমিন কন্ট্রোল) — ${editingArticle.title}`}
          maxWidth="680px"
        >
          <form onSubmit={handleAdminSaveArticle} style={{ fontFamily: 'var(--font-kalpurush)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '8px 12px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', color: '#1D4ED8', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              <span>লেখক: <strong>{editingArticle.authorName || 'লেখক'}</strong> | আপনি প্রধান অ্যাডমিন হিসেবে এই পোস্টের তথ্য সংশোধন করছেন।</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                শিরোনাম
              </label>
              <input
                type="text"
                required
                className="admin-form-input"
                value={adminEditTitle}
                onChange={(e) => setAdminEditTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                সারসংক্ষেপ / উপ-শিরোনাম
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={adminEditSubtitle}
                onChange={(e) => setAdminEditSubtitle(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                মূল বক্তব্য / কনটেন্ট
              </label>
              <textarea
                rows={6}
                required
                className="admin-form-textarea"
                value={adminEditContent}
                onChange={(e) => setAdminEditContent(e.target.value)}
              />
            </div>

            {editingArticle.quoteData && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                  উদ্ধৃতি সূত্র (Reference)
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={adminEditReference}
                  onChange={(e) => setAdminEditReference(e.target.value)}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                বিষয় / বিভাগ
              </label>
              <select
                className="admin-form-input"
                value={adminEditTopicSlug}
                onChange={(e) => setAdminEditTopicSlug(e.target.value)}
              >
                {sampleTopics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button type="button" variant="secondary" onClick={() => setEditArticleModalOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" variant="primary">
                <Save size={15} style={{ marginRight: '6px' }} />
                পরিবর্তন সংরক্ষণ করুন
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ============================================================
          MODAL: ADMIN ARTICLE DELETE CONFIRMATION
         ============================================================ */}
      {articleToDelete && (
        <Modal
          isOpen={deleteArticleModalOpen}
          onClose={() => setDeleteArticleModalOpen(false)}
          title="প্রবন্ধ মুছে ফেলার নিশ্চিতকরণ (অ্যাডমিন)"
          maxWidth="480px"
        >
          <div style={{ fontFamily: 'var(--font-kalpurush)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', padding: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px' }}>
              <AlertCircle size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#991B1B', marginBottom: '4px' }}>
                  আপনি কি নিশ্চিতভাবে এই প্রবন্ধটি মুছে ফেলতে চান?
                </div>
                <div style={{ fontSize: '12.5px', color: '#7F1D1D', lineHeight: 1.5 }}>
                  এটি ডাটাবেজ এবং সকল ফিড থেকে স্থায়ীভাবে অপসারিত হবে।
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 12px', backgroundColor: '#F8FAFC', border: '1px solid var(--color-border-secondary)', borderRadius: '8px', marginBottom: '18px', fontSize: '13px' }}>
              <div><strong>শিরোনাম:</strong> {articleToDelete.title}</div>
              <div style={{ marginTop: '4px' }}><strong>লেখক:</strong> {articleToDelete.authorName || 'লেখক'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button type="button" variant="secondary" onClick={() => setDeleteArticleModalOpen(false)}>
                বাতিল
              </Button>
              <button
                type="button"
                onClick={handleAdminDeleteArticle}
                className="admin-action-btn admin-btn-ban"
                style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={15} />
                <span>স্থায়ীভাবে মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Bottom Advice & Consultation Box */}
      <FeedbackConsultationBox />
    </div>
  );
}

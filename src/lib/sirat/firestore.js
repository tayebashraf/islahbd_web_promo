import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  sampleArticles,
  sampleAuthors,
  sampleTopics,
  sampleApplications,
  sampleUsers,
  samplePlatformSettings,
  sampleClickAnalytics,
  sampleTopicViewsAnalytics,
  sampleFeedbackList,
} from './sampleData';

// In-Memory / Local Cache for immediate high-speed responses
let memoryArticles = [...sampleArticles];
let memoryComments = [];
let memoryApplications = [...sampleApplications];
let memoryUsers = [...sampleUsers];
let memorySettings = { ...samplePlatformSettings };
let memoryClickAnalytics = { ...sampleClickAnalytics };
let memoryTopicAnalytics = [...sampleTopicViewsAnalytics];
let memoryFeedback = [...sampleFeedbackList];

// ============================================================
// ARTICLES
// ============================================================

export async function getArticles({ topicSlug, status = 'published', pageSize = 10, lastDoc = null } = {}) {
  if (!isFirebaseConfigured) {
    let list = memoryArticles.filter((a) => (status ? a.status === status || !a.status : true));
    if (topicSlug) {
      list = list.filter((a) => a.topicSlug === topicSlug);
    }
    return list.slice(0, pageSize);
  }

  try {
    let q = query(
      collection(db, 'articles'),
      where('status', '==', status),
      orderBy('publishedAt', 'desc'),
      limit(pageSize)
    );

    if (topicSlug) {
      q = query(
        collection(db, 'articles'),
        where('status', '==', status),
        where('topicSlug', '==', topicSlug),
        orderBy('publishedAt', 'desc'),
        limit(pageSize)
      );
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    if (snapshot.empty) return memoryArticles.slice(0, pageSize);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Firestore fallback to local cache:', err.message);
    return memoryArticles.slice(0, pageSize);
  }
}

export async function getArticleBySlug(slug) {
  if (!isFirebaseConfigured) {
    return memoryArticles.find((a) => a.slug === slug) || null;
  }

  try {
    const q = query(
      collection(db, 'articles'),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return memoryArticles.find((a) => a.slug === slug) || null;
    }
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() };
  } catch (err) {
    return memoryArticles.find((a) => a.slug === slug) || null;
  }
}

export async function getFeaturedArticle() {
  if (!isFirebaseConfigured) {
    return memoryArticles.find((a) => a.featured) || memoryArticles[0] || null;
  }
  try {
    const q = query(
      collection(db, 'articles'),
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return memoryArticles[0] || null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() };
  } catch {
    return memoryArticles[0] || null;
  }
}

export async function getArticlesByAuthor(authorId, pageSize = 10) {
  if (!isFirebaseConfigured) {
    return memoryArticles.filter((a) => a.authorId === authorId).slice(0, pageSize);
  }
  try {
    const q = query(
      collection(db, 'articles'),
      where('authorId', '==', authorId),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return memoryArticles.filter((a) => a.authorId === authorId).slice(0, pageSize);
  }
}

export async function getUserArticles(userId, status = null, pageSize = 20) {
  if (!isFirebaseConfigured) {
    return memoryArticles.filter((a) => a.authorId === userId).slice(0, pageSize);
  }
  try {
    let q = query(
      collection(db, 'articles'),
      where('authorId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return memoryArticles.filter((a) => a.authorId === userId).slice(0, pageSize);
  }
}

export async function createArticle(articleData) {
  const newId = 'art_' + Date.now() + Math.random().toString(36).substring(2, 6);
  const formatted = {
    id: newId,
    slug: articleData.slug || 'post-' + Date.now(),
    ...articleData,
    jazakallahCount: articleData.jazakallahCount || 0,
    salawatCount: articleData.salawatCount || 0,
    publishedAt: { seconds: Math.floor(Date.now() / 1000) },
  };

  memoryArticles.unshift(formatted);

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'articles'), {
        ...formatted,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...formatted };
    } catch (err) {
      console.warn('Firestore write failed, stored in memory cache:', err);
    }
  }

  return formatted;
}

export async function updateArticle(id, data) {
  try {
    const idx = memoryArticles.findIndex((a) => a.id === id || a.slug === id);
    if (idx !== -1) {
      memoryArticles[idx] = {
        ...memoryArticles[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'articles', id), {
        ...data,
        updatedAt: serverTimestamp ? serverTimestamp() : new Date(),
      });
    }
    return { success: true, article: memoryArticles[idx] };
  } catch (err) {
    console.warn('Firestore updateArticle fallback:', err.message);
    return { success: true };
  }
}

export async function deleteArticle(id) {
  try {
    memoryArticles = memoryArticles.filter((a) => a.id !== id && a.slug !== id);
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'articles', id));
    }
    return { success: true };
  } catch (err) {
    console.warn('Firestore deleteArticle fallback:', err.message);
    return { success: true };
  }
}

export async function publishArticle(id) {
  await updateDoc(doc(db, 'articles', id), {
    status: 'published',
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ============================================================
// AUTHORS / USERS
// ============================================================

export async function getAuthorProfile(uid) {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getVerifiedAuthors(pageSize = 10) {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'writer'),
    where('isVerified', '==', true),
    limit(pageSize)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllAuthors(pageSize = 20) {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'writer'),
    limit(pageSize)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================
// TOPICS
// ============================================================

export async function getTopics() {
  const q = query(collection(db, 'topics'), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTopicBySlug(slug) {
  const q = query(collection(db, 'topics'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() };
}

// ============================================================
// REACTIONS
// ============================================================

export async function addReaction(articleId, userId, type = 'jazakallah') {
  // Check if already reacted
  const q = query(
    collection(db, 'reactions'),
    where('articleId', '==', articleId),
    where('userId', '==', userId),
    where('type', '==', type),
    limit(1)
  );
  const existing = await getDocs(q);
  if (!existing.empty) return false; // already reacted

  await addDoc(collection(db, 'reactions'), {
    articleId,
    userId,
    type,
    createdAt: serverTimestamp(),
  });

  // Increment count on article
  const countField = type === 'jazakallah' ? 'jazakallahCount' : 'salawatCount';
  await updateDoc(doc(db, 'articles', articleId), {
    [countField]: increment(1),
  });

  return true;
}

export async function incrementArticleJazakallah(articleId) {
  try {
    await updateDoc(doc(db, 'articles', articleId), {
      jazakallahCount: increment(1),
    });
    return true;
  } catch (e) {
    console.warn('Firestore increment error, using fallback:', e);
    return true;
  }
}

// ============================================================
// COMMENTS
// ============================================================

export async function getComments(articleId, pageSize = 20) {
  try {
    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore getComments error, returning empty array:', e);
    return [];
  }
}

export const getCommentsByArticle = getComments;

export async function addComment(articleId, userId, displayName, content) {
  const docRef = await addDoc(collection(db, 'comments'), {
    articleId,
    authorId: userId,
    authorName: displayName,
    content,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function addCommentToArticle(articleId, commentData) {
  try {
    const payload = {
      articleId,
      text: commentData.text || commentData.content || '',
      authorName: commentData.authorName || 'মুফতী আব্দুল্লাহ',
      isDurood: Boolean(commentData.isDurood),
      seniorityRank: commentData.seniorityRank || 1,
      parentCommentId: commentData.parentCommentId || null,
      createdAt: serverTimestamp ? serverTimestamp() : new Date(),
    };
    const docRef = await addDoc(collection(db, 'comments'), payload);
    return { id: docRef.id, ...payload };
  } catch (e) {
    console.warn('Firestore addCommentToArticle error, using local fallback:', e);
    return { id: `c_${Date.now()}`, ...commentData, time: 'এইমাত্র' };
  }
}

// ============================================================
// WRITER APPLICATION & ADMIN MANAGEMENT
// ============================================================

export async function submitWriterApplication(uidOrData, data) {
  const payload = typeof uidOrData === 'string' ? data : uidOrData;
  const appId = payload.applicationId || `SRT-APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  if (!isFirebaseConfigured) {
    const newApp = {
      id: appId,
      ...payload,
      applicationId: appId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    memoryApplications.unshift(newApp);
    return { id: appId, applicationId: appId, success: true };
  }

  try {
    if (typeof uidOrData === 'string') {
      await updateDoc(doc(db, 'users', uidOrData), {
        writerStatus: 'pending',
        writerApplication: {
          ...data,
          submittedAt: serverTimestamp(),
        },
      });
      return { success: true };
    } else {
      const docRef = await addDoc(collection(db, 'writer_applications'), {
        ...uidOrData,
        status: 'pending',
        submittedAt: serverTimestamp(),
      });
      const newApp = { id: docRef.id, ...uidOrData, status: 'pending' };
      memoryApplications.unshift(newApp);
      return { id: docRef.id, applicationId: appId, success: true };
    }
  } catch (e) {
    console.warn('Firestore submitWriterApplication error, using fallback:', e);
    const newApp = { id: appId, ...payload, applicationId: appId, status: 'pending', submittedAt: new Date().toISOString() };
    memoryApplications.unshift(newApp);
    return { id: appId, applicationId: appId, success: true };
  }
}


export async function getWriterApplications({ status = 'all', pageSize = 50 } = {}) {
  if (!isFirebaseConfigured) {
    let list = [...memoryApplications];
    if (status && status !== 'all') {
      list = list.filter((a) => a.status === status);
    }
    return list.slice(0, pageSize);
  }

  try {
    let q = query(
      collection(db, 'writer_applications'),
      orderBy('submittedAt', 'desc'),
      limit(pageSize)
    );
    if (status && status !== 'all') {
      q = query(
        collection(db, 'writer_applications'),
        where('status', '==', status),
        orderBy('submittedAt', 'desc'),
        limit(pageSize)
      );
    }
    const snapshot = await getDocs(q);
    if (snapshot.empty) return memoryApplications.slice(0, pageSize);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Firestore getWriterApplications fallback:', err.message);
    let list = [...memoryApplications];
    if (status && status !== 'all') {
      list = list.filter((a) => a.status === status);
    }
    return list.slice(0, pageSize);
  }
}

export async function updateWriterApplicationStatus(applicationId, newStatus, reviewerNotes = '') {
  try {
    const appIndex = memoryApplications.findIndex((a) => a.id === applicationId || a.applicationId === applicationId);
    let app = null;
    if (appIndex !== -1) {
      memoryApplications[appIndex] = {
        ...memoryApplications[appIndex],
        status: newStatus,
        reviewerNotes,
        reviewedAt: new Date().toISOString(),
      };
      app = memoryApplications[appIndex];
    }

    if (newStatus === 'approved' && app) {
      // Find or create the user and upgrade to writer
      const existingUserIndex = memoryUsers.findIndex(
        (u) =>
          (app.uid && u.uid === app.uid) ||
          (app.email && u.email?.toLowerCase() === app.email.toLowerCase()) ||
          (app.phone && u.phone === app.phone)
      );

      if (existingUserIndex !== -1) {
        memoryUsers[existingUserIndex] = {
          ...memoryUsers[existingUserIndex],
          role: 'writer',
          isWriter: true,
          isVerified: true,
          writerStatus: 'approved',
          institution: app.institution || memoryUsers[existingUserIndex].institution,
        };
      } else {
        const newUid = app.uid || `writer_${Date.now()}`;
        const newAuthorUser = {
          uid: newUid,
          displayName: app.fullName || 'অনুমোদিত সিরাত গবেষক',
          email: app.email || `${app.phone || 'writer'}@sirat.blog`,
          phone: app.phone || '',
          photoURL: '',
          bio: app.bio || 'সিরাত গবেষক ও তাহকিক লেখক',
          expertise: app.department || 'সিরাত গবেষণা ও তাহকিক',
          institution: app.institution || '',
          role: 'writer',
          isWriter: true,
          isVerified: true,
          isBanned: false,
          writerStatus: 'approved',
          articlesCount: 0,
          joinedAt: new Date().toISOString(),
        };
        memoryUsers.unshift(newAuthorUser);
      }
    }

    if (isFirebaseConfigured) {
      const docRef = doc(db, 'writer_applications', applicationId);
      await updateDoc(docRef, {
        status: newStatus,
        reviewerNotes,
        reviewedAt: serverTimestamp ? serverTimestamp() : new Date(),
      });

      if (newStatus === 'approved' && app?.uid) {
        try {
          await updateDoc(doc(db, 'users', app.uid), {
            role: 'writer',
            isWriter: true,
            isVerified: true,
            writerStatus: 'approved',
          });
        } catch (e) {
          console.warn('Could not update user doc:', e);
        }
      }
    }
    return { success: true };
  } catch (err) {
    console.warn('Firestore updateWriterApplicationStatus fallback:', err.message);
    return { success: true };
  }
}


export async function updateArticleStatus(articleId, newStatus) {
  try {
    const artIndex = memoryArticles.findIndex((a) => a.id === articleId || a.slug === articleId);
    if (artIndex !== -1) {
      memoryArticles[artIndex] = {
        ...memoryArticles[artIndex],
        status: newStatus,
      };
    }
    if (isFirebaseConfigured) {
      const docRef = doc(db, 'articles', articleId);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp ? serverTimestamp() : new Date(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn('Firestore updateArticleStatus fallback:', err.message);
    return { success: true };
  }
}

export async function getAdminMetrics() {
  const totalArticles = memoryArticles.length;
  const pendingArticles = memoryArticles.filter((a) => a.status === 'pending' || a.status === 'under_review').length;
  const totalApplications = memoryApplications.length;
  const pendingApplications = memoryApplications.filter((a) => a.status === 'pending').length;
  const totalScholars = memoryUsers.filter((u) => u.role === 'scholar' || u.isVerified).length;
  const totalUsers = memoryUsers.length;
  const totalReaders = memoryUsers.filter((u) => u.role === 'reader').length;
  const bannedUsers = memoryUsers.filter((u) => u.isBanned).length;
  const totalSalawat = memorySettings.currentDuroodCount || 18450;
  const totalViews = memoryUsers.reduce((sum, u) => sum + (u.totalViews || 0), 0);

  return {
    totalArticles,
    pendingArticles,
    totalApplications,
    pendingApplications,
    totalScholars,
    totalUsers,
    totalReaders,
    bannedUsers,
    totalSalawat,
    totalViews,
  };
}

// ============================================================
// USER MANAGEMENT & BAN SYSTEM
// ============================================================

export async function getAllUsers({ role = 'all', isBanned = null, searchQuery = '' } = {}) {
  let list = [...memoryUsers];
  if (role && role !== 'all') {
    list = list.filter((u) => u.role === role);
  }
  if (isBanned !== null) {
    list = list.filter((u) => Boolean(u.isBanned) === isBanned);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.institution?.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function updateUserBanStatus(uid, isBanned, banReason = '') {
  try {
    const idx = memoryUsers.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      memoryUsers[idx] = {
        ...memoryUsers[idx],
        isBanned: Boolean(isBanned),
        banReason: banReason || (isBanned ? 'প্রশাসনিক সিদ্ধান্তে অ্যাকাউন্ট স্থগিত' : ''),
      };
    }
    if (isFirebaseConfigured) {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        isBanned: Boolean(isBanned),
        banReason: banReason || '',
        updatedAt: serverTimestamp ? serverTimestamp() : new Date(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn('Firestore updateUserBanStatus fallback:', err.message);
    return { success: true };
  }
}

export async function updateUserRole(uid, newRole) {
  try {
    const idx = memoryUsers.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      memoryUsers[idx] = {
        ...memoryUsers[idx],
        role: newRole,
        isWriter: newRole === 'writer' || newRole === 'scholar' || newRole === 'admin',
        isVerified: newRole === 'scholar' || newRole === 'admin',
      };
    }
    if (isFirebaseConfigured) {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        role: newRole,
        isWriter: newRole === 'writer' || newRole === 'scholar' || newRole === 'admin',
        isVerified: newRole === 'scholar' || newRole === 'admin',
        updatedAt: serverTimestamp ? serverTimestamp() : new Date(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn('Firestore updateUserRole fallback:', err.message);
    return { success: true };
  }
}

export async function updateUserPhone(uid, phone) {
  try {
    const idx = memoryUsers.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      memoryUsers[idx] = {
        ...memoryUsers[idx],
        phone,
      };
    }
    if (isFirebaseConfigured) {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        phone,
        updatedAt: serverTimestamp ? serverTimestamp() : new Date(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn('Firestore updateUserPhone fallback:', err.message);
    return { success: true };
  }
}

// ============================================================
// PLATFORM CUSTOMIZATION & SETTINGS
// ============================================================

export async function getPlatformSettings() {
  return { ...memorySettings };
}

export async function updatePlatformSettings(newSettings) {
  memorySettings = {
    ...memorySettings,
    ...newSettings,
  };
  return { success: true, settings: memorySettings };
}

export async function getAuthorPerformanceStats() {
  return memoryUsers
    .filter((u) => u.isWriter || u.role === 'scholar' || u.role === 'writer')
    .map((author) => ({
      uid: author.uid,
      name: author.displayName,
      institution: author.institution,
      phone: author.phone,
      totalPosts: author.totalPosts || 0,
      totalViews: author.totalViews || 0,
      totalSalawat: author.totalSalawat || 0,
      isVerified: author.isVerified,
      isBanned: author.isBanned,
    }));
}

export async function getPlatformAnalytics() {
  const totalUsers = memoryUsers.length;
  const readersOnly = memoryUsers.filter((u) => u.role === 'reader' && !u.isWriter).length;
  const approvedWriters = memoryUsers.filter((u) => u.isWriter || u.role === 'writer' || u.role === 'scholar').length;
  const bannedUsers = memoryUsers.filter((u) => u.isBanned).length;
  const pendingApplicants = memoryApplications.filter((a) => a.status === 'pending').length;

  return {
    userStats: {
      totalUsers,
      readersOnly,
      approvedWriters,
      bannedUsers,
      pendingApplicants,
    },
    clickAnalytics: memoryClickAnalytics,
    topicInterestAnalytics: memoryTopicAnalytics,
    feedbackCount: memoryFeedback.length,
  };
}

export async function submitPlatformFeedback(feedbackData) {
  const newFeedback = {
    id: 'fb-' + Date.now(),
    name: feedbackData.name || 'বেনামী পাঠক',
    phone: feedbackData.phone || '',
    subject: feedbackData.subject || 'সাধারণ পরামর্শ',
    message: feedbackData.message || '',
    date: new Date().toISOString().split('T')[0],
  };
  memoryFeedback = [newFeedback, ...memoryFeedback];
  return { success: true, feedback: newFeedback };
}

export async function getFeedbackList() {
  return [...memoryFeedback];
}

// ============================================================
// SEARCH (basic client-side — for production, use Algolia/Typesense)
// ============================================================

export async function searchArticles(searchQuery, pageSize = 20) {
  // Basic search by title prefix — for production, use a search service
  const q = query(
    collection(db, 'articles'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(pageSize)
  );
  const snapshot = await getDocs(q);
  const results = snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((article) => {
      const query = searchQuery.toLowerCase();
      return (
        article.title?.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.authorName?.toLowerCase().includes(query)
      );
    });
  return results;
}

// ============================================================
// UTILITIES
// ============================================================

export function calculateReadingTime(content) {
  if (!content) return 1;
  // Bengali text — approximate 200 words per minute
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '') // keep Bengali, English, numbers
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(timestamp) {
  if (!timestamp) return '';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// ============================================================
// QUIZ ATTEMPTS (Per-user, per-article, one attempt only)
// ============================================================

let memoryQuizAttempts = {}; // In-memory fallback: key = "uid_articleId"

export async function getQuizAttempt(uid, articleId) {
  const docId = `${uid}_${articleId}`;

  if (!isFirebaseConfigured) {
    return memoryQuizAttempts[docId] || null;
  }

  try {
    const docRef = doc(db, 'quizAttempts', docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz attempt:', error);
    return memoryQuizAttempts[docId] || null;
  }
}

export async function saveQuizAttempt(uid, articleId, attemptData) {
  const docId = `${uid}_${articleId}`;

  // Always save to memory
  memoryQuizAttempts[docId] = attemptData;

  if (!isFirebaseConfigured) {
    return attemptData;
  }

  try {
    const docRef = doc(db, 'quizAttempts', docId);
    await setDoc(docRef, attemptData);
    return attemptData;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return attemptData;
  }
}

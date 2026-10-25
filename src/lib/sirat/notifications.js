// ============================================================
// সীরাত.ব্লগ — Firebase Real-time & Cloud Notifications Service
// Supports Cloud Firestore real-time snapshots, FCM Web Push, and Local Hybrid Fallback
// ============================================================

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase';

const LOCAL_STORAGE_NOTIFICATIONS_KEY = 'sirat_local_notifications';

export const defaultMockNotifications = [
  {
    id: 'n1',
    type: 'adab_reply',
    title: 'শায়খ আহমাদ আলী আপনার আরজের উত্তর দিয়েছেন',
    snippet: '“মাশাআল্লাহ, আল্লাহ আপনার ইলমে বরকত দান করুন। বিশেষ করে তায়েফের ঘটনায় নববী ধৈর্যের শিক্ষাটি অনবদ্য।”',
    time: '৫ মিনিট আগে',
    read: false,
    authorName: 'শায়খ আহমাদ আলী',
    link: '/articles/dawah-er-potho-nobiji-er-hikmat',
    icon: '✨',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    type: 'reaction',
    title: 'ড. আবদুর রহমান আপনার মন্তব্যে جَزَاكَ ٱللَّٰهُ জানিয়েছেন',
    snippet: '“হিজরতের ঐতিহাসিক প্রেক্ষাপট ও সওর গুহার শিক্ষণীয় দিক নিয়ে আপনার আলোচনায়”',
    time: '২৫ মিনিট আগে',
    read: false,
    authorName: 'ড. আবদুর রহমান',
    link: '/articles/makkar-poth-theke-madinay',
    icon: '🤲',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n3',
    type: 'new_article',
    title: 'উস্তাযা ফাতিমা খান নতুন প্রবন্ধ প্রকাশ করেছেন',
    snippet: 'নবীজী ﷺ-এর দয়ার দৃষ্টান্ত: রাহমাতুল লিল আলামীন — শামায়েল ও আখলাক পর্ব',
    time: '২ ঘন্টা আগে',
    read: false,
    authorName: 'উস্তাযা ফাতিমা খান',
    link: '/articles/nobiji-er-dayar-drishtanto',
    icon: '📖',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n4',
    type: 'application_status',
    title: 'আপনার লেখক আবেদনটি পর্যালোচনাধীন রয়েছে',
    snippet: 'সম্পাদনা পরিষদ আপনার সনদ ও নমুনা লেখা যাচাই-বাছাই করছে।',
    time: '১ দিন আগে',
    read: true,
    authorName: 'সম্পাদনা পরিষদ',
    link: '/apply',
    icon: '⏳',
    createdAt: new Date().toISOString(),
  },
];

function getStoredLocalNotifications() {
  if (typeof window === 'undefined') return defaultMockNotifications;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : defaultMockNotifications;
  } catch {
    return defaultMockNotifications;
  }
}

function saveStoredLocalNotifications(notifications) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving local notifications:', e);
  }
}

/**
 * Real-time Subscription to User's Firebase Notifications
 */
export function subscribeToUserNotifications(userId, callback) {
  if (isFirebaseConfigured && userId) {
    try {
      const q = query(
        collection(db, 'users', userId, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));
            callback(list);
          } else {
            callback(getStoredLocalNotifications());
          }
        },
        (error) => {
          console.warn('Firestore notifications snapshot error, using local fallback:', error);
          callback(getStoredLocalNotifications());
        }
      );

      return unsubscribe;
    } catch (e) {
      console.warn('Firebase notification subscription error:', e);
    }
  }

  // Fallback to local storage
  callback(getStoredLocalNotifications());
  return () => {};
}

/**
 * Send a new Firebase Notification to a user
 */
export async function sendFirebaseNotification(userId, notification) {
  const payload = {
    type: notification.type || 'info',
    title: notification.title,
    snippet: notification.snippet || '',
    link: notification.link || '/',
    icon: notification.icon || '🔔',
    read: false,
    authorName: notification.authorName || 'সীরাত.ব্লগ',
    createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString(),
  };

  if (isFirebaseConfigured && userId) {
    try {
      const ref = await addDoc(collection(db, 'users', userId, 'notifications'), payload);
      return { id: ref.id, ...payload };
    } catch (err) {
      console.warn('Firestore sendNotification error, saving locally:', err);
    }
  }

  const current = getStoredLocalNotifications();
  const newItem = { id: `n_${Date.now()}`, ...payload, time: 'এইমাত্র' };
  const updated = [newItem, ...current];
  saveStoredLocalNotifications(updated);
  return newItem;
}

/**
 * Mark a single notification as read in Firestore
 */
export async function markFirebaseNotificationAsRead(userId, notificationId) {
  if (isFirebaseConfigured && userId && notificationId && !notificationId.startsWith('n_')) {
    try {
      const docRef = doc(db, 'users', userId, 'notifications', notificationId);
      await updateDoc(docRef, { read: true });
      return true;
    } catch (err) {
      console.warn('Firestore markNotificationAsRead error:', err);
    }
  }

  const current = getStoredLocalNotifications().map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveStoredLocalNotifications(current);
  return true;
}

/**
 * Mark all user notifications as read in Firestore
 */
export async function markAllFirebaseNotificationsAsRead(userId, notifications = []) {
  if (isFirebaseConfigured && userId && db) {
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        if (!n.read && !n.id.startsWith('n_')) {
          const ref = doc(db, 'users', userId, 'notifications', n.id);
          batch.update(ref, { read: true });
        }
      });
      await batch.commit();
      return true;
    } catch (err) {
      console.warn('Firestore markAllNotificationsAsRead batch error:', err);
    }
  }

  const current = getStoredLocalNotifications().map((n) => ({ ...n, read: true }));
  saveStoredLocalNotifications(current);
  return true;
}

/**
 * Request Web Push Notification Permission (FCM / Browser Push)
 */
export async function requestPushNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { supported: false, status: 'unsupported' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return { supported: true, status: 'granted' };
    }
    return { supported: true, status: permission };
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return { supported: false, error: err.message };
  }
}

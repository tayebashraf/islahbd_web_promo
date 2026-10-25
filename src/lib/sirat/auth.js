'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for approved writer or demo user session
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sirat_demo_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser({ uid: parsed.uid, displayName: parsed.displayName, email: parsed.email });
          setUserProfile(parsed);
        } else if (localStorage.getItem('sirat_writer_approved') === 'true') {
          const authorName = localStorage.getItem('sirat_approved_author_name') || 'অনুমোদিত গবেষক';
          const approvedProfile = {
            uid: 'author-approved',
            displayName: authorName,
            email: 'author@sirat.blog',
            role: 'writer',
            isWriter: true,
            isVerified: true,
            writerStatus: 'approved',
            seniorityRank: 2,
            expertise: 'সিরাত গবেষক ও তাহকিক লেখক',
          };
          setUser({ uid: approvedProfile.uid, displayName: approvedProfile.displayName, email: approvedProfile.email });
          setUserProfile(approvedProfile);
        }
      } catch (e) {
        console.error('Error reading saved user session:', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data());
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        // Only clear if no localStorage session is active
        if (typeof window !== 'undefined' && !localStorage.getItem('sirat_demo_user') && localStorage.getItem('sirat_writer_approved') !== 'true') {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    // Listen for custom writer approval event
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem('sirat_demo_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser({ uid: parsed.uid, displayName: parsed.displayName, email: parsed.email });
          setUserProfile(parsed);
        } else if (localStorage.getItem('sirat_writer_approved') === 'true') {
          const authorName = localStorage.getItem('sirat_approved_author_name') || 'অনুমোদিত গবেষক';
          const approvedProfile = {
            uid: 'author-approved',
            displayName: authorName,
            email: 'author@sirat.blog',
            role: 'writer',
            isWriter: true,
            isVerified: true,
            writerStatus: 'approved',
            seniorityRank: 2,
            expertise: 'সিরাত গবেষক ও তাহকিক লেখক',
          };
          setUser({ uid: approvedProfile.uid, displayName: approvedProfile.displayName, email: approvedProfile.email });
          setUserProfile(approvedProfile);
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('sirat_auth_update', handleStorageUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('sirat_auth_update', handleStorageUpdate);
    };
  }, []);


  const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signUp = async (email, password, displayName, phone = '') => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      displayName,
      email,
      phone: phone || '',
      photoURL: null,
      bio: '',
      expertise: '',
      role: 'reader',
      isVerified: false,
      isBanned: false,
      writerStatus: null,
      joinedAt: serverTimestamp(),
    });

    return result.user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user profile exists, create if not
    const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!profileDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        bio: '',
        expertise: '',
        role: 'reader',
        isVerified: false,
        writerStatus: null,
        joinedAt: serverTimestamp(),
      });
    }

    return result.user;
  };

  const loginAsDemoScholar = (scholarId) => {
    const demoProfiles = {
      'author-1': {
        uid: 'author-1',
        displayName: 'ড. আবদুর রহমান',
        email: 'abdur@example.com',
        role: 'writer',
        isVerified: true,
        writerStatus: 'approved',
        seniorityRank: 3,
        expertise: 'সিরাত গবেষণা, ইসলামী ইতিহাস',
      },
      'author-4': {
        uid: 'author-4',
        displayName: 'শায়খ আহমাদ আলী',
        email: 'ahmad@example.com',
        role: 'writer',
        isVerified: true,
        writerStatus: 'approved',
        seniorityRank: 3,
        expertise: 'দাওয়াহ, ইসলামী শিক্ষা',
      },
      'author-2': {
        uid: 'author-2',
        displayName: 'উস্তাযা ফাতিমা খান',
        email: 'fatima@example.com',
        role: 'writer',
        isVerified: false,
        writerStatus: 'under_review',
        seniorityRank: 2,
        expertise: 'হাদিস শাস্ত্র, নববী আখলাক',
      },
      'reader-1': {
        uid: 'reader-1',
        displayName: 'মুহাম্মাদ খালিদ',
        email: 'khalid@example.com',
        role: 'reader',
        isVerified: false,
        writerStatus: null,
        seniorityRank: 1,
        expertise: 'সিরাত অনুরাগী পাঠক',
      },
    };

    const target = demoProfiles[scholarId] || demoProfiles['author-1'];
    setUser({ uid: target.uid, displayName: target.displayName, email: target.email });
    setUserProfile(target);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sirat_demo_user', JSON.stringify(target));
    }
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sirat_demo_user');
    }
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setUserProfile(null);
  };

  const enableWriterMode = (customProfile = {}) => {
    const defaultAuthor = {
      uid: customProfile.uid || 'author-approved',
      displayName: customProfile.displayName || 'মুহাম্মাদ খালিদ হাসান',
      email: customProfile.email || 'author@sirat.blog',
      role: 'writer',
      isWriter: true,
      isVerified: true,
      writerStatus: 'approved',
      seniorityRank: 2,
      expertise: customProfile.expertise || 'সিরাত গবেষক ও তাহকিক লেখক',
      ...customProfile,
    };
    setUser({ uid: defaultAuthor.uid, displayName: defaultAuthor.displayName, email: defaultAuthor.email });
    setUserProfile(defaultAuthor);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sirat_demo_user', JSON.stringify(defaultAuthor));
      localStorage.setItem('sirat_writer_approved', 'true');
      localStorage.setItem('sirat_approved_author_name', defaultAuthor.displayName);
      window.dispatchEvent(new Event('sirat_auth_update'));
    }
  };

  const isWriter = Boolean(
    userProfile?.role === 'writer' ||
    userProfile?.role === 'scholar' ||
    userProfile?.role === 'admin' ||
    userProfile?.writerStatus === 'approved' ||
    userProfile?.isVerified === true ||
    (typeof window !== 'undefined' && localStorage.getItem('sirat_writer_approved') === 'true')
  );

  const isPendingWriter = Boolean(
    userProfile?.writerStatus === 'pending' ||
    userProfile?.writerStatus === 'under_review'
  );

  const isBanned = Boolean(userProfile?.isBanned === true);
  const isAdmin = Boolean(userProfile?.role === 'admin' || user?.email?.includes('admin'));

  const value = {
    user,
    userProfile,
    isWriter,
    isPendingWriter,
    isBanned,
    isAdmin,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    loginAsDemoScholar,
    enableWriterMode,
    signOut,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

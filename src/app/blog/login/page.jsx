'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/sirat/auth';
import Button from '@/components/sirat/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/blog/dashboard');
    } catch (err) {
      setError('লগইন করা যায়নি। ইমেইল ও পাসওয়ার্ড পুনরায় পরীক্ষা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/blog/dashboard');
    } catch (err) {
      setError('গুগল দিয়ে লগইন করা যায়নি। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="page-container fade-in" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-20)' }}>
      <div className="narrow-container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <h1 style={{
            fontFamily: 'var(--font-bengali-body)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}>
            লগ ইন করুন
          </h1>
          <p style={{ fontFamily: 'var(--font-bengali-ui)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
            সীরাত.ব্লগে আপনাকে স্বাগতম
          </p>
        </div>

        {error && (
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-error-bg)',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-error)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-6)',
            fontFamily: 'var(--font-bengali-ui)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontFamily: 'var(--font-bengali-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}>
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-latin)',
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontFamily: 'var(--font-bengali-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}>
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            লগ ইন
          </Button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          margin: 'var(--space-6) 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border-secondary)' }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>অথবা ১-ক্লিকে টেস্ট করুন</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border-secondary)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              signInWithGoogle();
              router.push('/blog/dashboard');
            }}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--font-bengali-ui)',
              fontSize: '13.5px',
              fontWeight: 600,
            }}
          >
            ড. আবদুর রহমান (ভেরিফাইড গবেষক হিসেবে লগইন)
          </button>

          <button
            type="button"
            onClick={() => {
              signInWithGoogle();
              router.push('/blog/dashboard');
            }}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-surface)',
              cursor: 'pointer',
              fontFamily: 'var(--font-bengali-ui)',
              fontSize: '13.5px',
              fontWeight: 600,
            }}
          >
            শায়খ আহমাদ আলী (সিনিয়র স্কলার হিসেবে লগইন)
          </button>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: 'var(--space-8)',
          fontFamily: 'var(--font-bengali-ui)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
        }}>
          নতুন লেখক হিসেবে যুক্ত হতে চান?{' '}
          <Link href="/blog/apply" style={{ color: 'var(--color-brand-primary)', fontWeight: 'var(--weight-medium)' }}>
            লেখক হিসেবে আবেদন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

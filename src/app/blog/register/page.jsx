'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/sirat/auth';
import Button from '@/components/sirat/ui/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name, phone);
      router.push('/blog/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট আছে।');
      } else {
        setError('অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।');
      }
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
      setError('গুগল দিয়ে সাইন আপ করা যায়নি। আবার চেষ্টা করুন।');
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
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p style={{ fontFamily: 'var(--font-bengali-ui)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
            পড়ুন, লিখুন, জ্ঞান ভাগ করুন
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
            <label htmlFor="name" style={{
              display: 'block', fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)',
            }}>নাম</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="আপনার নাম"
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-bengali-ui)' }}
            />
          </div>
          <div>
            <label htmlFor="email" style={{
              display: 'block', fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)',
            }}>ইমেইল</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-latin)' }}
            />
          </div>
          <div>
            <label htmlFor="phone" style={{
              display: 'block', fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)',
            }}>মোবাইল নম্বর (জরুরি যোগাযোগ ও ভেরিফিকেশন)</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="০১৭xxxxxxxx"
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-latin)' }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{
              display: 'block', fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)',
            }}>পাসওয়ার্ড</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="কমপক্ষে ৬ অক্ষর"
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)' }}
            />
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            অ্যাকাউন্ট তৈরি করুন
          </Button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', margin: 'var(--space-6) 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border-secondary)' }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>অথবা</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border-secondary)' }} />
        </div>

        <Button variant="secondary" size="lg" fullWidth onClick={handleGoogleSignIn}>
          গুগল দিয়ে সাইন আপ করুন
        </Button>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-8)', fontFamily: 'var(--font-bengali-ui)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link href="/blog/login" style={{ color: 'var(--color-brand-primary)', fontWeight: 'var(--weight-medium)' }}>
            লগ ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

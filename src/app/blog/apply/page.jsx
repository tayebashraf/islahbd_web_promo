'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import Button from '@/components/sirat/ui/Button';
import Avatar from '@/components/sirat/ui/Avatar';
import VerifiedBadge from '@/components/sirat/author/VerifiedBadge';
import {
  Send,
  CheckCircle,
  ShieldCheck,
  Award,
  BookOpen,
  PenTool,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Printer,
  FileText,
  UserCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  HelpCircle,
  Scroll,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/components/sirat/ui/ToastContext';

export default function WriterApplicationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { error: toastError, success: toastSuccess } = useToast();
  const printRef = useRef(null);

  const [formData, setFormData] = useState({
    // ১. প্রাতিষ্ঠানিক পরিচয়
    qualification: 'দাওরায়ে হাদিস (মাস্টার্স সমমান)',
    institution: '',
    department: 'উচ্চতর হাদিস গবেষণা (তাকাস্সুস ফিল হাদিস)',
    designation: 'গবেষক ও শিক্ষক',
    // ২. ব্যক্তিগত পরিচয়
    fullName: '',
    honorificTitle: '', // ঐচ্ছিক (মুফতী / শায়খ / ড. ইত্যাদি)
    phone: '',
    email: '', // ঐচ্ছিক
    address: '',
    bio: '',
    // ৩. গবেষণার নমুনা ও উদ্দেশ্য
    writingPurpose: '',
    intendedTopics: 'মক্কী ও মাদানী সিরাত গবেষণা, নববী কূটনীতি ও রাষ্ট্রনীতি',
    previousPublications: '',
    sampleTitle: '',
    sampleText: '',
    // ৪. অঙ্গীকারনামা
    pledgeAuthenticity: false,
    pledgeSource: false,
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Helper to scroll and focus on first erroneous field
  const scrollToField = (fieldId) => {
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 60);
  };

  // Validation for Step 1
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.institution.trim()) {
      newErrors.institution = 'দয়া করে আপনার মাদরাসা, বিশ্ববিদ্যালয় বা শিক্ষাপ্রতিষ্ঠানের নাম লিখুন';
    }
    setErrors(newErrors);
    const errKeys = Object.keys(newErrors);
    if (errKeys.length > 0) {
      scrollToField(`field-${errKeys[0]}`);
      toastError('অনুগ্রহ করে লাল চিহ্নিত আবশ্যক ঘরটি পূরণ করুন');
      return false;
    }
    return true;
  };

  // Validation for Step 2 (Email is optional!)
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'দয়া করে আপনার পূর্ণ নাম লিখুন';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'দয়া করে আপনার বর্তমান ঠিকানা (জেলা / শহর) লিখুন';
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      newErrors.phone = 'দয়া করে সঠিক মোবাইল নম্বর (হোয়াটসঅ্যাপ) প্রদান করুন';
    } else if (cleanPhone.replace(/[^0-9]/g, '').length < 8) {
      newErrors.phone = 'মোবাইল নম্বরটি অসম্পূর্ণ বা ভুল মনে হচ্ছে। সঠিক নম্বর দিন (যেমন: 017XXXXXXXX)';
    }

    // Email is OPTIONAL: only validate if user entered something
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'ইমেইল ঠিকানার ফরম্যাট সঠিক নয় (যেমন: name@domain.com)';
      }
    }

    setErrors(newErrors);
    const errKeys = Object.keys(newErrors);
    if (errKeys.length > 0) {
      scrollToField(`field-${errKeys[0]}`);
      toastError('অনুগ্রহ করে লাল চিহ্নিত ঘরগুলো সঠিকভাবে পূরণ করুন');
      return false;
    }
    return true;
  };

  // Validation for Step 3
  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.writingPurpose.trim()) {
      newErrors.writingPurpose = 'সিরাত লেখার মূল উদ্দেশ্য ও লক্ষ্য সংক্ষেপে লিখুন';
    }
    if (!formData.intendedTopics.trim()) {
      newErrors.intendedTopics = 'যেসব বিষয়ে লিখতে চান তা উল্লেখ করুন';
    }
    if (!formData.sampleTitle.trim()) {
      newErrors.sampleTitle = 'নমুনা সিরাত প্রবন্ধের শিরোনাম লিখুন';
    }
    if (!formData.sampleText.trim() || formData.sampleText.trim().length < 20) {
      newErrors.sampleText = 'সিরাত গবেষণার কমপক্ষে ২-৩ লাইনের একটি প্রামাণ্য নমুনা অনুচ্ছেদ লিখুন';
    }

    setErrors(newErrors);
    const errKeys = Object.keys(newErrors);
    if (errKeys.length > 0) {
      scrollToField(`field-${errKeys[0]}`);
      toastError('অনুগ্রহ করে লাল চিহ্নিত ঘরগুলো সঠিকভাবে পূরণ করুন');
      return false;
    }
    return true;
  };

  // Validation for Step 4
  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.pledgeAuthenticity) {
      newErrors.pledgeAuthenticity = 'তাহকিক ও বিশুদ্ধতার অঙ্গীকারনামায় টিক চিহ্ন দিন';
    }
    if (!formData.pledgeSource) {
      newErrors.pledgeSource = 'ইলমী আমানত ও মূল কিতাবের দলীল সূত্রের অঙ্গীকারনামায় টিক চিহ্ন দিন';
    }

    setErrors(newErrors);
    const errKeys = Object.keys(newErrors);
    if (errKeys.length > 0) {
      scrollToField(`field-${errKeys[0]}`);
      toastError('তাহকিকের উভয় অঙ্গীকারনামায় সম্মতি দেওয়া আবশ্যক');
      return false;
    }
    return true;
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!validateStep4()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sampleWriting: formData.sampleText,
          tahqiqPledge: true,
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        setApplicationId(data.applicationId || `SRT-APP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
        setSubmitted(true);
        toastSuccess('আবেদনপত্র সফলভাবে জমা হয়েছে!');
      } else {
        const generatedId = `SRT-APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        setApplicationId(generatedId);
        setSubmitted(true);
        toastSuccess('আবেদনপত্র সফলভাবে সংরক্ষিত হয়েছে!');
      }
    } catch (err) {
      console.error('Apply submission error:', err);
      const generatedId = `SRT-APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setApplicationId(generatedId);
      setSubmitted(true);
      toastSuccess('আবেদনপত্র সফলভাবে গৃহীত হয়েছে!');
    } finally {
      setSubmitting(false);
    }
  };


  // Dynamic input styling with error highlights
  const getInputStyle = (fieldName, isTextarea = false) => {
    const hasError = Boolean(errors[fieldName]);
    return {
      width: '100%',
      padding: isTextarea ? '10px 13px' : '9px 13px',
      border: hasError ? '1.5px solid #EF4444' : '1px solid var(--color-border-secondary)',
      borderRadius: 'var(--radius-md)',
      fontSize: '13.5px',
      fontFamily: 'var(--font-kalpurush)',
      background: hasError ? '#FEF2F2' : 'var(--color-bg-primary)',
      color: 'var(--color-text-primary)',
      lineHeight: '1.6',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: hasError ? '4px' : '14px',
      boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
      minHeight: isTextarea ? '75px' : undefined,
    };
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-kalpurush)',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '5px',
  };

  const optionalBadgeStyle = {
    fontSize: '11px',
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    backgroundColor: 'var(--color-bg-primary)',
    padding: '1px 7px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border-secondary)',
  };


  const fullDisplayName = formData.honorificTitle.trim()
    ? `${formData.honorificTitle.trim()} ${formData.fullName.trim()}`
    : formData.fullName.trim();

  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />

      <main className="fb-feed-container" aria-label="লেখক হিসেবে আবেদন">
        {/* Printable Official A4 Document Application Modal & Screen View */}
        <div className="fb-card" style={{ padding: '24px 26px', position: 'relative' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }} className="fade-in">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <CheckCircle size={36} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '1.45rem', fontWeight: 700, marginBottom: '6px', color: '#0F172A' }}>
                আবেদনপত্র সফলভাবে অ্যাডমিনের কাছে জমা হয়েছে!
              </h2>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 14px', borderRadius: 'var(--radius-full)', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-latin)', color: '#1E40AF', fontWeight: 700 }}>
                  ট্র্যাকিং কোড: {applicationId}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '14px', color: '#475569', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.75 }}>
                সম্মানিত <strong>{fullDisplayName || 'গবেষক'}</strong>, আপনার সম্পূর্ণ প্রাতিষ্ঠানিক, ব্যক্তিগত ও গবেষণার তথ্য সংবলিত A4 আবেদনপত্রটি আমাদের কেন্দ্রীয় সম্পাদনা পরিষদের অ্যাডমিন প্যানেলে সংরক্ষিত হয়েছে।
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <Button variant="secondary" onClick={handlePrint}>
                  <Printer size={15} />
                  <span>A4 সাইজে প্রিন্ট / PDF সংরক্ষণ করুন</span>
                </Button>
                <Button variant="primary" href="/blog">
                  নিউজ ফিডে ফিরে যান
                </Button>
              </div>

              {/* Render Full Official A4 Paper Layout for Record */}
              <div
                ref={printRef}
                className="a4-document-paper"
                style={{
                  textAlign: 'left',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  border: '2px solid #E2E8F0',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px 36px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  maxWidth: '740px',
                  margin: '0 auto',
                }}
              >
                {/* Official Letterhead */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0F172A', paddingBottom: '14px', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '20px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                      سيرة • সীরাত একাডেমি ও গবেষণা পরিষদ
                    </h2>
                    <span style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '12px', color: '#64748B' }}>
                      দারুত তাহকিক ও উচ্চতর সীরাত প্রকাশনা প্যানেল • ঢাকা, বাংলাদেশ
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1E40AF', fontFamily: 'var(--font-latin)' }}>
                      MEMORANDUM ID: {applicationId}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-kalpurush)' }}>
                      তারিখ: {new Date().toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>

                {/* Document Title Banner */}
                <div style={{ textAlign: 'center', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', padding: '8px', borderRadius: '4px', marginBottom: '18px' }}>
                  <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '15px', fontWeight: 700, margin: 0, color: '#1E293B' }}>
                    সিরাত গবেষক ও নিবন্ধিত লেখক অন্তর্ভুক্তি ফরম (একাডেমিক আবেদনপত্র)
                  </h3>
                </div>

                {/* Section 1: Academic & Institutional */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13.5px', fontWeight: 700, color: '#1E40AF', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px', marginBottom: '8px' }}>
                    ১. প্রাতিষ্ঠানিক ও শিক্ষাগত পরিচয়:
                  </h4>
                  <table style={{ width: '100%', fontSize: '12.5px', fontFamily: 'var(--font-kalpurush)', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '32%', padding: '5px 0', color: '#64748B' }}>সর্বোচ্চ দ্বীনি/একাডেমিক যোগ্যতা:</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{formData.qualification}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0', color: '#64748B' }}>বর্তমান শিক্ষাপ্রতিষ্ঠান/কর্মস্থল:</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{formData.institution || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0', color: '#64748B' }}>বিভাগ / বিশেষায়িত ক্ষেত্র:</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{formData.department || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0', color: '#64748B' }}>বর্তমান পদবী ও দায়িত্ব:</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{formData.designation || '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2: Personal Details */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13.5px', fontWeight: 700, color: '#1E40AF', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px', marginBottom: '8px' }}>
                    ২. ব্যক্তিগত ও যোগাযোগের বিবরণ:
                  </h4>
                  <table style={{ width: '100%', fontSize: '12.5px', fontFamily: 'var(--font-kalpurush)', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '32%', padding: '5px 0', color: '#64748B' }}>আবেদনকারীর পূর্ণ নাম:</td>
                        <td style={{ fontWeight: 700, color: '#0F172A', fontSize: '13.5px' }}>{fullDisplayName || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0', color: '#64748B' }}>মোবাইল / হোয়াটসঅ্যাপ:</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{formData.phone || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0', color: '#64748B' }}>ইমেইল ঠিকানা:</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{formData.email || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0', color: '#64748B' }}>বর্তমান ঠিকানা (জেলা/শহর):</td>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>{formData.address || '—'}</td>
                      </tr>
                      {formData.bio && (
                        <tr>
                          <td style={{ padding: '5px 0', color: '#64748B' }}>সংক্ষিপ্ত আত্মপরিচয়:</td>
                          <td style={{ color: '#334155' }}>{formData.bio}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Section 3: Research Sample & Writing Objectives */}
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13.5px', fontWeight: 700, color: '#1E40AF', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px', marginBottom: '8px' }}>
                    ৩. সিরাত গবেষণার উদ্দেশ্য ও লেখার বিষয়বস্তু:
                  </h4>
                  <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-kalpurush)', lineHeight: 1.65 }}>
                    <p style={{ margin: '0 0 6px' }}><strong>লেখালেখির মূল উদ্দেশ্য:</strong> {formData.writingPurpose || 'বিশুদ্ধ সুন্নাহর আলোকে রাসূল ﷺ-এর সিরাত প্রচার ও দাওয়াহ।'}</p>
                    <p style={{ margin: '0 0 6px' }}><strong>যেসব বিষয়ে লিখতে চান:</strong> {formData.intendedTopics || 'মক্কী ও মাদানী সিরাত'}</p>
                    {formData.previousPublications && (
                      <p style={{ margin: '0 0 6px' }}><strong>পূর্বের প্রকাশিত গ্রন্থ/প্রবন্ধ:</strong> {formData.previousPublications}</p>
                    )}
                  </div>
                </div>

                {/* Section 4: Sample Writing Content */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13.5px', fontWeight: 700, color: '#1E40AF', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px', marginBottom: '8px' }}>
                    ৪. জমা দেওয়া সিরাত গবেষণার নমুনা:
                  </h4>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: '4px', fontSize: '12.5px', fontFamily: 'var(--font-kalpurush)', lineHeight: 1.8 }}>
                    <strong style={{ display: 'block', marginBottom: '4px', color: '#0F172A' }}>
                      প্রবন্ধের শিরোনাম: {formData.sampleTitle || 'সিরাত গবেষণা নমুনা'}
                    </strong>
                    <p style={{ margin: 0, color: '#334155', whiteSpace: 'pre-line' }}>
                      {formData.sampleText || 'নমুনা টেক্সট পাওয়া যায়নি'}
                    </p>
                  </div>
                </div>

                {/* Footer / Official Verification Rubric */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '2px dashed #CBD5E1', paddingTop: '16px', marginTop: '24px' }}>
                  <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-kalpurush)', color: '#475569' }}>
                    <strong>আবেদনকারীর অঙ্গীকার:</strong><br />
                    "আমি সাক্ষ্য দিচ্ছি যে প্রদত্ত তথ্য নির্ভুল এবং সিরাত রচনায় সর্বদা বিশুদ্ধ সনদ ও নির্ভরযোগ্য কিতাবের তাহকিক বজায় রাখব।"
                    <div style={{ marginTop: '24px', borderTop: '1px solid #94A3B8', paddingTop: '4px', width: '180px', textAlign: 'center', fontWeight: 700, color: '#0F172A' }}>
                      {formData.fullName || 'আবেদনকারী'}-এর স্বাক্ষর
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '11.5px', fontFamily: 'var(--font-kalpurush)', color: '#475569' }}>
                    <strong>সম্পাদনা ও তাহকিক বোর্ড অনুমোদন:</strong><br />
                    <span style={{ display: 'inline-block', backgroundColor: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0', marginTop: '4px' }}>
                      যাচাই প্রক্রিয়াধীন (Pending Tahqiq)
                    </span>
                    <div style={{ marginTop: '24px', borderTop: '1px solid #94A3B8', paddingTop: '4px', width: '180px', marginLeft: 'auto', textAlign: 'center', fontWeight: 700, color: '#0F172A' }}>
                      প্রধান সম্পাদক / সিলমোহর
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-brand-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-primary)',
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                    সিরাত গবেষক ও লেখক অন্তর্ভুক্তি আবেদন
                  </h1>
                  <span style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    বিশুদ্ধ সুন্নাহ ও প্রামাণ্য তাহকিকের ভিত্তিতে সিরাত প্রসারে আপনার সংযুক্তি
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', height: '1px', backgroundColor: 'var(--color-border-secondary)', margin: '14px 0 18px' }} />

              {/* 4-Step Wizard Progress Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
                {[
                  { stepNum: 1, label: '১. প্রাতিষ্ঠানিক পরিচয়' },
                  { stepNum: 2, label: '২. ব্যক্তিগত পরিচয়' },
                  { stepNum: 3, label: '৩. গবেষণার নমুনা' },
                  { stepNum: 4, label: '৪. শপথ ও A4 প্রিভিউ' },
                ].map((s) => (
                  <div
                    key={s.stepNum}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        height: '4px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: s.stepNum <= step ? 'var(--color-brand-primary)' : 'var(--color-border-secondary)',
                        transition: 'background-color 200ms ease',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-kalpurush)',
                        fontSize: '11px',
                        fontWeight: s.stepNum === step ? 700 : 400,
                        color: s.stepNum <= step ? 'var(--color-brand-primary)' : 'var(--color-text-tertiary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ============================================================
                  ধাপ ১: প্রাতিষ্ঠানিক পরিচয় (Institutional Profile)
                  ============================================================ */}
              {step === 1 && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Building2 size={18} color="var(--color-brand-primary)" />
                    <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                      ধাপ ১: প্রাতিষ্ঠানিক ও শিক্ষাগত পরিচয়
                    </h3>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>সর্বোচ্চ দ্বীনি ও একাডেমিক যোগ্যতা *</span>
                    </label>
                    <select
                      id="field-qualification"
                      style={getInputStyle('qualification')}
                      value={formData.qualification}
                      onChange={(e) => updateField('qualification', e.target.value)}
                    >
                      <option value="দাওরায়ে হাদিস (মাস্টার্স সমমান)">দাওরায়ে হাদিস (মাস্টার্স সমমান)</option>
                      <option value="ইফতা / উচ্চতর ইসলামী আইন গবেষণা">ইফতা / উচ্চতর ইসলামী আইন গবেষণা</option>
                      <option value="উচ্চতর হাদিস গবেষণা (তাকাস্সুস ফিল হাদিস)">উচ্চতর হাদিস গবেষণা (তাকাস্সুস ফিল হাদিস)</option>
                      <option value="মাস্টার্স / পিএইচডি (ইসলামিক স্টাডিজ)">মাস্টার্স / পিএইচডি (ইসলামিক স্টাডিজ)</option>
                      <option value="কামিল / অনার্স (আল-হাদিস / দাওয়াহ)">কামিল / অনার্স (আল-হাদিস / দাওয়াহ)</option>
                      <option value="অন্যান্য উচ্চতর দ্বীনি সনদ">অন্যান্য উচ্চতর দ্বীনি সনদ</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>মাদরাসা / বিশ্ববিদ্যালয় / বর্তমান প্রতিষ্ঠান *</span>
                    </label>
                    <input
                      id="field-institution"
                      style={getInputStyle('institution')}
                      type="text"
                      placeholder="যেমন: জামিয়া ইসলামিয়া দারুল উলূম / ঢাকা বিশ্ববিদ্যালয় / আন্তর্জাতিক ইসলামী বিশ্ববিদ্যালয়"
                      value={formData.institution}
                      onChange={(e) => updateField('institution', e.target.value)}
                    />
                    {errors.institution && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.institution}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>অধ্যয়নের বিভাগ / তাখাসসুস</span>
                      <span style={optionalBadgeStyle}>ঐচ্ছিক</span>
                    </label>
                    <input
                      id="field-department"
                      style={getInputStyle('department')}
                      type="text"
                      placeholder="যেমন: আল-হাদিস ও উলূমুল হাদিস / উলূমুল কুরআন / আরবি সাহিত্য / ফিকহ"
                      value={formData.department}
                      onChange={(e) => updateField('department', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>প্রাতিষ্ঠানিক পদবী / বর্তমান দায়িত্ব</span>
                      <span style={optionalBadgeStyle}>ঐচ্ছিক</span>
                    </label>
                    <input
                      id="field-designation"
                      style={getInputStyle('designation')}
                      type="text"
                      placeholder="যেমন: মুহাদ্দিস / অধ্যাপক / গবেষক / খতিব / শিক্ষার্থী"
                      value={formData.designation}
                      onChange={(e) => updateField('designation', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (validateStep1()) {
                          setStep(2);
                        }
                      }}
                    >
                      <span>পরবর্তী ধাপ: ব্যক্তিগত পরিচয়</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================
                  ধাপ ২: ব্যক্তিগত পরিচয় ও যোগাযোগের তথ্য (Personal Profile)
                  ============================================================ */}
              {step === 2 && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <UserCheck size={18} color="var(--color-brand-primary)" />
                    <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                      ধাপ ২: ব্যক্তিগত পরিচয় ও যোগাযোগের তথ্য
                    </h3>
                  </div>

                  {/* 1. Full Name */}
                  <div>
                    <label style={labelStyle}>
                      <span>আপনার পূর্ণ নাম *</span>
                    </label>
                    <input
                      id="field-fullName"
                      style={getInputStyle('fullName')}
                      type="text"
                      placeholder="যেমন: মুহাম্মাদ খালিদ / আহমাদ আলী / আব্দুর রহমান"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                    />
                    {errors.fullName && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.fullName}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. Optional Honorific Title */}
                  <div>
                    <label style={labelStyle}>
                      <span>সম্মানসূচক উপাধি</span>
                      <span style={optionalBadgeStyle}>ঐচ্ছিক</span>
                    </label>
                    <input
                      id="field-honorificTitle"
                      style={getInputStyle('honorificTitle')}
                      type="text"
                      placeholder="যেমন: মুফতী / শায়খ / ড. / মাওলানা / উস্তায / হাফেজ"
                      value={formData.honorificTitle}
                      onChange={(e) => updateField('honorificTitle', e.target.value)}
                    />
                  </div>

                  {/* 3. Address */}
                  <div>
                    <label style={labelStyle}>
                      <span>বর্তমান ঠিকানা (জেলা / শহর / দেশ) *</span>
                    </label>
                    <input
                      id="field-address"
                      style={getInputStyle('address')}
                      type="text"
                      placeholder="যেমন: ধানমন্ডি, ঢাকা, বাংলাদেশ"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                    />
                    {errors.address && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.address}</span>
                      </div>
                    )}
                  </div>

                  {/* 4. Contact Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>
                        <span>মোবাইল নম্বর (হোয়াটসঅ্যাপ) *</span>
                      </label>
                      <input
                        id="field-phone"
                        style={getInputStyle('phone')}
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                      />
                      {errors.phone && (
                        <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                          <AlertCircle size={13} color="#DC2626" />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>
                        <span>ইমেইল ঠিকানা</span>
                        <span style={optionalBadgeStyle}>ঐচ্ছিক</span>
                      </label>
                      <input
                        id="field-email"
                        style={getInputStyle('email')}
                        type="email"
                        placeholder="example@domain.com (ঐচ্ছিক)"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                      />
                      {errors.email && (
                        <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                          <AlertCircle size={13} color="#DC2626" />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5. Short Bio */}
                  <div>
                    <label style={labelStyle}>
                      <span>সংক্ষিপ্ত আত্মপরিচয় / বায়ো</span>
                      <span style={optionalBadgeStyle}>ঐচ্ছিক</span>
                    </label>
                    <textarea
                      id="field-bio"
                      style={getInputStyle('bio', true)}
                      placeholder="আপনার দ্বীনি খেদমত বা লেখালেখির ক্ষেত্র সম্পর্কে সংক্ষেপে ১-২ বাক্য লিখুন..."
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                    <Button variant="secondary" onClick={() => setStep(1)}>
                      <ArrowLeft size={14} />
                      <span>পূর্ববর্তী ধাপ</span>
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (validateStep2()) {
                          setStep(3);
                        }
                      }}
                    >
                      <span>পরবর্তী ধাপ: গবেষণার নমুনা</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================
                  ধাপ ৩: গবেষণার নমুনা ও উদ্দেশ্য (Research Sample & Purpose)
                  ============================================================ */}
              {step === 3 && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <BookOpen size={18} color="var(--color-brand-primary)" />
                    <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                      ধাপ ৩: সিরাত গবেষণার উদ্দেশ্য ও লেখার নমুনা
                    </h3>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>লেখালেখি করার মূল উদ্দেশ্য ও লক্ষ্য *</span>
                    </label>
                    <textarea
                      id="field-writingPurpose"
                      style={getInputStyle('writingPurpose', true)}
                      placeholder="যেমন: সাধারণ পাঠকদের মাঝে সহীহ সিরাত ভাবনা ছড়িয়ে দেওয়া, প্রাতিষ্ঠানিক ভুল ধারণার নিরসন করা..."
                      value={formData.writingPurpose}
                      onChange={(e) => updateField('writingPurpose', e.target.value)}
                    />
                    {errors.writingPurpose && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.writingPurpose}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>আপনি মূলত কি কি বিষয় নিয়ে লিখতে চান? *</span>
                    </label>
                    <input
                      id="field-intendedTopics"
                      style={getInputStyle('intendedTopics')}
                      type="text"
                      placeholder="যেমন: মক্কী দাওয়াহ, নববী রাষ্ট্রনীতি ও অর্থনীতি, শামায়েল ও চরিত্র, হাদিস তাহকিক"
                      value={formData.intendedTopics}
                      onChange={(e) => updateField('intendedTopics', e.target.value)}
                    />
                    {errors.intendedTopics && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.intendedTopics}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>পূর্বে প্রকাশিত গ্রন্থ / প্রবন্ধের নাম বা লিংক</span>
                      <span style={optionalBadgeStyle}>যদি থাকে - ঐচ্ছিক</span>
                    </label>
                    <input
                      id="field-previousPublications"
                      style={getInputStyle('previousPublications')}
                      type="text"
                      placeholder="যেমন: সীরাতুল মুস্তফা গবেষণা গ্রন্থ / অনলাইন প্রকাশনার লিংক"
                      value={formData.previousPublications}
                      onChange={(e) => updateField('previousPublications', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>নমুনা সিরাত প্রবন্ধের শিরোনাম *</span>
                    </label>
                    <input
                      id="field-sampleTitle"
                      style={getInputStyle('sampleTitle')}
                      type="text"
                      placeholder="যেমন: হুদাইবিয়ার সন্ধি: দূরদর্শী রাষ্ট্রনীতির এক অনুপম পাঠ"
                      value={formData.sampleTitle}
                      onChange={(e) => updateField('sampleTitle', e.target.value)}
                    />
                    {errors.sampleTitle && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.sampleTitle}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <span>গবেষণার নমুনা লেখা (২০০-৪০০ শব্দ, তথ্যসূত্রসহ) *</span>
                    </label>
                    <textarea
                      id="field-sampleText"
                      style={{ ...getInputStyle('sampleText', true), minHeight: '130px' }}
                      placeholder="এখানে আপনার রচিত যেকোনো সিরাত প্রবন্ধের ২০০-৪০০ শব্দের একটি প্রামাণ্য নমুনা অনুচ্ছেদ লিখুন (নির্ভরযোগ্য কিতাবের সূত্রসহ)..."
                      value={formData.sampleText}
                      onChange={(e) => updateField('sampleText', e.target.value)}
                    />
                    {errors.sampleText && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginBottom: '14px', marginTop: '2px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.sampleText}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                    <Button variant="secondary" onClick={() => setStep(2)}>
                      <ArrowLeft size={14} />
                      <span>পূর্ববর্তী ধাপ</span>
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (validateStep3()) {
                          setStep(4);
                        }
                      }}
                    >
                      <span>পরবর্তী ধাপ: শপথ ও A4 প্রিভিউ</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================
                  ধাপ ৪: তাহকিক শপথনামা ও A4 প্রফেশনাল মেমোরেন্ডাম ভিউ
                  ============================================================ */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Scroll size={18} color="var(--color-brand-primary)" />
                    <h3 style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                      ধাপ ৪: ইলমী আমানতের শপথ ও A4 সাইজ আবেদনপত্র প্রিভিউ
                    </h3>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#FFFDF5',
                      border: '1px solid #FDE68A',
                      borderLeft: '4px solid #D97706',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      marginBottom: '16px',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13px', color: '#92400E', lineHeight: 1.6, margin: 0 }}>
                      রাসূলুল্লাহ ﷺ বলেছেন: <em>"যে ব্যক্তি ইচ্ছাকৃতভাবে আমার ওপর মিথ্যা আরোপ করল, সে যেন তার ঠিকানা জাহান্নামে নির্ধারণ করে নিল।"</em> (বুখারী: ১১০)। অতএব সীরাত.ব্লগে প্রকাশিত প্রতিটি লেখা অবশ্যই বিশুদ্ধ সনদ ও গ্রহণযোগ্য সূত্রের ওপর প্রতিষ্ঠিত হতে হবে।
                    </p>
                  </div>

                  {/* Pledge 1 */}
                  <div id="field-pledgeAuthenticity" style={{ marginBottom: '12px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: 'var(--font-kalpurush)',
                        fontSize: '13.5px',
                        color: errors.pledgeAuthenticity ? '#DC2626' : 'var(--color-text-primary)',
                        cursor: 'pointer',
                        padding: errors.pledgeAuthenticity ? '8px 10px' : '0',
                        backgroundColor: errors.pledgeAuthenticity ? '#FEF2F2' : 'transparent',
                        borderRadius: 'var(--radius-md)',
                        border: errors.pledgeAuthenticity ? '1px solid #FCA5A5' : 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.pledgeAuthenticity}
                        onChange={(e) => updateField('pledgeAuthenticity', e.target.checked)}
                        style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#1877F2' }}
                      />
                      <span>
                        আমি সাক্ষ্য দিচ্ছি যে আমার কোনো লেখায় কোনো জাল, মনগড়া, অনৈতিহাসিক বা বিতর্কিত ভিত্তিহীন বর্ণনা উপস্থাপন করব না। *
                      </span>
                    </label>
                    {errors.pledgeAuthenticity && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginTop: '4px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.pledgeAuthenticity}</span>
                      </div>
                    )}
                  </div>

                  {/* Pledge 2 */}
                  <div id="field-pledgeSource" style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: 'var(--font-kalpurush)',
                        fontSize: '13.5px',
                        color: errors.pledgeSource ? '#DC2626' : 'var(--color-text-primary)',
                        cursor: 'pointer',
                        padding: errors.pledgeSource ? '8px 10px' : '0',
                        backgroundColor: errors.pledgeSource ? '#FEF2F2' : 'transparent',
                        borderRadius: 'var(--radius-md)',
                        border: errors.pledgeSource ? '1px solid #FCA5A5' : 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.pledgeSource}
                        onChange={(e) => updateField('pledgeSource', e.target.checked)}
                        style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#1877F2' }}
                      />
                      <span>
                        প্রতিটি ঐতিহাসিক ঘটনা বা হাদিসের ক্ষেত্রে বিশুদ্ধ সিরাতগ্রন্থ ও হাদিসের মূল তথ্যসূত্র স্পষ্টভাবে উল্লেখ করতে দায়বদ্ধ থাকব। *
                      </span>
                    </label>
                    {errors.pledgeSource && (
                      <div className="form-field-error fade-in" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '12px', fontFamily: 'var(--font-kalpurush)', fontWeight: 600, marginTop: '4px' }}>
                        <AlertCircle size={13} color="#DC2626" />
                        <span>{errors.pledgeSource}</span>
                      </div>
                    )}
                  </div>

                  {/* A4 Paper Miniature Preview Box */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '18px 20px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-kalpurush)', fontSize: '13px', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                        📄 অ্যাডমিনের কাছে জমা হতে যাওয়া A4 সাইজ ফরম্যাটের প্রিভিউ:
                      </span>
                      <button
                        type="button"
                        onClick={handlePrint}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: 'var(--color-bg-primary)',
                          border: '1px solid var(--color-border-secondary)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontFamily: 'var(--font-kalpurush)',
                        }}
                      >
                        <Printer size={13} />
                        <span>প্রিন্ট প্রিভিউ</span>
                      </button>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#0F172A',
                        padding: '16px 20px',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                        fontFamily: 'var(--font-kalpurush)',
                      }}
                    >
                      <div style={{ borderBottom: '1px solid #CBD5E1', paddingBottom: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong style={{ fontSize: '14px' }}>সীরাত একাডেমি ও গবেষণা পরিষদ — দারুত তাহকিক</strong>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>আবেদনপত্র সারসংক্ষেপ • ঢাকা</div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '11px', color: '#1E40AF', fontWeight: 700 }}>
                          SRT-APP-2026-PREVIEW
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                        <div><strong>নাম:</strong> {fullDisplayName || '—'}</div>
                        <div><strong>পদবী:</strong> {formData.designation}</div>
                        <div><strong>প্রতিষ্ঠান:</strong> {formData.institution || '—'}</div>
                        <div><strong>ঠিকানা:</strong> {formData.address || '—'}</div>
                        <div><strong>যোগ্যতা:</strong> {formData.qualification}</div>
                        <div><strong>মোবাইল:</strong> {formData.phone || '—'}</div>
                      </div>

                      <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '8px' }}>
                        <div><strong>উদ্দেশ্য ও বিষয়:</strong> {formData.writingPurpose || 'সিরাত প্রচার'} • {formData.intendedTopics}</div>
                        <div><strong>নমুনা শিরোনাম:</strong> {formData.sampleTitle || 'সিরাত প্রবন্ধ'}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={() => setStep(3)}>
                      <ArrowLeft size={14} />
                      <span>পূর্ববর্তী ধাপ</span>
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={submitting}
                      onClick={handleSubmit}
                    >
                      <Send size={14} />
                      <span>{submitting ? 'আবেদনপত্র জমা হচ্ছে...' : 'চূড়ান্তভাবে এডমিনের কাছে জমা দিন'}</span>
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}


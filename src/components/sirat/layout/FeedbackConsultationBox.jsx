'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Heart,
  ChevronRight,
  X,
  MessageSquare,
} from 'lucide-react';
import Modal from '@/components/sirat/ui/Modal';
import Button from '@/components/sirat/ui/Button';
import { useToast } from '@/components/sirat/ui/ToastContext';
import './consultation.css';

export default function FeedbackConsultationBox({ variant = 'footer' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      error('অনুগ্রহ করে আপনার মূল্যবান পরামর্শটি লিখুন');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'সম্মানিত পাঠক',
          phone: phone.trim(),
          subject: subject.trim() || 'সাধারণ পরামর্শ ও মতামত',
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        success('জাযাকাল্লাহু খাইরান! আপনার মূল্যবান পরামর্শ ও মতামত সফলভাবে গৃহীত হয়েছে।');
        setMessage('');
        setSubject('');
        setIsOpen(false);
      } else {
        error(data.error || 'পরামর্শ পাঠাতে সমস্যা হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে যোগাযোগ ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Surface Card: The mobile number is NOT shown initially on the outside surface */}
      <div className="sirat-feedback-card-surface">
        <div className="sirat-feedback-surface-inner">
          <div className="sirat-feedback-surface-icon">
            <MessageSquare size={24} />
          </div>
          <div className="sirat-feedback-surface-text">
            <h4 className="sirat-feedback-surface-title">
              ইসলাহ ব্লগের সার্বিক উন্নতিতে আপনার সুপরামর্শ ও মতামত দিন
            </h4>
            <p className="sirat-feedback-surface-sub">
              বিশুদ্ধ দ্বীনি সিরাত চর্চা ও প্ল্যাটফর্মের উন্নয়নে আপনার গঠনমূলক পরামর্শ অত্যন্ত মূল্যবান।
            </p>
          </div>
          <button
            type="button"
            className="sirat-feedback-surface-btn"
            onClick={() => setIsOpen(true)}
            aria-label="পরামর্শ ও যোগাযোগ বক্স খুলুন"
          >
            <span>পরামর্শ দিন ও যোগাযোগ করুন</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Deep Consultation Modal: Shows Phone Number, WhatsApp Link, and Feedback Submission Form */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="পরামর্শ, গঠনমূলক মতামত ও সরাসরি যোগাযোগ"
        maxWidth="580px"
      >
        <div className="sirat-feedback-modal-content">
          <div className="sirat-feedback-contact-banner">
            <div className="sirat-feedback-banner-tag">
              <Sparkles size={14} />
              <span>সরাসরি যোগাযোগ ও পরামর্শ কেন্দ্র</span>
            </div>
            <p className="sirat-feedback-banner-desc">
              ইসলাহ ব্লগ পরিচালনায় যেকোনো পরামর্শ, প্রস্তাবনা বা সংশোধনের জন্য সরাসরি যোগাযোগ করতে পারেন:
            </p>

            <div className="sirat-feedback-direct-channels">
              {/* Direct Phone Call */}
              <a href="tel:+8801718763978" className="sirat-feedback-channel-item sirat-feedback-channel--phone">
                <div className="sirat-feedback-channel-icon">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="sirat-feedback-channel-label">সরাসরি ফোন করুন</div>
                  <div className="sirat-feedback-channel-val">০১৭১৮-৭৬৩৯৭৮</div>
                </div>
              </a>

              {/* WhatsApp Direct Message */}
              <a
                href="https://wa.me/8801718763978?text=আসসালামু%20আলাইকুম,%20ইসলাহ%20ব্লগ%20সম্পর্কে%20আমার%20পরামর্শ:"
                target="_blank"
                rel="noopener noreferrer"
                className="sirat-feedback-channel-item sirat-feedback-channel--whatsapp"
              >
                <div className="sirat-feedback-channel-icon">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="sirat-feedback-channel-label">হোয়াটসঅ্যাপে মেসেজ পাঠান</div>
                  <div className="sirat-feedback-channel-val">+880 1718-763978</div>
                </div>
              </a>
            </div>
          </div>

          <div className="sirat-feedback-form-divider">
            <span>অথবা নিচে সরাসরি আপনার সুপরামর্শ লিখুন</span>
          </div>

          {/* Feedback & Advice Online Form */}
          <form onSubmit={handleSubmit} className="sirat-feedback-form">
            <div className="sirat-feedback-grid-2">
              <div>
                <label className="sirat-feedback-label">আপনার নাম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  className="sirat-feedback-input"
                  placeholder="আপনার নাম"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="sirat-feedback-label">মোবাইল নম্বর (ঐচ্ছিক)</label>
                <input
                  type="tel"
                  className="sirat-feedback-input"
                  placeholder="০১৭xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="sirat-feedback-label">পরামর্শের বিষয়</label>
              <input
                type="text"
                className="sirat-feedback-input"
                placeholder="যেমন: সিরাত কুইজ বৃদ্ধি / লেখার বিষয়বস্তু / ওয়েবসাইট উন্নয়ন..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="sirat-feedback-label">
                বিস্তারিত সুপরামর্শ বা মতামত <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                rows={4}
                required
                className="sirat-feedback-textarea"
                placeholder="ইসলাহ ব্লগকে আরও সমৃদ্ধ করতে আপনার যেকোনো পরামর্শ বা দ্বীনি প্রস্তাবনা বিস্তারিত লিখুন..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="sirat-feedback-actions">
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                বন্ধ করুন
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                <Send size={15} style={{ marginRight: '6px' }} />
                পরামর্শ জমা দিন
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

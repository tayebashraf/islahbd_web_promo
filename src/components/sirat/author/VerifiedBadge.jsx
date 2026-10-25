'use client';

import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import './authorcard.css';

export const VerifiedBadge = ({
  status = 'approved',
  isVerified = true,
  size = 14,
  className = '',
  showLabel = false,
}) => {
  // Determine actual status based on isVerified or status string
  let actualStatus = status;
  if (isVerified === true) {
    actualStatus = 'approved';
  } else if (status === 'under_review') {
    actualStatus = 'under_review';
  } else {
    actualStatus = 'unverified';
  }

  if (actualStatus === 'approved') {
    return (
      <span
        className={`author-status-badge author-status-badge--verified ${className}`}
        title="সীরাত.ব্লগ কর্তৃক একাডেমিক ও শাস্ত্রীয়ভাবে যাচাইকৃত গবেষক"
        aria-label="যাচাইকৃত গবেষক"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className="author-status-badge__svg"
          style={{ verticalAlign: 'middle', flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" fill="#1877F2" />
          <path
            d="M7.5 12L10.5 15L16.5 9"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {showLabel && <span className="author-status-badge__label">যাচাইকৃত</span>}
      </span>
    );
  }

  if (actualStatus === 'under_review') {
    return (
      <span
        className={`author-status-badge author-status-badge--review-icon-only ${className}`}
        title="সম্পাদনা পরিষদে যাচাই-বাছাই প্রক্রিয়াধীন"
        aria-label="যাচাই প্রক্রিয়াধীন"
      >
        <Clock size={size} color="#D97706" style={{ verticalAlign: 'middle', flexShrink: 0 }} />
        {showLabel && <span className="author-status-badge__label">যাচাই প্রক্রিয়াধীন</span>}
      </span>
    );
  }

  // unverified
  if (showLabel) {
    return (
      <span
        className={`author-status-badge author-status-badge--unverified ${className}`}
        title="একাডেমিক যাচাইকরণ এখনও সম্পন্ন হয়নি"
        aria-label="যাচাইকৃত নয়"
      >
        <span className="author-status-badge__dot" />
        <span className="author-status-badge__label">যাচাইকৃত নয়</span>
      </span>
    );
  }

  return null;
};

export default VerifiedBadge;

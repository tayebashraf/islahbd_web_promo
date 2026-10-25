import React from 'react';

/**
 * Pure Circular Islamic Reaction Icons (গোল গোল আইকন)
 * Clean, compact, Facebook-style circular reactions with authentic Islamic motifs.
 */

// 1. جزاك الله (JazakAllah)
export const CalligraphyJazakallahIcon = ({ size = 22, className = '' }) => (
  <span
    className={`reaction-circle-icon rci-jazakallah ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.58)}px` }}
    aria-label="جَزَاكَ ٱللَّٰهُ"
  >
    🤲
  </span>
);

// 2. ما شاء الله (MashaAllah)
export const CalligraphyMashaallahIcon = ({ size = 22, className = '' }) => (
  <span
    className={`reaction-circle-icon rci-mashaallah ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.58)}px` }}
    aria-label="مَا شَاءَ ٱللَّٰهُ"
  >
    ✨
  </span>
);

// 3. الحمد لله (Alhamdulillah)
export const CalligraphyAlhamdulillahIcon = ({ size = 22, className = '' }) => (
  <span
    className={`reaction-circle-icon rci-alhamdulillah ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.58)}px` }}
    aria-label="ٱلْحَمْدُ لِلَّٰهِ"
  >
    🌿
  </span>
);

// 4. سبحان الله (SubhanAllah)
export const CalligraphySubhanallahIcon = ({ size = 22, className = '' }) => (
  <span
    className={`reaction-circle-icon rci-subhanallah ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.58)}px` }}
    aria-label="سُبْحَانَ ٱللَّٰهِ"
  >
    ☀️
  </span>
);

// 5. ﷺ (Salawat / Durood)
export const CalligraphySalawatIcon = ({ size = 22, className = '' }) => (
  <span
    className={`reaction-circle-icon rci-salawat ${className}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${Math.round(size * 0.65)}px`,
      fontFamily: "'Amiri', serif",
      fontWeight: 700,
    }}
    aria-label="ﷺ صَلَّى ٱللَّٰهُ"
  >
    ﷺ
  </span>
);

// 6. بارك الله (BarakAllah)
export const CalligraphyBarakallahIcon = ({ size = 22, className = '' }) => (
  <span
    className={`reaction-circle-icon rci-barakallah ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.58)}px` }}
    aria-label="بَارَكَ ٱللَّٰهُ"
  >
    💎
  </span>
);

export const ARABIC_CALLIGRAPHY_MAP = {
  jazakallah: {
    id: 'jazakallah',
    arabic: 'جَزَاكَ ٱللَّٰهُ',
    bangla: 'জাযাকাল্লাহ',
    meaning: 'আল্লাহ আপনাকে উত্তম প্রতিদান দিন',
    symbol: '🤲',
    color: '#059669',
    rciClass: 'rci-jazakallah',
    Icon: CalligraphyJazakallahIcon,
  },
  mashaallah: {
    id: 'mashaallah',
    arabic: 'مَا شَاءَ ٱللَّٰهُ',
    bangla: 'মাশাআল্লাহ',
    meaning: 'আল্লাহ যা চেয়েছেন',
    symbol: '✨',
    color: '#2563EB',
    rciClass: 'rci-mashaallah',
    Icon: CalligraphyMashaallahIcon,
  },
  alhamdulillah: {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    bangla: 'আলহামদুলিল্লাহ',
    meaning: 'সকল প্রশংসা আল্লাহর জন্য',
    symbol: '🌿',
    color: '#0D9488',
    rciClass: 'rci-alhamdulillah',
    Icon: CalligraphyAlhamdulillahIcon,
  },
  subhanallah: {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    bangla: 'সুবহানাল্লাহ',
    meaning: 'আল্লাহ অতি পবিত্র ও মহিমান্বিত',
    symbol: '☀️',
    color: '#D97706',
    rciClass: 'rci-subhanallah',
    Icon: CalligraphySubhanallahIcon,
  },
  salawat: {
    id: 'salawat',
    arabic: 'ﷺ صَلَّى ٱللَّٰهُ',
    bangla: 'দরূদ শরীফ',
    meaning: 'সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম',
    symbol: 'ﷺ',
    color: '#BE123C',
    rciClass: 'rci-salawat',
    Icon: CalligraphySalawatIcon,
  },
  barakallah: {
    id: 'barakallah',
    arabic: 'بَارَكَ ٱللَّٰهُ',
    bangla: 'বারাকাল্লাহ',
    meaning: 'আল্লাহ বরকত দান করুন',
    symbol: '💎',
    color: '#7C3AED',
    rciClass: 'rci-barakallah',
    Icon: CalligraphyBarakallahIcon,
  },
};

export const ARABIC_CALLIGRAPHY_LIST = Object.values(ARABIC_CALLIGRAPHY_MAP);

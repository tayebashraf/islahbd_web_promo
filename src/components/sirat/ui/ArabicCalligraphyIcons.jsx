import React from 'react';

/**
 * Circular Islamic reaction icons (গোল গোল আইকন): each circle holds the
 * phrase itself in Arabic calligraphy (Amiri), like the ﷺ seal. Drawn as SVG
 * so the words always fit the circle at any size.
 */
const CalligraphyCircle = ({ size, rci, label, lines, scale = 1, className = '' }) => {
  const two = lines.length > 1;
  return (
    <span
      className={`reaction-circle-icon ${rci} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label={label}
      role="img"
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
        {lines.map((line, i) => (
          <text
            key={i}
            x="50"
            y={two ? (i === 0 ? 46 : 83) : 68}
            textAnchor="middle"
            direction="rtl"
            fill="currentColor"
            style={{
              fontFamily: "'Amiri', 'Noto Naskh Arabic', serif",
              fontWeight: 700,
              fontSize: `${(two ? 38 : 64) * scale}px`,
            }}
          >
            {line}
          </text>
        ))}
      </svg>
    </span>
  );
};

// 1. جزاك الله (JazakAllah)
export const CalligraphyJazakallahIcon = ({ size = 22, className = '' }) => (
  <CalligraphyCircle size={size} className={className} rci="rci-jazakallah" label="جَزَاكَ ٱللَّٰهُ" lines={['جزاك', 'الله']} />
);

// 2. ما شاء الله (MashaAllah)
export const CalligraphyMashaallahIcon = ({ size = 22, className = '' }) => (
  <CalligraphyCircle size={size} className={className} rci="rci-mashaallah" label="مَا شَاءَ ٱللَّٰهُ" lines={['ما شاء', 'الله']} scale={0.82} />
);

// 3. الحمد لله (Alhamdulillah)
export const CalligraphyAlhamdulillahIcon = ({ size = 22, className = '' }) => (
  <CalligraphyCircle size={size} className={className} rci="rci-alhamdulillah" label="ٱلْحَمْدُ لِلَّٰهِ" lines={['الحمد', 'لله']} />
);

// 4. سبحان الله (SubhanAllah)
export const CalligraphySubhanallahIcon = ({ size = 22, className = '' }) => (
  <CalligraphyCircle size={size} className={className} rci="rci-subhanallah" label="سُبْحَانَ ٱللَّٰهِ" lines={['سبحان', 'الله']} scale={0.88} />
);

// 5. ﷺ (Salawat / Durood) — the single-glyph seal
export const CalligraphySalawatIcon = ({ size = 22, className = '' }) => (
  <CalligraphyCircle size={size} className={className} rci="rci-salawat" label="ﷺ صَلَّى ٱللَّٰهُ" lines={['ﷺ']} />
);

// 6. بارك الله (BarakAllah)
export const CalligraphyBarakallahIcon = ({ size = 22, className = '' }) => (
  <CalligraphyCircle size={size} className={className} rci="rci-barakallah" label="بَارَكَ ٱللَّٰهُ" lines={['بارك', 'الله']} />
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

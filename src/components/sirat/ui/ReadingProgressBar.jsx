'use client';

import React, { useEffect, useState } from 'react';

export const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100)));
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        backgroundColor: 'var(--color-brand-primary)',
        zIndex: 'var(--z-toast)',
        transition: 'width 80ms ease-out',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default ReadingProgressBar;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  /** If true, acts as a static loading component (e.g. for loading.tsx) without auto-dismiss */
  staticMode?: boolean;
  minDuration?: number;
}

export function SplashScreen({ staticMode = false, minDuration = 800 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (staticMode) return;
    const timer = setTimeout(() => {
      setVisible(false);
    }, minDuration);
    return () => clearTimeout(timer);
  }, [staticMode, minDuration]);

  if (!visible && !staticMode) return null;

  return (
    <AnimatePresence>
      {(visible || staticMode) && (
        <motion.div
          key="app-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--canvas)] select-none"
          style={{
            background: "radial-gradient(circle at center, var(--brand-soft) 0%, var(--canvas) 65%)",
          }}
          aria-label="ইসলাহ — দ্বীনি জীবনের সঙ্গী"
          role="status"
        >
          {/* Subtle Ambient Decorative Circles */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-brand/10 blur-3xl pointer-events-none"
            />
          </div>

          <div className="relative flex flex-col items-center text-center px-4">
            {/* Logo Emblem with soft pulsing ring */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5"
            >
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-brand/20 to-brand-soft blur-md animate-pulse" />
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-[var(--panel)] p-2 shadow-xl ring-1 ring-brand/20">
                <Image
                  src="/icon-192.png"
                  alt="ইসলাহ লোগো"
                  width={88}
                  height={88}
                  className="h-full w-full object-contain rounded-xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Brand Title: ইসলাহ */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
              className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-ink"
            >
              ইসলাহ
            </motion.h1>

            {/* Tagline: দ্বীনি জীবনের সঙ্গী */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22, ease: "easeOut" }}
              className="mt-2 text-base sm:text-lg font-medium text-brand tracking-wide flex items-center gap-2"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand/60" />
              <span>দ্বীনি জীবনের সঙ্গী</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand/60" />
            </motion.p>

            {/* Elegant Slim Loading Progress Shimmer */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "140px" }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-8 h-1 overflow-hidden rounded-full bg-brand-soft/70 relative"
            >
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-2/3 bg-gradient-to-r from-transparent via-brand to-transparent rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

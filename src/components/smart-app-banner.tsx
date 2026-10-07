"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/lib/constants";

const DISMISS_KEY = "islahbd-app-banner-dismissed-at";
const DISMISS_DAYS = 7;

type Platform = "android" | "ios";

function detectPlatform(): Platform | null {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  // iPadOS 13+ reports as "Macintosh" but is touch-capable, unlike a real Mac.
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS && !(window as unknown as { MSStream?: unknown }).MSStream) return "ios";
  return null;
}

function computePlatform(): Platform | null {
  const detected = detectPlatform();
  if (!detected) return null;

  try {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsedDays = (Date.now() - Number(dismissedAt)) / 86_400_000;
      if (elapsedDays < DISMISS_DAYS) return null;
    }
  } catch {
    // localStorage unavailable (private mode etc.) — show the banner anyway.
  }

  return detected;
}

// No-op subscription: the platform/dismissal check never changes after the
// client snapshot is taken, so there is nothing to re-subscribe to.
function subscribe() {
  return () => {};
}

/**
 * Bottom install banner shown only to mobile visitors browsing the website
 * instead of the app — Android gets the Play Store, iPhone/iPad gets the
 * App Store. Desktop visitors never see it. Dismissal is remembered for a
 * week so it doesn't nag on every visit.
 *
 * Uses useSyncExternalStore (server snapshot = null) so the mobile-only
 * detection reads browser APIs without causing a hydration mismatch.
 */
export function SmartAppBanner() {
  const { t } = useLang();
  const platform = useSyncExternalStore(subscribe, computePlatform, () => null);
  const [dismissed, setDismissed] = useState(false);

  if (!platform || dismissed) return null;

  const storeUrl = platform === "android" ? PLAY_STORE_URL : APP_STORE_URL;
  const storeLabel = platform === "android" ? "Google Play" : "App Store";

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore — worst case the banner reappears next visit.
    }
    setDismissed(true);
  };

  return (
    <div
      role="complementary"
      aria-label={t("অ্যাপ ইনস্টল ব্যানার", "App install banner")}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("বন্ধ করুন", "Dismiss")}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-emerald shadow-sm overflow-hidden">
          <Image src="/icon-192.png" alt="islahbd" width={40} height={40} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">islahbd</p>
          <p className="truncate text-xs text-muted-foreground">
            {t("অ্যাপে আরও ভালো অভিজ্ঞতা পান", "Get the full experience in the app")}
          </p>
        </div>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="shrink-0 rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-[#111827] hover:opacity-90 transition-opacity"
        >
          {t("ইনস্টল করুন", `Get on ${storeLabel}`)}
        </a>
      </div>
    </div>
  );
}

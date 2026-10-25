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
 * Top install strip shown only to mobile visitors browsing the website
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
    // Body is a flex column, so -order-1 lifts the banner above the page's
    // sticky top bar without fighting the mobile bottom navigation.
    <div
      role="complementary"
      aria-label={t("অ্যাপ ইনস্টল ব্যানার", "App install banner")}
      className="-order-1 border-b border-line bg-panel"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("বন্ধ করুন", "Dismiss")}
          className="shrink-0 rounded-full p-1.5 text-ink-3 transition-colors hover:bg-panel-2 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <Image src="/icon-192.png" alt="islahbd" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-line" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{t("islahbd অ্যাপ", "islahbd app")}</p>
          <p className="truncate text-xs text-ink-3">
            {t("আযান-অ্যালার্ম ও অফলাইন অডিও", "Adhan alarms & offline audio")}
          </p>
        </div>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t("ইনস্টল", `Get on ${storeLabel}`)}
        </a>
      </div>
    </div>
  );
}

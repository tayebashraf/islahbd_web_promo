"use client";

import { useEffect } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.islahbd.app";
const APP_STORE_URL =
  "https://apps.apple.com/app/islahbd/id6743452793"; // replace with real App Store numeric ID

interface DeepLinkRedirectProps {
  /** Full https deep link e.g. https://islahbd.com/boyan/abc123 */
  deepLink: string;
  section: string;
  token: string;
}

export function DeepLinkRedirect({ deepLink, section, token }: DeepLinkRedirectProps) {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/i.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;

    if (isAndroid) {
      // Android App Links open the app directly if installed.
      // intent:// URI is the reliable fallback that goes to Play Store when app absent.
      const intentUrl =
        `intent://${new URL(deepLink).pathname}` +
        `#Intent;scheme=https;host=islahbd.com;` +
        `package=com.islahbd.app;` +
        `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

      window.location.replace(intentUrl);
      return;
    }

    if (isIOS) {
      // iOS Universal Links: try the https URL — if app installed, OS intercepts it.
      // After 2 s with no interception, redirect to App Store.
      const timer = setTimeout(() => {
        window.location.replace(APP_STORE_URL);
      }, 2000);

      window.location.href = deepLink;

      return () => clearTimeout(timer);
    }

    // Desktop / unknown — go to Play Store as default
    window.location.replace(PLAY_STORE_URL);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0f172a] px-4 text-center text-white">
      <div className="text-5xl">📲</div>
      <h1 className="text-2xl font-bold">Opening islahBD…</h1>
      <p className="text-slate-400 max-w-sm">
        Opening {section} content in the app. If nothing happens you&apos;ll be
        redirected to the store automatically.
      </p>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ animation: "progress 2s linear forwards" }}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">token: {token}</p>
    </div>
  );
}

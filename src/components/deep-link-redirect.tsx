"use client";

import React, { useEffect } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.islahbd.app";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/islahbd/id6762509692";

interface DeepLinkRedirectProps {
  deepLink: string; // https://islahbd.com/<section>/<token>
  section: string;
  token: string;
}

export function DeepLinkRedirect({ deepLink, section, token }: DeepLinkRedirectProps) {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS =
      /iPad|iPhone|iPod/i.test(ua) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;

    // ── Android ────────────────────────────────────────────────────────────
    // Android App Links: OS intercepts the https:// URL directly if assetlinks.json
    // is verified — app opens with no browser visible. Falls back to intent:// if
    // App Links verification has not completed (e.g. fresh install before first boot
    // verification run), which then falls to Play Store if app not installed.
    if (isAndroid) {
      // Primary: App Links — OS intercepts before browser renders anything
      window.location.replace(deepLink);

      // Fallback after 1.5 s: app not installed or App Links not yet verified
      const path = new URL(deepLink).pathname;
      const intentUrl =
        `intent:/${path}` +
        `#Intent;scheme=islahbd;host=open;` +
        `package=com.islahbd.app;` +
        `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

      setTimeout(() => {
        window.location.replace(intentUrl);
      }, 1500);
      return;
    }

    // ── iOS ────────────────────────────────────────────────────────────────
    // Try custom URI scheme islahbd://open/<section>/<token>.
    // If app installed → OS opens it, page goes background → visibilitychange fires.
    // If not installed → scheme unrecognised, nothing happens → after 2 s go to App Store.
    if (isIOS) {
      let didOpenApp = false;

      const onVisibilityChange = () => {
        if (document.hidden) didOpenApp = true;
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      window.location.href = `islahbd://open/${section}/${token}`;

      const timer = setTimeout(() => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (!didOpenApp) window.location.replace(APP_STORE_URL);
      }, 2000);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    // ── Desktop / unknown → Play Store immediately ─────────────────────────
    window.location.replace(PLAY_STORE_URL);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Minimal loading screen — visible only during the 2 s iOS wait.
  // Android and desktop redirect instantly so this barely flashes.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0f172a] text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-3xl shadow-lg">
        🕌
      </div>
      <p className="text-slate-400 text-sm">Opening islahBD…</p>
      <div className="h-1 w-32 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ animation: "progress 2s linear forwards" }}
        />
      </div>
    </div>
  );
}

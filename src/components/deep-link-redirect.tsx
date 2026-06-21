"use client";

import React, { useEffect } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.islahbd.app";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/islahbd/id6762509692";

interface DeepLinkRedirectProps {
  deepLink: string; // https://www.islahbd.com/<section>/<token>
  section: string;
  token: string;
}

export function DeepLinkRedirect({ section, token }: DeepLinkRedirectProps) {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    // iPhone/iPod report in UA. iPadOS 13+ masquerades as Mac, so also treat a
    // touch-capable "Macintosh" as iOS.
    const isIOS =
      (/iPad|iPhone|iPod/i.test(ua) ||
        (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;

    // ── Android ────────────────────────────────────────────────────────────
    // Do NOT redirect to the https:// deepLink first: it points at this same
    // domain, so if App Links verification has not completed the browser simply
    // reloads this redirect page (infinite loop) and any pending fallback timer
    // is destroyed. Go straight to intent:// — it opens the app when installed
    // and uses S.browser_fallback_url (Play Store) automatically when not.
    if (isAndroid) {
      const intentUrl =
        `intent://open/${section}/${token}` +
        `#Intent;scheme=islahbd;package=com.islahbd.app;` +
        `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

      window.location.replace(intentUrl);
      return;
    }

    // ── iOS ────────────────────────────────────────────────────────────────
    // Try custom URI scheme islahbd://open/<section>/<token>.
    // If app installed → OS opens it, page goes background → visibilitychange fires.
    // If not installed → scheme unrecognised, nothing happens → after 2 s go to App Store.
    if (isIOS) {
      let didOpenApp = false;

      // App opened → tab backgrounds. Catch via any of these (Safari fires
      // different events depending on version).
      const markOpened = () => {
        if (document.hidden) didOpenApp = true;
      };
      const onPageHide = () => {
        didOpenApp = true;
      };
      document.addEventListener("visibilitychange", markOpened);
      window.addEventListener("pagehide", onPageHide);
      window.addEventListener("blur", onPageHide);

      const cleanupListeners = () => {
        document.removeEventListener("visibilitychange", markOpened);
        window.removeEventListener("pagehide", onPageHide);
        window.removeEventListener("blur", onPageHide);
      };

      window.location.href = `islahbd://open/${section}/${token}`;

      const timer = setTimeout(() => {
        cleanupListeners();
        if (!didOpenApp) window.location.replace(APP_STORE_URL);
      }, 2000);

      return () => {
        clearTimeout(timer);
        cleanupListeners();
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

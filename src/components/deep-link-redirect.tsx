"use client";

import React, { useEffect, useState } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.islahbd.app";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/islahbd/id6762509692";

// Custom URI scheme — safe to use from web; won't loop back to this page.
// Format: islahbd://open/<section>/<token>
function buildCustomSchemeUrl(section: string, token: string) {
  return `islahbd://open/${section}/${token}`;
}

interface DeepLinkRedirectProps {
  deepLink: string; // https://islahbd.com/<section>/<token>
  section: string;
  token: string;
}

type Phase = "trying" | "fallback";

export function DeepLinkRedirect({ deepLink, section, token }: DeepLinkRedirectProps) {
  const [phase, setPhase] = useState<Phase>("trying");

  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS =
      /iPad|iPhone|iPod/i.test(ua) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;

    // ── Android ────────────────────────────────────────────────────────────
    // intent:// URI: OS opens app if installed; browser_fallback_url fires if not.
    // No timer needed — Android handles the fallback natively.
    if (isAndroid) {
      const path = new URL(deepLink).pathname; // e.g. /boyan/abc123
      const intentUrl =
        `intent:/${path}` +
        `#Intent;scheme=islahbd;host=open;` +
        `package=com.islahbd.app;` +
        `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

      window.location.replace(intentUrl);
      return;
    }

    // ── iOS ────────────────────────────────────────────────────────────────
    // 1. Try custom URI scheme (islahbd://open/…).
    //    If app is installed — OS opens it, page goes to background.
    //    If not installed — nothing happens (scheme unknown), so we wait 2 s.
    // 2. visibilitychange fires when app comes to foreground; cancel fallback.
    // 3. After 2 s with no visibility change → go to App Store.
    if (isIOS) {
      const customUrl = buildCustomSchemeUrl(section, token);

      let didOpenApp = false;

      const onVisibilityChange = () => {
        if (document.hidden) {
          didOpenApp = true;
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      // Attempt to open app
      window.location.href = customUrl;

      const timer = setTimeout(() => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (!didOpenApp) {
          // App not installed — show fallback UI then redirect
          setPhase("fallback");
          // Small delay so user sees the fallback message before redirect
          setTimeout(() => {
            window.location.replace(APP_STORE_URL);
          }, 800);
        }
      }, 2000);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    // ── Desktop / unknown ──────────────────────────────────────────────────
    // Show fallback UI immediately; user can choose store manually.
    setPhase("fallback");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0f172a] px-6 text-center text-white">
      {/* App icon placeholder */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 text-4xl shadow-lg">
        🕌
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">islahBD</h1>
        {phase === "trying" ? (
          <p className="text-slate-400 text-sm max-w-xs">
            Opening in the app…
          </p>
        ) : (
          <p className="text-slate-400 text-sm max-w-xs">
            App not detected. Install islahBD to access this content.
          </p>
        )}
      </div>

      {/* Progress bar — only visible while trying */}
      {phase === "trying" && (
        <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ animation: "progress 2s linear forwards" }}
          />
        </div>
      )}

      {/* Manual fallback buttons */}
      {phase === "fallback" && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href={APP_STORE_URL}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black shadow"
          >
            <span>🍎</span> Download on App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow"
          >
            <span>▶</span> Get it on Google Play
          </a>
          <a
            href={deepLink}
            className="text-xs text-slate-500 underline underline-offset-2 mt-1"
          >
            Already installed? Open link
          </a>
        </div>
      )}
    </div>
  );
}

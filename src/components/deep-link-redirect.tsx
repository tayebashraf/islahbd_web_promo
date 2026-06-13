"use client";

import { useEffect } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.islahbd.app";
const APP_STORE_URL =
  "https://apps.apple.com/app/islahbd/id6743452793"; // update with real App Store ID

interface DeepLinkRedirectProps {
  /** Full https deep link, e.g. https://islahbd.com/boyan/abc123 */
  deepLink: string;
  section: string;
  token: string | null;
}

export function DeepLinkRedirect({ deepLink, section, token }: DeepLinkRedirectProps) {
  useEffect(() => {
    if (!token) {
      // No token — just go to Play Store
      window.location.replace(PLAY_STORE_URL);
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const storeUrl = isIOS ? APP_STORE_URL : PLAY_STORE_URL;

    // Try to open the app. If not installed, browser ignores the link or
    // shows an error — after 2 s we redirect to the store.
    const fallbackTimer = setTimeout(() => {
      window.location.replace(storeUrl);
    }, 2000);

    // On mobile: attempt the deep link
    if (isIOS || isAndroid) {
      window.location.href = deepLink;
    } else {
      // Desktop — skip app attempt, go to store page
      clearTimeout(fallbackTimer);
      window.location.replace(PLAY_STORE_URL);
    }

    // If the app opens, the page will be backgrounded — timer won't fire.
    return () => clearTimeout(fallbackTimer);
  }, [deepLink, token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0f172a] px-4 text-center text-white">
      <div className="text-5xl">📲</div>
      <h1 className="text-2xl font-bold">Opening islahBD…</h1>
      <p className="text-slate-400">
        {token
          ? "Opening content in the app. If nothing happens, you'll be redirected to the store."
          : "Redirecting to the app store…"}
      </p>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-700">
        <div className="h-full animate-[progress_2s_linear_forwards] rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}

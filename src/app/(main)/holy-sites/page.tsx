import type { Metadata } from "next";
import { HolySitesClient } from "./holy-sites-client";

export const metadata: Metadata = {
  title: "হারামাইন লাইভ",
  description: "মসজিদুল হারাম (মক্কা) ও মসজিদে নববী (মদিনা) থেকে সরাসরি সম্প্রচার।",
};

/** Current live video id of a channel (same lookup as the app), else the known 24/7 stream. */
async function liveId(handle: string, fallback: string) {
  try {
    const html = await fetch(`https://www.youtube.com/@${handle}/live`, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" },
      next: { revalidate: 600 },
    }).then((r) => r.text());
    return html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/)?.[1] ?? fallback;
  } catch {
    return fallback;
  }
}

export default async function HolySitesPage() {
  const [makkah, madinah] = await Promise.all([liveId("SaudiQuranTv", "eC4LfEVxvKg"), liveId("SaudiSunnahTv", "Rs7St51oDDc")]);
  return <HolySitesClient ids={{ makkah, madinah }} />;
}

import type { Metadata } from "next";
import { Dashboard, type HomeData } from "@/components/home/dashboard";
import {
  getAmalCategories,
  getBooks,
  getBoyans,
  getClips,
  getGalleryAlbums,
  getLiveStatus,
  getMalfuzat,
  getNasheeds,
  getNotices,
  getWallpapers,
} from "@/lib/api";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

function monthKey(iso: string): string {
  return iso.slice(0, 7); // YYYY-MM
}

export default async function HomePage() {
  const [live, boyans, nasheeds, clips, malfuzat, notices, amal, albums, books, wallpapers] = await Promise.all([
    getLiveStatus(),
    getBoyans(),
    getNasheeds(),
    getClips(),
    getMalfuzat(),
    getNotices(),
    getAmalCategories(),
    getGalleryAlbums(),
    getBooks(),
    getWallpapers(),
  ]);

  // Library growth: cumulative count of every audio item, by upload month.
  const dates = [
    ...boyans.map((b) => b.uploadDate),
    ...nasheeds.map((n) => n.createdAt),
    ...clips.map((c) => c.createdAt),
  ].filter(Boolean);
  const perMonth = new Map<string, number>();
  for (const d of dates) perMonth.set(monthKey(d), (perMonth.get(monthKey(d)) ?? 0) + 1);
  const months = [...perMonth.keys()].sort();
  const growth: { month: string; total: number }[] = [];
  for (const m of months) growth.push({ month: m, total: (growth.at(-1)?.total ?? 0) + (perMonth.get(m) ?? 0) });

  const data: HomeData = {
    live,
    boyans: boyans.map(({ id, title, speaker, category, audioUrl, uploadDate, location, duration }) => ({
      id,
      title,
      speaker,
      category,
      audioUrl,
      uploadDate,
      location,
      duration,
    })),
    nasheeds: nasheeds.filter((n) => n.type === "audio" && n.audioUrl).slice(0, 6),
    videoNasheeds: nasheeds.filter((n) => n.type === "video" && n.youtubeId).slice(0, 4),
    clips: clips.filter((c) => c.audioUrl).slice(0, 6),
    malfuz: malfuzat.slice(0, 5),
    notices: notices.slice(0, 6),
    amal: amal.map(({ id, section, title, itemCount }) => ({ id, section, title, itemCount })),
    albums: albums
      .filter((a) => a.photos.length)
      .map((a) => ({ ...a, photos: a.photos.slice(0, 4) })),
    counts: {
      boyan: boyans.length,
      nasheed: nasheeds.length,
      clip: clips.length,
      malfuz: malfuzat.length,
      amal: amal.reduce((s, c) => s + c.itemCount, 0),
      books: books.length,
      wallpapers: wallpapers.length,
      photos: albums.reduce((s, a) => s + a.imageCount, 0),
      notices: notices.length,
    },
    growth,
  };

  return <Dashboard data={data} />;
}

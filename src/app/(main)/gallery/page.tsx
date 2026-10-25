import type { Metadata } from "next";
import { GalleryClient } from "./gallery-client";
import { getGalleryAlbums, getWallpapers } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "গ্যালারি ও ওয়ালপেপার",
  description: "জামেআ মারকাযুল ইহসানের ছবি, স্থায়ী ক্যাম্পাসের অগ্রগতি ও ইসলামিক ওয়ালপেপার।",
  alternates: { canonical: `${SITE_URL}/gallery` },
};

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [{ tab }, albums, wallpapers] = await Promise.all([searchParams, getGalleryAlbums(), getWallpapers()]);
  return <GalleryClient albums={albums.filter((a) => a.photos.length)} wallpapers={wallpapers} initialTab={tab === "wallpapers" ? "wallpapers" : undefined} />;
}

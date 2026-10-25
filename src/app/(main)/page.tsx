import type { Metadata } from "next";
import { Dashboard, type HomeData } from "@/components/home/dashboard";
import { getBooks, getBoyanCategories, getBoyans, getClips, getLiveStatus, getMalfuzat, getNasheeds } from "@/lib/api";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

const norm = (s: string) => (s || "General").replace(/\s+/g, " ").trim();

export default async function HomePage() {
  const [live, boyans, categories, nasheeds, clips, malfuzat, books] = await Promise.all([
    getLiveStatus(),
    getBoyans(),
    getBoyanCategories(),
    getNasheeds(),
    getClips(),
    getMalfuzat(),
    getBooks(),
  ]);

  // Boyan categories with their counts, in the admin's order.
  const counts = new Map<string, number>();
  for (const b of boyans) counts.set(norm(b.category), (counts.get(norm(b.category)) ?? 0) + 1);
  const order = new Map(categories.map((c) => [norm(c.name), c.order]));
  const boyanCats = [...counts.entries()]
    .sort((a, b) => (order.get(a[0]) ?? 99) - (order.get(b[0]) ?? 99) || b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const data: HomeData = {
    live,
    boyans: boyans.slice(0, 40).map(({ id, title, speaker, category, audioUrl, uploadDate, location, duration }) => ({
      id,
      title,
      speaker,
      category,
      audioUrl,
      uploadDate,
      location,
      duration,
    })),
    boyanCats,
    nasheeds: nasheeds.filter((n) => n.type === "audio" && n.audioUrl).slice(0, 8),
    clips: clips.filter((c) => c.audioUrl).slice(0, 8),
    malfuz: malfuzat.slice(0, 6),
    books: books.slice(0, 8),
    counts: { boyan: boyans.length, nasheed: nasheeds.length, clip: clips.length, book: books.length },
  };

  return <Dashboard data={data} />;
}

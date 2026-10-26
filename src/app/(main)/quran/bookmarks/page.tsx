import type { Metadata } from "next";
import { BookmarksClient } from "./bookmarks-client";

export const metadata: Metadata = { title: "কুরআন বুকমার্ক", robots: { index: false } };

export default function QuranBookmarksPage() {
  return <BookmarksClient />;
}

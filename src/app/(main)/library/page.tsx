import type { Metadata } from "next";
import { getBooks } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { LibraryClient } from "./library-client";

export const metadata: Metadata = {
  title: "লাইব্রেরি — বই পড়ুন ও ডাউনলোড করুন",
  description: "islahbd লাইব্রেরির বইসমূহ অনলাইনে পড়ুন বা PDF ডাউনলোড করুন।",
  alternates: { canonical: `${SITE_URL}/library` },
};

export default async function LibraryPage() {
  return <LibraryClient books={await getBooks()} />;
}

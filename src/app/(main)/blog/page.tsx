import type { Metadata } from "next";
import { BlogListClient } from "./blog-list-client";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ইসলামিক ব্লগ — কুরআন, হাদিস, ফিকহ, রমজান",
  description: "ইসলামিক জীবনযাপন সম্পর্কিত গবেষণাভিত্তিক নিবন্ধ। কুরআনের শিক্ষা, হাদিস, মাসআলা, রমজান এবং আরও অনেক বিষয়।",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Islamic Blog | ${SITE_NAME}`,
    description: "Research-based articles on Islamic lifestyle, Quran, Hadith, Fiqh and Ramadan.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogListClient posts={BLOG_POSTS} categories={BLOG_CATEGORIES} />;
}

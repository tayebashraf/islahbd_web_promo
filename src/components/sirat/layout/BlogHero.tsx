"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, BookOpen, Layers, Users, Bookmark, ArrowLeft } from "lucide-react";
import BlogNav from "./BlogNav";
import { cn } from "@/lib/utils";

interface BlogHeroProps {
  totalArticles?: number;
  totalTopics?: number;
  totalAuthors?: number;
}

export default function BlogHero({
  totalArticles = 150,
  totalTopics = 8,
  totalAuthors = 8,
}: BlogHeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full mb-6 font-kalpurush">
      {/* 1. Dignified Islamic Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel-2/80 to-brand-soft/25 p-4 sm:p-7 shadow-[var(--sirat-shadow-card)] backdrop-blur-sm transition-all duration-300">
        {/* Ambient subtle light glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Top meta row: Eyebrow Badge & App Return Link */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-[11.5px] sm:text-xs font-semibold text-brand shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span>জ্ঞানভিত্তিক ইসলামিক নিবন্ধ ও সীরাত চর্চা</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/90 px-3 py-1 text-xs font-semibold text-ink-2 shadow-2xs transition hover:border-brand/40 hover:text-brand"
            title="ইসলাহ প্রধান ড্যাশবোর্ডে ফিরে যান"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>মূল অ্যাপ</span>
          </Link>
        </div>

        {/* Center Title & Serene Tagline */}
        <div className="relative z-10 mt-4 sm:mt-5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[34px]">
            ইসলাহ ব্লগ
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-[15px]">
            রাসূলুল্লাহ ﷺ-এর অনুপম সীরাত, নববী আখলাক, তাযকিয়ায়ে নফস ও সুন্নাহভিত্তিক প্রামাণ্য ইসলামিক গবেষণার উন্মুক্ত জ্ঞানভাণ্ডার।
          </p>
        </div>

        {/* Feature Stats Badges */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-[13px] text-ink-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel/80 px-2.5 py-1">
            <BookOpen className="h-3.5 w-3.5 text-brand" />
            <span>১৫০+ তাহকিক নিবন্ধ</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel/80 px-2.5 py-1">
            <Users className="h-3.5 w-3.5 text-brand" />
            <span>৮ জন আলেম ও গবেষক</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel/80 px-2.5 py-1">
            <Layers className="h-3.5 w-3.5 text-brand" />
            <span>৮টি শাস্ত্রীয় বিভাগ</span>
          </span>
        </div>

        {/* Integrated Quick Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative z-10 mt-5 flex max-w-xl items-center gap-2 rounded-2xl border border-line bg-panel p-1.5 shadow-xs transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-panel-2 text-brand">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রিয় বিষয়, হাদীস বা নিবন্ধের শিরোনাম দিয়ে খুঁজুন..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-strong active:scale-95"
          >
            অনুসন্ধান
          </button>
        </form>
      </div>

      {/* 2. Desktop & Tablet Blog Navigation Tabs */}
      <div className="mt-4">
        <BlogNav />
      </div>
    </div>
  );
}

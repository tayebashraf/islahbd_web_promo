'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthorCard from '@/components/sirat/author/AuthorCard';
import { sampleAuthors } from '@/lib/sirat/sampleData';
import { Users, Search } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/dashboard/ui';
import BlogNav from '@/components/sirat/layout/BlogNav';
import { cn } from '@/lib/utils';

const FILTER_TOPICS = ['সব গবেষক', 'সিরাত গবেষণা', 'হাদিস শাস্ত্র', 'নববী আখলাক', 'মক্কী জীবন', 'মাদানী জীবন', 'তাফসির'];

function toBanglaNum(num) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num || 0).replace(/[0-9]/g, (d) => banglaDigits[d]);
}

export default function AuthorsPage() {
  const [selectedTopic, setSelectedTopic] = useState('সব গবেষক');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAuthors = sampleAuthors.filter((author) => {
    const matchesSearch =
      author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (author.expertise && author.expertise.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTopic =
      selectedTopic === 'সব গবেষক' ||
      (author.expertise && author.expertise.includes(selectedTopic));

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      {/* Blog Desktop Tab Navigation */}
      <BlogNav />

      <PageHeader
        title="সিরাত গবেষক ও ওলামায়ে কেরাম"
        muted="সম্মানিত লেখক ও গবেষকবৃন্দ"
        description="ইসলাহ ব্লগে নিয়মিত ও প্রামাণ্য তাহকিকমূলক প্রবন্ধ রচয়িতা এবং দ্বীনি গবেষকবৃন্দের সংক্ষিপ্ত পরিচিতি।"
      />

      {/* Search & Topic Filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="গবেষকের নাম বা গবেষণার ক্ষেত্র দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-panel text-ink text-sm outline-none focus:border-brand transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TOPICS.map((topic) => {
            const active = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer",
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "border border-line bg-panel text-ink hover:border-brand/40"
                )}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scholars Cards Stream */}
      <div className="space-y-4">
        {filteredAuthors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}

        {filteredAuthors.length === 0 && (
          <EmptyState
            icon={Users}
            title="কোনো লেখকের সন্ধান পাওয়া যায়নি"
            hint="অন্য কোনো বিষয় বা নাম দিয়ে অনুসন্ধান করুন।"
          />
        )}
      </div>
    </div>
  );
}

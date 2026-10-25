'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/sirat/feed/PostCard';
import { searchArticlesLocal, sampleTopics } from '@/lib/sirat/sampleData';
import { Search as SearchIcon, X, BookOpen } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/dashboard/ui';
import { cn } from '@/lib/utils';

const popularKeywords = ['মাক্কী জীবন', 'মাদানী সনদ', 'তায়েফ', 'হিজরত', 'আখলাক', 'বদরের যুদ্ধ'];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams ? searchParams.get('q') || '' : '';

  const [query, setQuery] = useState(initialQ);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQ) {
      setQuery(initialQ);
      performSearch(initialQ, 'all');
    }
  }, [initialQ]);

  const performSearch = (searchTerm, topicFilter = selectedTopic) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    let found = searchArticlesLocal(searchTerm.trim());
    if (topicFilter !== 'all') {
      found = found.filter((a) => a.topicSlug === topicFilter);
    }
    setResults(found);
    setSearched(true);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val, selectedTopic);
  };

  const handleTopicFilter = (topicSlug) => {
    setSelectedTopic(topicSlug);
    if (query.trim()) {
      performSearch(query, topicSlug);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header Card */}
      <PageHeader
        eyebrow="অনুসন্ধান"
        title="ব্লগ অনুসন্ধান"
        description="সিরাত, হাদীস ও ইসলামিক গবেষণার যেকোনো বিষয় বা কীওয়ার্ড দিয়ে খুঁজুন।"
      />

      <div className="fb-card p-4 space-y-3">
        <div className="relative">
          <SearchIcon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="প্রবন্ধের শিরোনাম, বিষয়বস্তু বা কীওয়ার্ড দিয়ে খুঁজুন..."
            value={query}
            onChange={handleInputChange}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-line bg-panel text-ink text-sm outline-none focus:border-brand transition"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setSearched(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Topic Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleTopicFilter('all')}
            className={cn(
              "shrink-0 px-3 py-1 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer",
              selectedTopic === 'all'
                ? "bg-brand text-white shadow-sm"
                : "border border-line bg-panel text-ink hover:border-brand/40"
            )}
          >
            সব বিষয়
          </button>
          {sampleTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicFilter(topic.slug)}
              className={cn(
                "shrink-0 px-3 py-1 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer",
                selectedTopic === topic.slug
                  ? "bg-brand text-white shadow-sm"
                  : "border border-line bg-panel text-ink hover:border-brand/40"
              )}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Feed */}
      <div>
        {searched && (
          <div className="mb-3 px-1 text-xs sm:text-sm font-semibold text-muted-foreground">
            "{query}" অনুসন্ধান ফলাফল: <span className="text-brand font-bold">{results.length}</span> টি প্রবন্ধ
          </div>
        )}

        <div className="fb-posts-stream space-y-4">
          {results.map((article) => (
            <PostCard key={article.id} article={article} />
          ))}
        </div>

        {searched && results.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="কোনো প্রবন্ধ পাওয়া যায়নি"
            hint="ভিন্ন কীওয়ার্ড বা বিষয় দিয়ে আবার অনুসন্ধান করুন।"
          />
        )}

        {!searched && (
          <div className="fb-card p-6 text-center space-y-3">
            <span className="text-sm font-bold text-muted-foreground block">
              জনপ্রিয় অনুসন্ধানের বিষয়সমূহ:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {popularKeywords.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(kw);
                    performSearch(kw, selectedTopic);
                  }}
                  className="px-3 py-1 rounded-full border border-line bg-canvas-2 text-xs font-semibold text-brand hover:border-brand/40 transition"
                >
                  #{kw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="w-full max-w-[760px] mx-auto py-2 sm:py-4 px-2 sm:px-0 font-kalpurush fade-in">
      <Suspense fallback={<div className="text-center py-10 text-muted-foreground">অনুসন্ধান লোড হচ্ছে...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}

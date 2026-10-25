'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LeftSidebar from '@/components/sirat/layout/LeftSidebar';
import RightSidebar from '@/components/sirat/layout/RightSidebar';
import PostCard from '@/components/sirat/feed/PostCard';
import { searchArticlesLocal, sampleTopics } from '@/lib/sirat/sampleData';
import { Search as SearchIcon, X } from 'lucide-react';

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
    <main className="fb-feed-container" aria-label="অনুসন্ধান ফলাফল">
      {/* Search Header Card */}
      <div className="fb-card" style={{ padding: 'var(--space-4)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-2) var(--space-3)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <SearchIcon size={18} color="var(--color-text-tertiary)" />
          <input
            type="search"
            placeholder="শিরোনাম, হাদিস, লেখক বা বিষয়..."
            value={query}
            onChange={handleInputChange}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontFamily: 'var(--font-kalpurush), Kalpurush, sans-serif',
              fontSize: '13.5px',
              color: 'var(--color-text-primary)',
            }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <X size={16} color="var(--color-text-tertiary)" />
            </button>
          )}
        </div>

        {/* Topic Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button
            onClick={() => handleTopicFilter('all')}
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              fontWeight: '500',
              border: 'none',
              backgroundColor: selectedTopic === 'all' ? '#1877F2' : 'var(--color-bg-primary)',
              color: selectedTopic === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            সব
          </button>
          {sampleTopics.map((t) => (
            <button
              key={t.slug}
              onClick={() => handleTopicFilter(t.slug)}
              style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: '500',
                border: 'none',
                backgroundColor: selectedTopic === t.slug ? '#1877F2' : 'var(--color-bg-primary)',
                color: selectedTopic === t.slug ? '#FFFFFF' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results / Empty state */}
      <div className="fb-posts-stream">
        {searched && results.length > 0 && (
          <>
            <div style={{ padding: '0 var(--space-2) var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              "{query}" সংক্রান্ত {results.length} টি পোস্ট পাওয়া গেছে:
            </div>
            {results.map((article) => (
              <PostCard key={article.id} article={article} />
            ))}
          </>
        )}

        {searched && results.length === 0 && (
          <div className="fb-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              "{query}" এর জন্য কোনো পোস্ট পাওয়া যায়নি।
            </p>
          </div>
        )}

        {!searched && (
          <div className="fb-card" style={{ padding: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              জনপ্রিয় অনুসন্ধান:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => { setQuery(kw); performSearch(kw, selectedTopic); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border-secondary)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-brand-primary)',
                    cursor: 'pointer',
                  }}
                >
                  #{kw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="fb-layout fade-in">
      <LeftSidebar />
      <Suspense fallback={<div className="fb-feed-container">অনুসন্ধান লোড হচ্ছে...</div>}>
        <SearchContent />
      </Suspense>
      <RightSidebar />
    </div>
  );
}

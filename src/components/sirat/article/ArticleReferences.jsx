import React from 'react';
import { BookmarkCheck } from 'lucide-react';

export const ArticleReferences = ({ references = [] }) => {
  if (!references || references.length === 0) return null;

  return (
    <div
      style={{
        maxWidth: 'var(--max-width-article)',
        margin: 'var(--space-10) auto var(--space-8)',
        padding: 'var(--space-5) var(--space-6)',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-secondary)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-bengali-ui)',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--weight-semibold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <BookmarkCheck size={18} color="var(--color-brand-primary)" />
        <span>প্রামাণিক তথ্যসূত্র ও রেফারেন্স</span>
      </h3>
      <ol
        style={{
          margin: 0,
          paddingLeft: 'var(--space-5)',
          fontFamily: 'var(--font-bengali-ui)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        {references.map((ref, idx) => (
          <li key={idx} style={{ marginBottom: 'var(--space-1)' }}>
            {ref}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ArticleReferences;

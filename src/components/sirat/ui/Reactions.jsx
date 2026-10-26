'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '@/lib/api';
import { ARABIC_CALLIGRAPHY_LIST, ARABIC_CALLIGRAPHY_MAP } from './ArabicCalligraphyIcons';

const DEVICE_KEY = 'sirat_device_id';
const MINE_KEY = 'sirat_my_reactions';

const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

function deviceId() {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

function readMine() {
  try {
    return JSON.parse(localStorage.getItem(MINE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeMine(slug, type) {
  try {
    const all = readMine();
    if (type) all[slug] = type;
    else delete all[slug];
    localStorage.setItem(MINE_KEY, JSON.stringify(all));
  } catch {}
}

function initialCounts(article) {
  const saved = article.reactionCounts;
  if (saved && typeof saved === 'object' && Object.keys(saved).length) return saved;
  return article.jazakallahCount ? { jazakallah: article.jazakallahCount } : {};
}

/**
 * The reader's reaction to a post (one per device, saved on the server) and
 * the post's reaction counts by type.
 */
export function useReaction(article) {
  const slug = article.slug;
  const [counts, setCounts] = useState(() => initialCounts(article));
  const [mine, setMine] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore this device's reaction after hydration
    setMine(readMine()[slug] ?? null);
  }, [slug]);

  const react = useCallback(
    async (type) => {
      const next = type === mine ? null : type;
      // Optimistic: move this device's one reaction from `mine` to `next`.
      setCounts((c) => {
        const out = { ...c };
        if (mine) out[mine] = Math.max(0, (out[mine] || 0) - 1);
        if (next) out[next] = (out[next] || 0) + 1;
        return out;
      });
      setMine(next);
      writeMine(slug, next);
      const device = deviceId();
      if (!slug || !device) return;
      try {
        const res = await fetch(`${API_BASE}/api/sirat/articles/${slug}/react/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: next ?? '', deviceId: device }),
        });
        if (res.ok) setCounts((await res.json()).reactionCounts ?? {});
      } catch {}
    },
    [mine, slug]
  );

  const total = Object.values(counts).reduce((s, n) => s + (n || 0), 0);
  return { counts, total, mine, react };
}

/**
 * The জাযাকাল্লাহ button with the reaction count. A click opens the six
 * reactions; picking one saves it, picking your current one again removes it.
 */
export function ReactionButton({ reaction, className = '' }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const current = reaction.mine ? ARABIC_CALLIGRAPHY_MAP[reaction.mine] : null;
  const shown = current ?? ARABIC_CALLIGRAPHY_MAP.jazakallah;

  useEffect(() => {
    if (!open) return;
    const away = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  // Clicking always opens the six reactions; picking one saves it.
  const onMain = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const choose = (e, id) => {
    e.stopPropagation();
    reaction.react(id);
    setOpen(false);
  };

  return (
    <div
      ref={boxRef}
      className={`fb-arabic-reaction-container ${className}`}
    >
      {open && (
        <div className="fb-arabic-reaction-popup" role="menu" aria-label="প্রতিক্রিয়া বেছে নিন">
          {ARABIC_CALLIGRAPHY_LIST.map((r) => (
            <button
              key={r.id}
              type="button"
              role="menuitemradio"
              aria-checked={reaction.mine === r.id}
              className={`fb-calligraphy-popup-item ${reaction.mine === r.id ? 'is-selected' : ''}`}
              onClick={(e) => choose(e, r.id)}
              aria-label={r.bangla}
            >
              <r.Icon size={40} />
              <span className="fb-calligraphy-popup-label">{r.bangla}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className={`fb-post-action-btn ${current ? 'fb-post-action-btn--selected' : ''}`}
        onClick={onMain}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={current ? `${current.bangla} — বদলাতে বা সরাতে চাপুন` : 'প্রতিক্রিয়া দিন'}
        style={{ color: current ? current.color : 'inherit' }}
      >
        <span className="fb-reaction-btn-inner">
          <shown.Icon size={22} />
          <span className="fb-reaction-btn-label">{current ? current.bangla : 'জাযাকাল্লাহ'}</span>
          {reaction.total > 0 && <span className="fb-reaction-btn-count">{bn(reaction.total)}</span>}
        </span>
      </button>
    </div>
  );
}

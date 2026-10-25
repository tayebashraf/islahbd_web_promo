"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Quote, Share2 } from "lucide-react";
import { toggleMalfuzReaction, type Malfuz } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, PageHeader, SearchInput } from "@/components/dashboard/ui";
import { formatDate, num } from "@/lib/format";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useStoredString } from "@/lib/use-client-store";

const EMOJIS = ["👍", "❤️", "🌸"];
const MINE_KEY = "islahbd-malfuz-reactions";

export function MalfuzatClient({ malfuzat }: { malfuzat: Malfuz[] }) {
  const { t, lang } = useLang();
  const [q, setQ] = useState("");
  const [reactions, setReactions] = useState<Record<number, Record<string, number>>>(() =>
    Object.fromEntries(malfuzat.map((m) => [m.id, m.reactions])),
  );
  // The server toggles per device; we remember our own picks locally to show state.
  const [mineRaw, setMineRaw] = useStoredString(MINE_KEY);
  const mine = useMemo<Record<number, string[]>>(() => {
    try {
      return JSON.parse(mineRaw || "{}");
    } catch {
      return {};
    }
  }, [mineRaw]);

  const react = async (id: number, emoji: string) => {
    const had = mine[id]?.includes(emoji);
    const nextMine = { ...mine, [id]: had ? mine[id].filter((e) => e !== emoji) : [...(mine[id] ?? []), emoji] };
    setMineRaw(JSON.stringify(nextMine));
    setReactions((r) => ({ ...r, [id]: { ...r[id], [emoji]: Math.max(0, (r[id]?.[emoji] ?? 0) + (had ? -1 : 1)) } }));
    try {
      const fresh = await toggleMalfuzReaction(id, emoji);
      if (fresh) setReactions((r) => ({ ...r, [id]: fresh }));
    } catch {}
  };

  const needle = q.trim();
  const shown = malfuzat.filter((m) => !needle || m.text.includes(needle) || m.author?.includes(needle));
  const [featured, ...rest] = shown;

  return (
    <div>
      <PageHeader
        eyebrow={t("হযরতের বাণী", "Words of wisdom")}
        title={t("মালফুযাত", "Malfuzat")}
        muted={t(`${num(malfuzat.length, lang)}টি`, `${malfuzat.length}`)}
        actions={<SearchInput value={q} onChange={setQ} placeholder={t("মালফুযাত খুঁজুন…", "Search…")} />}
      />

      {!featured ? (
        <EmptyState icon={Quote} title={t("কিছু পাওয়া যায়নি", "Nothing found")} />
      ) : (
        <>
          <MalfuzCard m={featured} featured reactions={reactions[featured.id]} mine={mine[featured.id] ?? []} onReact={react} />
          <div className="mt-4 columns-1 gap-4 sm:mt-5 md:columns-2 2xl:columns-3 [&>*]:mb-4">
            {rest.map((m) => (
              <MalfuzCard key={m.id} m={m} reactions={reactions[m.id]} mine={mine[m.id] ?? []} onReact={react} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MalfuzCard({
  m,
  featured,
  reactions,
  mine,
  onReact,
}: {
  m: Malfuz;
  featured?: boolean;
  reactions: Record<string, number> | undefined;
  mine: string[];
  onReact: (id: number, emoji: string) => void;
}) {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${m.text}\n\n— ${m.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ text: `${m.text}\n\n— ${m.author}`, url: `${SITE_URL}/malfuzat` });
      else await copy();
    } catch {}
  };

  return (
    <article className={cn("break-inside-avoid rounded-3xl p-5 sm:p-6", featured ? "relative overflow-hidden bg-brand text-white sm:p-8" : "bg-panel")}>
      {featured && <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10" />}
      <Quote className={cn("relative h-7 w-7", featured ? "text-white/40" : "text-brand/40")} />
      <p className={cn("relative mt-3 leading-relaxed whitespace-pre-line", featured ? "text-lg sm:text-xl" : "text-[15px] text-ink")}>{m.text}</p>
      <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("truncate text-sm font-medium", !featured && "text-ink")}>{m.author}</p>
          <p className={cn("text-xs", featured ? "text-white/65" : "text-ink-3")}>{formatDate(m.createdAt, lang)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {EMOJIS.map((e) => {
            const on = mine.includes(e);
            return (
              <button
                key={e}
                onClick={() => onReact(m.id, e)}
                aria-pressed={on}
                className={cn(
                  "inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-sm transition",
                  featured ? (on ? "bg-white text-brand-strong" : "bg-white/15 hover:bg-white/25") : on ? "bg-brand-soft ring-1 ring-brand/40" : "bg-panel-2 hover:bg-brand-soft",
                )}
              >
                {e}
                <span className={cn("font-num text-xs", !featured && "text-ink-2")}>{num(reactions?.[e] ?? 0, lang)}</span>
              </button>
            );
          })}
          <button onClick={copy} aria-label={t("কপি", "Copy")} className={cn("flex h-9 w-9 items-center justify-center rounded-full", featured ? "bg-white/15" : "bg-panel-2 text-ink-2")}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button onClick={share} aria-label={t("শেয়ার", "Share")} className={cn("flex h-9 w-9 items-center justify-center rounded-full", featured ? "bg-white/15" : "bg-panel-2 text-ink-2")}>
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

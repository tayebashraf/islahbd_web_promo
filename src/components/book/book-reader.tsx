"use client";

import { useMemo, useState } from "react";
import { BookMarked, BookOpen, Check, Copy, Share2 } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, NumberBadge, PageHeader, Pill, SearchInput } from "@/components/dashboard/ui";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface BookText {
  name?: string;
  arabic?: string;
  text?: string;
  type?: string;
  bangla_translation?: string;
  recite_count?: string;
  pronunciation?: string;
}

export interface BookItem {
  id: string;
  serial?: string;
  title: string;
  fazilat?: string;
  reference?: string;
  narrator?: string;
  method?: string;
  amal_text?: BookText[];
}

export interface BookCategory {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  items: BookItem[];
}

export interface Book {
  title: string;
  description?: string;
  source_book?: string;
  author?: string;
  translator?: string;
  categories: BookCategory[];
}

const ARABIC = /[؀-ۿ]/g;
export const isMostlyArabic = (s: string) => (s.match(ARABIC)?.length ?? 0) > s.replace(/\s/g, "").length * 0.5;

/**
 * Reader for the app's JSON "kitab" files (duas, Hajj guide, …): category
 * list on the side, item cards with Arabic, translation, virtue and source.
 */
export function BookReader({
  book,
  initialCat,
  title,
  unit,
  highlight,
}: {
  book: Book;
  initialCat?: string;
  title: [string, string];
  unit: [string, string];
  /** Category to badge as "today" (e.g. the day's manzil). */
  highlight?: string;
}) {
  const { t, lang } = useLang();
  const cats = useMemo(() => book.categories.filter((c) => c.items.length), [book]);
  const [catId, setCatId] = useState(() => (cats.some((c) => c.id === initialCat) ? initialCat! : cats[0]?.id));
  const [q, setQ] = useState("");
  const total = cats.reduce((n, c) => n + c.items.length, 0);
  const active = cats.find((c) => c.id === catId) ?? cats[0];

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    return cats.flatMap((c) =>
      c.items
        .filter((it) =>
          [it.title, it.fazilat, ...(it.amal_text ?? []).flatMap((b) => [b.bangla_translation, b.name, b.arabic])].some((s) => s?.toLowerCase().includes(needle)),
        )
        .map((it) => ({ it, cat: c })),
    );
  }, [q, cats]);

  const pick = (id: string) => {
    setCatId(id);
    setQ("");
    const url = new URL(window.location.href);
    url.searchParams.set("c", id);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader
        title={t(...title)}
        muted={t(`মোট ${num(total, lang)}টি ${unit[0]}`, `${total} ${unit[1]}`)}
        actions={<SearchInput value={q} onChange={setQ} placeholder={t(`${unit[0]} খুঁজুন…`, `Search ${unit[1]}…`)} />}
      />

      {(book.source_book || book.author) && (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-ink-2">
          <BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>
            {book.source_book && <span className="font-semibold text-ink">{book.source_book}</span>}
            {book.author && <> — {book.author}</>}
            {book.translator && (
              <span className="text-ink-3">
                {" · "}
                {t("অনুবাদ", "Translated by")}: {book.translator}
              </span>
            )}
          </span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
        {/* Categories: chips on phones, a sticky list on desktop */}
        <nav aria-label={t("বিভাগ", "Categories")} className="lg:sticky lg:top-24 lg:h-fit">
          <ul className="scroll-hide -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-0">
            {cats.map((c, i) => {
              const on = !hits && c.id === active?.id;
              return (
                <li key={c.id} className="shrink-0 lg:shrink">
                  <button
                    onClick={() => pick(c.id)}
                    aria-current={on ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-2 pe-4 text-start transition lg:p-3",
                      on ? "border-brand bg-brand text-white" : "border-line bg-panel text-ink hover:border-brand/40",
                    )}
                  >
                    <NumberBadge n={num(i + 1, lang)} className={cn("h-9 w-9", on && "bg-white/20 text-white")} />
                    <span className="min-w-0">
                      <span className="block text-[15px] leading-snug whitespace-nowrap lg:whitespace-normal">
                        {c.title}
                        {c.id === highlight && (
                          <span className={cn("ms-2 rounded-full px-2 py-0.5 text-[11px]", on ? "bg-white/25" : "bg-live text-white")}>{t("আজ", "Today")}</span>
                        )}
                      </span>
                      <span className={cn("hidden text-xs lg:block", on ? "text-white/75" : "text-ink-3")}>
                        {t(`${num(c.items.length, lang)}টি ${unit[0]}`, `${c.items.length} ${unit[1]}`)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          {hits ? (
            <>
              <p className="mb-3 text-[15px] text-ink-2">
                {t(`অনুসন্ধানের ফল: ${num(hits.length, lang)}টি`, `${hits.length} results`)}
              </p>
              {hits.length ? (
                <div className="space-y-4">
                  {hits.slice(0, 60).map(({ it, cat }, i) => (
                    <ItemCard key={it.id} item={it} n={i + 1} context={cat.title} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={BookOpen} title={t("কিছু পাওয়া যায়নি", "Nothing found")} hint={t("অন্য শব্দ দিয়ে খুঁজে দেখুন", "Try a different search")} />
              )}
            </>
          ) : active ? (
            <>
              <div className="mb-4">
                <h2 className="font-heading text-xl text-ink sm:text-2xl">{active.title}</h2>
                {(active.subtitle || active.description) && <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{active.subtitle || active.description}</p>}
              </div>
              <div className="space-y-4">
                {active.items.map((it, i) => (
                  <ItemCard key={it.id} item={it} n={i + 1} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Paragraphs with Arabic lines set right-to-left in the Quranic face. */
export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {text
        .split(/\n+/)
        .filter((l) => l.trim())
        .map((line, i) =>
          isMostlyArabic(line) ? (
            <p key={i} dir="rtl" lang="ar" className="font-arabic text-[26px] leading-[2.1] text-ink">
              {line}
            </p>
          ) : (
            <p key={i} className="text-[16px] leading-[1.85] text-ink-2">
              {line}
            </p>
          ),
        )}
    </div>
  );
}

export function ItemCard({ item, n, context }: { item: BookItem; n: number; context?: string }) {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const blocks = item.amal_text ?? [];

  const copy = async () => {
    const parts = [
      item.title,
      ...blocks.map((b) => [b.name, b.arabic ?? b.text, b.pronunciation, b.bangla_translation, b.recite_count].filter(Boolean).join("\n")),
      item.fazilat,
      item.reference && `${t("সূত্র", "Ref")}: ${item.reference}`,
      "— islahbd.com",
    ];
    try {
      const text = parts.filter(Boolean).join("\n\n");
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) await navigator.share({ title: item.title, text });
      else await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <article id={item.id} className="scroll-mt-24 rounded-2xl border border-line bg-panel p-4 sm:p-6">
      <header className="flex items-start gap-3">
        <NumberBadge n={item.serial || num(n, lang)} />
        <div className="min-w-0 flex-1 pt-1">
          {context && <p className="text-xs text-brand">{context}</p>}
          {item.title && <h3 className="text-[17px] leading-snug font-semibold text-ink sm:text-lg">{item.title}</h3>}
        </div>
        <button
          onClick={copy}
          aria-label={t("কপি / শেয়ার", "Copy / share")}
          title={t("কপি / শেয়ার", "Copy / share")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panel-2 text-brand hover:bg-brand-soft"
        >
          {copied ? <Check className="h-4 w-4" /> : typeof navigator !== "undefined" && "share" in navigator ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </header>

      {blocks.length > 0 && (
        <div className="mt-4 space-y-3">
          {blocks.map((b, i) => {
            const arabic = b.arabic || (b.type === "arabic" || (b.text && isMostlyArabic(b.text)) ? b.text : undefined);
            return (
              <div key={i} className="rounded-xl bg-panel-2 p-4">
                {(b.name || b.recite_count) && (
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    {b.name && <p className="text-[15px] font-semibold text-ink">{b.name}</p>}
                    {b.recite_count && <Pill tone="soft">{b.recite_count}</Pill>}
                  </div>
                )}
                {arabic && (
                  <p dir="rtl" lang="ar" className="font-arabic text-[26px] leading-[2.15] text-ink sm:text-[28px]">
                    {arabic}
                  </p>
                )}
                {!arabic && b.text && <p className="text-[16px] leading-relaxed text-ink-2">{b.text}</p>}
                {b.pronunciation && <p className="mt-2 text-[15px] text-ink-2 italic">{b.pronunciation}</p>}
                {b.bangla_translation && (
                  <p className="mt-2 border-t border-line pt-2 text-[15.5px] leading-relaxed text-ink-2">
                    <span className="font-semibold text-brand">{t("অর্থ: ", "Meaning: ")}</span>
                    {b.bangla_translation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {item.method && (
        <p className="mt-3 rounded-xl bg-panel-2 p-3 text-[15px] text-ink-2">
          <span className="font-semibold text-ink">{t("পদ্ধতি: ", "Method: ")}</span>
          {item.method}
        </p>
      )}
      {item.fazilat && <RichText text={item.fazilat} className="mt-4" />}
      {(item.reference || item.narrator) && (
        <footer className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-[13px] text-ink-3">
          {item.narrator && <span>{item.narrator}</span>}
          {item.reference && (
            <span className="inline-flex items-center gap-1.5">
              <BookMarked className="h-3.5 w-3.5 text-brand" />
              {item.reference}
            </span>
          )}
        </footer>
      )}
    </article>
  );
}

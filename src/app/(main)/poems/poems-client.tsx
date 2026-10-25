"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Feather } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, NumberBadge, PageHeader, SearchInput } from "@/components/dashboard/ui";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE = 40;

export function PoemsClient({
  poets,
  poems,
  initialPoet,
}: {
  poets: { id: string; name: string; era: string; count: number }[];
  poems: { id: string; title: string; poet: string; book: string; line: string }[];
  initialPoet?: string;
}) {
  const { t, lang } = useLang();
  const [poet, setPoet] = useState(poets.some((p) => p.id === initialPoet) ? initialPoet! : "all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return poems.filter((p) => (poet === "all" || p.poet === poet) && (!needle || p.title.toLowerCase().includes(needle) || p.line.toLowerCase().includes(needle) || p.book.toLowerCase().includes(needle)));
  }, [poems, poet, q]);
  const poetName = Object.fromEntries(poets.map((p) => [p.id, p.name]));

  const choose = (id: string) => {
    setPoet(id);
    setLimit(PAGE);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("poet");
    else url.searchParams.set("poet", id);
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      <PageHeader
        title={t("কবিতা ও কালাম", "Poetry")}
        muted={t(`মোট ${num(poems.length, lang)}টি কবিতা`, `${poems.length} poems`)}
        actions={<SearchInput value={q} onChange={(v) => (setQ(v), setLimit(PAGE))} placeholder={t("কবিতা খুঁজুন…", "Search poems…")} />}
      />

      <ul className="scroll-hide -mx-4 mb-5 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 xl:grid-cols-3">
        <li className="shrink-0">
          <PoetCard on={poet === "all"} onClick={() => choose("all")} name={t("সকল কবি", "All poets")} meta={t(`${num(poems.length, lang)}টি কবিতা`, `${poems.length} poems`)} />
        </li>
        {poets.map((p) => (
          <li key={p.id} className="shrink-0">
            <PoetCard on={poet === p.id} onClick={() => choose(p.id)} name={p.name} meta={`${p.era} · ${t(`${num(p.count, lang)}টি`, `${p.count}`)}`} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <EmptyState icon={Feather} title={t("কিছু পাওয়া যায়নি", "Nothing found")} />
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.slice(0, limit).map((p, i) => (
            <li key={p.id}>
              <Link href={`/poems/${p.id}`} className="flex h-full items-start gap-3.5 rounded-2xl border border-line bg-panel p-4 transition hover:border-brand/40">
                <NumberBadge n={num(i + 1, lang)} />
                <span className="min-w-0">
                  <span className="block text-[16.5px] font-semibold text-ink">{p.title}</span>
                  <span className="mt-0.5 line-clamp-1 block text-[15px] text-ink-2">{p.line}</span>
                  <span className="mt-1 block truncate text-xs text-brand">
                    {poet === "all" ? `${poetName[p.poet]} · ` : ""}
                    {p.book}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {filtered.length > limit && (
        <div className="mt-6 flex justify-center">
          <button onClick={() => setLimit((l) => l + PAGE)} className="h-12 rounded-2xl bg-brand px-7 text-[15px] font-medium text-white">
            {t(`আরও দেখুন (${num(filtered.length - limit, lang)})`, `Show more (${filtered.length - limit})`)}
          </button>
        </div>
      )}
    </div>
  );
}

function PoetCard({ on, onClick, name, meta }: { on: boolean; onClick: () => void; name: string; meta: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-full w-64 items-center gap-3 rounded-2xl border p-3 text-start transition lg:w-full",
        on ? "border-brand bg-brand text-white" : "border-line bg-panel text-ink hover:border-brand/40",
      )}
    >
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", on ? "bg-white/20" : "bg-icon-bg text-brand")}>
        <Feather className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="line-clamp-1 block text-[15px] font-medium">{name}</span>
        <span className={cn("line-clamp-1 block text-xs", on ? "text-white/75" : "text-ink-3")}>{meta}</span>
      </span>
    </button>
  );
}

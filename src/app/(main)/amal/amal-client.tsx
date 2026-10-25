"use client";

import { useMemo, useState } from "react";
import { BookMarked, Check, Copy, ScrollText, User } from "lucide-react";
import type { AmalCategory, AmalItem, AmalSection, AmalText } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, PageHeader, Panel, Pill, SearchInput } from "@/components/dashboard/ui";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

const SECTIONS: { id: AmalSection; bn: string; en: string; descBn: string }[] = [
  { id: "amal", bn: "আমল", en: "Amal", descBn: "হেফাজত ও বরকতের আমল" },
  { id: "wazifa", bn: "ওয়াজিফা", en: "Wazifa", descBn: "ছালেকীনের মা'মূলাত" },
  { id: "sunnat", bn: "সুন্নাত", en: "Sunnah", descBn: "দৈনন্দিন জীবনের সুন্নাত" },
  { id: "fazilat", bn: "ফযীলত", en: "Virtues", descBn: "সূরা ও আমলের ফযীলত" },
];

const ARABIC = /[؀-ۿ]/;
const isMostlyArabic = (line: string) => {
  const letters = line.replace(/[\s\d.,:;()\-–—'"!?]/g, "");
  if (!letters) return false;
  const ar = [...letters].filter((c) => ARABIC.test(c)).length;
  return ar / letters.length > 0.6;
};

export function AmalClient({
  categories,
  initialSection,
  initialCategory,
}: {
  categories: AmalCategory[];
  initialSection: AmalSection;
  initialCategory?: number;
}) {
  const { t, lang } = useLang();
  const startCat = categories.find((c) => c.id === initialCategory);
  const [section, setSection] = useState<AmalSection>(startCat?.section ?? initialSection);
  const [catId, setCatId] = useState<number | undefined>(startCat?.id);
  const [q, setQ] = useState("");

  const inSection = useMemo(() => categories.filter((c) => c.section === section), [categories, section]);
  const active = inSection.find((c) => c.id === catId) ?? inSection[0];

  const sync = (s: AmalSection, c?: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("section", s);
    if (c) url.searchParams.set("category", String(c));
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
  };

  const needle = q.trim();
  const searchHits = useMemo(() => {
    if (!needle) return null;
    return categories.flatMap((c) =>
      c.items
        .filter((i) => [i.title, i.fazilat, i.reference].some((s) => s?.includes(needle)))
        .map((i) => ({ item: i, cat: c })),
    );
  }, [categories, needle]);

  return (
    <div>
      <PageHeader
        eyebrow={t("দৈনন্দিন আমল", "Daily practice")}
        title={t("আমল ও সুন্নাত", "Amal & Sunnah")}
        muted={t(`${num(categories.reduce((a, c) => a + c.itemCount, 0), lang)}টি`, "")}
        description={t("দলিলসহ আমল, ওয়াজিফা, সুন্নাত ও ফযীলত — অ্যাপের মতোই, এখন ওয়েবে।", "Practices with references — same as the app, now on the web.")}
        actions={<SearchInput value={q} onChange={setQ} placeholder={t("আমল খুঁজুন…", "Search…")} />}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {SECTIONS.map((s) => {
          const cats = categories.filter((c) => c.section === s.id);
          const on = s.id === section && !searchHits;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSection(s.id);
                setCatId(undefined);
                setQ("");
                sync(s.id);
              }}
              className={cn("panel p-4 text-start transition sm:p-5", on ? "bg-brand text-white" : "hover:ring-2 hover:ring-brand/20")}
            >
              <p className={cn("text-xs", on ? "text-white/75" : "text-ink-3")}>{t(s.descBn, `${cats.length} collections`)}</p>
              <p className="mt-1 flex items-baseline justify-between gap-2">
                <span className={cn("text-lg font-semibold", !on && "text-ink")}>{t(s.bn, s.en)}</span>
                <span className={cn("font-num text-2xl font-semibold", !on && "text-ink")}>{num(cats.reduce((a, c) => a + c.itemCount, 0), lang)}</span>
              </p>
            </button>
          );
        })}
      </div>

      {searchHits ? (
        <Panel className="mt-4 sm:mt-5">
          <h2 className="text-base font-semibold text-ink">
            {t("অনুসন্ধানের ফল", "Results")} <span className="font-normal text-ink-3">({num(searchHits.length, lang)})</span>
          </h2>
          <div className="mt-4 space-y-3">
            {searchHits.length ? (
              searchHits.slice(0, 40).map(({ item, cat }) => <ItemCard key={item.id} item={item} context={cat.title} />)
            ) : (
              <EmptyState icon={ScrollText} title={t("কিছু পাওয়া যায়নি", "Nothing found")} />
            )}
          </div>
        </Panel>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-12">
          <Panel className="h-fit p-3 sm:p-3 xl:sticky xl:top-5 xl:col-span-4">
            <ul className="scroll-hide flex gap-2 overflow-x-auto xl:max-h-[70vh] xl:flex-col xl:gap-1 xl:overflow-y-auto">
              {inSection.map((c) => {
                const on = c.id === active?.id;
                return (
                  <li key={c.id} className="shrink-0 xl:shrink">
                    <button
                      onClick={() => {
                        setCatId(c.id);
                        sync(section, c.id);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-full p-2 pe-4 text-start text-sm transition xl:rounded-[18px]",
                        on ? "bg-brand text-white" : "bg-panel-2 text-ink hover:bg-brand-soft xl:bg-transparent",
                      )}
                    >
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-num text-xs font-semibold", on ? "bg-white/20" : "bg-brand-soft text-brand-strong dark:text-brand")}>
                        {num(c.itemCount, lang)}
                      </span>
                      <span className="whitespace-nowrap xl:line-clamp-2 xl:whitespace-normal">{c.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <div className="xl:col-span-8">
            {active ? (
              <Panel>
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong dark:text-brand">
                    <ScrollText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-ink">{active.title}</h2>
                    <p className="text-xs text-ink-3">{t(`${num(active.itemCount, lang)}টি বিষয়`, `${active.itemCount} items`)}</p>
                  </div>
                </div>
                {active.description && <p className="mt-4 rounded-2xl bg-panel-2 p-4 text-sm leading-relaxed whitespace-pre-line text-ink-2">{active.description}</p>}
                <div className="mt-5 space-y-3">
                  {active.items.map((item, i) => (
                    <ItemCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </Panel>
            ) : (
              <EmptyState icon={ScrollText} title={t("এই বিভাগে এখনো কিছু নেই", "Nothing here yet")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      {text
        .split(/\n+/)
        .filter((l) => l.trim())
        .map((line, i) =>
          isMostlyArabic(line) ? (
            <p key={i} dir="rtl" className="font-arabic text-2xl leading-[2.1] text-ink">
              {line}
            </p>
          ) : (
            <p key={i} className="text-[15px] leading-relaxed text-ink-2">
              {line}
            </p>
          ),
        )}
    </div>
  );
}

function TextBlock({ b }: { b: AmalText }) {
  const { t } = useLang();
  const arabic = b.arabic || (b.type === "arabic" ? b.text : undefined);
  // Arabic already rendered inline by the fazilat text is common in sunnat
  // items; the dedicated block keeps the copyable version.
  return (
    <div className="rounded-2xl border border-line bg-panel p-4">
      {(b.name || b.recite_count) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {b.name && <p className="text-sm font-semibold text-ink">{b.name}</p>}
          {b.recite_count && <Pill tone="soft">{b.recite_count}</Pill>}
        </div>
      )}
      {arabic && (
        <p dir="rtl" className="font-arabic text-[26px] leading-[2.1] text-ink">
          {arabic}
        </p>
      )}
      {!arabic && b.text && <p className="text-[15px] leading-relaxed text-ink-2">{b.text}</p>}
      {b.pronunciation && <p className="mt-2 text-sm text-ink-2 italic">{b.pronunciation}</p>}
      {b.bangla_translation && (
        <p className="mt-2 border-t border-line pt-2 text-sm leading-relaxed text-ink-2">
          <span className="font-medium text-ink">{t("অর্থ: ", "Meaning: ")}</span>
          {b.bangla_translation}
        </p>
      )}
    </div>
  );
}

function ItemCard({ item, index, context }: { item: AmalItem; index?: number; context?: string }) {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  // Sunnat items embed the same Arabic in `fazilat`; skip duplicate blocks.
  const blocks = item.amalText.filter((b) => !(b.type === "arabic" && b.text && item.fazilat.includes(b.text.trim())));

  const copy = async () => {
    const parts = [
      item.title,
      item.fazilat,
      ...item.amalText.map((b) => [b.name, b.arabic ?? b.text, b.bangla_translation, b.recite_count].filter(Boolean).join("\n")),
      item.reference && `${t("সূত্র", "Ref")}: ${item.reference}`,
    ];
    try {
      await navigator.clipboard.writeText(parts.filter(Boolean).join("\n\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <article className="rounded-2xl bg-panel-2 p-4 sm:p-5">
      <header className="flex items-start gap-3">
        {index !== undefined && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-num text-xs font-semibold text-white">{num(index + 1, lang)}</span>
        )}
        <div className="min-w-0 flex-1">
          {(item.serial || context) && <p className="text-[11px] font-medium text-brand">{[context, item.serial].filter(Boolean).join(" · ")}</p>}
          <h3 className="font-semibold text-ink">{item.title}</h3>
        </div>
        <button onClick={copy} aria-label={t("কপি", "Copy")} title={t("কপি", "Copy")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink-2 hover:text-ink">
          {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
        </button>
      </header>
      {item.fazilat && (
        <div className="mt-3">
          <RichText text={item.fazilat} />
        </div>
      )}
      {item.method && (
        <p className="mt-3 rounded-2xl bg-panel p-3 text-sm text-ink-2">
          <span className="font-medium text-ink">{t("পদ্ধতি: ", "Method: ")}</span>
          {item.method}
        </p>
      )}
      {blocks.length > 0 && (
        <div className="mt-3 space-y-2">
          {blocks.map((b, i) => (
            <TextBlock key={i} b={b} />
          ))}
        </div>
      )}
      {(item.reference || item.narrator) && (
        <footer className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
          {item.narrator && (
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.narrator}
            </span>
          )}
          {item.reference && (
            <span className="inline-flex items-center gap-1">
              <BookMarked className="h-3 w-3" />
              {item.reference}
            </span>
          )}
        </footer>
      )}
    </article>
  );
}

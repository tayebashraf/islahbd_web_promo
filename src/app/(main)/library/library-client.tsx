"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen, Download, ExternalLink, Library } from "lucide-react";
import type { Book } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, MediaHeader } from "@/components/dashboard/ui";
import { num } from "@/lib/format";

export function LibraryClient({ books }: { books: Book[] }) {
  const { t, lang } = useLang();
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = books.filter((b) => !needle || b.title.toLowerCase().includes(needle) || b.author?.toLowerCase().includes(needle));

  return (
    <div>
      <MediaHeader title={t("বই ও কিতাব", "Books")} count={num(books.length, lang)} query={q} onQuery={setQ} placeholder={t("বই বা লেখক খুঁজুন…", "Search books or authors…")} />

      {shown.length === 0 ? (
        <EmptyState icon={Library} title={books.length ? t("কিছু পাওয়া যায়নি", "Nothing found") : t("এখনো কোনো বই যোগ হয়নি", "No books yet")} />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {shown.map((b) => (
            <li key={b.id} className="flex flex-col rounded-2xl border border-line bg-panel p-2.5 sm:p-3">
              <a href={b.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-panel-2">
                {b.coverUrl ? (
                  <Image src={b.coverUrl} alt={b.title} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover transition duration-500 hover:scale-105" unoptimized />
                ) : (
                  <span className="flex h-full items-center justify-center text-ink-3">
                    <BookOpen className="h-8 w-8" />
                  </span>
                )}
              </a>
              <p className="mt-2.5 line-clamp-2 px-0.5 text-[15px] leading-snug font-semibold text-ink">{b.title}</p>
              {b.author && b.author !== b.title && <p className="truncate px-0.5 text-xs text-ink-3">{b.author}</p>}
              <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3">
                <a href={b.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-brand text-xs font-medium text-white hover:bg-brand-strong">
                  <ExternalLink className="h-3.5 w-3.5" /> {t("পড়ুন", "Read")}
                </a>
                <a href={b.pdfUrl} download className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-panel-2 text-xs font-medium text-ink hover:bg-brand-soft">
                  <Download className="h-3.5 w-3.5" /> PDF
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

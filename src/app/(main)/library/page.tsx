import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Download, ExternalLink, Library } from "lucide-react";
import { getBooks } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { LibraryHeader } from "./library-header";

export const metadata: Metadata = {
  title: "লাইব্রেরি — বই পড়ুন ও ডাউনলোড করুন",
  description: "islahbd লাইব্রেরির বইসমূহ অনলাইনে পড়ুন বা PDF ডাউনলোড করুন।",
  alternates: { canonical: `${SITE_URL}/library` },
};

export default async function LibraryPage() {
  const books = await getBooks();
  return (
    <div>
      <LibraryHeader count={books.length} />
      {books.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-14 text-sm text-ink-3">
          <Library className="h-5 w-5" />
          এখনো কোনো বই যোগ হয়নি
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-6">
          {books.map((b) => (
            <li key={b.id} className="panel flex flex-col p-3">
              <a href={b.pdfUrl} target="_blank" rel="noopener noreferrer" className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-panel-2">
                {b.coverUrl ? (
                  <Image src={b.coverUrl} alt={b.title} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover transition duration-500 hover:scale-105" unoptimized />
                ) : (
                  <span className="flex h-full items-center justify-center text-ink-3">
                    <BookOpen className="h-8 w-8" />
                  </span>
                )}
              </a>
              <p className="mt-3 line-clamp-2 px-1 text-sm font-semibold text-ink">{b.title}</p>
              {b.author && b.author !== b.title && <p className="truncate px-1 text-xs text-ink-3">{b.author}</p>}
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <a href={b.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-brand text-xs font-medium text-white hover:bg-brand-strong">
                  <ExternalLink className="h-3.5 w-3.5" /> পড়ুন
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

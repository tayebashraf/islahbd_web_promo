"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Feather } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader } from "@/components/dashboard/ui";
import type { Poem } from "@/lib/poems";

export function PoemView({
  poem,
  poetEra,
  prev,
  next,
}: {
  poem: Poem;
  poetEra?: string;
  prev?: { id: string; title: string };
  next?: { id: string; title: string };
}) {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={poem.title} muted={poem.poet_name} description={[poem.book_source, poetEra].filter(Boolean).join(" · ")} />

      <article className="rounded-2xl border border-line bg-panel p-5 sm:p-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-icon-bg px-3 py-1 text-xs text-brand">
          <Feather className="h-3.5 w-3.5" /> {t(`মূল ভাষা: ${poem.original_language}`, `Original: ${poem.original_language === "উর্দু" ? "Urdu" : "Persian"}`)}
        </p>
        <div dir="rtl" lang={poem.original_language === "উর্দু" ? "ur" : "fa"} className="font-nastaliq rounded-xl bg-panel-2 px-4 py-5 text-center text-[22px] leading-[2.4] whitespace-pre-line text-ink sm:text-[26px]">
          {poem.original_text}
        </div>

        <h2 className="mt-6 mb-2 text-sm font-semibold text-brand">{t("বাংলা অনুবাদ", "Bangla translation")}</h2>
        <p className="text-center text-[18px] leading-[2] whitespace-pre-line text-ink">{poem.bangla_translation}</p>

        {poem.sharh && (
          <>
            <h2 className="mt-8 mb-2 text-sm font-semibold text-brand">{t("শরাহ (ব্যাখ্যা)", "Commentary")}</h2>
            <p className="text-[16.5px] leading-[1.95] whitespace-pre-line text-ink-2">{poem.sharh}</p>
          </>
        )}
      </article>

      <nav className="mt-5 grid grid-cols-2 gap-3">
        {prev ? (
          <Link href={`/poems/${prev.id}`} className="flex items-center gap-2 rounded-2xl border border-line bg-panel p-4 text-start hover:border-brand/40">
            <ChevronLeft className="h-5 w-5 shrink-0 text-brand rtl:rotate-180" />
            <span className="min-w-0">
              <span className="block text-xs text-ink-3">{t("আগের কবিতা", "Previous")}</span>
              <span className="block truncate text-[15px] text-ink">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/poems/${next.id}`} className="flex items-center justify-end gap-2 rounded-2xl border border-line bg-panel p-4 text-end hover:border-brand/40">
            <span className="min-w-0">
              <span className="block text-xs text-ink-3">{t("পরের কবিতা", "Next")}</span>
              <span className="block truncate text-[15px] text-ink">{next.title}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-brand rtl:rotate-180" />
          </Link>
        )}
      </nav>
      <div className="mt-4 text-center">
        <Link href={`/poems?poet=${poem.poet_id}`} className="text-[15px] text-brand hover:underline">
          {t("এই কবির সব কবিতা", "All poems by this poet")}
        </Link>
      </div>
    </div>
  );
}

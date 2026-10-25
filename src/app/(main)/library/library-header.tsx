"use client";

import { useLang } from "@/components/providers/lang-provider";
import { PageHeader } from "@/components/dashboard/ui";
import { num } from "@/lib/format";

export function LibraryHeader({ count }: { count: number }) {
  const { t, lang } = useLang();
  return (
    <PageHeader
      eyebrow={t("বই", "Books")}
      title={t("লাইব্রেরি", "Library")}
      muted={t(`${num(count, lang)}টি বই`, `${count} books`)}
      description={t("বই অনলাইনে পড়ুন বা PDF ডাউনলোড করে রাখুন।", "Read online or keep the PDF.")}
    />
  );
}

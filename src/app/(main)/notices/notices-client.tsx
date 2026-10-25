"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, ChevronDown, Megaphone } from "lucide-react";
import type { Notice } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { EmptyState, PageHeader, Pill } from "@/components/dashboard/ui";
import { formatDate, num, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export function NoticesClient({ notices }: { notices: Notice[] }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(notices[0]?.id ?? null);

  return (
    <div>
      <PageHeader eyebrow={t("ঘোষণা", "Announcements")} title={t("নোটিশ বোর্ড", "Notice board")} muted={t(`${num(notices.length, lang)}টি`, `${notices.length}`)} />
      {notices.length === 0 ? (
        <EmptyState icon={Megaphone} title={t("এখন কোনো নোটিশ নেই", "No notices right now")} />
      ) : (
        <ul className="space-y-3">
          {notices.map((n, i) => {
            const expanded = open === n.id;
            const [first, ...body] = n.description.split("\n");
            return (
              <li key={n.id} className="panel overflow-hidden">
                <button onClick={() => setOpen(expanded ? null : n.id)} aria-expanded={expanded} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
                  {n.imageUrl ? (
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-panel-2">
                      <Image src={n.imageUrl} alt="" fill sizes="56px" className="object-cover" unoptimized />
                    </span>
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong dark:text-brand">
                      <Megaphone className="h-5 w-5" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-ink">{first || n.title}</p>
                      {i === 0 && <Pill>{t("নতুন", "New")}</Pill>}
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-3">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(n.date, lang)} · {timeAgo(n.date, lang)}
                    </p>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-ink-3 transition", expanded && "rotate-180")} />
                </button>
                {expanded && (
                  <div className="grid gap-5 border-t border-line p-4 sm:p-6 lg:grid-cols-[1fr_320px]">
                    <p className="text-[15px] leading-relaxed whitespace-pre-line text-ink-2">{body.join("\n").trim() || n.description}</p>
                    {n.imageUrl && (
                      <a href={n.imageUrl} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-panel-2">
                        <Image src={n.imageUrl} alt={n.title} fill sizes="320px" className="object-cover" unoptimized />
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

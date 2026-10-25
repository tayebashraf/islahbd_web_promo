import { Check } from "lucide-react";
import type { Block } from "@/data/paribar";

/** Renders long-form content blocks (headings, paragraphs, quotes, lists). */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) =>
        b.h ? (
          <h3 key={i} className="pt-3 font-heading text-xl text-ink first:pt-0">
            {b.h}
          </h3>
        ) : b.quote ? (
          <blockquote key={i} className="rounded-2xl border-s-4 border-brand bg-brand-soft px-5 py-4 text-[17px] leading-[1.9] whitespace-pre-line text-ink">
            {b.quote}
          </blockquote>
        ) : b.list ? (
          <ul key={i} className="space-y-2">
            {b.list.map((l) => (
              <li key={l} className="flex gap-3 text-[16.5px] leading-relaxed text-ink">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-icon-bg text-brand">
                  <Check className="h-3 w-3" />
                </span>
                {l}
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="text-[16.5px] leading-[1.95] whitespace-pre-line text-ink-2">
            {b.p}
          </p>
        ),
      )}
    </div>
  );
}

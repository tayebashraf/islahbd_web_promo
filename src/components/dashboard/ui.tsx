"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronRight, House, Loader2, Pause, Play, Search, X, type LucideIcon } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { sectionFor } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Panel({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("panel p-4 sm:p-5", className)} {...rest}>
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  subtitle,
  icon: Icon,
  href,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-start gap-3", className)}>
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-icon-bg text-brand">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      )}
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="truncate text-base font-semibold leading-tight text-ink sm:text-[17px]">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-xs text-ink-3">{subtitle}</p>}
      </div>
      {action}
      {href && <ArrowLink href={href} />}
    </header>
  );
}

export function ArrowLink({ href, label = "Open", className }: { href: string; label?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panel-2 text-brand transition hover:bg-brand hover:text-white rtl:-scale-x-100",
        className,
      )}
    >
      <ArrowUpRight className="h-[18px] w-[18px]" />
    </Link>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
  size = "md",
}: {
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="tablist" className={cn("inline-flex shrink-0 items-center rounded-full border border-line bg-panel-2 p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full font-medium whitespace-nowrap transition",
            size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-[13px]",
            value === o.value ? "bg-brand text-white shadow-sm" : "text-ink-3 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({
  active,
  children,
  onClick,
  count,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  count?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-medium whitespace-nowrap transition",
        active ? "border-brand bg-brand text-white shadow-xs" : "border-line bg-panel text-ink-2 hover:border-brand/50 hover:text-brand",
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("rounded-full px-1.5 font-num text-[10px] sm:text-[11px]", active ? "bg-white/20" : "bg-panel-2 text-ink-3")}>
          {count}
        </span>
      )}
    </button>
  );
}

/** Small green pill used for deltas / counts, like "+12.8%" in the reference. */
export function Pill({ children, className, tone = "brand" }: { children: React.ReactNode; className?: string; tone?: "brand" | "soft" | "live" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-num text-[11px] font-semibold whitespace-nowrap",
        tone === "brand" && "bg-brand text-white",
        tone === "soft" && "bg-brand-soft text-brand-strong dark:text-brand",
        tone === "live" && "bg-live/12 text-live",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PlayButton({
  playing,
  loading,
  onClick,
  size = "md",
  label,
  className,
}: {
  playing: boolean;
  loading?: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  label: string;
  className?: string;
}) {
  const dims = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const icon = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition active:scale-95",
        playing ? "bg-brand text-white shadow-md shadow-brand/30" : "bg-icon-bg text-brand hover:bg-brand hover:text-white",
        dims,
        className,
      )}
    >
      {loading ? (
        <Loader2 className={cn(icon, "animate-spin")} />
      ) : playing ? (
        <Pause className={icon} fill="currentColor" />
      ) : (
        <Play className={cn(icon, "ms-0.5")} fill="currentColor" />
      )}
    </button>
  );
}

/** Animated equalizer bars shown on the row that is currently playing. */
export function Equalizer({ active }: { active: boolean }) {
  return (
    <span className="inline-flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-brand"
          style={{
            height: active ? undefined : "35%",
            animation: active ? `eq 0.9s ${i * 0.15}s ease-in-out infinite alternate` : undefined,
          }}
        />
      ))}
      <style>{`@keyframes eq{0%{height:25%}100%{height:100%}}`}</style>
    </span>
  );
}

/** Breadcrumb + soft header card with title, count and actions (search etc.). */
export function PageHeader({
  title,
  muted,
  description,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  muted?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const { t } = useLang();
  const section = sectionFor(usePathname());
  return (
    <div className="mb-5 sm:mb-6">
      <nav aria-label={t("ব্রেডক্রাম্ব", "Breadcrumb")} className="mb-3 flex items-center gap-2 text-sm">
        <Link href="/" className="flex items-center gap-1.5 font-medium text-brand hover:underline">
          <House className="h-4 w-4" />
          {t("হোম", "Home")}
        </Link>
        {section && (
          <>
            <ChevronRight className="h-4 w-4 text-ink-3 rtl:rotate-180" />
            <span className="text-ink-2">{t(section.bn, section.en)}</span>
          </>
        )}
      </nav>
      <div className="flex flex-col gap-4 rounded-2xl bg-panel-2 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-[22px] leading-tight text-ink sm:text-[26px]">{title}</h1>
          {muted && <p className="mt-1 text-[15px] text-brand">{muted}</p>}
          {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-2">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

/** Number in a soft circle, used to lead list rows. */
export function NumberBadge({ n, className }: { n: React.ReactNode; className?: string }) {
  return <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-icon-bg font-num text-sm font-medium text-brand", className)}>{n}</span>;
}

/** Centered section heading, as used between home blocks. */
export function SectionHeading({ title, subtitle, className }: { title: React.ReactNode; subtitle?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 text-center sm:mb-10", className)}>
      <h2 className="font-heading text-[24px] leading-tight text-ink sm:text-[34px]">{title}</h2>
      {subtitle && <p className="mx-auto mt-2 max-w-xl text-[15px] text-ink-2 sm:mt-3">{subtitle}</p>}
    </div>
  );
}

/** Pill button with an arrow, like "View all". */
export function ViewAll({ href, label, className }: { href: string; label: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-8 flex justify-center", className)}>
      <Link href={href} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-brand px-7 text-[15px] font-medium text-white shadow-[0_0_0_4px_var(--brand-soft)] transition hover:bg-brand-strong">
        {label}
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>
  );
}

/** Section title with a "see all" link, used between home blocks. */
export function SectionTitle({ title, subtitle, href, linkLabel }: { title: React.ReactNode; subtitle?: React.ReactNode; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-1">
      <div className="min-w-0">
        <h2 className="font-heading text-[19px] leading-tight text-ink sm:text-[22px]">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-[13px] text-ink-3">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-sm font-medium text-brand hover:bg-brand-soft">
          {linkLabel}
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}

export function StatTile({ label, value, hint, icon: Icon }: { label: React.ReactNode; value: React.ReactNode; hint?: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="panel flex items-center gap-3 p-3.5 sm:gap-4 sm:p-5">
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-icon-bg text-brand sm:h-11 sm:w-11">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs text-ink-3">{label}</p>
        <p className="font-num text-xl font-semibold leading-tight text-ink sm:text-2xl">{value}</p>
        {hint && <p className="truncate text-[11px] text-ink-3">{hint}</p>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-line px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-panel-2 text-ink-3">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint && <p className="max-w-sm text-xs text-ink-3">{hint}</p>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex h-11 w-full items-center gap-2.5 rounded-full border border-line bg-panel px-4 text-[15px] focus-within:border-brand sm:w-72">
      <svg className="h-4 w-4 shrink-0 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3"
        type="search"
      />
    </label>
  );
}

/**
 * Compact, app-style header for the media pages: title + count on one line,
 * small search button in the top line that expands on click, plus actions.
 * Sticks under the site header while scrolling with minimal height.
 */
export function MediaHeader<T extends string>({
  title,
  count,
  query,
  onQuery,
  placeholder,
  actions,
  tabs,
  tab,
  onTab,
  below,
}: {
  title: React.ReactNode;
  count?: React.ReactNode;
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  actions?: React.ReactNode;
  tabs?: { value: T; label: React.ReactNode; count?: React.ReactNode; icon?: LucideIcon }[];
  tab?: T;
  onTab?: (v: T) => void;
  /** Extra row under the switch, e.g. category chips and sort. */
  below?: React.ReactNode;
}) {
  const { t } = useLang();
  const [searchOpen, setSearchOpen] = useState(Boolean(query));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query) setSearchOpen(true);
  }, [query]);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  const closeSearch = () => {
    onQuery("");
    setSearchOpen(false);
  };

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-3 space-y-2 border-b border-line/60 bg-canvas/95 px-4 pt-2 pb-2.5 backdrop-blur-xl sm:top-[72px] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {/* ── Top Row: Title + Count + Search Button / Input + Actions ── */}
      <div className="flex min-h-9 items-center justify-between gap-2 sm:gap-3">
        {/* On Mobile: when search is open, show full-width input across the top line */}
        {searchOpen ? (
          <div className="flex w-full items-center gap-2 sm:hidden animate-in fade-in duration-150">
            <div className="relative flex h-8 flex-1 items-center gap-2 rounded-full border border-brand/60 bg-panel px-3 text-xs shadow-xs ring-2 ring-brand/15">
              <Search className="h-3.5 w-3.5 shrink-0 text-brand" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3 text-xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    onQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label={t("মুছে ফেলুন", "Clear")}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-panel-2 text-ink-3 hover:text-ink"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="shrink-0 rounded-full bg-panel-2 px-3 py-1 text-xs font-semibold text-ink-2 hover:bg-panel-3 hover:text-ink"
            >
              {t("বাতিল", "Cancel")}
            </button>
          </div>
        ) : null}

        {/* Regular Top Bar Content (visible on sm: always; on mobile only when search is not open) */}
        <div className={cn("items-center justify-between gap-3 w-full", searchOpen ? "hidden sm:flex" : "flex")}>
          {/* Left: Title + Count */}
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate font-heading text-lg font-bold text-ink sm:text-xl lg:text-2xl">{title}</h1>
            {count !== undefined && (
              <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 font-num text-[11px] font-semibold text-brand sm:text-xs">
                {count}
              </span>
            )}
          </div>

          {/* Right: Search + Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Expanded Search on Tablet/Desktop (sm:) */}
            {searchOpen ? (
              <div className="hidden sm:flex relative h-8 sm:h-9 w-60 sm:w-72 items-center gap-2 rounded-full border border-brand/60 bg-panel px-3 text-xs sm:text-sm shadow-xs ring-2 ring-brand/15 animate-in fade-in duration-150">
                <Search className="h-3.5 w-3.5 shrink-0 text-brand" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => onQuery(e.target.value)}
                  placeholder={placeholder}
                  className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3 text-xs sm:text-sm"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      onQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label={t("মুছে ফেলুন", "Clear")}
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-panel-2 text-ink-3 hover:text-ink"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label={t("বন্ধ করুন", "Close")}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-panel-2 hover:text-ink"
                  title={t("বন্ধ করুন", "Close")}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              /* Compact Search Button in the top line */
              <button
                type="button"
                onClick={openSearch}
                aria-label={t("অনুসন্ধান করুন", "Search")}
                title={t("অনুসন্ধান করুন", "Search")}
                className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-line bg-panel text-ink-2 shadow-xs transition hover:border-brand/50 hover:text-brand active:scale-95"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}

            {/* Actions (Play All pill, etc.) */}
            {actions}
          </div>
        </div>
      </div>

      {/* Tabs Row (if audio/video tabs exist, e.g. clips & nasheed) */}
      {tabs && tab && onTab && (
        <div role="tablist" className="inline-flex rounded-full border border-line bg-panel-2 p-0.5">
          {tabs.map((o) => {
            const on = o.value === tab;
            const Icon = o.icon;
            return (
              <button
                key={o.value}
                role="tab"
                aria-selected={on}
                onClick={() => onTab(o.value)}
                className={cn(
                  "inline-flex h-7 sm:h-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition",
                  on ? "bg-brand font-semibold text-white shadow-xs" : "text-ink-2 hover:text-ink",
                )}
              >
                {Icon && <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                <span>{o.label}</span>
                {o.count !== undefined && (
                  <span className={cn("rounded-full px-1.5 font-num text-[10px] sm:text-[11px]", on ? "bg-white/20" : "bg-panel text-ink-3")}>{o.count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Row: Filter chips / extra controls */}
      {below}
    </div>
  );
}

/** Prominent pill action button with clear icon and label text. */
export function HeaderIconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-brand px-3 sm:px-3.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-strong active:scale-95"
    >
      {children}
    </button>
  );
}

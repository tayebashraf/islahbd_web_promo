"use client";

import Link from "next/link";
import { ArrowUpRight, Loader2, Pause, Play, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Panel({ className, children, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("panel p-5 sm:p-6", className)} {...rest}>
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
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panel-2 text-ink-2">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      )}
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="truncate text-[15px] font-semibold leading-tight text-ink sm:text-base">{title}</h2>
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
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panel-2 text-ink-2 transition hover:bg-brand hover:text-white",
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
    <div role="tablist" className={cn("inline-flex shrink-0 items-center rounded-full bg-panel-2 p-1", className)}>
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
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium whitespace-nowrap transition",
        active ? "border-brand bg-brand text-white" : "border-line bg-panel text-ink-2 hover:border-brand/40 hover:text-ink",
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("rounded-full px-1.5 font-num text-[11px]", active ? "bg-white/20" : "bg-panel-2 text-ink-3")}>
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
        playing ? "bg-brand text-white shadow-md shadow-brand/30" : "bg-panel-2 text-ink hover:bg-brand hover:text-white",
        dims,
        className,
      )}
    >
      {loading ? (
        <Loader2 className={cn(icon, "animate-spin")} />
      ) : playing ? (
        <Pause className={icon} fill="currentColor" />
      ) : (
        <Play className={cn(icon, "ml-0.5")} fill="currentColor" />
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

export function PageHeader({
  eyebrow,
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
  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>}
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
          {muted && <span className="font-normal text-ink-3"> {muted}</span>}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function StatTile({ label, value, hint, icon: Icon }: { label: React.ReactNode; value: React.ReactNode; hint?: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="panel flex items-center gap-4 p-4 sm:p-5">
      {Icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong dark:text-brand">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs text-ink-3">{label}</p>
        <p className="font-num text-2xl font-semibold leading-tight text-ink">{value}</p>
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
    <label className="flex h-11 w-full items-center gap-2.5 rounded-full border border-line bg-panel px-4 text-sm focus-within:border-brand sm:w-72">
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

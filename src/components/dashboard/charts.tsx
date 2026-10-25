"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Datum {
  label: string;
  value: number;
  /** Tooltip text; defaults to the value. */
  tip?: string;
}

function niceMax(v: number): number {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find((s) => (s * pow * 4) >= v) ?? 10;
  return step * pow * 4;
}

/**
 * Single-series column chart in the reference style: pill columns with a hatch
 * texture, the peak (or hovered) column in solid brand green with a value chip.
 */
export function PillBarChart({
  data,
  height = 240,
  format = (n) => String(n),
  className,
}: {
  data: Datum[];
  height?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(1, ...data.map((d) => d.value)));
  const peak = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const active = hover ?? peak;
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

  return (
    <div className={cn("relative flex gap-3", className)} style={{ height }}>
      {/* y axis */}
      <div className="relative mb-7 w-7 shrink-0">
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute right-0 translate-y-1/2 font-num text-[11px] leading-none text-ink-3"
            style={{ bottom: `${(t / max) * 100}%` }}
          >
            {format(t)}
          </span>
        ))}
      </div>

      <div className="relative flex-1">
        {/* grid */}
        <div className="absolute inset-x-0 top-0 bottom-7">
          {ticks.map((t) => (
            <div
              key={t}
              className={cn("absolute inset-x-0 border-t", t === 0 ? "border-line" : "border-dashed border-line")}
              style={{ bottom: `${(t / max) * 100}%` }}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 top-0 bottom-0 flex items-stretch justify-around gap-2 sm:gap-3">
          {data.map((d, i) => {
            const h = Math.max((d.value / max) * 100, d.value ? 6 : 2);
            const on = i === active;
            return (
              <div
                key={d.label + i}
                className="group relative flex min-w-0 flex-1 flex-col items-center"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${d.label}: ${d.tip ?? format(d.value)}`}
              >
                <div className="relative w-full max-w-[64px] flex-1">
                  <div
                    className={cn(
                      "absolute inset-x-0 bottom-0 rounded-full transition-all duration-500 hatch",
                      on ? "bg-brand-strong dark:bg-brand" : "bg-brand-tint",
                    )}
                    style={{ height: `${h}%` }}
                  >
                    {on && (
                      <>
                        <span className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-panel bg-brand" />
                        <span className="absolute -top-11 left-1/2 -translate-x-1/2 rounded-full bg-brand px-2.5 py-1 font-num text-[11px] font-semibold whitespace-nowrap text-white shadow-md">
                          {d.tip ?? format(d.value)}
                          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-brand" />
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className={cn("mt-2 h-5 w-full truncate text-center text-[11px] font-medium", on ? "text-ink" : "text-ink-3")}>
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Monotone cubic path through points (no overshoot between samples). */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : "";
  const n = pts.length;
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i]);
  }
  const tan: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) tan.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  tan.push(m[n - 2]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + tan[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - tan[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

/** Single-series area chart with a hover crosshair + tooltip. */
export function AreaChart({ data, height = 150, className }: { data: Datum[]; height?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const W = 400;
  const H = 100;

  const { line, area, pts } = useMemo(() => {
    const vals = data.map((d) => d.value);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const span = hi - lo || 1;
    const p: [number, number][] = data.map((d, i) => [
      data.length === 1 ? W / 2 : (i / (data.length - 1)) * W,
      H - 8 - ((d.value - lo) / span) * (H - 24),
    ]);
    const l = smoothPath(p);
    return { line: l, area: p.length ? `${l} L${W},${H} L0,${H} Z` : "", pts: p };
  }, [data]);

  if (!data.length) return <div style={{ height }} />;

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    pts.forEach((p, i) => {
      if (Math.abs(p[0] - x) < Math.abs(pts[best][0] - x)) best = i;
    });
    setHover(best);
  };

  const h = hover !== null ? pts[hover] : null;

  return (
    <div
      ref={ref}
      className={cn("relative touch-none", className)}
      style={{ height }}
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#area-fill)" />
        <path d={line} fill="none" stroke="var(--brand-strong)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {h && <line x1={h[0]} x2={h[0]} y1={0} y2={H} stroke="var(--ink-3)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
      </svg>
      {h && hover !== null && (
        <>
          <span
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-panel bg-brand"
            style={{ left: `${(h[0] / W) * 100}%`, top: `${(h[1] / H) * 100}%` }}
          />
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-xl bg-ink px-2.5 py-1.5 text-[11px] whitespace-nowrap text-canvas shadow-lg"
            style={{
              left: `clamp(48px, ${(h[0] / W) * 100}%, calc(100% - 48px))`,
              top: `${(h[1] / H) * 100}%`,
            }}
          >
            <span className="block font-num font-semibold">{data[hover].tip ?? data[hover].value}</span>
            <span className="block opacity-70">{data[hover].label}</span>
          </span>
        </>
      )}
    </div>
  );
}

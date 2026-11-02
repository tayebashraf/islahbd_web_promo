"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, HeartHandshake, MapPin, Megaphone, X } from "lucide-react";
import { bnNum } from "@/lib/format";

/**
 * Ad mode — a full-screen, self-running loop of the lifetime-member page for a tall display.
 * Hidden switch: tap "বিশেষ এলান ও দাওয়াত" three times quickly. Leave with the same triple
 * tap, the Esc key, or the corner ✕ (it shows when the mouse moves).
 *
 * Always a phone-shaped (9:16) stage: on a portrait screen it fills the screen, on a landscape
 * screen it sits in the middle. Every size inside is in container units (cqw / cqh) of the stage.
 *
 * Loop: invitation + countdown → benefits, three at a time → our fikir & dua → again.
 * Each loop swaps the palette: light, then dark (see the `.ad-theme` tokens in globals.css).
 */

export type AdBenefit = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bn: string;
};
export type AdVenue = { line1: string; line2: string };

type Props = {
  target: Date;
  dateLabel: string;
  venue: AdVenue;
  benefits: AdBenefit[];
  /** Two paragraphs separated by a blank line: the fikir, then the dua (may end with "আমীন।"). */
  fikirDua: string;
  onExit: () => void;
};

// Loop timing (ms)
const HERO_MS = 13000;
const GROUP_SIZE = 3;
const GROUP_BASE_MS = 2400;
const PER_BENEFIT_MS = 2600;
const FIKIR_MS = 15000;

const EASE = [0.22, 1, 0.36, 1] as const;
const TITLE_WORDS = ["আজীবন", "সদস্য", "সম্মেলন"];
const SHINE =
  "linear-gradient(100deg, var(--ad-title-a) 0%, var(--ad-title-a) 36%, var(--ad-title-b) 50%, var(--ad-title-a) 64%, var(--ad-title-a) 100%)";

/** Theme token, optionally faded to `pct`% opacity. */
const v = (name: string, pct?: number) =>
  pct === undefined ? `var(--ad-${name})` : `color-mix(in oklab, var(--ad-${name}) ${pct}%, transparent)`;

/** Calls `onTriple` after three taps within `windowMs` — a hidden switch, like a developer mode. */
export function useTripleTap(onTriple: () => void, windowMs = 900) {
  const taps = useRef<number[]>([]);
  return useCallback(() => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < windowMs), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      onTriple();
    }
  }, [onTriple, windowMs]);
}

// ─────────────────────────────────────────────
// Motion helpers — soft blur-in, never bouncy
// ─────────────────────────────────────────────
function Reveal({
  delay = 0,
  className,
  style,
  children,
}: {
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: "0.6em", filter: "blur(14px)" }}
      animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Words surface one after another out of a blur. */
function BlurWords({ text, delay = 0, step = 0.055 }: { text: string; delay?: number; step?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginInlineEnd: i < words.length - 1 ? "0.27em" : 0 }}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(10px)" }}
          animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
          transition={{ duration: 0.95, ease: EASE, delay: delay + i * step }}
        >
          {w}
        </motion.span>
      ))}
    </>
  );
}

/** Text with a slow light sweep across it. */
function Shine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.span
      className="inline-block bg-clip-text text-transparent"
      style={{ backgroundImage: SHINE, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", padding: "0.08em 0.1em" }}
      initial={{ backgroundPosition: "100% 50%" }}
      animate={{ backgroundPosition: ["100% 50%", "0% 50%"] }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.6, delay }}
    >
      {children}
    </motion.span>
  );
}

/** Every scene leaves the same way: it melts into a blur. */
function SceneShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={`absolute inset-0 flex flex-col items-center px-[7cqw] text-center ${className ?? ""}`}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(18px)" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Countdown (with seconds)
// ─────────────────────────────────────────────
type Left = { d: number; h: number; m: number; s: number };

function splitLeft(ms: number): Left {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

function useLiveCountdown(target: Date): Left {
  const [left, setLeft] = useState<Left>(() => splitLeft(target.getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => {
      const next = splitLeft(target.getTime() - Date.now());
      setLeft((p) => (p.s === next.s && p.m === next.m && p.h === next.h && p.d === next.d ? p : next));
    }, 250);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

const two = (n: number) => bnNum(String(n).padStart(2, "0"));

const RADIUS = "calc(var(--cw) * 0.16)";
const FACE_TOP = "linear-gradient(180deg, var(--ad-flip-1) 0%, var(--ad-flip-2) 100%)";
const FACE_BOTTOM = "linear-gradient(180deg, var(--ad-flip-3) 0%, var(--ad-flip-4) 100%)";

type HalfProps = { text: string; top?: boolean } & React.ComponentProps<typeof motion.div>;

/** One half of a split-flap card; the digit is sized to the whole card and clipped to the half. */
function Half({ text, top, ...motionProps }: HalfProps) {
  return (
    <motion.div
      {...motionProps}
      className="absolute inset-x-0 h-1/2 overflow-hidden"
      style={{
        top: top ? 0 : "50%",
        background: top ? FACE_TOP : FACE_BOTTOM,
        borderRadius: top ? `${RADIUS} ${RADIUS} 0 0` : `0 0 ${RADIUS} ${RADIUS}`,
        transformOrigin: top ? "50% 100%" : "50% 0%",
        backfaceVisibility: "hidden",
      }}
    >
      <span
        className="font-num absolute inset-x-0 flex items-center justify-center leading-none font-bold"
        style={{ height: "200%", top: top ? 0 : "-100%", color: v("flip-ink") }}
      >
        {text}
      </span>
    </motion.div>
  );
}

function CardFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{
          width: "var(--cw)",
          height: "calc(var(--cw) * 1.2)",
          fontSize: "calc(var(--cw) * 0.62)",
          perspective: "calc(var(--cw) * 5)",
          borderRadius: RADIUS,
          boxShadow: `0 1.4cqh 3cqh -1.2cqh ${v("drop")}`,
        }}
      >
        {children}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2" style={{ background: v("hinge") }} />
        <div className="pointer-events-none absolute inset-0" style={{ borderRadius: RADIUS, boxShadow: `inset 0 0 0 1px ${v("accent", 35)}` }} />
      </div>
      <span className="mt-[1.2cqh] font-semibold" style={{ color: v("ink-2"), fontSize: "calc(var(--cw) * 0.2)" }}>
        {label}
      </span>
    </div>
  );
}

/** Split-flap card: on every change a page falls from the top. */
function FlipCard({ value, label }: { value: string; label: string }) {
  const [s, setS] = useState({ cur: value, prev: value, k: 0 });
  if (s.cur !== value) setS({ cur: value, prev: s.cur, k: s.k + 1 });
  const first = s.k === 0;
  return (
    <CardFrame label={label}>
      <Half text={s.cur} top />
      <Half text={s.prev} />
      <Half
        key={`t${s.k}`}
        text={s.prev}
        top
        initial={first ? false : { rotateX: 0 }}
        animate={{ rotateX: -90 }}
        transition={{ duration: 0.32, ease: "easeIn" }}
      />
      <Half
        key={`b${s.k}`}
        text={s.cur}
        initial={first ? false : { rotateX: 90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.36, delay: 0.32, ease: "easeOut" }}
      />
    </CardFrame>
  );
}

/** Seconds card: each new second rises in from the bottom out of a blur. */
function SlideCard({ value, label }: { value: string; label: string }) {
  return (
    <CardFrame label={label}>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: RADIUS,
          background: "linear-gradient(180deg, var(--ad-flip-1) 0%, var(--ad-flip-2) 50%, var(--ad-flip-3) 50%, var(--ad-flip-4) 100%)",
        }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={value}
            className="font-num absolute inset-0 flex items-center justify-center leading-none font-bold"
            style={{ color: v("flip-ink-2") }}
            initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </CardFrame>
  );
}

function Countdown({ target, startAt }: { target: Date; startAt: number }) {
  const { d, h, m, s } = useLiveCountdown(target);
  const units = [
    <FlipCard key="d" value={two(d)} label="দিন" />,
    <FlipCard key="h" value={two(h)} label="ঘণ্টা" />,
    <FlipCard key="m" value={two(m)} label="মিনিট" />,
    <SlideCard key="s" value={two(s)} label="সেকেন্ড" />,
  ];
  return (
    <div
      className="flex items-start justify-center gap-[1.4cqw]"
      dir="ltr"
      style={{ ["--cw" as string]: "min(18cqw, 10cqh)", perspective: "1200px" }}
    >
      {units.map((u, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <motion.span
              className="font-bold"
              style={{ color: v("accent"), fontSize: "calc(var(--cw) * 0.4)", lineHeight: "calc(var(--cw) * 1.2)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.35, 1] }}
              transition={{ duration: 2, delay: startAt + 0.6, repeat: Infinity, repeatType: "reverse" }}
            >
              :
            </motion.span>
          )}
          <motion.div
            style={{ transformOrigin: "50% 0%" }}
            initial={{ rotateX: -90, opacity: 0, filter: "blur(10px)" }}
            animate={{ rotateX: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: EASE, delay: startAt + i * 0.2 }}
          >
            {u}
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Pieces shared by the scenes
// ─────────────────────────────────────────────
function GoldRule({ delay, width = "18cqw" }: { delay: number; width?: string }) {
  return (
    <motion.span
      className="mt-[1.6cqh] block h-[2px] rounded-full"
      style={{ width, background: `linear-gradient(90deg, transparent, ${v("accent")}, transparent)` }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

function SceneHeader({
  icon: Icon,
  kicker,
  title,
  titleSize = "min(9.6cqw, 5.4cqh)",
}: {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  kicker?: string;
  title: string;
  titleSize?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <Reveal delay={0.1}>
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: "min(15cqw, 8.4cqh)",
            height: "min(15cqw, 8.4cqh)",
            color: v("accent-ink"),
            background: v("accent", 14),
            boxShadow: `inset 0 0 0 1.5px ${v("accent", 45)}`,
          }}
        >
          <Icon style={{ width: "48%", height: "48%" }} />
        </span>
      </Reveal>
      {kicker && (
        <Reveal delay={0.35} className="mt-[1.6cqh]" style={{ color: v("ink-2"), fontSize: "min(5cqw, 2.8cqh)" }}>
          {kicker}
        </Reveal>
      )}
      <motion.h2
        className="leading-[1.25] font-bold"
        style={{ fontSize: titleSize, marginTop: kicker ? 0 : "1.6cqh" }}
        initial={{ opacity: 0, y: "0.4em", filter: "blur(16px)", scale: 1.06 }}
        animate={{ opacity: 1, y: "0em", filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 1.3, ease: EASE, delay: 0.55 }}
      >
        <Shine delay={2.2}>{title}</Shine>
      </motion.h2>
      <GoldRule delay={1.1} />
    </div>
  );
}

/** Conference date and live time left — stays at the foot of every scene after the first. */
function DateLine({ target, dateLabel, delay }: { target: Date; dateLabel: string; delay: number }) {
  const { d, h, m, s } = useLiveCountdown(target);
  return (
    <Reveal delay={delay} className="flex flex-col items-center gap-[0.7cqh]">
      <span className="font-semibold" style={{ color: v("ink"), fontSize: "min(4cqw, 2.25cqh)" }}>
        আজীবন সদস্য সম্মেলন · {dateLabel}
      </span>
      <span className="font-num" style={{ color: v("accent-ink"), fontSize: "min(3.9cqw, 2.2cqh)" }}>
        বাকি {two(d)} দিন {two(h)} ঘণ্টা {two(m)} মিনিট {two(s)} সেকেন্ড
      </span>
    </Reveal>
  );
}

// ─────────────────────────────────────────────
// Scene 1 — invitation, title, countdown, venue
// ─────────────────────────────────────────────
function Badge({ onTap }: { onTap: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      className="inline-flex cursor-default items-center gap-[1.6cqw] rounded-full px-[4.4cqw] py-[1.1cqh] font-semibold outline-none select-none"
      style={{
        color: v("accent-ink"),
        background: v("accent", 14),
        boxShadow: `inset 0 0 0 1.5px ${v("accent", 55)}`,
        fontSize: "min(4.4cqw, 2.5cqh)",
      }}
      initial={{ opacity: 0, y: "-0.8em", filter: "blur(12px)", letterSpacing: "0.3em" }}
      animate={{ opacity: 1, y: "0em", filter: "blur(0px)", letterSpacing: "0em" }}
      transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
    >
      <Megaphone style={{ width: "1.15em", height: "1.15em" }} />
      বিশেষ এলান ও দাওয়াত
    </motion.button>
  );
}

function HeroScene({
  target,
  dateLabel,
  venue,
  onBadgeTap,
  onDone,
}: {
  target: Date;
  dateLabel: string;
  venue: AdVenue;
  onBadgeTap: () => void;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, HERO_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <SceneShell className="justify-evenly pt-[5cqh] pb-[6cqh]">
      <div className="flex flex-col items-center">
        <Badge onTap={onBadgeTap} />

        <motion.p
          className="mt-[3cqh]"
          style={{ color: v("ink-2"), fontSize: "min(5.6cqw, 3.1cqh)" }}
          initial={{ opacity: 0, letterSpacing: "0.7em", filter: "blur(10px)" }}
          animate={{ opacity: 1, letterSpacing: "0.06em", filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.8 }}
        >
          চলতি বছর
        </motion.p>

        <h1
          className="leading-[1.2] font-bold"
          style={{ fontSize: "min(13.5cqw, 7.6cqh)", filter: `drop-shadow(0 0.6cqh 2.4cqh ${v("glow")})` }}
        >
          {TITLE_WORDS.map((w, i) => (
            <motion.span
              key={w}
              className="inline-block"
              initial={{ opacity: 0, y: "0.35em", filter: "blur(18px)", scale: 1.1 }}
              animate={{ opacity: 1, y: "0em", filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.4, ease: EASE, delay: 1.25 + i * 0.32 }}
            >
              <Shine delay={3.2 + i * 0.25}>{w}</Shine>
            </motion.span>
          ))}
        </h1>

        <Reveal delay={2.5} className="mt-[1.6cqh]">
          <span
            className="inline-block rounded-[2.4cqw] px-[4.4cqw] py-[1.2cqh] font-semibold text-white"
            style={{
              fontSize: "min(5.6cqw, 3.1cqh)",
              background: "linear-gradient(180deg, #4C8771, #355E4E)",
              boxShadow: `0 1cqh 3cqh -1.2cqh ${v("drop")}, inset 0 0 0 1px ${v("accent", 45)}`,
            }}
          >
            {dateLabel}
          </span>
        </Reveal>
        <Reveal delay={2.9} className="mt-[1.3cqh]" style={{ color: v("accent-ink"), fontSize: "min(4.8cqw, 2.7cqh)" }}>
          অনুষ্ঠিত হবে ইনশাআল্লাহ
        </Reveal>
      </div>

      <Countdown target={target} startAt={3.3} />

      <div className="flex flex-col items-center">
        <Reveal delay={4.6}>
          <MapPin style={{ width: "min(7.5cqw, 4.2cqh)", height: "min(7.5cqw, 4.2cqh)", color: v("accent") }} />
        </Reveal>
        <Reveal delay={4.8} className="mt-[0.6cqh] tracking-wide" style={{ color: v("accent-ink"), fontSize: "min(4.2cqw, 2.3cqh)" }}>
          স্থান
        </Reveal>
        <Reveal delay={5} className="font-bold" style={{ color: v("ink"), fontSize: "min(6cqw, 3.3cqh)" }}>
          {venue.line1}
        </Reveal>
        <Reveal delay={5.3} style={{ color: v("ink-2"), fontSize: "min(4.8cqw, 2.7cqh)" }}>
          {venue.line2}
        </Reveal>
      </div>
    </SceneShell>
  );
}

// ─────────────────────────────────────────────
// Scene 2 — benefits, a few at a time
// ─────────────────────────────────────────────
function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function BenefitRow({ b, delay, divider }: { b: AdBenefit; delay: number; divider: boolean }) {
  // icon tint: lighter on the dark palette, deeper on the light one
  const tone = `color-mix(in oklab, ${b.color}, var(--ad-tone-mix) 32%)`;
  const textSize = b.bn.length > 110 ? "min(4.6cqw, 2.6cqh)" : "min(5.2cqw, 2.9cqh)";
  return (
    <li className="relative flex items-center gap-[5cqw] py-[2.4cqh]">
      {divider && (
        <motion.span
          className="absolute inset-x-[8%] top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${v("accent", 45)}, transparent)` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: Math.max(0, delay - 0.2) }}
        />
      )}
      <motion.span
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: "min(15cqw, 8.4cqh)",
          height: "min(15cqw, 8.4cqh)",
          color: tone,
          background: `color-mix(in oklab, ${b.color} 15%, transparent)`,
          boxShadow: `inset 0 0 0 1.5px color-mix(in oklab, ${b.color} 40%, transparent)`,
        }}
        initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        <b.icon style={{ width: "46%", height: "46%" }} />
      </motion.span>
      <p className="min-w-0 flex-1 text-start leading-[1.55] font-semibold" style={{ color: v("ink"), fontSize: textSize }}>
        <BlurWords text={b.bn} delay={delay + 0.3} step={0.05} />
      </p>
    </li>
  );
}

function GroupProgress({ count, active, ms }: { count: number; active: number; ms: number }) {
  return (
    <div className="flex items-center gap-[1.8cqw]">
      {Array.from({ length: count }, (_, k) => (
        <div
          key={k}
          className="h-[0.55cqh] overflow-hidden rounded-full"
          style={{ width: k === active ? "12cqw" : "3cqw", background: v("ink", 14), transition: "width .7s cubic-bezier(.22,1,.36,1)" }}
        >
          {k < active && <div className="h-full w-full" style={{ background: v("accent") }} />}
          {k === active && (
            <motion.div
              key={active}
              className="h-full"
              style={{ background: v("accent") }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: ms / 1000, ease: "linear" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function BenefitsScene({
  benefits,
  target,
  dateLabel,
  onDone,
}: {
  benefits: AdBenefit[];
  target: Date;
  dateLabel: string;
  onDone: () => void;
}) {
  const groups = useMemo(() => chunk(benefits, GROUP_SIZE), [benefits]);
  const [g, setG] = useState(0);
  const group = groups[g];
  const ms = GROUP_BASE_MS + group.length * PER_BENEFIT_MS;
  const firstIndex = groups.slice(0, g).reduce((n, x) => n + x.length, 0);

  useEffect(() => {
    const id = setTimeout(() => (g + 1 < groups.length ? setG(g + 1) : onDone()), ms);
    return () => clearTimeout(id);
  }, [g, groups.length, ms, onDone]);

  return (
    <SceneShell className="justify-between pt-[6cqh] pb-[5cqh]">
      <SceneHeader icon={Crown} kicker="আজীবন সদস্য হওয়ার" title="ফায়দা ও উপকারিতা" />

      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center py-[2cqh]">
        <AnimatePresence mode="wait">
          <motion.ul
            key={g}
            className="flex w-full flex-col"
            exit={{ opacity: 0, y: "-0.6em", filter: "blur(16px)" }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ fontSize: "min(5cqw, 2.8cqh)" }}
          >
            {group.map((b, k) => (
              <BenefitRow key={firstIndex + k} b={b} delay={(g === 0 ? 1.2 : 0.2) + k * 0.75} divider={k > 0} />
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-[2.6cqh]">
        <GroupProgress count={groups.length} active={g} ms={ms} />
        <DateLine target={target} dateLabel={dateLabel} delay={1.4} />
      </div>
    </SceneShell>
  );
}

// ─────────────────────────────────────────────
// Scene 3 — our fikir & dua
// ─────────────────────────────────────────────
function Ornament({ delay }: { delay: number }) {
  return (
    <div className="flex items-center gap-[2.4cqw]">
      <motion.span
        className="block h-px origin-right"
        style={{ width: "14cqw", background: `linear-gradient(90deg, transparent, ${v("accent", 70)})` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay }}
      />
      <motion.span
        className="block rotate-45"
        style={{ width: "1.5cqw", height: "1.5cqw", background: v("accent") }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: delay + 0.2 }}
      />
      <motion.span
        className="block h-px origin-left"
        style={{ width: "14cqw", background: `linear-gradient(90deg, ${v("accent", 70)}, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay }}
      />
    </div>
  );
}

function FikirScene({
  text,
  target,
  dateLabel,
  onDone,
}: {
  text: string;
  target: Date;
  dateLabel: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, FIKIR_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  const [fikir = "", duaFull = ""] = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const aminMatch = duaFull.match(/^([\s\S]*?)\s+(আমীন[।!]?)$/);
  const dua = aminMatch ? aminMatch[1] : duaFull;
  const amin = aminMatch ? aminMatch[2] : null;

  const STEP = 0.055;
  const count = (s: string) => s.split(/\s+/).filter(Boolean).length;
  const fikirAt = 1.5;
  const duaAt = fikirAt + count(fikir) * STEP + 1;
  const aminAt = duaAt + count(dua) * STEP + 0.7;
  const para: React.CSSProperties = { color: v("ink"), fontSize: "min(5.2cqw, 2.9cqh)" };

  return (
    <SceneShell className="justify-between pt-[6cqh] pb-[5cqh]">
      <SceneHeader icon={HeartHandshake} title="আমাদের ফিকির ও দোয়া" titleSize="min(8.2cqw, 4.6cqh)" />

      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-[3cqh] py-[2cqh]">
        <p className="leading-[1.7] font-semibold" style={para}>
          <BlurWords text={fikir} delay={fikirAt} step={STEP} />
        </p>
        <Ornament delay={duaAt - 0.5} />
        <p className="leading-[1.7] font-semibold" style={para}>
          <BlurWords text={dua} delay={duaAt} step={STEP} />
        </p>
        {amin && (
          <motion.p
            className="font-bold"
            style={{ fontSize: "min(12cqw, 6.6cqh)" }}
            initial={{ opacity: 0, scale: 0.86, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: EASE, delay: aminAt }}
          >
            <Shine delay={aminAt + 1.2}>{amin}</Shine>
          </motion.p>
        )}
      </div>

      <DateLine target={target} dateLabel={dateLabel} delay={1.4} />
    </SceneShell>
  );
}

// ─────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────
type SceneName = "hero" | "benefits" | "fikir";

export function LifetimeAdMode({ target, dateLabel, venue, benefits, fikirDua, onExit }: Props) {
  const [scene, setScene] = useState<{ name: SceneName; cycle: number }>({ name: "hero", cycle: 0 });
  const toBenefits = useCallback(() => setScene((s) => ({ name: "benefits", cycle: s.cycle })), []);
  const toFikir = useCallback(() => setScene((s) => ({ name: "fikir", cycle: s.cycle })), []);
  const toHero = useCallback(() => setScene((s) => ({ name: "hero", cycle: s.cycle + 1 })), []);
  const onBadgeTap = useTripleTap(onExit);
  const light = scene.cycle % 2 === 0; // light first, then dark, and so on

  // Hide the cursor while idle; the corner ✕ shows only after the mouse moves.
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wake = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 2500);
  }, []);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setIdle(true), 2500);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Keep the display awake while the ad runs.
    let lock: WakeLockSentinel | null = null;
    let alive = true;
    const requestLock = () => {
      navigator.wakeLock
        ?.request("screen")
        .then((l) => {
          if (alive) lock = l;
          else l.release().catch(() => {});
        })
        .catch(() => {});
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") requestLock();
    };
    requestLock();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      alive = false;
      clearTimeout(idleTimer.current);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisible);
      document.body.style.overflow = prevOverflow;
      lock?.release().catch(() => {});
    };
  }, [onExit]);

  return createPortal(
    <motion.div
      className={`ad-theme ${light ? "ad-theme-light" : "ad-theme-dark"} fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-kalpurush select-none ${idle ? "cursor-none" : ""}`}
      style={{ background: v("outer"), color: v("ink") }}
      role="dialog"
      aria-modal="true"
      aria-label="আজীবন সদস্য সম্মেলন — অ্যাড মোড"
      onMouseMove={wake}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* phone-shaped stage: full screen on a tall display, centred on a wide one */}
      <div
        className="relative h-full overflow-hidden"
        style={{
          width: "min(100vw, calc(100vh * 9 / 16))",
          containerType: "size",
          background: "radial-gradient(130% 75% at 50% 0%, var(--ad-bg-a) 0%, var(--ad-bg-b) 50%, var(--ad-bg-c) 100%)",
          boxShadow: `0 0 8vh ${v("drop")}`,
        }}
      >
        <AnimatePresence mode="wait">
          {scene.name === "hero" && (
            <HeroScene
              key={`hero-${scene.cycle}`}
              target={target}
              dateLabel={dateLabel}
              venue={venue}
              onBadgeTap={onBadgeTap}
              onDone={toBenefits}
            />
          )}
          {scene.name === "benefits" && (
            <BenefitsScene key={`benefits-${scene.cycle}`} benefits={benefits} target={target} dateLabel={dateLabel} onDone={toFikir} />
          )}
          {scene.name === "fikir" && (
            <FikirScene key={`fikir-${scene.cycle}`} text={fikirDua} target={target} dateLabel={dateLabel} onDone={toHero} />
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onExit}
        aria-label="অ্যাড মোড বন্ধ করুন"
        className={`absolute top-[2vmin] right-[2vmin] z-40 flex items-center justify-center rounded-full p-[1.4vmin] transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 ${idle ? "opacity-0" : "opacity-60"}`}
        style={{ background: v("ink", 12), color: v("ink") }}
      >
        <X style={{ width: "3.6vmin", height: "3.6vmin" }} />
      </button>
    </motion.div>,
    document.body
  );
}

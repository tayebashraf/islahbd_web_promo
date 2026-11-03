"use client";

import "@fontsource/poppins/800.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CircleAlert,
  CircleCheckBig,
  ContactRound,
  History,
  IdCard,
  Keyboard,
  Loader2,
  MapPin,
  Crown,
  PartyPopper,
  Radio,
  RotateCcw,
  Wallet,
  X,
} from "lucide-react";
import { bnNum } from "@/lib/format";
import {
  isDueStatus,
  isFullyPaid,
  isSettledStatus,
  normalizePunchCode,
  type PunchLookupResult,
  type PunchMember,
  type PunchYear,
} from "@/lib/lifetime-punch";

/**
 * Punch kiosk — a hidden full-screen desk mode of the lifetime-member page.
 * Switch: tap the member-portal card four times. Leave with ✕ or Esc.
 *
 * A USB card reader types the card number and Enter, like a keyboard; the kiosk listens on the
 * whole window, so nothing needs focus. The number can also be typed by hand.
 *
 * Punch → a white stage opens at once with a big "WELCOME" that blurs in, while the member's
 * record is fetched behind it. The word then rises to the top and the record settles in below —
 * so there is no separate loading screen. Every year paid: rose petals and the conference
 * invitation; dues: a clean yearly statement to tick and pay. The running year is always lit.
 */

type Reason = "invalid" | "not_found" | "unavailable" | "rate_limited";
type Result = { kind: "member"; member: PunchMember } | { kind: "choose"; members: PunchMember[] } | { kind: "error"; reason: Reason };
type View =
  | { kind: "idle" }
  | { kind: "session"; id: number; code: string; result: Result | null }
  | { kind: "error"; reason: Reason; code: string };
type Server = "checking" | "ready" | "down";

type Props = {
  /** true while the payment sheet (or a receipt) is open over the kiosk — punches and timers wait */
  paused: boolean;
  dateLabel: string;
  venue: { line1: string; line2: string };
  onPay: (member: PunchMember, years: number[], amount: number) => void;
  /** a card was punched while the payment sheet was open: close it, the new punch comes first */
  onInterrupt: () => void;
  onExit: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;
// a reader types a whole number in well under a second; a pause this long starts a new number
const KEY_GAP_MS = 1500;
// from the punch: the waiting screen fades, WELCOME blurs in and holds, then rises (the record is fetched meanwhile)
const INTRO_MS = 2500;
const ERROR_RESET_MS = 9000;
const WELCOME_RESET_MS = 75_000;
const LEDGER_RESET_MS = 180_000;
const REQUEST_TIMEOUT_MS = 25_000;

const BRAND = "#417360";
const taka = (n: number) => `৳${bnNum(Math.round(n).toLocaleString("en-IN"))}`;
const remaining = (y: PunchYear, pledge: number) => Math.max(0, (y.expected || pledge) - y.paid);

function dhakaYear(): number {
  return Number(new Intl.DateTimeFormat("en", { timeZone: "Asia/Dhaka", year: "numeric" }).format(new Date()));
}

function maskCode(code: string): string {
  return code.length > 3 ? `${"•".repeat(Math.min(4, code.length - 3))}${code.slice(-3)}` : code;
}

function dueYearsOf(m: PunchMember): Set<number> {
  return new Set(m.years.filter((y) => isDueStatus(y.status)).map((y) => y.year));
}

// Small deterministic random, so the confetti behind WELCOME has the same shape on every punch.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONFETTI = ["#EC4899", "#F43F5E", "#F59E0B", "#FACC15", "#3B82F6", "#06B6D4", "#10B981", "#8B5CF6", "#F97316"];

// ─────────────────────────────────────────────
// Rose petals — blown in from every side, then a slow, fluttering petal rain
// ─────────────────────────────────────────────
const PETALS: [string, string][] = [
  ["#FFE4EC", "#E11D48"], // rose
  ["#FFD6E7", "#DB2777"], // deep pink
  ["#FFF1F3", "#FB7185"], // blush
  ["#FFE9D9", "#F97316"], // peach
  ["#FFF6D8", "#F59E0B"], // marigold
  ["#F1ECFF", "#8B5CF6"], // lavender
  ["#FFE4E6", "#9F1239"], // crimson
];

function petalSprite(light: string, dark: string): HTMLCanvasElement {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const g = c.getContext("2d");
  if (!g) return c;
  const r = S * 0.38;
  g.translate(S / 2, S / 2);
  g.shadowColor = "rgba(110, 20, 45, 0.22)";
  g.shadowBlur = S * 0.07;
  g.shadowOffsetY = S * 0.03;
  // a rose petal: pointed base, wide rounded top with a soft notch
  g.beginPath();
  g.moveTo(0, r);
  g.bezierCurveTo(-r * 1.15, r * 0.35, -r * 0.95, -r * 0.95, -r * 0.2, -r * 0.92);
  g.quadraticCurveTo(0, -r * 0.72, r * 0.2, -r * 0.92);
  g.bezierCurveTo(r * 0.95, -r * 0.95, r * 1.15, r * 0.35, 0, r);
  g.closePath();
  const grad = g.createRadialGradient(0, r * 0.7, r * 0.05, 0, -r * 0.2, r * 1.25);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g.fillStyle = grad;
  g.fill();
  g.shadowColor = "transparent";
  g.strokeStyle = "rgba(255,255,255,0.45)";
  g.lineWidth = 1.2;
  g.beginPath();
  g.moveTo(0, r * 0.85);
  g.quadraticCurveTo(r * 0.08, 0, 0, -r * 0.6);
  g.stroke();
  return c;
}

const RAIN_MS = 6000;

/**
 * `originX/originY` (0–1 of the screen): most petals splash out of that point in every direction,
 * the rest blow in from the four sides. `delayMs`: wait before the first petal.
 */
function PetalShower({ delayMs = 0, originX, originY }: { delayMs?: number; originX?: number; originY?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sprites = PETALS.map(([a, b]) => petalSprite(a, b));
    let w = 0;
    let h = 0;
    let scale = 1;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.max(0.75, Math.min(1.35, Math.min(w, h) / 760));
    };
    resize();
    window.addEventListener("resize", resize);

    // kind: 0 petal · 1 confetti ribbon · 2 gold sparkle
    type P = {
      kind: 0 | 1 | 2;
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      vr: number;
      flip: number;
      vflip: number;
      sway: number;
      vsway: number;
      size: number;
      age: number;
      life: number;
      sprite: number;
      color: string;
    };
    const ps: P[] = [];
    const MAX = 320;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const add = (x: number, y: number, vx: number, vy: number) => {
      if (ps.length >= MAX) return;
      const roll = Math.random();
      const kind: P["kind"] = roll < 0.74 ? 0 : roll < 0.93 ? 1 : 2;
      ps.push({
        kind,
        x,
        y,
        vx,
        vy,
        rot: rnd(0, Math.PI * 2),
        vr: rnd(-0.045, 0.045),
        flip: rnd(0, Math.PI * 2),
        vflip: rnd(0.03, 0.09),
        sway: rnd(0, Math.PI * 2),
        vsway: rnd(0.015, 0.035),
        size: (kind === 0 ? rnd(15, 27) : kind === 1 ? rnd(12, 18) : rnd(10, 15)) * scale,
        age: 0,
        life: rnd(300, 470),
        sprite: Math.floor(Math.random() * sprites.length),
        color: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
      });
    };
    // a splash out of the origin, plus four streams: left and right blown in and up, bottom thrown up, top falling
    const burst = (n: number) => {
      for (let i = 0; i < n; i++) {
        if (originX !== undefined && originY !== undefined && Math.random() < 0.6) {
          const a = Math.random() * Math.PI * 2;
          const speed = rnd(5, 15) * scale;
          add(
            (originX + rnd(-0.08, 0.08)) * w,
            (originY + rnd(-0.06, 0.06)) * h,
            Math.cos(a) * speed,
            Math.sin(a) * speed - rnd(1, 3.5) * scale
          );
          continue;
        }
        const side = Math.floor(Math.random() * 4);
        if (side === 0) add(-20, rnd(0.3, 0.95) * h, rnd(0.006, 0.013) * w, rnd(-5, -1.5) * scale);
        else if (side === 1) add(w + 20, rnd(0.3, 0.95) * h, -rnd(0.006, 0.013) * w, rnd(-5, -1.5) * scale);
        else if (side === 2) add(rnd(0.05, 0.95) * w, h + 20, rnd(-2.5, 2.5) * scale, -rnd(10, 15) * scale);
        else add(rnd(0, w), -20, rnd(-1.5, 1.5) * scale, rnd(1, 3) * scale);
      }
    };

    const drawSparkle = (r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rr = i % 2 === 0 ? r : r * 0.32;
        const a = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    };

    const start = performance.now() + delayMs;
    let last = performance.now();
    let raf = 0;
    let rainAcc = 0;
    let burstAcc = 0;
    const tick = (now: number) => {
      const t = now - start;
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      if (t < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (t < 750) {
        burstAcc += 7 * dt;
        burst(Math.floor(burstAcc));
        burstAcc %= 1;
      }
      if (t > 450 && t < RAIN_MS) {
        rainAcc += 0.24 * dt;
        while (rainAcc >= 1) {
          add(rnd(-0.05, 1.05) * w, -30, rnd(-0.6, 0.6) * scale, rnd(0.4, 1.2) * scale);
          rainAcc--;
        }
      }

      ctx.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.age += dt;
        p.vx *= Math.pow(0.98, dt);
        if (p.vy < 0) p.vy *= Math.pow(0.972, dt); // thrown up: slows quickly, then floats down
        // petals drift down slowly, ribbons a little faster
        p.vy = Math.min(p.vy + (p.kind === 1 ? 0.06 : 0.045) * scale * dt, (p.kind === 0 ? 1.45 : 2.1) * scale);
        p.sway += p.vsway * dt;
        p.x += (p.vx + Math.sin(p.sway) * 0.9 * scale) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.flip += p.vflip * dt;
        const fade = Math.min(1, (p.life - p.age) / 90);
        if (fade <= 0 || p.y > h + 60 || p.x < -120 || p.x > w + 120) {
          ps.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const turn = Math.cos(p.flip); // the petal turning over as it falls
        if (p.kind === 0) {
          ctx.scale((turn >= 0 ? 1 : -1) * Math.max(0.18, Math.abs(turn)), 1);
          ctx.drawImage(sprites[p.sprite], -p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.kind === 1) {
          ctx.scale(1, Math.max(0.15, Math.abs(turn)));
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size * 0.34, -p.size * 0.13, p.size * 0.68, p.size * 0.26);
        } else {
          ctx.fillStyle = "#F5B83D";
          drawSparkle(p.size * 0.42);
        }
        ctx.restore();
      }
      if (t < RAIN_MS || ps.length > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [delayMs, originX, originY]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-30 h-full w-full" />;
}

// ─────────────────────────────────────────────
// WELCOME — white paper letters over a cloud of confetti
// ─────────────────────────────────────────────
const WORD = "WELCOME".split("");
const LETTER_SHADOW =
  "0 1px 0 #efefef, 0 2px 0 #e4e4e4, 0 3px 0 #d9d9d9, 0 4px 0 #d0d0d0, 0 16px 34px rgba(15,23,42,0.28), 0 6px 12px rgba(15,23,42,0.14)";
// the confetti box is about this many em wide (the word is ~4.5em)
const CLOUD_EM = 5.3;

const CLOUD = (() => {
  const r = seeded(11);
  return Array.from({ length: 190 }, () => {
    // thick behind the letters, thinning out to the edges — like confetti thrown at the word
    const gx = (r() + r() + r() + r()) / 4;
    const gy = (r() + r() + r()) / 3;
    const big = r() < 0.55;
    const left = gx * 100;
    const top = gy * 100;
    return {
      left,
      top,
      w: big ? 0.09 + r() * 0.08 : 0.05 + r() * 0.05,
      h: big ? 0.045 + r() * 0.035 : 0.03 + r() * 0.02,
      rot: r() * 360,
      color: CONFETTI[Math.floor(r() * CONFETTI.length)],
      delay: 0.05 + r() * 0.55,
      curl: r() < 0.4,
      // starts near the middle and flies out to its place
      fromX: ((50 - left) / 100) * CLOUD_EM * 0.85,
      fromY: ((50 - top) / 100) * 1.8 * 0.85,
    };
  });
})();

/**
 * intro: each letter blurs in · shown: already there (the doors' copies) ·
 * drift: the letters slowly move apart and away, blur and fade (the stage rises meanwhile).
 */
// how long WELCOME takes to rise, part and fade away
const DRIFT_S = 2.8;

function Letters({ mode = "intro" }: { mode?: "intro" | "shown" | "drift" }) {
  const mid = (WORD.length - 1) / 2;
  return (
    <h2 aria-label="Welcome" className="relative flex leading-none tracking-[-0.02em]" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}>
      {WORD.map((ch, i) => {
        const off = i - mid;
        const driftDelay = Math.abs(off) * 0.06;
        return (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block"
            style={{ color: "#ffffff", textShadow: LETTER_SHADOW }}
            initial={mode === "intro" ? { opacity: 0, y: "0.32em", scale: 1.16, filter: "blur(22px)" } : false}
            animate={
              mode === "drift"
                ? {
                    opacity: [1, 1, 0.6, 0],
                    x: `${off * 0.3}em`,
                    y: `${-0.1 - Math.abs(off) * 0.035}em`,
                    scale: 1.05,
                    filter: ["blur(0px)", "blur(0.5px)", "blur(4px)", "blur(10px)"],
                  }
                : { opacity: 1, x: "0em", y: "0em", scale: 1, filter: "blur(0px)" }
            }
            transition={
              mode === "drift"
                ? {
                    duration: DRIFT_S,
                    delay: driftDelay,
                    ease: [0.45, 0, 0.25, 1],
                    opacity: { duration: DRIFT_S, delay: driftDelay, times: [0, 0.35, 0.72, 1], ease: "easeInOut" },
                    filter: { duration: DRIFT_S, delay: driftDelay, times: [0, 0.35, 0.72, 1], ease: "easeInOut" },
                  }
                : { duration: 1.05, delay: 0.12 + i * 0.075, ease: EASE }
            }
          >
            {ch}
          </motion.span>
        );
      })}
    </h2>
  );
}

/** The confetti behind WELCOME; when the welcome moves on it hands over to <ConfettiScatter> and falls away. */
function ConfettiCloud({ cloudRef, gone }: { cloudRef: React.RefObject<HTMLDivElement | null>; gone: boolean }) {
  return (
    <motion.div
      ref={cloudRef}
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: "-9%", right: "-9%", top: "-38%", bottom: "-22%" }}
      initial={false}
      animate={{ opacity: gone ? 0 : 1 }}
      transition={{ duration: 0.12 }}
    >
      {CLOUD.map((c, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            width: `${c.w}em`,
            height: `${c.h}em`,
            background: `linear-gradient(135deg, ${c.color} 0%, ${c.color} 55%, color-mix(in oklab, ${c.color} 70%, #000) 100%)`,
            borderRadius: c.curl ? "0.04em 0.04em 0.09em 0.09em" : "1px",
          }}
          initial={{ opacity: 0, scale: 0.3, x: `${c.fromX}em`, y: `${c.fromY}em`, rotate: c.rot - 160 }}
          animate={{ opacity: 1, scale: 1, x: "0em", y: "0em", rotate: c.rot }}
          transition={{ duration: 1.1, delay: c.delay, ease: EASE }}
        />
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// The entrance — for a member whose running year is paid: WELCOME is printed across two white
// doors; they gain a gold frame, swing open in 3D, and the lit conference hall shows behind.
// ─────────────────────────────────────────────
const GOLD = "#C08A2E";
const GOLD_LATTICE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg fill='none' stroke='%23C08A2E' stroke-width='0.8'%3E%3Cpath d='M28 6l6.4 15.6L50 28l-15.6 6.4L28 50l-6.4-15.6L6 28l15.6-6.4z'/%3E%3Crect x='16' y='16' width='24' height='24' transform='rotate(45 28 28)'/%3E%3C/g%3E%3C/svg%3E")`;
const DOOR_EASE = [0.65, 0, 0.35, 1] as const;
const FRAME_S = 0.6; // the doors take shape around the word
const OPEN_S = 1.8; // then swing open
const HALL_TEXT_S = FRAME_S + OPEN_S * 0.5;
// the whole entrance, from the word turning into doors until we walk in (a tap skips it)
const ENTRANCE_MS = 6500;

function Door({ side, W, H, framed, open }: { side: "left" | "right"; W: number; H: number; framed: boolean; open: boolean }) {
  const left = side === "left";
  const arch = `${W / 2}px ${H * 0.32}px`;
  const radius = left ? { borderTopLeftRadius: arch } : { borderTopRightRadius: arch };
  const swing = { duration: OPEN_S, delay: open ? FRAME_S : 0, ease: DOOR_EASE };
  return (
    <motion.div
      className={`absolute inset-y-0 ${left ? "left-0" : "right-0"} w-1/2 overflow-hidden`}
      style={{ ...radius, transformOrigin: left ? "left center" : "right center" }}
      initial={false}
      // the doors swing inward, into the hall
      animate={{ rotateY: open ? (left ? 84 : -84) : 0 }}
      transition={swing}
    >
      {/* the white door itself — invisible while it is only a welcome */}
      <motion.div
        className="absolute inset-0"
        style={{ ...radius, background: "linear-gradient(180deg, #FFFFFF 0%, #FAF6EC 100%)", boxShadow: `inset 0 0 0 2px ${GOLD}8C, 0 20px 50px -20px rgba(90,60,10,0.35)` }}
        initial={false}
        animate={{ opacity: framed ? 1 : 0 }}
        transition={{ duration: FRAME_S, ease: EASE }}
      >
        <div className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: GOLD_LATTICE, backgroundSize: "56px 56px" }} />
        <div
          className="absolute"
          style={{
            inset: 14,
            border: `1px solid ${GOLD}5C`,
            ...(left ? { borderTopLeftRadius: `${W / 2 - 14}px ${H * 0.32 - 14}px` } : { borderTopRightRadius: `${W / 2 - 14}px ${H * 0.32 - 14}px` }),
          }}
        />
        <span
          className="absolute top-1/2 h-20 w-1.5 -translate-y-1/2 rounded-full"
          style={{ [left ? "right" : "left"]: 18, background: "linear-gradient(180deg, #F6E7B4, #C08A2E)", boxShadow: "0 2px 6px rgba(120,80,10,0.35)" }}
        />
      </motion.div>
      {/* this door carries its half of the word; it fades as the door swings away */}
      {framed && (
      <motion.div
        className="absolute inset-y-0 flex items-center justify-center"
        style={{ width: W, left: left ? 0 : -W / 2 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: OPEN_S * 0.45, delay: open ? FRAME_S + 0.15 : 0, ease: EASE }}
      >
        <Letters mode="shown" />
      </motion.div>
      )}
      {/* turning away from the light */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ ...radius, background: `linear-gradient(${left ? 90 : 270}deg, rgba(70,45,10,0.04), rgba(70,45,10,0.42))` }}
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={swing}
      />
    </motion.div>
  );
}

function Hall({ W, H, name, year, dateLabel, venue }: { W: number; H: number; name: string; year: number; dateLabel: string; venue: Props["venue"] }) {
  const deep = (d: number) => ({
    initial: { opacity: 0, y: 26, scale: 0.86, rotateX: 24, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" },
    transition: { duration: 1.05, delay: d, ease: EASE },
  });
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{
        borderRadius: `${W / 2}px ${W / 2}px 0 0 / ${H * 0.32}px ${H * 0.32}px 0 0`,
        background: "radial-gradient(ellipse 70% 62% at 50% 56%, #FFFDF7 0%, #FDF4DB 42%, #F5E2B2 78%, #EACB87 100%)",
        boxShadow: `inset 0 0 0 2px ${GOLD}66, inset 0 -40px 80px -30px rgba(180,130,40,0.35)`,
        perspective: 900,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: FRAME_S * 0.8 }}
    >
      {/* light from the far end of the hall */}
      <motion.div
        aria-hidden
        className="absolute top-[58%] left-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.6) 0deg 4deg, rgba(255,255,255,0) 4deg 15deg)",
          maskImage: "radial-gradient(circle, #000 0%, transparent 55%)",
          WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 55%)",
        }}
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: 22, opacity: 1 }}
        transition={{ rotate: { duration: 14, ease: "linear" }, opacity: { duration: 1.2, delay: FRAME_S + 0.4 } }}
      />
      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center" style={{ paddingTop: H * 0.14 }}>
        <motion.span
          className="flex h-16 w-16 items-center justify-center rounded-full shadow-[0_10px_30px_-8px_rgba(150,100,20,0.6)] sm:h-20 sm:w-20"
          style={{ background: "radial-gradient(circle at 35% 30%, #FFF6D6, #E8C96C 45%, #B8862B 100%)" }}
          initial={{ opacity: 0, scale: 0.4, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: HALL_TEXT_S, ease: EASE }}
        >
          <Crown className="h-8 w-8 text-[#5B3F0C] sm:h-10 sm:w-10" />
        </motion.span>
        <motion.p {...deep(HALL_TEXT_S + 0.25)} className="mt-4 text-[13px] font-semibold tracking-wide text-[#9A6B1F] sm:text-[15px]">
          আজীবন সদস্য সম্মেলন {bnNum(year)}
        </motion.p>
        <motion.h2 {...deep(HALL_TEXT_S + 0.4)} className="mt-1 font-heading text-[clamp(26px,6.6vw,58px)] leading-[1.2] font-bold text-[#24493B]">
          আপনি সম্মেলন কেন্দ্রে
          <br />
          প্রবেশ করুন
        </motion.h2>
        <motion.p {...deep(HALL_TEXT_S + 0.65)} className="mt-3 text-[15px] text-[#5B4A2A] sm:text-[18px]">
          {name ? `${name} — ` : ""}আপনাকে আন্তরিক স্বাগতম
        </motion.p>
        <motion.p
          {...deep(HALL_TEXT_S + 0.85)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 sm:text-[14.5px]"
        >
          <CircleCheckBig className="h-4 w-4" /> চলতি বছর {bnNum(year)}-এর অনুদান পরিশোধিত
        </motion.p>
        <motion.p {...deep(HALL_TEXT_S + 1.0)} className="mt-2.5 text-[12.5px] text-[#7A6440] sm:text-[14px]">
          {dateLabel} · {venue.line1}
        </motion.p>
      </div>
    </motion.div>
  );
}

/**
 * WELCOME on the white stage. Waiting for the record it just stays; then either it fades away
 * (`leaving`), or it becomes the entrance doors (`entering`) and finally we walk in (`zoom`).
 */
function WelcomeStage({
  W,
  H,
  cloudRef,
  moved,
  leaving,
  entering,
  zoom,
  member,
  year,
  dateLabel,
  venue,
  onSkip,
}: {
  W: number;
  H: number;
  cloudRef: React.RefObject<HTMLDivElement | null>;
  moved: boolean;
  leaving: boolean;
  entering: boolean;
  zoom: boolean;
  member: PunchMember | null;
  year: number;
  dateLabel: string;
  venue: Props["venue"];
  onSkip: () => void;
}) {
  const fontSize = Math.min(176, W / 4.9);
  return (
    <motion.div
      className="relative"
      style={{ width: W, height: H }}
      initial={false}
      animate={
        leaving
          ? { opacity: 1, y: -H * 0.3, scale: 1, filter: "blur(0px)" }
          : zoom
            ? { opacity: 0, y: 0, scale: 2.4, filter: "blur(4px)" }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      transition={
        leaving
          ? { duration: DRIFT_S, ease: [0.45, 0, 0.25, 1] }
          : { duration: 1, ease: [0.7, 0, 0.84, 0] }
      }
      onClick={entering ? onSkip : undefined}
    >
      <div className="absolute inset-0" style={{ perspective: 1600, fontSize }}>
        {(entering || zoom) && <Hall W={W} H={H} name={member?.name ?? ""} year={year} dateLabel={dateLabel} venue={venue} />}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: "4.75em", height: "1.05em" }}>
            <ConfettiCloud cloudRef={cloudRef} gone={moved} />
          </div>
        </div>
        {/* the word on its own; once the entrance starts, the two doors carry it */}
        {!(entering || zoom) && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Letters mode={leaving ? "drift" : "intro"} />
          </div>
        )}
        <Door side="left" W={W} H={H} framed={entering || zoom} open={entering || zoom} />
        <Door side="right" W={W} H={H} framed={entering || zoom} open={entering || zoom} />
      </div>
    </motion.div>
  );
}

/**
 * The confetti behind WELCOME, taken over piece by piece the moment the word rises: every piece
 * pops outward from the word, then tumbles down with gravity and fades.
 */
function ConfettiScatter({ source }: { source: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const cloud = source.current;
    if (!canvas || !ctx || !cloud) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const box = canvas.getBoundingClientRect();
    const w = box.width;
    const h = box.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // where each piece is on screen right now (the word may already be scaled by its parent)
    const area = cloud.getBoundingClientRect();
    const em = parseFloat(getComputedStyle(cloud).fontSize) || 100;
    const k = area.width / (cloud.offsetWidth || area.width || 1);
    const cx = area.left + area.width / 2 - box.left;
    const cy = area.top + area.height / 2 - box.top;
    const reach = Math.max(0.8, Math.min(1.6, w / 900));
    const bits = (Array.from(cloud.children) as HTMLElement[]).map((el, i) => {
      const c = CLOUD[i];
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2 - box.left;
      const y = r.top + r.height / 2 - box.top;
      const d = Math.hypot(x - cx, y - cy) || 1;
      const speed = (3 + Math.random() * 7) * reach;
      return {
        x,
        y,
        vx: ((x - cx) / d) * speed + (Math.random() - 0.5) * 2,
        vy: ((y - cy) / d) * speed * 0.6 - (2.5 + Math.random() * 4.5),
        w: c.w * em * k,
        h: c.h * em * k,
        rot: (c.rot * Math.PI) / 180,
        vr: (Math.random() - 0.5) * 0.28,
        flip: Math.random() * Math.PI * 2,
        vflip: 0.08 + Math.random() * 0.14,
        color: c.color,
        age: 0,
        life: 150 + Math.random() * 130,
      };
    });

    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.age += dt;
        const drag = Math.pow(0.984, dt);
        b.vx *= drag;
        b.vy = Math.min(b.vy * drag + 0.16 * dt, 6.5);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rot += b.vr * dt;
        b.flip += b.vflip * dt;
        const fade = Math.min(1, (b.life - b.age) / 45);
        if (fade <= 0 || b.y > h + 30) {
          bits.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.scale(1, Math.max(0.2, Math.abs(Math.cos(b.flip)))); // tumbling
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      }
      if (bits.length > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [source]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-30 h-full w-full" />;
}

// ─────────────────────────────────────────────
// Idle & error (emerald stage)
// ─────────────────────────────────────────────
const viewMotion = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(6px)" },
  transition: { duration: 0.45, ease: EASE },
};

function CardVisual({ reading }: { reading?: boolean }) {
  return (
    <div className="relative flex h-[230px] w-[300px] items-center justify-center sm:h-[260px] sm:w-[340px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute h-[150px] w-[150px] rounded-full border-2 border-gold-light/50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 2.1], opacity: [0.55, 0] }}
          transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="relative h-[150px] w-[236px] overflow-hidden rounded-[22px] border border-white/30 p-4 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55)] sm:h-[164px] sm:w-[260px]"
        style={{ background: "linear-gradient(135deg, #F6E7B4 0%, #E8C96C 38%, #C08A2E 100%)" }}
        animate={reading ? { scale: 1.04 } : { y: [0, -8, 0] }}
        transition={reading ? { duration: 0.2 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="star-lattice pointer-events-none absolute inset-0 opacity-20 invert" />
        <div className="relative flex h-full flex-col justify-between text-[#3B2A0B]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wide opacity-80">জামেআ মারকাযুল ইহসান</p>
              <p className="text-[17px] leading-tight font-bold">আজীবন সদস্য</p>
            </div>
            <Radio className="h-6 w-6 rotate-90 opacity-70" />
          </div>
          <div className="flex items-end justify-between">
            <span className="h-8 w-11 rounded-md border border-[#3B2A0B]/25 bg-gradient-to-br from-[#FFF6D6] to-[#D6B25A]" />
            <span className="font-num text-[13px] tracking-[0.2em] opacity-70">•••• ••••</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function IdleView({ readingLen, onSubmit }: { readingLen: number; onSubmit: (code: string) => void }) {
  const [manual, setManual] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (manual) inputRef.current?.focus();
  }, [manual]);

  const submit = () => {
    if (normalizePunchCode(value).length >= 3) onSubmit(value);
  };

  return (
    <motion.section {...viewMotion} className="mx-auto flex min-h-full w-full max-w-xl flex-col items-center justify-center py-6 text-center text-white">
      <CardVisual reading={readingLen > 0} />
      <h2 className="mt-6 font-heading text-[28px] leading-tight font-bold sm:text-[38px]">আপনার সদস্য কার্ড পাঞ্চ করুন</h2>
      <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/80 sm:text-[17px]">
        কার্ডটি রিডারের ওপর ধরুন — মুহূর্তেই সার্ভার থেকে আপনার অনুদানের পূর্ণ হিসাব দেখা যাবে।
      </p>

      <div className="mt-5 flex h-6 items-center justify-center gap-1.5" aria-live="polite">
        {readingLen > 0 ? (
          <>
            <span className="mr-1 text-[13px] text-gold-light">কার্ড পড়া হচ্ছে</span>
            {Array.from({ length: Math.min(readingLen, 10) }).map((_, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2 w-2 rounded-full bg-gold-light" />
            ))}
          </>
        ) : (
          <span className="text-[13px] text-white/55">রিডার প্রস্তুত</span>
        )}
      </div>

      <div className="mt-6 w-full max-w-sm">
        {manual ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur"
          >
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^0-9০-৯]/g, "").slice(0, 16))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="পাঞ্চ কোড লিখুন"
              aria-label="পাঞ্চ কোড"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 font-num text-[17px] tracking-wider text-white placeholder:font-kalpurush placeholder:tracking-normal placeholder:text-white/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={normalizePunchCode(value).length < 3}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 text-[15px] font-semibold text-brand-strong transition active:scale-95 disabled:opacity-50"
            >
              দেখুন <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setManual(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[13.5px] text-white/80 transition hover:bg-white/10"
          >
            <Keyboard className="h-4 w-4" /> কার্ড কাজ করছে না? পাঞ্চ কোড লিখুন
          </button>
        )}
      </div>
    </motion.section>
  );
}

const ERROR_TEXT: Record<Reason, { title: string; body: string }> = {
  not_found: {
    title: "এই কার্ডের কোনো সদস্য পাওয়া যায়নি",
    body: "কার্ডটি আবার পাঞ্চ করুন। তবুও না মিললে সদস্য সেবা ডেস্কে যোগাযোগ করুন — কার্ডটি আপনার সদস্য নম্বরের সাথে যুক্ত করে দেওয়া হবে।",
  },
  unavailable: {
    title: "সার্ভারে সংযোগ পাওয়া যাচ্ছে না",
    body: "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন। সমস্যা থাকলে কিছুক্ষণ পর কার্ড পাঞ্চ করুন।",
  },
  rate_limited: {
    title: "অল্প সময়ে অনেকবার চেষ্টা হয়েছে",
    body: "অনুগ্রহ করে এক মিনিট অপেক্ষা করে আবার কার্ড পাঞ্চ করুন।",
  },
  invalid: {
    title: "কার্ডের নম্বর পড়া যায়নি",
    body: "কার্ডটি রিডারের ওপর একটু সময় ধরে রাখুন, অথবা পাঞ্চ কোড হাতে লিখুন।",
  },
};

function ErrorView({ reason, code, onRetry, onReset }: { reason: Reason; code: string; onRetry: () => void; onReset: () => void }) {
  const text = ERROR_TEXT[reason];
  return (
    <motion.section {...viewMotion} className="mx-auto flex min-h-full w-full max-w-lg flex-col items-center justify-center py-6 text-center text-white" role="alert">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/15 ring-1 ring-rose-300/40">
        <CircleAlert className="h-10 w-10 text-rose-200" />
      </span>
      <h2 className="mt-5 font-heading text-[24px] font-bold sm:text-[30px]">{text.title}</h2>
      {code && <p className="mt-1 font-num text-[14px] tracking-widest text-white/55">কার্ড {bnNum(maskCode(code))}</p>}
      <p className="mt-3 text-[15.5px] leading-relaxed text-white/80">{text.body}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        {reason === "unavailable" && (
          <button onClick={onRetry} className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-brand-strong active:scale-95">
            <RotateCcw className="h-4 w-4" /> আবার চেষ্টা করুন
          </button>
        )}
        <button onClick={onReset} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 text-[15px] font-semibold active:scale-95">
          <IdCard className="h-4 w-4" /> নতুন কার্ড পাঞ্চ
        </button>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────
// Member record (white stage)
// ─────────────────────────────────────────────
/** Soft rise out of a blur — every part of the record comes in this way, one after another. */
const rise = (delay: number, y = 22) => ({
  initial: { opacity: 0, y, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.7, delay, ease: EASE },
});

const card = "rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-18px_rgba(15,23,42,0.25)]";

function SourceBadge({ source }: { source: PunchMember["source"] }) {
  return source === "live" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> সরাসরি সার্ভার থেকে
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11.5px] font-semibold text-amber-700 ring-1 ring-amber-200">
      <History className="h-3 w-3" /> অফিসের শিট থেকে
    </span>
  );
}

/** The member's name, lit: words rise in, a gold light sweeps across them, a gold line draws in below. */
function HighlightName({ name, delay, gold }: { name: string; delay: number; gold: boolean }) {
  const words = name.split(/\s+/).filter(Boolean);
  const base = gold ? "#2F5A49" : "#0F172A";
  const shine = gold ? "#D9A441" : "#C08A2E";
  const sweep = `linear-gradient(100deg, ${base} 0%, ${base} 38%, ${shine} 50%, ${base} 62%, ${base} 100%)`;
  return (
    <span className="relative inline-block px-2">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -inset-y-4"
        style={{ background: "radial-gradient(closest-side, rgba(232,201,108,0.32), rgba(232,201,108,0))" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, delay: delay + 0.15, ease: EASE }}
      />
      <span className="relative">
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{
              backgroundImage: sweep,
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              // room for the Bangla vowel signs above and below, so the light covers them too
              padding: "0.14em 0.04em",
              margin: "-0.14em 0",
              marginInlineEnd: i < words.length - 1 ? "0.26em" : 0,
            }}
            initial={{ opacity: 0, y: "0.45em", filter: "blur(10px)", backgroundPosition: "100% 0%" }}
            animate={{ opacity: 1, y: "0em", filter: "blur(0px)", backgroundPosition: "0% 0%" }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.15,
              ease: EASE,
              backgroundPosition: { duration: 1.7, delay: delay + 0.55 + i * 0.12, ease: "easeInOut" },
            }}
          >
            {w}
          </motion.span>
        ))}
      </span>
      <motion.span
        aria-hidden
        className="absolute -bottom-2 left-[18%] h-[3px] w-[64%] origin-center rounded-full"
        style={{ background: "linear-gradient(90deg, rgba(232,201,108,0), #E8C96C 25%, #C08A2E 50%, #E8C96C 75%, rgba(232,201,108,0))" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: delay + 0.45 + words.length * 0.12, ease: EASE }}
      />
    </span>
  );
}

function Greeting({ m, fullyPaid, delay }: { m: PunchMember; fullyPaid: boolean; delay: number }) {
  return (
    <div className="text-center">
      <motion.p {...rise(delay, 14)} className="text-[15px] text-slate-500 sm:text-[16px]">
        আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ
      </motion.p>
      <h3 className="mt-1.5 font-heading text-[30px] leading-tight font-bold sm:text-[42px]">
        <HighlightName name={m.name || "সম্মানিত সদস্য"} delay={delay + 0.2} gold={fullyPaid} />
      </h3>
      <motion.p {...rise(delay + 0.75, 12)} className="mt-3 text-[14px] text-slate-500">
        সম্মানিত আজীবন সদস্য · সদস্য নং <b className="font-semibold text-slate-700">{bnNum(m.memberId)}</b>
      </motion.p>
      {m.pledge > 0 && (
        <motion.p {...rise(delay + 0.88, 12)} className="mt-0.5 text-[14px] text-slate-500">
          বাৎসরিক অঙ্গীকার <b className="font-semibold text-slate-700">{taka(m.pledge)}</b>
        </motion.p>
      )}
      {fullyPaid && (
        <motion.p {...rise(delay + 1.05)} className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.85] text-slate-600 sm:text-[17px]">
          আলহামদুলিল্লাহ! আপনার সকল বছরের আজীবন সদস্য অনুদান পরিশোধিত। আল্লাহ তাআলা আপনার দান কবুল করুন এবং সদকায়ে জারিয়া হিসেবে জারি রাখুন।{" "}
          <span className="font-semibold text-slate-800">জাযাকাল্লাহু খাইরান।</span>
        </motion.p>
      )}
    </div>
  );
}

const SEGMENT: Record<PunchYear["status"], string> = {
  paid: "bg-emerald-500",
  advance: "bg-emerald-500",
  partial: "bg-amber-400",
  due: "bg-rose-400",
  none: "bg-slate-200",
};

/** One line that tells the whole story: three numbers and a bar of every year. */
function Summary({ m, currentYear, fullyPaid, delay }: { m: PunchMember; currentYear: number; fullyPaid: boolean; delay: number }) {
  const settled = m.years.filter((y) => isSettledStatus(y.status));
  const due = m.years.filter((y) => isDueStatus(y.status));
  const dueTotal = due.reduce((s, y) => s + remaining(y, m.pledge), 0);
  const paidTotal = settled.reduce((s, y) => s + y.paid, 0);
  const cells = fullyPaid
    ? [
        { label: "সদস্য হয়েছেন", value: m.joinYear ? `${bnNum(m.joinYear)} সাল` : "—", tone: "text-slate-900" },
        { label: "পরিশোধিত", value: `${bnNum(settled.length)} বছর`, tone: "text-emerald-700" },
        { label: "মোট অনুদান", value: taka(paidTotal), tone: "text-slate-900" },
      ]
    : [
        { label: "পরিশোধিত", value: `${bnNum(settled.length)} বছর`, tone: "text-emerald-700" },
        { label: "বকেয়া", value: `${bnNum(due.length)} বছর`, tone: due.length ? "text-rose-600" : "text-emerald-700" },
        { label: "মোট বকেয়া", value: taka(dueTotal), tone: dueTotal ? "text-slate-900" : "text-emerald-700" },
      ];
  const first = m.years[0]?.year;
  const last = m.years[m.years.length - 1]?.year;

  return (
    <div className={`${card} p-4 sm:p-5`}>
      <div className="grid grid-cols-3 divide-x divide-slate-200">
        {cells.map((c) => (
          <div key={c.label} className="px-2 text-center">
            <p className="text-[12.5px] text-slate-500">{c.label}</p>
            <p className={`mt-0.5 text-[19px] leading-tight font-bold sm:text-[23px] ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>
      {m.years.length > 0 && (
        <div className="mt-4">
          <div className="flex gap-1" role="img" aria-label="বছরভিত্তিক অবস্থা">
            {m.years.map((y, i) => (
              <motion.span
                key={y.year}
                title={`${bnNum(y.year)}`}
                className={`h-2.5 flex-1 origin-left rounded-full ${SEGMENT[y.status]} ${y.year === currentYear ? "ring-2 ring-amber-400 ring-offset-2" : ""}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.3 + i * 0.06, ease: EASE }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11.5px] text-slate-400">
            <span className="font-num">{first ? bnNum(first) : ""}</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> পরিশোধিত
              </span>
              {!fullyPaid && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> বকেয়া
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full ring-2 ring-amber-400" /> চলতি বছর
              </span>
            </span>
            <span className="font-num">{last ? bnNum(last) : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function RunningYear({ y, pledge, year }: { y: PunchYear | undefined; pledge: number; year: number }) {
  const settled = y && isSettledStatus(y.status);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-white to-white p-4 shadow-[0_10px_30px_-20px_rgba(180,120,20,0.6)] sm:p-5">
      <div className="shrink-0 text-center">
        <p className="text-[11.5px] font-semibold text-amber-700">চলতি বছর</p>
        <p className="font-num text-[40px] leading-none font-bold text-[#B8862B] sm:text-[48px]">{bnNum(year)}</p>
      </div>
      <div className="min-w-0 flex-1 border-s border-amber-200 ps-4">
        {settled ? (
          <>
            <p className="flex items-center gap-1.5 text-[17px] font-bold text-emerald-700">
              <CircleCheckBig className="h-5 w-5 shrink-0" /> আলহামদুলিল্লাহ, পরিশোধিত
            </p>
            <p className="mt-0.5 text-[14px] text-slate-500">
              {taka(y!.paid)}
              {y!.receipts.length > 0 && ` · রসিদ ${y!.receipts.join(", ")}`}
            </p>
          </>
        ) : y ? (
          <>
            <p className="text-[17px] font-bold text-rose-600">{y.status === "partial" ? "আংশিক পরিশোধিত" : "এ বছরের অনুদান বাকি"}</p>
            <p className="mt-0.5 text-[14px] text-slate-500">
              বাকি <b className="text-slate-800">{taka(remaining(y, pledge))}</b>
            </p>
          </>
        ) : (
          <p className="text-[15px] text-slate-500">এ বছরের কোনো হিসাব পাওয়া যায়নি</p>
        )}
      </div>
    </div>
  );
}

const PILL: Record<PunchYear["status"], { text: string; cls: string }> = {
  paid: { text: "পরিশোধিত", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  advance: { text: "অগ্রিম", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  partial: { text: "আংশিক", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  due: { text: "বকেয়া", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
  none: { text: "রেকর্ড নেই", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
};

function Tick({ on }: { on: boolean }) {
  return (
    <span
      className={`flex h-[22px] w-[22px] items-center justify-center rounded-md border-[1.5px] transition ${on ? "border-transparent" : "border-slate-300 bg-white"}`}
      style={on ? { background: BRAND } : undefined}
    >
      {on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
    </span>
  );
}

const ROW_STEP_S = 0.09;
const statementRowDelay = (delay: number, i: number) => delay + 0.25 + i * ROW_STEP_S;

/** The yearly statement: newest first, one tidy row per year, amounts in one right-aligned column. */
function Statement({
  m,
  currentYear,
  selected,
  onToggle,
  onToggleAll,
  source,
  delay,
}: {
  m: PunchMember;
  currentYear: number;
  selected?: Set<number>;
  onToggle?: (year: number) => void;
  onToggleAll?: () => void;
  source: PunchMember["source"];
  /** when the card appears; its rows then follow one by one */
  delay: number;
}) {
  const rows = [...m.years].sort((a, b) => b.year - a.year);
  const dues = rows.filter((y) => isDueStatus(y.status));
  const allOn = !!selected && dues.length > 0 && dues.every((y) => selected.has(y.year));
  const cols = "grid grid-cols-[26px_minmax(0,1fr)_auto_minmax(72px,auto)] items-center gap-x-3";

  return (
    <div className={`${card} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        <p className="flex items-center gap-2 text-[16px] font-semibold text-slate-800">
          <CalendarCheck className="h-5 w-5" style={{ color: BRAND }} /> বছরভিত্তিক হিসাব
        </p>
        {onToggleAll && dues.length > 1 ? (
          <button type="button" onClick={onToggleAll} className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            <Tick on={allOn} /> সব বকেয়া
          </button>
        ) : (
          <SourceBadge source={source} />
        )}
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-[14.5px] text-slate-500">এই সদস্যের কোনো বছরের হিসাব পাওয়া যায়নি। সদস্য সেবা ডেস্কে যোগাযোগ করুন।</p>
      ) : (
        <>
          <div className={`${cols} bg-slate-50/80 px-4 py-2 text-[12px] font-medium text-slate-400 sm:px-5`}>
            <span />
            <span>সাল</span>
            <span>অবস্থা</span>
            <span className="text-end">টাকা</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {rows.map((y, i) => {
              const due = isDueStatus(y.status);
              const settled = isSettledStatus(y.status);
              const on = !!selected?.has(y.year);
              const current = y.year === currentYear;
              const selectable = due && !!onToggle;
              return (
                <motion.li
                  key={y.year}
                  {...rise(statementRowDelay(delay, i), 12)}
                  role={selectable ? "checkbox" : undefined}
                  aria-checked={selectable ? on : undefined}
                  tabIndex={selectable ? 0 : undefined}
                  onClick={selectable ? () => onToggle(y.year) : undefined}
                  onKeyDown={
                    selectable
                      ? (e) => {
                          if (e.key === " ") {
                            e.preventDefault();
                            onToggle(y.year);
                          }
                        }
                      : undefined
                  }
                  className={`relative ${cols} px-4 py-3 transition sm:px-5 ${current ? "bg-amber-50/70" : on ? "bg-emerald-50/50" : ""} ${selectable ? "cursor-pointer hover:bg-slate-50 active:bg-slate-100" : ""}`}
                >
                  {current && <span className="absolute inset-y-0 start-0 w-1 bg-amber-400" />}
                  <span className="flex justify-center">
                    {selectable ? (
                      <Tick on={on} />
                    ) : settled ? (
                      <CircleCheckBig className="h-5 w-5 text-emerald-600" />
                    ) : due ? (
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className={`font-num text-[17px] font-bold ${current ? "text-[#B8862B]" : "text-slate-800"}`}>{bnNum(y.year)}</span>
                      {current && <span className="rounded-full bg-amber-400 px-1.5 py-px text-[10.5px] font-bold text-white">চলতি</span>}
                    </span>
                    {settled && y.receipts.length > 0 && <span className="block truncate text-[11.5px] text-slate-400">রসিদ {y.receipts.join(", ")}</span>}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1 ${PILL[y.status].cls}`}>{PILL[y.status].text}</span>
                  <span className="text-end">
                    {settled ? (
                      <span className="font-num text-[15px] font-semibold text-slate-800">{taka(y.paid)}</span>
                    ) : due ? (
                      <>
                        <span className="font-num text-[15px] font-semibold text-rose-600">{taka(remaining(y, m.pledge))}</span>
                        {y.status === "partial" && <span className="block text-[11px] text-slate-400">বাকি</span>}
                      </>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </span>
                </motion.li>
              );
            })}
          </ul>
          {onToggleAll && dues.length > 1 && (
            <motion.div {...rise(statementRowDelay(delay, rows.length), 8)} className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-2.5 sm:px-5">
              <p className="text-[12.5px] text-slate-400">টিক দিয়ে এক বা একাধিক বছর বেছে নিন</p>
              <SourceBadge source={source} />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

function Invitation({ year, dateLabel, venue }: { year: number; dateLabel: string; venue: Props["venue"] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 text-center sm:p-6">
      <PartyPopper className="mx-auto h-8 w-8 text-amber-600" />
      <p className="mt-2 text-[18px] leading-snug font-bold text-slate-900 sm:text-[21px]">
        আজীবন সদস্য সম্মেলন {bnNum(year)}-এ আপনাকে সাদর আমন্ত্রণ ও আন্তরিক স্বাগতম
      </p>
      <p className="mt-3 inline-flex rounded-xl px-3.5 py-1.5 text-[15px] font-semibold text-white" style={{ background: BRAND }}>
        {dateLabel}
      </p>
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[14px] text-slate-500">
        <MapPin className="h-4 w-4 shrink-0" /> {venue.line1}, {venue.line2}
      </p>
    </div>
  );
}

function ChooseList({ members, onPick }: { members: PunchMember[]; onPick: (m: PunchMember) => void }) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <p className="text-center text-[18px] font-bold text-slate-900">এই কার্ডে একাধিক সদস্যপদ পাওয়া গেছে</p>
      <p className="mt-1 text-center text-[14.5px] text-slate-500">আপনার সদস্যপদটি বেছে নিন</p>
      <div className="mt-4 space-y-2.5">
        {members.map((m) => (
          <button key={m.memberId} onClick={() => onPick(m)} className={`${card} flex w-full items-center gap-3 p-4 text-start transition hover:border-slate-300 active:scale-[0.99]`}>
            <ContactRound className="h-6 w-6 shrink-0" style={{ color: BRAND }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[17px] font-semibold text-slate-900">{m.name}</span>
              <span className="block text-[13px] text-slate-500">সদস্য নং {bnNum(m.memberId)}</span>
            </span>
            <ArrowRight className="h-5 w-5 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

function NewPunchButton({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex justify-center pt-1">
      <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13.5px] text-slate-600 shadow-sm hover:bg-slate-50">
        <IdCard className="h-4 w-4" /> নতুন কার্ড পাঞ্চ করুন
      </button>
    </div>
  );
}

function MemberRecord({
  m,
  currentYear,
  fullyPaid,
  invited,
  startAt,
  selected,
  setSelected,
  dateLabel,
  venue,
  onPay,
  onReset,
}: {
  m: PunchMember;
  currentYear: number;
  fullyPaid: boolean;
  /** the running year is paid: the conference invitation is part of the record */
  invited: boolean;
  /** seconds: when the first greeting line appears */
  startAt: number;
  selected: Set<number>;
  setSelected: React.Dispatch<React.SetStateAction<Set<number>>>;
  dateLabel: string;
  venue: Props["venue"];
  onPay: (years: number[]) => void;
  onReset: () => void;
}) {
  const dues = m.years.filter((y) => isDueStatus(y.status));
  const chosen = dues.filter((y) => selected.has(y.year)).sort((a, b) => a.year - b.year);
  const total = chosen.reduce((s, y) => s + remaining(y, m.pledge), 0);
  const running = m.years.find((y) => y.year === currentYear);
  // after the word starts rising: greeting lines, then each card, then the statement row by row
  const T = startAt;
  let at = fullyPaid ? T + 1.3 : T + 1.1;
  const invitationAt = invited ? at : 0;
  if (invited) at += 0.22;
  const runningAt = at;
  const summaryAt = at + 0.22;
  const statementAt = at + 0.44;
  const afterRows = statementRowDelay(statementAt, m.years.length) + 0.1;

  const toggle = (year: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  const toggleAll = () => setSelected(chosen.length === dues.length ? new Set() : dueYearsOf(m));

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Greeting m={m} fullyPaid={fullyPaid} delay={T} />
      {invited && (
        <motion.div {...rise(invitationAt)}>
          <Invitation year={currentYear} dateLabel={dateLabel} venue={venue} />
        </motion.div>
      )}
      <motion.div {...rise(runningAt)}>
        <RunningYear y={running} pledge={m.pledge} year={currentYear} />
      </motion.div>
      <motion.div {...rise(summaryAt)}>
        <Summary m={m} currentYear={currentYear} fullyPaid={fullyPaid} delay={summaryAt} />
      </motion.div>
      <motion.div {...rise(statementAt)}>
        <Statement
          m={m}
          currentYear={currentYear}
          selected={fullyPaid ? undefined : selected}
          onToggle={fullyPaid ? undefined : toggle}
          onToggleAll={fullyPaid ? undefined : toggleAll}
          source={m.source}
          delay={statementAt}
        />
      </motion.div>
      <motion.div {...rise(afterRows, 10)}>
        <NewPunchButton onReset={onReset} />
      </motion.div>

      {!fullyPaid && dues.length > 0 && (
        <motion.div
          className="sticky bottom-0 z-20 -mx-4 bg-gradient-to-t from-white via-white/95 to-white/0 px-4 pt-6 pb-[max(14px,env(safe-area-inset-bottom))] sm:-mx-8 sm:px-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: afterRows + 0.1, ease: EASE }}
        >
          <div className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_12px_34px_-12px_rgba(15,23,42,0.35)]">
            <div className="min-w-0 flex-1 ps-2">
              <p className="text-[12.5px] text-slate-500">{chosen.length ? `নির্বাচিত ${bnNum(chosen.length)}টি বছর` : "কোনো বছর নির্বাচন করা হয়নি"}</p>
              <p className="text-[21px] leading-tight font-bold text-slate-900">{taka(total)}</p>
            </div>
            <button
              type="button"
              disabled={chosen.length === 0 || total <= 0}
              onClick={() => onPay(chosen.map((y) => y.year))}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl px-5 text-[15px] font-semibold text-white shadow-md transition active:scale-95 disabled:opacity-40"
              style={{ background: BRAND }}
            >
              <Wallet className="h-5 w-5" /> পরিশোধ করুন
            </button>
          </div>
          {m.pledge <= 0 && (
            <p className="mt-1.5 text-center text-[12px] text-amber-700">অঙ্গীকারের পরিমাণ জানা নেই — অনলাইনে পরিশোধের আগে সদস্য সেবা ডেস্কে যোগাযোগ করুন।</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Kiosk
// ─────────────────────────────────────────────
export function PunchKiosk({ paused, dateLabel, venue, onPay, onInterrupt, onExit }: Props) {
  const [view, setView] = useState<View>({ kind: "idle" });
  const [server, setServer] = useState<Server>("checking");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [readingLen, setReadingLen] = useState(0);
  const [introDoneId, setIntroDoneId] = useState(0);
  const [entranceDoneId, setEntranceDoneId] = useState(0);
  const [activity, setActivity] = useState(0);
  const [stage, setStage] = useState({ w: 1000, h: 700, narrow: false });
  const currentYear = useMemo(() => dhakaYear(), []);
  const request = useRef<AbortController | null>(null);
  const seq = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);

  const sessionId = view.kind === "session" ? view.id : 0;
  const result = view.kind === "session" ? view.result : null;
  const member = result?.kind === "member" ? result.member : null;
  const fullyPaid = member ? isFullyPaid(member, currentYear) : false;
  const introDone = sessionId !== 0 && introDoneId === sessionId;
  const runningPaid = !!member && isSettledStatus(member.years.find((y) => y.year === currentYear)?.status ?? "none");
  // after its moment, WELCOME moves on: it fades away — or, running year paid, becomes the entrance
  const moved = introDone && !!result && result.kind !== "error";
  const celebrate = moved && runningPaid;
  const entering = celebrate && entranceDoneId !== sessionId;
  const zoom = celebrate && entranceDoneId === sessionId;
  const leaving = moved && !celebrate;
  const recordShown = leaving || zoom;
  // a failed lookup shows its error once the welcome has had its moment
  const error =
    view.kind === "error"
      ? { reason: view.reason, code: view.code }
      : view.kind === "session" && introDone && result?.kind === "error"
        ? { reason: result.reason, code: view.code }
        : null;
  const light = view.kind === "session" && !error;

  const reset = useCallback(() => {
    request.current?.abort();
    setSelected(new Set());
    setView({ kind: "idle" });
  }, []);

  const lookup = useCallback(async (raw: string) => {
    const code = normalizePunchCode(raw);
    if (code.length < 3) {
      setView({ kind: "error", reason: "invalid", code: "" });
      return;
    }
    request.current?.abort();
    const ctrl = new AbortController();
    request.current = ctrl;
    const id = ++seq.current;
    // WELCOME goes up at once; the record is fetched behind it
    setView({ kind: "session", id, code, result: null });
    setSelected(new Set());
    const settle = (next: Result) => setView((v) => (v.kind === "session" && v.id === id ? { ...v, result: next } : v));

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      ctrl.abort();
    }, REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch("/api/lifetime-member/punch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal: ctrl.signal,
      });
      const data = (await res.json().catch(() => null)) as PunchLookupResult | null;
      if (ctrl.signal.aborted) return;
      if (data?.ok && data.members.length > 0) {
        setServer("ready");
        if (data.members.length === 1) {
          setSelected(dueYearsOf(data.members[0]));
          settle({ kind: "member", member: data.members[0] });
        } else settle({ kind: "choose", members: data.members });
        return;
      }
      const reason: Reason = data && !data.ok ? data.reason : "unavailable";
      setServer(reason === "unavailable" ? "down" : "ready");
      settle({ kind: "error", reason });
    } catch {
      if (ctrl.signal.aborted && !timedOut) return; // a newer punch replaced this one
      setServer("down");
      settle({ kind: "error", reason: "unavailable" });
    } finally {
      clearTimeout(timer);
    }
  }, []);

  const pick = useCallback((m: PunchMember) => {
    setSelected(dueYearsOf(m));
    setView((v) => (v.kind === "session" ? { ...v, result: { kind: "member", member: m } } : v));
  }, []);

  // The welcome holds for its moment, then rises — or gives way to the error.
  useEffect(() => {
    if (!sessionId) return;
    const id = setTimeout(() => setIntroDoneId(sessionId), INTRO_MS);
    return () => clearTimeout(id);
  }, [sessionId]);

  // The entrance plays, then we walk in (a tap on it walks in at once).
  useEffect(() => {
    if (!entering) return;
    const id = setTimeout(() => setEntranceDoneId(sessionId), ENTRANCE_MS);
    return () => clearTimeout(id);
  }, [entering, sessionId]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Stage size: the WELCOME / doorway fills the middle of it.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    // the observer also reports the first size right away
    const ro = new ResizeObserver(() => setStage({ w: el.clientWidth, h: el.clientHeight, narrow: el.clientWidth < 640 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Warm the server (member sheet) so the first punch is answered fast; also shows the status dot.
  useEffect(() => {
    let alive = true;
    const ping = () =>
      fetch("/api/lifetime-member/punch", { cache: "no-store" })
        .then((r) => alive && setServer(r.ok ? "ready" : "down"))
        .catch(() => alive && setServer("down"));
    ping();
    const id = setInterval(ping, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
      request.current?.abort();
    };
  }, []);

  // Card reader = keyboard: digits then Enter. Listens on the window; typing in an input is left alone.
  // A punch always comes first: whatever is on screen — even the payment sheet — gives way to it.
  useEffect(() => {
    let buffer = "";
    let lastKey = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!pausedRef.current) onExit(); // with the payment sheet open, Esc closes only the sheet
        return;
      }
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const now = performance.now();
      if (now - lastKey > KEY_GAP_MS) buffer = "";
      lastKey = now;
      if (/^[0-9০-৯]$/.test(e.key)) {
        e.preventDefault();
        buffer = (buffer + e.key).slice(-20);
        setReadingLen(buffer.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        if (buffer.length >= 3) {
          e.preventDefault();
          if (pausedRef.current) onInterrupt();
          lookup(buffer);
        }
        buffer = "";
        setReadingLen(0);
      }
    };
    // a reader that sends no Enter: drop the half-read number after the pause
    const clear = setInterval(() => {
      if (buffer && performance.now() - lastKey > KEY_GAP_MS) {
        buffer = "";
        setReadingLen(0);
      }
    }, 500);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      clearInterval(clear);
      setReadingLen(0);
    };
  }, [lookup, onExit, onInterrupt]);

  // Back to "punch your card" after a while, so the next member never sees the last one's record.
  const showing = error ? "error" : recordShown ? "record" : null;
  useEffect(() => {
    if (paused || !showing) return;
    const ms = showing === "error" ? ERROR_RESET_MS : fullyPaid ? WELCOME_RESET_MS : LEDGER_RESET_MS;
    const id = setTimeout(reset, ms);
    return () => clearTimeout(id);
  }, [showing, sessionId, fullyPaid, paused, activity, reset]);

  const pay = useCallback(
    (years: number[]) => {
      if (!member) return;
      const rows = member.years.filter((y) => years.includes(y.year) && isDueStatus(y.status));
      if (rows.length === 0) return;
      const amount = rows.reduce((s, y) => s + remaining(y, member.pledge), 0);
      onPay(member, rows.map((y) => y.year).sort((a, b) => a - b), amount);
    },
    [member, onPay]
  );

  const doorW = Math.max(260, Math.min(stage.w - (stage.narrow ? 32 : 64), 980));
  const doorH = Math.max(320, Math.min(stage.h * 0.8, 600, doorW * 1.25));

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="আজীবন সদস্য কার্ড পাঞ্চ"
      className={`fixed inset-0 z-[105] flex flex-col overflow-hidden bg-white font-kalpurush ${light ? "text-slate-900" : "text-white"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onPointerDown={() => setActivity((n) => n + 1)}
    >
      {/* emerald while waiting for a card; fades to white for the member */}
      <motion.div className="hero-surface pointer-events-none absolute inset-0" initial={false} animate={{ opacity: light ? 0 : 1 }} transition={{ duration: 0.6, ease: EASE }}>
        <div className="star-lattice absolute inset-0 opacity-[0.07]" />
      </motion.div>

      <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${light ? "bg-slate-100" : "bg-white/15"}`}>
            <IdCard className={`h-5 w-5 ${light ? "text-[#417360]" : "text-gold-light"}`} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[16px] leading-tight font-semibold">আজীবন সদস্য · কার্ড পাঞ্চ</p>
            <p className={`truncate text-[12px] ${light ? "text-slate-500" : "text-white/65"}`}>জামেআ মারকাযুল ইহসান ঢাকা</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] sm:inline-flex ${light ? "bg-slate-100 text-slate-600" : "bg-white/10"}`} aria-live="polite">
            <span className={`h-2 w-2 rounded-full ${server === "ready" ? "bg-emerald-400" : server === "down" ? "bg-rose-400" : "animate-pulse bg-amber-300"}`} />
            {server === "ready" ? "সার্ভার সংযুক্ত" : server === "down" ? "সংযোগ নেই" : "সংযোগ হচ্ছে…"}
          </span>
          <button
            type="button"
            onClick={onExit}
            aria-label="বন্ধ করুন"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${light ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-white/10 hover:bg-white/20"}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main ref={mainRef} className={`relative z-10 flex-1 overscroll-contain px-4 sm:px-8 ${recordShown ? "overflow-y-auto" : "overflow-hidden"}`}>
        <AnimatePresence mode="wait">
          {view.kind === "idle" && <IdleView key="idle" readingLen={readingLen} onSubmit={lookup} />}
          {error && (
            <ErrorView key={`error-${sessionId}-${error.reason}-${error.code}`} reason={error.reason} code={error.code} onRetry={() => lookup(error.code)} onReset={reset} />
          )}
          {view.kind === "session" && !error && (
            <motion.section key={`session-${view.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {/* the stage for WELCOME / the entrance; it folds away once the record comes in */}
              <motion.div
                className="relative flex items-center justify-center"
                initial={{ height: stage.h }}
                animate={{ height: recordShown ? 0 : stage.h }}
                transition={{ duration: recordShown && !zoom ? 1.1 : 0.85, ease: EASE, delay: recordShown ? (zoom ? 0.75 : DRIFT_S * 0.62) : 0 }}
              >
                <WelcomeStage
                  W={doorW}
                  H={doorH}
                  cloudRef={cloudRef}
                  moved={moved}
                  leaving={leaving}
                  entering={entering}
                  zoom={zoom}
                  member={member}
                  year={currentYear}
                  dateLabel={dateLabel}
                  venue={venue}
                  onSkip={() => setEntranceDoneId(sessionId)}
                />
                <AnimatePresence>
                  {introDone && !result && (
                    <motion.p
                      className="absolute bottom-[14%] flex items-center gap-2 text-[15px] text-slate-500"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: BRAND }} /> আপনার হিসাব আনা হচ্ছে…
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {recordShown && result?.kind === "member" && (
                <MemberRecord
                  key={result.member.memberId}
                  m={result.member}
                  currentYear={currentYear}
                  fullyPaid={fullyPaid}
                  invited={runningPaid}
                  startAt={zoom ? 0.95 : DRIFT_S * 0.72}
                  selected={selected}
                  setSelected={setSelected}
                  dateLabel={dateLabel}
                  venue={venue}
                  onPay={pay}
                  onReset={reset}
                />
              )}
              {recordShown && result?.kind === "choose" && (
                <motion.div initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, delay: 0.3, ease: EASE }}>
                  <ChooseList members={result.members} onPick={pick} />
                </motion.div>
              )}
              {recordShown && <div className="h-6" />}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {moved && <ConfettiScatter key={`scatter-${sessionId}`} source={cloudRef} />}
      {/* rose petals splash out of the opening doors and blow in from every side */}
      {celebrate && <PetalShower key={`petals-${sessionId}`} delayMs={(FRAME_S + 0.3) * 1000} originX={0.5} originY={0.5} />}
    </motion.div>
  );
}

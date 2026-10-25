"use client";

import { useEffect, useRef } from "react";

export type VisualizerMode = "off" | "live" | "playing";

/**
 * Live "calm rings": three soft, perfectly round halos around the play button.
 * - off:     still and faint.
 * - live:    the halos breathe one after another (inside → out) and a quiet
 *            ripple drifts outward every few seconds.
 * - playing: the halos swell with the speaker's voice, each following the one
 *            inside it with a small delay, so loudness flows outward like a
 *            wave; emphasis sends a ripple and warms the centre to gold.
 * Every change eases in (frame-rate independent), so nothing ever jumps.
 * Colours come from the theme tokens, so it follows light and dark mode.
 * Without an AnalyserNode (e.g. Safari's native HLS) it follows a soft,
 * speech-like rhythm instead.
 */
export function LiveVisualizer({ analyser, mode, className }: { analyser: AnalyserNode | null; mode: VisualizerMode; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef(analyser);
  const modeRef = useRef(mode);
  useEffect(() => {
    analyserRef.current = analyser;
    modeRef.current = mode;
  }, [analyser, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;
    const resize = () => {
      size = canvas.getBoundingClientRect().width;
      canvas.width = canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Theme colours as RGB triples; the canvas normalises any CSS colour.
    type RGB = [number, number, number];
    const probe = document.createElement("canvas").getContext("2d")!;
    const toRgb = (css: string, fallback: RGB): RGB => {
      if (!css) return fallback;
      probe.fillStyle = "#000";
      probe.fillStyle = css;
      const v = String(probe.fillStyle);
      if (v.startsWith("#")) return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16)];
      const m = v.match(/[\d.]+/g);
      return m ? [+m[0], +m[1], +m[2]] : fallback;
    };
    let brand: RGB = [65, 115, 96];
    let gold: RGB = [192, 138, 46];
    let mute: RGB = [133, 145, 138];
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      brand = toRgb(cs.getPropertyValue("--brand").trim(), brand);
      gold = toRgb(cs.getPropertyValue("--gold").trim(), gold);
      mute = toRgb(cs.getPropertyValue("--ink-3").trim(), mute);
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });

    const mix = (a: RGB, b: RGB, k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
    const ease = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-rate * dt));

    const freq = new Uint8Array(512);
    const ring = [0, 0, 0]; // per-halo loudness, each trailing the one inside it
    let liveMix = modeRef.current === "off" ? 0 : 1;
    let playMix = modeRef.current === "playing" ? 1 : 0;
    let fast = 0;
    let slow = 0;
    let breath = 0;
    let clock = 0;
    let nextBeat = 0.8;
    let cooldown = 0;
    const ripples: { p: number; s: number }[] = [];
    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const mode = modeRef.current;
      const node = analyserRef.current;
      const motion = reduce ? 0 : 1;
      clock += dt;

      liveMix = ease(liveMix, mode === "off" ? 0 : 1, 2, dt);
      playMix = ease(playMix, mode === "playing" ? 1 : 0, 2.4, dt);

      // ── Loudness of the voice (0..1).
      let raw = 0;
      if (mode === "playing" && node) {
        node.getByteFrequencyData(freq);
        let sum = 0;
        for (let i = 2; i < 40; i++) sum += freq[i]; // ~180 Hz – 3.7 kHz: the voice
        raw = Math.min(1, Math.pow(sum / (38 * 255), 0.8) * 1.5);
      } else if (mode === "playing") {
        const phrase = Math.max(0, Math.sin(clock * 1.2)) ** 0.6; // pauses between phrases
        const syll = 0.5 + 0.5 * Math.sin(clock * 15 + Math.sin(clock * 1.7) * 2.2);
        raw = 0.12 + 0.5 * phrase * (0.5 + 0.5 * syll);
      }
      raw *= motion;

      // The wave flows outward: each halo eases toward the one inside it.
      ring[0] = ease(ring[0], raw, raw > ring[0] ? 12 : 3.5, dt);
      ring[1] = ease(ring[1], ring[0], 6, dt);
      ring[2] = ease(ring[2], ring[1], 4, dt);

      // Emphasis → ripple (playing); a quiet signal beat (live, not playing).
      fast = ease(fast, raw, 12, dt);
      slow = ease(slow, raw, 1.2, dt);
      cooldown -= dt;
      if (motion && mode === "playing" && fast - slow > 0.08 && cooldown <= 0) {
        ripples.push({ p: 0, s: Math.min(1, 0.45 + (fast - slow) * 4) });
        cooldown = 0.7;
      }
      if (motion && mode === "live" && clock >= nextBeat) {
        ripples.push({ p: 0, s: 0.6 });
        nextBeat = clock + 2.8;
      } else if (mode !== "live") nextBeat = Math.max(nextBeat, clock + 0.6);

      breath += dt * motion * liveMix * ((Math.PI * 2) / 4.4);

      // ── Draw
      const c = size / 2;
      const btn = size * 0.15; // the play button's radius
      const tone = mix(mute, brand, liveMix);
      ctx.clearRect(0, 0, size, size);

      // Halos, outermost first so the inner ones layer on top.
      const halos = [
        { gap: 0.215, swell: 0.06, fill: 0.06 },
        { gap: 0.14, swell: 0.045, fill: 0.085 },
        { gap: 0.07, swell: 0.03, fill: 0.12 },
      ];
      let outer = 0;
      for (let h = 0; h < 3; h++) {
        const H = halos[h];
        const i = 2 - h; // 0 = innermost
        const inhale = 0.5 + 0.5 * Math.sin(breath - i * 0.85);
        const r = btn + size * (H.gap + liveMix * 0.012 * inhale + playMix * H.swell * ring[i] * 1.6);
        if (h === 0) outer = r;
        const col = i === 0 ? mix(tone, gold, Math.min(1, ring[0] * 1.2) * playMix * 0.55) : tone;
        ctx.beginPath();
        ctx.arc(c, c, Math.min(r, c - 2), 0, Math.PI * 2);
        ctx.fillStyle = rgba(col, H.fill * (0.45 + 0.55 * liveMix) * (1 + ring[i] * playMix * 0.8));
        ctx.fill();
      }

      // A hairline on the outer halo keeps the shape crisp.
      ctx.beginPath();
      ctx.arc(c, c, Math.min(outer, c - 2), 0, Math.PI * 2);
      ctx.strokeStyle = rgba(tone, 0.14 + 0.1 * liveMix);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ripples drift outward from the halo and fade.
      for (let k = ripples.length - 1; k >= 0; k--) {
        const rp = ripples[k];
        rp.p += dt / (mode === "playing" ? 1.8 : 2.6);
        if (rp.p >= 1) {
          ripples.splice(k, 1);
          continue;
        }
        const e = 1 - Math.pow(1 - rp.p, 2.4); // ease-out
        ctx.beginPath();
        ctx.arc(c, c, outer + e * (c - outer - 2), 0, Math.PI * 2);
        ctx.strokeStyle = rgba(tone, (1 - rp.p) ** 1.8 * 0.35 * rp.s * liveMix);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Live "voice halo": three soft, layered rings around the play button whose
 * outline swells and ripples with the speaker's voice, plus a faint ripple
 * that drifts outward while playing. Colours come from the theme tokens, so
 * it follows light and dark mode. Without an AnalyserNode it breathes gently.
 */
export function LiveVisualizer({ analyser, active, className }: { analyser: AnalyserNode | null; active: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef(analyser);
  const activeRef = useRef(active);
  useEffect(() => {
    analyserRef.current = analyser;
    activeRef.current = active;
  }, [analyser, active]);

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

    let brand = "#417360";
    let gold = "#C08A2E";
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      brand = cs.getPropertyValue("--brand").trim() || brand;
      gold = cs.getPropertyValue("--gold").trim() || gold;
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const N = 24; // bands per half; mirrored for a symmetric outline
    const level = new Float32Array(N);
    const freq = new Uint8Array(512);
    let energy = 0;
    let ripple = 0;
    let raf = 0;

    // Smooth closed curve through points (midpoint quadratic splines).
    const blob = (pts: [number, number][]) => {
      const mid = (a: [number, number], b: [number, number]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      ctx.beginPath();
      const start = mid(pts[pts.length - 1], pts[0]);
      ctx.moveTo(start[0], start[1]);
      for (let i = 0; i < pts.length; i++) {
        const m = mid(pts[i], pts[(i + 1) % pts.length]);
        ctx.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
      }
      ctx.closePath();
    };

    const draw = (time: number) => {
      const c = size / 2;
      const r0 = size * 0.3; // just outside the play button
      const amp = size * 0.15;
      const on = activeRef.current;
      const node = analyserRef.current;
      ctx.clearRect(0, 0, size, size);

      if (node && on) node.getByteFrequencyData(freq);
      let sum = 0;
      for (let i = 0; i < N; i++) {
        let v: number;
        if (node && on) {
          const idx = Math.floor(1 + Math.pow(i / N, 1.25) * 60);
          v = Math.min(1, (freq[idx] / 255) * (0.6 + 1.1 * (i / N)));
        } else {
          v = (on ? 0.35 : 0.12) * (0.6 + 0.4 * Math.sin(time / 700 + i * 0.55));
        }
        level[i] += (v - level[i]) * (reduce ? 1 : 0.18);
        sum += level[i];
      }
      energy += (sum / N - energy) * 0.08;

      // Faint ripple drifting outward while live audio plays.
      if (on && !reduce) {
        ripple = (ripple + 0.004 + energy * 0.01) % 1;
        const rr = r0 + ripple * (c - r0);
        ctx.beginPath();
        ctx.arc(c, c, rr, 0, Math.PI * 2);
        ctx.strokeStyle = brand;
        ctx.globalAlpha = (1 - ripple) * 0.25;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Three layered halos, outermost first; each turns slowly on its own.
      const layers = [
        { scale: 1, alpha: 0.1, spin: 1 },
        { scale: 0.7, alpha: 0.14, spin: -1.3 },
        { scale: 0.42, alpha: 0.2, spin: 0.7 },
      ];
      for (const [k, L] of layers.entries()) {
        const pts: [number, number][] = [];
        const turn = reduce ? 0 : (time / 9000) * L.spin;
        for (let j = 0; j < N * 2; j++) {
          const band = j < N ? j : N * 2 - 1 - j;
          // Blend with neighbours so the outline stays a smooth, calm curve.
          const near = (d: number) => level[Math.min(N - 1, Math.max(0, band + d))];
          const lv = (near(-2) + 2 * near(-1) + 3 * level[band] + 2 * near(1) + near(2)) / 9;
          const a = (j / (N * 2)) * Math.PI * 2 - Math.PI / 2 + turn;
          const wobble = reduce ? 0 : Math.sin(time / 1300 + j * 0.5 + k) * 0.05;
          const r = r0 + amp * L.scale * (lv + wobble);
          pts.push([c + Math.cos(a) * r, c + Math.sin(a) * r]);
        }
        blob(pts);
        ctx.globalAlpha = L.alpha + energy * 0.15;
        ctx.fillStyle = brand;
        ctx.fill();
        if (k === 0) {
          ctx.globalAlpha = 0.35 + energy * 0.5;
          ctx.strokeStyle = energy > 0.45 ? gold : brand;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
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

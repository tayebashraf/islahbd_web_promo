"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, UserRound } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { LINKS } from "@/lib/nav";

/**
 * Home hero: Masjid an-Nabawi and the Kaaba take turns rising out of soft
 * concentric green rings (a slow blurred cross-fade), the Shaykh's name over
 * them, his lineage above, and two actions below.
 */

/** Scenes cross-fade: the Kaaba arrives after FIRST_SWAP ms, then they alternate. */
const SCENES = ["nabawi", "kaaba"] as const;
const FIRST_SWAP = 3000;
const SCENE_MS = 6500;

const WORD_STAGGER = 0.13;

/** Seconds until the hero copy has arrived; the rest of the page waits for it. */
export const HERO_INTRO = 1.5;

export function HeroBanner() {
  const { t } = useLang();
  const name = t("হযরত মাওলানা তৈয়্যেব আশরাফ সাহেব", "Hazrat Mawlana Tayyeb Ashraf Saheb");
  const words = name.split(" ");
  const nameDone = 0.5 + words.length * WORD_STAGGER + 0.5;
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [turns, setTurns] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => {
      setScene((s) => (s + 1) % SCENES.length);
      setTurns((n) => n + 1);
    }, turns === 0 ? FIRST_SWAP : SCENE_MS);
    return () => clearTimeout(id);
  }, [turns, reduce]);

  return (
    <section className="hn relative isolate overflow-hidden lg:mx-6 lg:mt-5 lg:rounded-t-[36px]">
      {/* Concentric rings with orbiting dots */}
      <div aria-hidden className="hn-rings">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="hn-ring"
            style={{ ["--i" as string]: i }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.1 + (3 - i) * 0.12, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        <span className="hn-orbit">
          <i />
          <i />
          <i />
        </span>
      </div>

      {/* Masjid an-Nabawi and the Kaaba, cross-fading through a soft blur */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {SCENES.map((sc, i) => (
          <div key={sc} className={`hn-art hn-art-${sc}`} data-on={i === scene}>
            {/* eslint-disable-next-line @next/next/no-img-element -- art sized by CSS */}
            <img
              src={sc === "nabawi" ? "/images/hero/masjid-nabawi.jpg" : "/images/hero/kaaba-sharif.jpg"}
              alt=""
              className="hn-art-img-light h-full w-full object-cover"
              fetchPriority={i === 0 ? "high" : "low"}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- art sized by CSS */}
            <img
              src={sc === "nabawi" ? "/images/hero/masjid-nabawi-dark.jpg" : "/images/hero/kaaba-sharif-dark.jpg"}
              alt=""
              className="hn-art-img-dark h-full w-full object-cover"
              fetchPriority={i === 0 ? "high" : "low"}
            />
          </div>
        ))}
      </motion.div>
      <div aria-hidden className="hn-mist" />

      {/* Copy */}
      <div className="hn-copy relative z-10 flex flex-col items-center px-5 text-center">
        {/* The lineage line takes exactly the name's width, so both share the same edges */}
        <div className="inline-flex flex-col items-stretch">
          <p className="hn-sub mb-1 flex w-0 min-w-full items-center justify-center gap-3 text-[11.5px] leading-[1.5] sm:mb-3 sm:text-[15px] sm:leading-relaxed" style={{ animationDelay: `${nameDone}s` }}>
            <span className="hn-rule hidden h-px flex-1 sm:block" />
            <span className="sm:whitespace-nowrap">
              {t(
                "তরজুমানে আকাবের আরেফবিল্লাহ হযরত মাওলানা শাহ আবদুল মতীন বিন হুসাইন সাহেবের খলীফা",
                "Khalifah of Tarjuman-e-Akabir, Arif Billah Hazrat Mawlana Shah Abdul Matin bin Hussain",
              )}
            </span>
            <span className="hn-rule hidden h-px flex-1 -scale-x-100 sm:block" />
          </p>
          <h1 className="relative font-heading text-[clamp(18px,4.8vw,54px)] leading-[1.25] font-bold whitespace-nowrap [perspective:900px]">
            <span className="sr-only">{name}</span>
            <span aria-hidden className="hn-name inline-block">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className="hn-word inline-block origin-bottom"
                  style={{ marginInlineEnd: i < words.length - 1 ? "0.24em" : 0 }}
                  initial={{ opacity: 0, y: "0.5em", rotateX: -75, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.5 + i * WORD_STAGGER, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: nameDone + 0.15 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3"
        >
          <Link href={LINKS.boyan.href} className="hn-btn hn-btn-main group">
            {t("বয়ান শুনুন", "Listen to talks")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
          </Link>
          <Link href={LINKS.paribar.href} className="hn-btn hn-btn-soft">
            <UserRound className="h-4 w-4" />
            {t("হযরত সম্পর্কে জানুন", "About the Shaykh")}
          </Link>
        </motion.div>
      </div>

      <style>{`
        /* Phones: the rings hang a fixed gap below the header and scale with the width,
           so narrow screens get no empty band on top. */
        .hn { --ring: min(86vw, 420px); --rc-y: calc(var(--ring) / 2 + 18px); --ink-h: #34504a;
          --bg: #f3f8f5; --r0: #e9f4ee; --r1: #d4ece0; --r2: #bfe3d1; --r3: #a6d8bf; --edge: rgba(255,255,255,.85);
          background: linear-gradient(180deg, var(--canvas), transparent 26%), radial-gradient(120% 90% at 50% 0%, #fbfdfb, var(--bg));
          -webkit-mask-image: linear-gradient(180deg, #000 90%, transparent 100%); mask-image: linear-gradient(180deg, #000 90%, transparent 100%) }
        
        /* Dark Mode: Deep atmospheric Islamic night with radiant emerald glow */
        .dark .hn {
          --ink-h: #A5B8AC;
          --bg: #0B0D0B;
          --r0: #0E1612;
          --r1: #13221A;
          --r2: #1A3225;
          --r3: #234533;
          --edge: rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, var(--canvas), transparent 26%), radial-gradient(120% 90% at 50% 0%, #15221B, var(--bg));
          box-shadow: none;
          filter: none;
          -webkit-mask-image: linear-gradient(180deg, #000 92%, transparent 100%);
          mask-image: linear-gradient(180deg, #000 92%, transparent 100%);
        }

        /* Tablet+: same rule with a wider gap; from 740px up this is the fixed 404px / 515px layout */
        @media (min-width: 640px) { .hn { --ring: min(92vw, 680px); --rc-y: calc(var(--ring) / 2 + 64px); height: calc(var(--rc-y) + 111px) } }

        /* Rings: stacked discs, lit from the top edge. The box reaches 40px past the rings
           so their upward glow fades out in the mask instead of ending in a straight cut. */
        .hn-rings { --pad: 40px; position: absolute; left: 50%; top: var(--rc-y); width: calc(var(--ring) + 2 * var(--pad)); aspect-ratio: 1; translate: -50% -50%;
          --fade: linear-gradient(180deg, transparent 0, #000 var(--pad), #000 calc(var(--pad) + var(--ring) * .52), transparent calc(var(--pad) + var(--ring) * .86));
          -webkit-mask-image: var(--fade); mask-image: var(--fade) }
        .hn-ring { position: absolute; border-radius: 9999px; inset: calc(var(--pad) + var(--i) * var(--ring) * .11);
          background: radial-gradient(closest-side, var(--bg) 0%, color-mix(in srgb, var(--r3) calc(30% + var(--i) * 15%), var(--bg)) 100%);
          box-shadow: inset 0 2px 0 var(--edge), 0 -10px 40px -18px color-mix(in srgb, var(--r3) 70%, transparent) }
        .hn-orbit { position: absolute; inset: calc(var(--pad) - var(--ring) * .015); animation: hn-spin 90s linear infinite }
        .hn-orbit i { position: absolute; width: 10px; height: 10px; border-radius: 9999px; background: #fff; box-shadow: 0 0 10px rgba(166,216,191,.9) }
        .hn-orbit i:nth-child(1) { left: 22%; top: 9% } .hn-orbit i:nth-child(2) { left: 49%; top: 0 } .hn-orbit i:nth-child(3) { right: 6%; top: 30% }
        .dark .hn-orbit i { background: #E8F7EE; box-shadow: 0 0 12px rgba(80, 200, 140, 0.95) }
        @keyframes hn-spin { to { rotate: 360deg } }

        /* Scenes share one baseline; the dome / Kaaba sits on the rings' axis */
        .hn-art { position: absolute; top: calc(var(--rc-y) + 14px - min(44.1vw, 216px));
          transition: opacity 1.8s ease, filter 1.8s ease, transform 2.2s cubic-bezier(.22,1,.36,1);
          opacity: 0; filter: blur(22px); transform: scale(1.06) }
        .hn-art[data-on="true"] { opacity: 1; filter: blur(0); transform: none }
        .hn-art-nabawi { width: min(48vw, 235px); aspect-ratio: 860 / 790; left: calc(50% - min(17.8vw, 87px));
          -webkit-mask-image: radial-gradient(58% 62% at 52% 44%, #000 50%, transparent 78%); mask-image: radial-gradient(58% 62% at 52% 44%, #000 50%, transparent 78%) }
        .hn-art-kaaba { width: min(64.7vw, 317px); aspect-ratio: 1160 / 790; left: calc(50% - min(32.35vw, 158px));
          -webkit-mask-image: radial-gradient(56% 64% at 50% 44%, #000 52%, transparent 80%); mask-image: radial-gradient(56% 64% at 50% 44%, #000 52%, transparent 80%) }
        
        .hn-art-img-light { display: block }
        .hn-art-img-dark { display: none }
        .dark .hn-art-img-light { display: none !important }
        .dark .hn-art-img-dark { display: block !important }

        .hn-mist { position: absolute; inset: auto 0 0 0; height: 46%; pointer-events: none;
          background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg) 80%, transparent) 40%, var(--bg) 85%) }

        /* Phones: copy stays in flow, so a wrapped lineage line grows the hero instead of clipping the buttons */
        .hn-copy { padding-top: calc(var(--rc-y) - 20px); padding-bottom: 28px }
        @media (min-width: 640px) {
          .hn-art { top: calc(var(--rc-y) + 14px - 312px) }
          .hn-art-nabawi { width: 340px; left: calc(50% - 126px) }
          .hn-art-kaaba { width: 459px; left: calc(50% - 230px) }
          .hn-copy { position: absolute; inset-inline: 0; top: calc(var(--rc-y) - 104px); padding: 0 1.25rem }
        }

        /* The name: solid deep theme green in light, luminous radiant white-emerald in dark */
        .hn-word { padding-block: .08em; color: var(--brand-strong); transition: color .3s ease; }
        .dark .hn-word { color: #F0FDF4; text-shadow: 0 2px 22px rgba(76, 175, 125, 0.4); }
        .hn-rule { background: linear-gradient(90deg, transparent, #8fcdb0) }
        .dark .hn-rule { background: linear-gradient(90deg, transparent, #284737) }
        .hn-sub { color: var(--ink-h); opacity: 0; animation: hn-breathe 7s ease-in-out infinite }
        .dark .hn-sub { color: #A5B8AC; }
        @keyframes hn-breathe { 0% { opacity: 0; filter: blur(4px); transform: translateY(6px) } 18%, 72% { opacity: 1; filter: blur(0); transform: none } 92%, 100% { opacity: 0; filter: blur(4px); transform: translateY(-4px) } }

        .hn-btn { display: inline-flex; height: 44px; align-items: center; gap: .45rem; padding-inline: 1.35rem; border-radius: 9999px; font-size: 14.5px; font-weight: 600; transition: transform .2s, filter .2s, background .2s, color .2s }
        .hn-btn:hover { transform: translateY(-1px) }
        .hn-btn-main { color: #fff; background: linear-gradient(90deg, #3f9d83, #5cbf7a); box-shadow: 0 14px 26px -12px rgba(54, 140, 100, .55) }
        .hn-btn-main:hover { filter: brightness(1.05) }
        .dark .hn-btn-main { background: linear-gradient(90deg, #2E7D63, #439E6C); box-shadow: 0 14px 28px -12px rgba(46, 125, 99, 0.65); }
        .hn-btn-soft { color: #2f6f58; background: rgba(255,255,255,.75); backdrop-filter: blur(8px); box-shadow: inset 0 0 0 1.5px #a6d8bf, 0 10px 22px -16px rgba(30,80,60,.4) }
        .hn-btn-soft:hover { background: #fff }
        .dark .hn-btn-soft { color: #D6EDE2; background: rgba(255,255,255,.08); backdrop-filter: blur(12px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.16), 0 10px 22px -16px rgba(0,0,0,.6); }
        .dark .hn-btn-soft:hover { background: rgba(255,255,255,.16); color: #fff }
        @media (max-width: 639px) { .hn-btn { height: 36px; padding-inline: .95rem; font-size: 13px; gap: .35rem } }
        @media (prefers-reduced-motion: reduce) { .hn-art { transition: none } .hn-orbit { animation: none } .hn-sub { animation: none; opacity: 1 } }
      `}</style>
    </section>
  );
}

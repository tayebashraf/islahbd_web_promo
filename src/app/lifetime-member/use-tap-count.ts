"use client";

import { useCallback, useRef } from "react";

/**
 * A hidden switch, like a developer mode: calls `onTriple` after `count` taps (three by default)
 * within `windowMs`. `onFirstTap` runs on the first tap of a series — used to start loading the
 * hidden screen, so it is ready by the last tap.
 */
export function useTripleTap(onTriple: () => void, windowMs = 900, count = 3, onFirstTap?: () => void) {
  const taps = useRef<number[]>([]);
  return useCallback(() => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < windowMs), now];
    if (taps.current.length === 1) onFirstTap?.();
    if (taps.current.length >= count) {
      taps.current = [];
      onTriple();
    }
  }, [onTriple, windowMs, count, onFirstTap]);
}

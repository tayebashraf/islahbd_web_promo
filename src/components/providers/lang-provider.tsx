"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translate } from "@/lib/i18n";

export type Lang = "bn" | "en" | "ar" | "ur";

export const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "bn", label: "বাংলা", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "ur", label: "اردو", dir: "rtl" },
];

/**
 * Every call site passes Bangla and English; Arabic and Urdu are looked up
 * from the shared dictionary by the English text (numbers are matched as
 * `{n}`), unless the caller passes them explicitly.
 */
type TFn = <T extends ReactNode>(bn: T, en: T, more?: { ar?: T; ur?: T }) => T;

interface LangContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: TFn;
}

const defaultT: TFn = (bn) => bn;

const LangContext = createContext<LangContextValue>({
  lang: "bn",
  dir: "ltr",
  setLang: () => {},
  t: defaultT,
});

const KEY = "islahbd-lang";
const isLang = (v: unknown): v is Lang => LANGS.some((l) => l.code === v);

function applyToDocument(l: Lang) {
  const root = document.documentElement;
  root.lang = l;
  root.dir = LANGS.find((x) => x.code === l)!.dir;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    const l = isLang(stored) ? stored : "bn";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the saved preference after hydration
    setLangState(l);
    applyToDocument(l);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    applyToDocument(l);
  }, []);

  const t = useCallback<TFn>(
    (bn, en, more) => {
      if (lang === "bn") return bn;
      if (lang === "en") return en;
      const explicit = more?.[lang];
      if (explicit !== undefined) return explicit;
      return (typeof en === "string" ? translate(en, lang) : en) as typeof en;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, dir: LANGS.find((x) => x.code === lang)!.dir, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

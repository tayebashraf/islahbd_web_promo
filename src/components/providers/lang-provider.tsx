"use client";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "bn" | "en";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFn = <T extends ReactNode>(bn: T, en: T) => T;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFn;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultT: TFn = (bn) => bn as any;

const LangContext = createContext<LangContextValue>({
  lang: "bn",
  setLang: () => {},
  t: defaultT,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const stored = localStorage.getItem("islahbd-lang") as Lang | null;
    if (stored) { setLangState(stored); return; }
    const browser = navigator.language.toLowerCase();
    setLangState(browser.startsWith("en") ? "en" : "bn");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("islahbd-lang", l);
    document.documentElement.lang = l === "bn" ? "bn" : "en";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t: TFn = (bn, en) => (lang === "en" ? en : bn) as any;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

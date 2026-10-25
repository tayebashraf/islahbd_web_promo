"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Download, Languages, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { PlayerBar } from "@/components/player/player-bar";
import { ALL_LINKS, RAIL_GROUPS, TOP_NAV, isActive, type NavLink } from "@/lib/nav";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-client-store";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { current } = usePlayer();
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1480px] px-3 pt-3 sm:px-5 sm:pt-5">
        <TopBar onMenu={() => setDrawer(true)} onSearch={() => setPalette(true)} pathname={pathname} />

        <div className="mt-4 flex gap-5 sm:mt-6">
          <Rail pathname={pathname} />
          <main id="main-content" className={cn("min-w-0 flex-1 pb-10", current && "pb-36")}>
            {children}
            <ShellFooter />
          </main>
        </div>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} pathname={pathname} />
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
      <PlayerBar />
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="islahbd">
      <Image src="/icon-192.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full" priority />
      <span className="text-[22px] font-bold tracking-tight text-brand">islahbd</span>
    </Link>
  );
}

function TopBar({ onMenu, onSearch, pathname }: { onMenu: () => void; onSearch: () => void; pathname: string }) {
  const { t } = useLang();
  return (
    <header className="flex h-[68px] items-center gap-3 rounded-full bg-panel py-2 pr-2 pl-3 sm:h-[76px] sm:pl-5">
      <Logo />

      <nav aria-label={t("প্রধান নেভিগেশন", "Main navigation")} className="mx-auto hidden xl:block">
        <ul className="flex items-center gap-1 rounded-full bg-panel-2 p-1.5">
          {TOP_NAV.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition",
                    active ? "bg-panel text-ink shadow-sm" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {t(l.bn, l.en)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2 xl:ml-0">
        <RoundButton label={t("খুঁজুন (⌘K)", "Search (⌘K)")} onClick={onSearch}>
          <Search className="h-[18px] w-[18px]" />
        </RoundButton>
        <LangButton />
        <ThemeButton />
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden h-11 items-center gap-2 rounded-full bg-brand pr-4 pl-3 text-sm font-medium text-white transition hover:bg-brand-strong md:flex"
        >
          <Download className="h-4 w-4" />
          {t("অ্যাপ নিন", "Get the app")}
        </a>
        <RoundButton label={t("মেনু", "Menu")} onClick={onMenu} className="lg:hidden">
          <Menu className="h-[18px] w-[18px]" />
        </RoundButton>
      </div>
    </header>
  );
}

function RoundButton({
  children,
  label,
  onClick,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-2 transition hover:border-brand/40 hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLang();
  const dark = useHydrated() && resolvedTheme === "dark";
  return (
    <RoundButton label={t("থিম পরিবর্তন", "Toggle theme")} onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </RoundButton>
  );
}

function LangButton() {
  const { lang, setLang, t } = useLang();
  return (
    <RoundButton label={t("Switch to English", "বাংলায় দেখুন")} onClick={() => setLang(lang === "bn" ? "en" : "bn")} className="hidden sm:flex">
      <span className="flex items-center gap-0.5 text-[13px] font-semibold">
        <Languages className="h-4 w-4" />
        <span className="sr-only">{lang === "bn" ? "EN" : "বাং"}</span>
      </span>
    </RoundButton>
  );
}

function Rail({ pathname }: { pathname: string }) {
  const { t } = useLang();
  return (
    <aside className="sticky top-5 hidden h-fit shrink-0 flex-col gap-3 lg:flex" aria-label={t("ফিচার", "Features")}>
      {RAIL_GROUPS.map((group, gi) => (
        <ul key={gi} className="flex flex-col items-center gap-1.5 rounded-full bg-panel p-1.5">
          {group.map((l) => (
            <li key={l.href}>
              <RailItem link={l} active={isActive(pathname, l.href)} label={t(l.bn, l.en)} />
            </li>
          ))}
        </ul>
      ))}
    </aside>
  );
}

function RailItem({ link, active, label }: { link: NavLink; active: boolean; label: string }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-11 w-11 items-center justify-center rounded-full transition",
        active ? "bg-brand text-white shadow-md shadow-brand/30" : "text-ink-2 hover:bg-panel-2 hover:text-ink",
      )}
    >
      <Icon className="h-[19px] w-[19px]" />
      <span className="pointer-events-none absolute left-full z-30 ml-3 rounded-full bg-ink px-3 py-1.5 text-xs font-medium whitespace-nowrap text-canvas opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </Link>
  );
}

function Drawer({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const { t, lang, setLang } = useLang();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[61] flex w-[86%] max-w-sm flex-col bg-canvas p-4 lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={t("মেনু", "Menu")}
          >
            <div className="flex items-center justify-between rounded-full bg-panel p-2 pl-3">
              <Logo />
              <RoundButton label={t("বন্ধ করুন", "Close")} onClick={onClose}>
                <X className="h-[18px] w-[18px]" />
              </RoundButton>
            </div>
            <nav className="mt-4 flex-1 overflow-y-auto">
              {RAIL_GROUPS.map((group, gi) => (
                <ul key={gi} className="mb-3 rounded-[24px] bg-panel p-1.5">
                  {group.map((l) => {
                    const Icon = l.icon;
                    const active = isActive(pathname, l.href);
                    return (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium",
                            active ? "bg-brand text-white" : "text-ink-2",
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                          {t(l.bn, l.en)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLang(lang === "bn" ? "en" : "bn")}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-panel text-sm font-medium text-ink"
              >
                <Languages className="h-4 w-4" />
                {lang === "bn" ? "English" : "বাংলা"}
              </button>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand text-sm font-medium text-white">
                <Download className="h-4 w-4" />
                {t("অ্যাপ নিন", "Get the app")}
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

interface SearchHit {
  key: string;
  title: string;
  hint: string;
  href: string;
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useLang();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [content, setContent] = useState<SearchHit[] | null>(null);
  const [cursor, setCursor] = useState(0);

  const close = () => {
    setQ("");
    setCursor(0);
    onClose();
  };

  useEffect(() => {
    if (!open || content) return;
    // Lazily pull titles so search covers real content, not just page names.
    import("@/lib/api").then(async ({ API_BASE }) => {
      const get = (p: string) => fetch(`${API_BASE}${p}`).then((r) => (r.ok ? r.json() : [])).catch(() => []);
      const [boyans, nasheeds, clips] = await Promise.all([get("/api/audios/"), get("/api/nasheeds/"), get("/api/clips/")]);
      setContent([
        ...boyans.map((b: { id: number; title: string; category: string }) => ({ key: `b${b.id}`, title: b.title, hint: b.category || "বয়ান", href: `/boyan?play=${b.id}` })),
        ...nasheeds.map((n: { id: number; title: string }) => ({ key: `n${n.id}`, title: n.title, hint: "হামদ ও নাত", href: `/nasheed?play=${n.id}` })),
        ...clips.map((c: { id: number; title: string }) => ({ key: `c${c.id}`, title: c.title, hint: "শর্ট ক্লিপ", href: `/clips?play=${c.id}` })),
      ]);
    });
  }, [open, content]);

  const hits = useMemo<SearchHit[]>(() => {
    const needle = q.trim().toLowerCase();
    const pages = ALL_LINKS.map((l) => ({ key: l.href, title: t(l.bn, l.en), hint: t(l.descBn, l.descEn), href: l.href }));
    if (!needle) return pages;
    const match = (s: string) => s.toLowerCase().includes(needle);
    return [...pages.filter((p) => match(p.title) || match(p.hint)), ...(content ?? []).filter((c) => match(c.title))].slice(0, 30);
  }, [q, content, t]);

  const go = (hit: SearchHit) => {
    close();
    router.push(hit.href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-[28px] bg-panel shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={t("খুঁজুন", "Search")}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search className="h-5 w-5 text-ink-3" />
              <input
                ref={inputRef}
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") close();
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setCursor((c) => Math.min(c + 1, hits.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setCursor((c) => Math.max(c - 1, 0));
                  }
                  if (e.key === "Enter" && hits[cursor]) go(hits[cursor]);
                }}
                placeholder={t("বয়ান, নাশিদ, ফিচার খুঁজুন…", "Search talks, nasheeds, features…")}
                className="h-16 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-3"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-num text-[11px] text-ink-3">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {hits.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-ink-3">
                  {content ? t("কিছু পাওয়া যায়নি", "Nothing found") : t("লোড হচ্ছে…", "Loading…")}
                </li>
              )}
              {hits.map((h, i) => (
                <li key={h.key}>
                  <button
                    onClick={() => go(h)}
                    onMouseEnter={() => setCursor(i)}
                    className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left", i === cursor && "bg-panel-2")}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{h.title}</span>
                      <span className="block truncate text-xs text-ink-3">{h.hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="border-t border-line px-5 py-2.5 text-[11px] text-ink-3">
              {lang === "bn" ? "↑↓ দিয়ে বাছাই, Enter দিয়ে খুলুন" : "↑↓ to navigate, Enter to open"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ShellFooter() {
  const { t } = useLang();
  return (
    <footer className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[28px] bg-panel px-6 py-5 text-sm text-ink-3 md:flex-row">
      <p>
        © {new Date().getFullYear()} islahbd · {t("মারকাযুল ইহসান", "Markazul Ihsan")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <Link href="/blog" className="hover:text-ink">
          {t("ব্লগ ও নিবন্ধ", "Blog & Articles")}
        </Link>
        <Link href="/privacy-policy" className="hover:text-ink">
          {t("গোপনীয়তা নীতি", "Privacy")}
        </Link>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          Google Play
        </a>
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          App Store
        </a>
      </div>
    </footer>
  );
}

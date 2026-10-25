"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Check, ChevronDown, Download, Globe, Moon, Search, Sun, X } from "lucide-react";
import { LANGS, useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { PlayerBar } from "@/components/player/player-bar";
import { ALL_LINKS, BOTTOM_NAV, LINKS, MORE, NAV_GROUPS, TOP_NAV, isActive, type NavLink } from "@/lib/nav";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-client-store";

const ShellContext = createContext<{ openMore: () => void; openSearch: () => void }>({
  openMore: () => {},
  openSearch: () => {},
});

/** Lets page content open the all-features sheet or the search palette. */
export const useShell = () => useContext(ShellContext);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { current } = usePlayer();
  const [more, setMore] = useState(false);
  const [palette, setPalette] = useState(false);
  const home = pathname === "/";

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

  const ctx = useMemo(() => ({ openMore: () => setMore(true), openSearch: () => setPalette(true) }), []);

  return (
    <ShellContext.Provider value={ctx}>
      <div className="flex min-h-screen flex-col bg-canvas">
        <Header pathname={pathname} onSearch={() => setPalette(true)} />

        <main id="main-content" className={cn("flex-1", !home && "mx-auto w-full max-w-[1240px] px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8")}>
          {children}
        </main>

        <Footer />
        {/* Room for the fixed bottom bar and mini player on phones. */}
        <div aria-hidden style={{ height: `calc(var(--nav-h) + env(safe-area-inset-bottom) + ${current ? 96 : 0}px)` }} />

        <BottomNav pathname={pathname} moreOpen={more} onMore={() => setMore((v) => !v)} onNavigate={() => setMore(false)} />
        <MoreSheet open={more} onClose={() => setMore(false)} pathname={pathname} />
        <CommandPalette open={palette} onClose={() => setPalette(false)} />
        <PlayerBar />
      </div>
    </ShellContext.Provider>
  );
}

/* ── Brand ─────────────────────────────────────────────────────── */

function Logo() {
  const { t } = useLang();
  return (
    <Link href="/" className="tap flex shrink-0 items-center gap-3" aria-label="ইসলাহ">
      <Image src="/icon-192.png" alt="ইসলাহ" width={44} height={44} className="h-10 w-10 rounded-xl ring-1 ring-line sm:h-11 sm:w-11" priority />
      <span className="leading-none">
        <span className="block text-[20px] font-bold tracking-tight text-ink sm:text-[22px] font-heading">
          ইসলাহ
        </span>
        <span className="mt-1 block text-[11px] sm:text-[11.5px] font-medium text-ink-2">
          {t("দ্বীনি জীবনের সঙ্গী", "Companion for Islamic Life")}
        </span>
      </span>
    </Link>
  );
}

/** Soft tinted circle with the feature's icon. */
export function ToneIcon({ link, size = "md", className }: { link: Pick<NavLink, "icon" | "tone">; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const Icon = link.icon;
  const box = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-14 w-14", xl: "h-16 w-16" }[size];
  const glyph = { sm: "h-[18px] w-[18px]", md: "h-5 w-5", lg: "h-6 w-6", xl: "h-7 w-7" }[size];
  return (
    <span className={cn("tone flex shrink-0 items-center justify-center rounded-full", box, className)} style={{ ["--tone" as string]: link.tone }}>
      <Icon className={glyph} strokeWidth={1.9} />
    </span>
  );
}

/* ── Header ────────────────────────────────────────────────────── */

function Header({ pathname, onSearch }: { pathname: string; onSearch: () => void }) {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("nav-blur sticky top-0 z-40 border-b transition-colors", scrolled ? "border-line" : "border-transparent")}>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label={t("প্রধান নেভিগেশন", "Main navigation")} className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {TOP_NAV.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-2 text-[15px] whitespace-nowrap transition",
                      active ? "bg-brand-soft font-semibold text-brand" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    {t(l.bn, l.en)}
                  </Link>
                </li>
              );
            })}
            <li>
              <MoreMenu pathname={pathname} />
            </li>
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2 lg:ms-0">
          <RoundButton label={t("খুঁজুন", "Search")} onClick={onSearch}>
            <Search className="h-[19px] w-[19px]" />
          </RoundButton>
          <ThemeButton />
          <LangMenu />
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center gap-2 rounded-full bg-brand ps-5 pe-4 text-[15px] font-medium text-white transition hover:bg-brand-strong md:flex"
          >
            {t("অ্যাপ নিন", "Get the app")}
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function RoundButton({ children, label, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn("tap flex h-10 w-10 items-center justify-center rounded-full bg-panel-2 text-brand transition hover:bg-brand-soft active:scale-95 sm:h-11 sm:w-11", className)}
      {...rest}
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
      {dark ? <Sun className="h-[19px] w-[19px]" /> : <Moon className="h-[19px] w-[19px]" />}
    </RoundButton>
  );
}

/** Small popover hook: closes on outside click and Escape. */
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

function LangMenu() {
  const { lang, setLang, t } = useLang();
  const { open, setOpen, ref } = usePopover();
  return (
    <div ref={ref} className="relative">
      <RoundButton label={t("ভাষা", "Language")} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu">
        <Globe className="h-[19px] w-[19px]" />
      </RoundButton>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-line bg-panel p-1.5 shadow-[var(--shadow-float)]"
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  role="menuitemradio"
                  aria-checked={lang === l.code}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  lang={l.code}
                  dir={l.dir}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] transition",
                    lang === l.code ? "bg-brand-soft font-semibold text-brand" : "text-ink hover:bg-panel-2",
                  )}
                >
                  {l.label}
                  {lang === l.code && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Desktop "More" dropdown listing every feature by group. */
function MoreMenu({ pathname }: { pathname: string }) {
  const { t } = useLang();
  const { open, setOpen, ref } = usePopover();
  const [seen, setSeen] = useState(pathname);
  // Close on navigation (state adjusted during render, not in an effect).
  if (seen !== pathname) {
    setSeen(pathname);
    if (open) setOpen(false);
  }
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn("flex items-center gap-1 rounded-full px-4 py-2 text-[15px] transition", open ? "text-ink" : "text-ink-2 hover:text-ink")}
      >
        {t("আরও", "More")}
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[72px] z-50 mx-auto mt-1 w-[min(920px,calc(100vw-48px))] rounded-3xl border border-line bg-panel p-5 shadow-[var(--shadow-float)]"
          >
            <div className="grid grid-cols-4 gap-5">
              {NAV_GROUPS.map((g) => (
                <div key={g.en}>
                  <p className="mb-2 px-2 text-sm font-semibold text-brand">{t(g.bn, g.en)}</p>
                  <ul className="space-y-0.5">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <FeatureLink link={l} onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-[14.5px] text-ink hover:bg-panel-2">
                          <ToneIcon link={l} size="sm" />
                          <span className="truncate">{t(l.bn, l.en)}</span>
                        </FeatureLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Internal links use the router; map-style links open a new tab. */
export function FeatureLink({ link, className, children, onClick }: { link: NavLink; className?: string; children: React.ReactNode; onClick?: () => void }) {
  if (link.external)
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/* ── Mobile chrome ─────────────────────────────────────────────── */

function BottomNav({ pathname, moreOpen, onMore, onNavigate }: { pathname: string; moreOpen: boolean; onMore: () => void; onNavigate: () => void }) {
  const { t } = useLang();
  const inTabs = BOTTOM_NAV.some((l) => isActive(pathname, l.href));
  const items = [
    ...BOTTOM_NAV.map((l) => ({ key: l.href, link: l, label: t(l.bn, l.en), active: !moreOpen && isActive(pathname, l.href) })),
    { key: "more", link: null, label: t(MORE.bn, MORE.en), active: moreOpen || !inTabs },
  ];

  return (
    <nav aria-label={t("নিচের নেভিগেশন", "Bottom navigation")} className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-canvas-2/95 pb-safe backdrop-blur-xl lg:hidden">
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {items.map((it) => {
          const Icon = it.link?.icon ?? MORE.icon;
          const inner = (
            <>
              <span className="relative flex h-8 w-14 items-center justify-center">
                {it.active && <motion.span layoutId="bottom-pill" className="absolute inset-0 rounded-full bg-brand-soft" transition={{ type: "spring", damping: 30, stiffness: 380 }} />}
                <Icon className={cn("relative h-[22px] w-[22px]", it.active ? "text-brand" : "text-ink-3")} strokeWidth={it.active ? 2.2 : 1.8} />
              </span>
              <span className={cn("mt-0.5 text-[11.5px] leading-tight", it.active ? "font-semibold text-brand" : "text-ink-3")}>{it.label}</span>
            </>
          );
          const cls = "tap flex h-full w-full flex-col items-center justify-center transition-transform active:scale-95";
          return (
            <li key={it.key}>
              {it.link ? (
                <Link href={it.link.href} onClick={onNavigate} aria-current={it.active ? "page" : undefined} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button onClick={onMore} aria-expanded={moreOpen} className={cls}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Every feature as a soft icon grid — a bottom sheet on phones, a dialog on desktop. */
function MoreSheet({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[50] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <div className="pointer-events-none fixed inset-0 z-[52] flex items-end justify-center lg:items-center lg:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("সব ফিচার", "All features")}
              className="pointer-events-auto max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-canvas px-4 pt-2 shadow-2xl lg:w-[720px] lg:rounded-3xl lg:px-6 lg:pt-6"
              style={{ paddingBottom: "calc(var(--nav-h) + env(safe-area-inset-bottom) + 16px)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => (info.offset.y > 110 || info.velocity.y > 600) && onClose()}
            >
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line lg:hidden" />
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-heading text-xl text-ink">{t("সব ফিচার", "All features")}</h2>
                <RoundButton label={t("বন্ধ করুন", "Close")} onClick={onClose}>
                  <X className="h-5 w-5" />
                </RoundButton>
              </div>

              {NAV_GROUPS.map((g) => (
                <section key={g.en} className="mt-4">
                  <p className="mb-2 px-1 text-sm font-semibold text-brand">{t(g.bn, g.en)}</p>
                  <ul className="grid grid-cols-4 gap-x-1 gap-y-3 sm:grid-cols-6">
                    {g.links.map((l) => {
                      const active = !l.external && isActive(pathname, l.href);
                      return (
                        <li key={l.href}>
                          <FeatureLink link={l} onClick={onClose} className="tap flex flex-col items-center gap-2 rounded-2xl px-0.5 py-1.5 text-center transition active:scale-95">
                            <ToneIcon link={l} size="lg" className={cn(active && "ring-2 ring-brand ring-offset-2 ring-offset-canvas")} />
                            <span className="text-[13px] leading-tight text-ink">{t(l.bn, l.en)}</span>
                          </FeatureLink>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Search palette ────────────────────────────────────────────── */

interface SearchHit {
  key: string;
  title: string;
  hint: string;
  href: string;
  link?: NavLink;
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const router = useRouter();
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
        ...boyans.map((b: { id: number; title: string; category: string }) => ({ key: `b${b.id}`, title: b.title, hint: b.category || "বয়ান", href: `/boyan?play=${b.id}`, link: LINKS.boyan })),
        ...nasheeds.map((n: { id: number; title: string }) => ({ key: `n${n.id}`, title: n.title, hint: "হামদ ও নাত", href: `/nasheed?play=${n.id}`, link: LINKS.nasheed })),
        ...clips.map((c: { id: number; title: string }) => ({ key: `c${c.id}`, title: c.title, hint: "শর্ট ক্লিপ", href: `/clips?play=${c.id}`, link: LINKS.clips })),
      ]);
    });
  }, [open, content]);

  const hits = useMemo<SearchHit[]>(() => {
    const needle = q.trim().toLowerCase();
    const pages = ALL_LINKS.filter((l) => !l.external).map((l) => ({ key: l.href, title: t(l.bn, l.en), hint: t(l.descBn, l.descEn), href: l.href, link: l }));
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
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-3 pt-[max(12px,8vh)] backdrop-blur-sm sm:p-4 sm:pt-[12vh]"
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
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={t("খুঁজুন", "Search")}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
              <Search className="h-5 w-5 text-brand" />
              <input
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
                className="h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-3 sm:h-16"
              />
              <button onClick={close} className="rounded-lg border border-line px-2 py-1 text-xs text-ink-3">
                {t("বন্ধ", "Close")}
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {hits.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-ink-3">{content ? t("কিছু পাওয়া যায়নি", "Nothing found") : t("লোড হচ্ছে…", "Loading…")}</li>
              )}
              {hits.map((h, i) => (
                <li key={h.key}>
                  <button
                    onClick={() => go(h)}
                    onMouseEnter={() => setCursor(i)}
                    className={cn("flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start", i === cursor && "bg-panel-2")}
                  >
                    {h.link && <ToneIcon link={h.link} size="sm" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] text-ink">{h.title}</span>
                      <span className="block truncate text-xs text-ink-3">{h.hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Footer ────────────────────────────────────────────────────── */

function Footer() {
  const { t } = useLang();
  const cols: { title: string; links: NavLink[] }[] = [
    { title: t("জনপ্রিয় পেজ", "Popular pages"), links: [LINKS.boyan, LINKS.quran, LINKS.dua, LINKS.prayer, LINKS.amal] },
    { title: t("প্রতিষ্ঠান", "Institution"), links: [LINKS.about, LINKS.paribar, LINKS.member, LINKS.notices, LINKS.blog] },
  ];
  return (
    <footer className="mt-auto border-t border-line bg-canvas-2">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
            {t(
              "ইসলাহ — দ্বীনি জীবনের সঙ্গী। বয়ান, কুরআন, দোয়া, আমল ও নামাজের সময় এক জায়গায়।",
              "Islah is your companion for Islamic life — talks, Quran, duas, amal and prayer times in one place.",
            )}
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-3 text-[15px] font-semibold text-ink">{c.title}</p>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-2 hover:text-brand">
                    {t(l.bn, l.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="mb-3 text-[15px] font-semibold text-ink">{t("অ্যাপ ডাউনলোড", "Get the app")}</p>
          <div className="flex flex-col gap-2">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 rounded-xl border border-line bg-panel px-3 text-sm text-ink hover:border-brand/40">
              <Download className="h-4 w-4 text-brand" /> Google Play
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 rounded-xl border border-line bg-panel px-3 text-sm text-ink hover:border-brand/40">
              <Download className="h-4 w-4 text-brand" /> App Store
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-ink-3 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} ইসলাহ · {t("দ্বীনি জীবনের সঙ্গী", "Companion for Islamic Life")}
          </p>
          <Link href="/privacy-policy" className="hover:text-ink">
            {t("গোপনীয়তা নীতি", "Privacy policy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

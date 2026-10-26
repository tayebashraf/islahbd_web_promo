"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Check, ChevronDown, Download, Globe, Menu, Moon, Search, Sun, X } from "lucide-react";
import { LANGS, useLang } from "@/components/providers/lang-provider";
import { usePlayer } from "@/components/player/player-provider";
import { PlayerBar } from "@/components/player/player-bar";
import { ALL_LINKS, BOTTOM_NAV, LINKS, MORE, NAV_GROUPS, TOP_NAV, isActive, type NavLink } from "@/lib/nav";
import { BLOG_CATEGORIES, BLOG_NAV_ITEMS, isBlogTabActive } from "@/components/sirat/layout/BlogNav";
import { fetchSiratTopics } from "@/lib/sirat/sirat-api";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { SOCIAL } from "@/data/paribar";
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
  const router = useRouter();
  const { current } = usePlayer();
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

  const ctx = useMemo(() => ({ openMore: () => router.push("/more"), openSearch: () => setPalette(true) }), [router]);

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

        <BottomNav pathname={pathname} onNavigate={() => {}} />
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

  // `!`: the global `* { border-color }` rule is unlayered and would beat a plain utility.
  return (
    <header className={cn("nav-blur sticky top-0 z-40 border-b transition-colors", scrolled ? "border-line!" : "border-transparent!")}>
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
          {pathname.startsWith("/blog") && <BlogMenu />}
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

/**
 * Blog pages: hamburger that opens the topic filters as a side sheet. Portaled
 * to <body> because the header's backdrop-filter would trap a fixed sheet.
 */
function BlogMenu() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("all");
  const [profiles, setProfiles] = useState<{ slug: string; name: string; avatar?: string | null; icon?: string }[]>(() =>
    BLOG_CATEGORIES.slice(1).map(({ slug, name }) => ({ slug, name })),
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const show = () => {
    setTopic(window.location.pathname === "/blog" ? new URLSearchParams(window.location.search).get("topic") ?? "all" : "");
    setOpen(true);
    // Profiles are managed from the admin apps; refresh the list on each open.
    fetchSiratTopics().then((list) => list.length && setProfiles(list));
  };

  return (
    <>
      <RoundButton label={t("বিষয়ভিত্তিক শ্রেণী", "Topics")} onClick={show} aria-expanded={open}>
        <Menu className="h-[19px] w-[19px]" />
      </RoundButton>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  key="scrim"
                  className="fixed inset-0 z-[70] bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                />
                <motion.aside
                  key="sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("বিষয়ভিত্তিক শ্রেণী", "Topics")}
                  className="fixed inset-y-0 end-0 z-[71] flex w-[min(320px,86vw)] flex-col bg-panel font-kalpurush shadow-[var(--shadow-float)]"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex h-16 items-center justify-between border-b border-line px-5">
                    <p className="text-[17px] font-semibold text-ink">{t("বিষয়ভিত্তিক শ্রেণী", "Topics")}</p>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label={t("বন্ধ করুন", "Close")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-panel-2 text-ink-2 hover:text-ink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-3">
                    <ul className="space-y-1">
                      {[BLOG_CATEGORIES[0], ...profiles].map((c) => {
                        const on = c.slug === topic;
                        const Icon = BLOG_CATEGORIES.find((k) => k.slug === c.slug)?.icon;
                        const avatar = "avatar" in c ? c.avatar : null;
                        const emoji = "icon" in c && typeof c.icon === "string" && c.icon ? c.icon : "📖";
                        return (
                          <li key={c.slug}>
                            <Link
                              href={c.slug === "all" ? "/blog" : `/blog?topic=${c.slug}`}
                              onClick={() => setOpen(false)}
                              aria-current={on ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] transition",
                                on ? "bg-brand-soft font-semibold text-brand" : "text-ink hover:bg-panel-2",
                              )}
                            >
                              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full", on ? "bg-brand text-white" : "bg-icon-bg text-brand")}>
                                {avatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URL, any host
                                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                                ) : Icon ? (
                                  <Icon className="h-4 w-4" />
                                ) : (
                                  <span className="text-base">{emoji}</span>
                                )}
                              </span>
                              {c.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
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

function BottomNav({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const { t } = useLang();
  const isBlog = pathname.startsWith("/blog");
  const navList = isBlog ? BLOG_NAV_ITEMS : BOTTOM_NAV;

  return (
    <nav
      aria-label={t(isBlog ? "ব্লগ নেভিগেশন" : "নিচের নেভিগেশন", isBlog ? "Blog navigation" : "Bottom navigation")}
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-canvas-2/95 pb-safe backdrop-blur-xl lg:hidden font-kalpurush"
    >
      <ul
        className={cn(
          "mx-auto grid h-16 max-w-lg",
          navList.length === 4 ? "grid-cols-4" : "grid-cols-5"
        )}
      >
        {navList.map((l) => {
          const active = isBlog ? isBlogTabActive(pathname, l.href) : isActive(pathname, l.href);
          const Icon = l.icon;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className="tap flex h-full w-full flex-col items-center justify-center transition-transform active:scale-95"
              >
                <span className="relative flex h-8 w-14 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId={isBlog ? "blog-bottom-pill" : "bottom-pill"}
                      className="absolute inset-0 rounded-full bg-brand-soft"
                      transition={{ type: "spring", damping: 30, stiffness: 380 }}
                    />
                  )}
                  <Icon
                    className={cn("relative h-[22px] w-[22px]", active ? "text-brand" : "text-ink-3")}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                </span>
                <span className={cn("mt-0.5 text-[11.5px] leading-tight", active ? "font-semibold text-brand" : "text-ink-3")}>
                  {t(l.bn, l.en)}
                </span>
              </Link>
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

const SOCIAL_ICONS: { name: string; url: string; path: string }[] = [
  {
    name: "YouTube",
    url: SOCIAL[0].url,
    path: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15V9l5.8 3-5.8 3Z",
  },
  {
    name: "Facebook",
    url: SOCIAL[1].url,
    path: "M13.5 21.9v-7.7h2.6l.4-3h-3V9.3c0-.9.3-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.7h3.1Z",
  },
  {
    name: "Telegram",
    url: SOCIAL[2].url,
    path: "M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.4ZM9.2 14.1l9-5.7c.4-.3.8-.1.5.2l-7.7 7-.3 3.2-1.5-4.7Z",
  },
  {
    name: "WhatsApp",
    url: SOCIAL[3].url,
    path: "M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm5.7 13.8c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.3.1.2.1.7-.1 1.3Z",
  },
];

function Footer() {
  const { t } = useLang();
  const cols: { title: string; links: NavLink[] }[] = [
    { title: t("জনপ্রিয় পেজ", "Popular pages"), links: [LINKS.boyan, LINKS.quran, LINKS.dua, LINKS.prayer, LINKS.amal] },
    { title: t("প্রতিষ্ঠান", "Institution"), links: [LINKS.about, LINKS.paribar, LINKS.member, LINKS.khidmat, LINKS.notices, LINKS.blog] },
  ];
  return (
    <footer className="mt-auto border-t border-line bg-canvas-2">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-6 gap-y-6 px-4 pt-7 pb-6 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] lg:gap-10 lg:py-12 lg:px-8">
        {/* Brand + socials: one tight row on phones */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Logo />
            <ul className="flex items-center gap-1.5 lg:mt-5 lg:gap-2">
              {SOCIAL_ICONS.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel text-ink-2 transition hover:border-brand hover:bg-brand hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-ink-3 lg:mt-4 lg:line-clamp-none lg:max-w-sm lg:text-sm lg:text-ink-2">
            {t(
              "ইসলাহ — দ্বীনি জীবনের সঙ্গী। বয়ান, কুরআন, দোয়া, আমল ও নামাজের সময় এক জায়গায়।",
              "Islah is your companion for Islamic life — talks, Quran, duas, amal and prayer times in one place.",
            )}
          </p>
        </div>

        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="mb-2 text-[13px] font-semibold tracking-wide text-ink lg:mb-3 lg:text-[15px]">{c.title}</p>
            <ul className="space-y-1.5 lg:space-y-2">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-ink-2 transition hover:text-brand">
                    {t(l.bn, l.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 lg:col-span-1">
          <p className="mb-2 hidden text-[15px] font-semibold text-ink lg:mb-3 lg:block">{t("অ্যাপ ডাউনলোড", "Get the app")}</p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" dir="ltr" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-3 text-[13px] font-medium text-canvas transition hover:opacity-90 lg:justify-start">
              <Download className="h-4 w-4" /> Google Play
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" dir="ltr" className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-panel px-3 text-[13px] font-medium text-ink transition hover:border-brand/40 lg:justify-start">
              <Download className="h-4 w-4 text-brand" /> App Store
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 py-3.5 text-xs text-ink-3 sm:px-6 lg:px-8">
          <p className="truncate">
            © {new Date().getFullYear()} ইসলাহ · {t("দ্বীনি জীবনের সঙ্গী", "Companion for Islamic Life")}
          </p>
          <Link href="/privacy-policy" className="shrink-0 hover:text-ink">
            {t("গোপনীয়তা নীতি", "Privacy policy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

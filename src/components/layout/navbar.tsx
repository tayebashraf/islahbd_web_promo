"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLang } from "@/components/providers/lang-provider";
import { cn } from "@/lib/utils";
import { Menu, X, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", bn: "হোম", en: "Home" },
  { href: "/blog", bn: "ব্লগ", en: "Blog" },
  { href: "/prayer-times", bn: "নামাজের সময়", en: "Prayer Times" },
  { href: "/#features", bn: "ফিচার", en: "Features" },
  { href: "/#about", bn: "আমাদের সম্পর্কে", en: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "nav-blur shadow-sm border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group focus-ring rounded-lg" aria-label="islahbd home">
            <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="font-bold text-sm text-[#111827] leading-none">ই</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              islahbd
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all focus-ring"
              >
                {t(link.bn, link.en)}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all focus-ring"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "bn" ? "EN" : "বাং"}
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all focus-ring"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* CTA */}
            <Button size="sm" className="hidden sm:flex">
              <span>{t("অ্যাপ পান", "Get App")}</span>
            </Button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all focus-ring"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl rounded-b-2xl shadow-xl pb-4">
            <div className="px-2 pt-3 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  {t(link.bn, link.en)}
                </Link>
              ))}
            </div>
            <div className="mx-4 mt-3 flex items-center gap-2">
              <Button size="sm" className="flex-1">
                {t("অ্যাপ পান", "Get App")}
              </Button>
              <button
                onClick={() => setLang(lang === "bn" ? "en" : "bn")}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border border-border hover:bg-secondary transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === "bn" ? "EN" : "বাং"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bookmark, Search, Globe, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogNavItem {
  href: string;
  bn: string;
  en: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  badge?: string;
}

export const BLOG_NAV_ITEMS: BlogNavItem[] = [
  { href: "/", bn: "ইসলাহ ওয়েব", en: "Islah Web", icon: Globe },
  { href: "/blog", bn: "নিউজফিড", en: "Newsfeed", icon: BookOpen },
  { href: "/blog/bookmarks", bn: "সংরক্ষিত", en: "Saved", icon: Bookmark },
  { href: "/blog/search", bn: "অনুসন্ধান", en: "Search", icon: Search },
];

export function isBlogTabActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  if (href === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/articles");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sleek Desktop & Tablet Blog Navigation Bar
 * Provides instant tab switching across all blog sub-routes.
 */
export default function BlogNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("w-full mb-5 font-kalpurush hidden sm:block", className)}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 sm:p-2 rounded-2xl bg-panel border border-line shadow-xs">
        {/* Navigation Tabs */}
        <nav aria-label="ব্লগ নেভিগেশন" className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {BLOG_NAV_ITEMS.map((item) => {
            const active = isBlogTabActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition active:scale-95",
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "text-ink-2 hover:text-ink hover:bg-panel-2"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-white" : "text-brand")} />
                <span>{item.bn}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 text-[11px] font-bold rounded-full font-num",
                      active ? "bg-white/20 text-white" : "bg-brand-soft text-brand"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to Islah Main App pill */}
        <div className="flex items-center justify-end px-1 sm:px-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-3 hover:text-brand hover:bg-brand-soft/60 transition"
            title="ইসলাহ প্রধান ড্যাশবোর্ডে ফিরে যান"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>মূল অ্যাপ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

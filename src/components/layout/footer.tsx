"use client";
import Link from "next/link";
import { useLang } from "@/components/providers/lang-provider";
import { SITE_NAME } from "@/lib/constants";
import { Mail } from "lucide-react";

function IconFacebook({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function IconTwitter({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function IconInstagram({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
}
function IconYoutube({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
}

const FOOTER_LINKS = {
  app: {
    bn: "অ্যাপ",
    en: "App",
    links: [
      { href: "/#features", bn: "ফিচারসমূহ", en: "Features" },
      { href: "/#download", bn: "ডাউনলোড", en: "Download" },
      { href: "/#waitlist", bn: "ওয়েটলিস্ট", en: "Waitlist" },
    ],
  },
  content: {
    bn: "কন্টেন্ট",
    en: "Content",
    links: [
      { href: "/blog", bn: "ব্লগ", en: "Blog" },
      { href: "/prayer-times", bn: "নামাজের সময়", en: "Prayer Times" },
      { href: "/blog/category/quran", bn: "কুরআন", en: "Quran" },
    ],
  },
  company: {
    bn: "কোম্পানি",
    en: "Company",
    links: [
      { href: "/#about", bn: "আমাদের সম্পর্কে", en: "About" },
      { href: "/privacy", bn: "গোপনীয়তা নীতি", en: "Privacy Policy" },
      { href: "/terms", bn: "শর্তাবলী", en: "Terms" },
      { href: "/contact", bn: "যোগাযোগ", en: "Contact" },
    ],
  },
};

const SOCIAL = [
  { href: "#", icon: IconFacebook, label: "Facebook" },
  { href: "#", icon: IconTwitter, label: "Twitter / X" },
  { href: "#", icon: IconInstagram, label: "Instagram" },
  { href: "#", icon: IconYoutube, label: "YouTube" },
];

export function Footer() {
  const { t, lang, setLang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card" role="contentinfo">
      {/* Islamic pattern top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center shadow-md">
                <span className="font-bold text-sm text-[#111827] leading-none">ই</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">islahbd</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              {t(
                "মারকাজুল ইহসানের অফিশিয়াল ইসলামিক অ্যাপ। আপনার দৈনন্দিন ইসলামিক জীবনকে সহজ ও সুন্দর করতে প্রতিশ্রুতিবদ্ধ।",
                "Markazul Ihsan's official Islamic app. Committed to making your daily Islamic life easier and more beautiful."
              )}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold/50 hover:bg-gold/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map((col) => (
            <div key={col.en}>
              <h3 className="font-semibold text-sm text-foreground mb-4">{t(col.bn, col.en)}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground hover:text-gold transition-colors"
                    >
                      {t(link.bn, link.en)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} {SITE_NAME}.{" "}
            {t("সর্বস্বত্ব সংরক্ষিত", "All rights reserved")}.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:info@islahbd.com" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-3.5 h-3.5" />
              info@islahbd.com
            </a>
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

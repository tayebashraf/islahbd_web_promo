"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import type { BlogPost } from "@/lib/blog-data";
import { Clock, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  posts: BlogPost[];
  categories: { slug: string; bn: string; en: string }[];
}

export function BlogListClient({ posts, categories }: Props) {
  const { t, lang } = useLang();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const q = query.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.titleBn.includes(q) || p.tags.some((tag) => tag.includes(q));
    return matchCat && matchSearch;
  });

  const featured = filtered.find((p) => p.featured);
  const featuredSlug = featured?.slug;
  const rest = filtered.filter((p) => p.slug !== featuredSlug);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t("নিবন্ধ", "Articles")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            {t(
              <>ইসলামিক <span className="text-gold">ব্লগ</span></>,
              <>Islamic <span className="text-gold">Blog</span></>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t(
              "গবেষণাভিত্তিক ইসলামিক নিবন্ধ — কুরআন, হাদিস, ফিকহ, রমজান এবং আরও।",
              "Research-based Islamic articles — Quran, Hadith, Fiqh, Ramadan and more."
            )}
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("নিবন্ধ খুঁজুন...", "Search articles...")}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "gradient-gold text-[#111827] shadow-md"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {t("সব", "All")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? "gradient-gold text-[#111827] shadow-md"
                  : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {lang === "bn" ? cat.bn : cat.en}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className={`relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br ${featured.coverGradient} min-h-[320px] flex items-end p-8 sm:p-12`}>
                {/* Content */}
                <div className="relative z-10 max-w-2xl">
                  <Badge variant="gold" className="mb-4">
                    {t("বিশেষ নিবন্ধ", "Featured")}
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 leading-tight group-hover:text-gold/90 transition-colors">
                    {lang === "bn" ? featured.titleBn : featured.title}
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                    {lang === "bn" ? featured.excerptBn : featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readingTime} {t("মিনিট", "min")}</span>
                    <span className="flex items-center gap-1.5 text-gold group-hover:gap-3 transition-all">{t("পড়ুন", "Read")} <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>

                {/* Arabic quote */}
                {featured.arabicQuote && (
                  <p className="absolute top-8 right-8 font-arabic text-white/10 text-3xl leading-loose">{featured.arabicQuote}</p>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </article>
            </Link>
          </motion.div>
        )}

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full rounded-2xl border border-border bg-card overflow-hidden card-hover">
                  <div className={`h-44 bg-gradient-to-br ${post.coverGradient} relative flex items-end p-4`}>
                    {post.arabicQuote && (
                      <p className="font-arabic text-white/20 text-lg absolute top-3 right-3">{post.arabicQuote}</p>
                    )}
                    <Badge variant="gold" className="text-xs">
                      {lang === "bn" ? post.categoryBn : post.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-base text-foreground mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {lang === "bn" ? post.titleBn : post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {lang === "bn" ? post.excerptBn : post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime} {t("মিনিট", "min")}</span>
                      <span className="flex items-center gap-1 text-gold group-hover:gap-2 transition-all">
                        {t("পড়ুন", "Read")} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">{t("কোনো নিবন্ধ পাওয়া যায়নি।", "No articles found.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

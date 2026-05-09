"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PREVIEW_POSTS = BLOG_POSTS.slice(0, 3);

export function BlogPreview() {
  const { t, lang } = useLang();

  return (
    <section className="py-24 lg:py-32 bg-card/20" aria-labelledby="blog-preview-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-12 flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
              {t("ব্লগ", "Blog")}
            </span>
            <h2 id="blog-preview-heading" className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              {t(
                <>সর্বশেষ <span className="text-gold">নিবন্ধ</span></>,
                <>Latest <span className="text-gold">Articles</span></>
              )}
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog" className="gap-2">
              {t("সব দেখুন", "View All")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREVIEW_POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full rounded-2xl border border-border bg-card overflow-hidden card-hover">
                  {/* Cover */}
                  <div className={`relative h-48 bg-gradient-to-br ${post.coverGradient} flex items-end p-5`}>
                    {/* Arabic quote overlay */}
                    {post.arabicQuote && (
                      <p className="font-arabic text-white/30 text-xl absolute top-4 right-4 leading-loose">{post.arabicQuote}</p>
                    )}
                    {/* Category */}
                    <Badge variant="gold" className="text-xs">
                      {lang === "bn" ? post.categoryBn : post.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {lang === "bn" ? post.titleBn : post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {lang === "bn" ? post.excerptBn : post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} {t("মিনিট", "min read")}
                      </span>
                      <span className="flex items-center gap-1 text-gold group-hover:gap-2 transition-all">
                        {t("পড়ুন", "Read")}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

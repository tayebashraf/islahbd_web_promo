"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/lang-provider";
import type { BlogPost } from "@/lib/blog-data";
import { Clock, ArrowLeft, Share2, Bookmark, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostClient({ post, relatedPosts }: Props) {
  const { t, lang } = useLang();
  const [progress, setProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const share = async () => {
    const url = window.location.href;
    const title = lang === "bn" ? post.titleBn : post.title;
    if (navigator.share) await navigator.share({ title, url });
    else await navigator.clipboard.writeText(url);
  };

  const content = lang === "bn" ? (post.contentBn || post.content || post.excerptBn) : (post.content || post.excerpt);
  const paragraphs = content?.split("\n\n") || [];

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-gold to-gold-light z-[100] transition-all duration-100"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-label="Reading progress"
      />

      <article className="min-h-screen pt-24">
        {/* Hero */}
        <div className={`relative bg-gradient-to-br ${post.coverGradient} py-20 px-4`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t("ব্লগে ফিরুন", "Back to Blog")}
              </Link>

              {post.arabicQuote && (
                <p className="font-arabic text-white/30 text-3xl text-right mb-6 leading-loose">{post.arabicQuote}</p>
              )}

              <Badge variant="gold" className="mb-4">{lang === "bn" ? post.categoryBn : post.category}</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-4 text-balance">
                {lang === "bn" ? post.titleBn : post.title}
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {lang === "bn" ? post.excerptBn : post.excerpt}
              </p>
              <div className="flex items-center gap-4 flex-wrap text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-gold/30 flex items-center justify-center text-xs font-bold text-gold">
                    {post.author[0]}
                  </div>
                  {post.author}
                </span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readingTime} {t("মিনিট পাঠ", "min read")}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-end gap-2 mb-8">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center ${
                bookmarked ? "border-gold/40 bg-gold/10 text-gold" : "border-border text-muted-foreground hover:bg-secondary"
              }`}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={share}
              className="w-9 h-9 rounded-xl border border-border text-muted-foreground hover:bg-secondary transition-all flex items-center justify-center"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="reading-mode prose-content space-y-5">
            {paragraphs.map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h3 key={i} className="text-xl font-display font-bold text-foreground mt-8">{para.slice(2, -2)}</h3>;
              }
              if (/^\d+\.\s\*\*/.test(para)) {
                const match = para.match(/^(\d+)\.\s\*\*(.+?)\*\*:?\s*([\s\S]*)/);
                if (match) {
                  return (
                    <div key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/15 text-gold text-sm font-bold flex items-center justify-center mt-0.5">{match[1]}</span>
                      <div>
                        <strong className="text-foreground font-semibold">{match[2]}</strong>
                        {match[3] && <span className="text-muted-foreground">: {match[3]}</span>}
                      </div>
                    </div>
                  );
                }
              }
              return <p key={i} className="text-foreground leading-[1.9] text-[1.05rem]">{para}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                {t("সংশ্লিষ্ট নিবন্ধ", "Related Articles")}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                    <div className="rounded-xl border border-border bg-card overflow-hidden card-hover">
                      <div className={`h-28 bg-gradient-to-br ${related.coverGradient}`} />
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2 mb-1">
                          {lang === "bn" ? related.titleBn : related.title}
                        </h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {related.readingTime} {t("মি", "min")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back CTA */}
          <div className="text-center mt-16">
            <Button variant="outline" asChild>
              <Link href="/blog" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("সব নিবন্ধ দেখুন", "View All Articles")}
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}

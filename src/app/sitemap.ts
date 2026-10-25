import { MetadataRoute } from "next";
import { sampleArticles } from "@/lib/sirat/sampleData";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog/topics`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/blog/authors`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/prayer-times`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    ...["/boyan", "/nasheed", "/clips", "/quran", "/amal", "/malfuzat", "/notices", "/listen", "/fatwa", "/gallery", "/library"].map(
      (path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 }),
    ),
  ];

  const blogRoutes: MetadataRoute.Sitemap = sampleArticles.map((post) => ({
    url: `${SITE_URL}/blog/articles/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: post.featured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}

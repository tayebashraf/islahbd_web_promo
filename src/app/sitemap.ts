import { MetadataRoute } from "next";
import { sampleArticles, sampleTopics, sampleAuthors } from "@/lib/sirat/sampleData";
import { QURAN_SURAHS } from "@/lib/quran-surahs";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Core High-Priority Pages
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/boyan`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE_URL}/quran`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE_URL}/prayer-times`, lastModified: now, changeFrequency: "hourly", priority: 0.95 },
    { url: `${SITE_URL}/dua`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/amal`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ramadan`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/lifetime-member`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  // 2. Feature & Utility Pages
  const featurePages = [
    "/nasheed",
    "/hamdnaat",
    "/tasbeeh",
    "/qibla",
    "/zakat",
    "/fatwa",
    "/malfuzat",
    "/quran/audio",
    "/quran/hafezi",
    "/quran/search",
    "/paribar",
    "/hajj",
    "/holy-sites",
    "/munajat",
    "/poems",
    "/clips",
    "/shortclips",
    "/live",
    "/listen",
    "/library",
    "/about",
    "/khidmat",
    "/khidmat-fund",
    "/notices",
    "/gallery",
    "/more",
  ];

  const featureRoutes: MetadataRoute.Sitemap = featurePages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. All 114 Quran Surahs
  const topSurahNumbers = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];
  const quranRoutes: MetadataRoute.Sitemap = QURAN_SURAHS.map((surah) => ({
    url: `${SITE_URL}/quran/${surah.number}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: topSurahNumbers.includes(surah.number) ? 0.9 : 0.8,
  }));

  // 4. Sirat / Blog Articles
  const blogArticleRoutes: MetadataRoute.Sitemap = sampleArticles.map((post: any) => ({
    url: `${SITE_URL}/blog/articles/${post.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: post.featured ? 0.9 : 0.75,
  }));

  // 5. Sirat / Blog Topics
  const blogTopicRoutes: MetadataRoute.Sitemap = sampleTopics.map((topic: any) => ({
    url: `${SITE_URL}/blog/topics/${topic.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 6. Sirat / Blog Authors
  const blogAuthorRoutes: MetadataRoute.Sitemap = sampleAuthors.map((author: any) => ({
    url: `${SITE_URL}/blog/authors/${author.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // 7. Policy & Static Blog utility pages
  const staticBlogRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog/guidelines`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog/search`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...coreRoutes,
    ...featureRoutes,
    ...quranRoutes,
    ...blogArticleRoutes,
    ...blogTopicRoutes,
    ...blogAuthorRoutes,
    ...staticBlogRoutes,
  ];
}

import { API_BASE } from "@/lib/api";
import {
  sampleArticles,
  sampleAuthors,
  sampleTopics,
  sampleApplications,
  samplePlatformSettings,
  sampleClickAnalytics,
  sampleTopicViewsAnalytics,
  sampleFeedbackList,
} from "./sampleData";

export interface SiratTopicItem {
  id: string | number;
  slug: string;
  name: string;
  nameEn: string;
  category: "historical" | "thematic";
  categoryName: string;
  description: string;
  articleCount: number;
  icon: string;
  gradient: string;
  tags: string[];
  order: number;
}

export interface SiratAuthorItem {
  id: string;
  authorId: string;
  name: string;
  nameEn?: string;
  email?: string;
  phone?: string;
  designation: string;
  institution?: string;
  avatar?: string | null;
  bio: string;
  expertise?: string;
  role: string;
  isVerified: boolean;
  writerStatus: string;
  articleCount: number;
  totalViews?: number;
  totalSalawat?: number;
  badges?: string[];
  joinedDate?: string;
}

export interface SiratArticleItem {
  id: string | number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content?: string;
  coverImageURL?: string | null;
  topicSlug: string;
  topicName: string;
  authorId: string;
  authorName: string;
  status: string;
  featured?: boolean;
  readingTime: number;
  jazakallahCount: number;
  salawatCount: number;
  viewCount?: number;
  commentCount?: number;
  quizData?: any;
  quoteData?: any;
  references?: string[];
  sources?: string[];
  tags?: string[];
  publishedAt?: any;
}

export interface SiratCommentItem {
  id: number | string;
  authorName: string;
  authorEmail?: string;
  text: string;
  likes: number;
  createdAt?: string;
  replies?: SiratCommentItem[];
}

// In-Memory store for offline state updates
let localArticles: any[] = [...sampleArticles];

/**
 * A page of the quiz bank for the news feed (empty while the admins have the
 * quiz switched off). `every`: posts the feed shows between two questions.
 */
export async function fetchSiratQuizFeed(
  offset = 0,
  limit = 10
): Promise<{ every: number; total: number; results: SiratArticleItem[] }> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/quiz-items/feed/?offset=${offset}&limit=${limit}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.results)) return { every: data.every || 2, total: data.total || 0, results: data.results };
    }
  } catch (err) {
    // Network fallback
  }
  return { every: 2, total: 0, results: [] };
}

export async function fetchSiratArticles(params: {
  topicSlug?: string;
  authorId?: string;
  status?: string;
  featured?: boolean;
} = {}): Promise<SiratArticleItem[]> {
  try {
    const query = new URLSearchParams();
    if (params.topicSlug) query.append("topicSlug", params.topicSlug);
    if (params.authorId) query.append("authorId", params.authorId);
    if (params.status) query.append("status", params.status);
    if (params.featured !== undefined) query.append("featured", String(params.featured));

    const res = await fetch(`${API_BASE}/api/sirat/articles/?${query.toString()}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      // An empty list is a real answer (e.g. a new profile with no posts yet).
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    // Network fallback
  }

  // No demo posts: when the API is unreachable the feed is simply empty.
  return [];
}

export async function fetchSiratArticleBySlug(slug: string): Promise<SiratArticleItem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/articles/${slug}/`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Network fallback
  }

  return null;
}

export async function recordJazakallah(slug: string, deviceId: string = "web-client"): Promise<{ jazakallahCount: number }> {
  // Update local memory
  const art = localArticles.find((a) => a.slug === slug);
  if (art) {
    art.jazakallahCount = (art.jazakallahCount || 0) + 1;
  }

  try {
    const res = await fetch(`${API_BASE}/api/sirat/articles/${slug}/jazakallah/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // local fallback
  }

  return { jazakallahCount: art ? art.jazakallahCount : 1 };
}

export async function recordSalawat(slug: string, deviceId: string = "web-client"): Promise<{ salawatCount: number }> {
  const art = localArticles.find((a) => a.slug === slug);
  if (art) {
    art.salawatCount = (art.salawatCount || 0) + 1;
  }

  try {
    const res = await fetch(`${API_BASE}/api/sirat/articles/${slug}/salawat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // local fallback
  }

  return { salawatCount: art ? art.salawatCount : 1 };
}

export async function recordArticleView(slug: string): Promise<{ viewCount: number }> {
  const art = localArticles.find((a) => a.slug === slug);
  if (art) {
    art.viewCount = (art.viewCount || 0) + 1;
  }

  try {
    const res = await fetch(`${API_BASE}/api/sirat/articles/${slug}/view/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // local fallback
  }

  return { viewCount: art ? art.viewCount || 1 : 1 };
}

/** Blog-wide settings saved from the admin panel (announcement banner, ...). */
export interface SiratPlatformSettings {
  announcementActive?: boolean;
  announcementText?: string;
  announcementLink?: string;
}

export async function fetchSiratPlatformSettings(): Promise<SiratPlatformSettings> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/settings/platform/`);
    if (res.ok) return (await res.json()).data ?? {};
  } catch {}
  return {};
}

export async function fetchSiratTopics(): Promise<SiratTopicItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/topics/`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {}

  return [];
}

export async function fetchSiratAuthors(): Promise<SiratAuthorItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/authors/`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {}

  return sampleAuthors as any;
}

export async function fetchSiratAuthorById(id: string): Promise<SiratAuthorItem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/authors/${id}/`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const author = sampleAuthors.find((a: any) => a.id === id || a.authorId === id || a.uid === id);
  return (author as any) || null;
}

export async function submitSiratApplication(data: any): Promise<{ ok: boolean; applicationId: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/applications/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const resData = await res.json();
      return { ok: true, applicationId: resData.applicationId };
    }
  } catch (err) {}

  const mockId = `SRT-APP-${Date.now().toString(36).toUpperCase()}`;
  return { ok: true, applicationId: mockId };
}

export async function submitSiratFeedback(data: any): Promise<{ ok: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/feedback/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return { ok: true };
  } catch (err) {}

  return { ok: true };
}

export async function fetchSiratComments(slug: string): Promise<SiratCommentItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/articles/${slug}/comments/`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  return [];
}

export async function postSiratComment(
  slug: string,
  commentData: { authorName: string; text: string; authorEmail?: string; parent?: number | string },
): Promise<(SiratCommentItem & { status?: string }) | null> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/articles/${slug}/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  // Nothing is faked: the caller reports the failure.
  return null;
}

export async function fetchSiratAnalytics(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/sirat/analytics/`);
    if (res.ok) return await res.json();
  } catch (err) {}

  return {
    articlesCount: sampleArticles.length,
    authorsCount: sampleAuthors.length,
    topicsCount: sampleTopics.length,
    totalJazakallah: 43520,
    totalSalawat: 18450,
    totalViews: 125000,
    topicsBreakdown: sampleTopicViewsAnalytics,
    clickAnalytics: sampleClickAnalytics,
  };
}

// Typed access to the islahbd Django API — the same endpoints the mobile app uses.
// Server components call the fetchers below (ISR-cached); client components may
// call them too since the API sends `Access-Control-Allow-Origin: *`.

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.islahbd.com";

export interface Boyan {
  id: number;
  title: string;
  speaker: string;
  category: string;
  audioUrl: string;
  duration: string;
  uploadDate: string;
  location: string;
}

export interface BoyanCategory {
  id: number;
  name: string;
  order: number;
}

export interface Nasheed {
  id: number;
  title: string;
  type: "audio" | "video";
  audioUrl: string | null;
  youtubeId: string | null;
  artist: string | null;
  lyricist: string | null;
  composer: string | null;
  writingPlace: string | null;
  writingDate: string | null;
  createdAt: string;
}

export interface Clip {
  id: number;
  title: string;
  audioUrl: string | null;
  youtubeId: string | null;
  createdAt: string;
}

export interface Malfuz {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  reactions: Record<string, number>;
}

export interface Notice {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  showOnHome: boolean;
}

export type AmalSection = "amal" | "wazifa" | "sunnat" | "fazilat";

export interface AmalText {
  name?: string;
  arabic?: string;
  text?: string;
  type?: string;
  recite_count?: string;
  bangla_translation?: string;
  pronunciation?: string;
}

export interface AmalItem {
  id: number;
  serial: string;
  title: string;
  fazilat: string;
  reference: string;
  narrator: string;
  method: string;
  amalText: AmalText[];
  order: number;
  category: number;
}

export interface AmalCategory {
  id: number;
  section: AmalSection;
  title: string;
  description: string;
  order: number;
  itemCount: number;
  items: AmalItem[];
}

export interface GalleryAlbum {
  id: number;
  title: string;
  coverUrl: string | null;
  imageCount: number;
  createdAt: string;
  photos: { id: number; url: string; order: number }[];
}

export interface Wallpaper {
  id: number;
  url: string;
  title: string;
  createdAt: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  pdfUrl: string;
  coverUrl: string | null;
  timestamp: string;
}

export interface FatwaCategory {
  id: number;
  name_bn: string;
  order: number;
}

export interface Fatwa {
  id: number | string;
  question: string;
  answer: string;
  category: string;
  questionerName?: string | null;
  isAnonymous?: boolean;
  answeredBy?: string;
  answeredByName?: string;
  createdAt: string;
  views?: number;
}

export interface LiveRecording {
  title: string;
  speaker: string;
  location: string;
  audioUrl: string;
  duration: string;
  durationSeconds?: number;
  startedAt?: string | null;
  endedAt: string | null;
}

export interface LiveStatus {
  isLive: boolean;
  title: string;
  speaker: string;
  location: string;
  listeners: number;
  streamUrl: string;
  hlsUrl?: string;
  startTime?: string | null;
  recording?: LiveRecording | null;
  recordings?: LiveRecording[];
}

async function getJSON<T>(path: string, fallback: T, revalidate = 120): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const getBoyans = () => getJSON<Boyan[]>("/api/audios/?ordering=-uploadDate", []);
export const getBoyanCategories = () => getJSON<BoyanCategory[]>("/api/categories/", [], 3600);
export const getNasheeds = () => getJSON<Nasheed[]>("/api/nasheeds/", []);
export const getClips = () => getJSON<Clip[]>("/api/clips/", []);
export const getNotices = () => getJSON<Notice[]>("/api/notices/?ordering=-date", []);
export const getGalleryAlbums = () => getJSON<GalleryAlbum[]>("/api/gallery-albums/", [], 600);
export const getWallpapers = () => getJSON<Wallpaper[]>("/api/wallpapers/", [], 600);
export const getBooks = () => getJSON<Book[]>("/api/books/", [], 600);
export const getFatwas = () => getJSON<Fatwa[]>("/api/fatwa/", []);
export const getFatwaCategories = () => getJSON<FatwaCategory[]>("/api/fatwa-categories/", [], 3600);
export const getLiveStatus = () => getJSON<LiveStatus | null>("/api/live/status/", null, 15);

export interface MajlisDetail {
  id: number;
  time: string;
  location: string;
  route: string;
  contact: string;
  map: string;
  is_active: boolean;
  order: number;
}

export interface RecurringMajlis {
  id: number;
  title: string;
  /** Dart weekday convention: Mon=1 … Sun=7. */
  dayOfWeek: number;
  /** Nth occurrence(s) of that weekday in the month; empty = every week. */
  weekNumbers: number[];
  is_active: boolean;
  order: number;
  details: MajlisDetail[];
  cancellations: { date: string; detailId?: number | null }[];
}

export const getRecurringMajlis = () => getJSON<RecurringMajlis[]>("/api/live/recurring-majlis/", [], 600);

export async function getAmalCategories(): Promise<AmalCategory[]> {
  const rows = await getJSON<AmalCategory[]>("/api/amal-categories/?ordering=order", [], 600);
  return rows
    .map((c) => ({ ...c, items: [...c.items].sort((a, b) => a.order - b.order) }))
    .sort((a, b) => a.order - b.order);
}

// The raw payload carries `reactionBy` (every device id that reacted) which is
// large and private — strip it before it reaches the client.
export async function getMalfuzat(): Promise<Malfuz[]> {
  const rows = await getJSON<(Malfuz & { reactionBy?: unknown })[]>("/api/malfuzat/?ordering=-createdAt", []);
  return rows.map(({ id, text, author, createdAt, reactions }) => ({
    id,
    text,
    author,
    createdAt,
    reactions: reactions ?? {},
  }));
}

// ── Client-side writes ───────────────────────────────────────────

export function getDeviceId(): string {
  const key = "islahbd-device-id";
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "web-anonymous";
  }
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Device-Id": getDeviceId(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

/** Toggles this device's emoji reaction; returns the new totals. */
export async function toggleMalfuzReaction(malfuzatId: number, emoji: string) {
  const data = await postJSON<{ reactions?: Record<string, number> }>("/api/malfuzat/reaction/", {
    malfuzatId: String(malfuzatId),
    userId: getDeviceId(),
    emoji,
  });
  return data.reactions ?? null;
}

export interface FatwaQuestion {
  name: string;
  isAnonymous: boolean;
  phone?: string;
  email?: string;
  category: string;
  question: string;
}

export function askFatwa(q: FatwaQuestion) {
  return postJSON<unknown>("/api/fatwa/ask/", {
    ...q,
    status: "pending",
    createdAt: new Date().toISOString(),
    deviceId: getDeviceId(),
  });
}

export type ParibarApplication =
  | {
      applicationType: "baiyat";
      name: string;
      fatherName: string;
      education: string;
      profession: string;
      dateOfBirth: string;
      gram: string;
      upojla: string;
      jela: string;
      dakghor: string;
      phone: string;
      familyPhone: string;
      mediumName: string;
      mediumPhone: string;
    }
  | {
      applicationType: "khanqah";
      name: string;
      fatherName: string;
      dateOfBirth: string;
      address: string;
      phone: string;
      familyPhone: string;
      duration: string;
      agreeFood: boolean;
      agreeBedding: boolean;
    };

/** Bay'ah / khanqah stay application — the same endpoint the app posts to. */
export function applyParibar(a: ParibarApplication) {
  return postJSON<unknown>("/api/paribar/apply/", { ...a, deviceId: getDeviceId() });
}

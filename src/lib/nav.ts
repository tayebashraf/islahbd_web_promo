import {
  Award,
  BookHeart,
  BookMarked,
  BookOpen,
  Building2,
  Calculator,
  CalendarDays,
  CircleDot,
  Clock,
  Compass,
  Feather,
  Grid2x2,
  HandHeart,
  HeartHandshake,
  House,
  Image,
  Images,
  Landmark,
  Library,
  MapPinned,
  Megaphone,
  MessageCircleQuestion,
  Mic2,
  MoonStar,
  Music2,
  PenLine,
  Quote,
  Radio,
  ScrollText,
  Sparkle,
  Sparkles,
  Tv,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  bn: string;
  en: string;
  icon: LucideIcon;
  /** One-line description used on feature tiles and the search palette. */
  descBn: string;
  descEn: string;
  /** Feature colour — gives every section a recognisable icon tint. */
  tone: string;
  /** Opens in a new tab (maps, stores). */
  external?: boolean;
  /** Status badge like শীঘ্রই আসছে */
  badgeBn?: string;
  badgeEn?: string;
  comingSoon?: boolean;
}

export const LINKS = {
  home: { href: "/", bn: "হোম", en: "Home", icon: House, descBn: "সব কিছু এক নজরে", descEn: "Everything at a glance", tone: "#417360" },

  // Worship
  prayer: { href: "/prayer-times", bn: "নামাজের সময়", en: "Prayer Times", icon: Clock, descBn: "আজকের ওয়াক্ত ও কাউন্টডাউন", descEn: "Today's times & countdown", tone: "#D97706" },
  qibla: { href: "/qibla", bn: "কিবলা", en: "Qibla", icon: Compass, descBn: "কিবলার দিক নির্ণয়", descEn: "Find the qibla direction", tone: "#0F766E" },
  tasbeeh: { href: "/tasbeeh", bn: "তাসবীহ", en: "Tasbeeh", icon: CircleDot, descBn: "ডিজিটাল তাসবীহ গণনা", descEn: "Digital dhikr counter", tone: "#7C3AED" },
  dua: { href: "/dua", bn: "দোয়া", en: "Duas", icon: HandHeart, descBn: "দৈনন্দিন মাসনূন দোয়া", descEn: "Everyday masnoon duas", tone: "#0EA5E9" },
  sunnat: { href: "/amal?section=sunnat", bn: "সুন্নাত", en: "Sunnah", icon: Sparkle, descBn: "দৈনন্দিন জীবনের সুন্নাত", descEn: "Sunnah of daily life", tone: "#C08A2E" },
  wazifa: { href: "/amal?section=wazifa", bn: "ওয়াজিফা", en: "Wazifa", icon: BookMarked, descBn: "সালেকীনের মামুলাত", descEn: "Daily litanies", tone: "#417360" },
  hajj: { href: "/hajj", bn: "হজ্জ ও উমরাহ", en: "Hajj & Umrah", icon: Landmark, descBn: "ধাপে ধাপে হজ্জ ও উমরাহ গাইড", descEn: "Step-by-step Hajj & Umrah guide", tone: "#92400E" },
  zakat: { href: "/zakat", bn: "যাকাত ক্যালকুলেটর", en: "Zakat Calculator", icon: Calculator, descBn: "শীঘ্রই আসছে", descEn: "Coming soon", tone: "#059669", badgeBn: "শীঘ্রই আসছে", badgeEn: "Coming Soon", comingSoon: true },
  mosque: { href: "https://www.google.com/maps/search/mosque+near+me", bn: "নিকটবর্তী মসজিদ", en: "Nearby Mosque", icon: MapPinned, descBn: "আশেপাশের মসজিদ খুঁজুন", descEn: "Find mosques around you", tone: "#2563EB", external: true },

  // Knowledge
  quran: { href: "/quran", bn: "কুরআন", en: "Quran", icon: BookOpen, descBn: "১১৪ সূরা, প্রিয় ক্বারীর কণ্ঠে", descEn: "114 surahs, your favourite qari", tone: "#059669" },
  amal: { href: "/amal", bn: "আমল", en: "Amal", icon: ScrollText, descBn: "আমল, ওয়াজিফা, সুন্নাত, ফযীলত", descEn: "Amal, wazifa, sunnah, virtues", tone: "#0284C7" },
  fazilat: { href: "/amal?section=fazilat", bn: "ফযীলত", en: "Virtues", icon: Award, descBn: "সূরা ও আমলের ফযীলত", descEn: "Virtues of surahs and deeds", tone: "#9333EA" },
  munajat: { href: "/munajat", bn: "মুনাজাতে মাকবুল", en: "Munajat-e-Maqbul", icon: BookHeart, descBn: "সপ্তাহের সাত মঞ্জিল", descEn: "Seven daily manzils", tone: "#BE185D" },
  ramadan: { href: "/ramadan", bn: "রমজান", en: "Ramadan", icon: MoonStar, descBn: "শীঘ্রই আসছে", descEn: "Coming soon", tone: "#6D28D9", badgeBn: "শীঘ্রই আসছে", badgeEn: "Coming Soon", comingSoon: true },
  calendar: { href: "/calendar", bn: "ইসলামিক ক্যালেন্ডার", en: "Islamic Calendar", icon: CalendarDays, descBn: "হিজরি মাস ও গুরুত্বপূর্ণ দিন", descEn: "Hijri months & key days", tone: "#DC2626" },
  malfuzat: { href: "/malfuzat", bn: "মালফুযাত", en: "Malfuzat", icon: Quote, descBn: "হযরতের বাণী", descEn: "Sayings of the shaykh", tone: "#C08A2E" },
  poems: { href: "/poems", bn: "কবিতা ও কালাম", en: "Poetry", icon: Feather, descBn: "আধ্যাত্মিক কবিতা ও অনুবাদ", descEn: "Spiritual poetry with translation", tone: "#DB2777" },
  fatwa: { href: "/fatwa", bn: "আমার জিজ্ঞাসা", en: "My Queries", icon: MessageCircleQuestion, descBn: "প্রশ্ন করুন, উত্তর পড়ুন", descEn: "Ask and read answers", tone: "#4F46E5" },
  library: { href: "/library", bn: "লাইব্রেরি", en: "Library", icon: Library, descBn: "বই পড়ুন ও ডাউনলোড করুন", descEn: "Read & download books", tone: "#A16207" },
  blog: { href: "/blog", bn: "ইসলাহ ব্লগ", en: "Islah Blog", icon: PenLine, descBn: "সীরাত ও ইসলামিক প্রবন্ধ", descEn: "Islamic articles & sirat", tone: "#2563EB" },

  // Audio & video
  boyan: { href: "/boyan", bn: "বয়ান", en: "Boyan", icon: Mic2, descBn: "ইসলাহী বয়ানের অডিও আর্কাইভ", descEn: "Audio archive of talks", tone: "#0D9488" },
  live: { href: "/listen", bn: "লাইভ", en: "Live", icon: Radio, descBn: "সরাসরি মজলিস শুনুন", descEn: "Listen to the live majlis", tone: "#DC2626" },
  holySites: { href: "/holy-sites", bn: "হারামাইন লাইভ", en: "Makkah & Madinah Live", icon: Tv, descBn: "মক্কা ও মদিনা সরাসরি", descEn: "Live from Makkah & Madinah", tone: "#92400E" },
  nasheed: { href: "/nasheed", bn: "হামদ ও নাত", en: "Hamd & Naat", icon: Music2, descBn: "অডিও ও ভিডিও নাশিদ", descEn: "Audio & video nasheeds", tone: "#E11D48" },
  clips: { href: "/clips", bn: "শর্ট ক্লিপ", en: "Short Clips", icon: Sparkles, descBn: "শীঘ্রই আসছে", descEn: "Coming soon", tone: "#7C3AED", badgeBn: "শীঘ্রই আসছে", badgeEn: "Coming Soon", comingSoon: true },
  gallery: { href: "/gallery", bn: "গ্যালারি", en: "Gallery", icon: Images, descBn: "ছবির অ্যালবাম", descEn: "Photo albums", tone: "#DB2777" },
  wallpaper: { href: "/gallery?tab=wallpapers", bn: "ওয়ালপেপার", en: "Wallpapers", icon: Image, descBn: "ইসলামিক ওয়ালপেপার", descEn: "Islamic wallpapers", tone: "#0891B2" },

  // Institution
  paribar: { href: "/paribar", bn: "পরিবার", en: "Paribar", icon: Users, descBn: "হযরতের পরিচিতি, মিশন ও বাইয়াত", descEn: "The shaykh, his mission & bay'ah", tone: "#BE185D" },
  about: { href: "/about", bn: "মাদরাসা পরিচিতি", en: "About the Madrasa", icon: Building2, descBn: "মারকাযুল ইহসান পরিচিতি", descEn: "About Markazul Ihsan", tone: "#417360" },
  member: { href: "/lifetime-member", bn: "আজীবন সদস্য সম্মেলন", en: "Lifetime Member", icon: HeartHandshake, descBn: "জামেআর পাশে থাকুন", descEn: "Support the Jamia", tone: "#BE185D" },
  khidmat: { href: "/khidmat", bn: "খিদমত ফান্ড", en: "Khidmat Fund", icon: HandHeart, descBn: "তোলাবায়ে কেরামের খেদমত ও যাকাত ফান্ড", descEn: "Student welfare & zakat fund", tone: "#059669" },
  notices: { href: "/notices", bn: "নোটিশ", en: "Notices", icon: Megaphone, descBn: "সর্বশেষ ঘোষণা", descEn: "Latest announcements", tone: "#EA580C" },

  // Dedicated "More" Page
  more: { href: "/more", bn: "অন্যান্য", en: "More", icon: Grid2x2, descBn: "সকল ফিচার ও সেবা", descEn: "All features & services", tone: "#417360" },
} satisfies Record<string, NavLink>;

/** Dedicated "More" page link */
export const MORE = LINKS.more;

/** Mobile bottom bar: Home, Live, Boyan, Paribar, More (অন্যান্য). */
export const BOTTOM_NAV: NavLink[] = [LINKS.home, LINKS.live, LINKS.boyan, LINKS.paribar, MORE];

/** Desktop header links. */
export const TOP_NAV: NavLink[] = [LINKS.home, LINKS.boyan, LINKS.quran, LINKS.dua, LINKS.amal, LINKS.live];

/** Groups follow the app's feature categories. */
export const NAV_GROUPS: { bn: string; en: string; links: NavLink[] }[] = [
  {
    bn: "ইবাদত",
    en: "Worship",
    links: [LINKS.prayer, LINKS.qibla, LINKS.tasbeeh, LINKS.dua, LINKS.sunnat, LINKS.wazifa, LINKS.hajj, LINKS.zakat, LINKS.mosque],
  },
  {
    bn: "জ্ঞান",
    en: "Knowledge",
    links: [LINKS.quran, LINKS.amal, LINKS.fazilat, LINKS.munajat, LINKS.ramadan, LINKS.calendar, LINKS.malfuzat, LINKS.poems, LINKS.fatwa, LINKS.library, LINKS.blog],
  },
  {
    bn: "অডিও ও ভিডিও",
    en: "Audio & video",
    links: [LINKS.boyan, LINKS.live, LINKS.holySites, LINKS.nasheed, LINKS.clips, LINKS.gallery, LINKS.wallpaper],
  },
  { bn: "প্রতিষ্ঠান", en: "Institution", links: [LINKS.paribar, LINKS.about, LINKS.member, LINKS.khidmat, LINKS.notices] },
];

/** Home quick-access tiles; the last slot opens the "More" sheet. */
export const QUICK_LINKS: NavLink[] = [
  LINKS.prayer,
  LINKS.quran,
  LINKS.boyan,
  LINKS.member,
  LINKS.khidmat,
  LINKS.blog,
  LINKS.qibla,
];

export const ALL_LINKS: NavLink[] = [LINKS.home, ...NAV_GROUPS.flatMap((g) => g.links)];

export function isActive(pathname: string, href: string): boolean {
  const path = href.split("?")[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

/** The section a path belongs to, for breadcrumbs. */
export function sectionFor(pathname: string): NavLink | undefined {
  if (pathname.startsWith("/live/")) return LINKS.live;
  if (pathname.startsWith("/hamdnaat/")) return LINKS.nasheed;
  return ALL_LINKS.find((l) => !l.external && !l.href.includes("?") && l.href !== "/" && isActive(pathname, l.href));
}

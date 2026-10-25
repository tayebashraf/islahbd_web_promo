import {
  BookOpen,
  Clock,
  HeartHandshake,
  Images,
  LayoutGrid,
  Library,
  Megaphone,
  MessageCircleQuestion,
  Mic2,
  Music2,
  Quote,
  Radio,
  ScrollText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  bn: string;
  en: string;
  icon: LucideIcon;
  /** One-line description used on feature tiles and the command palette. */
  descBn: string;
  descEn: string;
}

export const LINKS = {
  home: { href: "/", bn: "ড্যাশবোর্ড", en: "Dashboard", icon: LayoutGrid, descBn: "সব কিছু এক নজরে", descEn: "Everything at a glance" },
  live: { href: "/listen", bn: "লাইভ", en: "Live", icon: Radio, descBn: "সরাসরি মজলিস শুনুন", descEn: "Listen to the live majlis" },
  boyan: { href: "/boyan", bn: "বয়ান", en: "Boyan", icon: Mic2, descBn: "ইসলাহী বয়ানের অডিও আর্কাইভ", descEn: "Audio archive of talks" },
  nasheed: { href: "/nasheed", bn: "হামদ ও নাত", en: "Hamd & Naat", icon: Music2, descBn: "অডিও ও ভিডিও নাশিদ", descEn: "Audio & video nasheeds" },
  clips: { href: "/clips", bn: "শর্ট ক্লিপ", en: "Short Clips", icon: Sparkles, descBn: "ছোট ছোট নসীহত", descEn: "Bite-sized reminders" },
  quran: { href: "/quran", bn: "কুরআন", en: "Quran", icon: BookOpen, descBn: "১১৪ সূরা, প্রিয় ক্বারীর কণ্ঠে", descEn: "114 surahs, your favourite qari" },
  prayer: { href: "/prayer-times", bn: "নামাজের সময়", en: "Prayer Times", icon: Clock, descBn: "আজকের ওয়াক্ত ও কাউন্টডাউন", descEn: "Today's times & countdown" },
  amal: { href: "/amal", bn: "আমল ও সুন্নাত", en: "Amal & Sunnah", icon: ScrollText, descBn: "আমল, ওয়াজিফা, সুন্নাত, ফযীলত", descEn: "Amal, wazifa, sunnah, virtues" },
  malfuzat: { href: "/malfuzat", bn: "মালফুযাত", en: "Malfuzat", icon: Quote, descBn: "হযরতের বাণী", descEn: "Sayings of the shaykh" },
  fatwa: { href: "/fatwa", bn: "শরঈ জিজ্ঞাসা", en: "Ask a Mufti", icon: MessageCircleQuestion, descBn: "প্রশ্ন করুন, উত্তর পড়ুন", descEn: "Ask and read answers" },
  notices: { href: "/notices", bn: "নোটিশ", en: "Notices", icon: Megaphone, descBn: "সর্বশেষ ঘোষণা", descEn: "Latest announcements" },
  gallery: { href: "/gallery", bn: "গ্যালারি", en: "Gallery", icon: Images, descBn: "ছবি ও ওয়ালপেপার", descEn: "Photos & wallpapers" },
  library: { href: "/library", bn: "লাইব্রেরি", en: "Library", icon: Library, descBn: "বই পড়ুন ও ডাউনলোড করুন", descEn: "Read & download books" },
  blog: { href: "/blog", bn: "ব্লগ", en: "Blog", icon: ScrollText, descBn: "সীরাত ও গবেষণা নিবন্ধ", descEn: "Sirat & research articles" },
  member: { href: "/lifetime-member", bn: "আজীবন সদস্য", en: "Lifetime Member", icon: HeartHandshake, descBn: "জামেআর পাশে থাকুন", descEn: "Support the Jamia" },
} satisfies Record<string, NavLink>;

/** Pill navigation in the top bar. */
export const TOP_NAV: NavLink[] = [LINKS.home, LINKS.blog, LINKS.boyan, LINKS.nasheed, LINKS.quran, LINKS.amal, LINKS.live];

/** Icon rail on the left, grouped like the reference dashboard. */
export const RAIL_GROUPS: NavLink[][] = [
  [LINKS.home, LINKS.prayer, LINKS.quran, LINKS.boyan],
  [LINKS.nasheed, LINKS.clips, LINKS.live],
  [LINKS.amal, LINKS.malfuzat, LINKS.fatwa, LINKS.notices],
  [LINKS.gallery, LINKS.library, LINKS.blog, LINKS.member],
];

export const ALL_LINKS: NavLink[] = RAIL_GROUPS.flat();

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

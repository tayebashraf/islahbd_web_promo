export const SITE_NAME = "Tazkirah";
export const SITE_TAGLINE = "আপনার ইসলামিক ডিজিটাল সঙ্গী";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tazkirah.com";
export const SITE_DESCRIPTION =
  "Tazkirah — প্রিমিয়াম ইসলামিক লাইফস্টাইল প্ল্যাটফর্ম। নামাজের সময়, কুরআন, হাদিস, দোয়া, তাসবিহ, ইসলামিক ক্যালেন্ডার এবং আরও অনেক কিছু।";

export const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type Prayer = (typeof PRAYERS)[number];

export const PRAYER_ICONS: Record<Prayer, string> = {
  Fajr: "🌙",
  Sunrise: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤",
  Maghrib: "🌆",
  Isha: "🌃",
};

export const BD_CITIES = [
  { name: "Dhaka", nameBn: "ঢাকা", lat: 23.8103, lng: 90.4125 },
  { name: "Chittagong", nameBn: "চট্টগ্রাম", lat: 22.3569, lng: 91.7832 },
  { name: "Sylhet", nameBn: "সিলেট", lat: 24.8949, lng: 91.8687 },
  { name: "Rajshahi", nameBn: "রাজশাহী", lat: 24.3636, lng: 88.6241 },
  { name: "Khulna", nameBn: "খুলনা", lat: 22.8456, lng: 89.5403 },
  { name: "Barisal", nameBn: "বরিশাল", lat: 22.701, lng: 90.3535 },
  { name: "Comilla", nameBn: "কুমিল্লা", lat: 23.4607, lng: 91.1809 },
  { name: "Mymensingh", nameBn: "ময়মনসিংহ", lat: 24.7471, lng: 90.4203 },
];

export const NAV_ITEMS = [
  { href: "/prayer-times", label: "Prayer Times", labelBn: "নামাজের সময়" },
  { href: "/quran", label: "Quran", labelBn: "কুরআন" },
  { href: "/hadith", label: "Hadith", labelBn: "হাদিস" },
  { href: "/dua", label: "Dua", labelBn: "দোয়া" },
  {
    href: "#",
    label: "More",
    labelBn: "আরও",
    children: [
      { href: "/tasbih", label: "Tasbih", labelBn: "তাসবিহ" },
      { href: "/qibla", label: "Qibla", labelBn: "কিবলা" },
      { href: "/calendar", label: "Calendar", labelBn: "ক্যালেন্ডার" },
      { href: "/zakat", label: "Zakat", labelBn: "যাকাত" },
      { href: "/names", label: "Islamic Names", labelBn: "ইসলামিক নাম" },
      { href: "/blog", label: "Articles", labelBn: "নিবন্ধ" },
    ],
  },
];

export const FEATURES = [
  { id: "quran", href: "/quran", label: "Quran", labelBn: "কুরআন", icon: "BookOpen", gradient: "from-emerald-500/20 to-teal-500/10", color: "text-emerald-600 dark:text-emerald-400" },
  { id: "hadith", href: "/hadith", label: "Hadith", labelBn: "হাদিস", icon: "ScrollText", gradient: "from-gold-500/20 to-amber-500/10", color: "text-amber-600 dark:text-amber-400" },
  { id: "dua", href: "/dua", label: "Dua & Dhikr", labelBn: "দোয়া ও যিকর", icon: "HandMetal", gradient: "from-violet-500/20 to-purple-500/10", color: "text-violet-600 dark:text-violet-400" },
  { id: "tasbih", href: "/tasbih", label: "Tasbih", labelBn: "তাসবিহ", icon: "Circle", gradient: "from-rose-500/20 to-pink-500/10", color: "text-rose-600 dark:text-rose-400" },
  { id: "qibla", href: "/qibla", label: "Qibla", labelBn: "কিবলা", icon: "Compass", gradient: "from-sky-500/20 to-blue-500/10", color: "text-sky-600 dark:text-sky-400" },
  { id: "calendar", href: "/calendar", label: "Islamic Calendar", labelBn: "ইসলামিক ক্যালেন্ডার", icon: "Calendar", gradient: "from-orange-500/20 to-amber-500/10", color: "text-orange-600 dark:text-orange-400" },
  { id: "zakat", href: "/zakat", label: "Zakat Calculator", labelBn: "যাকাত ক্যালকুলেটর", icon: "Calculator", gradient: "from-teal-500/20 to-cyan-500/10", color: "text-teal-600 dark:text-teal-400" },
  { id: "names", href: "/names", label: "Islamic Names", labelBn: "ইসলামিক নাম", icon: "Star", gradient: "from-indigo-500/20 to-blue-500/10", color: "text-indigo-600 dark:text-indigo-400" },
  { id: "prayer-times", href: "/prayer-times", label: "Prayer Times", labelBn: "নামাজের সময়", icon: "Clock", gradient: "from-emerald-500/20 to-green-500/10", color: "text-emerald-600 dark:text-emerald-400" },
  { id: "ramadan", href: "/ramadan", label: "Ramadan", labelBn: "রমজান", icon: "Moon", gradient: "from-amber-500/20 to-yellow-500/10", color: "text-amber-600 dark:text-amber-400" },
];

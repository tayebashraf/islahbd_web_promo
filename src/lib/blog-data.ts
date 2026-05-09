export interface BlogPost {
  slug: string;
  title: string;
  titleBn: string;
  excerpt: string;
  excerptBn: string;
  category: string;
  categoryBn: string;
  author: string;
  date: string;
  readingTime: number;
  featured: boolean;
  coverGradient: string;
  arabicQuote?: string;
  tags: string[];
  content?: string;
  contentBn?: string;
}

export const BLOG_CATEGORIES = [
  { slug: "quran", bn: "কুরআনের শিক্ষা", en: "Quranic Teachings" },
  { slug: "hadith", bn: "হাদিস", en: "Hadith" },
  { slug: "fiqh", bn: "মাসআলা", en: "Fiqh" },
  { slug: "amal", bn: "মাসনুন আমল", en: "Sunnah Practices" },
  { slug: "ramadan", bn: "রমজান", en: "Ramadan" },
  { slug: "general", bn: "সাধারণ", en: "General" },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "importance-of-fajr-prayer",
    title: "The Profound Importance of Fajr Prayer in Islam",
    titleBn: "ফজরের নামাজের গুরুত্ব ও ফজিলত",
    excerpt: "Fajr prayer is one of the most emphasized prayers in Islam. Learn why this dawn prayer carries such immense spiritual weight.",
    excerptBn: "ফজরের নামাজ ইসলামের সবচেয়ে গুরুত্বপূর্ণ নামাজগুলির একটি। এই ভোরের নামাজের আধ্যাত্মিক গুরুত্ব সম্পর্কে জানুন।",
    category: "amal",
    categoryBn: "মাসনুন আমল",
    author: "মাওলানা শিব্বীর আহমদ",
    date: "2024-05-01",
    readingTime: 5,
    featured: true,
    coverGradient: "from-amber-900/80 via-amber-800/60 to-orange-900/40",
    arabicQuote: "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ",
    tags: ["prayer", "fajr", "fardh"],
    content: `Fajr prayer — the pre-dawn prayer — holds a position of unique significance in Islam. The Prophet Muhammad (ﷺ) said: "Whoever prays the Fajr prayer is under Allah's protection." This hadith alone illustrates the tremendous reward awaiting those who perform this prayer consistently.\n\nThe Quran specifically mentions: "Establish prayer at the decline of the sun [from its meridian] until the darkness of the night and [also] the Quran of dawn. Indeed, the recitation of dawn is ever witnessed." (17:78)\n\nAmong its many virtues, Fajr prayer:\n\n1. **Divine Protection**: The one who prays Fajr comes under the protection of Allah throughout the day.\n\n2. **Witness of Angels**: Both the night angels and day angels are present at Fajr time, making it a witnessed prayer.\n\n3. **Light on Judgment Day**: The Prophet (ﷺ) said: "Give glad tidings to those who walk to the mosque in darkness, for they will have perfect light on the Day of Judgment."\n\n4. **Better than the World**: "Two rak'ahs of Fajr are better than the world and all it contains." (Muslim)\n\nMaking Fajr a consistent practice transforms one's entire day, establishing a connection with Allah from the very first moments of wakefulness.`,
    contentBn: `ফজরের নামাজ — ভোরের নামাজ — ইসলামে অনন্য গুরুত্বের একটি স্থান রাখে। নবী মুহাম্মদ (ﷺ) বলেছেন: "যে ব্যক্তি ফজরের নামাজ পড়ে, সে আল্লাহর রক্ষায় থাকে।"\n\nকুরআনে বিশেষভাবে উল্লেখ করা হয়েছে: "সূর্য ঢলে পড়ার সময় থেকে রাতের অন্ধকার পর্যন্ত নামাজ কায়েম করো এবং ভোরের কুরআন পাঠ করো। নিশ্চয়ই ভোরের কুরআন পাঠ প্রত্যক্ষ করা হয়।" (১৭:৭৮)\n\nফজরের নামাজের ফজিলত:\n\n১. **আল্লাহর সুরক্ষা**: যে ব্যক্তি ফজর পড়ে সে সারাদিন আল্লাহর হেফাজতে থাকে।\n\n২. **ফেরেশতাদের সাক্ষ্য**: রাতের ফেরেশতা ও দিনের ফেরেশতা উভয়ই ফজরের সময় উপস্থিত থাকে।\n\n৩. **কিয়ামতে আলো**: নবী (ﷺ) বলেছেন: "অন্ধকারে মসজিদে যারা হাঁটে তাদের কিয়ামতের দিন পরিপূর্ণ নূরের সুসংবাদ দাও।"\n\n৪. **দুনিয়ার চেয়ে উত্তম**: "ফজরের দুই রাকাত নামাজ দুনিয়া ও দুনিয়ার সব কিছুর চেয়ে উত্তম।" (মুসলিম)`,
  },
  {
    slug: "ramadan-preparation-guide",
    title: "Complete Guide to Preparing for Ramadan",
    titleBn: "রমজানের জন্য সম্পূর্ণ প্রস্তুতি গাইড",
    excerpt: "Prepare your body, mind, and soul for the blessed month of Ramadan with this comprehensive guide.",
    excerptBn: "পবিত্র রমজান মাসের জন্য আপনার শরীর, মন ও আত্মাকে প্রস্তুত করুন এই সম্পূর্ণ গাইডের মাধ্যমে।",
    category: "ramadan",
    categoryBn: "রমজান",
    author: "মাওলানা শিব্বীর আহমদ",
    date: "2024-04-15",
    readingTime: 8,
    featured: true,
    coverGradient: "from-indigo-900/80 via-purple-800/60 to-blue-900/40",
    arabicQuote: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ",
    tags: ["ramadan", "fasting", "preparation"],
    content: "Ramadan is the ninth month of the Islamic calendar and is observed by Muslims worldwide as a month of fasting, prayer, reflection, and community...",
    contentBn: "রমজান ইসলামিক ক্যালেন্ডারের নবম মাস এবং বিশ্বজুড়ে মুসলমানরা এটিকে রোজা, নামাজ, প্রতিফলন এবং সম্প্রদায়ের মাস হিসেবে পালন করে...",
  },
  {
    slug: "virtues-of-surah-kahf-friday",
    title: "Virtues of Reciting Surah Al-Kahf on Friday",
    titleBn: "জুমার দিন সূরা কাহফ পড়ার ফজিলত",
    excerpt: "Every Friday, Muslims are encouraged to recite Surah Al-Kahf. Discover the profound blessings of this blessed practice.",
    excerptBn: "প্রতি জুমার দিন সূরা আল-কাহফ পড়ার উৎসাহ দেওয়া হয়েছে। এই বরকতময় আমলের অসাধারণ ফজিলত জানুন।",
    category: "quran",
    categoryBn: "কুরআনের শিক্ষা",
    author: "মাওলানা শিব্বীর আহমদ",
    date: "2024-04-05",
    readingTime: 6,
    featured: false,
    coverGradient: "from-emerald-900/80 via-teal-800/60 to-green-900/40",
    arabicQuote: "مَن قَرَأَ سُورَةَ الكَهف يَومَ الجُمُعَة",
    tags: ["quran", "surah-kahf", "friday"],
    content: "The Prophet Muhammad (ﷺ) said: 'Whoever reads Surah Al-Kahf on Friday, a light will shine for him between two Fridays.' This narration, reported by Al-Hakim and Al-Bayhaqi, establishes the special virtue of this practice...",
    contentBn: "নবী মুহাম্মদ (ﷺ) বলেছেন: 'যে ব্যক্তি জুমার দিন সূরা আল-কাহফ পড়ে, দুই জুমার মাঝে তার জন্য নূর আলোকিত হয়।'...",
  },
  {
    slug: "zakat-calculation-guide",
    title: "How to Calculate Zakat: A Simple Step-by-Step Guide",
    titleBn: "যাকাত হিসাবের সহজ ধাপে ধাপে গাইড",
    excerpt: "Learn exactly how to calculate your Zakat on gold, silver, cash, and business assets with clear examples.",
    excerptBn: "স্বর্ণ, রূপা, নগদ এবং ব্যবসায়িক সম্পদের উপর কিভাবে যাকাত হিসাব করবেন তা স্পষ্ট উদাহরণ সহ জানুন।",
    category: "fiqh",
    categoryBn: "মাসআলা",
    author: "মাওলানা শিব্বীর আহমদ",
    date: "2024-03-20",
    readingTime: 7,
    featured: false,
    coverGradient: "from-yellow-900/80 via-amber-800/60 to-orange-900/40",
    tags: ["zakat", "fiqh", "finance"],
    content: "Zakat is one of the Five Pillars of Islam, making it a mandatory act of worship. It is an annual payment of 2.5% on qualifying wealth held for a full lunar year above the nisab threshold...",
    contentBn: "যাকাত ইসলামের পাঁচটি স্তম্ভের একটি, যা ইবাদতের একটি বাধ্যতামূলক কাজ। এটি নিসাব সীমার উপরে পূর্ণ চান্দ্রবর্ষ ধরে রাখা যোগ্য সম্পদের উপর বার্ষিক ২.৫% পরিশোধ...",
  },
  {
    slug: "morning-evening-adhkar",
    title: "Essential Morning & Evening Adhkar with Meanings",
    titleBn: "সকাল-সন্ধ্যার গুরুত্বপূর্ণ আযকার ও তাদের অর্থ",
    excerpt: "Start and end your day with these powerful supplications from the Sunnah, with full Arabic text and Bangla translation.",
    excerptBn: "সুন্নাহর এই শক্তিশালী দোয়াগুলি দিয়ে আপনার দিন শুরু ও শেষ করুন, পূর্ণ আরবি পাঠ ও বাংলা অনুবাদ সহ।",
    category: "amal",
    categoryBn: "মাসনুন আমল",
    author: "মাওলানা শিব্বীর আহমদ",
    date: "2024-03-10",
    readingTime: 10,
    featured: false,
    coverGradient: "from-sky-900/80 via-blue-800/60 to-indigo-900/40",
    arabicQuote: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    tags: ["adhkar", "morning", "evening", "sunnah"],
    content: "The adhkar (remembrance of Allah) for morning and evening are among the most valuable Sunnah practices a Muslim can establish in their daily routine...",
    contentBn: "সকাল ও সন্ধ্যার আযকার (আল্লাহর স্মরণ) একজন মুসলমানের দৈনন্দিন রুটিনে প্রতিষ্ঠা করতে পারার সবচেয়ে মূল্যবান সুন্নাহ অনুশীলনগুলির মধ্যে একটি...",
  },
  {
    slug: "dua-for-anxiety-and-stress",
    title: "Powerful Duas for Anxiety, Stress, and Worry",
    titleBn: "উদ্বেগ, চাপ ও দুশ্চিন্তার জন্য শক্তিশালী দোয়া",
    excerpt: "Islam provides beautiful remedies for anxiety and mental stress. These prophetic duas bring peace and tranquility to the heart.",
    excerptBn: "ইসলাম উদ্বেগ ও মানসিক চাপের জন্য সুন্দর প্রতিকার দেয়। এই নবীজির দোয়াগুলি হৃদয়ে শান্তি ও প্রশান্তি নিয়ে আসে।",
    category: "amal",
    categoryBn: "মাসনুন আমল",
    author: "মাওলানা শিব্বীর আহমদ",
    date: "2024-02-25",
    readingTime: 6,
    featured: false,
    coverGradient: "from-violet-900/80 via-purple-800/60 to-pink-900/40",
    arabicQuote: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَالحَزَنِ",
    tags: ["dua", "anxiety", "mental-health"],
    content: "Mental health and emotional wellbeing are deeply addressed in Islamic teachings. The Prophet Muhammad (ﷺ) experienced grief and hardship, and Allah revealed remedies through him...",
    contentBn: "মানসিক স্বাস্থ্য ও আবেগিক সুস্থতা ইসলামি শিক্ষায় গভীরভাবে সম্বোধন করা হয়েছে...",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

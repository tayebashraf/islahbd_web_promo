/**
 * Static explanations for the prayer-times page: what each part of the day
 * is, how many rak'ahs it holds (Hanafi) and the FAQ. Shared by the page
 * (FAQ JSON-LD) and the client.
 */

export type Kind = "farz" | "nafl" | "forbidden";

/** Same three colours the app's timeline uses. */
export const KIND_TONE: Record<Kind, string> = {
  farz: "#059669",
  nafl: "#2563EB",
  forbidden: "#DC2626",
};

export const KIND_LABEL: Record<Kind, { bn: string; en: string }> = {
  farz: { bn: "ফরজ", en: "Fard" },
  nafl: { bn: "নফল", en: "Nafl" },
  forbidden: { bn: "নিষিদ্ধ", en: "Forbidden" },
};

type Text = { bn: string; en: string };
export type Rakat = { n: number; label: Text; tone: "farz" | "sunnah" | "nafl" | "witr" };

const SM: Text = { bn: "সুন্নতে মুয়াক্কাদা", en: "Sunnah mu'akkadah" };
const SG: Text = { bn: "সুন্নতে গায়রে মুয়াক্কাদা", en: "Sunnah ghayr mu'akkadah" };
const FARZ: Text = { bn: "ফরজ", en: "Fard" };
const NAFL: Text = { bn: "নফল", en: "Nafl" };
const WITR: Text = { bn: "বিতর (ওয়াজিব)", en: "Witr (wajib)" };

export const RAKAT: Record<string, Rakat[]> = {
  fajr: [
    { n: 2, label: SM, tone: "sunnah" },
    { n: 2, label: FARZ, tone: "farz" },
  ],
  dhuhr: [
    { n: 4, label: SM, tone: "sunnah" },
    { n: 4, label: FARZ, tone: "farz" },
    { n: 2, label: SM, tone: "sunnah" },
    { n: 2, label: NAFL, tone: "nafl" },
  ],
  jumuah: [
    { n: 4, label: SM, tone: "sunnah" },
    { n: 2, label: FARZ, tone: "farz" },
    { n: 4, label: SM, tone: "sunnah" },
    { n: 2, label: { bn: "সুন্নত", en: "Sunnah" }, tone: "sunnah" },
    { n: 2, label: NAFL, tone: "nafl" },
  ],
  asr: [
    { n: 4, label: SG, tone: "sunnah" },
    { n: 4, label: FARZ, tone: "farz" },
  ],
  maghrib: [
    { n: 3, label: FARZ, tone: "farz" },
    { n: 2, label: SM, tone: "sunnah" },
    { n: 2, label: NAFL, tone: "nafl" },
  ],
  isha: [
    { n: 4, label: SG, tone: "sunnah" },
    { n: 4, label: FARZ, tone: "farz" },
    { n: 2, label: SM, tone: "sunnah" },
    { n: 2, label: NAFL, tone: "nafl" },
    { n: 3, label: WITR, tone: "witr" },
    { n: 2, label: NAFL, tone: "nafl" },
  ],
};

/** One-paragraph explanation for every row of the day's timeline. */
export const ABOUT: Record<string, Text> = {
  fajr: {
    bn: "সুবহে সাদিক (পূর্ব আকাশে সাদা আলো ছড়িয়ে পড়া) থেকে সূর্যোদয়ের আগ পর্যন্ত ফজরের ওয়াক্ত। রোজার সেহরির শেষ সময়ও এটিই।",
    en: "From true dawn (subh sadiq), when white light spreads across the eastern sky, until sunrise. Suhoor also ends at this time.",
  },
  sunrise: {
    bn: "সূর্য উঠতে শুরু করা থেকে প্রায় ১৫ মিনিট। এ সময় ফরজ, কাজা, নফল কোনো নামাজই পড়া যায় না।",
    en: "Roughly 15 minutes from the moment the sun starts to rise. No prayer of any kind — fard, qada or nafl — is allowed.",
  },
  ishraq: {
    bn: "সূর্য পুরোপুরি ওঠার পর ২ বা ৪ রাকাত নফল। ফজর জামাতে পড়ে বসে যিকির করার পর ইশরাক পড়লে পূর্ণ হজ্জ ও উমরাহর সওয়াবের কথা হাদিসে এসেছে (তিরমিজি)।",
    en: "2 or 4 rak'ahs of nafl once the sun is fully up. A hadith (Tirmidhi) promises the reward of a complete Hajj and Umrah to one who prays Fajr in congregation, remembers Allah until sunrise and then prays it.",
  },
  chasht: {
    bn: "সূর্য বেশ উপরে ওঠার পর থেকে যাওয়ালের আগ পর্যন্ত ২ থেকে ১২ রাকাত নফল। একে সালাতুদ দুহাও বলা হয়।",
    en: "2 to 12 rak'ahs of nafl from mid-morning until just before zawal. Also called Salat al-Duha.",
  },
  zawal: {
    bn: "সূর্য ঠিক মাথার উপর (মধ্যাকাশে) থাকার সময়। যোহরের ওয়াক্ত শুরুর আগের এই কয়েক মিনিট সকল নামাজ নিষেধ।",
    en: "The sun stands at its zenith. For these few minutes before Dhuhr begins, every prayer is forbidden.",
  },
  dhuhr: {
    bn: "সূর্য পশ্চিমে হেলে পড়ার পর থেকে আসরের ওয়াক্ত শুরু পর্যন্ত। প্রচণ্ড গরমের দিনে একটু দেরি করে পড়া মুস্তাহাব।",
    en: "From the moment the sun passes its zenith until Asr begins. On very hot days it is recommended to delay it a little.",
  },
  jumuah: {
    bn: "শুক্রবার যোহরের পরিবর্তে জুমার নামাজ। খুতবা শোনা ওয়াজিব — আগে আগে মসজিদে যাওয়ার অনেক ফজিলত রয়েছে।",
    en: "On Friday Jumu'ah replaces Dhuhr. Listening to the khutbah is wajib, and arriving early carries great reward.",
  },
  asr: {
    bn: "হানাফী মতে কোনো বস্তুর ছায়া তার দ্বিগুণ হলে আসর শুরু হয় এবং সূর্যাস্ত পর্যন্ত থাকে। তবে সূর্য হলুদ হওয়ার আগেই পড়ে নেওয়া উচিত।",
    en: "In the Hanafi school Asr begins when an object's shadow is twice its length and lasts until sunset — but pray it before the sun turns pale.",
  },
  sunset: {
    bn: "সূর্যাস্তের প্রায় ১৫ মিনিট আগে থেকে সূর্য ডোবা পর্যন্ত। এ সময় নফল নিষেধ, তবে সেদিনের আসর না পড়ে থাকলে এখনই পড়ে নিন।",
    en: "About 15 minutes before sunset until the sun has set. Nafl is forbidden, but if you have not prayed that day's Asr, pray it now.",
  },
  maghrib: {
    bn: "সূর্য সম্পূর্ণ অস্ত যাওয়ার পর থেকে পশ্চিম আকাশের আভা (শাফাক) মিলিয়ে যাওয়া পর্যন্ত। দেরি না করে শুরুতেই পড়া উত্তম। রোজাদারের ইফতারের সময়।",
    en: "From complete sunset until the twilight (shafaq) fades. Best prayed right away. This is also iftar time.",
  },
  awwabin: {
    bn: "মাগরিবের পর ২ রাকাত করে ৬ রাকাত নফল। একে আউওয়াবীনের নামাজ বলা হয়।",
    en: "6 rak'ahs of nafl after Maghrib, prayed in pairs — the prayer of the oft-returning (Awwabin).",
  },
  isha: {
    bn: "শাফাক মিলিয়ে যাওয়ার পর থেকে সুবহে সাদিক পর্যন্ত। মধ্যরাতের আগে পড়ে নেওয়া উত্তম। এশার পর বিতর ওয়াজিব।",
    en: "From the end of twilight until true dawn, though it is best prayed before midnight. Witr (wajib) follows Isha.",
  },
  tahajjud: {
    bn: "এশার পর ঘুম থেকে উঠে পড়া রাতের নফল নামাজ, ২ থেকে ১২ রাকাত। রাতের শেষ তৃতীয়াংশ সবচেয়ে উত্তম সময়।",
    en: "The night prayer after waking from sleep, 2 to 12 rak'ahs. The last third of the night is the best time.",
  },
};

export const PRAYER_FAQS: { q: Text; a: Text }[] = [
  {
    q: { bn: "আজকের পাঁচ ওয়াক্ত নামাজের সময় কীভাবে জানব?", en: "How do I find today's five prayer times?" },
    a: {
      bn: "এই পাতায় আপনার শহর বেছে নিলেই ফজর, যোহর, আসর, মাগরিব ও এশার শুরু ও শেষ সময়, নফল নামাজের সময় এবং নিষিদ্ধ সময় দেখতে পাবেন। IslahBD অ্যাপে জিপিএস দিয়ে বাংলাদেশের ৬৪ জেলার সঠিক সময় ও আজান এলার্ম পাবেন।",
      en: "Pick your city on this page to see when Fajr, Dhuhr, Asr, Maghrib and Isha start and end, along with the nafl and forbidden times. The IslahBD app uses GPS for exact times in all 64 districts and adds azan alarms.",
    },
  },
  {
    q: { bn: "দিনের কোন কোন সময়ে নামাজ পড়া নিষিদ্ধ?", en: "When during the day is prayer forbidden?" },
    a: {
      bn: "তিন সময়ে সব ধরনের নামাজ নিষিদ্ধ: সূর্যোদয়ের সময় (প্রায় ১৫ মিনিট), ঠিক দ্বিপ্রহরে সূর্য মাথার উপর থাকার সময় (যাওয়াল) এবং সূর্যাস্তের সময় (সূর্য হলুদ হওয়া থেকে অস্ত যাওয়া পর্যন্ত)। তবে সেদিনের আসর না পড়ে থাকলে সূর্যাস্তের আগে পড়ে নিতে হবে।",
      en: "Every prayer is forbidden at three times: while the sun rises (about 15 minutes), at midday when the sun is at its zenith (zawal) and while it sets (from when it turns pale until it has set). That day's Asr, if missed, should still be prayed before sunset.",
    },
  },
  {
    q: { bn: "সেহরি ও ইফতারের সময় কখন?", en: "When are suhoor and iftar?" },
    a: {
      bn: "ফজরের ওয়াক্ত শুরু হওয়ার সাথে সাথে সেহরির সময় শেষ হয়, আর মাগরিবের ওয়াক্ত শুরু হলে (সূর্যাস্তের পর) ইফতার করতে হয়। সতর্কতার জন্য সেহরি কয়েক মিনিট আগেই শেষ করা ভালো।",
      en: "Suhoor ends as soon as Fajr begins, and iftar is at the start of Maghrib, right after sunset. Finish suhoor a few minutes early to be safe.",
    },
  },
  {
    q: { bn: "তাহাজ্জুদ নামাজের সর্বোত্তম সময় কোনটি?", en: "What is the best time for Tahajjud?" },
    a: {
      bn: "এশার নামাজের পর ঘুমিয়ে রাতের শেষ তৃতীয়াংশে (ফজরের ওয়াক্ত শুরু হওয়ার আগ পর্যন্ত) তাহাজ্জুদ আদায় করা সবচেয়ে উত্তম ও ফজিলতপূর্ণ।",
      en: "After sleeping following Isha, in the last third of the night before Fajr begins — this is the most virtuous time for Tahajjud.",
    },
  },
  {
    q: { bn: "এই সময়গুলো কোন পদ্ধতিতে গণনা করা হয়?", en: "How are these times calculated?" },
    a: {
      bn: "ফজর ও এশা ইউনিভার্সিটি অব ইসলামিক সায়েন্সেস, করাচি পদ্ধতিতে (সূর্য দিগন্তের ১৮° নিচে) এবং আসর হানাফী মাযহাব অনুযায়ী গণনা করা হয় — বাংলাদেশে প্রচলিত ইসলামিক ফাউন্ডেশনের সময়সূচীও এই নিয়মে তৈরি। স্থানীয় মসজিদের সময়ের সাথে ১–২ মিনিট পার্থক্য হতে পারে।",
      en: "Fajr and Isha use the University of Islamic Sciences, Karachi method (sun 18° below the horizon) and Asr follows the Hanafi school — the same convention as the Islamic Foundation timetable used in Bangladesh. Expect a 1–2 minute difference from your local mosque.",
    },
  },
  {
    q: { bn: "আজানের সময় আর জামাতের সময় কি একই?", en: "Are azan time and congregation time the same?" },
    a: {
      bn: "না। এখানে দেখানো সময় হলো ওয়াক্ত শুরুর সময়, যখন থেকে নামাজ পড়া যায়। মসজিদে জামাত সাধারণত এর ১৫–৩০ মিনিট পরে হয় — জামাতের সময় আপনার মসজিদ থেকে জেনে নিন।",
      en: "No. The times shown are when each prayer's time begins. Mosques usually hold the congregation 15–30 minutes later, so check your mosque for jama'ah times.",
    },
  },
];

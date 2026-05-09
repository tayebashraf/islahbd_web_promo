export interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  nameBn: string;
  meaning: string;
  verses: number;
  revelationType: "Meccan" | "Medinan";
  juz: number[];
}

export const SURAHS: Surah[] = [
  { number: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", nameBn: "আল-ফাতিহা", meaning: "The Opening", verses: 7, revelationType: "Meccan", juz: [1] },
  { number: 2, name: "Al-Baqarah", nameArabic: "البقرة", nameBn: "আল-বাকারা", meaning: "The Cow", verses: 286, revelationType: "Medinan", juz: [1, 2, 3] },
  { number: 3, name: "Ali 'Imran", nameArabic: "آل عمران", nameBn: "আলে ইমরান", meaning: "Family of Imran", verses: 200, revelationType: "Medinan", juz: [3, 4] },
  { number: 4, name: "An-Nisa", nameArabic: "النساء", nameBn: "আন-নিসা", meaning: "The Women", verses: 176, revelationType: "Medinan", juz: [4, 5, 6] },
  { number: 5, name: "Al-Ma'idah", nameArabic: "المائدة", nameBn: "আল-মায়িদা", meaning: "The Table Spread", verses: 120, revelationType: "Medinan", juz: [6, 7] },
  { number: 6, name: "Al-An'am", nameArabic: "الأنعام", nameBn: "আল-আনআম", meaning: "The Cattle", verses: 165, revelationType: "Meccan", juz: [7, 8] },
  { number: 7, name: "Al-A'raf", nameArabic: "الأعراف", nameBn: "আল-আরাফ", meaning: "The Heights", verses: 206, revelationType: "Meccan", juz: [8, 9] },
  { number: 8, name: "Al-Anfal", nameArabic: "الأنفال", nameBn: "আল-আনফাল", meaning: "The Spoils of War", verses: 75, revelationType: "Medinan", juz: [9, 10] },
  { number: 9, name: "At-Tawbah", nameArabic: "التوبة", nameBn: "আত-তওবা", meaning: "The Repentance", verses: 129, revelationType: "Medinan", juz: [10, 11] },
  { number: 10, name: "Yunus", nameArabic: "يونس", nameBn: "ইউনুস", meaning: "Jonah", verses: 109, revelationType: "Meccan", juz: [11] },
  { number: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", nameBn: "আল-ইখলাস", meaning: "Sincerity", verses: 4, revelationType: "Meccan", juz: [30] },
  { number: 113, name: "Al-Falaq", nameArabic: "الفلق", nameBn: "আল-ফালাক", meaning: "The Daybreak", verses: 5, revelationType: "Meccan", juz: [30] },
  { number: 114, name: "An-Nas", nameArabic: "الناس", nameBn: "আন-নাস", meaning: "Mankind", verses: 6, revelationType: "Meccan", juz: [30] },
];

export const DAILY_AYAHS = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Inna ma'al 'usri yusraa",
    translation: "Indeed, with hardship will be ease.",
    translationBn: "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।",
    reference: "Al-Inshirah 94:6",
  },
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    transliteration: "Wa man yattaqillaha yaj'al lahu makhraja",
    translation: "And whoever fears Allah – He will make for him a way out.",
    translationBn: "যে আল্লাহকে ভয় করে, তিনি তার জন্য পথ বের করে দেন।",
    reference: "At-Talaq 65:2",
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Fa inna ma'al 'usri yusraa",
    translation: "For indeed, with hardship will be ease.",
    translationBn: "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।",
    reference: "Al-Inshirah 94:5",
  },
];

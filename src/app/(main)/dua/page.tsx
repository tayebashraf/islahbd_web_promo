import type { Metadata } from "next";
import { BookReader, type Book } from "@/components/book/book-reader";
import { FaqJsonLd } from "@/components/seo/json-ld";
import dua from "@/data/dua.json";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "প্রতিদিনের দোয়া ও হিসনুল মুসলিম — আরবি, বাংলা উচ্চারণ ও অর্থ",
  description:
    "খাযায়েনে কোরআন ও হাদীস থেকে বিষয়ভিত্তিক ও দৈনন্দিন প্রয়োজনীয় মাসনূন দোয়া, সকাল-সন্ধ্যার জিকির, বিপদ মুক্তির দোয়া আরবি, বাংলা উচ্চারণ, অর্থ ও ফযীলতসহ।",
  keywords: [
    "প্রতিদিনের দোয়া",
    "হিসনুল মুসলিম বাংলা",
    "সকাল সন্ধ্যার দোয়া",
    "বিপদ মুক্তির দোয়া",
    "ঘুমের দোয়া",
    "নামাজের দোয়া",
    "মাসনূন দোয়া",
    "রোগমুক্তির দোয়া",
    "ক্ষমা প্রার্থনার দোয়া",
    "Daily Islamic Dua Bangla",
    "Hisnul Muslim",
  ],
  alternates: { canonical: `${SITE_URL}/dua` },
  openGraph: {
    title: "প্রতিদিনের দোয়া ও হিসনুল মুসলিম — আরবি, বাংলা উচ্চারণ ও অর্থ | islahbd",
    description: "সহীহ হাদিসভিত্তিক প্রতিদিনের দোয়া, সকাল-সন্ধ্যার জিকির ও বিপদ মুক্তির দোয়া।",
    url: `${SITE_URL}/dua`,
    type: "website",
  },
};

const DUA_FAQS = [
  {
    question: "সকাল-সন্ধ্যার হেফাজতের দোয়া কোনগুলো?",
    answer:
      "আয়াতুল কুরসী, সূরা ইখলাস, ফালাক, নাস এবং 'বিসমিল্লাহিল্লাজি লা ইয়াদুররু মা'আসমিহি...' ৩ বার এবং 'আউজু বিকালিমাাতিল্লাহিত তাম্মাাতি...' ৩ বার পাঠ করলে সকল অনিষ্ট থেকে হেফাজতে থাকা যায়।",
  },
  {
    question: "বিপদ মুক্তির দোয়া হিসেবে কোন দোয়াটি সবচেয়ে বেশি পঠিত হয়?",
    answer:
      "হযরত ইউনুস (আ.)-এর দোয়া 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নি কুনতু মিনাজ জোয়ালিমিন' (দোয়ায়ে ইউনুস) এবং 'হাসবুনাল্লাহু ওয়া নি'মাল ওয়াকিল'।",
  },
  {
    question: "ঘুম থেকে ওঠার পর ও ঘুমাতে যাওয়ার সুন্নত দোয়া কি?",
    answer:
      "ঘুমানোর দোয়া: 'আল্লাহুম্মা বিসমিকা আমূতু ওয়া আহ্ইয়াহ' এবং ঘুম থেকে ওঠার পর: 'আলহামদু লিল্লাহিল্লাজি আহইয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশূর'।",
  },
];

export default async function DuaPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return (
    <>
      <FaqJsonLd faqs={DUA_FAQS} />
      <BookReader book={dua as Book} initialCat={c} title={["দোয়া", "Duas"]} unit={["দোয়া", "duas"]} />
    </>
  );
}

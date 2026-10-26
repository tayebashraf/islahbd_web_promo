import type { Metadata } from "next";
import { BookReader, type Book } from "@/components/book/book-reader";
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

export default async function DuaPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return <BookReader book={dua as Book} initialCat={c} title={["দোয়া", "Duas"]} unit={["দোয়া", "duas"]} />;
}

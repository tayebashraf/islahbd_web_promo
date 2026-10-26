import type { Metadata } from "next";
import { BookReader, type Book } from "@/components/book/book-reader";
import hajj from "@/data/hajj.json";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "হজ ও ওমরাহ পূর্ণাঙ্গ গাইড — নিয়ম, আমল, দোয়া ও মাসআলা",
  description:
    "তামাত্তু হজ ও ওমরাহর ধাপে ধাপে সম্পূর্ণ সহীহ গাইড — ইহরাম, তাওয়াফ, সাঈ, আরাফাহ, মুযদালিফা ও মিনায় করণীয় দোআ, নিয়ম ও আদব সহ।",
  keywords: [
    "হজ গাইড",
    "ওমরাহ করার নিয়ম",
    "হজের দোয়া",
    "ইহরাম বাঁধার নিয়ম",
    "তাওয়াফ ও সাঈ",
    "হজের মাসআলা",
    "হজ প্রশিক্ষণ",
    "Hajj and Umrah Guide Bangla",
  ],
  alternates: { canonical: `${SITE_URL}/hajj` },
  openGraph: {
    title: "হজ ও ওমরাহ পূর্ণাঙ্গ গাইড | islahbd",
    description: "তামাত্তু হজ ও ওমরাহর ধাপে ধাপে সম্পূর্ণ সহীহ গাইড ও দোয়া।",
    url: `${SITE_URL}/hajj`,
    type: "website",
  },
};

export default async function HajjPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return <BookReader book={hajj as Book} initialCat={c} title={["হজ্জ ও উমরাহ", "Hajj & Umrah"]} unit={["বিষয়", "topics"]} />;
}

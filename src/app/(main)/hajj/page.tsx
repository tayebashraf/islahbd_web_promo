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

import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

const hajjFaqs = [
  {
    question: "তামাত্তু হজ কি এবং এটি কীভাবে আদায় করতে হয়?",
    answer: "তামাত্তু হজ হলো হজের মাসসমূহে প্রথমে ওমরাহর ইহরাম বেঁধে ওমরাহ সম্পন্ন করে হালাল হওয়া, অতঃপর ৮ই জিলহজ্জ নতুন করে হজের ইহরাম বেঁধে হজের মূল কার্যাবলি সম্পন্ন করা।",
  },
  {
    question: "ইহরাম অবস্থায় কি কি কাজ নিষিদ্ধ?",
    answer: "ইহরাম অবস্থায় চুল ও নখ কাটা, সুগন্ধি ব্যবহার করা, সেলাই করা পোশাক পরিধান করা (পুরুষদের জন্য), সহবাস ও কোনো প্রাণি শিকার বা ক্ষতিসাধন করা সম্পূর্ণ নিষিদ্ধ।",
  },
  {
    question: "তাওয়াফ করার সঠিক নিয়ম কি?",
    answer: "হাজরে আসওয়াদকে সামনে রেখে বিসমিল্লাহি আল্লাহু আকবার বলে ইস্তিলাম করে কাবা শরীফকে বামে রেখে ঘড়ির কাঁটার বিপরীত দিকে মোট ৭ চক্কর দেওয়াকে তাওয়াফ বলে।",
  },
  {
    question: "সাঈ করার স্থান ও নিয়ম কি?",
    answer: "সাফা পাহাড় থেকে শুরু করে মারওয়া পাহাড় পর্যন্ত ৪ চক্কর এবং মারওয়া থেকে সাফা পর্যন্ত ৩ চক্কর—মোট ৭ চক্কর সম্পন্ন করাকে সাঈ বলে।",
  },
];

export default async function HajjPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "হোম", url: "/" }, { name: "হজ ও ওমরাহ গাইড", url: "/hajj" }]} />
      <FaqJsonLd faqs={hajjFaqs} />
      <BookReader book={hajj as Book} initialCat={c} title={["হজ্জ ও উমরাহ", "Hajj & Umrah"]} unit={["বিষয়", "topics"]} />
    </>
  );
}


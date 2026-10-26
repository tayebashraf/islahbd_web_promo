import type { Metadata } from "next";
import { FatwaClient } from "./fatwa-client";
import { getFatwaCategories, getFatwas } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ইসলামিক ফতোয়া ও শরয়ী সমাধান — আপনার জিজ্ঞাসা ও মাসআলা",
  description:
    "দৈনন্দিন জীবন, নামাজ, রোজা, যাকাত ও পারিবারিক বিষয়ে হক্কানি মুফতিদের নির্ভরযোগ্য শরঈ সমাধান ও ইসলামিক ফতোয়া পড়ুন এবং সরাসরি প্রশ্ন করুন।",
  keywords: [
    "ইসলামিক ফতোয়া",
    "শরয়ী সমাধান",
    "মাসআলা জিজ্ঞাসা",
    "নামাজের মাসআলা",
    "রোযার মাসআলা",
    "কওমি মাদরাসা ফতোয়া",
    "মারকাযুল ইহসান ফতোয়া",
    "হালাল হারাম বিধান",
    "Islamic Fatwa Bangla",
  ],
  alternates: { canonical: `${SITE_URL}/fatwa` },
  openGraph: {
    title: "ইসলামিক ফতোয়া ও শরয়ী সমাধান | islahbd",
    description: "দৈনন্দিন শরয়ী মাসআলা ও নির্ভরযোগ্য মুফতিয়ানে কেরামের ফতোয়া।",
    url: `${SITE_URL}/fatwa`,
    type: "website",
  },
};

import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

const fatwaFaqs = [
  {
    question: "মারকাযুল ইহসানের ফতোয়া বিভাগ থেকে কীভাবে শরয়ী সমাধান পাওয়া যায়?",
    answer: "ইসলামিক ফতোয়া বিভাগে দৈনন্দিন জীবনের নামাজ, রোজা, যাকাত, লেনদেন ও পারিবারিক বিষয়ে অভিজ্ঞ মুফতিয়ানে কেরামের নির্ভরযোগ্য কিতাবভিত্তিক ফতোয়া সংকলিত রয়েছে।",
  },
  {
    question: "ফতোয়ার ভিত্তি কি?",
    answer: "সকল ফতোয়া পবিত্র কুরআন, সহীহ হাদিস এবং আহলুস সুন্নাত ওয়াল জামায়াতের নির্ভরযোগ্য ফিকহি কিতাবসমূহের প্রামাণ্য উদ্ধৃতিসহ হক্কানি মুফতিদের দ্বারা প্রণীত।",
  },
  {
    question: "ইসলামিক কোনো বিষয়ে নতুন প্রশ্ন বা ফতোয়া কীভাবে জিজ্ঞাসা করা যায়?",
    answer: "IslahBD অ্যাপ অথবা মারকাযুল ইহসানের অফিসিয়াল যোগাযোগ মাধ্যমে সরাসরি প্রশ্ন পাঠিয়ে মুফতিয়ানে কেরামের কাছ থেকে লিখিত শরয়ী উত্তর গ্রহণ করা যায়।",
  },
];

export default async function FatwaPage() {
  const [fatwas, categories] = await Promise.all([getFatwas(), getFatwaCategories()]);
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "হোম", url: "/" }, { name: "ইসলামিক ফতোয়া", url: "/fatwa" }]} />
      <FaqJsonLd faqs={fatwaFaqs} />
      <FatwaClient fatwas={fatwas} categories={categories} />
    </>
  );
}


import type { Metadata } from "next";
import { TasbeehClient } from "./tasbeeh-client";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ডিজিটাল তাসবীহ কাউন্টার — অনলাইন যিকির ও ইস্তিগফার ট্র্যাকার",
  description:
    "সহজ ও দৃষ্টিনন্দন ডিজিটাল তাসবীহ — সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার, ইস্তিগফার ও দরূদ গণনা করুন এবং হিসেব সংরক্ষণ করুন।",
  keywords: [
    "ডিজিটাল তাসবিহ কাউন্টার",
    "অনলাইন তাসবিহ",
    "যিকির কাউন্টার",
    "তাসবীহে ফাতেমী",
    "ইস্তিগফার গণনা",
    "দরুদ শরীফ কাউন্টার",
    "Digital Tasbeeh Counter Online",
  ],
  alternates: { canonical: `${SITE_URL}/tasbeeh` },
  openGraph: {
    title: "ডিজিটাল তাসবীহ কাউন্টার — অনলাইন যিকির ও ইস্তিগফার | islahbd",
    description: "ডিজিটাল তাসবীহ কাউন্টারে সকাল-সন্ধ্যার জিকির ও ইস্তিগফার সহজে গণনা করুন।",
    url: `${SITE_URL}/tasbeeh`,
    type: "website",
  },
};

import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

const tasbeehFaqs = [
  {
    question: "ডিজিটাল তাসবীহ কাউন্টারে কীভাবে গণনা সংরক্ষণ করা যায়?",
    answer: "IslahBD ডিজিটাল তাসবীহ আপনার প্রতিটি ক্লিক ও যিকিরের সংখ্যা ব্রাউজার ও ডিভাইসে স্বয়ংক্রিয়ভাবে সেভ রাখে, ফলে পেজ রিফ্রেশ বা অ্যাপ বন্ধ করলেও আপনার আগের গণনা অক্ষুণ্ণ থাকে।",
  },
  {
    question: "নামাজের পর তাসবীহে ফাতেমীর সঠিক নিয়ম কি?",
    answer: "প্রত্যেক ফরজ নামাজের পর ৩৩ বার 'সুবহানাল্লাহ', ৩৩ বার 'আলহামদুলিল্লাহ' এবং ৩৪ বার 'আল্লাহু আকবার' পাঠ করাকে তাসবীহে ফাতেমী বলা হয়। এতে গোনাহ মাফ ও অপরিসীম সওয়াব অর্জিত হয়।",
  },
  {
    question: "সকাল-সন্ধ্যার প্রধান মাসনূন যিকির কোনগুলো?",
    answer: "সকাল-সন্ধ্যায় ৩ বার আয়াতুল কুরসী, ৩ কুল (সূরা ইখলাস, ফালাক, নাস), সাইয়্যিদুল ইস্তিগফার এবং 'সুবহানাল্লাহি ওয়া বিহামদিহি' ১০০ বার পাঠ করা বিশেষ ফজিলতপূর্ণ ও নিরাপত্তার মাধ্যম।",
  },
];

export default function TasbeehPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "হোম", url: "/" }, { name: "ডিজিটাল তাসবীহ", url: "/tasbeeh" }]} />
      <FaqJsonLd faqs={tasbeehFaqs} />
      <TasbeehClient />
    </>
  );
}


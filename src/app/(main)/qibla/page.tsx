import type { Metadata } from "next";
import { QiblaClient } from "./qibla-client";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ক্বিবলা কম্পাস — সঠিক কাবার দিক নির্ণয় অনলাইন",
  description:
    "আপনার অবস্থান থেকে কাবা শরিফের সঠিক দিক ও মক্কার দূরত্ব নির্ণয় করুন — জিপিএস ও সেন্সর ভিত্তিক নির্ভুল ডিজিটাল কিবলা কম্পাস।",
  keywords: [
    "কিবলা কম্পাস",
    "কাবার দিক নির্ণয়",
    "কিবলা দিক বাংলাদেশ",
    "ক্বিবলা সন্ধান",
    "মোবাইল কিবলা কম্পাস",
    "Qibla Direction Online",
    "Qibla Compass",
  ],
  alternates: { canonical: `${SITE_URL}/qibla` },
  openGraph: {
    title: "ক্বিবলা কম্পাস — সঠিক কাবার দিক নির্ণয় অনলাইন | islahbd",
    description: "যেকোনো স্থান থেকে তাৎক্ষণিকভাবে কাবার সঠিক দিক নির্ণয় করুন।",
    url: `${SITE_URL}/qibla`,
    type: "website",
  },
};

import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

const qiblaFaqs = [
  {
    question: "বাংলাদেশ থেকে কাবার সঠিক দিক কোন দিকে?",
    answer: "বাংলাদেশ থেকে পবিত্র কাবার দিক পশ্চিম ও কিছুটা দক্ষিণ কোণে (প্রায় ২৭০° থেকে ২৭৮° অ্যাজিমাথ)। IslahBD-এর ডিজিটাল কিবলা কম্পাস জিপিএস ও সেন্সরের সাহায্যে আপনার বর্তমান অবস্থান থেকে নিখুঁত ডিগ্রি ও দিক নির্দেশ করে।",
  },
  {
    question: "মোবাইল কিবলা কম্পাস কীভাবে সঠিকভাবে কাজ করে?",
    answer: "মোবাইলের ম্যাগনেটোমিটার সেন্সর এবং লোকেশন পারমিশন অন থাকলে কম্পাসটি অটোমেটিক কাবা শরীফের সঠিক দিক নির্দেশ করে। সর্বোচ্চ নির্ভুলতার জন্য ফোনটিকে সমতল মেঝেতে রাখুন এবং ধাতব বস্তু থেকে দূরে রাখুন।",
  },
  {
    question: "ইন্টারনেট ছাড়া কি কিবলা কম্পাস কাজ করে?",
    answer: "একবার অবস্থান শনাক্ত করার পর অফলাইনেও মোবাইলের চৌম্বকীয় সেন্সর দিয়ে কম্পাস কাবার দিক সঠিকভাবে প্রদর্শন করতে পারে।",
  },
];

export default function QiblaPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "হোম", url: "/" }, { name: "ক্বিবলা কম্পাস", url: "/qibla" }]} />
      <FaqJsonLd faqs={qiblaFaqs} />
      <QiblaClient />
    </>
  );
}


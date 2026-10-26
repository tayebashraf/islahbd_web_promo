import type { Metadata } from "next";
import { HafeziReader } from "./hafezi-reader";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "হাফেজী কুরআন শরীফ — নূরানী ১৫ লাইনের পৃষ্ঠা ভিত্তিক মুসহাফ",
  description:
    "১৫ লাইনের স্পষ্ট হাফেজী কুরআন শরীফ — হিফজ শিক্ষার্থী ও তিলাওয়াতকারীদের জন্য সূরা, পারা ও পৃষ্ঠা অনুযায়ী সহজ ডিজিটাল তিলাওয়াত।",
  keywords: [
    "হাফেজী কুরআন শরীফ",
    "নূরানী কুরআন মাজীদ",
    "১৫ লাইন হেফজ কুরআন",
    "হেফজখানা কুরআন",
    "হাফেজী কুরআন বাংলা",
    "ডিজিটাল হাফেজী কুরআন",
    "Hafezi Quran Sharif",
  ],
  alternates: { canonical: `${SITE_URL}/quran/hafezi` },
  openGraph: {
    title: "হাফেজী কুরআন শরীফ — নূরানী ১৫ লাইনের পৃষ্ঠা ভিত্তিক মুসহাফ | islahbd",
    description: "হিফজ শিক্ষার্থী ও সাধারণ পাঠকদের জন্য স্পষ্ট ১৫ লাইনের নূরানী হাফেজী কুরআন।",
    url: `${SITE_URL}/quran/hafezi`,
    type: "website",
  },
};

import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

const hafeziFaqs = [
  {
    question: "১৫ লাইনের হাফেজী কুরআন শরীফের বৈশিষ্ট্য কি?",
    answer: "১৫ লাইনের হাফেজী কুরআনে প্রতিটি পৃষ্ঠা একটি আয়াতের শেষে শুরু ও শেষ হয়। পুরো কুরআনে ৩০ পারায় মোট ৬১১টি সুনির্দিষ্ট পৃষ্ঠা থাকে, যা হিফজ ও পুনরাবৃত্তির জন্য বিশ্বব্যাপী সর্বাধিক সমাদৃত।",
  },
  {
    question: "অনলাইনে হাফেজী কুরআন কীভাবে পড়া যায়?",
    answer: "IslahBD হাফেজী কুরআন রিডারে পারা, সূরা ও পৃষ্ঠা নম্বর সিলেক্ট করে বা সোয়াইপ করে একদম কাগজের ছাপানো মুসহাফের মতোই ডিজিটাল স্পষ্ট অক্ষরে তেলাওয়াত করা যায়।",
  },
  {
    question: "হাফেজী কুরআনের পাতা কি অফলাইনে পড়া সম্ভব?",
    answer: "IslahBD মোবাইল অ্যাপে অফলাইন মোড রয়েছে, যার মাধ্যমে ইন্টারনেট সংযোগ ছাড়াই যে কোনো সময় ৩০ পারা হাফেজী কুরআন শরীফ তিলাওয়াত করা যায়।",
  },
];

export default function HafeziPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "/" },
          { name: "আল-কুরআন", url: "/quran" },
          { name: "হাফেজী কুরআন শরীফ", url: "/quran/hafezi" },
        ]}
      />
      <FaqJsonLd faqs={hafeziFaqs} />
      <HafeziReader />
    </>
  );
}


import type { Metadata } from "next";
import { BoyanClient } from "./boyan-client";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { getBoyanCategories, getBoyans } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "বয়ান ও ওয়াজ — আত্মশুদ্ধি ও ইসলাহী বয়ানের অডিও আর্কাইভ",
  description:
    "হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের ইসলাহী বয়ান, নতুন ওয়াজ মাহফিল, জুমার খুতবা ও আত্মশুদ্ধিকারী বয়ান শুনুন এবং বিনামূল্যে অডিও ডাউনলোড করুন।",
  keywords: [
    "বয়ান",
    "ওয়াজ",
    "বাংলা ওয়াজ",
    "ইসলামিক বয়ান",
    "নতুন ওয়াজ ২০২৬",
    "আত্মশুদ্ধিকারী বয়ান",
    "দিল নরম করার বয়ান",
    "মাওলানা তৈয়্যেব আশরাফ",
    "মারকাযুল ইহসান বয়ান",
    "ইসলাহী বয়ান",
    "নসীহত",
    "জুমার বয়ান",
    "Bangla Waz",
    "Islamic Bayan",
  ],
  alternates: { canonical: `${SITE_URL}/boyan` },
  openGraph: {
    title: "বয়ান ও ওয়াজ — আত্মশুদ্ধি ও ইসলাহী বয়ানের অডিও আর্কাইভ | islahbd",
    description: "হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের হৃদয়স্পর্শী ওয়াজ, ইসলাহী বয়ান ও জুমার খুতবা শুনুন।",
    url: `${SITE_URL}/boyan`,
    type: "website",
  },
};

const BOYAN_FAQS = [
  {
    question: "হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের বয়ান কীভাবে শুনব?",
    answer:
      "IslahBD ওয়েবসাইটে এবং মোবাইল অ্যাপে সরাসরি বিল্ট-ইন প্লেয়ারে অনলাইন স্ট্রিমিং ও ব্যাকগ্রাউন্ডে অডিও শোনা যায় এবং যেকোনো বয়ান বিনামূল্যে ডাউনলোড করা যায়।",
  },
  {
    question: "ইসলাহী বয়ান ও আত্মশুদ্ধির গুরুত্ব কি?",
    answer:
      "আত্মশুদ্ধি বা তাযকিয়ায়ে নফস একজন মুমিনের ঈমানি সুরক্ষার জন্য অপরিহার্য। দিল নরম করা, গোনাহ থেকে বেঁচে থাকা এবং আল্লাহর ভালোবাসা অর্জনে ইসলাহী বয়ান বিশেষ ভূমিকা পালন করে।",
  },
  {
    question: "মারকাযুল ইহসানের ইসলাহী মাহফিল কখন অনুষ্ঠিত হয়?",
    answer:
      "প্রতি ইংরেজি মাসের তৃতীয় বৃহস্পতিবার জামেআ মারকাযুল ইহসান ঢাকাতে মাসিক ইসলাহী মজলিস ও মাহফিল অনুষ্ঠিত হয়।",
  },
];

export default async function BoyanPage({ searchParams }: { searchParams: Promise<{ play?: string; category?: string }> }) {
  const [{ play, category }, boyans, categories] = await Promise.all([searchParams, getBoyans(), getBoyanCategories()]);
  return (
    <>
      <FaqJsonLd faqs={BOYAN_FAQS} />
      <BoyanClient boyans={boyans} categories={categories} initialPlay={play ? Number(play) : undefined} initialCategory={category} />
    </>
  );
}

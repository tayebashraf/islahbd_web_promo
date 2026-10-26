import type { Metadata } from "next";
import { BoyanClient } from "./boyan-client";
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

export default async function BoyanPage({ searchParams }: { searchParams: Promise<{ play?: string; category?: string }> }) {
  const [{ play, category }, boyans, categories] = await Promise.all([searchParams, getBoyans(), getBoyanCategories()]);
  return <BoyanClient boyans={boyans} categories={categories} initialPlay={play ? Number(play) : undefined} initialCategory={category} />;
}

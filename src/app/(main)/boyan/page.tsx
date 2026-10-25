import type { Metadata } from "next";
import { BoyanClient } from "./boyan-client";
import { getBoyanCategories, getBoyans } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "বয়ান — ইসলাহী বয়ানের অডিও আর্কাইভ",
  description: "হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের ইসলাহী বয়ান, জুমার বয়ান, মাসিক ইজতেমা ও সফরের বয়ান — ব্রাউজারে শুনুন ও ডাউনলোড করুন।",
  alternates: { canonical: `${SITE_URL}/boyan` },
};

export default async function BoyanPage({ searchParams }: { searchParams: Promise<{ play?: string; category?: string }> }) {
  const [{ play, category }, boyans, categories] = await Promise.all([searchParams, getBoyans(), getBoyanCategories()]);
  return <BoyanClient boyans={boyans} categories={categories} initialPlay={play ? Number(play) : undefined} initialCategory={category} />;
}

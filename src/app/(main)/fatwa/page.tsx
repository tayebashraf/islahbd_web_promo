import type { Metadata } from "next";
import { FatwaClient } from "./fatwa-client";
import { getFatwaCategories, getFatwas } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "শরঈ জিজ্ঞাসা — প্রশ্ন করুন",
  description: "শরঈ মাসআলা জানতে প্রশ্ন পাঠান এবং উত্তরপ্রাপ্ত প্রশ্নগুলো পড়ুন।",
  alternates: { canonical: `${SITE_URL}/fatwa` },
};

export default async function FatwaPage() {
  const [fatwas, categories] = await Promise.all([getFatwas(), getFatwaCategories()]);
  return <FatwaClient fatwas={fatwas} categories={categories} />;
}

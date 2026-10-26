import type { Metadata } from "next";
import { NasheedClient } from "./nasheed-client";
import { getNasheeds } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ইসলামিক গজল, হামদ ও নাত — বাংলা নাশিদ অডিও ও ভিডিও",
  description:
    "সেরা বাংলা ইসলামিক গজল, সুমধুর হামদ ও নাত এবং মন জুড়ানো ইসলামিক নাশিদ শুনুন ও দেখুন বাদ্যযন্ত্রহীন বিশুদ্ধ পরিবেশে।",
  keywords: [
    "ইসলামিক গজল",
    "বাংলা গজল",
    "নতুন গজল ২০২৬",
    "হামদ ও নাত",
    "নাত এ রাসুল",
    "হৃদয় জুড়ানো গজল",
    "সেরা বাংলা গজল",
    "কলরব গজল",
    "ইসলামিক নাশিদ",
    "গজল mp3",
    "Islamic Gojol",
    "Bangla Gojol",
    "Islamic Nasheed",
  ],
  alternates: { canonical: `${SITE_URL}/nasheed` },
  openGraph: {
    title: "ইসলামিক গজল, হামদ ও নাত — বাংলা নাশিদ অডিও ও ভিডিও | islahbd",
    description: "সেরা বাংলা ইসলামিক গজল, সুমধুর হামদ ও নাত এবং মন জুড়ানো নাশিদ শুনুন ও দেখুন।",
    url: `${SITE_URL}/nasheed`,
    type: "website",
  },
};

export default async function NasheedPage({ searchParams }: { searchParams: Promise<{ play?: string; tab?: string }> }) {
  const [{ play, tab }, nasheeds] = await Promise.all([searchParams, getNasheeds()]);
  return <NasheedClient nasheeds={nasheeds} initialPlay={play ? Number(play) : undefined} initialTab={tab === "video" ? "video" : undefined} />;
}

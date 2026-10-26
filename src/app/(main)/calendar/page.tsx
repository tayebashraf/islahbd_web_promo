import type { Metadata } from "next";
import { CalendarClient, type CalMonth } from "./calendar-client";
import cal from "@/data/calendar.json";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ইসলামিক হিজরি ক্যালেন্ডার ২০২৬ — আজকের আরবি তারিখ ও গুরুত্বপূর্ণ দিনসমূহ",
  description:
    "হিজরি ক্যালেন্ডার ২০২৬, আজকের নির্ভুল আরবি তারিখ, মাসের ছক এবং আরবি তারিখভিত্তিক ইসলামি ইতিহাসের গুরুত্বপূর্ণ ঘটনাবলী ও আমল।",
  keywords: [
    "ইসলামিক ক্যালেন্ডার",
    "আজকের আরবি তারিখ",
    "হিজরি ক্যালেন্ডার ২০২৬",
    "আরবি মাসের দিনপঞ্জি",
    "শবে বরাত",
    "শবে কদর",
    "ঈদুল ফিতর",
    "ঈদুল আজহা",
    "Islamic Calendar 2026 Bangladesh",
    "Hijri Calendar Today",
  ],
  alternates: { canonical: `${SITE_URL}/calendar` },
  openGraph: {
    title: "ইসলামিক হিজরি ক্যালেন্ডার ২০২৬ | islahbd",
    description: "আজকের আরবি তারিখ ও হিজরি ক্যালেন্ডার ২০২৬।",
    url: `${SITE_URL}/calendar`,
    type: "website",
  },
};

export default function CalendarPage() {
  return <CalendarClient months={cal.categories as CalMonth[]} source={cal.source_book} />;
}

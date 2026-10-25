import type { Metadata } from "next";
import { CalendarClient, type CalMonth } from "./calendar-client";
import cal from "@/data/calendar.json";

export const metadata: Metadata = {
  title: "ইসলামিক ক্যালেন্ডার",
  description: "হিজরি তারিখ, মাসের ছক এবং আরবি তারিখভিত্তিক ইসলামি ইতিহাসের গুরুত্বপূর্ণ ঘটনাবলী।",
};

export default function CalendarPage() {
  return <CalendarClient months={cal.categories as CalMonth[]} source={cal.source_book} />;
}

import type { Metadata } from "next";
import { QuranHome } from "./quran-home";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "আল-কুরআন — ডিজিটাল কুরআন, তাফসীর ও অডিও",
  description: "আরবি টেক্সট, শব্দে শব্দে অর্থ, বাংলা অনুবাদ, ১৪টি তাফসীর ও বিশ্বখ্যাত ক্বারীদের তিলাওয়াত।",
  alternates: { canonical: `${SITE_URL}/quran` },
};

export default function QuranPage() {
  return <QuranHome />;
}

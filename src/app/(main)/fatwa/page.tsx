import type { Metadata } from "next";
import { FatwaClient } from "./fatwa-client";
import { getFatwaCategories, getFatwas } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ইসলামিক ফতোয়া ও শরয়ী সমাধান — আপনার জিজ্ঞাসা ও মাসআলা",
  description:
    "দৈনন্দিন জীবন, নামাজ, রোজা, যাকাত ও পারিবারিক বিষয়ে হক্কানি মুফতিদের নির্ভরযোগ্য শরঈ সমাধান ও ইসলামিক ফতোয়া পড়ুন এবং সরাসরি প্রশ্ন করুন।",
  keywords: [
    "ইসলামিক ফতোয়া",
    "শরয়ী সমাধান",
    "মাসআলা জিজ্ঞাসা",
    "নামাজের মাসআলা",
    "রোযার মাসআলা",
    "কওমি মাদরাসা ফতোয়া",
    "মারকাযুল ইহসান ফতোয়া",
    "হালাল হারাম বিধান",
    "Islamic Fatwa Bangla",
  ],
  alternates: { canonical: `${SITE_URL}/fatwa` },
  openGraph: {
    title: "ইসলামিক ফতোয়া ও শরয়ী সমাধান | islahbd",
    description: "দৈনন্দিন শরয়ী মাসআলা ও নির্ভরযোগ্য মুফতিয়ানে কেরামের ফতোয়া।",
    url: `${SITE_URL}/fatwa`,
    type: "website",
  },
};

export default async function FatwaPage() {
  const [fatwas, categories] = await Promise.all([getFatwas(), getFatwaCategories()]);
  return <FatwaClient fatwas={fatwas} categories={categories} />;
}

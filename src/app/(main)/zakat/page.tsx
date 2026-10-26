import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ui";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "যাকাত ক্যালকুলেটর — সহজ ও নির্ভুল যাকাতের হিসাব ও নিসাব",
  description:
    "নগদ টাকা, স্বর্ণ, রূপা, ব্যবসার পণ্য ও ঋণ বিবেচনা করে শরিয়তসম্মতভাবে সহজে ও নির্ভুলভাবে যাকাতের পরিমাণ বের করুন ডিজিটাল যাকাত ক্যালকুলেটরে।",
  keywords: [
    "যাকাত ক্যালকুলেটর বাংলাদেশ",
    "যাকাতের নিসাব",
    "স্বর্ণের যাকাত হিসাব",
    "নগদ টাকার যাকাত",
    "যাকাত দেয়ার নিয়ম",
    "যাকাতের মাসআলা",
    "Zakat Calculator Bangladesh",
  ],
  alternates: { canonical: `${SITE_URL}/zakat` },
  openGraph: {
    title: "যাকাত ক্যালকুলেটর — সহজ ও নির্ভুল যাকাতের হিসাব ও নিসাব | islahbd",
    description: "শরিয়তের নিয়মে আপনার যাকাত নির্ভুলভাবে হিসাব করুন।",
    url: `${SITE_URL}/zakat`,
    type: "website",
  },
};

const ZAKAT_FAQS = [
  {
    question: "যাকাত কার ওপর এবং কখন ফরজ হয়?",
    answer:
      "প্রয়োজনীয় খরচের অতিরিক্ত নিসাব পরিমাণ (সাড়ে সাত তোলা স্বর্ণ বা সাড়ে বায়ান্ন তোলা রূপা বা এর সমমূল্যের নগদ অর্থ/ব্যবসায়িক সম্পদ) সম্পদের মালিক যদি পূর্ণ এক চান্দ্রবছর তা ধরে রাখেন, তবে তার ওপর ২.৫% হারে যাকাত প্রদান ফরজ।",
  },
  {
    question: "স্বর্ণ ও রূপার যাকাতের হিসাব কীভাবে করতে হয়?",
    answer:
      "বর্তমান বাজারদর অনুযায়ী আপনার মোট স্বর্ণ বা রূপার মূল্য নির্ধারণ করে তার মোট মূল্যের ২.৫% (১/৪০ অংশ) যাকাত হিসেবে প্রদান করতে হবে।",
  },
  {
    question: "ব্যবসায়িক পণ্যের যাকাত কীভাবে নির্ধারণ করব?",
    answer:
      "যাকাত হিসাবের দিনে দোকানে বা গুদামে থাকা বিক্রয়যোগ্য পণ্যের পাইকারি বাজারমূল্য এবং নগদ ক্যাশ যোগ করে, তাৎক্ষণিক প্রদেয় ঋণ বাদ দিয়ে অবশিষ্ট পরিমাণের ২.৫% যাকাত দিতে হবে।",
  },
];

// Zakat calculator is marked as coming soon while maintaining FAQ Schema for SEO
export default function ZakatPage() {
  return (
    <>
      <FaqJsonLd faqs={ZAKAT_FAQS} />
      <ComingSoon feature="zakat" />
    </>
  );
}

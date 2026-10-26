import type { Metadata } from "next";
import { LifetimeMemberClient } from "./lifetime-member-client";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `আজীবন সদস্য সম্মেলন ২০২৬ — সদকায়ে জারিয়ার অংশীদার হোন | ${SITE_NAME}`,
  description:
    "জামেআ মারকাযুল ইহসান ঢাকার আজীবন সদস্য সম্মেলন ২০২৬। প্রায় এক হাজার তালিবুল ইলমের খেদমত ও স্থায়ী কমপ্লেক্স নির্মাণে শরিক হয়ে আজীবন সদস্য হওয়ার ফায়দা জানুন এবং অনলাইনে আবেদন করুন।",
  keywords: [
    "মারকাযুল ইহসান আজীবন সদস্য",
    "সদকায়ে জারিয়া",
    "মাদরাসা মারকাযুল ইহসান ডেমরা",
    "আজীবন সদস্য সম্মেলন ২০২৬",
    "দ্বীনি খেদমত অনুদান",
    "মাদরাসা নির্মাণ অনুদান",
    "সদকা ও দান",
    "Markazul Ihsan Lifetime Member",
  ],
  alternates: { canonical: `${SITE_URL}/lifetime-member` },
  openGraph: {
    title: `আজীবন সদস্য সম্মেলন ২০২৬ | ${SITE_NAME}`,
    description: "Become a Lifetime Member of Jamea Markazul Ihsan Dhaka. Learn the benefits and apply online.",
    url: `${SITE_URL}/lifetime-member`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `আজীবন সদস্য সম্মেলন ২০২৬ | ${SITE_NAME}`,
    description: "Become a Lifetime Member of Jamea Markazul Ihsan Dhaka. Learn the benefits and apply online.",
  },
};

const LIFETIME_FAQS = [
  {
    question: "মারকাযুল ইহসানের আজীবন সদস্য হওয়ার ফায়দা কি?",
    answer:
      "জামেআ মারকাযুল ইহসানের প্রায় এক হাজার তালিবুল ইলমের কুরআন শিক্ষা ও দ্বীনি শিক্ষার নিরবচ্ছিন্ন খেদমতে আপনার দান সদকায়ে জারিয়া হিসেবে অব্যাহত থাকবে, এমনকি মৃত্যুর পরও যার সওয়াব পৌঁছাবে ইনশাআল্লাহ।",
  },
  {
    question: "আজীবন সদস্য হতে কত অনুদান দিতে হয়?",
    answer:
      "যেকোনো সক্ষম দ্বীনদার ব্যক্তি সামর্থ্য অনুযায়ী এককালীন বা বাৎসরিক কিস্তিতে আজীবন সদস্য হতে পারেন। অনলাইনে বিভিন্ন স্তরের সদস্যপদের বিস্তারিত বিবরণ ও ফরম রয়েছে।",
  },
  {
    question: "অনলাইনে আজীবন সদস্যের অনুদান কীভাবে পাঠানো যায়?",
    answer:
      "ওয়েবসাইটের মাধ্যমে বিকাশ (bKash), নগদ, রকেট অথবা সরাসরি ব্যাংক একাউন্ট ও SSLCommerz গেটওয়ের মাধ্যমে নিরাপদে অনুদান প্রদান ও সদস্য নিবন্ধন করা যায়।",
  },
];

export default function LifetimeMemberPage() {
  return (
    <>
      <FaqJsonLd faqs={LIFETIME_FAQS} />
      <LifetimeMemberClient />
    </>
  );
}

import type { Metadata } from "next";
import { AboutClient } from "./about-client";
import { MadrasaLocalBusinessJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "মাদরাসা মারকাযুল ইহসান পরিচিতি — জামেআ মারকাযুল ইহসান ঢাকা",
  description:
    "জামেআ মারকাযুল ইহসান ঢাকা — প্রতিষ্ঠা, প্রায় এক হাজার শিক্ষার্থীর দ্বীনি শিক্ষা কার্যক্রম, ডেমরায় স্থায়ী কমপ্লেক্স, যোগাযোগ ও অনুদান।",
  keywords: [
    "মাদরাসা মারকাযুল ইহসান",
    "মারকাজুল ইহসান ডেমরা",
    "জামেআ মারকাযুল ইহসান",
    "হযরত মাওলানা তৈয়্যেব আশরাফ",
    "কওমি মাদরাসা ঢাকা",
    "মারকাযুল ইহসান পরিচিতি",
    "Markazul Ihsan Dhaka",
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "মাদরাসা মারকাযুল ইহসান পরিচিতি | islahbd",
    description: "জামেআ মারকাযুল ইহসান ঢাকা — ইতিহাস, শিক্ষা কার্যক্রম ও কমপ্লেক্স নির্মাণ।",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <MadrasaLocalBusinessJsonLd />
      <AboutClient />
    </>
  );
}

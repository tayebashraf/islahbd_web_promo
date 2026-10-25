import type { Metadata } from "next";
import { KhidmatClient } from "./khidmat-client";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `তোলাবায়ে কেরামের খেদমত ফান্ড | ${SITE_NAME}`,
  description:
    "জামেআ মারকাযুল ইহসান ঢাকা — তোলাবায়ে কেরামের খেদমত ও যাকাত ফান্ড। সহজে বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে অনুদান পাঠিয়ে রশীদ সংগ্রহ করুন।",
  alternates: { canonical: `${SITE_URL}/khidmat` },
  openGraph: {
    title: `তোলাবায়ে কেরামের খেদমত ফান্ড | ${SITE_NAME}`,
    description:
      "জামেআ মারকাযুল ইহসান ঢাকা — তোলাবায়ে কেরামের খেদমত ও যাকাত ফান্ড।",
    url: `${SITE_URL}/khidmat`,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function KhidmatPage() {
  return <KhidmatClient />;
}

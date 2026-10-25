import type { Metadata } from "next";
import { MoreClient } from "./more-client";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "অন্যান্য — সকল দ্বীনি সেবা ও ফিচার",
  description: "ইসলাহ-র সকল দ্বীনি ফিচার, সেবা, কুরআন, আমল, বয়ান, লাইব্রেরি ও খিদমত একসাথে।",
  alternates: { canonical: `${SITE_URL}/more` },
};

export default function MorePage() {
  return <MoreClient />;
}

import type { Metadata } from "next";
import { MalfuzatClient } from "./malfuzat-client";
import { getMalfuzat } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "মালফুযাত — হযরতের বাণী",
  description: "হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের মালফুযাত ও নসীহত।",
  alternates: { canonical: `${SITE_URL}/malfuzat` },
};

export default async function MalfuzatPage() {
  const malfuzat = await getMalfuzat();
  return <MalfuzatClient malfuzat={malfuzat} />;
}

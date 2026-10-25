import type { Metadata } from "next";
import { QiblaClient } from "./qibla-client";

export const metadata: Metadata = {
  title: "কিবলা",
  description: "আপনার অবস্থান থেকে কিবলার দিক ও মক্কার দূরত্ব — মোবাইলে কম্পাসসহ।",
};

export default function QiblaPage() {
  return <QiblaClient />;
}

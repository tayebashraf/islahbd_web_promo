import type { Metadata } from "next";
import { ZakatClient } from "./zakat-client";

export const metadata: Metadata = {
  title: "যাকাত ক্যালকুলেটর",
  description: "নগদ টাকা, স্বর্ণ, রূপা, ব্যবসার পণ্য ও দেনা হিসাব করে সহজে যাকাতের পরিমাণ বের করুন।",
};

export default function ZakatPage() {
  return <ZakatClient />;
}

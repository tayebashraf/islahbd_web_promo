import type { Metadata } from "next";
import { RamadanClient } from "./ramadan-client";

export const metadata: Metadata = {
  title: "রমজান",
  description: "রমজানের সাহরি ও ইফতারের সময়সূচি, কাউন্টডাউন, রোজার নিয়ত ও ইফতারের দোয়া।",
};

export default function RamadanPage() {
  return <RamadanClient />;
}

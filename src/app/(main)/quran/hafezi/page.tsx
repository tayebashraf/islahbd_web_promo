import type { Metadata } from "next";
import { HafeziReader } from "./hafezi-reader";

export const metadata: Metadata = {
  title: "হাফেজী কুরআন — ১৫ লাইনের মুদ্রিত পৃষ্ঠা",
  description: "১৫ লাইনের হাফেজী কুরআন শরীফ — সূরা, পারা ও পৃষ্ঠা অনুযায়ী তিলাওয়াত করুন।",
};

export default function HafeziPage() {
  return <HafeziReader />;
}

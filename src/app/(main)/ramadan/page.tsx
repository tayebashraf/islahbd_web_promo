import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/ui";

export const metadata: Metadata = {
  title: "রমজান — শীঘ্রই আসছে",
  description: "রমজানের সাহরি ও ইফতারের সময়সূচি — শীঘ্রই আসছে।",
};

// The timetable (./ramadan-client.tsx) is kept for later; the feature is marked coming soon.
export default function RamadanPage() {
  return <ComingSoon feature="ramadan" />;
}

import type { Metadata } from "next";
import { ListenClient } from "./listen-client";
import { getBoyans, getRecurringMajlis } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "লাইভ শুনুন — সরাসরি সম্প্রচার",
  description:
    "ইসলাহবিডির সরাসরি লাইভ অডিও সম্প্রচার ব্রাউজারে শুনুন — ওয়াজ, বয়ান ও মজলিশ।",
  alternates: { canonical: `${SITE_URL}/listen` },
  openGraph: {
    title: `লাইভ শুনুন | ${SITE_NAME}`,
    description: "সরাসরি লাইভ অডিও সম্প্রচার ব্রাউজারে শুনুন।",
    url: `${SITE_URL}/listen`,
  },
};

export const revalidate = 120;

export default async function ListenPage() {
  const [boyans, majlis] = await Promise.all([getBoyans(), getRecurringMajlis()]);
  return (
    <ListenClient
      recentBoyans={boyans.slice(0, 3)}
      majlis={majlis.filter((m) => m.is_active).sort((a, b) => a.order - b.order)}
    />
  );
}

import type { Metadata } from "next";
import { ListenClient } from "./listen-client";
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

export default function ListenPage() {
  return <ListenClient />;
}

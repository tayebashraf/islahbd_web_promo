import type { Metadata } from "next";
import { LifetimeMemberClient } from "./lifetime-member-client";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `আজীবন সদস্য সম্মেলন ২০২৬ | ${SITE_NAME}`,
  description:
    "জামেআ মারকাযুল ইহসান ঢাকার আজীবন সদস্য সম্মেলন ২০২৬। আজীবন সদস্য হওয়ার ফায়দা জানুন এবং অনলাইনে আবেদন করুন।",
  alternates: { canonical: `${SITE_URL}/lifetime-member` },
  openGraph: {
    title: `আজীবন সদস্য সম্মেলন ২০২৬ | ${SITE_NAME}`,
    description: "Become a Lifetime Member of Jamea Markazul Ihsan Dhaka. Learn the benefits and apply online.",
    url: `${SITE_URL}/lifetime-member`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `আজীবন সদস্য সম্মেলন ২০২৬ | ${SITE_NAME}`,
    description: "Become a Lifetime Member of Jamea Markazul Ihsan Dhaka. Learn the benefits and apply online.",
  },
};

export default function LifetimeMemberPage() {
  return <LifetimeMemberClient />;
}

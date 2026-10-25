import type { Metadata } from "next";
import { NoticesClient } from "./notices-client";
import { getNotices } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "নোটিশ বোর্ড",
  description: "জামেআ মারকাযুল ইহসান ও islahbd-এর সর্বশেষ ঘোষণা।",
  alternates: { canonical: `${SITE_URL}/notices` },
};

export default async function NoticesPage() {
  const notices = await getNotices();
  return <NoticesClient notices={notices} />;
}

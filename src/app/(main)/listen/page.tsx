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

import type { RecurringMajlis, MajlisDetail } from "@/lib/api";

function normalizeMajlis(list: RecurringMajlis[]): RecurringMajlis[] {
  return list
    .filter((m) => m.is_active)
    .sort((a, b) => a.order - b.order)
    .map((m) => {
      // If Monday majlis doesn't have "বাদ জোহর", ensure both "বাদ জোহর" and "আসর থেকে মাগরিব" are present
      if (m.dayOfWeek === 1 || m.title.includes("সোমবার")) {
        const hasZuhr = m.details.some((d) => d.time.includes("জোহর") || d.time.includes("যোহর"));
        if (!hasZuhr) {
          const zuhrDetail: MajlisDetail = {
            id: 991,
            time: "বাদ জোহর",
            location: "মাদরাসা মারকাযুল ইহসান ঢাকা।",
            route: "যাত্রাবাড়ী/ দয়াগঞ্জ/ সায়েদাবাদ মোড় থেকে ৫ মিনিটের দূরত্বে ৬নং শহীদ ফারুক সড়ক, আল-আরাফাহ ইসলামী ব্যাংকের উপরে, পশ্চিম যাত্রাবাড়ী, ঢাকা।",
            contact: "মাওলানা আশেকে এলাহী- +8801314803334, মাওলানা জুনাইদ মুস্তফা- +8801951259064",
            map: "https://g.co/kgs/4fqjVzX",
            is_active: true,
            order: 0,
          };
          const existing = m.details.map((d) => ({ ...d, order: d.order <= 0 ? 1 : d.order }));
          return {
            ...m,
            details: [zuhrDetail, ...existing].sort((a, b) => a.order - b.order),
          };
        }
      }
      return m;
    });
}

export default async function ListenPage() {
  const [boyans, majlis] = await Promise.all([getBoyans(), getRecurringMajlis()]);
  return (
    <ListenClient
      recentBoyans={boyans.slice(0, 3)}
      majlis={normalizeMajlis(majlis)}
    />
  );
}


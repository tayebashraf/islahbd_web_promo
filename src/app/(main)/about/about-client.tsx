"use client";

import Link from "next/link";
import { Building2, CalendarDays, ExternalLink, GraduationCap, Images, LandPlot, MapPin, MessageCircle, Users } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel, PanelHeader } from "@/components/dashboard/ui";
import { DonationCard } from "../paribar/paribar-client";
import { DONATION } from "@/data/paribar";
import { LINKS } from "@/lib/nav";

export function AboutClient() {
  const { t } = useLang();
  const stats = [
    { icon: CalendarDays, v: t("২০১৮", "2018"), l: t("প্রতিষ্ঠাকাল", "Founded") },
    { icon: Users, v: t("প্রায় ১০০০", "~1,000"), l: t("শিক্ষার্থী", "Students") },
    { icon: GraduationCap, v: t("হিফয — দাওরা", "Hifz — Dawrah"), l: t("শিক্ষা স্তর", "Levels") },
    { icon: LandPlot, v: t("১ একর ৪৩ শতাংশ", "1.43 acres"), l: t("স্থায়ী কমপ্লেক্সের জমি", "Permanent campus land") },
  ];
  return (
    <div>
      <PageHeader
        title={t("জামেআ মারকাযুল ইহসান ঢাকা", "Jamia Markazul Ihsan Dhaka")}
        muted={t("দ্বীনের তরে • দেশের তরে", "For the deen • for the nation")}
      />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.l} className="rounded-2xl border border-line bg-panel p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-icon-bg text-brand">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-lg font-semibold text-ink">{s.v}</p>
            <p className="text-sm text-ink-3">{s.l}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Panel className="p-5 sm:p-7">
            <PanelHeader icon={Building2} title={t("আমাদের সম্পর্কে", "About us")} />
            <div className="mt-4 space-y-4 text-[16.5px] leading-[1.95] text-ink-2">
              <p>
                {t(
                  "মাদরাসা মারকাযুল ইহসান ঢাকা ২০১৮ সালে হযরত মাওলানা শাহ তৈয়্যেব আশরাফ সাহেব দামাত বারাকাতুহুমের হাতে প্রতিষ্ঠিত। তিনি প্রতিষ্ঠাতা প্রিন্সিপাল, মোতাওয়াল্লী ও শিক্ষা-পরিচালক হিসেবে নিষ্ঠা ও আমানতদারিতার সঙ্গে দায়িত্ব পালন করছেন।",
                  "Madrasa Markazul Ihsan Dhaka was founded in 2018 by Hazrat Mawlana Shah Tayeb Ashraf Saheb (db), who serves as its founding principal, mutawalli and director of education.",
                )}
              </p>
              <p>
                {t(
                  "দ্বীনি শিক্ষা, আদব-আখলাক, আত্মশুদ্ধি (তাযকিয়া) এবং সুন্নাহভিত্তিক জীবন গঠনের কেন্দ্র হিসেবে প্রতিষ্ঠানটি সুপরিচিত। পশ্চিম যাত্রাবাড়ীর দুটি অস্থায়ী ভবনে প্রায় এক হাজার শিক্ষার্থীর দ্বীনি শিক্ষার ব্যবস্থা চলছে।",
                  "The madrasa is known as a centre for religious learning, good character, tazkiyah and a Sunnah-based life. Nearly a thousand students study in two temporary buildings in West Jatrabari.",
                )}
              </p>
              <p>
                {t(
                  "স্থায়ী কমপ্লেক্সের জন্য ডেমরা থানার পাইটি এলাকায় প্রায় ১ একর ৪৩ শতাংশ জমি ক্রয় করা হয়েছে। সেখানে মসজিদ ও মাদরাসার অস্থায়ী ভবনে শত শত তালিবুল ইলমের শিক্ষা এবং এলাকাবাসীর নামাজ ও কুরআন শিক্ষার ব্যবস্থা চালু আছে।",
                  "About 1.43 acres have been bought in Paiti, Demra for the permanent campus, where a mosque and temporary buildings already serve hundreds of students and local worshippers.",
                )}
              </p>
              <p>
                {t(
                  "প্রতি ইংরেজি মাসের তৃতীয় বৃহস্পতিবার ইসলাহী মজলিস অনুষ্ঠিত হয়, যেখানে দেশের বিভিন্ন অঞ্চল থেকে দ্বীনদার মুসলমানগণ অংশ নেন।",
                  "An islahi majlis is held on the third Thursday of every month, attended by people from across the country.",
                )}
              </p>
            </div>
          </Panel>

          <Panel>
            <PanelHeader icon={MapPin} title={t("ঠিকানা", "Address")} />
            <ul className="mt-4 space-y-3">
              <Address
                title={t("বর্তমান ক্যাম্পাস", "Current campus")}
                text={t("৬ নং শহীদ ফারুক সড়ক, পশ্চিম যাত্রাবাড়ী, ঢাকা", "6 Shahid Faruk Road, West Jatrabari, Dhaka")}
                q="Shahid Faruk Road, West Jatrabari, Dhaka"
              />
              <Address title={t("স্থায়ী কমপ্লেক্স (নির্মাণাধীন)", "Permanent campus (under construction)")} text={t("পাইটি, ডেমরা, ঢাকা", "Paiti, Demra, Dhaka")} q="Paiti, Demra, Dhaka" />
            </ul>
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-panel-2">
              <iframe
                title="Jamea Markazul Ihsan Permanent Campus Map"
                src="https://maps.google.com/maps?q=Paiti,+Demra,+Dhaka&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full opacity-90 transition hover:opacity-100"
              />
            </div>
          </Panel>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <DonationCard />
          <Panel>
            <p className="text-[16.5px] font-semibold text-ink">{t("যোগাযোগ", "Contact")}</p>
            <a href={`https://wa.me/${DONATION.contact.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-3 rounded-xl border border-line p-3 hover:border-brand/40">
              <MessageCircle className="h-5 w-5 text-brand" />
              <span className="font-num text-[15px] text-ink" dir="ltr">
                {DONATION.contact}
              </span>
            </a>
            <a href="https://www.markazulihsan.com/" target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-3 rounded-xl border border-line p-3 hover:border-brand/40">
              <ExternalLink className="h-5 w-5 text-brand" />
              <span className="text-[15px] text-ink">markazulihsan.com</span>
            </a>
            <Link href={LINKS.gallery.href} className="mt-2 flex items-center gap-3 rounded-xl border border-line p-3 hover:border-brand/40">
              <Images className="h-5 w-5 text-brand" />
              <span className="text-[15px] text-ink">{t("ক্যাম্পাসের ছবি দেখুন", "See campus photos")}</span>
            </Link>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Address({ title, text, q }: { title: string; text: string; q: string }) {
  const { t } = useLang();
  return (
    <li className="flex items-start gap-3 rounded-xl bg-panel-2 p-4">
      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-ink-3">{title}</span>
        <span className="block text-[16px] text-ink">{text}</span>
      </span>
      <a href={`https://www.google.com/maps/search/${encodeURIComponent(q)}`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm text-brand hover:underline">
        {t("ম্যাপে দেখুন", "Map")}
      </a>
    </li>
  );
}

import type { Metadata } from "next";
import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title: "মাদরাসা পরিচিতি",
  description: "জামেআ মারকাযুল ইহসান ঢাকা — প্রতিষ্ঠা, শিক্ষা কার্যক্রম, স্থায়ী কমপ্লেক্স, যোগাযোগ ও অনুদান।",
};

export default function AboutPage() {
  return <AboutClient />;
}

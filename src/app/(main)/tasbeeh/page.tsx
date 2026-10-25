import type { Metadata } from "next";
import { TasbeehClient } from "./tasbeeh-client";

export const metadata: Metadata = {
  title: "তাসবীহ",
  description: "ডিজিটাল তাসবীহ — সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার, ইস্তিগফার ও দরূদ গণনা করুন।",
};

export default function TasbeehPage() {
  return <TasbeehClient />;
}

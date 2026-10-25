"use client";

import { useState } from "react";
import { Calculator, Info } from "lucide-react";
import { useLang } from "@/components/providers/lang-provider";
import { PageHeader, Panel, PanelHeader } from "@/components/dashboard/ui";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

// Nisab: 52.5 tola (bhori) of silver or 7.5 tola of gold; 1 tola ≈ 11.664 g.
const SILVER_NISAB_BHORI = 52.5;
const GOLD_NISAB_BHORI = 7.5;

type Field = { key: string; bn: string; en: string; unit?: "bhori" };

const ASSETS: Field[] = [
  { key: "cash", bn: "হাতে নগদ টাকা", en: "Cash in hand" },
  { key: "bank", bn: "ব্যাংক / মোবাইল ব্যাংকিংয়ে জমা", en: "Bank & mobile wallet balance" },
  { key: "goldBhori", bn: "স্বর্ণ (ভরি)", en: "Gold (tola)", unit: "bhori" },
  { key: "goldPrice", bn: "প্রতি ভরি স্বর্ণের বিক্রয়মূল্য", en: "Gold sale price per tola" },
  { key: "silverBhori", bn: "রূপা (ভরি)", en: "Silver (tola)", unit: "bhori" },
  { key: "silverPrice", bn: "প্রতি ভরি রূপার বিক্রয়মূল্য", en: "Silver sale price per tola" },
  { key: "business", bn: "ব্যবসার পণ্যের বাজারমূল্য", en: "Market value of trade goods" },
  { key: "receivable", bn: "অন্যের কাছে পাওনা (ফেরত পাওয়ার আশা আছে)", en: "Money owed to you (recoverable)" },
  { key: "other", bn: "অন্যান্য যাকাতযোগ্য সম্পদ", en: "Other zakatable assets" },
];
const DEBTS: Field[] = [{ key: "debt", bn: "পরিশোধযোগ্য দেনা / ঋণ", en: "Debts due now" }];

export function ZakatClient() {
  const { t, lang } = useLang();
  const [v, setV] = useState<Record<string, string>>({});
  const n = (k: string) => Math.max(0, Number(v[k]?.replace(/,/g, "")) || 0);

  const gold = n("goldBhori") * n("goldPrice");
  const silver = n("silverBhori") * n("silverPrice");
  const assets = n("cash") + n("bank") + gold + silver + n("business") + n("receivable") + n("other");
  const net = Math.max(0, assets - n("debt"));
  // Hanafi: the lower (silver) nisab applies once any cash or mixed assets are held.
  const nisab = n("silverPrice") ? SILVER_NISAB_BHORI * n("silverPrice") : n("goldPrice") ? GOLD_NISAB_BHORI * n("goldPrice") : 0;
  const due = nisab > 0 && net >= nisab ? net * 0.025 : 0;
  const money = (x: number) => `৳ ${num(Math.round(x).toLocaleString("en-IN"), lang)}`;

  const input = (f: Field) => (
    <label key={f.key} className="block">
      <span className="mb-1.5 block text-[15px] text-ink-2">{t(f.bn, f.en)}</span>
      <input
        inputMode="decimal"
        value={v[f.key] ?? ""}
        onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value.replace(/[^\d.,]/g, "") }))}
        placeholder={f.unit ? t("যেমন ২", "e.g. 2") : "0"}
        className="h-12 w-full rounded-xl border border-line bg-panel px-4 text-[16px] text-ink outline-none focus:border-brand"
      />
    </label>
  );

  return (
    <div>
      <PageHeader
        title={t("যাকাত ক্যালকুলেটর", "Zakat calculator")}
        muted={t("সম্পদের ২.৫% — নিসাব পূর্ণ হলে", "2.5% of wealth — once it reaches nisab")}
        description={t("এক চান্দ্র বছর পূর্ণ হওয়া সম্পদের হিসাব লিখুন। স্বর্ণ-রূপার দাম বাজুসের আজকের বিক্রয়মূল্য দেখে লিখুন।", "Enter wealth held for a full lunar year. Use today's sale price for gold and silver.")}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        <Panel>
          <PanelHeader icon={Calculator} title={t("আপনার সম্পদ", "Your assets")} />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{ASSETS.map(input)}</div>
          <div className="mt-6 border-t border-line pt-5">
            <p className="mb-3 text-[15px] font-semibold text-ink">{t("বাদ যাবে", "Deduct")}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{DEBTS.map(input)}</div>
          </div>
        </Panel>

        <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="hero-surface relative overflow-hidden rounded-2xl p-6">
            <div className="star-lattice pointer-events-none absolute inset-0 opacity-[0.08]" />
            <p className="relative text-sm text-white/80">{t("আপনার যাকাত", "Your zakat")}</p>
            <p className="relative mt-1 font-num text-[40px] leading-tight font-semibold">{money(due)}</p>
            <p className={cn("relative mt-2 text-sm", due ? "text-gold-light" : "text-white/75")}>
              {!nisab
                ? t("নিসাব হিসাবের জন্য রূপা বা স্বর্ণের দাম লিখুন", "Enter the silver or gold price to work out nisab")
                : due
                  ? t("নিসাব পূর্ণ হয়েছে — যাকাত ফরজ", "Nisab reached — zakat is due")
                  : t("নিসাব পূর্ণ হয়নি — যাকাত ফরজ নয়", "Below nisab — no zakat due")}
            </p>
          </section>
          <Panel>
            <Row label={t("মোট সম্পদ", "Total assets")} value={money(assets)} />
            <Row label={t("দেনা বাদে নিট সম্পদ", "Net after debts")} value={money(net)} />
            <Row label={t("নিসাব", "Nisab")} value={nisab ? money(nisab) : "—"} />
          </Panel>
          <p className="flex gap-2 rounded-xl bg-gold-soft p-4 text-sm leading-relaxed text-ink-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {t(
              "নিসাব: সাড়ে বায়ান্ন ভরি রূপা বা সাড়ে সাত ভরি স্বর্ণ। নগদ টাকা বা মিশ্র সম্পদ থাকলে রূপার নিসাব ধরা হয়। বিস্তারিত মাসআলার জন্য “শরঈ জিজ্ঞাসা”য় প্রশ্ন করুন।",
              "Nisab is 52.5 tola of silver or 7.5 tola of gold; with cash or mixed assets the silver nisab applies. Ask a mufti for details.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-2.5 last:border-0">
      <span className="text-[15px] text-ink-2">{label}</span>
      <span className="font-num text-[15px] font-semibold text-ink">{value}</span>
    </div>
  );
}

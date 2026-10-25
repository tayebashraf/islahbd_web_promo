"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, MessageCircleQuestion, Send } from "lucide-react";
import { askFatwa, type Fatwa, type FatwaCategory } from "@/lib/api";
import { useLang } from "@/components/providers/lang-provider";
import { Chip, EmptyState, PageHeader, Panel, PanelHeader, SearchInput } from "@/components/dashboard/ui";
import { formatDate, num } from "@/lib/format";
import { cn } from "@/lib/utils";

export function FatwaClient({ fatwas, categories }: { fatwas: Fatwa[]; categories: FatwaCategory[] }) {
  const { t, lang } = useLang();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Fatwa["id"] | null>(null);
  const shown = fatwas.filter(
    (f) => (cat === "all" || f.category === cat) && (!q.trim() || f.question.includes(q.trim()) || f.answer.includes(q.trim())),
  );

  return (
    <div>
      <PageHeader
        eyebrow={t("মাসআলা", "Q&A")}
        title={t("শরঈ জিজ্ঞাসা", "Ask a Mufti")}
        muted={t(`${num(fatwas.length, lang)}টি উত্তর`, `${fatwas.length} answers`)}
        description={t("আপনার শরঈ প্রশ্ন পাঠান — ফতোয়া বিভাগ উত্তর দেবেন। উত্তরপ্রাপ্ত প্রশ্নগুলো নিচে পড়ুন।", "Send your question — the fatwa department will answer.")}
        actions={<SearchInput value={q} onChange={setQ} placeholder={t("প্রশ্ন খুঁজুন…", "Search questions…")} />}
      />

      <div className="grid gap-4 sm:gap-5 xl:grid-cols-12">
        <Panel className="xl:col-span-7">
          <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>
              {t("সব", "All")}
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} active={cat === c.name_bn} onClick={() => setCat(c.name_bn)}>
                {c.name_bn}
              </Chip>
            ))}
          </div>
          <div className="mt-4">
            {shown.length === 0 ? (
              <EmptyState
                icon={MessageCircleQuestion}
                title={t("এখনো কোনো উত্তর প্রকাশিত হয়নি", "No published answers yet")}
                hint={t("প্রশ্ন পাঠান — উত্তর প্রকাশিত হলে এখানে দেখা যাবে।", "Send a question — answers appear here once published.")}
              />
            ) : (
              <ul className="space-y-2">
                {shown.map((f) => {
                  const expanded = open === f.id;
                  return (
                    <li key={f.id} className="overflow-hidden rounded-2xl bg-panel-2">
                      <button onClick={() => setOpen(expanded ? null : f.id)} aria-expanded={expanded} className="flex w-full items-start gap-3 p-4 text-start">
                        <span className="mt-0.5 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">{t("প্রশ্ন", "Q")}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink">{f.question}</span>
                          <span className="mt-1 block text-xs text-ink-3">
                            {f.category} · {formatDate(f.createdAt, lang)}
                          </span>
                        </span>
                        <ChevronDown className={cn("h-5 w-5 shrink-0 text-ink-3 transition", expanded && "rotate-180")} />
                      </button>
                      {expanded && (
                        <div className="border-t border-line bg-panel p-4">
                          <p className="text-sm leading-relaxed whitespace-pre-line text-ink-2">{f.answer}</p>
                          {(f.answeredByName || f.answeredBy) && <p className="mt-3 text-xs font-medium text-brand">— {f.answeredByName || f.answeredBy}</p>}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Panel>

        <AskForm categories={categories} />
      </div>
    </div>
  );
}

function AskForm({ categories }: { categories: FatwaCategory[] }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [anon, setAnon] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(categories[0]?.name_bn ?? "অন্যান্য");
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 10) return;
    setState("sending");
    try {
      await askFatwa({
        name: anon ? "নাম প্রকাশে অনিচ্ছুক" : name.trim() || "নাম প্রকাশে অনিচ্ছুক",
        isAnonymous: anon,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        category,
        question: question.trim(),
      });
      setState("done");
      setQuestion("");
    } catch {
      setState("error");
    }
  };

  const input = "h-11 w-full rounded-2xl border border-line bg-panel-2 px-4 text-sm text-ink outline-none focus:border-brand";

  return (
    <Panel className="h-fit xl:sticky xl:top-5 xl:col-span-5">
      <PanelHeader icon={Send} title={t("প্রশ্ন পাঠান", "Send a question")} subtitle={t("উত্তর পেতে কিছুদিন সময় লাগতে পারে", "Answers may take a few days")} />
      {state === "done" ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-brand-soft p-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-brand" />
          <p className="font-semibold text-ink">{t("আপনার প্রশ্ন পাঠানো হয়েছে", "Your question was sent")}</p>
          <p className="text-xs text-ink-2">{t("জাযাকাল্লাহু খাইরান। উত্তর প্রকাশিত হলে এখানে দেখা যাবে।", "JazakAllah khair. The answer will appear here once published.")}</p>
          <button onClick={() => setState("idle")} className="mt-1 h-10 rounded-full bg-panel px-5 text-sm font-medium text-ink">
            {t("আরেকটি প্রশ্ন", "Ask another")}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input className={input} placeholder={t("আপনার নাম", "Your name")} value={name} onChange={(e) => setName(e.target.value)} disabled={anon} />
            <select className={input} value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t("বিভাগ", "Category")}>
              {categories.map((c) => (
                <option key={c.id} value={c.name_bn}>
                  {c.name_bn}
                </option>
              ))}
              <option value="অন্যান্য">{t("অন্যান্য", "Other")}</option>
            </select>
            <input className={input} type="tel" placeholder={t("মোবাইল (ঐচ্ছিক)", "Phone (optional)")} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className={input} type="email" placeholder={t("ইমেইল (ঐচ্ছিক)", "Email (optional)")} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <textarea
            className={cn(input, "h-36 resize-none py-3")}
            placeholder={t("আপনার প্রশ্ন বিস্তারিত লিখুন…", "Write your question in detail…")}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            minLength={10}
          />
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2">
            <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
            {t("নাম প্রকাশ করতে চাই না", "Keep me anonymous")}
          </label>
          {state === "error" && <p className="text-sm text-live">{t("পাঠানো যায়নি — আবার চেষ্টা করুন", "Couldn't send — please try again")}</p>}
          <button
            type="submit"
            disabled={state === "sending" || question.trim().length < 10}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white transition hover:bg-brand-strong disabled:opacity-50"
          >
            {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {t("প্রশ্ন পাঠান", "Send question")}
          </button>
        </form>
      )}
    </Panel>
  );
}

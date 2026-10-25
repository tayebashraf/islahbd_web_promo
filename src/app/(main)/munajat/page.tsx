import type { Metadata } from "next";
import { BookReader, type Book } from "@/components/book/book-reader";
import { bnNum } from "@/lib/format";
import munajat from "@/data/munajat.json";

export const metadata: Metadata = {
  title: "মুনাজাতে মাকবুল",
  description: "হাকীমুল উম্মত থানভী রহ. সংকলিত মুনাজাতে মাকবুল — সপ্তাহের সাত মঞ্জিল, আরবি ও বাংলা অনুবাদসহ।",
};

interface Section {
  id: string;
  title: string;
  subtitle?: string;
  dayName?: string;
  dayOfWeek: number;
  items: { id: string; n: number; ar?: string; bn: string; ref?: string; note?: string }[];
}

const book: Book = {
  title: "মুনাজাতে মাকবুল",
  source_book: "মুনাজাতে মাকবুল",
  author: "হাকীমুল উম্মত হযরত মাওলানা আশরাফ আলী থানভী রহ.",
  categories: (munajat as Section[]).map((s) => ({
    id: s.id,
    title: s.dayOfWeek ? `${s.title} · ${s.dayName}` : s.title,
    subtitle: s.subtitle,
    items: s.items.map((i) => ({
      id: i.id,
      serial: i.n > 0 ? bnNum(i.n) : "•",
      title: "",
      amal_text: i.ar ? [{ arabic: i.ar, bangla_translation: i.bn }] : undefined,
      fazilat: i.ar ? undefined : i.bn,
      reference: i.ref || i.note,
    })),
  })),
};

export default async function MunajatPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  // Manzils are read one per weekday (Saturday first); dayOfWeek is 1 = Monday … 7 = Sunday.
  const jsDay = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })).getDay();
  const today = (munajat as Section[]).find((s) => s.dayOfWeek === (jsDay === 0 ? 7 : jsDay))?.id;
  return (
    <BookReader
      book={book}
      initialCat={c ?? today}
      highlight={today}
      title={["মুনাজাতে মাকবুল", "Munajat-e-Maqbul"]}
      unit={["মুনাজাত", "supplications"]}
    />
  );
}

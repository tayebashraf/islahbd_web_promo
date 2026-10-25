import type { Metadata } from "next";
import { BookReader, type Book } from "@/components/book/book-reader";
import hajj from "@/data/hajj.json";

export const metadata: Metadata = {
  title: "হজ্জ ও উমরাহ",
  description: "তামাত্তু হজ ও ওমরাহর ধাপে ধাপে সম্পূর্ণ গাইড — দোআ, নিয়ম ও আদব সহ।",
};

export default async function HajjPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return <BookReader book={hajj as Book} initialCat={c} title={["হজ্জ ও উমরাহ", "Hajj & Umrah"]} unit={["বিষয়", "topics"]} />;
}

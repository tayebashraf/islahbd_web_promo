import type { Metadata } from "next";
import { BookReader, type Book } from "@/components/book/book-reader";
import dua from "@/data/dua.json";

export const metadata: Metadata = {
  title: "দোয়া",
  description: "খাযায়েনে কোরআন ও হাদীছ থেকে বিষয়ভিত্তিক ও দৈনন্দিন মাসনূন দোয়া — আরবি, অনুবাদ ও ফযীলতসহ।",
};

export default async function DuaPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return <BookReader book={dua as Book} initialCat={c} title={["দোয়া", "Duas"]} unit={["দোয়া", "duas"]} />;
}

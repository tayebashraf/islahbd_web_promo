import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POEMS, POETS, poemById } from "@/lib/poems";
import { PoemView } from "./poem-view";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = poemById((await params).id);
  return p ? { title: `${p.title} — ${p.poet_name}`, description: p.bangla_translation.slice(0, 160) } : {};
}

export default async function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poem = poemById(id);
  if (!poem) notFound();
  const siblings = POEMS.filter((p) => p.poet_id === poem.poet_id);
  const i = siblings.findIndex((p) => p.id === id);
  const poet = POETS.find((p) => p.id === poem.poet_id);
  return (
    <PoemView
      poem={poem}
      poetEra={poet?.era}
      prev={siblings[i - 1] ? { id: siblings[i - 1].id, title: siblings[i - 1].title } : undefined}
      next={siblings[i + 1] ? { id: siblings[i + 1].id, title: siblings[i + 1].title } : undefined}
    />
  );
}

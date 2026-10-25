// Imported only from server components, so the 600 KB of poems never ships to the browser.
import akhtar from "@/data/poems-akhtar.json";
import spiritual from "@/data/poems-spiritual.json";

export interface Poet {
  id: string;
  name: string;
  title: string;
  era: string;
  famous_books: string[];
}

export interface Poem {
  id: string;
  title: string;
  poet_id: string;
  poet_name: string;
  book_source: string;
  original_text: string;
  original_language: string;
  bangla_translation: string;
  sharh?: string;
}

export const POETS: Poet[] = spiritual.categories as Poet[];

/** Hakim Akhtar's complete collection (with sharh) replaces his subset in the anthology. */
export const POEMS: Poem[] = [...(akhtar.poems as Poem[]), ...(spiritual.poems as Poem[]).filter((p) => p.poet_id !== "hakim_akhtar")];

export const poemById = (id: string) => POEMS.find((p) => p.id === id);

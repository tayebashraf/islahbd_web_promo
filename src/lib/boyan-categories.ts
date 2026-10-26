import type { Boyan, BoyanCategory } from "@/lib/api";

const norm = (s: string) => (s || "").replace(/\s+/g, " ").trim();

/** Boyans whose category is none of the admin's categories are listed last under this. */
export const GENERAL_CATEGORY = "সাধারণ";

/** The category a boyan is listed under: its own when the admin has it, else সাধারণ. */
export function boyanCategoryOf(categories: BoyanCategory[]) {
  const known = new Set(categories.map((c) => norm(c.name)));
  return (b: Pick<Boyan, "category">) => {
    const name = norm(b.category);
    // Without the category list (fetch failed) keep each boyan's own name.
    return name && (known.has(name) || known.size === 0) ? name : GENERAL_CATEGORY;
  };
}

/** [category, count] in the admin's order, সাধারণ last. */
export function boyanCategoryCounts(boyans: Boyan[], categories: BoyanCategory[]): [string, number][] {
  const categoryOf = boyanCategoryOf(categories);
  const counts = new Map<string, number>();
  for (const b of boyans) counts.set(categoryOf(b), (counts.get(categoryOf(b)) ?? 0) + 1);
  const order = new Map(categories.map((c) => [norm(c.name), c.order]));
  const rank = (name: string) => (name === GENERAL_CATEGORY ? Infinity : (order.get(name) ?? 99));
  return [...counts.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || b[1] - a[1]);
}

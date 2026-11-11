import { describe, expect, it } from "vitest";

import { articles, getArticle } from "@/data/articles";
import { pillars } from "@/data/hub";

// Cards in the pillar trays link by slug, so a typo or a dropped article silently
// breaks a card. Every slug referenced by the hub must resolve to a real article.
describe("Hub content", () => {
  it("resolves every tray slug to a real article", () => {
    const slugs = pillars.flatMap((p) => p.trays.flatMap((t) => t.slugs));
    expect(slugs.length).toBeGreaterThan(0);

    const missing = slugs.filter((s) => !getArticle(s));
    expect(missing).toEqual([]);
  });

  it("keeps the cultured-foods tray on the individual fermented foods", () => {
    const tray = pillars
      .find((p) => p.slug === "nutrition")!
      .trays.find((t) => t.name === "Gut & Cultured Foods")!;

    expect(tray.slugs).toEqual(
      expect.arrayContaining([
        "cultured-foods",
        "milk-kefir",
        "water-kefir",
        "fermented-vegetables",
        "probiotic-yogurts",
        "kimchi",
        "kombucha",
        "probiotics",
      ]),
    );
  });

  it("keeps every article with body content and a unique slug", () => {
    expect(articles.length).toBeGreaterThan(25);

    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(articles.filter((a) => a.blocks.length === 0).map((a) => a.slug)).toEqual([]);
  });
});

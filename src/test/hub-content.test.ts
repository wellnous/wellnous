import { describe, expect, it } from "vitest";

import { articles, getArticle } from "@/data/articles";
import { pillars } from "@/data/hub";
import { relatedSlugs, readingSections, recipeSlugs } from "@/data/article-presentation";
import { blogPosts } from "@/data/blog";

// Cards in the pillar trays link by slug, so a typo or a dropped article silently
// breaks a card. Every slug referenced by the hub must resolve to a real article.
describe("Hub content", () => {
  it("places probiotics first in the cultured-foods tray", () => {
    const tray = pillars.find((p) => p.slug === "nutrition")?.trays.find((t) => t.name === "Gut & Cultured Foods");
    expect(tray?.slugs[0]).toBe("probiotics");
  });

  it("keeps each recipe method as ordered source steps", () => {
    for (const slug of recipeSlugs) {
      const article = getArticle(slug);
      expect(article).toBeDefined();
      const methods = readingSections(article?.blocks ?? []).filter((s) => s.mode === "steps");
      expect(methods.length).toBeGreaterThan(0);
      expect(methods.every((s) => s.blocks.some((b) => b.type === "step"))).toBe(true);
    }
  });

  it("keeps fermented-food recommendations relevant and resolvable", () => {
    const milk = getArticle("milk-kefir");
    if (!milk) throw new Error("Milk kefir is missing");
    expect(relatedSlugs(milk, [])).toEqual(["water-kefir", "probiotic-yogurts", "fermented-vegetables", "cultured-foods"]);
    for (const article of articles) expect(relatedSlugs(article, []).filter((s) => !getArticle(s))).toEqual([]);
  });

  it("retains the ten original blog posts separately from reference articles", () => {
    expect(blogPosts).toHaveLength(10);
    expect(blogPosts.every((p) => p.article.blocks.length > 0 && p.sourceUrl.startsWith("https://wellnous.godaddysites.com/blog/f/"))).toBe(true);
  });
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

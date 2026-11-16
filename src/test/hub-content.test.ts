import { describe, expect, it } from "vitest";

import { articles, getArticle } from "@/data/articles";
import { pillars, quickWins } from "@/data/hub";
import { relatedSlugs, readingSections, recipeSlugs } from "@/data/article-presentation";
import { blogPosts } from "@/data/blog";

// Cards in the pillar trays link by slug, so a typo or a dropped article silently
// breaks a card. Every slug referenced by the hub must resolve to a real article.
describe("Hub content", () => {
  it("places probiotics first in the cultured-foods tray", () => {
    const tray = pillars.find((p) => p.slug === "nutrition")?.trays.find((t) => t.name === "Cultured Foods");
    expect(tray?.slugs[0]).toBe("probiotics");
  });

  it("orders the fermented foods as milk kefir, kombucha, kimchi, vegetables, water kefir and yogurts", () => {
    const tray = pillars.find((p) => p.slug === "nutrition")?.trays.find((t) => t.name === "Cultured Foods");
    expect(tray?.slugs.slice(2, 8)).toEqual(["milk-kefir", "kombucha", "kimchi", "fermented-vegetables", "water-kefir", "probiotic-yogurts"]);
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

  it("retains all 21 original blog posts separately from reference articles", () => {
    expect(blogPosts).toHaveLength(22);
    expect(blogPosts[0]?.title).toBe("Children's Food: Are We Being Sold a Healthy Illusion?");
    expect(blogPosts.every((p) => p.article.blocks.length > 0 && (!p.sourceUrl || p.sourceUrl.startsWith("https://wellnous.godaddysites.com/blog/f/")))).toBe(true);
  });
  it("files Ayurveda under Mental Health and keeps Ayurveda and toxins out of Nutrition", () => {
    const slugsOf = (k: string) => pillars.find((p) => p.slug === k)?.trays.flatMap((t) => t.slugs) ?? [];
    expect(slugsOf("nutrition")).not.toContain("ayurveda");
    expect(slugsOf("nutrition")).not.toContain("hidden-toxins");
    expect(slugsOf("nutrition")).not.toContain("reducing-our-toxic-burden");
    expect(slugsOf("mind")).toEqual(expect.arrayContaining(["mental-wellbeing", "ayurveda", "the-art-of-doing-nothing", "breathwork", "barefoot-walking"]));
    expect(slugsOf("physical")).toContain("ayurveda");
  });

  it("splits Hidden Toxins into four Environment & Toxins articles", () => {
    const tray = pillars.find((p) => p.slug === "physical")?.trays.find((t) => t.name === "Environment & Toxins");
    expect(tray?.slugs).toEqual(["reducing-our-toxic-burden", "food-additives-and-gut-health", "the-air-we-breathe", "skincare-cosmetics-and-sunscreen"]);
    expect(getArticle("hidden-toxins")).toBeUndefined();
    expect(getArticle("reducing-our-toxic-burden")?.title).toBe("Reducing Our Toxic Burden");
    expect(getArticle("food-additives-and-gut-health")?.title).toBe("Food Additives and Gut Health");
    expect(getArticle("the-air-we-breathe")?.title).toBe("The Air We Breathe");
    expect(getArticle("skincare-cosmetics-and-sunscreen")?.title).toBe("Skincare, Cosmetics and Sunscreen");
    for (const slug of tray!.slugs) {
      const a = getArticle(slug)!;
      expect(a.blocks.length).toBeGreaterThan(10);
      expect(a.standfirst.length).toBeGreaterThan(0);
    }
  });

  it("files Sitting on the Floor under Movement with its own readable article", () => {
    const tray = pillars.find((p) => p.slug === "physical")?.trays.find((t) => t.name === "Movement");
    expect(tray?.slugs).toContain("sitting-on-the-floor");
    const article = getArticle("sitting-on-the-floor");
    expect(article?.title).toBe("Sitting on the Floor");
    expect(article?.standfirst).toBe("Encouraging Natural Mobility, Strength and Postural Awareness");
    expect(article?.blocks.filter((b) => b.type === "h" && b.level === 2).map((b) => b.text)).toEqual([
      "The Importance of Getting Down – and Getting Back Up",
      "A Simple Habit Worth Developing",
      "A Note on Safety",
    ]);
    expect(relatedSlugs(article!, [])).toEqual(["physical-wellbeing", "barefoot-walking", "flow-rope"]);
  });

  it("drops the Supplements section and files creatine and omega-3 under Nutrition", () => {
    expect(pillars.map((p) => p.slug)).not.toContain("supplements");
    const tray = pillars.find((p) => p.slug === "nutrition")?.trays.find((t) => t.name === "Supplements");
    expect(tray?.slugs).toEqual(["creatine", "omega-3"]);
    for (const s of ["nac", "supplements-and-adaptogens", "adaptogens"]) expect(getArticle(s)).toBeUndefined();
  });

  it("points flow rope readers to YouTube instead of external links", () => {
    const text = getArticle("flow-rope")!.blocks.map((b) => b.text).join(" ");
    expect(text).toContain("flow rope on YouTube");
    expect(text).not.toContain("](http");
  });

  it("links every quick win to a real article", () => {
    expect(quickWins.map((q) => q.label)).toEqual([
      "Morning sun exposure",
      "Eat real foods",
      "Move more",
      "Walk after meals",
      "Protein at breakfast to stay fuller for longer",
      "Finish eating 2–3 hours before bed to aid sleep",
      "Consume a fermented food",
      "Breathe deeply for 2 min",
      "Don't heat food in plastic containers",
    ]);
    expect(quickWins.filter((q) => !getArticle(q.slug)).map((q) => q.label)).toEqual([]);
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
      .trays.find((t) => t.name === "Cultured Foods")!;

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

describe("Swapped grounding articles", () => {
  it("links Ayurveda's breathing section to the Breathwork article", async () => {
    const { getArticle } = await import("@/data/articles");
    const text = getArticle("ayurveda")!.blocks.map((b) => b.text).join(" ");
    expect(text).toContain("](/articles/breathwork)");
    expect(getArticle("barefoot-walking")!.title).toBe("The Science of Reconnecting with Nature");
    expect(getArticle("sleep-strategies")!.title).toBe("Optimising Sleep");
  });
});

describe("nutrition tray order", () => {
  it("puts Supplements last with Seasonal & Traditional directly under Cultured Foods", () => {
    const names = pillars.find((p) => p.slug === "nutrition")!.trays.map((t) => t.name);
    expect(names).toEqual(["Foundations", "Fibre & Plant Power", "Cultured Foods", "Seasonal & Traditional", "Supplements"]);
  });
});

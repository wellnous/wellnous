import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getArticle } from "@/data/articles";
import { ArticleBody } from "@/components/ArticleBody";

// The Kombucha sales page tells a product story, so its cards must not read as a
// numbered sequence. The homemade-brewing article is a method and keeps its steps.
describe("Kombucha presentation", () => {
  it("shows the sales-page cards without step numbers", () => {
    const article = getArticle("wellnous-kombucha");
    if (!article) throw new Error("Wellnous Kombucha is missing");

    const { container } = render(<ArticleBody article={article} />);

    expect(container.querySelectorAll('span[class*="bg-primary/12"]')).toHaveLength(0);
    expect(screen.getByText("Truly Unpasteurised")).toBeInTheDocument();
  });

  it("keeps the homemade brewing method numbered", () => {
    const article = getArticle("kombucha");
    if (!article) throw new Error("Kombucha is missing");

    const { container } = render(<ArticleBody article={article} />);

    expect(container.querySelectorAll("ol.recipe-steps li").length).toBeGreaterThan(0);
  });

  // The infrared deep dive is the reference layout for a "fancier" article: a
  // key-points box, numbered research boxes and clickable further reading.
  it("presents the infrared deep dive with key points, numbered boxes and linked reading", () => {
    const article = getArticle("infra-red-exposure");
    if (!article) throw new Error("Infrared article is missing");

    const { container } = render(<ArticleBody article={article} />);

    expect(screen.getByRole("heading", { name: "Key points" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mitochondria and cellular energy" })).toBeInTheDocument();
    expect(container.querySelectorAll("a[href*='pubmed'], a[href*='pmc']")).toHaveLength(4);
  });

  // Floor sitting must not read as an invitation to strain a joint.
  it("leads the floor-sitting safety note with risk and professional guidance", () => {
    const article = getArticle("sitting-on-the-floor");
    if (!article) throw new Error("Sitting on the Floor is missing");

    render(<ArticleBody article={article} />);

    expect(screen.getByText(/don't do anything that could put yourself at risk/)).toBeInTheDocument();
    expect(screen.getByText(/work with a health care professional/)).toBeInTheDocument();
  });

  // The veggie page is three methods, not one long recipe: each must read as its
  // own box, with its own steps, and the old "ferment anything" opener must stay gone.
  it("presents cultured vegetables as three separate method boxes", () => {
    const article = getArticle("fermented-vegetables");
    if (!article) throw new Error("Fermented Vegetables is missing");

    const { container } = render(<ArticleBody article={article} />);

    for (const title of ["Fermented Garlic Honey", "Fermenting With Just Salt (Simple Sauerkraut)", "Fermenting Using Whey (Mixed Summer Vegetables)"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    // 7 garlic-honey steps + 9 salt steps + 4 whey steps, each inside its own box.
    expect(container.querySelectorAll("ol.recipe-steps")).toHaveLength(3);
    expect(container.querySelectorAll("ol.recipe-steps li")).toHaveLength(20);
    expect(screen.getByText("1 shredded corguette")).toBeInTheDocument();
    expect(screen.queryByText(/basically ferment anything/)).toBeNull();
  });

  // The microbiome overview is reference reading, not a recipe: its numbered
  // sections must stay full-width prose, with the three definitions as cards.
  it("presents the microbiome overview as definition cards, prose sections and pull quotes", () => {
    const article = getArticle("prebiotics-probiotics-and-postbiotics");
    if (!article) throw new Error("The microbiome article is missing");

    const { container } = render(<ArticleBody article={article} />);

    for (const definition of ["Prebiotics – the nourishment", "Probiotics – the living microorganisms", "Postbiotics – beneficial microbial preparations"]) {
      expect(screen.getByText(definition)).toBeInTheDocument();
    }
    for (const heading of ["1. Prebiotics: feeding the ecosystem", "2. Probiotics: introducing beneficial microbes", "3. Postbiotics and the hidden chemistry of the microbiome", "4. Supporting your microbiome through food"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    // Sub-headings beneath section 3 stay readable rather than becoming boxes.
    for (const sub of ["The best known: butyrate", "An emerging discovery: urolithin A", "Beyond what we know"]) {
      expect(screen.getByRole("heading", { name: sub })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "The Wellnous Takeaway" })).toBeInTheDocument();
    // The two emphasis lines read as pull quotes, and nothing is boxed two-up.
    expect(container.querySelectorAll("blockquote")).toHaveLength(2);
    expect(container.querySelectorAll(".md\\:grid-cols-2")).toHaveLength(0);
  });
});

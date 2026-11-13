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
});

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
});

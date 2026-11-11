import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { blogPosts } from "@/data/blog";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("opens each original blog post independently of the blog directory", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const post of blogPosts) {
      const matches = router.matchRoutes(`/blog/${post.slug}`);
      expect(matches.at(-1)?.routeId).toBe("/blog_/$slug");
      expect(matches.some((match) => match.routeId === "/blog")).toBe(false);
    }
  });
});

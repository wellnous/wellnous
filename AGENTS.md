<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Article content lives verbatim in src/content/wellnous_articles.md and is split into pages by src/data/articles.ts; pillar trays reference articles by slug in src/data/hub.ts — keeps the author's text as the single source of truth.
- Feeding Your Body uses stacked full-width section cards in ArticleBody rather than length-based card grouping, so long and short topics share one readable layout without changing the archive text.
- Article presentation policies select editorial sections or recipe methods explicitly; numbered source blocks retain their sequence so instructions do not become decorative cards.
- Original blog posts have their own content collection and reading routes; the topic directory is separate so author posts are not confused with reference articles.
- Blog reading pages use the non-nested `blog_.$slug` route convention so the directory cannot hide the selected post.

import { Link } from "@tanstack/react-router";
import type { Tray } from "@/data/hub";
import { getArticle, type Article } from "@/data/articles";
import { Clock, BookOpen } from "lucide-react";
import logo from "@/assets/wellnous_logo.png.asset.json";

function Brand({ size = "h-9" }: { size?: string }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src={logo.url} alt="Wellnous logo" className={`${size} w-auto`} />
      <span className="font-display text-2xl font-semibold tracking-tight text-primary">Wellnous</span>
    </Link>
  );
}

export function SiteHeader() {
  const cls = "text-sm text-muted-foreground hover:text-foreground transition-colors";
  const act = { className: "text-foreground font-medium" };
  return (
    <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-3">
        <Brand />
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link to="/nutrition" className={cls} activeProps={act}>Nutrition</Link>
          <Link to="/physical" className={cls} activeProps={act}>Physical</Link>
          <Link to="/supplements" className={cls} activeProps={act}>Supplements</Link>
          <Link to="/blog" className={cls} activeProps={act}>Blog</Link>
          <Link to="/topics" className={cls} activeProps={act}>Topic Library</Link>
          <Link to="/about" className={cls} activeProps={act}>About</Link>
          <Link to="/kombucha" className="rounded-full bg-amber px-3 py-1 text-xs font-medium text-amber-foreground">Kombucha</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted-foreground">
        <Brand size="h-12" />
        <p className="mt-4 max-w-xl">Educational content only — not medical advice. Talk to a qualified professional before changing your diet, exercise or supplements.</p>
      </div>
    </footer>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{children}</span>;
}

export function TopicCard({ article, index }: { article: Article; index: number }) {
  return (
    <Link to="/articles/$slug" params={{ slug: article.slug }} className="group flex w-72 shrink-0 snap-start flex-col rounded-2xl border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1 sm:w-80">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-display text-3xl text-sage/50">{String(index + 1).padStart(2, "0")}</span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.minutes} min</span>
          {article.refCount > 0 && <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{article.refCount} refs</span>}
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-card-foreground">{article.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      <div className="mt-auto pt-5">
        {article.chips.length > 0 && <>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-deep">Inside this article</p>
          <div className="flex flex-wrap gap-1.5">{article.chips.map((c) => <Chip key={c}>{c}</Chip>)}</div>
        </>}
        <p className="mt-4 text-sm font-medium text-primary">Read article <span className="inline-block transition-transform group-hover:translate-x-1">→</span></p>
      </div>
    </Link>
  );
}

export function TrayRow({ tray }: { tray: Tray }) {
  const list = tray.slugs.map(getArticle).filter((a): a is Article => !!a);
  return (
    <section className="mt-12">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-5">
        <h2 className="font-display text-2xl font-semibold">{tray.name}</h2>
        <span className="text-xs text-muted-foreground">{list.length} articles · scroll →</span>
      </div>
      <div className="tray mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4" style={{ paddingInline: "max(1.25rem, calc((100vw - 72rem) / 2 + 1.25rem))" }}>
        {list.map((a, i) => <TopicCard key={a.slug} article={a} index={i} />)}
      </div>
    </section>
  );
}

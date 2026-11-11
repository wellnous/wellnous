import { Link } from "@tanstack/react-router";
import { pillars, type Pillar } from "@/data/hub";
import { SiteHeader, SiteFooter, TrayRow, Chip } from "./HubUI";

export function PillarPage({ slug }: { slug: Pillar["slug"] }) {
  const p = pillars.find((x) => x.slug === slug)!;
  const others = pillars.filter((x) => x.slug !== slug);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-deep">{p.tagline}</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">{p.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{p.intro}</p>
        <div className="mt-6 flex flex-wrap gap-2">{p.trays.map((t) => <Chip key={t.name}>{t.name}</Chip>)}</div>
      </section>
      {p.trays.map((t) => <TrayRow key={t.name} tray={t} />)}
      <section className="mx-auto mt-16 grid max-w-6xl gap-4 px-5 sm:grid-cols-2">
        {others.map((o) => (
          <Link key={o.slug} to={`/${o.slug}`} className="rounded-2xl border bg-muted p-6 transition-colors hover:bg-secondary">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Keep exploring</p>
            <p className="mt-1 font-display text-2xl font-semibold">{o.title} →</p>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}

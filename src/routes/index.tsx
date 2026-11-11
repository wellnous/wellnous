import { createFileRoute, Link } from "@tanstack/react-router";
import { pillars, quickWins } from "@/data/hub";
import { SiteHeader, SiteFooter, TrayRow, Chip } from "@/components/HubUI";
import { Leaf, Activity, Pill, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Wellnous — Health & Wellness Knowledge Hub" },
    { name: "description", content: "Digestible, card-based guides to everyday nutrition, physical protocols and supplements." },
    { property: "og:title", content: "Wellnous — Health & Wellness Knowledge Hub" },
    { property: "og:description", content: "Digestible, card-based guides to everyday nutrition, physical protocols and supplements." },
  ]}),
  component: Index,
});

const icons = { nutrition: Leaf, physical: Activity, supplements: Pill };

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0 -z-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 sm:pt-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-deep">The Wellnous knowledge hub</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Wellness, one <em className="text-primary">small card</em> at a time.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">Clear, practical lessons on what you eat, how you move and what you supplement — built to skim, save and actually use.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/nutrition" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Start learning <ArrowRight className="h-4 w-4" /></Link>
            <a href="#quick-wins" className="rounded-full border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary">Quick wins</a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 md:grid-cols-3">
        {pillars.map((p) => { const I = icons[p.slug]; const n = p.trays.reduce((a, t) => a + t.topics.length, 0); return (
          <Link key={p.slug} to={`/${p.slug}`} className="group rounded-3xl border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary"><I className="h-5 w-5" /></span>
            <h2 className="mt-5 font-display text-2xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.intro}</p>
            <p className="mt-5 flex items-center justify-between text-sm font-medium text-primary">{n} topic cards <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p>
          </Link>
        ); })}
      </section>

      <section id="quick-wins" className="mx-auto mt-16 max-w-6xl px-5">
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
          <h2 className="font-display text-3xl font-semibold">Today's quick wins</h2>
          <p className="mt-2 text-primary-foreground/80">Pick one. Do it today. That's the whole plan.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {quickWins.map((q) => <span key={q} className="rounded-full bg-primary-foreground/15 px-4 py-2 text-sm">{q}</span>)}
          </div>
        </div>
      </section>

      {pillars.map((p) => (
        <div key={p.slug}>
          <div className="mx-auto mt-20 flex max-w-6xl items-end justify-between px-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-deep">{p.tagline}</p>
              <h2 className="font-display text-4xl font-semibold">{p.title}</h2>
            </div>
            <Link to={`/${p.slug}`} className="text-sm font-medium text-primary hover:underline">See all →</Link>
          </div>
          <TrayRow tray={p.trays[0]} />
        </div>
      ))}

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <Link to="/kombucha" className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber/40 bg-amber/10 p-6 sm:flex-row sm:items-center">
          <div>
            <Chip>From our kitchen</Chip>
            <p className="mt-2 font-display text-xl font-semibold">Wellnous Kombucha — small-batch, naturally fermented.</p>
          </div>
          <span className="text-sm font-medium text-amber-deep">Learn more →</span>
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}

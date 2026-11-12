import { createFileRoute, Link } from "@tanstack/react-router";
import { pillars, quickWins } from "@/data/hub";
import { SiteHeader, SiteFooter, TrayRow, Chip } from "@/components/HubUI";
import logo from "@/assets/wellnous_logo.png.asset.json";
import { Leaf, Activity, Pill, Brain, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Wellnous — Health & Wellness Knowledge Hub" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "description", content: "Bridging health science and everyday life — practical, science-informed approaches to nutrition, movement and supplements." },
    { property: "og:title", content: "Wellnous — Health & Wellness Knowledge Hub" },
    { property: "og:description", content: "Bridging the gap between health, science and everyday life — practical, science-informed approaches to nutrition, movement and supplements." },
  ]}),
  component: Index,
});

const icons = { nutrition: Leaf, physical: Activity, mind: Brain, supplements: Pill };

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0 -z-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 sm:pt-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-deep">A Holistic and Practical approach to Wellbeing </p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,12vw,8rem)] font-semibold uppercase leading-[0.85] tracking-tight text-primary">
            Wellnous
          </h1>
          <img src={logo.url} alt="" aria-hidden className="pointer-events-none absolute right-5 top-16 hidden w-80 opacity-90 lg:block" />
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">Wellnous combines <span className="font-medium text-foreground">"Well"</span> for wellbeing and <span className="font-medium text-foreground">"Nous"</span> — an ancient Greek word associated with wisdom, understanding, and insight.</p>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">Practical, science-informed approaches to help you build resilience and take control of your health in achievable ways.</p>
          <p className="mt-4 text-sm text-muted-foreground">Founded by <span className="font-medium text-foreground">Kristina Crimp</span>, Scientist and Cambridge Natural Sciences graduate.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/nutrition" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Start learning <ArrowRight className="h-4 w-4" /></Link>
            <a href="#quick-wins" className="rounded-full border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary">Quick wins</a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => { const I = icons[p.slug]; const n = p.trays.reduce((a, t) => a + t.slugs.length, 0); return (
          <Link key={p.slug} to={`/${p.slug}`} className="group rounded-3xl border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary"><I className="h-5 w-5" /></span>
            <h2 className="mt-5 font-display text-2xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.intro}</p>
            <p className="mt-5 flex items-center justify-between text-sm font-medium text-primary">{n} articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p>
          </Link>
        ); })}
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <Link to="/articles/$slug" params={{ slug: "mitochondrial-health" }} className="group grid gap-6 rounded-3xl border bg-card p-8 shadow-soft transition-transform hover:-translate-y-1 sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/20 text-amber-deep"><Zap className="h-7 w-7" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-deep">Featured deep dive</p>
            <h2 className="mt-1 font-display text-3xl font-semibold">The Mitochondria Crisis</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Why cellular energy matters more than we think — the threats, nine simple actions to protect it, and the science inside the cell.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </Link>
      </section>

      <section id="quick-wins" className="mx-auto mt-16 max-w-6xl px-5">
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
          <h2 className="font-display text-3xl font-semibold">Today's quick wins</h2>
          <p className="mt-2 text-primary-foreground/80">Small, evidence-informed habits compound over time. Choose one and begin today.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {quickWins.map((q) => (
              <Link
                key={q.label}
                to="/articles/$slug"
                params={{ slug: q.slug }}
                className="rounded-full border border-primary-foreground/25 bg-primary-foreground/15 px-4 py-2 text-sm transition-colors hover:bg-primary-foreground/30 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
              >
                {q.label}
              </Link>
            ))}
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
          {p.trays[0] && <TrayRow tray={p.trays[0]} />}
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

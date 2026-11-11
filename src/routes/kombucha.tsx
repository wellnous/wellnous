import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, Chip } from "@/components/HubUI";

export const Route = createFileRoute("/kombucha")({
  head: () => ({ meta: [
    { title: "Wellnous Kombucha — Small-batch fermented tea" },
    { name: "description", content: "Wellnous Kombucha: naturally fermented, small-batch tea with live cultures." },
    { property: "og:title", content: "Wellnous Kombucha" },
    { property: "og:description", content: "Naturally fermented, small-batch tea with live cultures." },
  ]}),
  component: Kombucha,
});

function Kombucha() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-5 pt-16">
        <Chip>A little side project</Chip>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">Wellnous Kombucha</h1>
        <p className="mt-4 text-lg text-muted-foreground">Our small-batch kombucha puts the fermented-foods lessons from the hub into a bottle: real tea, live cultures and a gentle fizz.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[["Live cultures", "Unpasteurised and naturally fermented."], ["Low sugar", "Most sugar is eaten by the culture."], ["Small batch", "Brewed slowly, by hand."]].map(([t, d]) => (
            <div key={t} className="rounded-2xl border bg-card p-5"><p className="font-display text-lg font-semibold">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
        <Link to="/nutrition" className="mt-10 inline-block text-sm font-medium text-primary hover:underline">← Read about gut health & fermented foods</Link>
      </section>
      <SiteFooter />
    </div>
  );
}

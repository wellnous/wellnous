import { createFileRoute } from "@tanstack/react-router";
import { PillarPage } from "@/components/PillarPage";

export const Route = createFileRoute("/supplements")({
  head: () => ({ meta: [
    { title: "Supplements — Wellnous Knowledge Hub" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "description", content: "Evidence-minded cards on vitamin D, magnesium, omega-3s, adaptogens and buying smart." },
    { property: "og:title", content: "Supplements — Wellnous" },
    { property: "og:description", content: "Evidence-minded cards on vitamin D, magnesium, omega-3s, adaptogens and buying smart." },
  ]}),
  component: () => <PillarPage slug="supplements" />,
});

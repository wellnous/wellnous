import { createFileRoute } from "@tanstack/react-router";
import { PillarPage } from "@/components/PillarPage";

export const Route = createFileRoute("/physical")({
  head: () => ({ meta: [
    { title: "Physical Protocols — Wellnous Knowledge Hub" },
    { name: "description", content: "Simple routines for strength, cardio, sleep, light, breath and mitochondrial health." },
    { property: "og:title", content: "Physical Protocols — Wellnous" },
    { property: "og:description", content: "Simple routines for strength, cardio, sleep, light, breath and mitochondrial health." },
  ]}),
  component: () => <PillarPage slug="physical" />,
});

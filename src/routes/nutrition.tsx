import { createFileRoute } from "@tanstack/react-router";
import { PillarPage } from "@/components/PillarPage";

export const Route = createFileRoute("/nutrition")({
  head: () => ({ meta: [
    { title: "Everyday Nutrition — Wellnous Knowledge Hub" },
    { name: "description", content: "Bite-sized guides to balanced plates, gut health, fermented foods and hidden toxins." },
    { property: "og:title", content: "Everyday Nutrition — Wellnous" },
    { property: "og:description", content: "Bite-sized guides to balanced plates, gut health, fermented foods and hidden toxins." },
  ]}),
  component: () => <PillarPage slug="nutrition" />,
});

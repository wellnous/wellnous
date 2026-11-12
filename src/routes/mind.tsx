import { createFileRoute } from "@tanstack/react-router";
import { PillarPage } from "@/components/PillarPage";

export const Route = createFileRoute("/mind")({
  head: () => ({ meta: [
    { title: "Mental Health — Wellnous Knowledge Hub" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "description", content: "Science-informed practices for mental wellbeing, restorative sleep and Ayurvedic tradition." },
    { property: "og:title", content: "Mental Health — Wellnous" },
    { property: "og:description", content: "Science-informed practices for mental wellbeing, restorative sleep and Ayurvedic tradition." },
  ]}),
  component: () => <PillarPage slug="mind" />,
});

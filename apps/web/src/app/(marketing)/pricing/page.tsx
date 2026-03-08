import { DetailPage } from "@/components/marketing/detail-page";

export default function PricingPage() {
  return (
    <DetailPage
      eyebrow="Pricing"
      title="Pricing built for institutional growth"
      description="Choose the rollout model that matches your campus size, module scope, implementation depth, and governance needs."
      sections={[
        { title: "Starter Campus", body: "Core student, attendance, and communication workflows for smaller institutions." },
        { title: "Growth Institution", body: "Adds mentor workflows, dashboards, and reporting depth for expanding campuses." },
        { title: "Enterprise Multi-Campus", body: "Supports advanced integrations, governance, and cross-campus control." }
      ]}
    />
  );
}


import { DetailPage } from "@/components/marketing/detail-page";

export default function BlogPage() {
  return (
    <DetailPage
      eyebrow="Blog"
      title="Content that helps institutions modernize faster"
      description="Use thought leadership, SEO content, and implementation guides to generate demand and educate university buying committees."
      sections={[
        { title: "SEO articles", body: "Capture traffic around university ERP, attendance, analytics, and mentor workflows." },
        { title: "Case studies", body: "Show measurable improvements in operational efficiency and student visibility." },
        { title: "Lead nurturing", body: "Bridge awareness into demo bookings with useful educational content." }
      ]}
    />
  );
}


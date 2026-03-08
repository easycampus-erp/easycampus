import { DetailPage } from "@/components/marketing/detail-page";

export default function AnalyticsPage() {
  return (
    <DetailPage
      eyebrow="Analytics"
      title="Decision-ready academic intelligence"
      description="Turn operational data into action with dashboards for performance, attendance, department health, and mentor effectiveness."
      sections={[
        { title: "Student performance", body: "Track marks, GPA trends, and subject-level risk signals." },
        { title: "Attendance analytics", body: "Compare compliance by student, section, subject, and department." },
        { title: "Executive reporting", body: "Surface the institutional metrics leadership cares about." }
      ]}
    />
  );
}


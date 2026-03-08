import { DetailPage } from "@/components/marketing/detail-page";

export default function AboutPage() {
  return (
    <DetailPage
      eyebrow="About EasyCampus"
      title="Built for the complexity of higher education"
      description="EasyCampus gives universities one operating system for academic operations, student support, mentorship, and institutional intelligence."
      sections={[
        { title: "Mission", body: "Help institutions operate with clarity, speed, and accountability across every academic workflow." },
        { title: "Who it serves", body: "Universities, colleges, institutes, departments, administrators, faculty, mentors, and students." },
        { title: "Why it matters", body: "Disconnected systems reduce visibility and slow down student support when timing matters most." }
      ]}
    />
  );
}


import { DetailPage } from "@/components/marketing/detail-page";

export default function MentorManagementPage() {
  return (
    <DetailPage
      eyebrow="Mentor Management"
      title="Structured mentorship at institutional scale"
      description="Allocate mentors intelligently, record meetings consistently, and surface at-risk students early with one shared system."
      sections={[
        { title: "Mentor allocation", body: "Map mentors to departments, sections, and student groups using configurable rules." },
        { title: "Meeting tracker", body: "Capture notes, action items, risk levels, and follow-up timelines." },
        { title: "Mentorship analytics", body: "Measure activity, intervention coverage, and student outcomes." }
      ]}
    />
  );
}


import { DetailPage } from "@/components/marketing/detail-page";

export default function UniversityErpPage() {
  return (
    <DetailPage
      eyebrow="University ERP"
      title="The operating backbone for academic institutions"
      description="EasyMentor ERP connects student management, mentor workflows, attendance, academics, examinations, communication, and analytics into one command center."
      sections={[
        { title: "Student management", body: "Profiles, enrollment, course mapping, and academic records." },
        { title: "Academic system", body: "Departments, courses, semesters, subjects, credits, and results." },
        { title: "Analytics", body: "Performance, attendance, mentorship outcomes, and executive insight." }
      ]}
    />
  );
}


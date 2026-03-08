import { DetailPage } from "@/components/marketing/detail-page";

export default function StudentManagementPage() {
  return (
    <DetailPage
      eyebrow="Student Management"
      title="The connected record for every student journey"
      description="Centralize admissions, enrollment, course mapping, academic records, attendance visibility, and communication in one trusted system."
      sections={[
        { title: "Profile and identity", body: "Create a reliable student master with guardian and enrollment context." },
        { title: "Academic journey", body: "Track semester progression, subjects, marks, and history." },
        { title: "Cross-role visibility", body: "Give admins, faculty, mentors, and students access to the right context." }
      ]}
    />
  );
}


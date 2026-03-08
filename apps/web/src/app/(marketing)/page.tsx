import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureSection } from "@/components/marketing/feature-section";
import { Hero } from "@/components/marketing/hero";

const problemItems = [
  { title: "Manual processes", body: "Admissions, attendance, mentor mapping, and reporting are still slowed down by spreadsheets and fragmented approvals." },
  { title: "Data silos", body: "Departments, faculty, and administration often work from disconnected records with no shared context." },
  { title: "Poor student tracking", body: "Attendance, academic performance, and interventions are hard to correlate before issues escalate." },
  { title: "Mentorship gaps", body: "Institutions rarely have structured workflows for mentor assignment, meetings, and follow-up actions." },
  { title: "Attendance issues", body: "Defaulter reporting is delayed and attendance capture is inconsistent across classes and labs." },
  { title: "Unified solution", body: "EasyCampus connects the full academic ecosystem with shared workflows and analytics." }
];

const moduleItems = [
  { title: "Student Management", body: "Profiles, enrollment, course mapping, records, and lifecycle events." },
  { title: "Mentor Management", body: "Mentor allocation, student groups, meeting logs, and intervention tracking." },
  { title: "Attendance System", body: "Lecture and lab attendance with threshold alerts and analytics." },
  { title: "Academic Analytics", body: "Performance trends, risk indicators, and department benchmarking." },
  { title: "Communication", body: "Notices, announcements, mentor messages, and smart reminders." },
  { title: "Department Management", body: "Programs, sections, academic structures, and governance controls." }
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureSection title="Universities deserve better than disconnected systems" description="EasyCampus replaces fragmented portals and spreadsheet-heavy workflows with one intelligent operating system." items={problemItems} />
      <FeatureSection title="Core modules built for the academic ecosystem" description="Every major workflow is designed for administrators, faculty, mentors, students, and leadership." items={moduleItems} />
      <CtaBanner />
    </>
  );
}


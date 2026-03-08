import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureSection } from "@/components/marketing/feature-section";
import { Hero } from "@/components/marketing/hero";

const problemItems = [
  { title: "Manual processes", body: "Admissions, attendance, mentor mapping, and reporting still slow down because they move across spreadsheets, emails, and fragmented approvals." },
  { title: "Data silos", body: "Departments, faculty, mentors, and leadership often operate from disconnected records with no shared operational context." },
  { title: "Poor student tracking", body: "Attendance, performance, and interventions are difficult to correlate before a student slips into serious academic risk." },
  { title: "Mentorship gaps", body: "Most institutions lack structured mentor allocation, meeting workflows, and follow-up visibility across cohorts." },
  { title: "Attendance issues", body: "Defaulter monitoring is delayed when attendance capture is inconsistent across lectures, labs, and sections." },
  { title: "Communication overload", body: "Announcements and reminders lose impact when messages are spread across too many tools and no one system owns accountability." }
];

const moduleItems = [
  { title: "Student Management", body: "Profiles, enrollment, lifecycle records, academic progression, and institutional master data." },
  { title: "Mentor Management", body: "Mentor allocation, student groups, meeting logs, risk flags, and intervention tracking." },
  { title: "Attendance System", body: "Lecture and lab attendance with threshold alerts, defaulter visibility, and corrective workflows." },
  { title: "Academic Analytics", body: "Performance trends, risk indicators, GPA views, and department benchmarking for leadership teams." },
  { title: "Communication", body: "Notices, announcements, mentor communication, scheduled notifications, and operational messaging." },
  { title: "Department Management", body: "Academic structures, courses, sections, subject catalogs, governance rules, and institution settings." }
];

const benefitItems = [
  { title: "Automation first", body: "Reduce manual coordination across admissions, academics, mentorship, and reporting." },
  { title: "Decision-grade visibility", body: "Give administrators and faculty one place to understand attendance, marks, and student risk." },
  { title: "Scales with the institution", body: "Start with one campus and grow into multi-department or multi-campus operations without changing systems." }
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureSection title="Universities deserve better than disconnected systems" description="EasyCampus replaces fragmented portals and spreadsheet-heavy workflows with one intelligent operating system for academic operations." items={problemItems} />
      <FeatureSection title="Core modules built for the academic ecosystem" description="Every major workflow is designed for administrators, faculty, mentors, students, and leadership teams." items={moduleItems} />
      <FeatureSection title="Why institutions choose EasyCampus" description="The goal is not just digitization. It is control, speed, visibility, and stronger student outcomes." items={benefitItems} />
      <CtaBanner />
    </>
  );
}

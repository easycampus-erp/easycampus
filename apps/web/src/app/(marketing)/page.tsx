import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureSection } from "@/components/marketing/feature-section";
import { Hero } from "@/components/marketing/hero";

const problemItems = [
  { title: "Manual processes", body: "Admissions, attendance, mentor mapping, reporting, fee tracking, and staff coordination still slow down because they move across spreadsheets, emails, and fragmented approvals." },
  { title: "Data silos", body: "Departments, faculty, mentors, finance teams, library teams, and leadership often operate from disconnected records with no shared operational context." },
  { title: "Poor student tracking", body: "Attendance, performance, payments, and interventions are difficult to correlate before a student slips into serious academic risk." },
  { title: "Mentorship gaps", body: "Most institutions lack structured mentor allocation, meeting workflows, and follow-up visibility across cohorts." },
  { title: "Attendance issues", body: "Defaulter monitoring is delayed when attendance capture is inconsistent across lectures, labs, sections, and transport-linked routines." },
  { title: "Communication overload", body: "Announcements and reminders lose impact when messages are spread across too many tools and no one system owns accountability." }
];

const moduleItems = [
  { title: "Online Registration", body: "Digital registration, admissions-ready forms, intake data capture, and enrollment workflows in one entry layer." },
  { title: "Student Information System", body: "Profiles, enrollment, lifecycle records, academic progression, guardian details, and institutional master data." },
  { title: "School Fee Management", body: "Fee plans, payment tracking, due visibility, reminders, and finance-ready student account records." },
  { title: "Exam & Result Management", body: "Exam setup, marks entry, result processing, grade sheets, and academic outputs for controlled evaluation workflows." },
  { title: "Library Management", body: "Catalog visibility, circulation workflows, borrower tracking, and library operations integrated into the campus system." },
  { title: "Staff Information Management", body: "Staff master records, roles, departments, profile visibility, and operational coordination for institutional teams." },
  { title: "School Financial Accounting", body: "Core finance visibility, structured records, institutional reporting support, and connected academic operations." },
  { title: "Staff Payroll Management", body: "Payroll-ready staff information, organizational rules, and administrative visibility for campus HR teams." },
  { title: "Inventory Management", body: "Asset, stock, and resource visibility for departments, labs, stores, and campus support functions." },
  { title: "Bus Transport & GPS", body: "Transport routes, vehicle oversight, commute support, and GPS-oriented operations for managed campus mobility." },
  { title: "Attendance Management", body: "Lecture and lab attendance with threshold alerts, defaulter visibility, and corrective workflows across teams." },
  { title: "Mentor & Communication Hub", body: "Mentor allocation, meeting logs, risk flags, scheduled notices, and role-based communication in one layer." }
];

const benefitItems = [
  { title: "Automation first", body: "Reduce manual coordination across admissions, academics, mentorship, finance-adjacent workflows, and reporting." },
  { title: "Decision-grade visibility", body: "Give administrators and faculty one place to understand attendance, marks, fees, student risk, and institutional performance." },
  { title: "Scales with the institution", body: "Start with one campus and grow into multi-department or multi-campus operations without changing systems." }
];

const roleHighlights = [
  { title: "Admin teams", body: "Own structures, governance, announcements, exports, reports, fees, and operational settings from one command layer." },
  { title: "Faculty", body: "Capture attendance, upload marks, manage exams, and see subject-level student progress." },
  { title: "Mentors", body: "Track student groups, risks, meetings, and interventions with cleaner follow-through." },
  { title: "Students", body: "Access marks, timetable, attendance, messages, fee visibility, and notifications from one simple workspace." }
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="py-6 lg:py-10">
        <div className="shell grid gap-5 lg:grid-cols-4">
          {roleHighlights.map((item) => (
            <article key={item.title} className="glass rounded-[28px] p-6">
              <p className="section-kicker text-[11px] font-semibold text-brand">Campus role</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <FeatureSection title="Universities deserve better than disconnected systems" description="EasyCampus replaces fragmented portals and spreadsheet-heavy workflows with one intelligent operating system for academic, administrative, and campus operations." items={problemItems} />
      <FeatureSection title="Core modules built for the academic ecosystem" description="From registration and student records to fees, exams, payroll, transport, attendance, and communication, every major workflow is designed for institutional teams." items={moduleItems} />
      <FeatureSection title="Why institutions choose EasyCampus" description="The goal is not just digitization. It is control, speed, visibility, and stronger student outcomes." items={benefitItems} />
      <CtaBanner />
    </>
  );
}

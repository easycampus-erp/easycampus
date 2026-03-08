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

const roleHighlights = [
  { title: "Admin teams", body: "Own structures, governance, announcements, exports, and reporting from one command layer." },
  { title: "Faculty", body: "Capture attendance, upload marks, manage exams, and see subject-level student progress." },
  { title: "Mentors", body: "Track student groups, risks, meetings, and interventions with cleaner follow-through." },
  { title: "Students", body: "Access marks, timetable, attendance, messages, and notifications from one simple workspace." }
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
      <FeatureSection title="Universities deserve better than disconnected systems" description="EasyCampus replaces fragmented portals and spreadsheet-heavy workflows with one intelligent operating system for academic operations." items={problemItems} />
      <FeatureSection title="Core modules built for the academic ecosystem" description="Every major workflow is designed for administrators, faculty, mentors, students, and leadership teams." items={moduleItems} />
      <FeatureSection title="Why institutions choose EasyCampus" description="The goal is not just digitization. It is control, speed, visibility, and stronger student outcomes." items={benefitItems} />
      <CtaBanner />
    </>
  );
}

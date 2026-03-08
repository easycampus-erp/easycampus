import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureSection } from "@/components/marketing/feature-section";
import { Hero } from "@/components/marketing/hero";

const problemItems = [
  { title: "Manual processes", body: "Admissions, attendance, mentor mapping, reporting, and academic coordination still slow down because they move across spreadsheets, emails, and fragmented approvals." },
  { title: "Data silos", body: "Departments, faculty, mentors, administrators, and leadership often operate from disconnected records with no shared operational context." },
  { title: "Poor student tracking", body: "Attendance, performance, and interventions are difficult to correlate before a student slips into serious academic risk." },
  { title: "Mentorship gaps", body: "Many institutions lack structured mentor allocation, meeting workflows, and follow-up visibility across cohorts." },
  { title: "Attendance issues", body: "Defaulter monitoring is delayed when attendance capture is inconsistent across lectures, labs, sections, and semesters." },
  { title: "Communication overload", body: "Announcements and reminders lose impact when messages are spread across too many tools and no one system owns accountability." }
];

const moduleItems = [
  { title: "Student Management", body: "Profiles, enrollment, lifecycle records, academic progression, guardian details, and institutional master data." },
  { title: "Department Management", body: "Department creation, structure ownership, administrative visibility, and academic organization for every institutional unit." },
  { title: "Course Management", body: "Programs, batches, credits, semesters, and course-level academic planning from one structured control layer." },
  { title: "Subject Management", body: "Subject catalogs, allocations, mapping, credit structures, and semester-wise academic control across departments." },
  { title: "Mentor Management", body: "Mentor allocation, student groups, meeting logs, risk flags, and intervention tracking." },
  { title: "Attendance System", body: "Lecture and lab attendance with threshold alerts, defaulter visibility, and corrective workflows." },
  { title: "Exam & Results", body: "Exam setup, marks entry, result processing, grade sheets, and academic outcome visibility." },
  { title: "Faculty Workspace", body: "Attendance capture, marks upload, exam setup, analytics, and resource workflows for teaching teams." },
  { title: "Student Portal", body: "Attendance, marks, timetable, announcements, mentor messages, and student-facing clarity." },
  { title: "Communication Hub", body: "Notices, announcements, mentor communication, scheduled notifications, and operational messaging." },
  { title: "Analytics & Reports", body: "Performance trends, attendance health, GPA views, mentor effectiveness, and leadership reporting." },
  { title: "TPO & Placement Operations", body: "Placement coordination, training workflows, drive communication, and student employability tracking." },
  { title: "Staff & Administration", body: "Institutional staff records, operational coordination, and administrative visibility for support teams." },
  { title: "Mobile Student Experience", body: "Student access to timetable, attendance, marks, notifications, and mentor updates from mobile." }
];

const benefitItems = [
  { title: "Automation first", body: "Reduce manual coordination across admissions, academics, mentorship, attendance, and reporting." },
  { title: "Decision-grade visibility", body: "Give administrators and faculty one place to understand attendance, marks, student risk, and institutional performance." },
  { title: "Scales with the institution", body: "Start with one campus and grow into multi-department or multi-campus operations without changing systems." }
];

const roleHighlights = [
  { title: "Admin teams", body: "Own structures, governance, announcements, exports, reports, and operational settings from one command layer." },
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
      <FeatureSection title="Universities deserve better than disconnected systems" description="EasyCampus replaces fragmented portals and spreadsheet-heavy workflows with one intelligent operating system for academic, administrative, and student success operations." items={problemItems} />
      <FeatureSection title="Core modules built for the university ecosystem" description="From student lifecycle management and mentoring to departments, courses, subjects, examinations, placements, and analytics, every major workflow is designed for institutional teams." items={moduleItems} />
      <FeatureSection title="Why institutions choose EasyCampus" description="The goal is not just digitization. It is control, speed, visibility, and stronger student outcomes." items={benefitItems} />
      <CtaBanner />
    </>
  );
}

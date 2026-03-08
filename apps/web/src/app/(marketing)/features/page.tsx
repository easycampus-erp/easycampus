import Link from "next/link";
import { CtaBanner } from "@/components/marketing/cta-banner";

const modules = [
  {
    title: "Student lifecycle management",
    body: "Manage enrollment, semester progression, guardian context, cohorts, and academic status from one institutional source of truth.",
    signals: ["Admissions to graduation", "Unified student master", "Role-aware access"]
  },
  {
    title: "Department management",
    body: "Create and govern departments, assign academic ownership, and maintain clean institutional structure across every school or faculty.",
    signals: ["Department hierarchy", "Academic ownership", "Admin visibility"]
  },
  {
    title: "Course management",
    body: "Configure programs, semesters, credits, batches, and course-level academic planning without fragmented spreadsheets.",
    signals: ["Programs + batches", "Semester planning", "Credit structure"]
  },
  {
    title: "Subject management",
    body: "Control subject catalogs, mappings, allocations, and semester-wise academic design across departments and courses.",
    signals: ["Subject catalogs", "Course mapping", "Allocation control"]
  },
  {
    title: "Mentor and intervention workflows",
    body: "Map mentors by department, year, risk band, or cohort and keep every meeting, intervention, and next action visible to academic leadership.",
    signals: ["Mentor pods", "Follow-up tracking", "Risk escalation"]
  },
  {
    title: "Attendance intelligence",
    body: "Capture lecture and lab attendance quickly, apply institutional rules, trigger defaulter workflows, and compare sections or departments in real time.",
    signals: ["Lecture + lab mode", "Threshold alerts", "Bulk correction"]
  },
  {
    title: "Exams, marks, and results",
    body: "Handle exam setup, marks entry, assessment structures, grade rules, result processing, and downloadable grade-sheet reporting.",
    signals: ["Exam creation", "Marks entry", "Grade-sheet outputs"]
  },
  {
    title: "Faculty workspace",
    body: "Give faculty one clean layer for attendance, marks, exam setup, materials, and subject-level academic visibility.",
    signals: ["Teaching workflows", "Academic uploads", "Subject analytics"]
  },
  {
    title: "Student portal and mobile experience",
    body: "Deliver attendance, marks, timetable, notices, mentor updates, and academic clarity through web and mobile touchpoints.",
    signals: ["Student dashboard", "Mobile-ready", "Notification layer"]
  },
  {
    title: "Communication and notice orchestration",
    body: "Send announcements, mentor messages, scheduled alerts, and role-targeted updates to students, faculty, and administration from one control layer.",
    signals: ["Role targeting", "Scheduled notices", "Read tracking"]
  },
  {
    title: "Analytics and institutional reporting",
    body: "Give HODs, registrars, and principals one view of attendance health, academic movement, at-risk cohorts, mentor effectiveness, and adoption across teams.",
    signals: ["Department benchmarks", "Risk visibility", "Leadership reporting"]
  },
  {
    title: "TPO and placement operations",
    body: "Support training coordination, placement communication, drive workflows, and employability tracking for final-year cohorts.",
    signals: ["Drive communication", "Placement workflows", "TPO visibility"]
  },
  {
    title: "Staff and administration management",
    body: "Maintain staff records, internal coordination, and administrative visibility for institutional support operations.",
    signals: ["Staff master", "Operational visibility", "Admin support"]
  },
  {
    title: "Exports and scheduled reports",
    body: "Generate reports, grade sheets, exports, and leadership-ready outputs for operational and academic review cycles.",
    signals: ["CSV + PDF", "Scheduled reports", "Audit-ready outputs"]
  }
];

const lanes = [
  {
    label: "HeyAdmin",
    title: "Institution command center",
    body: "Departments, courses, subjects, rules, reports, announcements, and governance settings for central administration."
  },
  {
    label: "HeyMentor",
    title: "Mentorship and follow-through",
    body: "Student group mapping, meeting notes, interventions, outcomes, and escalation tracking across cohorts."
  },
  {
    label: "HeyExam",
    title: "Exam and marks engine",
    body: "Assessment setup, result workflows, grade calculations, exports, and academic reporting from one engine."
  },
  {
    label: "HeyStudent",
    title: "Student experience layer",
    body: "Attendance, marks, timetable, notices, mentor updates, and academic clarity in one portal and mobile experience."
  }
];

const highlights = [
  { label: "Core suites", value: "7", helper: "Product lanes from HeyMentor to HeyStaff" },
  { label: "University modules", value: "14", helper: "Academic, mentor, admin, student, TPO, and reporting workflows" },
  { label: "Weekly visibility", value: "18,460", helper: "Active students represented in leadership reporting" }
];

export default function FeaturesPage() {
  return (
    <>
      <section className="py-20 lg:py-24">
        <div className="shell grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="glass rounded-[38px] p-8 lg:p-10">
            <p className="section-kicker text-xs font-semibold text-brand">Premium University ERP Features</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Every serious campus workflow, designed as one modern operating system.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-mist">
              EasyCampus is built for institutions that want operational control, not scattered software. The platform combines student lifecycle management, departments, courses, subjects, mentoring, attendance, examinations, communication, placements, analytics, and student experience in one campus-grade layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/request-demo" className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-600">
                Request Demo
              </Link>
              <Link href="/pricing" className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-brand/30 hover:text-brand">
                View Pricing
              </Link>
            </div>
          </div>

          <div className="gradient-panel rounded-[38px] p-8 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker text-xs font-semibold text-white/70">Platform depth</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Built for execution, not just record keeping.</h2>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white/90">
                Campus-wide visibility
              </span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-[26px] bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm text-white/70">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-7 text-white/72">{item.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 lg:py-10">
        <div className="shell grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {lanes.map((lane) => (
            <article key={lane.label} className="glass rounded-[28px] p-6">
              <p className="section-kicker text-[11px] font-semibold text-brand">{lane.label}</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{lane.title}</h2>
              <p className="mt-3 text-sm leading-7 text-mist">{lane.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="shell">
          <div className="mb-8 max-w-3xl">
            <p className="section-kicker text-xs font-semibold text-brand">Module architecture</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Fourteen capability blocks that match how universities actually operate.
            </h2>
            <p className="mt-4 text-base leading-8 text-mist">
              Each module is designed to work alone or as part of the full ERP rollout, so institutions can start with their most urgent operational gap and expand without replatforming.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <article key={module.title} className="glass rounded-[32px] p-7 transition hover:-translate-y-1 hover:shadow-soft">
                <h3 className="text-2xl font-semibold tracking-tight text-ink">{module.title}</h3>
                <p className="mt-4 text-sm leading-7 text-mist">{module.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {module.signals.map((signal) => (
                    <span key={signal} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-mist">
                      {signal}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

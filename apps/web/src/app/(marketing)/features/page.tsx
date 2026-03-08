import Link from "next/link";
import { CtaBanner } from "@/components/marketing/cta-banner";

const modules = [
  {
    title: "Online registration and admissions",
    body: "Collect registration data, manage intake workflows, and move new students into the ERP without manual re-entry.",
    signals: ["Digital registration", "Admissions-ready forms", "Enrollment handoff"]
  },
  {
    title: "Student information system",
    body: "Manage lifecycle records, profiles, semesters, guardians, departments, batches, and academic status from one source of truth.",
    signals: ["Admissions to graduation", "Unified student master", "Role-aware access"]
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
    body: "Handle exam setup, marks entry, assessment structures, grade rules, result processing, and downloadable grade-sheet reporting without spreadsheet friction.",
    signals: ["Exam creation", "Marks entry", "Grade-sheet outputs"]
  },
  {
    title: "Fee management and accounting support",
    body: "Track fee plans, due visibility, payment status, and finance-oriented student records alongside academic operations.",
    signals: ["Fee plans", "Payment visibility", "Finance-ready records"]
  },
  {
    title: "Library management",
    body: "Bring catalog visibility, member access, circulation workflows, and issue-return records into the same campus system.",
    signals: ["Catalog visibility", "Circulation workflows", "Borrower tracking"]
  },
  {
    title: "Staff information and payroll",
    body: "Maintain staff profiles, departments, designation visibility, and payroll-ready records for non-student institutional operations.",
    signals: ["Staff master", "Payroll support", "Department mapping"]
  },
  {
    title: "Inventory and campus resources",
    body: "Track assets, inventory, lab resources, and institutional stock movement for cleaner administrative control.",
    signals: ["Asset visibility", "Lab inventory", "Store tracking"]
  },
  {
    title: "Bus transport and GPS operations",
    body: "Support route visibility, transport administration, and campus commute oversight for institutions with mobility workflows.",
    signals: ["Route management", "Transport records", "GPS-oriented oversight"]
  },
  {
    title: "Communication and notice orchestration",
    body: "Send announcements, mentor messages, scheduled alerts, and role-targeted updates to students, faculty, and administration from one clean control layer.",
    signals: ["Role targeting", "Scheduled notices", "Read tracking"]
  },
  {
    title: "Leadership analytics",
    body: "Give HODs, registrars, and principals one view of attendance health, academic movement, at-risk cohorts, mentor effectiveness, and adoption across teams.",
    signals: ["Department benchmarks", "Risk visibility", "Operational adoption"]
  }
];

const lanes = [
  {
    label: "HeyAdmin",
    title: "Institution command center",
    body: "Departments, courses, rules, reports, announcements, accounting support, and governance settings for central administration."
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
    body: "Attendance, marks, timetable, notices, fee visibility, and academic clarity in one portal and mobile experience."
  }
];

const highlights = [
  { label: "Core suites", value: "7", helper: "Product lanes from HeyMentor to HeyStaff" },
  { label: "Service coverage", value: "12 modules", helper: "Academic, admin, finance, staff, transport, and student workflows" },
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
              EasyCampus is built for institutions that want operational control, not scattered software. The platform combines registration, student lifecycle management, mentor visibility, attendance, fees, exams, library, transport, staff operations, communication, and analytics in one campus-grade layer.
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
              Twelve capability blocks that match how institutions actually operate.
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

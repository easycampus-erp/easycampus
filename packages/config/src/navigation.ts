import type { Role } from "../../types/src";

export type ProductItem = {
  slug: string;
  name: string;
  eyebrow: string;
  blurb: string;
  audience: string;
  sections: { title: string; body: string }[];
};

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/university-erp", label: "University ERP" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export const productMenu: ProductItem[] = [
  {
    slug: "heymentor",
    name: "HeyMentor",
    eyebrow: "Mentor Success Platform",
    blurb: "Structured mentor allocation, risk alerts, meeting workflows, and intervention visibility for student support teams.",
    audience: "Mentors, HODs, student success cells",
    sections: [
      { title: "Mentor allocation", body: "Assign students to mentors by department, section, year, or risk profile with one controlled workflow." },
      { title: "Meeting intelligence", body: "Track mentor meetings, next actions, intervention notes, and follow-up completion across the semester." },
      { title: "Risk visibility", body: "Combine attendance, marks, and mentor observations into one student-risk signal for faster intervention." }
    ]
  },
  {
    slug: "heyexam",
    name: "HeyExam",
    eyebrow: "Exam and Marks Engine",
    blurb: "Exam setup, marks entry, result processing, grade-sheet generation, and academic outcome visibility.",
    audience: "Controllers of examination, faculty, admins",
    sections: [
      { title: "Exam operations", body: "Create assessment cycles, internal exams, practicals, and subject-wise evaluation windows without spreadsheet coordination." },
      { title: "Marks workflows", body: "Enable faculty marks entry, moderation, corrections, and result readiness from one interface." },
      { title: "Result publishing", body: "Support grade sheets, transcripts, and academic performance exports for students and leadership." }
    ]
  },
  {
    slug: "heyadmin",
    name: "HeyAdmin",
    eyebrow: "Institution Command Center",
    blurb: "Academic structures, departments, rules, reports, notifications, and governance settings for the administration team.",
    audience: "Admins, registrars, ERP coordinators",
    sections: [
      { title: "Academic structure", body: "Manage departments, courses, subjects, semesters, sections, and operational rules from one dashboard." },
      { title: "Governance controls", body: "Set attendance rules, grading policies, report schedules, and campus-wide notifications." },
      { title: "Reporting hub", body: "Generate operational exports, audit views, and leadership summaries with centralized visibility." }
    ]
  },
  {
    slug: "heytpo",
    name: "HeyTPO",
    eyebrow: "Placement Operations Layer",
    blurb: "A focused layer for training and placement offices to track student readiness, drives, and placement communication.",
    audience: "TPO teams, placement heads, deans",
    sections: [
      { title: "Placement readiness", body: "Track attendance, academic eligibility, and cohort readiness before placement cycles begin." },
      { title: "Drive coordination", body: "Organize communication, shortlist visibility, and department-wise placement execution." },
      { title: "Outcome reporting", body: "Measure placement performance across batches, departments, and employer engagement cycles." }
    ]
  },
  {
    slug: "heymanager",
    name: "HeyManager",
    eyebrow: "Leadership Analytics Suite",
    blurb: "Operational dashboards for directors, principals, deans, and management teams who need clean institutional visibility.",
    audience: "Principals, deans, directors, management",
    sections: [
      { title: "Executive visibility", body: "See attendance, risk, departmental performance, and academic momentum in one leadership console." },
      { title: "Trend analysis", body: "Review department health, interventions, outcomes, and compliance status over time." },
      { title: "Decision support", body: "Turn operational data into leadership-ready summaries for reviews and planning meetings." }
    ]
  },
  {
    slug: "heystudent",
    name: "HeyStudent",
    eyebrow: "Student Experience Portal",
    blurb: "A clean student-facing workspace for attendance, marks, timetable, notifications, mentor updates, and academic clarity.",
    audience: "Students and parents",
    sections: [
      { title: "Academic visibility", body: "Give students one login for attendance, marks, timetable, and result visibility." },
      { title: "Mentor communication", body: "Surface mentor updates, follow-up notes, and support reminders in a friendly portal experience." },
      { title: "Mobile-first access", body: "Extend the same core workflows into the mobile app for daily campus engagement." }
    ]
  },
  {
    slug: "heystaff",
    name: "HeyStaff",
    eyebrow: "Staff Operations Workspace",
    blurb: "A shared workspace for support teams handling notices, administrative coordination, records, and campus execution.",
    audience: "Office staff, support teams, coordinators",
    sections: [
      { title: "Operational coordination", body: "Support notices, records handling, workflow follow-through, and institution-level communication." },
      { title: "Cross-team execution", body: "Keep academic offices, support teams, and administrators aligned on pending tasks and updates." },
      { title: "Controlled access", body: "Give staff role-specific visibility without exposing high-risk admin controls unnecessarily." }
    ]
  }
];

export const dashboardRoles: { href: string; label: string; role: Role }[] = [
  { href: "/admin", label: "Admin", role: "admin" },
  { href: "/faculty", label: "Faculty", role: "faculty" },
  { href: "/mentor", label: "Mentor", role: "mentor" },
  { href: "/student", label: "Student", role: "student" }
];

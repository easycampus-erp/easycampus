import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { getAdminDashboardData } from "@/lib/dashboard-data";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <DashboardTemplate
      role={data.role}
      title="Admin Dashboard"
      summary="Govern departments, onboarding, mentorship, and academic operations from live Supabase-backed data."
      metrics={data.metrics}
      panels={data.panels}
      actions={[
        { href: "/admin/onboarding", label: "Invite Users" },
        { href: "/admin/students", label: "Students" },
        { href: "/admin/faculty", label: "Faculty" },
        { href: "/admin/mentors", label: "Mentors" },
        { href: "/admin/departments", label: "Departments" },
        { href: "/admin/courses", label: "Courses" },
        { href: "/admin/subjects", label: "Subjects" },
        { href: "/admin/exams", label: "Exams" },
        { href: "/admin/mentor-groups", label: "Mentor Groups" },
        { href: "/admin/group-members", label: "Group Members" },
        { href: "/admin/announcements", label: "Announcements" },
        { href: "/admin/notifications", label: "Notifications" },
        { href: "/admin/reports", label: "Reports" },
        { href: "/admin/report-files", label: "Report Files" },
        { href: "/admin/scheduled-reports", label: "Scheduled Reports" },
        { href: "/admin/settings", label: "Settings" },
        { href: "/admin/audit-logs", label: "Audit Logs" },
        { href: "/admin/observability", label: "Observability" },
        { href: "/admin/timetable", label: "Timetable" },
        { href: "/admin/profile", label: "Profile" }
      ]}
    />
  );
}

import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { getFacultyDashboardData } from "@/lib/dashboard-data";

export default async function FacultyDashboardPage() {
  const data = await getFacultyDashboardData();

  return (
    <DashboardTemplate
      role={data.role}
      title="Faculty Dashboard"
      summary="Track faculty activity, attendance operations, and institution context using live Supabase records."
      metrics={data.metrics}
      panels={data.panels}
      actions={[
        { href: "/faculty/attendance", label: "Attendance" },
        { href: "/faculty/attendance/history", label: "Attendance History" },
        { href: "/faculty/marks", label: "Marks Entry" },
        { href: "/faculty/exams", label: "Exams" },
        { href: "/faculty/resources", label: "Resources" },
        { href: "/faculty/resources/library", label: "Library" },
        { href: "/faculty/analytics", label: "Analytics" },
        { href: "/faculty/notifications", label: "Notifications" },
        { href: "/faculty/profile", label: "Profile" }
      ]}
    />
  );
}

import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { getStudentDashboardData } from "@/lib/dashboard-data";

export default async function StudentDashboardPage() {
  const data = await getStudentDashboardData();

  return (
    <DashboardTemplate
      role={data.role}
      title="Student Dashboard"
      summary="See attendance, academic context, and campus communication from live Supabase data."
      metrics={data.metrics}
      panels={data.panels}
      actions={[
        { href: "/student/attendance", label: "Attendance" },
        { href: "/student/analytics", label: "Analytics" },
        { href: "/student/marks", label: "Marks" },
        { href: "/student/timetable", label: "Timetable" },
        { href: "/student/notifications", label: "Notifications" },
        { href: "/student/profile", label: "Profile" }
      ]}
    />
  );
}

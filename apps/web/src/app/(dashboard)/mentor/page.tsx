import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { getMentorDashboardData } from "@/lib/dashboard-data";

export default async function MentorDashboardPage() {
  const data = await getMentorDashboardData();

  return (
    <DashboardTemplate
      role={data.role}
      title="Mentor Dashboard"
      summary="Monitor mentor groups, students, and mentoring activity from your institution's Supabase data."
      metrics={data.metrics}
      panels={data.panels}
      actions={[
        { href: "/mentor/groups", label: "Groups" },
        { href: "/mentor/members", label: "Members" },
        { href: "/mentor/meetings", label: "Meetings" },
        { href: "/mentor/risk", label: "Risk" },
        { href: "/mentor/outcomes", label: "Outcomes" },
        { href: "/mentor/profile", label: "Profile" }
      ]}
    />
  );
}

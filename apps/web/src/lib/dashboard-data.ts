import type { DashboardPanel, Role } from "@easycampus/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { hasPublicSupabaseEnv } from "@/lib/env";

type Metric = {
  label: string;
  value: string;
  helper: string;
};

type DashboardData = {
  role: Role;
  metrics: Metric[];
  panels: DashboardPanel[];
};

function getSetupFallback(role: Role, title: string): DashboardData {
  return {
    role,
    metrics: [
      { label: "Status", value: "Setup needed", helper: "Add Supabase env vars to enable live data" },
      { label: "Source", value: "Supabase", helper: "Dashboard switches to live data automatically" },
      { label: "Auth", value: "Ready", helper: "Session and role flow already wired" },
      { label: "Mode", value: "Fallback", helper: "Safe build-time rendering without secrets" }
    ],
    panels: [
      {
        title: `${title} setup`,
        description: "This dashboard becomes live as soon as Supabase environment variables are configured.",
        items: [
          "Set NEXT_PUBLIC_SUPABASE_URL",
          "Set NEXT_PUBLIC_SUPABASE_ANON_KEY",
          "Set SUPABASE_SERVICE_ROLE_KEY",
          "Run supabase/schema.sql in your project"
        ]
      },
      {
        title: "What is already wired",
        description: "The code paths are ready even when secrets are not present locally.",
        items: ["Supabase Auth", "Role-aware route protection", "Invite/signup flow", "Database-backed dashboard queries"]
      }
    ]
  };
}

async function getDashboardContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const role = getUserRole(user);
  if (!role) {
    throw new Error("User role not configured.");
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("institution_id, role")
    .eq("profile_id", user.id)
    .eq("role", role)
    .single();

  if (!membership) {
    throw new Error("Membership not found.");
  }

  return {
    supabase,
    user,
    role,
    institutionId: membership.institution_id
  };
}

async function countRows(query: any) {
  const { count } = await query;
  return count ?? 0;
}

export async function getAdminDashboardData(): Promise<DashboardData> {
  if (!hasPublicSupabaseEnv()) {
    return getSetupFallback("admin", "Admin dashboard");
  }

  const { supabase, institutionId } = await getDashboardContext();

  const [studentCount, mentorCount, departmentCount, pendingInviteCount] = await Promise.all([
    countRows(supabase.from("students").select("id", { count: "exact", head: true }).eq("institution_id", institutionId)),
    countRows(supabase.from("mentors").select("id", { count: "exact", head: true }).eq("institution_id", institutionId)),
    countRows(supabase.from("departments").select("id", { count: "exact", head: true }).eq("institution_id", institutionId)),
    countRows(supabase.from("user_invites").select("id", { count: "exact", head: true }).eq("institution_id", institutionId).is("accepted_at", null))
  ]);

  const { data: announcements } = await supabase
    .from("announcements")
    .select("title")
    .eq("institution_id", institutionId)
    .order("created_at", { ascending: false })
    .limit(4);

  return {
    role: "admin",
    metrics: [
      { label: "Total Students", value: String(studentCount), helper: "Live count from Supabase" },
      { label: "Departments", value: String(departmentCount), helper: "Institution-wide academic structure" },
      { label: "Mentors", value: String(mentorCount), helper: "Mentor records configured" },
      { label: "Pending Invites", value: String(pendingInviteCount), helper: "Signup flow still in progress" }
    ],
    panels: [
      {
        title: "Administration actions",
        description: "These actions now map to the live Supabase auth and onboarding model.",
        items: [
          "Invite faculty, mentors, students, and admins from /admin/onboarding",
          "Create departments and courses in Supabase",
          "Run the schema and start institutional data entry"
        ]
      },
      {
        title: "Recent announcements",
        description: "Latest records from the announcements table for this institution.",
        items: announcements?.map((item) => item.title) ?? ["No announcements found yet."]
      }
    ]
  };
}

export async function getFacultyDashboardData(): Promise<DashboardData> {
  if (!hasPublicSupabaseEnv()) {
    return getSetupFallback("faculty", "Faculty dashboard");
  }

  const { supabase, institutionId, user } = await getDashboardContext();

  const { data: faculty } = await supabase
    .from("faculty")
    .select("id, designation")
    .eq("institution_id", institutionId)
    .eq("profile_id", user.id)
    .single();

  const facultyId = faculty?.id ?? "";

  const [sessionCount, announcementCount] = await Promise.all([
    facultyId ? countRows(supabase.from("attendance_sessions").select("id", { count: "exact", head: true }).eq("faculty_id", facultyId)) : Promise.resolve(0),
    countRows(supabase.from("announcements").select("id", { count: "exact", head: true }).eq("institution_id", institutionId))
  ]);

  const [marksCount, timetableCount] = await Promise.all([
    facultyId ? countRows(supabase.from("marks").select("id", { count: "exact", head: true }).eq("faculty_id", facultyId)) : Promise.resolve(0),
    facultyId ? countRows(supabase.from("timetable_entries").select("id", { count: "exact", head: true }).eq("faculty_id", facultyId)) : Promise.resolve(0)
  ]);

  const { data: latestSessions } = facultyId
    ? await supabase
        .from("attendance_sessions")
        .select("session_date, section")
        .eq("faculty_id", facultyId)
        .order("session_date", { ascending: false })
        .limit(4)
    : { data: [] as Array<{ session_date: string; section: string | null }> };

  const sessions = latestSessions ?? [];

  return {
    role: "faculty",
    metrics: [
      { label: "Attendance Sessions", value: String(sessionCount), helper: "Recorded under this faculty account" },
      { label: "Marks Entered", value: String(marksCount), helper: "Assessment records published by this faculty" },
      { label: "Timetable Slots", value: String(timetableCount), helper: "Weekly class slots linked to this faculty" },
      { label: "Announcements", value: String(announcementCount), helper: "Institution messages available" }
    ],
    panels: [
      {
        title: "Recent attendance activity",
        description: "Latest attendance sessions linked to this faculty profile.",
        items: sessions.length
          ? sessions.map((item) => `${item.session_date}${item.section ? ` · ${item.section}` : ""}`)
          : ["No attendance sessions found yet."]
      },
      {
        title: "Faculty workflow status",
        description: "Current implementation status for the faculty module.",
        items: ["Auth is live", "Dashboard reads Supabase data", "Marks entry is live", "Attendance sessions remain connected to faculty records"]
      }
    ]
  };
}

export async function getMentorDashboardData(): Promise<DashboardData> {
  if (!hasPublicSupabaseEnv()) {
    return getSetupFallback("mentor", "Mentor dashboard");
  }

  const { supabase, institutionId, user } = await getDashboardContext();

  const { data: mentor } = await supabase
    .from("mentors")
    .select("id, designation")
    .eq("institution_id", institutionId)
    .eq("profile_id", user.id)
    .single();

  const mentorId = mentor?.id ?? "";

  const [groupCount, meetingCount] = await Promise.all([
    mentorId ? countRows(supabase.from("mentor_groups").select("id", { count: "exact", head: true }).eq("mentor_id", mentorId)) : Promise.resolve(0),
    mentorId ? countRows(supabase.from("mentor_meetings").select("id", { count: "exact", head: true }).eq("mentor_id", mentorId)) : Promise.resolve(0)
  ]);

  const { data: groupIds } = mentorId ? await supabase.from("mentor_groups").select("id").eq("mentor_id", mentorId) : { data: [] as Array<{ id: string }> };
  const mentorGroupIds = groupIds?.map((item) => item.id) ?? [];

  const assignedStudents =
    mentorGroupIds.length > 0
      ? await countRows(supabase.from("mentor_group_members").select("id", { count: "exact", head: true }).in("mentor_group_id", mentorGroupIds))
      : 0;

  return {
    role: "mentor",
    metrics: [
      { label: "Mentor Groups", value: String(groupCount), helper: "Groups assigned to this mentor" },
      { label: "Assigned Students", value: String(assignedStudents), helper: "Derived from mentor group membership" },
      { label: "Meetings Logged", value: String(meetingCount), helper: "Live mentor meeting records" },
      { label: "Designation", value: mentor?.designation ?? "Not set", helper: "Mentor profile in Supabase" }
    ],
    panels: [
      {
        title: "Mentor workflow status",
        description: "Current functionality available through the Supabase-backed mentor module.",
        items: ["Auth is live", "Group counts are live", "Meeting logging is modeled in schema"]
      },
      {
        title: "Next mentor actions",
        description: "Recommended next steps for onboarding mentor operations.",
        items: ["Populate mentor groups", "Assign students to groups", "Start recording mentor meetings"]
      }
    ]
  };
}

export async function getStudentDashboardData(): Promise<DashboardData> {
  if (!hasPublicSupabaseEnv()) {
    return getSetupFallback("student", "Student dashboard");
  }

  const { supabase, institutionId, user } = await getDashboardContext();

  const { data: student } = await supabase
    .from("students")
    .select("id, current_semester, enrollment_no, section")
    .eq("institution_id", institutionId)
    .eq("profile_id", user.id)
    .single();

  const studentId = student?.id ?? "";

  const { data: records } = studentId
    ? await supabase.from("attendance_records").select("status").eq("student_id", studentId)
    : { data: [] as Array<{ status: string }> };

  const { data: marks } = studentId
    ? await supabase.from("marks").select("marks_obtained, exams(max_marks)").eq("student_id", studentId)
    : { data: [] as Array<{ marks_obtained: number; exams: { max_marks?: number | null } | { max_marks?: number | null }[] | null }> };

  const totalRecords = records?.length ?? 0;
  const presentRecords = records?.filter((item) => item.status === "present").length ?? 0;
  const attendancePercentage = totalRecords > 0 ? `${Math.round((presentRecords / totalRecords) * 100)}%` : "N/A";
  const averageScore =
    (marks ?? []).length > 0
      ? `${Math.round(
          (marks ?? []).reduce((sum, mark) => {
            const exam = Array.isArray(mark.exams) ? mark.exams[0] : mark.exams;
            const maxMarks = Number(exam?.max_marks ?? 0);
            return sum + (maxMarks > 0 ? (Number(mark.marks_obtained) / maxMarks) * 100 : 0);
          }, 0) / (marks ?? []).length
        )}%`
      : "N/A";

  const { data: announcements } = await supabase
    .from("announcements")
    .select("title")
    .eq("institution_id", institutionId)
    .order("created_at", { ascending: false })
    .limit(4);

  return {
    role: "student",
    metrics: [
      { label: "Attendance", value: attendancePercentage, helper: "Calculated from attendance records" },
      { label: "Semester", value: student?.current_semester ? String(student.current_semester) : "N/A", helper: "Current student semester" },
      { label: "Average Score", value: averageScore, helper: "Normalized from live marks records" },
      { label: "Section", value: student?.section ?? "N/A", helper: "Current section assignment" }
    ],
    panels: [
      {
        title: "Latest announcements",
        description: "Recent institution updates available to the student account.",
        items: announcements?.map((item) => item.title) ?? ["No announcements found yet."]
      },
      {
        title: "Student workflow status",
        description: "Current implementation status for the student-facing product.",
        items: [
          "Auth is live",
          "Attendance detail is live",
          "Marks module reads Supabase data",
          "Timetable module reads Supabase data",
          "GPA analytics now compute from marks"
        ]
      }
    ]
  };
}

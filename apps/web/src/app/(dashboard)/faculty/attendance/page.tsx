import { AttendanceManager } from "@/components/faculty/attendance-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function FacultyAttendancePage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Faculty Attendance" />;
  }

  const { supabase, institutionId, facultyId, departmentId } = await requireFacultyContext();

  const [{ data: subjects }, { data: students }, { data: sessions }] = await Promise.all([
    supabase.from("subjects").select("id, name, code").eq("institution_id", institutionId).eq("department_id", departmentId).order("name", { ascending: true }),
    supabase.from("students").select("id, enrollment_no, section, profiles(full_name)").eq("institution_id", institutionId).eq("department_id", departmentId).order("enrollment_no", { ascending: true }),
    supabase
      .from("attendance_sessions")
      .select("id, session_date, section, session_type, subjects(name, code), attendance_records(status)")
      .eq("institution_id", institutionId)
      .eq("faculty_id", facultyId)
      .order("session_date", { ascending: false })
      .limit(6)
  ]);

  return (
    <AttendanceManager
      subjects={(subjects ?? []).map((subject) => ({
        label: `${subject.name} (${subject.code})`,
        value: subject.id
      }))}
      students={(students ?? []).map((student) => {
        const profile = firstRelationItem(student.profiles);
        return {
          label: `${profile?.full_name ?? "Student"} (${student.enrollment_no})`,
          value: student.id,
          section: student.section ?? ""
        };
      })}
      recentSessions={(sessions ?? []).map((session) => {
        const subject = firstRelationItem(session.subjects);
        const records = Array.isArray(session.attendance_records) ? session.attendance_records : session.attendance_records ? [session.attendance_records] : [];
        const presentCount = records.filter((record) => record.status === "present").length;
        return {
          id: session.id,
          title: subject ? `${subject.name} (${subject.code})` : "Attendance session",
          subtitle: `${session.session_date} | ${session.session_type} | Section ${session.section ?? "N/A"}`,
          stats: `${presentCount}/${records.length} present`
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

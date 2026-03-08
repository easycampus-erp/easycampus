import { AttendanceHistoryManager } from "@/components/faculty/attendance-history-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function FacultyAttendanceHistoryPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Attendance History" />;

  const { supabase, institutionId, facultyId } = await requireFacultyContext();
  const { data: sessions } = await supabase
    .from("attendance_sessions")
    .select("id, session_date, session_type, section, subjects(name, code), attendance_records(student_id, status, students(enrollment_no, profiles(full_name)))")
    .eq("institution_id", institutionId)
    .eq("faculty_id", facultyId)
    .order("session_date", { ascending: false })
    .limit(10);

  const subjectSummary = new Map<string, { label: string; total: number; present: number }>();
  (sessions ?? []).forEach((session) => {
    const subject = firstRelationItem(session.subjects);
    const records = Array.isArray(session.attendance_records) ? session.attendance_records : [];
    const key = subject?.code ?? "SUB";
    const current = subjectSummary.get(key) ?? { label: `${subject?.name ?? "Subject"} (${subject?.code ?? "SUB"})`, total: 0, present: 0 };
    current.total += records.length;
    current.present += records.filter((record) => record.status === "present").length;
    subjectSummary.set(key, current);
  });

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from(subjectSummary.values()).map((summary) => (
          <article key={summary.label} className="glass rounded-[32px] p-5">
            <p className="text-sm text-mist">{summary.label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {summary.total > 0 ? `${Math.round((summary.present / summary.total) * 100)}%` : "N/A"}
            </p>
            <p className="mt-1 text-sm text-mist">{summary.total} records tracked</p>
          </article>
        ))}
      </div>
      <AttendanceHistoryManager
        sessions={(sessions ?? []).map((session) => {
          const subject = firstRelationItem(session.subjects);
          const records = Array.isArray(session.attendance_records) ? session.attendance_records : [];

          return {
            id: session.id,
            title: subject ? `${subject.name} (${subject.code})` : "Attendance Session",
            subtitle: `${session.session_date} | ${session.session_type} | Section ${session.section ?? "N/A"}`,
            records: records.map((record) => {
              const student = firstRelationItem(record.students as { enrollment_no?: string | null; profiles?: { full_name?: string | null } | { full_name?: string | null }[] } | any[] | null);
              const profile = firstRelationItem(student?.profiles);
              return {
                studentId: record.student_id,
                studentName: profile?.full_name ?? "Student",
                studentMeta: student?.enrollment_no ?? "Enrollment not found",
                status: record.status
              };
            })
          };
        })}
      />
    </section>
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

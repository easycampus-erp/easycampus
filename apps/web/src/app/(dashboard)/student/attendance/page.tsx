import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireStudentContext } from "@/lib/server-role";

type AttendanceRelation = {
  session_date?: string | null;
  session_type?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  section?: string | null;
  subjects?: { name?: string | null; code?: string | null } | { name?: string | null; code?: string | null }[];
};

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function StudentAttendancePage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Attendance Detail" />;
  }

  const { supabase, studentId } = await requireStudentContext();
  const { data: records } = await supabase
    .from("attendance_records")
    .select("id, status, remarks, attendance_sessions(session_date, session_type, start_time, end_time, section, subjects(name, code))")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  const attendanceRecords = (records ?? []).map((record) => {
    const session = firstRelationItem(record.attendance_sessions as AttendanceRelation | AttendanceRelation[] | null);
    const subject = firstRelationItem(session?.subjects);
    return {
      id: record.id,
      status: record.status,
      remarks: record.remarks ?? "",
      date: session?.session_date ?? "N/A",
      sessionType: session?.session_type ?? "lecture",
      time: session?.start_time && session?.end_time ? `${session.start_time} - ${session.end_time}` : "Time not set",
      section: session?.section ?? "N/A",
      subjectName: subject ? `${subject.name} (${subject.code})` : "Subject unavailable",
      subjectCode: subject?.code ?? "N/A"
    };
  });

  const total = attendanceRecords.length;
  const present = attendanceRecords.filter((record) => record.status === "present").length;
  const late = attendanceRecords.filter((record) => record.status === "late").length;
  const absent = attendanceRecords.filter((record) => record.status === "absent").length;
  const attendanceRate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

  const subjectSummaries = Array.from(
    attendanceRecords.reduce(
      (acc, record) => {
        const current = acc.get(record.subjectCode) ?? {
          subjectName: record.subjectName,
          total: 0,
          presentEquivalent: 0
        };
        current.total += 1;
        current.presentEquivalent += record.status === "present" ? 1 : record.status === "late" ? 0.5 : 0;
        acc.set(record.subjectCode, current);
        return acc;
      },
      new Map<string, { subjectName: string; total: number; presentEquivalent: number }>()
    ).values()
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Attendance Detail</h1>
        <p className="mt-2 text-mist">Review every recorded session, subject-level consistency, and your current attendance risk trend.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Attendance Rate" value={`${attendanceRate}%`} helper="Late counts as half credit in this progress view." />
        <MetricCard label="Present" value={String(present)} helper="Fully attended sessions." />
        <MetricCard label="Late" value={String(late)} helper="Arrived late but recorded." />
        <MetricCard label="Absent" value={String(absent)} helper="Sessions currently missed." />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="glass rounded-[32px] p-6">
          <h2 className="text-xl font-semibold text-ink">Subject summary</h2>
          <p className="mt-2 text-sm text-mist">Attendance percentage across the subjects recorded for this student account.</p>
          <div className="mt-4 space-y-3">
            {subjectSummaries.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-mist">No attendance subjects found yet.</div>
            ) : (
              subjectSummaries.map((summary) => {
                const percentage = summary.total > 0 ? Math.round((summary.presentEquivalent / summary.total) * 100) : 0;
                return (
                  <div key={summary.subjectName} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-ink">{summary.subjectName}</span>
                      <span className="text-sm text-mist">{percentage}%</span>
                    </div>
                    <p className="mt-1 text-sm text-mist">{summary.total} tracked sessions</p>
                  </div>
                );
              })
            )}
          </div>
        </article>

        <article className="glass rounded-[32px] p-6">
          <h2 className="text-xl font-semibold text-ink">Recent sessions</h2>
          <p className="mt-2 text-sm text-mist">Latest attendance records from the live timetable and faculty attendance workflow.</p>
          <div className="mt-4 space-y-3">
            {attendanceRecords.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-mist">No attendance records found yet.</div>
            ) : (
              attendanceRecords.slice(0, 8).map((record) => (
                <div key={record.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{record.subjectName}</span>
                    <span className="text-sm uppercase text-mist">{record.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-mist">
                    {record.date} | {record.sessionType} | {record.time} | Section {record.section}
                  </p>
                  {record.remarks ? <p className="mt-1 text-sm text-mist">Remark: {record.remarks}</p> : null}
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="glass rounded-[32px] p-5">
      <p className="text-sm text-mist">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-mist">{helper}</p>
    </article>
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes live after Supabase env vars are configured.</div>;
}

import { buildSimplePdf, toCsv } from "@/lib/reports";
import { requireAdminContext } from "@/lib/server-role";
import { writeAuditLog } from "@/lib/audit";

export async function GET(request: Request) {
  const { supabase, institutionId, user } = await requireAdminContext();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "attendance";
  const format = searchParams.get("format") ?? "csv";
  const store = searchParams.get("store") === "true";

  let title = "Report";
  let filename = `${type}.${format}`;
  let headers: string[] = [];
  let rows: string[][] = [];

  if (type === "attendance") {
    const { data } = await supabase
      .from("attendance_records")
      .select("status, students(enrollment_no), attendance_sessions(session_date, subjects(code))")
      .limit(500);

    headers = ["Enrollment No", "Subject", "Session Date", "Status"];
    rows = (data ?? []).map((row) => {
        const student = Array.isArray(row.students) ? row.students[0] : row.students;
        const session = Array.isArray(row.attendance_sessions) ? row.attendance_sessions[0] : row.attendance_sessions;
        const subject = session && Array.isArray(session.subjects) ? session.subjects[0] : (session as any)?.subjects;
        return [student?.enrollment_no ?? "", subject?.code ?? "", session?.session_date ?? "", row.status];
      });
    title = "Attendance Report";
    filename = `attendance-report.${format}`;
  }

  if (type === "grade-sheet" || type === "transcript") {
    const { data } = await supabase
      .from("marks")
      .select("marks_obtained, grade, students(enrollment_no), subjects(code), exams(name)")
      .eq("institution_id", institutionId)
      .limit(500);

    headers = ["Enrollment No", "Subject", "Exam", "Marks", "Grade"];
    rows = (data ?? []).map((row) => {
        const student = Array.isArray(row.students) ? row.students[0] : row.students;
        const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
        const exam = Array.isArray(row.exams) ? row.exams[0] : row.exams;
        return [student?.enrollment_no ?? "", subject?.code ?? "", exam?.name ?? "", String(row.marks_obtained), row.grade ?? ""];
      });
    title = type === "grade-sheet" ? "Grade Sheet" : "Transcript Export";
    filename = `${type}.${format}`;
  }

  if (headers.length === 0) {
    return new Response("Unsupported report type", { status: 400 });
  }

  const csv = toCsv([headers, ...rows]);
  const fileBuffer =
    format === "pdf"
      ? await buildSimplePdf(title, `Institution: ${institutionId}`, headers, rows)
      : Buffer.from(csv, "utf-8");

  if (store) {
    const path = `${institutionId}/${Date.now()}-${filename}`;
    const bucket = "report-files";
    const { error } = await supabase.storage.from(bucket).upload(path, fileBuffer, {
      upsert: true,
      contentType: format === "pdf" ? "application/pdf" : "text/csv"
    });

    if (!error) {
      await writeAuditLog(supabase, {
        institutionId,
        actorProfileId: user.id,
        action: "generate",
        entityType: "report_file",
        entityId: path,
        metadata: { type, format }
      });
    }
  }

  const responseBody = (format === "pdf" ? Buffer.from(fileBuffer) : csv) as unknown as BodyInit;

  return new Response(responseBody, {
    headers: {
      "Content-Type": format === "pdf" ? "application/pdf" : "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${filename}`
    }
  });
}

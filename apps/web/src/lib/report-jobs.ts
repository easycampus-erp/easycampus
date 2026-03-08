import { buildSimplePdf, toCsv } from "@/lib/reports";

type SupabaseLike = any;

export function computeNextRunAt(scheduleLabel: string, from = new Date()) {
  const normalized = scheduleLabel.trim().toLowerCase();
  const next = new Date(from);

  if (normalized.includes("daily")) {
    next.setUTCDate(next.getUTCDate() + 1);
    return next.toISOString();
  }

  if (normalized.includes("monthly")) {
    next.setUTCMonth(next.getUTCMonth() + 1);
    return next.toISOString();
  }

  if (normalized.includes("quarter")) {
    next.setUTCMonth(next.getUTCMonth() + 3);
    return next.toISOString();
  }

  if (normalized.includes("weekday")) {
    next.setUTCDate(next.getUTCDate() + 1);
    while (next.getUTCDay() === 0 || next.getUTCDay() === 6) {
      next.setUTCDate(next.getUTCDate() + 1);
    }
    return next.toISOString();
  }

  next.setUTCDate(next.getUTCDate() + 7);
  return next.toISOString();
}

async function getReportRows(supabase: SupabaseLike, institutionId: string, type: string) {
  if (type === "attendance") {
    const { data } = await supabase
      .from("attendance_records")
      .select("status, students!inner(enrollment_no), attendance_sessions!inner(session_date, institution_id, subjects(code))")
      .eq("attendance_sessions.institution_id", institutionId)
      .limit(500);

    return {
      title: "Attendance Report",
      headers: ["Enrollment No", "Subject", "Session Date", "Status"],
      rows: (data ?? []).map((row: any) => {
        const student = Array.isArray(row.students) ? row.students[0] : row.students;
        const session = Array.isArray(row.attendance_sessions) ? row.attendance_sessions[0] : row.attendance_sessions;
        const subject = session && Array.isArray(session.subjects) ? session.subjects[0] : session?.subjects;
        return [student?.enrollment_no ?? "", subject?.code ?? "", session?.session_date ?? "", row.status];
      })
    };
  }

  if (type === "grade-sheet" || type === "transcript") {
    const { data } = await supabase
      .from("marks")
      .select("marks_obtained, grade, institution_id, students(enrollment_no), subjects(code), exams(name)")
      .eq("institution_id", institutionId)
      .limit(500);

    return {
      title: type === "grade-sheet" ? "Grade Sheet" : "Transcript Export",
      headers: ["Enrollment No", "Subject", "Exam", "Marks", "Grade"],
      rows: (data ?? []).map((row: any) => {
        const student = Array.isArray(row.students) ? row.students[0] : row.students;
        const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
        const exam = Array.isArray(row.exams) ? row.exams[0] : row.exams;
        return [student?.enrollment_no ?? "", subject?.code ?? "", exam?.name ?? "", String(row.marks_obtained), row.grade ?? ""];
      })
    };
  }

  throw new Error("Unsupported report type");
}

export async function generateAndStoreReport(params: {
  supabase: SupabaseLike;
  institutionId: string;
  type: string;
  format: "csv" | "pdf";
}) {
  const report = await getReportRows(params.supabase, params.institutionId, params.type);
  const csv = toCsv([report.headers, ...report.rows]);
  const fileBytes =
    params.format === "pdf"
      ? Buffer.from(await buildSimplePdf(report.title, `Institution: ${params.institutionId}`, report.headers, report.rows))
      : Buffer.from(csv, "utf-8");

  const filename = `${Date.now()}-${params.type}.${params.format}`;
  const path = `${params.institutionId}/${filename}`;

  const { error } = await params.supabase.storage.from("report-files").upload(path, fileBytes, {
    upsert: true,
    contentType: params.format === "pdf" ? "application/pdf" : "text/csv"
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    path,
    filename,
    title: report.title
  };
}

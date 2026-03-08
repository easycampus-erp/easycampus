import { MarksEntryManager } from "@/components/faculty/marks-entry-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

type RelationRow = { id: string; name?: string | null; code?: string | null; max_marks?: number | null };
type StudentRelation = { enrollment_no?: string | null; profiles?: { full_name?: string | null } | { full_name?: string | null }[] };

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function FacultyMarksPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Faculty Marks Entry" />;
  }

  const { supabase, institutionId, facultyId, departmentId } = await requireFacultyContext();

  const [{ data: exams }, { data: subjects }, { data: students }, { data: marks }] = await Promise.all([
    supabase.from("exams").select("id, name, exam_type, max_marks").eq("institution_id", institutionId).order("exam_date", { ascending: false }),
    supabase.from("subjects").select("id, name, code").eq("institution_id", institutionId).eq("department_id", departmentId).order("name", { ascending: true }),
    supabase.from("students").select("id, enrollment_no, profiles(full_name)").eq("institution_id", institutionId).eq("department_id", departmentId).order("enrollment_no", { ascending: true }),
    supabase
      .from("marks")
      .select("id, exam_id, student_id, subject_id, marks_obtained, grade, remarks, students(enrollment_no, profiles(full_name)), subjects(name, code), exams(name, max_marks)")
      .eq("institution_id", institutionId)
      .eq("faculty_id", facultyId)
      .order("updated_at", { ascending: false })
  ]);

  return (
    <MarksEntryManager
      exams={(exams ?? []).map((exam) => ({
        label: `${exam.name} (${exam.exam_type})`,
        value: exam.id
      }))}
      subjects={(subjects ?? []).map((subject) => ({
        label: `${subject.name} (${subject.code})`,
        value: subject.id
      }))}
      students={(students ?? []).map((student) => {
        const profile = firstRelationItem(student.profiles);
        return {
          label: `${profile?.full_name ?? "Student"} (${student.enrollment_no})`,
          value: student.id
        };
      })}
      marks={(marks ?? []).map((mark) => {
        const subject = firstRelationItem(mark.subjects as RelationRow | RelationRow[] | null);
        const exam = firstRelationItem(mark.exams as RelationRow | RelationRow[] | null);
        const student = firstRelationItem(mark.students as StudentRelation | StudentRelation[] | null);
        const profile = firstRelationItem(student?.profiles);

        return {
          id: mark.id,
          studentName: profile?.full_name ?? "Student",
          studentMeta: student?.enrollment_no ?? "Enrollment not available",
          subjectName: subject ? `${subject.name} (${subject.code})` : "Subject",
          examName: exam?.name ?? "Exam",
          maxMarksLabel: exam?.max_marks ? `Max ${exam.max_marks}` : "Max marks not set",
          values: {
            examId: mark.exam_id,
            subjectId: mark.subject_id,
            studentId: mark.student_id,
            marksObtained: String(mark.marks_obtained),
            grade: mark.grade ?? "",
            remarks: mark.remarks ?? ""
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes live after Supabase env vars are configured.</div>;
}

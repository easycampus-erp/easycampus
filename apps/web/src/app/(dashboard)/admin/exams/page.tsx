import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminExamsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Exams" />;

  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: courses }, { data: exams }] = await Promise.all([
    supabase.from("courses").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("exams").select("id, course_id, semester_no, name, exam_type, max_marks, exam_date, courses(name, code)").eq("institution_id", institutionId).order("exam_date", { ascending: false })
  ]);

  return (
    <AdminEntityManager
      title="Examination Setup"
      description="Configure internal, external, practical, and assignment assessments across courses."
      endpoint="/api/admin/exams"
      fields={[
        {
          name: "courseId",
          label: "Course",
          type: "select",
          options: (courses ?? []).map((course) => ({
            label: `${course.name} (${course.code})`,
            value: course.id
          }))
        },
        { name: "semesterNo", label: "Semester", type: "number" },
        { name: "name", label: "Exam Name" },
        {
          name: "examType",
          label: "Exam Type",
          type: "select",
          options: ["internal", "external", "practical", "assignment"].map((item) => ({ label: item, value: item }))
        },
        { name: "maxMarks", label: "Max Marks", type: "number" },
        { name: "examDate", label: "Exam Date" }
      ]}
      items={(exams ?? []).map((exam) => {
        const course = firstRelationItem(exam.courses);
        return {
          id: exam.id,
          title: exam.name,
          subtitle: `${course?.code ?? "Course"} | ${exam.exam_type} | Semester ${exam.semester_no}`,
          values: {
            courseId: exam.course_id,
            semesterNo: String(exam.semester_no),
            name: exam.name,
            examType: exam.exam_type,
            maxMarks: String(exam.max_marks),
            examDate: exam.exam_date ?? ""
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

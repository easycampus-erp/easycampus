import { TimetableBuilder } from "@/components/admin/timetable-builder";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type FacultyRelation = { employee_code?: string | null; profiles?: { full_name?: string | null } | { full_name?: string | null }[] };

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminTimetablePage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Timetable Builder" />;
  }

  const { supabase, institutionId } = await requireAdminContext();

  const [{ data: courses }, { data: subjects }, { data: faculty }, { data: entries }] = await Promise.all([
    supabase.from("courses").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("subjects").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("faculty").select("id, employee_code, profiles(full_name)").eq("institution_id", institutionId).order("employee_code", { ascending: true }),
    supabase
      .from("timetable_entries")
      .select("id, course_id, subject_id, faculty_id, semester_no, section, day_of_week, start_time, end_time, room_code, courses(name, code), subjects(name, code), faculty(employee_code, profiles(full_name))")
      .eq("institution_id", institutionId)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true })
  ]);

  return (
    <TimetableBuilder
      courses={(courses ?? []).map((course) => ({
        label: `${course.name} (${course.code})`,
        value: course.id
      }))}
      subjects={(subjects ?? []).map((subject) => ({
        label: `${subject.name} (${subject.code})`,
        value: subject.id
      }))}
      faculty={(faculty ?? []).map((member) => {
        const profile = firstRelationItem(member.profiles);
        return {
          label: `${profile?.full_name ?? "Faculty"} (${member.employee_code})`,
          value: member.id
        };
      })}
      entries={(entries ?? []).map((entry) => {
        const course = firstRelationItem(entry.courses);
        const subject = firstRelationItem(entry.subjects);
        const facultyMember = firstRelationItem(entry.faculty as FacultyRelation | FacultyRelation[] | null);
        const facultyProfile = firstRelationItem(facultyMember?.profiles);

        return {
          id: entry.id,
          title: subject ? `${subject.name} (${subject.code})` : "Timetable entry",
          subtitle: `${weekdayNames[(entry.day_of_week ?? 1) - 1]} | ${entry.start_time} - ${entry.end_time} | ${course?.code ?? "Course"} | ${facultyProfile?.full_name ?? facultyMember?.employee_code ?? "Faculty"}`,
          values: {
            courseId: entry.course_id,
            subjectId: entry.subject_id,
            facultyId: entry.faculty_id ?? "",
            semesterNo: String(entry.semester_no),
            section: entry.section ?? "",
            dayOfWeek: String(entry.day_of_week),
            startTime: entry.start_time,
            endTime: entry.end_time,
            roomCode: entry.room_code ?? ""
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes live after Supabase env vars are configured.</div>;
}

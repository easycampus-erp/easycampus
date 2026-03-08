import { hasPublicSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function StudentMarksPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Marks" />;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: student } = await supabase.from("students").select("id").eq("profile_id", user?.id ?? "").single();
  const { data: marks } = student
    ? await supabase
        .from("marks")
        .select("marks_obtained, grade, remarks, subjects(name, code), exams(name, exam_type, max_marks)")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Marks Module</h1>
        <p className="mt-2 text-mist">Real marks records are now read directly from the Supabase `marks` and `exams` tables.</p>
      </div>
      <div className="grid gap-4">
        {(marks ?? []).length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No marks found yet.</div>
        ) : (
          (marks ?? []).map((mark, index) => (
            <article key={`${mark.grade}-${index}`} className="glass rounded-[32px] p-6">
              <h2 className="text-xl font-semibold text-ink">
                {(mark as any).subjects && !Array.isArray((mark as any).subjects) ? `${(mark as any).subjects.name} (${(mark as any).subjects.code})` : "Subject"}
              </h2>
              <p className="mt-2 text-sm text-mist">
                {(mark as any).exams && !Array.isArray((mark as any).exams)
                  ? `${(mark as any).exams.name} · ${(mark as any).exams.exam_type} · Max ${(mark as any).exams.max_marks}`
                  : "Exam details unavailable"}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-mist">
                <span className="rounded-full bg-slate-50 px-4 py-2">Marks: {mark.marks_obtained}</span>
                <span className="rounded-full bg-slate-50 px-4 py-2">Grade: {mark.grade ?? "Pending"}</span>
                <span className="rounded-full bg-slate-50 px-4 py-2">Remarks: {mark.remarks ?? "None"}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes live after Supabase env vars are configured.</div>;
}

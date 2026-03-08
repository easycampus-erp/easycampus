import { hasPublicSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function StudentTimetablePage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Timetable" />;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: student } = await supabase
    .from("students")
    .select("course_id, current_semester, section")
    .eq("profile_id", user?.id ?? "")
    .single();

  const { data: entries } = student
    ? await supabase
        .from("timetable_entries")
        .select("day_of_week, start_time, end_time, room_code, section, subjects(name, code)")
        .eq("course_id", student.course_id)
        .eq("semester_no", student.current_semester)
        .eq("section", student.section)
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true })
    : { data: [] };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Timetable Module</h1>
        <p className="mt-2 text-mist">Real timetable entries are now read from the Supabase `timetable_entries` table.</p>
      </div>
      <div className="grid gap-4">
        {(entries ?? []).length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No timetable entries found yet.</div>
        ) : (
          (entries ?? []).map((entry, index) => (
            <article key={`${entry.day_of_week}-${entry.start_time}-${index}`} className="glass rounded-[32px] p-6">
              <h2 className="text-xl font-semibold text-ink">
                {(entry as any).subjects && !Array.isArray((entry as any).subjects) ? `${(entry as any).subjects.name} (${(entry as any).subjects.code})` : "Subject"}
              </h2>
              <p className="mt-2 text-sm text-mist">
                {weekdayNames[(entry.day_of_week ?? 1) - 1]} · {entry.start_time} to {entry.end_time}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-mist">
                <span className="rounded-full bg-slate-50 px-4 py-2">Section: {entry.section ?? "N/A"}</span>
                <span className="rounded-full bg-slate-50 px-4 py-2">Room: {entry.room_code ?? "TBA"}</span>
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

import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

export default async function FacultyAnalyticsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Faculty Analytics" />;
  const { supabase, institutionId, facultyId } = await requireFacultyContext();
  const { data: marks } = await supabase
    .from("marks")
    .select("marks_obtained, subjects(name, code), exams(max_marks)")
    .eq("institution_id", institutionId)
    .eq("faculty_id", facultyId);

  const summaries = new Map<string, { label: string; total: number; avg: number }>();
  for (const row of marks ?? []) {
    const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
    const exam = Array.isArray(row.exams) ? row.exams[0] : row.exams;
    const key = subject?.code ?? "SUB";
    const score = Number(exam?.max_marks ?? 0) > 0 ? (Number(row.marks_obtained) / Number(exam?.max_marks)) * 100 : 0;
    const current = summaries.get(key) ?? { label: `${subject?.name ?? "Subject"} (${subject?.code ?? "SUB"})`, total: 0, avg: 0 };
    current.total += 1;
    current.avg += score;
    summaries.set(key, current);
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Faculty Subject Analytics</h1>
        <p className="mt-2 text-mist">See how your subjects are performing based on the live marks you have already published.</p>
      </div>
      <div className="grid gap-4">
        {Array.from(summaries.values()).length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No marks data available for analytics yet.</div>
        ) : (
          Array.from(summaries.values()).map((summary) => (
            <article key={summary.label} className="glass rounded-[32px] p-6">
              <h2 className="text-xl font-semibold text-ink">{summary.label}</h2>
              <p className="mt-2 text-sm text-mist">Average score {Math.round(summary.avg / summary.total)}% across {summary.total} evaluated records.</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

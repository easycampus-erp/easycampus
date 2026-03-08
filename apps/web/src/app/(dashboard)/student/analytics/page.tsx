import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireStudentContext } from "@/lib/server-role";

type MarkRelation = {
  name?: string | null;
  code?: string | null;
  credits?: number | null;
  max_marks?: number | null;
};

function getGradePoint(score: number) {
  if (score >= 90) return 10;
  if (score >= 80) return 9;
  if (score >= 70) return 8;
  if (score >= 60) return 7;
  if (score >= 50) return 6;
  if (score >= 45) return 5;
  if (score >= 40) return 4;
  return 0;
}

export default async function StudentAnalyticsPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="GPA Analytics" />;
  }

  const { supabase, studentId } = await requireStudentContext();
  const { data: marks } = await supabase
    .from("marks")
    .select("marks_obtained, grade, subjects(name, code, credits), exams(name, max_marks)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  const analyticsRows = (marks ?? []).map((mark) => {
    const subject = Array.isArray(mark.subjects) ? mark.subjects[0] : (mark.subjects as MarkRelation | null);
    const exam = Array.isArray(mark.exams) ? mark.exams[0] : (mark.exams as MarkRelation | null);
    const maxMarks = Number(exam?.max_marks ?? 0);
    const score = maxMarks > 0 ? (Number(mark.marks_obtained) / maxMarks) * 100 : 0;
    const credits = Number(subject?.credits ?? 0);
    const gradePoint = getGradePoint(score);

    return {
      subjectName: subject ? `${subject.name} (${subject.code})` : "Subject unavailable",
      examName: exam?.name ?? "Exam",
      score,
      credits,
      gradePoint,
      grade: mark.grade ?? "Pending",
      marksObtained: Number(mark.marks_obtained),
      maxMarks
    };
  });

  const totalCredits = analyticsRows.reduce((sum, row) => sum + row.credits, 0);
  const weightedPoints = analyticsRows.reduce((sum, row) => sum + row.gradePoint * row.credits, 0);
  const gpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : "0.00";
  const averageScore = analyticsRows.length > 0 ? Math.round(analyticsRows.reduce((sum, row) => sum + row.score, 0) / analyticsRows.length) : 0;
  const topPerformer = analyticsRows.reduce<{ subjectName: string; score: number } | null>((best, row) => {
    if (!best || row.score > best.score) return { subjectName: row.subjectName, score: row.score };
    return best;
  }, null);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">GPA Analytics</h1>
        <p className="mt-2 text-mist">Track your weighted GPA estimate, exam trend, and strongest subject performance from live marks data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Estimated GPA" value={gpa} helper="Weighted by subject credits and normalized score bands." />
        <MetricCard label="Average Score" value={`${averageScore}%`} helper="Average across recorded exams in this portal." />
        <MetricCard label="Subjects Evaluated" value={String(analyticsRows.length)} helper="Marks entries included in the analytics view." />
        <MetricCard label="Top Subject" value={topPerformer?.subjectName ?? "N/A"} helper={topPerformer ? `${Math.round(topPerformer.score)}% highest score` : "No marks data yet."} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="glass rounded-[32px] p-6">
          <h2 className="text-xl font-semibold text-ink">Performance by subject</h2>
          <p className="mt-2 text-sm text-mist">Every marks record is normalized against the exam maximum to estimate GPA contribution.</p>
          <div className="mt-4 space-y-3">
            {analyticsRows.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-mist">No marks data found yet.</div>
            ) : (
              analyticsRows.map((row, index) => (
                <div key={`${row.subjectName}-${row.examName}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{row.subjectName}</span>
                    <span className="text-sm text-mist">{Math.round(row.score)}%</span>
                  </div>
                  <p className="mt-1 text-sm text-mist">
                    {row.examName} | {row.marksObtained}/{row.maxMarks || 0} | Grade {row.grade} | GPA points {row.gradePoint}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="glass rounded-[32px] p-6">
          <h2 className="text-xl font-semibold text-ink">How GPA is estimated</h2>
          <p className="mt-2 text-sm text-mist">This MVP computes a weighted GPA estimate from normalized percentage bands. It gives students a clear progress signal even before final university-specific grading rules are configured.</p>
          <div className="mt-4 space-y-3">
            {[
              "90% and above -> 10 points",
              "80% to 89% -> 9 points",
              "70% to 79% -> 8 points",
              "60% to 69% -> 7 points",
              "50% to 59% -> 6 points",
              "45% to 49% -> 5 points",
              "40% to 44% -> 4 points",
              "Below 40% -> 0 points"
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-mist">
                {item}
              </div>
            ))}
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

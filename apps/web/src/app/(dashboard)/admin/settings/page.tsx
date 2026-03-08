import { SettingsForm } from "@/components/admin/settings-form";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

const defaultGradeScale = JSON.stringify(
  [
    { min: 90, grade: "O", points: 10 },
    { min: 80, grade: "A+", points: 9 },
    { min: 70, grade: "A", points: 8 },
    { min: 60, grade: "B+", points: 7 },
    { min: 50, grade: "B", points: 6 },
    { min: 40, grade: "C", points: 5 }
  ],
  null,
  2
);

export default async function AdminSettingsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Institution Settings" />;
  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: settings }, { data: attendanceRules }, { data: gradingRules }] = await Promise.all([
    supabase.from("institution_settings").select("support_email, support_phone, report_footer").eq("institution_id", institutionId).single(),
    supabase.from("attendance_rules").select("minimum_percentage, late_weight, alert_threshold").eq("institution_id", institutionId).single(),
    supabase.from("grading_rules").select("passing_marks, grade_scale").eq("institution_id", institutionId).single()
  ]);

  return (
    <SettingsForm
      initialValues={{
        supportEmail: settings?.support_email ?? "",
        supportPhone: settings?.support_phone ?? "",
        reportFooter: settings?.report_footer ?? "",
        minimumPercentage: attendanceRules?.minimum_percentage ? String(attendanceRules.minimum_percentage) : "75",
        lateWeight: attendanceRules?.late_weight ? String(attendanceRules.late_weight) : "0.5",
        alertThreshold: attendanceRules?.alert_threshold ? String(attendanceRules.alert_threshold) : "70",
        passingMarks: gradingRules?.passing_marks ? String(gradingRules.passing_marks) : "40",
        gradeScale: gradingRules?.grade_scale ? JSON.stringify(gradingRules.grade_scale, null, 2) : defaultGradeScale
      }}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

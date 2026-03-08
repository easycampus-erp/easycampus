import { ResourceUploader } from "@/components/faculty/resource-uploader";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

export default async function FacultyResourcesPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Resources" />;
  const { supabase, institutionId, departmentId } = await requireFacultyContext();
  const { data: subjects } = await supabase.from("subjects").select("id, name, code").eq("institution_id", institutionId).eq("department_id", departmentId).order("name", { ascending: true });
  return <ResourceUploader subjects={(subjects ?? []).map((subject) => ({ label: `${subject.name} (${subject.code})`, value: subject.id }))} />;
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

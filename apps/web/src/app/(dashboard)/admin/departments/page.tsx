import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminDepartmentsPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Departments" />;
  }

  const { supabase, institutionId } = await requireAdminContext();
  const { data: departments } = await supabase
    .from("departments")
    .select("id, name, code")
    .eq("institution_id", institutionId)
    .order("name");

  return (
    <AdminEntityManager
      title="Department Management"
      description="Create, update, and remove departments for the active institution."
      endpoint="/api/admin/departments"
      fields={[
        { name: "name", label: "Department name" },
        { name: "code", label: "Department code" }
      ]}
      items={(departments ?? []).map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: item.code,
        values: {
          name: item.name,
          code: item.code
        }
      }))}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

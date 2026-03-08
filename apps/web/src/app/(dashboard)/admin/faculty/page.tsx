import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminFacultyPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Faculty" />;

  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: departments }, { data: faculty }] = await Promise.all([
    supabase.from("departments").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("faculty").select("id, department_id, employee_code, designation, departments(name, code)").eq("institution_id", institutionId).order("employee_code", { ascending: true })
  ]);

  return (
    <AdminEntityManager
      title="Faculty Management"
      description="Maintain faculty master data and departmental ownership for teaching operations."
      endpoint="/api/admin/faculty"
      fields={[
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          options: (departments ?? []).map((department) => ({
            label: `${department.name} (${department.code})`,
            value: department.id
          }))
        },
        { name: "employeeCode", label: "Employee Code" },
        { name: "designation", label: "Designation" }
      ]}
      items={(faculty ?? []).map((member) => {
        const department = firstRelationItem(member.departments);
        return {
          id: member.id,
          title: member.employee_code,
          subtitle: `${member.designation ?? "Faculty"} | ${department?.code ?? "Department"}`,
          values: {
            departmentId: member.department_id,
            employeeCode: member.employee_code,
            designation: member.designation ?? ""
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

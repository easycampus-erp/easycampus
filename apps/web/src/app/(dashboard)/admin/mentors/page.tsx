import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminMentorsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Mentors" />;

  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: departments }, { data: mentors }] = await Promise.all([
    supabase.from("departments").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("mentors").select("id, department_id, employee_code, designation, capacity, departments(name, code)").eq("institution_id", institutionId).order("employee_code", { ascending: true })
  ]);

  return (
    <AdminEntityManager
      title="Mentor Management"
      description="Manage mentor capacity, department mapping, and mentor availability."
      endpoint="/api/admin/mentors"
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
        { name: "designation", label: "Designation" },
        { name: "capacity", label: "Capacity", type: "number" }
      ]}
      items={(mentors ?? []).map((mentor) => {
        const department = firstRelationItem(mentor.departments);
        return {
          id: mentor.id,
          title: mentor.employee_code,
          subtitle: `${mentor.designation ?? "Mentor"} | ${department?.code ?? "Department"} | Capacity ${mentor.capacity}`,
          values: {
            departmentId: mentor.department_id,
            employeeCode: mentor.employee_code,
            designation: mentor.designation ?? "",
            capacity: String(mentor.capacity ?? 30)
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

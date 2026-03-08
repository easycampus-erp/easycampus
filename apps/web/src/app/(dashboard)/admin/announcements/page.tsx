import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminAnnouncementsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Announcements" />;

  const { supabase, institutionId } = await requireAdminContext();
  const { data: announcements } = await supabase.from("announcements").select("id, title, body, audience").eq("institution_id", institutionId).order("created_at", { ascending: false });

  return (
    <AdminEntityManager
      title="Announcements"
      description="Publish institution-wide or audience-specific campus announcements."
      endpoint="/api/admin/announcements"
      fields={[
        { name: "title", label: "Title" },
        { name: "body", label: "Body" },
        {
          name: "audience",
          label: "Audience",
          type: "select",
          options: [
            { label: "All", value: "all" },
            { label: "Students", value: "students" },
            { label: "Faculty", value: "faculty" },
            { label: "Mentors", value: "mentors" }
          ]
        }
      ]}
      items={(announcements ?? []).map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        subtitle: `Audience: ${announcement.audience}`,
        values: {
          title: announcement.title,
          body: announcement.body,
          audience: announcement.audience
        }
      }))}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

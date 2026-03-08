import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminReportFilesPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Report Files" />;

  const { supabase, institutionId } = await requireAdminContext();
  const { data: files } = await supabase.storage.from("report-files").list(institutionId, { limit: 50, sortBy: { column: "created_at", order: "desc" } });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Report Files</h1>
        <p className="mt-2 text-mist">Download generated CSV and PDF report artifacts stored in Supabase Storage.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href="/api/reports?type=attendance&format=pdf&store=true" className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
          Generate Attendance PDF
        </a>
        <a href="/api/reports?type=grade-sheet&format=pdf&store=true" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
          Generate Grade Sheet PDF
        </a>
        <a href="/api/reports?type=transcript&format=pdf&store=true" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
          Generate Transcript PDF
        </a>
      </div>
      <div className="grid gap-4">
        {(files ?? []).length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No stored report files found yet.</div>
        ) : (
          (files ?? []).map((file) => {
            const { data } = supabase.storage.from("report-files").getPublicUrl(`${institutionId}/${file.name}`);
            return (
              <article key={file.id ?? file.name} className="glass rounded-[32px] p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{file.name}</h2>
                    <p className="mt-2 text-sm text-mist">Stored report artifact ready for download.</p>
                  </div>
                  <a href={data.publicUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                    Download
                  </a>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

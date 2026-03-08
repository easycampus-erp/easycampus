"use client";

import { useState } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";

type Option = { label: string; value: string };

export function ResourceUploader({ subjects }: { subjects: Option[] }) {
  const [form, setForm] = useState({
    subjectId: subjects[0]?.value ?? "",
    title: "",
    description: "",
    materialType: "material"
  });
  const [message, setMessage] = useState("");

  async function upload(file: File | null) {
    if (!file) return;

    try {
      const supabase = createClientSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You are not signed in.");

      const bucket = form.materialType === "assignment" ? "assignments" : "faculty-materials";
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      const response = await fetch("/api/faculty/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: form.subjectId,
          title: form.title || file.name,
          description: form.description,
          materialType: form.materialType,
          filePath: path,
          fileUrl: data.publicUrl
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save resource metadata.");
      setMessage(result.message ?? "Uploaded.");
      setForm((current) => ({ ...current, title: "", description: "" }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload resource.");
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Faculty Materials and Assignment Uploads</h1>
        <p className="mt-2 text-mist">Upload course materials, assignment briefs, and report files into Supabase Storage and register them in the ERP.</p>
      </div>
      <div className="glass rounded-[32px] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            Subject
            <select
              value={form.subjectId}
              onChange={(event) => setForm((current) => ({ ...current, subjectId: event.target.value }))}
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
            >
              {subjects.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-ink">
            Type
            <select
              value={form.materialType}
              onChange={(event) => setForm((current) => ({ ...current, materialType: event.target.value }))}
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
            >
              <option value="material">Material</option>
              <option value="report">Report File</option>
              <option value="assignment">Assignment</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-ink">
            Title
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Description
            <input value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none" />
          </label>
          <label className="block text-sm font-medium text-ink">
            File Upload
            <input
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void upload(file);
              }}
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
        </div>
        <p className="mt-4 text-sm text-mist">{message || "Create Supabase buckets named `faculty-materials` and `assignments` with matching storage policies before using uploads."}</p>
      </div>
    </section>
  );
}

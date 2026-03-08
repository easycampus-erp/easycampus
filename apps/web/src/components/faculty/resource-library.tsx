"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ResourceItem = {
  id: string;
  title: string;
  description: string;
  materialType: "material" | "report" | "assignment";
  filePath: string;
  fileUrl: string;
  subtitle: string;
};

export function ResourceLibrary({ items }: { items: ResourceItem[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function remove(item: ResourceItem) {
    const response = await fetch("/api/faculty/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        materialType: item.materialType,
        filePath: item.filePath
      })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to delete resource.");
    setMessage(result.message ?? "Removed.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Faculty Resource Library</h1>
        <p className="mt-2 text-mist">Browse uploaded materials, download files, and remove outdated content.</p>
      </div>
      <p className="text-sm text-mist">{message}</p>
      <div className="grid gap-4">
        {items.length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No uploaded resources found yet.</div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="glass rounded-[32px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm text-mist">{item.description || "No description provided."}</p>
                  <p className="mt-3 text-sm text-mist">{item.subtitle}</p>
                </div>
                <div className="flex gap-3">
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await remove(item);
                      } catch (error) {
                        setMessage(error instanceof Error ? error.message : "Unable to delete resource.");
                      }
                    }}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

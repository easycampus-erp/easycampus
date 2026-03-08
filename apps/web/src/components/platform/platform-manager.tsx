"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Institution = {
  id: string;
  name: string;
  code: string;
  institutionType: string;
  status: string;
  createdAt: string;
};

const statusOptions = ["active", "paused", "trial", "suspended", "archived"];

export function PlatformManager({
  institutions,
  requestDemoCount,
  recentAudits
}: {
  institutions: Institution[];
  requestDemoCount: number;
  recentAudits?: Array<{ id: string; institutionName: string; action: string; entityType: string; createdAt: string }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    code: "",
    institutionType: "",
    timezone: "Asia/Kolkata",
    ownerName: "",
    ownerEmail: ""
  });

  async function createInstitution() {
    const response = await fetch("/api/platform/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to provision institution.");
    setForm({ name: "", code: "", institutionType: "", timezone: "Asia/Kolkata", ownerName: "", ownerEmail: "" });
    setMessage(result.message ?? "Institution provisioned.");
    router.refresh();
  }

  async function updateStatus(id: string, status: string) {
    const needsReason = status === "paused" || status === "suspended";
    const reason = needsReason ? window.prompt(`Add a reason for setting this tenant to ${status}.`) ?? "" : "";
    const response = await fetch("/api/platform/institutions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, reason })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to update institution status.");
    setMessage(result.message ?? "Institution updated.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Platform Super Admin</h1>
        <p className="mt-2 text-mist">Provision tenants, control tenant status, and watch platform-level growth from one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Institutions" value={String(institutions.length)} caption="Provisioned tenants" />
        <Metric label="Demo Leads" value={String(requestDemoCount)} caption="Pipeline institutions" />
        <Metric label="Active" value={String(institutions.filter((item) => item.status === "active").length)} caption="Live campuses" />
        <Metric label="Trial" value={String(institutions.filter((item) => item.status === "trial").length)} caption="Trial tenants" />
      </div>

      <div className="glass rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-ink">Provision Institution</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field label="Institution Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <Field label="Campus Code" value={form.code} onChange={(value) => setForm((current) => ({ ...current, code: value.toUpperCase() }))} />
          <Field label="Institution Type" value={form.institutionType} onChange={(value) => setForm((current) => ({ ...current, institutionType: value }))} />
          <Field label="Timezone" value={form.timezone} onChange={(value) => setForm((current) => ({ ...current, timezone: value }))} />
          <Field label="Bootstrap Owner Name" value={form.ownerName} onChange={(value) => setForm((current) => ({ ...current, ownerName: value }))} />
          <Field label="Bootstrap Owner Email" value={form.ownerEmail} onChange={(value) => setForm((current) => ({ ...current, ownerEmail: value }))} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={async () => {
              try {
                await createInstitution();
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Unable to provision institution.");
              }
            }}
            className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft"
          >
            Provision Trial Tenant
          </button>
          <span className="text-sm text-mist">{message || "New tenants start in trial mode so platform review can happen before full activation."}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {institutions.map((institution) => (
          <article key={institution.id} className="glass rounded-[32px] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">{institution.name}</h2>
                <p className="mt-2 text-sm text-mist">
                  {institution.code} | {institution.institutionType} | Created {new Date(institution.createdAt).toLocaleDateString()}
                </p>
              </div>
              <select
                value={institution.status}
                onChange={(event) => {
                  void updateStatus(institution.id, event.target.value).catch((error) => {
                    setMessage(error instanceof Error ? error.message : "Unable to update institution.");
                  });
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
      <div className="glass rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-ink">Cross-Tenant Audit Feed</h2>
        <div className="mt-4 grid gap-3">
          {(recentAudits ?? []).length === 0 ? (
            <p className="text-sm text-mist">No cross-tenant audit entries available yet.</p>
          ) : (
            (recentAudits ?? []).map((audit) => (
              <article key={audit.id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-sm font-semibold text-ink">{audit.institutionName}</p>
                <p className="mt-1 text-sm text-mist">
                  {audit.action} {audit.entityType} | {new Date(audit.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <article className="glass rounded-[32px] p-5">
      <p className="text-sm text-mist">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-mist">{caption}</p>
    </article>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
      />
    </label>
  );
}

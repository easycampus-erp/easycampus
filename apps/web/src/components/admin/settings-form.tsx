"use client";

import { useState } from "react";

export function SettingsForm({
  initialValues
}: {
  initialValues: {
    supportEmail: string;
    supportPhone: string;
    reportFooter: string;
    minimumPercentage: string;
    lateWeight: string;
    alertThreshold: string;
    passingMarks: string;
    gradeScale: string;
  };
}) {
  const [form, setForm] = useState(initialValues);
  const [message, setMessage] = useState("");

  async function save() {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save settings.");
      setMessage(result.message ?? "Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save settings.");
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Institution Settings and Rules</h1>
        <p className="mt-2 text-mist">Configure support contacts, reporting footer text, attendance thresholds, and grading scale logic.</p>
      </div>
      <div className="glass rounded-[32px] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Support Email" value={form.supportEmail} onChange={(value) => setForm((current) => ({ ...current, supportEmail: value }))} />
          <Field label="Support Phone" value={form.supportPhone} onChange={(value) => setForm((current) => ({ ...current, supportPhone: value }))} />
          <Field label="Report Footer" value={form.reportFooter} onChange={(value) => setForm((current) => ({ ...current, reportFooter: value }))} />
          <Field label="Minimum Attendance %" value={form.minimumPercentage} onChange={(value) => setForm((current) => ({ ...current, minimumPercentage: value }))} />
          <Field label="Late Weight" value={form.lateWeight} onChange={(value) => setForm((current) => ({ ...current, lateWeight: value }))} />
          <Field label="Alert Threshold %" value={form.alertThreshold} onChange={(value) => setForm((current) => ({ ...current, alertThreshold: value }))} />
          <Field label="Passing Marks" value={form.passingMarks} onChange={(value) => setForm((current) => ({ ...current, passingMarks: value }))} />
        </div>
        <label className="mt-4 block text-sm font-medium text-ink">
          Grade Scale JSON
          <textarea
            value={form.gradeScale}
            onChange={(event) => setForm((current) => ({ ...current, gradeScale: event.target.value }))}
            className="mt-2 min-h-[220px] w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
          />
        </label>
        <div className="mt-5 flex items-center gap-4">
          <button type="button" onClick={save} className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
            Save Settings
          </button>
          <span className="text-sm text-mist">{message || "Use JSON arrays for grade scale entries with min, grade, and points keys."}</span>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none" />
    </label>
  );
}


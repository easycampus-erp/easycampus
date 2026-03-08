"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const initialState = {
  institutionName: "",
  contactName: "",
  workEmail: "",
  phone: "",
  campusType: "",
  studentCount: "",
  requiredModules: "",
  timeline: "",
  notes: ""
};

export function DemoForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/request-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to submit demo request.");
      }

      setStatus("success");
      setMessage(result.message ?? "Demo request submitted successfully.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit demo request.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[36px] p-7 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker text-xs font-semibold text-brand">Book a demo</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Request a tailored walkthrough</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Supabase lead capture ready</span>
      </div>

      <p className="mt-4 text-sm leading-7 text-mist">
        Share your institution profile and rollout priorities. The form posts to a Next.js route handler and stores leads in Supabase for the Vercel deployment path.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Institution name" value={form.institutionName} onChange={(value) => setForm({ ...form, institutionName: value })} />
        <Field label="Contact name" value={form.contactName} onChange={(value) => setForm({ ...form, contactName: value })} />
        <Field label="Work email" type="email" value={form.workEmail} onChange={(value) => setForm({ ...form, workEmail: value })} />
        <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
        <Field label="Campus type" placeholder="University, college, institute" value={form.campusType} onChange={(value) => setForm({ ...form, campusType: value })} />
        <Field label="Student count" placeholder="e.g. 5000" value={form.studentCount} onChange={(value) => setForm({ ...form, studentCount: value })} />
        <Field label="Required modules" placeholder="Student management, attendance, mentor workflows" value={form.requiredModules} onChange={(value) => setForm({ ...form, requiredModules: value })} />
        <Field label="Timeline" placeholder="This month, next quarter" value={form.timeline} onChange={(value) => setForm({ ...form, timeline: value })} />
      </div>

      <label className="mt-4 block text-sm font-medium text-ink">
        Notes
        <textarea
          className="mt-2 min-h-32 w-full rounded-[28px] border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand/40"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          placeholder="Tell us about departments, campuses, rollout goals, or current tools."
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-600 disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Submit Demo Request"}
        </button>
        <span className={status === "error" ? "text-sm text-red-600" : "text-sm text-mist"}>
          {message || "Your request will be stored in Supabase and available for follow-up inside the admin pipeline."}
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand/40"
      />
    </label>
  );
}

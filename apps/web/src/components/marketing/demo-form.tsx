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
    <form onSubmit={handleSubmit} className="glass rounded-[32px] p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">Request a tailored demo</h2>
      <p className="mt-2 text-sm text-mist">
        This form posts to a Next.js route handler and stores leads in Supabase, which is the recommended zero-dollar MVP path for Vercel.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Institution name" value={form.institutionName} onChange={(value) => setForm({ ...form, institutionName: value })} />
        <Field label="Contact name" value={form.contactName} onChange={(value) => setForm({ ...form, contactName: value })} />
        <Field label="Work email" type="email" value={form.workEmail} onChange={(value) => setForm({ ...form, workEmail: value })} />
        <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
        <Field label="Campus type" placeholder="University, college, institute" value={form.campusType} onChange={(value) => setForm({ ...form, campusType: value })} />
        <Field label="Student count" placeholder="e.g. 5000" value={form.studentCount} onChange={(value) => setForm({ ...form, studentCount: value })} />
        <Field label="Required modules" placeholder="Student management, attendance, mentor management" value={form.requiredModules} onChange={(value) => setForm({ ...form, requiredModules: value })} />
        <Field label="Timeline" placeholder="This month, next quarter" value={form.timeline} onChange={(value) => setForm({ ...form, timeline: value })} />
      </div>

      <label className="mt-4 block text-sm font-medium text-ink">
        Notes
        <textarea
          className="mt-2 min-h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          placeholder="Tell us about departments, campuses, rollout goals, or current tools."
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Submit Demo Request"}
        </button>
        <span className={status === "error" ? "text-sm text-red-600" : "text-sm text-mist"}>
          {message || "Your request will be stored in Supabase once the Vercel env variables are configured."}
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
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
      />
    </label>
  );
}

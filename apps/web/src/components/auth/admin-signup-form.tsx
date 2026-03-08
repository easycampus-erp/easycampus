"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";

const initialState = {
  institutionName: "",
  institutionCode: "",
  institutionType: "",
  fullName: "",
  email: "",
  password: "",
  phone: ""
};

export function AdminSignupForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/signup/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to create admin account.");
      }

      const supabase = createClientSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });

      if (error) {
        throw error;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create admin account.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[32px] p-8">
      <h2 className="text-3xl font-semibold tracking-tight text-ink">Create the first admin account</h2>
      <p className="mt-2 text-sm text-mist">This creates the institution, the admin user, the membership, and signs you in.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Institution name" value={form.institutionName} onChange={(value) => setForm({ ...form, institutionName: value })} />
        <Field label="Institution code" value={form.institutionCode} onChange={(value) => setForm({ ...form, institutionCode: value })} />
        <Field label="Institution type" value={form.institutionType} onChange={(value) => setForm({ ...form, institutionType: value })} />
        <Field label="Full name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
        <Field label="Work email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
        <Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
          Create Admin Account
        </button>
        <span className={message ? "text-sm text-red-600" : "text-sm text-mist"}>
          {message || "Use this bootstrap flow only for the first campus admin."}
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
      />
    </label>
  );
}

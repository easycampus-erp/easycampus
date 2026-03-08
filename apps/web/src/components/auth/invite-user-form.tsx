"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const initialState = {
  email: "",
  fullName: "",
  role: "faculty",
  departmentId: "",
  courseId: "",
  section: "",
  admissionYear: "",
  enrollmentNo: "",
  employeeCode: "",
  designation: "",
  capacity: "",
  guardianName: "",
  guardianPhone: ""
};

export function InviteUserForm() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to send invitation.");
      }

      setMessage(result.message ?? "Invitation sent.");
      setForm(initialState);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send invitation.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[32px] p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">Invite faculty, mentors, students, and admins</h2>
      <p className="mt-2 text-sm text-mist">Fill only the fields that match the selected role. Supabase sends the invite, and the signup trigger creates the right records.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Full name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
        <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <SelectField label="Role" value={form.role} onChange={(value) => setForm({ ...form, role: value })} options={["admin", "faculty", "mentor", "student"]} />
        <Field label="Department ID" value={form.departmentId} onChange={(value) => setForm({ ...form, departmentId: value })} />
        <Field label="Course ID" value={form.courseId} onChange={(value) => setForm({ ...form, courseId: value })} />
        <Field label="Section" value={form.section} onChange={(value) => setForm({ ...form, section: value })} />
        <Field label="Admission year" value={form.admissionYear} onChange={(value) => setForm({ ...form, admissionYear: value })} />
        <Field label="Enrollment no" value={form.enrollmentNo} onChange={(value) => setForm({ ...form, enrollmentNo: value })} />
        <Field label="Employee code" value={form.employeeCode} onChange={(value) => setForm({ ...form, employeeCode: value })} />
        <Field label="Designation" value={form.designation} onChange={(value) => setForm({ ...form, designation: value })} />
        <Field label="Mentor capacity" value={form.capacity} onChange={(value) => setForm({ ...form, capacity: value })} />
        <Field label="Guardian name" value={form.guardianName} onChange={(value) => setForm({ ...form, guardianName: value })} />
        <Field label="Guardian phone" value={form.guardianPhone} onChange={(value) => setForm({ ...form, guardianPhone: value })} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
          Send Invite
        </button>
        <span className={message && message.toLowerCase().includes("unable") ? "text-sm text-red-600" : "text-sm text-mist"}>
          {message || "IDs should come from the corresponding Supabase records for departments and courses."}
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

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

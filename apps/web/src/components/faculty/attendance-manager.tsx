"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  label: string;
  value: string;
  section?: string;
};

type SessionItem = {
  id: string;
  title: string;
  subtitle: string;
  stats: string;
};

type AttendanceStatus = "present" | "absent" | "late" | "excused";

const statusOptions: { label: string; value: AttendanceStatus }[] = [
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Late", value: "late" },
  { label: "Excused", value: "excused" }
];

export function AttendanceManager({
  subjects,
  students,
  recentSessions
}: {
  subjects: Option[];
  students: Option[];
  recentSessions: SessionItem[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    subjectId: subjects[0]?.value ?? "",
    sessionType: "lecture",
    sessionDate: new Date().toISOString().slice(0, 10),
    section: students.find((student) => student.section)?.section ?? "",
    startTime: "09:00",
    endTime: "10:00"
  });
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    () =>
      students.reduce<Record<string, AttendanceStatus>>((acc, student) => {
        acc[student.value] = "present";
        return acc;
      }, {})
  );

  const visibleStudents = useMemo(() => {
    if (!form.section) return students;
    return students.filter((student) => student.section === form.section);
  }, [form.section, students]);

  async function saveAttendance() {
    const payload = {
      ...form,
      records: visibleStudents.map((student) => ({
        studentId: student.value,
        status: statuses[student.value] ?? "present"
      }))
    };

    const response = await fetch("/api/faculty/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? "Unable to save attendance.");
    }
    setMessage(result.message ?? "Attendance saved.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Faculty Attendance</h1>
        <p className="mt-2 text-mist">Create a session, mark each student, and push the full attendance sheet into Supabase in one submit.</p>
      </div>

      <div className="glass rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-ink">Create session and mark attendance</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            label="Subject"
            value={form.subjectId}
            options={subjects}
            onChange={(value) => setForm((current) => ({ ...current, subjectId: value }))}
          />
          <SelectField
            label="Session Type"
            value={form.sessionType}
            options={[
              { label: "Lecture", value: "lecture" },
              { label: "Lab", value: "lab" }
            ]}
            onChange={(value) => setForm((current) => ({ ...current, sessionType: value }))}
          />
          <InputField label="Session Date" type="date" value={form.sessionDate} onChange={(value) => setForm((current) => ({ ...current, sessionDate: value }))} />
          <InputField label="Section" value={form.section} onChange={(value) => setForm((current) => ({ ...current, section: value }))} />
          <InputField label="Start Time" type="time" value={form.startTime} onChange={(value) => setForm((current) => ({ ...current, startTime: value }))} />
          <InputField label="End Time" type="time" value={form.endTime} onChange={(value) => setForm((current) => ({ ...current, endTime: value }))} />
        </div>

        <div className="mt-6 grid gap-3">
          {visibleStudents.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-mist">No students match the selected section yet.</div>
          ) : (
            visibleStudents.map((student) => (
              <div key={student.value} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{student.label}</p>
                  <p className="text-sm text-mist">Section {student.section ?? "N/A"}</p>
                </div>
                <select
                  value={statuses[student.value] ?? "present"}
                  onChange={(event) =>
                    setStatuses((current) => ({
                      ...current,
                      [student.value]: event.target.value as AttendanceStatus
                    }))
                  }
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-ink outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={async () => {
              try {
                await saveAttendance();
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Unable to save attendance.");
              }
            }}
            className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft"
          >
            Save Attendance
          </button>
          <span className="text-sm text-mist">{message || "Each submit creates one attendance session and its student records."}</span>
        </div>
      </div>

      <div className="glass rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-ink">Recent sessions</h2>
        <div className="mt-4 grid gap-3">
          {recentSessions.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-mist">No attendance sessions found yet.</div>
          ) : (
            recentSessions.map((session) => (
              <div key={session.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{session.title}</p>
                  <p className="text-sm text-mist">{session.stats}</p>
                </div>
                <p className="mt-1 text-sm text-mist">{session.subtitle}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "time";
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
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  label: string;
  value: string;
};

type TimetableEntryItem = {
  id: string;
  title: string;
  subtitle: string;
  values: {
    courseId: string;
    subjectId: string;
    facultyId: string;
    semesterNo: string;
    section: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomCode: string;
  };
};

const dayOptions = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "7" }
];

export function TimetableBuilder({
  courses,
  subjects,
  faculty,
  entries
}: {
  courses: Option[];
  subjects: Option[];
  faculty: Option[];
  entries: TimetableEntryItem[];
}) {
  const router = useRouter();
  const initialForm = useMemo(
    () => ({
      courseId: courses[0]?.value ?? "",
      subjectId: subjects[0]?.value ?? "",
      facultyId: faculty[0]?.value ?? "",
      semesterNo: "1",
      section: "",
      dayOfWeek: "1",
      startTime: "09:00",
      endTime: "10:00",
      roomCode: ""
    }),
    [courses, faculty, subjects]
  );

  const [createForm, setCreateForm] = useState(initialForm);
  const [editing, setEditing] = useState<Record<string, TimetableEntryItem["values"]>>({});
  const [message, setMessage] = useState("");

  async function submit(method: "POST" | "PATCH" | "DELETE", payload: Record<string, string>) {
    const response = await fetch("/api/admin/timetable", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? "Unable to save timetable entry.");
    }
    setMessage(result.message ?? "Saved.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Timetable Builder</h1>
        <p className="mt-2 text-mist">Create and revise weekly class schedules for each course, section, semester, and assigned faculty member.</p>
      </div>

      <div className="glass rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-ink">Create timetable slot</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField label="Course" value={createForm.courseId} options={courses} onChange={(value) => setCreateForm((current) => ({ ...current, courseId: value }))} />
          <SelectField label="Subject" value={createForm.subjectId} options={subjects} onChange={(value) => setCreateForm((current) => ({ ...current, subjectId: value }))} />
          <SelectField label="Faculty" value={createForm.facultyId} options={faculty} onChange={(value) => setCreateForm((current) => ({ ...current, facultyId: value }))} />
          <InputField label="Semester" type="number" value={createForm.semesterNo} onChange={(value) => setCreateForm((current) => ({ ...current, semesterNo: value }))} />
          <InputField label="Section" value={createForm.section} onChange={(value) => setCreateForm((current) => ({ ...current, section: value }))} />
          <SelectField label="Day" value={createForm.dayOfWeek} options={dayOptions} onChange={(value) => setCreateForm((current) => ({ ...current, dayOfWeek: value }))} />
          <InputField label="Start Time" type="time" value={createForm.startTime} onChange={(value) => setCreateForm((current) => ({ ...current, startTime: value }))} />
          <InputField label="End Time" type="time" value={createForm.endTime} onChange={(value) => setCreateForm((current) => ({ ...current, endTime: value }))} />
          <InputField label="Room" value={createForm.roomCode} onChange={(value) => setCreateForm((current) => ({ ...current, roomCode: value }))} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={async () => {
              try {
                await submit("POST", createForm);
                setCreateForm(initialForm);
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Unable to create timetable entry.");
              }
            }}
            className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft"
          >
            Create Slot
          </button>
          <span className="text-sm text-mist">{message || "Build the weekly timetable structure for this institution."}</span>
        </div>
      </div>

      <div className="grid gap-5">
        {entries.length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No timetable entries found yet.</div>
        ) : (
          entries.map((entry) => {
            const values = editing[entry.id] ?? entry.values;

            return (
              <article key={entry.id} className="glass rounded-[32px] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{entry.title}</h2>
                    <p className="mt-1 text-sm text-mist">{entry.subtitle}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await submit("PATCH", { id: entry.id, ...values });
                        } catch (error) {
                          setMessage(error instanceof Error ? error.message : "Unable to update timetable entry.");
                        }
                      }}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await submit("DELETE", { id: entry.id });
                        } catch (error) {
                          setMessage(error instanceof Error ? error.message : "Unable to delete timetable entry.");
                        }
                      }}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <SelectField
                    label="Course"
                    value={values.courseId}
                    options={courses}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, courseId: value } }))}
                  />
                  <SelectField
                    label="Subject"
                    value={values.subjectId}
                    options={subjects}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, subjectId: value } }))}
                  />
                  <SelectField
                    label="Faculty"
                    value={values.facultyId}
                    options={faculty}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, facultyId: value } }))}
                  />
                  <InputField
                    label="Semester"
                    type="number"
                    value={values.semesterNo}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, semesterNo: value } }))}
                  />
                  <InputField
                    label="Section"
                    value={values.section}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, section: value } }))}
                  />
                  <SelectField
                    label="Day"
                    value={values.dayOfWeek}
                    options={dayOptions}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, dayOfWeek: value } }))}
                  />
                  <InputField
                    label="Start Time"
                    type="time"
                    value={values.startTime}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, startTime: value } }))}
                  />
                  <InputField
                    label="End Time"
                    type="time"
                    value={values.endTime}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, endTime: value } }))}
                  />
                  <InputField
                    label="Room"
                    value={values.roomCode}
                    onChange={(value) => setEditing((current) => ({ ...current, [entry.id]: { ...values, roomCode: value } }))}
                  />
                </div>
              </article>
            );
          })
        )}
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
  type?: "text" | "number" | "time";
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
  options: Option[];
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

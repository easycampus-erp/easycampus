"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  label: string;
  value: string;
};

type MarkItem = {
  id: string;
  studentName: string;
  studentMeta: string;
  subjectName: string;
  examName: string;
  maxMarksLabel: string;
  values: {
    examId: string;
    subjectId: string;
    studentId: string;
    marksObtained: string;
    grade: string;
    remarks: string;
  };
};

const gradeOptions = ["O", "A+", "A", "B+", "B", "C", "P", "F"];

export function MarksEntryManager({
  exams,
  subjects,
  students,
  marks
}: {
  exams: Option[];
  subjects: Option[];
  students: Option[];
  marks: MarkItem[];
}) {
  const router = useRouter();
  const initialForm = useMemo(
    () => ({
      examId: exams[0]?.value ?? "",
      subjectId: subjects[0]?.value ?? "",
      studentId: students[0]?.value ?? "",
      marksObtained: "",
      grade: "",
      remarks: ""
    }),
    [exams, students, subjects]
  );

  const [createForm, setCreateForm] = useState(initialForm);
  const [editing, setEditing] = useState<Record<string, MarkItem["values"]>>({});
  const [message, setMessage] = useState("");

  async function submit(method: "POST" | "PATCH" | "DELETE", payload: Record<string, string>) {
    const response = await fetch("/api/faculty/marks", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? "Unable to save marks.");
    }

    setMessage(result.message ?? "Saved.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Faculty Marks Entry</h1>
        <p className="mt-2 text-mist">Publish assessment scores on live Supabase records, then revise or remove them from one place.</p>
      </div>

      <div className="glass rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-ink">Create mark entry</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField label="Exam" value={createForm.examId} options={exams} onChange={(value) => setCreateForm((current) => ({ ...current, examId: value }))} />
          <SelectField label="Subject" value={createForm.subjectId} options={subjects} onChange={(value) => setCreateForm((current) => ({ ...current, subjectId: value }))} />
          <SelectField label="Student" value={createForm.studentId} options={students} onChange={(value) => setCreateForm((current) => ({ ...current, studentId: value }))} />
          <InputField label="Marks Obtained" type="number" value={createForm.marksObtained} onChange={(value) => setCreateForm((current) => ({ ...current, marksObtained: value }))} />
          <SelectField
            label="Grade"
            value={createForm.grade}
            options={gradeOptions.map((grade) => ({ label: grade, value: grade }))}
            onChange={(value) => setCreateForm((current) => ({ ...current, grade: value }))}
          />
          <InputField label="Remarks" value={createForm.remarks} onChange={(value) => setCreateForm((current) => ({ ...current, remarks: value }))} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={async () => {
              try {
                await submit("POST", createForm);
                setCreateForm(initialForm);
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Unable to save marks.");
              }
            }}
            className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft"
          >
            Save Marks
          </button>
          <span className="text-sm text-mist">{message || "Create a new scored record for a student, subject, and exam."}</span>
        </div>
      </div>

      <div className="grid gap-5">
        {marks.length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No marks records found for this faculty profile yet.</div>
        ) : (
          marks.map((mark) => {
            const values = editing[mark.id] ?? mark.values;

            return (
              <article key={mark.id} className="glass rounded-[32px] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{mark.studentName}</h2>
                    <p className="mt-1 text-sm text-mist">{mark.studentMeta}</p>
                    <p className="mt-2 text-sm text-mist">
                      {mark.subjectName} | {mark.examName} | {mark.maxMarksLabel}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await submit("PATCH", { id: mark.id, ...values });
                        } catch (error) {
                          setMessage(error instanceof Error ? error.message : "Unable to update marks.");
                        }
                      }}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await submit("DELETE", { id: mark.id });
                        } catch (error) {
                          setMessage(error instanceof Error ? error.message : "Unable to delete marks.");
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
                    label="Exam"
                    value={values.examId}
                    options={exams}
                    onChange={(value) => setEditing((current) => ({ ...current, [mark.id]: { ...values, examId: value } }))}
                  />
                  <SelectField
                    label="Subject"
                    value={values.subjectId}
                    options={subjects}
                    onChange={(value) => setEditing((current) => ({ ...current, [mark.id]: { ...values, subjectId: value } }))}
                  />
                  <SelectField
                    label="Student"
                    value={values.studentId}
                    options={students}
                    onChange={(value) => setEditing((current) => ({ ...current, [mark.id]: { ...values, studentId: value } }))}
                  />
                  <InputField
                    label="Marks Obtained"
                    type="number"
                    value={values.marksObtained}
                    onChange={(value) => setEditing((current) => ({ ...current, [mark.id]: { ...values, marksObtained: value } }))}
                  />
                  <SelectField
                    label="Grade"
                    value={values.grade}
                    options={gradeOptions.map((grade) => ({ label: grade, value: grade }))}
                    onChange={(value) => setEditing((current) => ({ ...current, [mark.id]: { ...values, grade: value } }))}
                  />
                  <InputField
                    label="Remarks"
                    value={values.remarks}
                    onChange={(value) => setEditing((current) => ({ ...current, [mark.id]: { ...values, remarks: value } }))}
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
  type?: "text" | "number";
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

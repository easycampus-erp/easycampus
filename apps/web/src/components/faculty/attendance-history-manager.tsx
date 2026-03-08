"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

type SessionItem = {
  id: string;
  title: string;
  subtitle: string;
  records: {
    studentId: string;
    studentName: string;
    studentMeta: string;
    status: AttendanceStatus;
  }[];
};

const statusOptions: AttendanceStatus[] = ["present", "absent", "late", "excused"];

export function AttendanceHistoryManager({ sessions }: { sessions: SessionItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Record<string, Record<string, AttendanceStatus>>>({});
  const [message, setMessage] = useState("");

  async function saveSession(session: SessionItem) {
    const payload = {
      sessionId: session.id,
      records: session.records.map((record) => ({
        studentId: record.studentId,
        status: editing[session.id]?.[record.studentId] ?? record.status
      }))
    };

    const response = await fetch("/api/faculty/attendance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to update attendance.");
    setMessage(result.message ?? "Attendance updated.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Attendance History and Corrections</h1>
        <p className="mt-2 text-mist">Review previous sessions and apply bulk corrections when attendance needs to be revised.</p>
      </div>
      <p className="text-sm text-mist">{message || "Each save updates all student statuses for the selected session."}</p>
      <div className="grid gap-5">
        {sessions.length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No attendance history found.</div>
        ) : (
          sessions.map((session) => (
            <article key={session.id} className="glass rounded-[32px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">{session.title}</h2>
                  <p className="mt-1 text-sm text-mist">{session.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await saveSession(session);
                    } catch (error) {
                      setMessage(error instanceof Error ? error.message : "Unable to update attendance.");
                    }
                  }}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                >
                  Save Corrections
                </button>
              </div>
              <div className="mt-5 grid gap-3">
                {session.records.map((record) => (
                  <div key={record.studentId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{record.studentName}</p>
                      <p className="text-sm text-mist">{record.studentMeta}</p>
                    </div>
                    <select
                      value={editing[session.id]?.[record.studentId] ?? record.status}
                      onChange={(event) =>
                        setEditing((current) => ({
                          ...current,
                          [session.id]: {
                            ...(current[session.id] ?? {}),
                            [record.studentId]: event.target.value as AttendanceStatus
                          }
                        }))
                      }
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-ink outline-none"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

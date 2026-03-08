"use client";

import { useEffect, useState } from "react";
import { sampleKpis } from "@easycampus/ui";

const operationalSignals = [
  "Student lifecycle management",
  "Mentor mapping and follow-up",
  "Attendance intelligence",
  "Marks, exams, and analytics"
];

const showcaseViews = [
  {
    id: "admin",
    label: "HeyAdmin",
    title: "Institution command center",
    eyebrow: "Admin view",
    accent: "from-cyan-300 via-sky-400 to-brand",
    panel: "from-sky-500/20 to-cyan-300/5",
    stats: [
      { label: "Departments", value: "42" },
      { label: "Staff active", value: "1,260" },
      { label: "Weekly reports", value: "318" }
    ],
    rails: [
      { label: "Admissions queue", value: "126 pending" },
      { label: "Attendance alerts", value: "284 open" },
      { label: "Fee reminders", value: "412 sent" }
    ]
  },
  {
    id: "exam",
    label: "HeyExam",
    title: "Exam and result engine",
    eyebrow: "Academic control",
    accent: "from-amber-300 via-orange-300 to-pink-400",
    panel: "from-amber-400/20 to-rose-300/5",
    stats: [
      { label: "Exam cycles", value: "18" },
      { label: "Marks submitted", value: "93%" },
      { label: "Grade sheets", value: "7,420" }
    ],
    rails: [
      { label: "Internal assessment", value: "Synced daily" },
      { label: "Result processing", value: "Batch ready" },
      { label: "Faculty uploads", value: "Realtime" }
    ]
  },
  {
    id: "mentor",
    label: "HeyMentor",
    title: "Mentor risk and follow-up hub",
    eyebrow: "Student success",
    accent: "from-emerald-300 via-teal-300 to-cyan-400",
    panel: "from-emerald-400/20 to-cyan-300/5",
    stats: [
      { label: "Mentor pods", value: "486" },
      { label: "Risk cases", value: "284" },
      { label: "Meetings logged", value: "1,942" }
    ],
    rails: [
      { label: "Intervention queue", value: "Active" },
      { label: "Outcome tracking", value: "Weekly" },
      { label: "Escalation status", value: "Visible" }
    ]
  },
  {
    id: "student",
    label: "HeyStudent",
    title: "Student self-service workspace",
    eyebrow: "Student app",
    accent: "from-fuchsia-300 via-violet-300 to-sky-400",
    panel: "from-fuchsia-400/20 to-sky-300/5",
    stats: [
      { label: "Attendance", value: "93.4%" },
      { label: "GPA trend", value: "+0.32" },
      { label: "Unread notices", value: "6" }
    ],
    rails: [
      { label: "Timetable", value: "Today 6 classes" },
      { label: "Mentor notes", value: "2 new" },
      { label: "Fee status", value: "Current" }
    ]
  }
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseViews.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  const activeView = showcaseViews[activeIndex];

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <span className="section-kicker inline-flex rounded-full border border-brand/15 bg-white/80 px-4 py-2 text-xs font-semibold text-brand shadow-soft">
            AI Powered ERP for Smart Universities
          </span>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl xl:text-7xl">
            Run your campus on one intelligent operating system.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mist sm:text-xl">
            EasyMentor ERP unifies student operations, mentorship, academics, attendance, communication, and analytics so institutions can move faster with clearer decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/request-demo" className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-600">
              Request Demo
            </a>
            <a href="/features" className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-brand/30 hover:text-brand">
              Explore Platform
            </a>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {operationalSignals.map((signal) => (
              <div key={signal} className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-meadow" />
                {signal}
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sampleKpis.map((kpi) => (
              <div key={kpi.label} className="glass rounded-[28px] p-5">
                <p className="text-sm text-mist">{kpi.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{kpi.value}</p>
                <p className="mt-2 text-sm text-mist">{kpi.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[620px] lg:min-h-[660px]">
          <div className="float-slow absolute -right-6 top-10 h-32 w-32 rounded-[32px] bg-white/18 blur-xl" />
          <div className="float-delay absolute -left-5 bottom-20 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="gradient-panel marketing-grid relative overflow-hidden rounded-[40px] p-7 shadow-soft lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(3,7,18,0.08),rgba(3,7,18,0.2))]" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/68">Interactive ERP Preview</p>
                <h2 className="mt-2 max-w-md text-2xl font-semibold leading-tight text-white">
                  Watch the campus operating system switch across real institutional workflows.
                </h2>
              </div>
              <span className="rounded-full border border-cyan-200/50 bg-slate-950/20 px-3 py-1 text-sm font-semibold text-cyan-50 shadow-[0_8px_24px_rgba(6,182,212,0.18)] backdrop-blur">
                Live product view
              </span>
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap gap-3">
              {showcaseViews.map((view, index) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    activeIndex === index
                      ? "border border-white/45 bg-white/18 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                      : "border border-white/10 bg-slate-950/18 text-white/68 hover:bg-white/10"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="relative z-10 mt-8 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/96 p-5 text-ink shadow-[0_28px_90px_rgba(15,23,42,0.16)]">
                <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${activeView.panel}`} />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{activeView.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{activeView.title}</h3>
                  </div>
                  <div className={`rounded-2xl bg-gradient-to-r ${activeView.accent} px-4 py-3 text-right text-white shadow-soft`}>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">Sync status</p>
                    <p className="mt-1 text-lg font-semibold">Realtime</p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-3">
                  {activeView.stats.map((stat) => (
                    <div key={stat.label} className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">{stat.label}</p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 mt-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center justify-between text-sm text-mist">
                    <span>Workflow health</span>
                    <span>{activeView.label}</span>
                  </div>
                  <div className="mt-4 grid h-40 grid-cols-6 items-end gap-3">
                    {[54, 72, 64, 88, 79, 96].map((height, index) => (
                      <div key={`${activeView.id}-${height}`} className="flex flex-col items-center gap-2">
                        <div className={`w-full rounded-t-2xl bg-gradient-to-b ${activeView.accent}`} style={{ height: `${height}%` }} />
                        <span className="text-[11px] text-mist">M{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {activeView.rails.map((item, index) => (
                  <div key={item.label} className="rounded-[26px] border border-white/16 bg-slate-950/24 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">Panel 0{index + 1}</p>
                    <p className="mt-3 text-lg font-semibold">{item.label}</p>
                    <p className="mt-2 text-sm text-white/76">{item.value}</p>
                  </div>
                ))}

                <div className="rounded-[28px] border border-amber-200/45 bg-amber-300/18 px-5 py-4 text-amber-50 shadow-[0_14px_36px_rgba(245,158,11,0.18)] backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-50/80">Multi-role campus visibility</p>
                  <p className="mt-2 text-sm leading-7 text-amber-50/92">Switch between admin, exam, mentor, and student perspectives without losing the underlying institutional context.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

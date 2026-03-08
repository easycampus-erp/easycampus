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
    eyebrow: "Admin workspace",
    title: "Institution command center",
    summary: "Control departments, approvals, fees, notices, and academic operations from one live command layer.",
    accent: "from-sky-400 via-brand to-cyan-300",
    stats: [
      { label: "Departments", value: "42" },
      { label: "Staff active", value: "1,260" },
      { label: "Approvals today", value: "186" }
    ],
    alerts: ["Admissions queue", "Attendance exceptions", "Fee reminders"],
    floating: { title: "Institution pulse", value: "93.4%", helper: "Weekly operations health" }
  },
  {
    id: "exam",
    label: "HeyExam",
    eyebrow: "Exam engine",
    title: "Exam and result orchestration",
    summary: "Manage exam setup, marks entry, moderation, and result processing without spreadsheet-heavy coordination.",
    accent: "from-amber-300 via-orange-400 to-rose-400",
    stats: [
      { label: "Exam cycles", value: "18" },
      { label: "Marks synced", value: "93%" },
      { label: "Grade sheets", value: "7,420" }
    ],
    alerts: ["Marks pending", "Result batches", "Faculty uploads"],
    floating: { title: "Academic readiness", value: "Live", helper: "Every assessment layer in sync" }
  },
  {
    id: "mentor",
    label: "HeyMentor",
    eyebrow: "Mentor console",
    title: "Risk and intervention tracking",
    summary: "Watch mentor pods, student risks, meeting follow-through, and escalations in one support workspace.",
    accent: "from-emerald-300 via-teal-400 to-cyan-400",
    stats: [
      { label: "Mentor pods", value: "486" },
      { label: "Risk cases", value: "284" },
      { label: "Meetings logged", value: "1,942" }
    ],
    alerts: ["At-risk cohort", "Follow-up due", "Parent escalations"],
    floating: { title: "Support visibility", value: "Full", helper: "Meeting history and outcomes mapped" }
  },
  {
    id: "student",
    label: "HeyStudent",
    eyebrow: "Student app",
    title: "Student self-service experience",
    summary: "Give students one clean place for timetable, attendance, marks, messages, and payment visibility.",
    accent: "from-fuchsia-300 via-violet-400 to-sky-400",
    stats: [
      { label: "Attendance", value: "93.4%" },
      { label: "GPA trend", value: "+0.32" },
      { label: "Unread notices", value: "6" }
    ],
    alerts: ["Today timetable", "Mentor notes", "Fee status"],
    floating: { title: "Student clarity", value: "One app", helper: "Academics, notices, and updates together" }
  }
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseViews.length);
    }, 3200);

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

        <div className="relative min-h-[620px] lg:min-h-[670px]">
          <div className="absolute left-8 top-10 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute bottom-16 right-6 h-44 w-44 rounded-full bg-cyan-300/16 blur-3xl" />
          <div className="absolute inset-x-0 top-4 bottom-0 rounded-[42px] bg-[linear-gradient(155deg,#061326_0%,#0b2957_42%,#1270ff_100%)] shadow-[0_40px_120px_rgba(8,28,58,0.28)]" />
          <div className="absolute inset-x-0 top-4 bottom-0 rounded-[42px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.2),transparent_18%),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:auto,auto,34px_34px,34px_34px]" />

          <div className="relative z-10 px-6 pb-6 pt-8 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/75">Interactive ERP preview</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
                  Explore live product views instead of static marketing blocks.
                </h2>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                Multi-role campus visibility
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {showcaseViews.map((view, index) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    activeIndex === index
                      ? "bg-white text-ink shadow-soft"
                      : "border border-white/10 bg-white/8 text-white/70 hover:bg-white/14"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="relative mt-8 min-h-[470px]">
              <div className="absolute left-0 top-10 w-[72%] rounded-[34px] border border-white/18 bg-[#081a32]/80 p-4 shadow-[0_30px_90px_rgba(2,8,23,0.45)] backdrop-blur-xl">
                <div className="flex items-center justify-between rounded-[24px] border border-white/8 bg-white/6 px-4 py-3 text-white/72">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">{activeView.eyebrow}</span>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[0.28fr_0.72fr]">
                  <div className="rounded-[28px] border border-white/10 bg-white/6 p-4 text-white/82">
                    <div className="rounded-[20px] bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                      Workspace
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      {[activeView.label, "Attendance", "Reports", "Communication", "Settings"].map((item) => (
                        <div key={item} className={`rounded-2xl px-3 py-2 ${item === activeView.label ? "bg-white text-ink" : "bg-white/6 text-white/76"}`}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-white p-5 text-ink shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{activeView.eyebrow}</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{activeView.title}</h3>
                        <p className="mt-3 max-w-md text-sm leading-7 text-mist">{activeView.summary}</p>
                      </div>
                      <div className={`rounded-[22px] bg-gradient-to-r ${activeView.accent} px-4 py-3 text-right text-white shadow-soft`}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">Sync status</p>
                        <p className="mt-1 text-lg font-semibold">Realtime</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {activeView.stats.map((stat) => (
                        <div key={stat.label} className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">{stat.label}</p>
                          <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between text-sm text-mist">
                          <span>Operational trend</span>
                          <span>{activeView.label}</span>
                        </div>
                        <div className="mt-4 flex h-40 items-end gap-3">
                          {[44, 58, 53, 71, 65, 82, 78].map((height, index) => (
                            <div key={`${activeView.id}-${index}`} className="flex-1">
                              <div className={`w-full rounded-t-2xl bg-gradient-to-b ${activeView.accent}`} style={{ height: `${height}%` }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                        <p className="text-sm font-semibold text-ink">Active workflow stream</p>
                        <div className="mt-4 space-y-3">
                          {activeView.alerts.map((item, index) => (
                            <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3 text-sm">
                              <span className="text-ink">{item}</span>
                              <span className="text-mist">0{index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="float-slow absolute right-0 top-0 w-44 rounded-[30px] border border-white/18 bg-white/12 p-5 text-white shadow-[0_24px_70px_rgba(2,8,23,0.34)] backdrop-blur-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/62">Floating insight</p>
                <p className="mt-3 text-xl font-semibold">{activeView.floating.title}</p>
                <p className="mt-5 text-4xl font-semibold tracking-tight">{activeView.floating.value}</p>
                <p className="mt-3 text-sm leading-7 text-white/78">{activeView.floating.helper}</p>
              </div>

              <div className="float-delay absolute bottom-0 right-6 w-52 rounded-[30px] border border-cyan-200/30 bg-slate-950/52 p-5 text-white shadow-[0_26px_70px_rgba(2,8,23,0.36)] backdrop-blur-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Smart automation</p>
                <p className="mt-3 text-lg font-semibold">Action suggestions</p>
                <div className="mt-4 space-y-3 text-sm text-white/82">
                  <div className="rounded-2xl bg-white/8 px-3 py-3">Flag low attendance students for mentor review</div>
                  <div className="rounded-2xl bg-white/8 px-3 py-3">Trigger scheduled notice to pending fee cohort</div>
                  <div className="rounded-2xl bg-white/8 px-3 py-3">Export leadership summary for weekly review</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

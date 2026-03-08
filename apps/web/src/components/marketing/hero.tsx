import { sampleKpis } from "@easycampus/ui";

const operationalSignals = [
  "Student lifecycle management",
  "Mentor mapping and follow-up",
  "Attendance intelligence",
  "Marks, exams, and analytics"
];

const executiveStats = [
  {
    label: "Attendance Health",
    value: "93.4%",
    helper: "Across 42 departments and 18,460 active students"
  },
  {
    label: "At-Risk Students",
    value: "284",
    helper: "Mentor follow-up and defaulter workflows triggered"
  },
  {
    label: "Mentor Coverage",
    value: "486 pods",
    helper: "Structured support across year, section, and risk bands"
  },
  {
    label: "Faculty Adoption",
    value: "1,260",
    helper: "Teaching and admin users active in weekly workflows"
  }
];

export function Hero() {
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

        <div className="relative">
          <div className="gradient-panel marketing-grid overflow-hidden rounded-[40px] p-7 shadow-soft lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_34%),linear-gradient(180deg,rgba(3,7,18,0.10),rgba(3,7,18,0.22))]" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">Executive Snapshot</p>
                <h2 className="mt-2 max-w-md text-2xl font-semibold leading-tight text-white">
                  One view for academics, operations, and student support
                </h2>
              </div>
              <span className="rounded-full border border-cyan-200/50 bg-slate-950/20 px-3 py-1 text-sm font-semibold text-cyan-50 shadow-[0_8px_24px_rgba(6,182,212,0.18)] backdrop-blur">
                AI insights live
              </span>
            </div>

            <div className="relative z-10 mt-5 inline-flex rounded-full border border-amber-200/55 bg-slate-950/18 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-50 shadow-[0_10px_24px_rgba(245,158,11,0.18)] backdrop-blur">
              Multi-role campus visibility
            </div>

            <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2">
              {executiveStats.map((stat) => (
                <div key={stat.label} className="rounded-[28px] border border-white/18 bg-slate-950/24 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-md">
                  <p className="text-sm font-medium text-white/78">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-100/78">{stat.helper}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-8 rounded-[32px] border border-white/50 bg-white/96 p-5 text-ink shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
              <div className="flex items-center justify-between text-sm text-mist">
                <span>Weekly academic momentum</span>
                <span>Live operational signal</span>
              </div>
              <div className="mt-5 grid h-48 grid-cols-8 items-end gap-3">
                {[38, 52, 47, 66, 62, 83, 79, 94].map((height, index) => (
                  <div key={height} className="flex flex-col items-center gap-2">
                    <div className="w-full rounded-t-2xl bg-gradient-to-b from-sky-300 via-brand to-[#0c4fcb]" style={{ height: `${height}%` }} />
                    <span className="text-[11px] text-mist">W{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

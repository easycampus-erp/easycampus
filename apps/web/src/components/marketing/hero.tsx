import { sampleKpis } from "@easycampus/ui";

const operationalSignals = [
  "Student lifecycle management",
  "Mentor mapping and follow-up",
  "Attendance intelligence",
  "Marks, exams, and analytics"
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <span className="inline-flex rounded-full border border-brand/15 bg-white/80 px-4 py-2 text-xs font-semibold section-kicker text-brand shadow-soft">
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
          <div className="gradient-panel marketing-grid rounded-[40px] p-7 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/65">Executive Snapshot</p>
                <h2 className="mt-2 text-2xl font-semibold">One view for academics, operations, and student support</h2>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white/90">AI insights live</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/70">Attendance Health</p>
                <p className="mt-3 text-3xl font-semibold">91.8%</p>
                <p className="mt-2 text-sm text-white/70">Thresholds, alerts, and department visibility</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/70">At-Risk Students</p>
                <p className="mt-3 text-3xl font-semibold">128</p>
                <p className="mt-2 text-sm text-white/70">Mentor intervention workflows triggered</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/70">Mentor Coverage</p>
                <p className="mt-3 text-3xl font-semibold">312 groups</p>
                <p className="mt-2 text-sm text-white/70">Structured student support across cohorts</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/70">Department Uplift</p>
                <p className="mt-3 text-3xl font-semibold">+12%</p>
                <p className="mt-2 text-sm text-white/70">Performance and reporting adoption growth</p>
              </div>
            </div>

            <div className="mt-8 rounded-[32px] bg-white p-5 text-ink">
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
          <div className="absolute -right-4 -top-4 hidden rounded-full border border-white/60 bg-white/75 px-4 py-2 text-xs font-semibold text-ink shadow-soft xl:block">
            Multi-role campus visibility
          </div>
        </div>
      </div>
    </section>
  );
}

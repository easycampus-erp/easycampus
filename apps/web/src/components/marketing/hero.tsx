import { sampleKpis } from "@easycampus/ui";

export function Hero() {
  return (
    <section className="py-20">
      <div className="shell grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            AI Powered ERP for Smart Universities
          </span>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
            Run your campus on one intelligent operating system.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-mist">
            EasyMentor ERP brings student operations, mentorship, academics, attendance, communication, and analytics together in one modern SaaS platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/request-demo" className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
              Request Demo
            </a>
            <a href="/features" className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-ink">
              Explore Platform
            </a>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sampleKpis.map((kpi) => (
              <div key={kpi.label} className="glass rounded-3xl p-4">
                <p className="text-sm text-mist">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{kpi.value}</p>
                <p className="mt-1 text-sm text-mist">{kpi.helper}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-[32px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <strong className="text-ink">Executive Snapshot</strong>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">AI insights live</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-mist">Active Students</p><p className="mt-2 text-xl font-semibold">24,880</p></div>
            <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-mist">Attendance</p><p className="mt-2 text-xl font-semibold">91.8%</p></div>
            <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-mist">Mentor Alerts</p><p className="mt-2 text-xl font-semibold">128 flagged</p></div>
            <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-mist">Department Health</p><p className="mt-2 text-xl font-semibold">12% up</p></div>
          </div>
          <div className="mt-6 grid h-48 grid-cols-8 items-end gap-3">
            {[35, 55, 48, 72, 68, 88, 80, 92].map((height) => (
              <div key={height} className="rounded-t-2xl bg-gradient-to-b from-sky-300 to-brand" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


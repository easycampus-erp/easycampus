import { DemoForm } from "@/components/marketing/demo-form";

const demoTracks = [
  {
    title: "Admin workflows",
    body: "Department setup, mentor assignment, student upload, rules, analytics, and board-level reporting."
  },
  {
    title: "Academic workflows",
    body: "Attendance, marks entry, subject operations, exam setup, timetable flow, and faculty visibility."
  },
  {
    title: "Student experience",
    body: "Portal, mobile app, announcements, mentor communication, and academic performance visibility."
  }
];

export default function RequestDemoPage() {
  return (
    <section className="py-20 lg:py-24">
      <div className="shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <span className="inline-flex rounded-full border border-brand/15 bg-white/80 px-4 py-2 text-xs font-semibold section-kicker text-brand shadow-soft">
            Request Demo
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            See EasyMentor ERP in a campus-ready walkthrough.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
            Tell us about your institution, rollout priorities, and operational pain points. We will show the exact admin, academic, and student workflows relevant to your campus.
          </p>

          <div className="mt-8 space-y-4">
            {demoTracks.map((track, index) => (
              <article key={track.title} className="glass rounded-[30px] p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-mist">0{index + 1}</span>
                  <h2 className="text-lg font-semibold text-ink">{track.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-7 text-mist">{track.body}</p>
              </article>
            ))}
          </div>
        </div>

        <DemoForm />
      </div>
    </section>
  );
}

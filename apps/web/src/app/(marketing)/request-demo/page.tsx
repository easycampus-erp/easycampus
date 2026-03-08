import { DemoForm } from "@/components/marketing/demo-form";

const demoTracks = [
  {
    title: "Admin workflows",
    body: "Department setup, mentor assignment, student upload, rules, analytics, and reporting."
  },
  {
    title: "Academic workflows",
    body: "Attendance, marks entry, subject operations, course delivery, and faculty visibility."
  },
  {
    title: "Student experience",
    body: "Portal, mobile app, announcements, mentor communication, and performance visibility."
  }
];

export default function RequestDemoPage() {
  return (
    <>
      <section className="py-20">
        <div className="shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              Request Demo
            </span>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-ink">See EasyMentor ERP in action</h1>
            <p className="mt-5 text-lg text-mist">
              This page is now wired for the Vercel + Supabase MVP path. Submit the form and the lead can be stored directly in Supabase through a Next.js route handler.
            </p>

            <div className="mt-8 space-y-4">
              {demoTracks.map((track) => (
                <article key={track.title} className="glass rounded-3xl p-5">
                  <h2 className="text-xl font-semibold text-ink">{track.title}</h2>
                  <p className="mt-2 text-sm text-mist">{track.body}</p>
                </article>
              ))}
            </div>
          </div>

          <DemoForm />
        </div>
      </section>
    </>
  );
}


import Link from "next/link";
import { CtaBanner } from "@/components/marketing/cta-banner";

const plans = [
  {
    name: "Starter Campus",
    fit: "For single-campus colleges replacing spreadsheets and disconnected portals",
    price: "Custom MVP rollout",
    emphasis: false,
    features: [
      "Student master, departments, courses, and subjects",
      "Attendance workflows with role dashboards",
      "Announcements, notices, and invite-based onboarding",
      "Vercel + Supabase deployment path for fast go-live"
    ]
  },
  {
    name: "Growth Institution",
    fit: "For institutions expanding into mentorship, exams, analytics, and controlled operations",
    price: "Implementation quote",
    emphasis: true,
    features: [
      "Mentor management, meetings, and intervention tracking",
      "Marks entry, exam setup, grade sheets, and reports",
      "Leadership analytics across attendance and performance",
      "Notifications, exports, rules, and academic governance"
    ]
  },
  {
    name: "Enterprise Multi-Campus",
    fit: "For large university groups with cross-campus controls, leadership reporting, and policy complexity",
    price: "Enterprise scope",
    emphasis: false,
    features: [
      "Multi-campus rollout and leadership command views",
      "Super-admin governance and audit visibility",
      "Advanced implementation and data migration planning",
      "Custom workflows, controls, and long-horizon adoption support"
    ]
  }
];

const commitments = [
  "Role-based dashboards for admin, faculty, mentor, staff, and student users",
  "Modern cloud deployment with Supabase-backed data architecture",
  "Onboarding, invite flows, exports, and operational reporting",
  "Implementation-led configuration for academic rules and structures"
];

const pricingSignals = [
  { label: "Deployment model", value: "SaaS + implementation", helper: "Priced around modules, user count, and rollout complexity" },
  { label: "Go-live motion", value: "Phased", helper: "Start with a priority workflow, then expand module coverage" },
  { label: "Institution fit", value: "Colleges to universities", helper: "Works for single-campus and multi-campus structures" }
];

export default function PricingPage() {
  return (
    <>
      <section className="py-20 lg:py-24">
        <div className="shell grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="glass rounded-[38px] p-8 lg:p-10">
            <p className="section-kicker text-xs font-semibold text-brand">Pricing</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Pricing built around campus scale, workflow depth, and rollout ambition.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-mist">
              EasyCampus is sold as an implementation-led university operating system. Institutions choose the rollout path that matches their academic complexity, governance model, and urgency to go live.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/request-demo" className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-600">
                Request pricing walkthrough
              </Link>
              <Link href="/features" className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-brand/30 hover:text-brand">
                Explore features
              </Link>
            </div>
          </div>

          <div className="gradient-panel rounded-[38px] p-8 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker text-xs font-semibold text-white/70">Commercial model</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Every plan is configured around your campus operating model.</h2>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white/90">
                No generic bundle pricing
              </span>
            </div>
            <div className="mt-8 grid gap-4">
              {pricingSignals.map((item) => (
                <div key={item.label} className="rounded-[26px] bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm text-white/70">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-7 text-white/75">{item.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 lg:py-10">
        <div className="shell grid gap-8 xl:grid-cols-[1.1fr_1.9fr]">
          <div className="glass rounded-[32px] p-7">
            <p className="section-kicker text-xs font-semibold text-brand">Included in every rollout</p>
            <div className="mt-5 space-y-3">
              {commitments.map((item) => (
                <div key={item} className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={`rounded-[34px] p-7 shadow-soft ${plan.emphasis ? "gradient-panel" : "glass"}`}>
                <p className={`section-kicker text-xs font-semibold ${plan.emphasis ? "text-white/70" : "text-brand"}`}>
                  {plan.emphasis ? "Most requested" : "Rollout option"}
                </p>
                <h2 className={`mt-4 text-3xl font-semibold tracking-tight ${plan.emphasis ? "text-white" : "text-ink"}`}>{plan.name}</h2>
                <p className={`mt-3 text-sm leading-7 ${plan.emphasis ? "text-white/80" : "text-mist"}`}>{plan.fit}</p>
                <p className={`mt-6 text-2xl font-semibold ${plan.emphasis ? "text-white" : "text-ink"}`}>{plan.price}</p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className={`rounded-[20px] px-4 py-3 text-sm leading-7 ${plan.emphasis ? "bg-white/10 text-white/90" : "bg-slate-50 text-ink"}`}>
                      {feature}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

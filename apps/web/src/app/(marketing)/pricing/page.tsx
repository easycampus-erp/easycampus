import Link from "next/link";
import { CtaBanner } from "@/components/marketing/cta-banner";

const plans = [
  {
    name: "Lite Plan",
    fit: "For institutions with student capacity up to 750",
    price: "Rs. 0.5 / student / month",
    emphasis: false,
    features: [
      "Student management and academic structures",
      "Attendance workflows and announcements",
      "Core admin, faculty, and student dashboards",
      "Fast launch path for smaller colleges and institutes"
    ]
  },
  {
    name: "Plus Plan",
    fit: "For institutions with student capacity up to 1000",
    price: "Rs. 1 / student / month",
    emphasis: false,
    features: [
      "Everything in Lite plus mentor workflows",
      "Exam and result management",
      "Role dashboards for admin, faculty, mentor, and students",
      "Improved reporting and communication controls"
    ]
  },
  {
    name: "Pro Plan",
    fit: "For institutions with student capacity up to 1250",
    price: "Rs. 1.5 / student / month",
    emphasis: true,
    features: [
      "Everything in Plus plus advanced analytics",
      "TPO and placement operations",
      "Exports, scheduled reports, and governance workflows",
      "Operational controls for fast-scaling institutions"
    ]
  },
  {
    name: "Ultimate Plan",
    fit: "For institutions with student capacity above 1250",
    price: "Starts at Rs. 1.2 / student / month",
    emphasis: false,
    features: [
      "Enterprise rollout for large colleges and university groups",
      "Leadership visibility across departments and campuses",
      "Multi-role reporting, automation, and governance layers",
      "Custom implementation and long-term scaling support"
    ]
  }
];

const commitments = [
  "Role-based dashboards for admin, faculty, mentor, staff, manager, TPO, and student users",
  "Supabase-backed data architecture and Vercel-ready deployment",
  "Onboarding, invite flows, exports, reports, and academic rules",
  "Implementation-led configuration for institutional rollout"
];

const pricingSignals = [
  { label: "Billing model", value: "Per student / month", helper: "Simple pricing aligned to active student capacity" },
  { label: "Ideal for", value: "Institutes to universities", helper: "Works for colleges, campuses, and education groups" },
  { label: "Rollout style", value: "Module-led", helper: "Start with essentials and expand into full university ERP operations" }
];

export default function PricingPage() {
  return (
    <>
      <section className="py-20 lg:py-24">
        <div className="shell grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="glass rounded-[38px] p-8 lg:p-10">
            <p className="section-kicker text-xs font-semibold text-brand">Pricing</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Straightforward per-student pricing for institutions that want a cleaner operating system.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-mist">
              EasyCampus pricing is designed for colleges, institutes, and universities that want to start lean, digitize quickly, and expand into a complete ERP as operations mature.
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
                <h2 className="mt-3 text-3xl font-semibold text-white">Choose the capacity band that matches your campus scale.</h2>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white/90">
                Transparent student-based pricing
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
        <div className="shell grid gap-8 xl:grid-cols-[1.02fr_1.98fr]">
          <div className="glass rounded-[32px] p-7">
            <p className="section-kicker text-xs font-semibold text-brand">Included in every rollout</p>
            <div className="mt-5 space-y-3">
              {commitments.map((item) => (
                <div key={item} className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-7 text-ink">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan.name} className={`rounded-[34px] p-7 shadow-soft ${plan.emphasis ? "gradient-panel" : "glass"}`}>
                <p className={`section-kicker text-xs font-semibold ${plan.emphasis ? "text-white/70" : "text-brand"}`}>
                  {plan.emphasis ? "Best for growing campuses" : "Capacity plan"}
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

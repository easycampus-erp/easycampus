import Link from "next/link";

const readinessStats = [
  { label: "Modules", value: "12+" },
  { label: "Roles", value: "4" },
  { label: "APIs", value: "30+" }
];

export function CtaBanner() {
  return (
    <section className="py-12 lg:py-16">
      <div className="shell">
        <div className="gradient-panel rounded-[36px] p-8 shadow-soft lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="section-kicker text-xs font-semibold text-white/70">Launch Ready</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Build a smarter university experience with a product that already understands campus complexity.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
                Launch marketing, administration, faculty workflows, mentorship, student portals, and analytics from one SaaS foundation designed for higher education.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {readinessStats.map((stat) => (
                <div key={stat.label} className="rounded-[24px] border border-white/12 bg-white/10 px-4 py-5 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/65">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/request-demo" className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-slate-100">
              Request Demo
            </Link>
            <Link href="/features" className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Explore Modules
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

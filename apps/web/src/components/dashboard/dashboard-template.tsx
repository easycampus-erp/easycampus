import Link from "next/link";
import type { DashboardPanel, Role } from "@easycampus/types";
import { dashboardRoles } from "@easycampus/config";
import { AuthStatus } from "@/components/auth/auth-status";

const roleColors: Record<Role, string> = {
  admin: "bg-blue-50 text-blue-700",
  faculty: "bg-amber-50 text-amber-700",
  mentor: "bg-emerald-50 text-emerald-700",
  student: "bg-violet-50 text-violet-700"
};

interface DashboardTemplateProps {
  role: Role;
  title: string;
  summary: string;
  metrics: { label: string; value: string; helper: string }[];
  panels: DashboardPanel[];
  actions?: { href: string; label: string }[];
}

export function DashboardTemplate({ role, title, summary, metrics, panels, actions = [] }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-slate-100/70">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <div className="rounded-3xl bg-gradient-to-br from-brand to-sky-300 p-5 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">EasyCampus</p>
            <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-white/80">{summary}</p>
          </div>
          <nav className="mt-8 space-y-2">
            {dashboardRoles.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100">
                {item.label} Dashboard
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${roleColors[role]}`}>{role.toUpperCase()}</span>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{title}</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <AuthStatus />
              {actions.map((action) => (
                <Link key={action.href} href={action.href} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                  {action.label}
                </Link>
              ))}
              <Link href="/" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Marketing Site</Link>
              <Link href="/request-demo" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Request Demo</Link>
            </div>
          </div>
          <section className="mt-8 grid gap-4 xl:grid-cols-4 md:grid-cols-2">
            {metrics.map((metric) => (
              <article key={metric.label} className="glass rounded-3xl p-5">
                <p className="text-sm text-mist">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold text-ink">{metric.value}</p>
                <p className="mt-1 text-sm text-mist">{metric.helper}</p>
              </article>
            ))}
          </section>
          <section className="mt-8 grid gap-5 xl:grid-cols-2">
            {panels.map((panel) => (
              <article key={panel.title} className="glass rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-ink">{panel.title}</h2>
                <p className="mt-2 text-sm text-mist">{panel.description}</p>
                <ul className="mt-4 space-y-3 text-sm text-mist">
                  {panel.items.map((item) => (
                    <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}


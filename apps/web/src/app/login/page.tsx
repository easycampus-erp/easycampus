import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="py-20">
      <div className="shell grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Supabase Auth
          </span>
          <h1 className="text-5xl font-semibold tracking-tight text-ink">Secure dashboard access for every campus role.</h1>
          <p className="text-lg text-mist">
            The dashboard routes are now protected with Supabase sessions on Vercel. Assign `app_metadata.role` in Supabase to route users into the correct dashboard.
          </p>
          <div className="glass rounded-[32px] p-6">
            <h2 className="text-xl font-semibold text-ink">Role mapping</h2>
            <ul className="mt-4 space-y-3 text-sm text-mist">
              <li className="rounded-2xl bg-slate-50 px-4 py-3"><code>admin</code> {"->"} <code>/admin</code></li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3"><code>faculty</code> {"->"} <code>/faculty</code></li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3"><code>mentor</code> {"->"} <code>/mentor</code></li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3"><code>student</code> {"->"} <code>/student</code></li>
            </ul>
            <div className="mt-5 flex gap-3">
              <Link href="/signup" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                Create first admin
              </Link>
              <Link href="/" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                Back to site
              </Link>
              <Link href="/request-demo" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                View demo flow
              </Link>
              <Link href="/reset-password" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                Reset password
              </Link>
              <Link href="/accept-invite" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                Accept invite
              </Link>
            </div>
          </div>
        </div>
        <LoginForm
          redirectTo={params.redirectTo ?? "/admin"}
          unauthorized={params.error === "unauthorized"}
          sessionExpired={params.error === "session_expired"}
        />
      </div>
    </section>
  );
}

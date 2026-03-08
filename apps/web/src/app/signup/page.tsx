import Link from "next/link";
import { AdminSignupForm } from "@/components/auth/admin-signup-form";

export default function SignupPage() {
  return (
    <section className="py-20">
      <div className="shell grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            First Admin Signup
          </span>
          <h1 className="text-5xl font-semibold tracking-tight text-ink">Create the first EasyCampus admin and institution.</h1>
          <p className="text-lg text-mist">
            This is the bootstrap flow for a new campus. After this step, the admin can invite faculty, mentors, students, and more admins from inside the protected dashboard.
          </p>
          <div className="glass rounded-[32px] p-6">
            <h2 className="text-xl font-semibold text-ink">What happens here</h2>
            <ul className="mt-4 space-y-3 text-sm text-mist">
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Creates the institution record in Supabase.</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Creates the first admin auth user.</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Creates the admin profile and membership.</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Signs the admin directly into the dashboard.</li>
            </ul>
            <div className="mt-5 flex gap-3">
              <Link href="/login" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                Already have an account?
              </Link>
              <Link href="/" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                Back to site
              </Link>
            </div>
          </div>
        </div>
        <AdminSignupForm />
      </div>
    </section>
  );
}

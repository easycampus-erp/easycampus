import Link from "next/link";

export default function AcceptInvitePage() {
  return (
    <section className="py-20">
      <div className="shell">
        <div className="glass mx-auto max-w-3xl rounded-[32px] p-8">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Accept Your Campus Invite</h1>
          <p className="mt-3 text-mist">
            Open the Supabase invitation email, complete the account setup, and return through the auth callback to land inside the right dashboard automatically.
          </p>
          <div className="mt-6 space-y-3 text-sm text-mist">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">1. Open the invite email and choose the secure signup link.</div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">2. Finish password creation and email verification if prompted.</div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">3. The auth callback exchanges the session and redirects you to login or your dashboard.</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
              Go to Login
            </Link>
            <Link href="/signup" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
              First Admin Signup
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

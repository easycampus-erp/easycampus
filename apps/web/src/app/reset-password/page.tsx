import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <section className="py-20">
      <div className="shell">
        <div className="glass mx-auto max-w-3xl rounded-[32px] p-8">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Password and Verification Help</h1>
          <p className="mt-3 text-mist">
            Password reset and verification resend are available inside each role's profile settings page after login. Use the recovery link to land on the dedicated password update screen.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
              Go to Login
            </Link>
            <Link href="/update-password" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
              Update Password
            </Link>
            <Link href="/" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

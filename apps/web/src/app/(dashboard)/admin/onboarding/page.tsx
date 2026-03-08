import { InviteUserForm } from "@/components/auth/invite-user-form";

export default function AdminOnboardingPage() {
  return (
    <section className="space-y-6">
      <div>
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">Admin Onboarding</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Invite your faculty, mentors, students, and admins</h1>
        <p className="mt-3 max-w-3xl text-mist">
          This page is powered by Supabase Auth invitations. When an invited user accepts the invite, the database trigger creates the right membership and role-specific record automatically.
        </p>
      </div>
      <InviteUserForm />
    </section>
  );
}

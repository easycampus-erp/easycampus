"use client";

import type { Role } from "@easycampus/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

function roleHome(role: Role) {
  if (role === "admin") return "/admin";
  if (role === "faculty") return "/faculty";
  if (role === "mentor") return "/mentor";
  return "/student";
}

export function OnboardingChecklist({
  role,
  email,
  profileReady,
  checklist,
  completed
}: {
  role: Role;
  email: string;
  profileReady: boolean;
  checklist: Record<string, boolean>;
  completed: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function update(step: "profile" | "welcome" | "role_setup" | "complete") {
    const response = await fetch("/api/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to update onboarding.");
    setMessage(result.message ?? "Updated.");
    if (step === "complete") {
      router.push(roleHome(role));
    } else {
      router.refresh();
    }
  }

  const effectiveChecklist = {
    profile: checklist.profile || profileReady,
    welcome: checklist.welcome,
    role_setup: checklist.role_setup
  };

  return (
    <section className="py-20">
      <div className="shell">
        <div className="glass mx-auto max-w-4xl rounded-[32px] p-8">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Welcome to EasyCampus</h1>
          <p className="mt-3 text-mist">Finish your first-login checklist for <strong>{role}</strong> access: {email}</p>
          <div className="mt-6 grid gap-4">
            <StepCard title="Profile" complete={effectiveChecklist.profile} description="Make sure your name and contact details are ready in profile settings." onComplete={() => update("profile")} />
            <StepCard title="Welcome" complete={effectiveChecklist.welcome} description="Acknowledge the onboarding flow and confirm your workspace access." onComplete={() => update("welcome")} />
            <StepCard title="Role Setup" complete={effectiveChecklist.role_setup} description="Confirm that your role dashboard and core actions are understood." onComplete={() => update("role_setup")} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  await update("complete");
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Unable to complete onboarding.");
                }
              }}
              disabled={completed}
              className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft disabled:opacity-60"
            >
              {completed ? "Completed" : "Finish Onboarding"}
            </button>
            <span className="self-center text-sm text-mist">{message || "Complete all three steps to enter the full dashboard experience."}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  title,
  description,
  complete,
  onComplete
}: {
  title: string;
  description: string;
  complete: boolean;
  onComplete: () => Promise<void>;
}) {
  return (
    <article className="rounded-[28px] bg-slate-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-mist">{description}</p>
        </div>
        {complete ? (
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Done</span>
        ) : (
          <button type="button" onClick={() => void onComplete()} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
            Mark Complete
          </button>
        )}
      </div>
    </article>
  );
}

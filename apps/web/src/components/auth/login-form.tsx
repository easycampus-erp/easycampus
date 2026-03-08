"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";

const defaultCredentials = {
  email: "",
  password: ""
};

export function LoginForm({
  redirectTo = "/admin",
  unauthorized = false,
  sessionExpired = false
}: {
  redirectTo?: string;
  unauthorized?: boolean;
  sessionExpired?: boolean;
}) {
  const router = useRouter();

  const [credentials, setCredentials] = useState(defaultCredentials);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const suggestedRole = useMemo(() => {
    if (redirectTo.startsWith("/faculty")) return "faculty";
    if (redirectTo.startsWith("/mentor")) return "mentor";
    if (redirectTo.startsWith("/student")) return "student";
    return "admin";
  }, [redirectTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const supabase = createClientSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        throw error;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[32px] p-8">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Sign in to EasyCampus</h1>
      <p className="mt-3 text-sm text-mist">
        Use a Supabase Auth user account. For the dashboard you tried to open, the expected role is <strong>{suggestedRole}</strong>.
      </p>
      {unauthorized ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Your current account does not have permission for that dashboard route. Set the user role in Supabase `app_metadata.role`.
        </p>
      ) : null}
      {sessionExpired ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Your previous session expired. Sign in again to continue where you left off.
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-ink">
          Email
          <input
            type="email"
            value={credentials.email}
            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
            className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
            placeholder="admin@easycampus.local"
          />
        </label>

        <label className="block text-sm font-medium text-ink">
          Password
          <input
            type="password"
            value={credentials.password}
            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
            className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
            placeholder="••••••••"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
        <span className="text-sm text-mist">
          {message || "After sign-in, you will be redirected to the requested dashboard."}
        </span>
      </div>
    </form>
  );
}

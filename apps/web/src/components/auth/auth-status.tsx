"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";

export function AuthStatus() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("Loading...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClientSupabaseClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "Signed in");
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? "Signed in");
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    setBusy(true);
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-soft">{email}</span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={busy}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
      >
        {busy ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function updatePassword() {
    try {
      const supabase = createClientSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Password updated. You can now sign in normally.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update password.");
    }
  }

  return (
    <section className="py-20">
      <div className="shell">
        <div className="glass mx-auto max-w-2xl rounded-[32px] p-8">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Update Password</h1>
          <p className="mt-3 text-mist">Use this screen after a password reset email opens your secure recovery session.</p>
          <label className="mt-6 block text-sm font-medium text-ink">
            New Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
          <div className="mt-6 flex items-center gap-4">
            <button type="button" onClick={updatePassword} className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
              Update Password
            </button>
            <span className="text-sm text-mist">{message || "Make sure the reset link opened this session first."}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

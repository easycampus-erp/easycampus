"use client";

import { useState } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";

export function ProfileSettingsForm({
  email,
  fullName,
  phone,
  avatarUrl
}: {
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
}) {
  const [form, setForm] = useState({ fullName, phone, avatarUrl });
  const [message, setMessage] = useState("");

  async function saveProfile() {
    try {
      const supabase = createClientSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You are not signed in.");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: form.fullName,
          phone: form.phone,
          avatar_url: form.avatarUrl || null
        })
        .eq("id", user.id);

      if (error) throw error;
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    }
  }

  async function uploadAvatar(file: File | null) {
    if (!file) return;

    try {
      const supabase = createClientSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You are not signed in.");

      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${extension}`;

      const { error } = await supabase.storage.from("profile-assets").upload(path, file, {
        cacheControl: "3600",
        upsert: true
      });

      if (error) throw error;

      const { data } = supabase.storage.from("profile-assets").getPublicUrl(path);
      setForm((current) => ({ ...current, avatarUrl: data.publicUrl }));
      setMessage("Avatar uploaded. Save profile to persist the URL.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload avatar.");
    }
  }

  async function sendPasswordReset() {
    try {
      const supabase = createClientSupabaseClient();
      const redirectTo = `${window.location.origin}/login`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setMessage("Password reset email sent.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send reset email.");
    }
  }

  async function resendVerification() {
    try {
      const supabase = createClientSupabaseClient();
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      setMessage("Verification email sent.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send verification email.");
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Profile and Account Settings</h1>
        <p className="mt-2 text-mist">Manage your identity details, avatar, and core auth self-service actions from one place.</p>
      </div>

      <div className="glass rounded-[32px] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email" value={email} onChange={() => undefined} disabled />
          <Field label="Full Name" value={form.fullName} onChange={(value) => setForm((current) => ({ ...current, fullName: value }))} />
          <Field label="Phone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <Field label="Avatar URL" value={form.avatarUrl} onChange={(value) => setForm((current) => ({ ...current, avatarUrl: value }))} />
          <label className="block text-sm font-medium text-ink">
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void uploadAvatar(file);
              }}
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={saveProfile} className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
            Save Profile
          </button>
          <button type="button" onClick={sendPasswordReset} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
            Send Password Reset
          </button>
          <button type="button" onClick={resendVerification} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
            Resend Verification
          </button>
        </div>
        <p className="mt-4 text-sm text-mist">{message || "For avatar uploads, create a Supabase Storage bucket named `profile-assets` and add the matching storage policies."}</p>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none disabled:opacity-70"
      />
    </label>
  );
}

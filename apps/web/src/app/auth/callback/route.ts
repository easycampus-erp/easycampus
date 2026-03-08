import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";
import { getUserRole } from "@/lib/auth";

type CookieMutation = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/login";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=unauthorized`);
  }

  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieMutation[]) {
        cookiesToSet.forEach(({ name, value, options }: CookieMutation) => {
          cookieStore.set(name, value, options as never);
        });
      }
    }
  });

  await supabase.auth.exchangeCodeForSession(code);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const role = user ? getUserRole(user) : null;
  let redirectTo =
    role === "admin"
      ? "/admin"
      : role === "faculty"
        ? "/faculty"
        : role === "mentor"
          ? "/mentor"
          : role === "student"
            ? "/student"
            : next;

  if (user && role) {
    const { data: onboarding } = await supabase
      .from("onboarding_progress")
      .select("completed_at")
      .eq("profile_id", user.id)
      .eq("role", role)
      .single();

    if (!onboarding?.completed_at) {
      redirectTo = "/onboarding";
    }
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}

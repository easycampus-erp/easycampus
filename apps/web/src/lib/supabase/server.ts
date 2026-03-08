import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

type CookieMutation = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function createServerSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieMutation[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options as never);
        });
      }
    }
  });
}

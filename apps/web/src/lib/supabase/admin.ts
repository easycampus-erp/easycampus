import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";

export function createAdminSupabaseClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

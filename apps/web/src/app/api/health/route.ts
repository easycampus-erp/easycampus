import { NextResponse } from "next/server";
import { hasPublicSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      service: "easycampus-web",
      deploymentTarget: "vercel",
      supabase: {
        publicEnvConfigured: hasPublicSupabaseEnv(),
        serviceEnvConfigured: hasServiceSupabaseEnv()
      }
    }
  });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { hasServiceSupabaseEnv } from "@/lib/env";
import { logServerEvent } from "@/lib/logging";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const requestDemoSchema = z.object({
  institutionName: z.string().min(2),
  contactName: z.string().min(2),
  workEmail: z.string().email(),
  phone: z.string().min(7),
  campusType: z.string().min(2),
  studentCount: z.string().min(1),
  requiredModules: z.string().min(2),
  timeline: z.string().min(2),
  notes: z.string().optional().default("")
});

export async function POST(request: Request) {
  if (!hasServiceSupabaseEnv()) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase service role environment variables are not configured."
      },
      { status: 503 }
    );
  }

  const payload = await request.json();
  const parsed = requestDemoSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Please provide all required demo request fields.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("request_demo_leads").insert({
    institution_name: parsed.data.institutionName,
    contact_name: parsed.data.contactName,
    work_email: parsed.data.workEmail,
    phone: parsed.data.phone,
    campus_type: parsed.data.campusType,
    student_count: parsed.data.studentCount,
    required_modules: parsed.data.requiredModules,
    timeline: parsed.data.timeline,
    notes: parsed.data.notes
  });

  if (error) {
    logServerEvent("demo_request.failed", { email: parsed.data.workEmail, error: error.message });
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }

  logServerEvent("demo_request.created", {
    institutionName: parsed.data.institutionName,
    email: parsed.data.workEmail,
    campusType: parsed.data.campusType
  });

  return NextResponse.json({
    success: true,
    message: "Demo request submitted successfully."
  });
}

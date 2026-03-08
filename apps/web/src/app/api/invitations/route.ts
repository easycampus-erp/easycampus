import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { getUserRole } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const invitationSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum(["admin", "faculty", "mentor", "student"]),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  courseId: z.string().uuid().optional().or(z.literal("")),
  section: z.string().optional().default(""),
  admissionYear: z.string().optional().default(""),
  enrollmentNo: z.string().optional().default(""),
  employeeCode: z.string().optional().default(""),
  designation: z.string().optional().default(""),
  capacity: z.string().optional().default(""),
  guardianName: z.string().optional().default(""),
  guardianPhone: z.string().optional().default("")
});

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const role = getUserRole(user);
  if (role !== "admin") {
    return NextResponse.json({ success: false, error: "Only admins can send invitations." }, { status: 403 });
  }

  const {
    data: membership
  } = await supabase.from("memberships").select("institution_id").eq("profile_id", user.id).eq("role", "admin").single();

  if (!membership) {
    return NextResponse.json({ success: false, error: "Admin membership not found." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = invitationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid invitation payload." }, { status: 400 });
  }

  const adminSupabase = createAdminSupabaseClient();

  const { error: inviteRecordError } = await adminSupabase.from("user_invites").insert({
    institution_id: membership.institution_id,
    email: parsed.data.email,
    full_name: parsed.data.fullName,
    role: parsed.data.role,
    department_id: parsed.data.departmentId || null,
    course_id: parsed.data.courseId || null,
    section: parsed.data.section || null,
    admission_year: parsed.data.admissionYear ? Number(parsed.data.admissionYear) : null,
    enrollment_no: parsed.data.enrollmentNo || null,
    employee_code: parsed.data.employeeCode || null,
    designation: parsed.data.designation || null,
    capacity: parsed.data.capacity ? Number(parsed.data.capacity) : null,
    guardian_name: parsed.data.guardianName || null,
    guardian_phone: parsed.data.guardianPhone || null,
    invited_by: user.id
  });

  if (inviteRecordError) {
    return NextResponse.json({ success: false, error: inviteRecordError.message }, { status: 500 });
  }

  const redirectTo = new URL("/login", request.url).toString();
  const { error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: {
      full_name: parsed.data.fullName,
      role: parsed.data.role
    },
    redirectTo
  });

  if (inviteError) {
    return NextResponse.json({ success: false, error: inviteError.message }, { status: 500 });
  }

  await writeAuditLog(adminSupabase, {
    institutionId: membership.institution_id,
    actorProfileId: user.id,
    action: "invite",
    entityType: "user_invite",
    metadata: { email: parsed.data.email, role: parsed.data.role }
  });

  return NextResponse.json({ success: true, message: `Invitation sent to ${parsed.data.email}.` });
}

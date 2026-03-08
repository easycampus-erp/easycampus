import type { Role } from "@easycampus/types";
import { getUserRole } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireRoleMembership(role: Role) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const resolvedRole = getUserRole(user);
  if (resolvedRole !== role) {
    throw new Error("Forbidden");
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("institution_id")
    .eq("profile_id", user.id)
    .eq("role", role)
    .single();

  if (!membership) {
    throw new Error(`${role} membership not found.`);
  }

  return {
    supabase,
    user,
    institutionId: membership.institution_id
  };
}

export async function requireAdminContext() {
  return requireRoleMembership("admin");
}

export async function requireFacultyContext() {
  const context = await requireRoleMembership("faculty");

  const { data: faculty } = await context.supabase
    .from("faculty")
    .select("id, department_id, designation")
    .eq("institution_id", context.institutionId)
    .eq("profile_id", context.user.id)
    .single();

  if (!faculty) {
    throw new Error("Faculty profile not found.");
  }

  return {
    ...context,
    facultyId: faculty.id,
    departmentId: faculty.department_id,
    designation: faculty.designation ?? ""
  };
}

export async function requireStudentContext() {
  const context = await requireRoleMembership("student");

  const { data: student } = await context.supabase
    .from("students")
    .select("id, department_id, course_id, current_semester, section, enrollment_no")
    .eq("institution_id", context.institutionId)
    .eq("profile_id", context.user.id)
    .single();

  if (!student) {
    throw new Error("Student profile not found.");
  }

  return {
    ...context,
    studentId: student.id,
    departmentId: student.department_id,
    courseId: student.course_id,
    currentSemester: student.current_semester,
    section: student.section ?? "",
    enrollmentNo: student.enrollment_no
  };
}

export async function requireMentorContext() {
  const context = await requireRoleMembership("mentor");

  const { data: mentor } = await context.supabase
    .from("mentors")
    .select("id, department_id, designation, capacity")
    .eq("institution_id", context.institutionId)
    .eq("profile_id", context.user.id)
    .single();

  if (!mentor) {
    throw new Error("Mentor profile not found.");
  }

  return {
    ...context,
    mentorId: mentor.id,
    departmentId: mentor.department_id,
    designation: mentor.designation ?? "",
    capacity: mentor.capacity ?? 0
  };
}

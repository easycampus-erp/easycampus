import { NextResponse } from "next/server";
import { z } from "zod";
import { requireFacultyContext } from "@/lib/server-role";
import { writeAuditLog } from "@/lib/audit";

const resourceSchema = z.object({
  subjectId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional().default(""),
  materialType: z.enum(["material", "report", "assignment"]),
  filePath: z.string().min(2),
  fileUrl: z.string().url()
});

const deleteSchema = z.object({
  id: z.string().uuid(),
  materialType: z.enum(["material", "report", "assignment"]),
  filePath: z.string().min(2)
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, facultyId, user } = await requireFacultyContext();
    const parsed = resourceSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid resource payload." }, { status: 400 });

    const table = parsed.data.materialType === "assignment" ? "assignments" : "course_materials";
    const payload =
      table === "assignments"
        ? {
            institution_id: institutionId,
            subject_id: parsed.data.subjectId,
            faculty_id: facultyId,
            title: parsed.data.title,
            description: parsed.data.description || null,
            file_path: parsed.data.filePath,
            file_url: parsed.data.fileUrl
          }
        : {
            institution_id: institutionId,
            subject_id: parsed.data.subjectId,
            faculty_id: facultyId,
            title: parsed.data.title,
            description: parsed.data.description || null,
            material_type: parsed.data.materialType,
            file_path: parsed.data.filePath,
            file_url: parsed.data.fileUrl
          };

    const { data, error } = await supabase.from(table).insert(payload).select("id").single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    await writeAuditLog(supabase, {
      institutionId,
      actorProfileId: user.id,
      action: "create",
      entityType: table,
      entityId: data?.id ?? null,
      metadata: { title: parsed.data.title }
    });

    return NextResponse.json({ success: true, message: "Resource uploaded." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, facultyId, user } = await requireFacultyContext();
    const parsed = deleteSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });

    const table = parsed.data.materialType === "assignment" ? "assignments" : "course_materials";
    const { error } = await supabase.from(table).delete().eq("id", parsed.data.id).eq("institution_id", institutionId).eq("faculty_id", facultyId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const bucket = parsed.data.materialType === "assignment" ? "assignments" : "faculty-materials";
    await supabase.storage.from(bucket).remove([parsed.data.filePath]);

    await writeAuditLog(supabase, {
      institutionId,
      actorProfileId: user.id,
      action: "delete",
      entityType: table,
      entityId: parsed.data.id
    });

    return NextResponse.json({ success: true, message: "Resource removed." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

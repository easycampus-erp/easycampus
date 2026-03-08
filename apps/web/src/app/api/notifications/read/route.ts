import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const payloadSchema = z.object({
  id: z.string().uuid()
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const parsed = payloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", parsed.data.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to update notification." }, { status: 400 });
  }
}

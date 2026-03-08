import { NextResponse } from "next/server";
import { deliverPendingNotifications } from "@/lib/notifications";
import { requireAdminContext } from "@/lib/server-role";

export async function POST() {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const result = await deliverPendingNotifications({
      supabase,
      institutionId,
      actorProfileId: user.id
    });

    return NextResponse.json({
      success: true,
      message: "Notification delivery batch completed.",
      data: result
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to deliver notifications." }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { adminService } from "@/services/adminService";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dashboardData = await adminService.getDashboardStats();
    return NextResponse.json(dashboardData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, id, data } = await request.json();

    if (action === "toggleUserAdmin") {
      const updatedUser = await adminService.toggleUserAdmin(id, data.isAdmin);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (action === "updateUser") {
      const updatedUser = await adminService.updateUser(id, data);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (action === "deleteUser") {
      await adminService.deleteUser(id);
      return NextResponse.json({ success: true });
    }

    if (action === "deleteListing") {
      await adminService.moderateListing(id, "dihapus");
      return NextResponse.json({ success: true });
    }

    if (action === "restoreListing") {
      await adminService.moderateListing(id, "aktif");
      return NextResponse.json({ success: true });
    }

    if (action === "deleteRequest") {
      await adminService.moderateRequest(id, "dibatalkan");
      return NextResponse.json({ success: true });
    }

    if (action === "restoreRequest") {
      await adminService.moderateRequest(id, "aktif");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

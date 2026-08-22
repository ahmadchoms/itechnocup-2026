import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { userService } from "@/services/userService";

/**
 * PATCH /api/auth/role
 * Mengganti activeRole user (seller atau buyer).
 */
export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updatedRoleUser = await userService.switchUserRole(user.id, body.role);

    return NextResponse.json({
      success: true,
      user: updatedRoleUser,
    });
  } catch (error: any) {
    console.error("Error updating role:", error);
    const statusCode = error.message === "Invalid role" ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: statusCode }
    );
  }
}

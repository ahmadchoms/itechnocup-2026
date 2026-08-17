import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ActiveRole } from "@prisma/client";

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
    const newRole = body.role;

    if (newRole !== "seller" && newRole !== "buyer") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (newRole === "buyer" && !user.isBuyerApproved) {
      return NextResponse.json(
        { error: "Anda belum disetujui untuk menjadi Pengepul (Buyer)." },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        activeRole: newRole as ActiveRole,
      },
      select: {
        id: true,
        activeRole: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, address } = body;

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        fullName: fullName ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (error: any) {
    console.error("[user-profile-update] Error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}

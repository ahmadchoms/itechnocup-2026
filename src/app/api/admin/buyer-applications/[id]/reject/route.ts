import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Pastikan aplikasi ada
    const application = await prisma.buyerApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Aplikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.buyerApplication.update({
      where: { id },
      data: { status: "ditolak" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting buyer application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

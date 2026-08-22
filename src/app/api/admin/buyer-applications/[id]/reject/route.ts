import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { buyerApplicationService } from "@/services/buyerApplicationService";

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
    await buyerApplicationService.rejectApplication(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error rejecting buyer application:", error);
    const statusCode = error.message === "Aplikasi tidak ditemukan" ? 404 : 500;
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: statusCode }
    );
  }
}

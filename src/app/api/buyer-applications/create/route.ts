import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { buyerApplicationService } from "@/services/buyerApplicationService";

/**
 * POST /api/buyer-applications/create
 * Mengajukan pendaftaran sebagai buyer.
 */
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const application = await buyerApplicationService.submitApplication(user.id, body);

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Error creating buyer application:", error);
    const isValidationError =
      error.message === "Foto KTP, Foto Outlet, dan Alamat wajib diisi" ||
      error.message === "Anda sudah memiliki pengajuan yang sedang diproses";
    const statusCode = isValidationError ? 400 : 500;
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: statusCode }
    );
  }
}

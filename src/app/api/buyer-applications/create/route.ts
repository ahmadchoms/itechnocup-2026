import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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
    const { ktpPhotoUrl, outletPhotoUrl, npwp, address } = body;

    if (!ktpPhotoUrl || !outletPhotoUrl || !address) {
      return NextResponse.json(
        { error: "Foto KTP, Foto Outlet, dan Alamat wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada aplikasi yang pending
    const existingApplication = await prisma.buyerApplication.findUnique({
      where: { userId: user.id },
    });

    if (existingApplication && existingApplication.status === "menunggu") {
      return NextResponse.json(
        { error: "Anda sudah memiliki pengajuan yang sedang diproses" },
        { status: 400 }
      );
    }

    let application;
    if (existingApplication) {
      application = await prisma.buyerApplication.update({
        where: { userId: user.id },
        data: {
          ktpPhotoUrl,
          outletPhotoUrl,
          npwp: npwp || null,
          address,
          status: "menunggu", // Reset status jika sebelumnya ditolak
        },
      });
    } else {
      application = await prisma.buyerApplication.create({
        data: {
          userId: user.id,
          ktpPhotoUrl,
          outletPhotoUrl,
          npwp: npwp || null,
          address,
        },
      });
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Error creating buyer application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

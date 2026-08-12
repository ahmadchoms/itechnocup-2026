import { NextResponse } from "next/server";
import { classifyPhoto } from "@/lib/cv";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/classify
 * Body: { photoUrl: string }
 * Returns: { categoryName, categoryId, confidence, isReal }
 * 
 * Proxy ke CV provider (saat ini mock — lihat src/lib/cv/index.ts untuk panduan
 * menghubungkan ke Roboflow atau Google Teachable Machine).
 */
export async function POST(request: Request) {
  try {
    const { photoUrl } = await request.json();

    if (!photoUrl) {
      return NextResponse.json(
        { error: "Field 'photoUrl' wajib diisi" },
        { status: 400 }
      );
    }

    const result = await classifyPhoto(photoUrl);

    // Cari categoryId dari nama kategori
    const category = await prisma.wasteCategory.findFirst({
      where: { name: { equals: result.categoryName, mode: "insensitive" } },
    });

    // Fallback: ambil kategori pertama jika tidak ditemukan
    const fallbackCategory = category ?? (await prisma.wasteCategory.findFirst());

    return NextResponse.json({
      categoryName: result.categoryName,
      categoryId: fallbackCategory?.id ?? null,
      confidence: result.confidence,
      isReal: result.isReal,
      provider: result.isReal ? "roboflow" : "mock",
    });
  } catch (error: any) {
    console.error("[/api/classify] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

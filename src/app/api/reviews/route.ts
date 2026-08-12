import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/reviews
 * Body: { transactionId, reviewerId, revieweeId, rating (1-5), comment? }
 * Sesuai PRD RVW-1
 */
export async function POST(request: Request) {
  try {
    const { transactionId, reviewerId, revieweeId, rating, comment } =
      await request.json();

    if (!transactionId || !reviewerId || !revieweeId || !rating) {
      return NextResponse.json(
        { error: "transactionId, reviewerId, revieweeId, dan rating wajib diisi" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 1 sampai 5" },
        { status: 400 }
      );
    }

    // Cek apakah review sudah ada untuk pasangan ini
    const existing = await prisma.review.findFirst({
      where: { transactionId, reviewerId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Anda sudah memberikan ulasan untuk transaksi ini" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        transactionId,
        reviewerId,
        revieweeId,
        rating: parseInt(String(rating)),
        comment: comment || null,
      },
      include: {
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
        reviewee: { select: { id: true, fullName: true } },
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/reviews] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/reviews?userId=...
 * Ambil semua review yang diterima oleh user tertentu (RVW-2)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId wajib diisi" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
        transaction: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avgRating =
      reviews.length > 0
        ? Number(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 0;

    return NextResponse.json({ reviews, avgRating, total: reviews.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

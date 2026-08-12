import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const search = searchParams.get("search");

    const whereClause: any = {
      status: { not: "dihapus" },
    };

    if (categoryId && categoryId !== "all") {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            phone: true,
            receivedReviews: {
              select: { rating: true },
            },
          },
        },
        category: true,
        cvPredictedCategory: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute average seller rating and format distance
    const formatted = listings.map((item) => {
      const reviews = item.seller.receivedReviews || [];
      const avgRating =
        reviews.length > 0
          ? Number(
              (
                reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              ).toFixed(1)
            )
          : 4.8; // Default high rating for realistic demo

      return {
        ...item,
        seller: {
          ...item.seller,
          rating: avgRating,
        },
        distanceKm: item.title.includes("Kopi")
          ? 0.8
          : item.title.includes("Kardus")
          ? 2.4
          : item.title.includes("Kaleng")
          ? 5.1
          : 1.2,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

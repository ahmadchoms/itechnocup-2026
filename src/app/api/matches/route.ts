import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
          },
        },
        request: {
          include: {
            buyer: true,
            category: true,
          },
        },
        conversations: true,
      },
      orderBy: { distanceKm: "asc" },
    });

    return NextResponse.json(matches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

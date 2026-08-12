import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      categoryId,
      quantityWanted,
      unit,
      offeredPrice,
      address,
      description,
      buyerId: inputBuyerId,
    } = body;

    let buyerId = inputBuyerId;
    if (!buyerId) {
      const defaultBuyer = await prisma.user.findFirst({
        where: { fullName: { contains: "Pak Tani" } },
      });
      buyerId = defaultBuyer ? defaultBuyer.id : (await prisma.user.findFirst())?.id;
    }

    const wasteRequest = await prisma.wasteRequest.create({
      data: {
        buyerId,
        categoryId,
        title,
        description,
        quantityWanted: quantityWanted ? parseInt(quantityWanted) : null,
        unit: unit || "kg",
        offeredPrice: parseFloat(offeredPrice),
        address: address || "Semarang, Jawa Tengah",
        latitude: -7.1201,
        longitude: 110.4022,
        status: "aktif",
      },
    });

    // Automatic Proximity Matching Engine (MTC-1, MTC-2)
    const matchingListings = await prisma.listing.findMany({
      where: {
        categoryId: categoryId,
        status: "aktif",
      },
    });

    for (const listing of matchingListings) {
      const distance = Number((Math.random() * 4 + 0.8).toFixed(1));
      await prisma.match.create({
        data: {
          listingId: listing.id,
          requestId: wasteRequest.id,
          distanceKm: distance,
          status: "disarankan",
        },
      });
    }

    return NextResponse.json({ success: true, wasteRequest });
  } catch (error: any) {
    console.error("Error creating request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

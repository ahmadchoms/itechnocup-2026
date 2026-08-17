import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      categoryId,
      estimatedWeightKg,
      quantity,
      unit,
      condition,
      description,
      estimatedPrice,
      address,
      latitude,
      longitude,
      photoUrl,
      cvPredictedCategoryId,
      cvConfidence,
      isCvCorrected,
      sellerId: inputSellerId,
    } = body;

    const sessionUser = await getSessionUser();
    let sellerId = inputSellerId;
    
    if (!sellerId) {
      if (sessionUser) {
        sellerId = sessionUser.id;
      } else {
        const defaultUser = await prisma.user.findFirst();
        if (!defaultUser) {
          return NextResponse.json({ error: "User tidak ditemukan" }, { status: 400 });
        }
        sellerId = defaultUser.id;
      }
    }

    // 1. Create Listing
    const listing = await prisma.listing.create({
      data: {
        sellerId,
        categoryId,
        title,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
        estimatedWeightKg: estimatedWeightKg ? parseFloat(estimatedWeightKg) : null,
        quantity: quantity ? parseInt(quantity) : null,
        unit: unit || "kg",
        condition: condition || "Baik",
        description,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
        address: address || "Semarang, Jawa Tengah",
        latitude: latitude ? parseFloat(latitude) : -7.0505,
        longitude: longitude ? parseFloat(longitude) : 110.4371,
        status: "aktif",
        cvPredictedCategoryId: cvPredictedCategoryId || categoryId,
        cvConfidence: cvConfidence ? parseFloat(cvConfidence) : 90.0,
        isCvCorrected: Boolean(isCvCorrected),
      },
    });

    // 2. Log CV classification if predicted
    if (cvPredictedCategoryId) {
      await prisma.cVClassificationLog.create({
        data: {
          listingId: listing.id,
          photoUrl: listing.photoUrl,
          predictedCategoryId: cvPredictedCategoryId,
          confidence: cvConfidence ? parseFloat(cvConfidence) : 90.0,
          modelProvider: "roboflow",
        },
      });
    }

    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

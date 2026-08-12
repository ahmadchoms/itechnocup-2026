import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const {
      conversationId,
      listingId,
      sellerId,
      buyerId,
      categoryId,
      finalPrice,
      finalQuantity,
      unit,
      status, // "menunggu_konfirmasi" | "selesai" | "dibatalkan"
      transactionId,
    } = await request.json();

    let transaction;

    if (transactionId) {
      transaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status,
          completedAt: status === "selesai" ? new Date() : undefined,
          finalPrice: finalPrice ? parseFloat(finalPrice) : undefined,
          finalQuantity: finalQuantity ? parseInt(finalQuantity) : undefined,
        },
      });
    } else {
      transaction = await prisma.transaction.create({
        data: {
          conversationId,
          listingId,
          sellerId,
          buyerId,
          categoryId,
          finalPrice: parseFloat(finalPrice),
          finalQuantity: parseInt(finalQuantity),
          unit: unit || "kg",
          status,
          completedAt: status === "selesai" ? new Date() : null,
        },
      });
    }

    // Update listing status accordingly
    if (transaction.listingId) {
      if (status === "selesai") {
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: "terjual" },
        });
      } else if (status === "dibatalkan") {
        await prisma.listing.update({
          where: { id: transaction.listingId },
          data: { status: "aktif" },
        });
      }
    }

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

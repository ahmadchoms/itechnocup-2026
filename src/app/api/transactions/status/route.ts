import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { chatService } from "@/services/chatService";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      conversationId,
      listingId,
      sellerId,
      buyerId,
      categoryId,
      finalPrice,
      finalQuantity,
      unit,
      status,
      transactionId,
    } = await request.json();

    const transaction = await chatService.updateDealStatus(sessionUser.id, {
      transactionId,
      conversationId,
      listingId,
      sellerId,
      buyerId,
      categoryId,
      finalPrice: Number(finalPrice) || 0,
      finalQuantity: Number(finalQuantity) || 0,
      unit: unit || "kg",
      status,
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    const status = error.message?.includes("Akses ditolak") ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

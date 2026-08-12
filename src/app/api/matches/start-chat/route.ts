import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, listingId, requestId, sellerId: inputSellerId, buyerId: inputBuyerId } = body;

    const sessionUser = await getSessionUser();

    let sellerId = inputSellerId;
    let buyerId = inputBuyerId;

    // If listingId provided, find listing seller
    let itemTitle = "Sampah/Limbah";
    if (listingId) {
      const l = await prisma.listing.findUnique({ where: { id: listingId } });
      if (l) {
        sellerId = l.sellerId;
        itemTitle = l.title;
      }
    }

    // If requestId provided, find request buyer
    if (requestId) {
      const r = await prisma.wasteRequest.findUnique({ where: { id: requestId } });
      if (r) {
        buyerId = r.buyerId;
        itemTitle = r.title;
      }
    }

    // Assign current user if seller or buyer missing
    if (!buyerId && sessionUser) {
      buyerId = sessionUser.id;
    }
    if (!sellerId && sessionUser) {
      sellerId = sessionUser.id;
    }

    // Fallbacks if still missing
    if (!sellerId) {
      const defaultSeller = await prisma.user.findFirst({ where: { email: "ahmad@daurnusa.id" } });
      sellerId = defaultSeller?.id || (await prisma.user.findFirst())?.id;
    }
    if (!buyerId) {
      const defaultBuyer = await prisma.user.findFirst({ where: { email: "paktani.ungaran@gmail.com" } });
      buyerId = defaultBuyer?.id || (await prisma.user.findFirst())?.id;
    }

    // Find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        sellerId,
        buyerId,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          matchId: matchId || null,
          sellerId: sellerId!,
          buyerId: buyerId!,
        },
      });

      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: buyerId!,
          content: `Halo, saya berminat dengan item ${itemTitle}. Mari kita diskusikan kesepakatan harga dan COD.`,
        },
      });
    }

    return NextResponse.json({ conversationId: conversation.id });
  } catch (error: any) {
    console.error("[start-chat] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

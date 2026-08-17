import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, buyerId, listingId, requestId, initialMessage } = body;

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!sellerId || !buyerId) {
       return NextResponse.json({ error: "Missing sellerId or buyerId" }, { status: 400 });
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
          sellerId: sellerId,
          buyerId: buyerId,
        },
      });
    }

    // Always create the initial message from the session user to start the chat if provided
    if (initialMessage) {
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: sessionUser.id,
                content: initialMessage,
            },
        });
    }

    return NextResponse.json({ success: true, conversationId: conversation.id });
  } catch (error: any) {
    console.error("[start-chat] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
